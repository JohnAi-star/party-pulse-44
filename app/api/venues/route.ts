import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const minCapacity = searchParams.get('minCapacity');
    const maxCapacity = searchParams.get('maxCapacity');
    const maxPrice = searchParams.get('maxPrice');
    const amenities = searchParams.get('amenities')?.split(',');

    const supabase = createRouteHandlerClient({ cookies });

    let query = supabase
      .from('venues')
      .select(`
        *,
        venue_images (
          id,
          url,
          type
        ),
        venue_amenities (
          id,
          name,
          price,
          is_included
        ),
        venue_availability (
          date,
          start_time,
          end_time,
          is_available
        )
      `);

    // Apply filters
    if (city) {
      query = query.eq('city', city);
    }

    if (minCapacity) {
      query = query.gte('capacity_min', parseInt(minCapacity));
    }

    if (maxCapacity) {
      query = query.lte('capacity_max', parseInt(maxCapacity));
    }

    if (maxPrice) {
      query = query.lte('price_per_hour', parseFloat(maxPrice));
    }

    const { data: venues, error } = await query;

    if (error) {
      console.error('Error fetching venues:', error);
      return NextResponse.json(
        { error: 'Failed to fetch venues' },
        { status: 500 }
      );
    }

    // Define the VenueAmenity type
    type VenueAmenity = {
      id: number;
      name: string;
      price: number;
      is_included: boolean;
    };

    // Filter by amenities if specified
    let filteredVenues = venues;
    if (amenities && amenities.length > 0) {
      filteredVenues = venues.filter((venue) =>
        amenities.every((amenity) =>
          venue.venue_amenities.some((a: VenueAmenity) => a.name === amenity)
        )
      );
    }

    return NextResponse.json(filteredVenues);
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

    const venueData = await request.json();

    const { data: venue, error } = await supabase
      .from('venues')
      .insert(venueData)
      .select()
      .single();

    if (error) {
      console.error('Error creating venue:', error);
      return NextResponse.json(
        { error: 'Failed to create venue' },
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