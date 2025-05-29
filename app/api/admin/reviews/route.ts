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
      { error: 'Authentication required', code: 'UNAUTHORIZED' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    
    // Basic validation
    if (!body?.activityId || typeof body.activityId !== 'string') {
      return NextResponse.json(
        { error: 'Valid activityId is required', code: 'INVALID_ACTIVITY_ID' },
        { status: 400 }
      );
    }

    // Create review directly (let DB handle constraints)
    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .insert({
        activity_id: body.activityId,
        user_id: userId,
        rating: body.rating || 3, // Default value
        title: body.title || 'My Review', // Default value
        comment: body.content || 'No content provided', // Default value
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
      // Handle specific foreign key violation
      if (reviewError.code === '23503') {
        return NextResponse.json(
          { error: 'Activity not found', code: 'ACTIVITY_NOT_FOUND' },
          { status: 404 }
        );
      }
      throw reviewError;
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
        createdAt: review.created_at
      }
    });

  } catch (error: any) {
    console.error('API Error:', error.message);
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