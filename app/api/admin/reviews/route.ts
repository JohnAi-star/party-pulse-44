import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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
    
    // 3. Validate activityId format
    if (!body?.activityId || typeof body.activityId !== 'string' || !UUID_REGEX.test(body.activityId)) {
      return NextResponse.json(
        { 
          error: 'Invalid activity ID format',
          code: 'INVALID_UUID_FORMAT',
          message: 'Activity ID must be a valid UUID v4 format'
        },
        { status: 400 }
      );
    }

    // 4. Validate rating
    if (typeof body.rating !== 'number' || body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5', code: 'INVALID_RATING' },
        { status: 400 }
      );
    }

    // 5. Create review
    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .insert({
        activity_id: body.activityId,
        user_id: userId,
        rating: body.rating,
        title: body.title?.trim() || 'My Review',
        comment: body.content?.trim() || 'No content provided',
        status: 'pending'
      })
      .select()
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
          message: reviewError.message
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