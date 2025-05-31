import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  // Initialize Supabase client
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  
  // Get authenticated user
  const { userId } = auth();
  
  console.log('Starting review submission for user:', userId);

  try {
    // Validate authentication
    if (!userId) {
      console.error('Unauthorized request - no user ID');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    let requestBody;
    try {
      requestBody = await req.json();
      console.log('Received request body:', requestBody);
      
      if (!requestBody.activityId) {
        throw new Error('Missing activityId');
      }
      if (typeof requestBody.rating !== 'number' || requestBody.rating < 1 || requestBody.rating > 5) {
        throw new Error('Invalid rating value');
      }
    } catch (parseError) {
      console.error('Request parsing error:', parseError);
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    // Create review in database
    console.log('Attempting to create review...');
    const { data: review, error: dbError } = await supabase
      .from('reviews')
      .insert({
        activity_id: requestBody.activityId,
        user_id: userId,
        rating: requestBody.rating,
        title: requestBody.title?.trim() || '',
        content: requestBody.content?.trim() || '',
        status: 'pending'
      })
      .select()
      .single();

    // Handle database errors
    if (dbError) {
      console.error('Database error:', {
        code: dbError.code,
        message: dbError.message,
        details: dbError.details
      });
      
      // Specific error for missing activity
      if (dbError.code === '23503') {
        return NextResponse.json(
          { error: 'Activity not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { 
          error: 'Database operation failed',
          details: process.env.NODE_ENV === 'development' ? dbError.details : undefined
        },
        { status: 500 }
      );
    }

    console.log('Successfully created review:', review.id);
    return NextResponse.json({ review }, { status: 201 });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}