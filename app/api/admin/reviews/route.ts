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
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request
    const body = await req.json();
    
    // Validate required fields
    if (!body.activityId) {
      return NextResponse.json(
        { error: 'Activity ID is required' },
        { status: 400 }
      );
    }

    if (typeof body.rating !== 'number' || body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Create review
    const { data, error } = await supabase
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

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Database operation failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({ review: data }, { status: 201 });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}