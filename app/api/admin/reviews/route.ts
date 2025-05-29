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
    
    // Validate request body
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body', code: 'INVALID_BODY' },
        { status: 400 }
      );
    }

    // Field validations
    const validations = {
      activityId: {
        valid: typeof body.activityId === 'string' && body.activityId.trim().length > 0,
        error: { error: 'Invalid Activity ID', code: 'INVALID_ACTIVITY_ID' }
      },
      rating: {
        valid: typeof body.rating === 'number' && body.rating >= 1 && body.rating <= 5,
        error: { error: 'Rating must be 1-5', code: 'INVALID_RATING' }
      },
      title: {
        valid: typeof body.title === 'string' && body.title.trim().length >= 5,
        error: { error: 'Title must be ≥5 chars', code: 'INVALID_TITLE' }
      },
      content: {
        valid: typeof body.content === 'string' && body.content.trim().length >= 20,
        error: { error: 'Content must be ≥20 chars', code: 'INVALID_CONTENT' }
      }
    };

    for (const [field, {valid, error}] of Object.entries(validations)) {
      if (!valid) return NextResponse.json(error, { status: 400 });
    }

    // Prepare profile data
    const profileData = {
      id: userId, // Using Clerk userId as primary key
      name: sessionClaims?.firstName || 'Anonymous',
      email: sessionClaims?.email || null,
      avatar_url: sessionClaims?.imageUrl || null,
      updated_at: new Date().toISOString()
    };

    // Upsert user profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(profileData, { onConflict: 'id' });

    if (profileError) throw profileError;

    // Insert review
    const { data: review, error: insertError } = await supabase
      .from('reviews')
      .insert({
        activity_id: body.activityId,
        user_id: userId, // Directly using Clerk userId
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

    if (insertError) throw insertError;

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
    console.error('Review submission error:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        code: 'SERVER_ERROR',
        message: error.message
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
    const limit = Math.min(parseInt(searchParams.get('limit') || '10', 100));
    const page = Math.max(parseInt(searchParams.get('page') || '1'), 1);

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
    query = query.range((page - 1) * limit, page * limit - 1);

    const { data: reviews, error, count } = await query;

    if (error) throw error;

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
      { error: 'Failed to fetch reviews', code: 'FETCH_ERROR' },
      { status: 500 }
    );
  }
}