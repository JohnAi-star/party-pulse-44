import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { userId, sessionClaims } = auth();

  if (!userId) {
    return NextResponse.json(
      { 
        error: 'Authentication required',
        code: 'UNAUTHORIZED',
        message: 'You must be signed in to submit a review'
      },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    
    // Validate request body structure
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { 
          error: 'Invalid request body',
          code: 'INVALID_BODY',
          message: 'Request body must be a valid JSON object'
        },
        { status: 400 }
      );
    }

    // Validate required fields with proper type checking
    const requiredFields = [
      { field: 'activityId', type: 'string', minLength: 1, message: 'Activity ID is required' },
      { field: 'rating', type: 'number', min: 1, max: 5, message: 'Rating must be between 1-5' },
      { field: 'title', type: 'string', minLength: 5, message: 'Title must be at least 5 characters' },
      { field: 'content', type: 'string', minLength: 20, message: 'Review content must be at least 20 characters' }
    ];

    for (const { field, type, minLength, min, max, message } of requiredFields) {
      if (!(field in body)) {
        return NextResponse.json(
          { error: 'Missing field', code: `MISSING_${field.toUpperCase()}`, message: `${field} is required` },
          { status: 400 }
        );
      }

      if (typeof body[field] !== type) {
        return NextResponse.json(
          { error: 'Invalid type', code: `INVALID_${field.toUpperCase()}_TYPE`, message: `${field} must be a ${type}` },
          { status: 400 }
        );
      }

      if (minLength !== undefined && body[field].trim().length < minLength) {
        return NextResponse.json(
          { error: message, code: `${field.toUpperCase()}_TOO_SHORT`, message },
          { status: 400 }
        );
      }

      if (min !== undefined && body[field] < min) {
        return NextResponse.json(
          { error: message, code: `${field.toUpperCase()}_TOO_LOW`, message },
          { status: 400 }
        );
      }

      if (max !== undefined && body[field] > max) {
        return NextResponse.json(
          { error: message, code: `${field.toUpperCase()}_TOO_HIGH`, message },
          { status: 400 }
        );
      }
    }

    // Get or create user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('clerk_id', userId)
      .maybeSingle();

    if (profileError) {
      console.error('Profile lookup error:', profileError);
      throw profileError;
    }

    let userProfile = profile;
    if (!userProfile) {
      // Create new profile with Clerk user data
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          clerk_id: userId,
          name: sessionClaims?.firstName || 'Anonymous',
          email: sessionClaims?.email || null,
          avatar_url: sessionClaims?.imageUrl || null
        })
        .select('id')
        .single();

      if (createError) {
        console.error('Profile creation error:', createError);
        throw createError;
      }
      userProfile = newProfile;
    }

    // Insert review
    const { data: review, error: insertError } = await supabase
      .from('reviews')
      .insert({
        activity_id: body.activityId,
        user_id: userProfile.id,
        rating: body.rating,
        title: body.title.trim(),
        comment: body.content.trim(),
        status: 'pending'
      })
      .select(`
        id,
        activity_id,
        user_id,
        rating,
        title,
        comment,
        status,
        created_at,
        profiles:user_id(
          id,
          name,
          avatar_url
        )
      `)
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw insertError;
    }

    return NextResponse.json({
      success: true,
      data: {
        id: review.id,
        activityId: review.activity_id,
        userId: review.user_id,
        rating: review.rating,
        title: review.title,
        content: review.comment,
        status: review.status,
        createdAt: review.created_at,
        user: review.profiles
      }
    });

  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        code: 'SERVER_ERROR',
        message: error.message || 'An unexpected error occurred'
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(req.url);

  try {
    // Validate and parse query parameters
    const activityId = searchParams.get('activityId');
    const status = searchParams.get('status') || 'approved';
    const limit = Math.min(parseInt(searchParams.get('limit') || '10', 100));
    const page = Math.max(parseInt(searchParams.get('page') || '1', 1));

    // Build query
    let query = supabase
      .from('reviews')
      .select(`
        id,
        activity_id,
        user_id,
        rating,
        title,
        comment,
        status,
        created_at,
        profiles:user_id(
          id,
          name,
          avatar_url
        ),
        count
      `, { count: 'exact' })
      .order('created_at', { ascending: false });

    if (activityId) query = query.eq('activity_id', activityId);
    if (status) query = query.eq('status', status);
    if (limit) query = query.range((page - 1) * limit, page * limit - 1);

    const { data: reviews, error, count } = await query;

    if (error) {
      console.error('Database query error:', error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: reviews?.map(review => ({
        id: review.id,
        activityId: review.activity_id,
        userId: review.user_id,
        rating: review.rating,
        title: review.title,
        content: review.comment,
        status: review.status,
        createdAt: review.created_at,
        user: review.profiles
      })) || [],
      pagination: {
        total: count || 0,
        page,
        pageSize: limit,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error: any) {
    console.error('Review fetch error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch reviews',
        code: 'FETCH_ERROR',
        message: error.message || 'Error while fetching reviews'
      },
      { status: 500 }
    );
  }
}