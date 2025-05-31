import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { userId } = auth();

  // Enhanced error logging
  console.log('Review submission started for user:', userId);

  try {
    // 1. Authentication check
    if (!userId) {
      console.log('Unauthorized request - no userId');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // 2. Parse request body with validation
    let body;
    try {
      body = await req.json();
      console.log('Received request body:', body);
      
      if (!body.activityId) {
        throw new Error('Activity ID is required');
      }
      if (typeof body.rating !== 'number' || body.rating < 1 || body.rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }
    } catch (parseError) {
      console.error('Request parsing error:', parseError);
      return NextResponse.json(
        { error: parseError instanceof Error ? parseError.message : 'Invalid request body' },
        { status: 400 }
      );
    }

    // 3. Create review (simplified - no profile check)
    console.log('Creating review for activity:', body.activityId);
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
      .select()
      .single();

    if (reviewError) {
      console.error('Supabase review creation error:', {
        code: reviewError.code,
        message: reviewError.message,
        details: reviewError.details
      });
      
      // Handle specific Supabase errors
      if (reviewError.code === '23503') { // Foreign key violation
        return NextResponse.json(
          { error: 'Activity not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to create review' },
        { status: 500 }
      );
    }

    console.log('Review created successfully:', review.id);
    return NextResponse.json({ review }, { status: 201 });

  } catch (error) {
    console.error('Unexpected API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}