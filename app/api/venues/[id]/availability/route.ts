import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const supabase = createRouteHandlerClient({ cookies });

    let query = supabase
      .from('venue_availability')
      .select('*')
      .eq('venue_id', params.id);

    if (startDate) {
      query = query.gte('date', startDate);
    }

    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data: availability, error } = await query;

    if (error) {
      console.error('Error fetching venue availability:', error);
      return NextResponse.json(
        { error: 'Failed to fetch availability' },
        { status: 500 }
      );
    }

    return NextResponse.json(availability);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const availabilityData = await request.json();

    const { data: availability, error } = await supabase
      .from('venue_availability')
      .insert({
        ...availabilityData,
        venue_id: params.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating availability:', error);
      return NextResponse.json(
        { error: 'Failed to create availability' },
        { status: 500 }
      );
    }

    return NextResponse.json(availability);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}