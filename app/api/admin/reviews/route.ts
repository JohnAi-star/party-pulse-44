import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { userId } = auth();

  console.log('Starting review submission for user:', userId); // Debug log

  if (!userId) {
    console.log('Unauthorized request - no userId');
    return NextResponse.json(
      { error: 'Authentication required', code: 'UNAUTHORIZED' },
      { status: 401 }
    );
  }

  try {
    // Parse request body
    let body;
    try {
      body = await req.json();
      console.log('Received body:', JSON.stringify(body)); // Debug log
    } catch (e) {
      console.error('JSON parse error:', e);
      return NextResponse.json(
        { error: 'Invalid JSON', code: 'INVALID_JSON' },
        { status: 400 }
      );
    }

    // Validate required fields
    const validationErrors = [];
    if (!body?.activityId) validationErrors.push('activityId is required');
    if (!body?.rating || body.rating < 1 || body.rating > 5) validationErrors.push('rating must be 1-5');
    if (!body?.title || body.title.trim().length < 5) validationErrors.push('title must be ≥5 characters');
    if (!body?.content || body.content.trim().length < 20) validationErrors.push('content must be ≥20 characters');

    if (validationErrors.length > 0) {
      console.log('Validation errors:', validationErrors);
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors, code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // Check if user exists in profiles table
    console.log('Checking profile for user:', userId);
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (profileError) {
      console.error('Profile lookup error:', profileError);
      throw profileError;
    }

    if (!profile) {
      console.log('Creating new profile for user:', userId);
      const { error: createError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          name: 'Anonymous',
          created_at: new Date().toISOString()
        });

      if (createError) {
        console.error('Profile creation failed:', createError);
        throw new Error('Failed to create user profile: ' + createError.message);
      }
    }

    // Prepare review data
    const reviewData = {
      activity_id: body.activityId,
      user_id: userId,
      rating: body.rating,
      title: body.title.trim(),
      comment: body.content.trim(),
      status: 'pending'
    };

    console.log('Inserting review:', reviewData);
    const { data: review, error: insertError } = await supabase
      .from('reviews')
      .insert(reviewData)
      .select()
      .single();

    if (insertError) {
      console.error('Review insertion failed:', insertError);
      throw new Error('Failed to create review: ' + insertError.message);
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
    console.error('API Route Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        message: error.message,
        code: 'SERVER_ERROR',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}