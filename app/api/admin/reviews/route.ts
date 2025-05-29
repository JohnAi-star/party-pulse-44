import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { userId } = auth();

  // 1. Basic Setup and Auth Check
  if (!userId) {
    return NextResponse.json(
      { error: 'Authentication required', code: 'UNAUTHORIZED' },
      { status: 401 }
    );
  }

  try {
    // 2. Parse and Validate Request
    const body = await req.json();
    
    if (!body.activityId || typeof body.activityId !== 'string') {
      return NextResponse.json(
        { error: 'Valid activityId is required', code: 'INVALID_ACTIVITY_ID' },
        { status: 400 }
      );
    }

    // 3. Verify Activity Exists
    const { data: activity, error: activityError } = await supabase
      .from('activities')
      .select('id')
      .eq('id', body.activityId)
      .single();

    if (activityError || !activity) {
      return NextResponse.json(
        { error: 'Activity not found', code: 'ACTIVITY_NOT_FOUND' },
        { status: 404 }
      );
    }

    // 4. Handle User Profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(
        { id: userId },
        { onConflict: 'id' }
      );

    if (profileError) {
      console.error('Profile error:', profileError);
      throw profileError;
    }

    // 5. Create Review
    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .insert({
        activity_id: body.activityId,
        user_id: userId,
        rating: body.rating || 3, // Default if not provided
        title: body.title || 'My Review', // Default if not provided
        comment: body.content || 'No content provided', // Default if not provided
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
        created_at
      `)
      .single();

    if (reviewError) {
      console.error('Review creation error:', reviewError);
      throw reviewError;
    }

    // 6. Success Response
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
    // 7. Comprehensive Error Handling
    console.error('API Error:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
      stack: error.stack
    });

    return NextResponse.json(
      {
        error: 'Internal Server Error',
        code: 'SERVER_ERROR',
        message: error.message,
        ...(process.env.NODE_ENV === 'development' && {
          details: error.details,
          hint: error.hint
        })
      },
      { status: 500 }
    );
  }
}