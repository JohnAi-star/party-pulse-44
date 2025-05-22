import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const partyPlanId = searchParams.get('partyPlanId');

    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: timeline, error } = await supabase
      .from('party_timelines')
      .select('*')
      .eq('party_plan_id', partyPlanId)
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching timeline:', error);
      return NextResponse.json(
        { error: 'Failed to fetch timeline' },
        { status: 500 }
      );
    }

    return NextResponse.json(timeline);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const timelineData = await request.json();

    const { data: timeline, error } = await supabase
      .from('party_timelines')
      .insert(timelineData)
      .select()
      .single();

    if (error) {
      console.error('Error creating timeline item:', error);
      return NextResponse.json(
        { error: 'Failed to create timeline item' },
        { status: 500 }
      );
    }

    return NextResponse.json(timeline);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}