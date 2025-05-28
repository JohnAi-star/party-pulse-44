import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { userId } = auth();
  const supabase = createRouteHandlerClient({ cookies });

  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized - Please sign in' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    
    // Validate required fields
    if (!body.activityId) {
      return NextResponse.json(
        { error: 'Activity ID is required' },
        { status: 400 }
      );
    }

    if (!body.rating || body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { error: 'Valid rating (1-5) is required' },
        { status: 400 }
      );
    }

    if (!body.title || body.title.length < 5) {
      return NextResponse.json(
        { error: 'Title must be at least 5 characters' },
        { status: 400 }
      );
    }

    if (!body.content || body.content.length < 20) {
      return NextResponse.json(
        { error: 'Review must be at least 20 characters' },
        { status: 400 }
      );
    }

    // Check for existing review
    const { data: existingReview, error: existingError } = await supabase
      .from('reviews')
      .select('id')
      .eq('activity_id', body.activityId)
      .eq('user_id', userId)
      .maybeSingle();

    if (existingError) throw existingError;
    if (existingReview) {
      return NextResponse.json(
        { 
          error: 'Duplicate review',
          message: 'You have already reviewed this activity',
          reviewId: existingReview.id
        },
        { status: 409 }
      );
    }

    // Create new review
    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        activity_id: body.activityId,
        user_id: userId,
        rating: body.rating,
        title: body.title,
        content: body.content,
        status: 'pending'
      })
      .select(`
        id,
        rating,
        title,
        content,
        status,
        created_at,
        user:profiles(
          id,
          name,
          avatar_url
        )
      `)
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      review,
      message: 'Review submitted for approval'
    });

  } catch (error) {
    console.error('[REVIEW_SUBMISSION_ERROR]', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        message: 'Failed to process review submission'
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
        rating,
        title,
        content,
        status,
        created_at,
        helpful,
        user:profiles(
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

    const { data: reviews, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      count: reviews.length,
      reviews
    });

  } catch (error) {
    console.error('[REVIEW_FETCH_ERROR]', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        message: 'Failed to fetch reviews'
      },
      { status: 500 }
    );
  }
}