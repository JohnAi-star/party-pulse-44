// app/api/admin/reviews/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  // Initialize Supabase client
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  try {
    // 1. Authentication Check
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    // 2. Parse and Validate Input
    const requestBody = await req.json();
    
    if (!requestBody.activityId) {
      return NextResponse.json(
        { error: 'Activity ID is required', code: 'MISSING_ACTIVITY_ID' },
        { status: 400 }
      );
    }

    // 3. Database Operations
    const { data: review, error: insertError } = await supabase
      .from('reviews')
      .insert({
        activity_id: requestBody.activityId,
        user_id: userId,
        rating: requestBody.rating,
        title: requestBody.title,
        content: requestBody.content,
        status: 'pending'
      })
      .select(`
        id,
        rating,
        title,
        content,
        status,
        created_at,
        user:profiles(
          id,
          name,
          avatar_url
        )
      `)
      .single();

    if (insertError) {
      console.error('Supabase Insert Error:', insertError);
      throw new Error('Failed to create review record');
    }

    // 4. Success Response
    return NextResponse.json({
      success: true,
      data: review
    });

  } catch (error: any) {
    console.error('API Route Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        message: error.message || 'An unexpected error occurred',
        code: 'SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}