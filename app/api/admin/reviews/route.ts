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
      { 
        error: 'Authentication required',
        code: 'UNAUTHORIZED'
      },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    
    // Validate required fields
    if (!body.activityId) {
      return NextResponse.json(
        { 
          error: 'Activity ID is required',
          code: 'MISSING_ACTIVITY_ID'
        },
        { status: 400 }
      );
    }

    if (!body.rating || body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { 
          error: 'Rating must be between 1-5',
          code: 'INVALID_RATING'
        },
        { status: 400 }
      );
    }

    if (!body.comment || body.comment.length < 20) {
      return NextResponse.json(
        { 
          error: 'Comment must be at least 20 characters',
          code: 'COMMENT_TOO_SHORT'
        },
        { status: 400 }
      );
    }

    // Insert review with correct column names
    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        activity_id: body.activityId,
        user_id: userId,
        rating: body.rating,
        comment: body.comment,
        status: 'pending'
      })
      .select(`
        id,
        activity_id,
        user_id,
        rating,
        comment,
        status,
        created_at
      `)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: review
    });

  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        message: error.message,
        code: 'SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(req.url);

  try {
    const activityId = searchParams.get('activityId');
    const status = searchParams.get('status') || 'approved';
    const limit = parseInt(searchParams.get('limit') || '10');

    let query = supabase
      .from('reviews')
      .select(`
        id,
        activity_id,
        user_id,
        rating,
        comment,
        status,
        created_at,
        profiles:user_id(name, avatar_url)
      `)
      .order('created_at', { ascending: false });

    if (activityId) query = query.eq('activity_id', activityId);
    if (status) query = query.eq('status', status);
    if (limit) query = query.limit(limit);

    const { data: reviews, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: reviews
    });

  } catch (error: any) {
    console.error('Review fetch error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch reviews',
        message: error.message,
        code: 'FETCH_ERROR'
      },
      { status: 500 }
    );
  }
}