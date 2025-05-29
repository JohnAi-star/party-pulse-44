import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  console.log('Review submission initiated');
  const supabase = createRouteHandlerClient({ cookies });
  const { userId } = auth();

  if (!userId) {
    console.log('Unauthorized request - no userId');
    return NextResponse.json(
      { error: 'Authentication required', code: 'UNAUTHORIZED' },
      { status: 401 }
    );
  }

  try {
    console.log('Parsing request body');
    const body = await req.json();
    console.log('Request body:', JSON.stringify(body));

    // Basic validation
    if (!body?.activityId || typeof body.activityId !== 'string') {
      console.log('Invalid activityId:', body?.activityId);
      return NextResponse.json(
        { error: 'Valid activityId is required', code: 'INVALID_ACTIVITY_ID' },
        { status: 400 }
      );
    }

    console.log('Attempting to create review for activity:', body.activityId);
    
    // Create review with error handling
    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .insert({
        activity_id: body.activityId,
        user_id: userId,
        rating: body.rating || 3,
        title: body.title || 'My Review',
        comment: body.content || 'No content provided',
        status: 'pending'
      })
      .select()
      .single();

    if (reviewError) {
      console.error('Supabase error:', {
        code: reviewError.code,
        message: reviewError.message,
        details: reviewError.details,
        hint: reviewError.hint
      });

      // Handle specific error cases
      if (reviewError.code === '23503') {
        return NextResponse.json(
          { error: 'Activity or user not found', code: 'RELATION_NOT_FOUND' },
          { status: 404 }
        );
      }

      if (reviewError.code === '23502') {
        return NextResponse.json(
          { error: 'Missing required field', code: 'MISSING_REQUIRED_FIELD' },
          { status: 400 }
        );
      }

      throw reviewError;
    }

    console.log('Review created successfully:', review.id);
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
    console.error('API Error:', {
      message: error.message,
      stack: error.stack,
      ...(error.code && { code: error.code }),
      ...(error.details && { details: error.details })
    });

    return NextResponse.json(
      {
        error: 'Internal Server Error',
        code: 'SERVER_ERROR',
        message: error.message,
        ...(process.env.NODE_ENV === 'development' && {
          details: error.details,
          stack: error.stack
        })
      },
      { status: 500 }
    );
  }
}