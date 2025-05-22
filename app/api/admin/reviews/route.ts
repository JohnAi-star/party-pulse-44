import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { activityId, rating, title, content } = await req.json();

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
        user:profiles(*),
        activity:activities(*)
      `)
      .single();

    if (error) throw error;

    return NextResponse.json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const activityId = searchParams.get('activityId');
    const status = searchParams.get('status');

    const supabase = createRouteHandlerClient({ cookies });
    
    let query = supabase
      .from('reviews')
      .select(`
        *,
        user:profiles(*),
        activity:activities(*)
      `)
      .order('created_at', { ascending: false });

    if (activityId) {
      query = query.eq('activity_id', activityId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: reviews, error } = await query;

    if (error) throw error;

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}