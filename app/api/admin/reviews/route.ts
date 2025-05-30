import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { userId } = auth();

  try {
    // 1. Authentication check
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

    // 2. Parse and validate request body
    const body = await req.json();
    
    if (!body.activityId) {
      return NextResponse.json(
        { 
          error: 'Activity ID is required', 
          code: 'MISSING_ACTIVITY_ID',
          message: 'No activity specified for this review'
        },
        { status: 400 }
      );
    }

    if (typeof body.rating !== 'number' || body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { 
          error: 'Invalid rating value', 
          code: 'INVALID_RATING',
          message: 'Rating must be between 1 and 5 stars'
        },
        { status: 400 }
      );
    }

    if (!body.title || body.title.trim().length < 5) {
      return NextResponse.json(
        { 
          error: 'Title too short', 
          code: 'INVALID_TITLE',
          message: 'Review title must be at least 5 characters'
        },
        { status: 400 }
      );
    }

    if (!body.content || body.content.trim().length < 20) {
      return NextResponse.json(
        { 
          error: 'Review content too short', 
          code: 'INVALID_CONTENT',
          message: 'Review must be at least 20 characters'
        },
        { status: 400 }
      );
    }

    // 3. Verify referenced entities exist
    // Check user profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { 
          error: 'User profile not found', 
          code: 'PROFILE_NOT_FOUND',
          message: 'Please complete your profile before submitting reviews'
        },
        { status: 404 }
      );
    }

    // Check activity exists
    const { data: activity, error: activityError } = await supabase
      .from('activities')
      .select('id')
      .eq('id', body.activityId)
      .single();

    if (activityError || !activity) {
      return NextResponse.json(
        { 
          error: 'Activity not found', 
          code: 'ACTIVITY_NOT_FOUND',
          message: 'The activity you\'re reviewing doesn\'t exist'
        },
        { status: 404 }
      );
    }

    // 4. Create the review
    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .insert([{
        activity_id: body.activityId,
        user_id: userId,
        rating: body.rating,
        title: body.title.trim(),
        comment: body.content.trim(),
        status: 'pending'
      }])
      .select(`
        id,
        activity_id,
        user_id,
        rating,
        title,
        comment,
        status,
        created_at
      `)
      .single();

    if (reviewError) {
      console.error('Database Insert Error:', {
        code: reviewError.code,
        message: reviewError.message,
        details: reviewError.details,
        hint: reviewError.hint
      });

      return NextResponse.json(
        {
          error: 'Database operation failed',
          code: 'DATABASE_ERROR',
          message: 'Failed to save your review',
          details: process.env.NODE_ENV === 'development' ? reviewError.details : undefined
        },
        { status: 500 }
      );
    }

    if (!review) {
      return NextResponse.json(
        {
          error: 'Review not created',
          code: 'REVIEW_NOT_CREATED',
          message: 'Your review couldn\'t be created'
        },
        { status: 500 }
      );
    }

    // 5. Success response
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
        createdAt: review.created_at
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('API Route Error:', {
      message: error.message,
      stack: error.stack
    });

    return NextResponse.json(
      {
        error: 'Internal Server Error',
        code: 'SERVER_ERROR',
        message: 'An unexpected error occurred'
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

    // Base query
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

    // Apply filters
    if (activityId) query = query.eq('activity_id', activityId);
    if (status) query = query.eq('status', status);
    if (limit) query = query.limit(limit);

    // Execute query
    const { data: reviews, error } = await query;

    if (error) {
      console.error('Database Query Error:', error);
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
      })) || []
    });

  } catch (error: any) {
    console.error('Fetch Reviews Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch reviews', 
        code: 'FETCH_ERROR',
        message: 'Could not retrieve reviews'
      },
      { status: 500 }
    );
  }
}