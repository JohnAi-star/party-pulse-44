import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  try {
    const { activityId, rating, title, content } = await req.json();

    if (!activityId) {
      return NextResponse.json(
        { error: 'Activity ID is required' },
        { status: 400 }
      );
    }

    // Check for existing review
    const { data: existingReview, error: existingError } = await supabase
      .from('reviews')
      .select('id')
      .eq('activity_id', activityId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingError) throw existingError;
    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this activity' },
        { status: 400 }
      );
    }

    // Create new review
    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        activity_id: activityId,
        user_id: user.id,
        rating,
        title,
        content,
        status: 'pending'
      })
      .select(`
        *,
        user:profiles(*)
      `)
      .single();

    if (error) throw error;

    return NextResponse.json(review);
  } catch (error) {
    console.error('Review submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(req.url);
  
  try {
    const activityId = searchParams.get('activityId');
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');

    let query = supabase
      .from('reviews')
      .select(`
        *,
        user:profiles(*)
      `)
      .order('created_at', { ascending: false });

    if (activityId) query = query.eq('activity_id', activityId);
    if (status) query = query.eq('status', status);
    if (limit) query = query.limit(Number(limit));

    const { data: reviews, error } = await query;

    if (error) throw error;

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to load reviews' },
      { status: 500 }
    );
  }
}