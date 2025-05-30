import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { userId } = auth();

  try {
    // Authentication check
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request
    const body = await req.json();
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(body.activityId)) {
      return NextResponse.json(
        { error: 'Invalid activity ID format' },
        { status: 400 }
      );
    }

    // Validate other fields
    if (typeof body.rating !== 'number' || body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be 1-5' },
        { status: 400 }
      );
    }

    if (!body.title || body.title.trim().length < 5) {
      return NextResponse.json(
        { error: 'Title too short' },
        { status: 400 }
      );
    }

    if (!body.content || body.content.trim().length < 20) {
      return NextResponse.json(
        { error: 'Content too short' },
        { status: 400 }
      );
    }

    // Check activity exists
    const { data: activity, error: activityError } = await supabase
      .from('activities')
      .select('id')
      .eq('id', body.activityId)
      .single();

    if (activityError || !activity) {
      return NextResponse.json(
        { error: 'Activity not found' },
        { status: 404 }
      );
    }

    // Create review
    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        activity_id: body.activityId,
        user_id: userId,
        rating: body.rating,
        title: body.title.trim(),
        comment: body.content.trim(),
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

    return NextResponse.json({
      success: true,
      review
    });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const { searchParams } = new URL(req.url);
    const activityId = searchParams.get('activityId');
    
    if (!activityId) {
      return NextResponse.json(
        { error: 'Activity ID required' },
        { status: 400 }
      );
    }

    const { data: reviews, error } = await supabase
      .from('reviews')
      .select(`
        id,
        rating,
        title,
        comment,
        created_at,
        profiles:user_id (
          id,
          name,
          avatar_url
        )
      `)
      .eq('activity_id', activityId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      reviews
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}