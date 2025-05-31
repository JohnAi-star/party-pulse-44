import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const { userId } = auth();

  try {
    // Validate authentication
    if (!userId) {
      console.log('Authentication failed - no userId');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse and validate request
    const body = await req.json();
    console.log('Received review submission:', JSON.stringify(body, null, 2));
    
    // Validate required fields
    const validationErrors = [];
    if (!body.activityId) validationErrors.push('Activity ID is required');
    if (typeof body.rating !== 'number' || body.rating < 1 || body.rating > 5) {
      validationErrors.push('Rating must be between 1 and 5');
    }
    if (!body.title?.trim()) validationErrors.push('Title is required');
    if (!body.content?.trim()) validationErrors.push('Content is required');

    if (validationErrors.length > 0) {
      console.log('Validation failed:', validationErrors);
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationErrors 
        },
        { status: 400 }
      );
    }

    // Prepare review data
    const reviewData = {
      activity_id: body.activityId,
      user_id: userId,
      rating: body.rating,
      title: body.title.trim(),
      content: body.content.trim(),
      status: 'pending'
    };

    console.log('Creating review with data:', reviewData);

    // Create review with explicit error handling
    const { data, error } = await supabase
      .from('reviews')
      .insert(reviewData)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      
      return NextResponse.json(
        { 
          error: 'Database operation failed',
          details: error.message,
          code: error.code,
          ...(process.env.NODE_ENV === 'development' && {
            hint: error.hint,
            details: error.details
          })
        },
        { status: 500 }
      );
    }

    console.log('Review created successfully:', data);
    return NextResponse.json({ 
      success: true,
      review: data 
    }, { status: 201 });

  } catch (error: any) {
    console.error('Unexpected server error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && {
          message: error.message,
          stack: error.stack
        })
      },
      { status: 500 }
    );
  }
}