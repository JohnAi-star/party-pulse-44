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
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    // 2. Parse request body
    const body = await req.json();
    
    // 3. Validate required fields
    if (body.activityId === undefined || body.activityId === null) {
      return NextResponse.json(
        { error: 'Activity ID is required', code: 'MISSING_ACTIVITY_ID' },
        { status: 400 }
      );
    }

    // Convert ID to string if it's a number
    const activityId = typeof body.activityId === 'number' 
      ? body.activityId.toString()
      : body.activityId;

    // 4. Validate other fields
    if (typeof body.rating !== 'number' || body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5', code: 'INVALID_RATING' },
        { status: 400 }
      );
    }

    if (!body.title || body.title.trim().length < 5) {
      return NextResponse.json(
        { error: 'Title must be at least 5 characters', code: 'INVALID_TITLE' },
        { status: 400 }
      );
    }

    if (!body.content || body.content.trim().length < 20) {
      return NextResponse.json(
        { error: 'Review content must be at least 20 characters', code: 'INVALID_CONTENT' },
        { status: 400 }
      );
    }

    // 5. Create review
    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .insert([{
        activity_id: activityId,
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

    // 6. Handle database errors
    if (reviewError) {
      console.error('Database Error:', {
        code: reviewError.code,
        message: reviewError.message,
        details: reviewError.details
      });

      if (reviewError.code === '23503') {
        return NextResponse.json(
          { error: 'Activity not found', code: 'ACTIVITY_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          error: 'Database operation failed',
          code: 'DATABASE_ERROR',
          message: reviewError.message,
          details: reviewError.details
        },
        { status: 500 }
      );
    }

    if (!review) {
      return NextResponse.json(
        {
          error: 'Review not created',
          code: 'REVIEW_NOT_CREATED'
        },
        { status: 500 }
      );
    }

    // 7. Success response
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
    });

  } catch (error: any) {
    console.error('API Route Error:', {
      message: error.message,
      stack: error.stack
    });

    return NextResponse.json(
      {
        error: 'Internal Server Error',
        code: 'SERVER_ERROR',
        message: error.message,
        ...(process.env.NODE_ENV === 'development' && {
          stack: error.stack
        })
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
      })) || []
    });

  } catch (error: any) {
    console.error('Fetch Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews', code: 'FETCH_ERROR' },
      { status: 500 }
    );
  }
}