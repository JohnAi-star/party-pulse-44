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

    // 3. Check if user profile exists, create if not
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (!profile) {
      // Create basic profile if doesn't exist
      const { error: createProfileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          name: 'Anonymous User',
          avatar_url: null,
          created_at: new Date().toISOString()
        });

      if (createProfileError) {
        console.error('Profile creation error:', createProfileError);
        return NextResponse.json(
          { 
            error: 'Profile creation failed', 
            code: 'PROFILE_CREATION_FAILED',
            message: 'Failed to create user profile'
          },
          { status: 500 }
        );
      }
    }

    // 4. Create the review
    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .insert({
        activity_id: body.activityId,
        user_id: userId,
        rating: body.rating,
        title: body.title?.trim(),
        comment: body.content?.trim(),
        status: 'pending'
      })
      .select()
      .single();

    if (reviewError) {
      console.error('Review creation error:', reviewError);
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

    // 5. Success response
    return NextResponse.json({
      success: true,
      data: review
    }, { status: 201 });

  } catch (error: any) {
    console.error('API Route Error:', error);
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