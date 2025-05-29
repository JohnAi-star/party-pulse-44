import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { userId } = auth();

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
    if (!body.activityId || typeof body.activityId !== 'string') {
      return NextResponse.json(
        {
          error: 'Activity ID is required',
          code: 'MISSING_ACTIVITY_ID',
          message: 'A valid activity ID must be provided'
        },
        { status: 400 }
      );
    }

    if (typeof body.rating !== 'number' || body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        {
          error: 'Invalid rating',
          code: 'INVALID_RATING',
          message: 'Rating must be a number between 1 and 5'
        },
        { status: 400 }
      );
    }

    if (!body.title || typeof body.title !== 'string' || body.title.trim().length < 5) {
      return NextResponse.json(
        {
          error: 'Invalid title',
          code: 'INVALID_TITLE',
          message: 'Title must be at least 5 characters long'
        },
        { status: 400 }
      );
    }

    if (!body.content || typeof body.content !== 'string' || body.content.trim().length < 20) {
      return NextResponse.json(
        {
          error: 'Invalid content',
          code: 'INVALID_CONTENT',
          message: 'Review content must be at least 20 characters long'
        },
        { status: 400 }
      );
    }

    // Get the corresponding Supabase user ID from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('clerk_id', userId)
      .single();

    if (profileError || !profile?.id) {
      console.error('Profile lookup error:', profileError);
      return NextResponse.json(
        {
          error: 'User profile not found',
          code: 'PROFILE_NOT_FOUND',
          message: 'Could not find user profile information'
        },
        { status: 404 }
      );
    }

    // Insert the review into the database
    const { data: review, error: insertError } = await supabase
      .from('reviews')
      .insert({
        activity_id: body.activityId,
        user_id: profile.id,
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
      return NextResponse.json(
        {
          error: 'Database error',
          code: 'DATABASE_ERROR',
          message: insertError.message
        },
        { status: 500 }
      );
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
    console.error('Unexpected error:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        code: 'INTERNAL_ERROR',
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
    const activityId = searchParams.get('activityId');
    const status = searchParams.get('status') || 'approved';
    const limit = parseInt(searchParams.get('limit') || '10');

    // Validate limit parameter
    if (isNaN(limit)) {
      return NextResponse.json(
        {
          error: 'Invalid limit parameter',
          code: 'INVALID_LIMIT',
          message: 'Limit must be a valid number'
        },
        { status: 400 }
      );
    }

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
        )
      `)
      .order('created_at', { ascending: false });

    if (activityId) query = query.eq('activity_id', activityId);
    if (status) query = query.eq('status', status);
    if (limit) query = query.limit(limit);

    const { data: reviews, error } = await query;

    if (error) {
      console.error('Database query error:', error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: reviews.map(review => ({
        id: review.id,
        activityId: review.activity_id,
        userId: review.user_id,
        rating: review.rating,
        title: review.title,
        content: review.comment,
        status: review.status,
        createdAt: review.created_at,
        user: review.profiles
      }))
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