import { auth, clerkClient } from "@clerk/nextjs/server";
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
          error: 'Invalid rating', 
          code: 'INVALID_RATING',
          message: 'Rating must be between 1 and 5'
        },
        { status: 400 }
      );
    }

    // 3. Get or create user profile
    let profile;
    try {
      // First try to get the user from Clerk
      const clerkUser = await clerkClient.users.getUser(userId);
      
      // Check if profile exists in Supabase
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (!existingProfile) {
        // Create new profile with data from Clerk
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .upsert({
            id: userId,
            email: clerkUser.emailAddresses[0]?.emailAddress || '',
            name: clerkUser.firstName || clerkUser.username || 'Anonymous User',
            avatar_url: clerkUser.imageUrl,
            role: 'user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (createError) throw createError;
        profile = newProfile;
      } else {
        profile = existingProfile;
      }
    } catch (profileError) {
      console.error('Profile error:', profileError);
      return NextResponse.json(
        { 
          error: 'Profile setup failed', 
          code: 'PROFILE_ERROR',
          message: 'Failed to setup user profile',
          details: process.env.NODE_ENV === 'development' ? profileError : undefined
        },
        { status: 500 }
      );
    }

    // 4. Verify activity exists
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

    // 5. Create the review
    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .insert({
        activity_id: body.activityId,
        user_id: userId,
        rating: body.rating,
        title: body.title?.trim() || '',
        content: body.content?.trim() || '',
        status: 'pending'
      })
      .select(`
        id,
        activity_id,
        user_id,
        rating,
        title,
        content,
        status,
        created_at,
        profiles:user_id(
          id,
          name,
          avatar_url
        )
      `)
      .single();

    if (reviewError) {
      console.error('Review creation failed:', reviewError);
      return NextResponse.json(
        {
          error: 'Failed to create review',
          code: 'REVIEW_CREATION_FAILED',
          message: 'Could not save your review',
          details: process.env.NODE_ENV === 'development' ? reviewError.details : undefined
        },
        { status: 500 }
      );
    }

    // 6. Success response
    return NextResponse.json({
      success: true,
      data: {
        ...review,
        user: review.profiles // Flatten the profile data
      }
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
        content,
        status,
        created_at,
        profiles:user_id(
          id,
          name,
          avatar_url
        ),
        activities:activity_id(
          id,
          title
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
        activity: review.activities,
        userId: review.user_id,
        rating: review.rating,
        title: review.title,
        content: review.content,
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