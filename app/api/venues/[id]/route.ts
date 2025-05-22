import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const { data: venue, error } = await supabase
      .from('venues')
      .select(`
        *,
        venue_images (
          id,
          url,
          type,
          description,
          order_index
        ),
        venue_amenities (
          id,
          name,
          description,
          price,
          is_included
        ),
        venue_availability (
          date,
          start_time,
          end_time,
          is_available,
          price_override
        )
      `)
      .eq('id', params.id)
      .single();

    if (error) {
      console.error('Error fetching venue:', error);
      return NextResponse.json(
        { error: 'Failed to fetch venue' },
        { status: 500 }
      );
    }

    if (!venue) {
      return NextResponse.json(
        { error: 'Venue not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(venue);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
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

    const updates = await request.json();

    const { data: venue, error } = await supabase
      .from('venues')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating venue:', error);
      return NextResponse.json(
        { error: 'Failed to update venue' },
        { status: 500 }
      );
    }

    return NextResponse.json(venue);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const { error } = await supabase
      .from('venues')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Error deleting venue:', error);
      return NextResponse.json(
        { error: 'Failed to delete venue' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}