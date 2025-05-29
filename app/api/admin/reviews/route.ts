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
    // Parse and validate request body
    let body;
    try {
      body = await req.json();
      if (!body || typeof body !== 'object') {
        throw new Error('Invalid request body');
      }
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid JSON', code: 'INVALID_JSON' },
        { status: 400 }
      );
    }

    // Field validations
    const validationErrors = [];
    if (!body.activityId || typeof body.activityId !== 'string') {
      validationErrors.push('Missing or invalid activityId');
    }
    if (typeof body.rating !== 'number' || body.rating < 1 || body.rating > 5) {
      validationErrors.push('Rating must be between 1-5');
    }
    if (!body.title || typeof body.title !== 'string' || body.title.trim().length < 5) {
      validationErrors.push('Title must be at least 5 characters');
    }
    if (!body.content || typeof body.content !== 'string' || body.content.trim().length < 20) {
      validationErrors.push('Content must be at least 20 characters');
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: validationErrors
        },
        { status: 400 }
      );
    }

    // Prepare profile data
    const profileData = {
      id: userId,
      name: sessionClaims?.firstName || 'Anonymous',
      email: sessionClaims?.email || null,
      avatar_url: sessionClaims?.imageUrl || null,
      updated_at: new Date().toISOString()
    };

    // Upsert profile (create or update if exists)
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(profileData)
      .eq('id', userId);

    if (profileError) {
      console.error('Profile upsert error:', profileError);
      throw new Error('Failed to create/update user profile');
    }

    // Insert review
    const { data: review, error: insertError } = await supabase
      .from('reviews')
      .insert({
        activity_id: body.activityId,
        user_id: userId,
        rating: body.rating,
        title: body.title.trim(),
        comment: body.content.trim(),
        status: 'pending'
      })
      .select('*')
      .single();

    if (insertError) {
      console.error('Review insert error:', insertError);
      throw new Error('Failed to create review');
    }

    // Successful response
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
    console.error('API Route Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        code: 'SERVER_ERROR',
        message: error.message || 'An unexpected error occurred',
        // Include stack trace in development only
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      },
      { status: 500 }
    );
  }
}