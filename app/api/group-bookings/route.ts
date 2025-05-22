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

    const body = await req.json();
    const {
      activityId,
      organizerDetails,
      bookingDetails,
      participantDetails
    } = body;

    // Create group booking
    const { data: booking, error: bookingError } = await supabase
      .from('group_bookings')
      .insert({
        activity_id: activityId,
        organizer_id: user.id,
        organizer_name: organizerDetails.name,
        organizer_email: organizerDetails.email,
        organizer_phone: organizerDetails.phone,
        group_size: bookingDetails.groupSize,
        booking_date: bookingDetails.date,
        payment_type: bookingDetails.paymentType,
        special_requirements: bookingDetails.specialRequirements
      })
      .select()
      .single();

    if (bookingError) {
      throw bookingError;
    }

    // Add participants if provided
    if (participantDetails?.length > 0) {
      const { error: participantsError } = await supabase
        .from('group_participants')
        .insert(
          participantDetails.map((p: { name: any; email: any; }) => ({
            group_booking_id: booking.id,
            name: p.name,
            email: p.email
          }))
        );

      if (participantsError) {
        throw participantsError;
      }
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error creating group booking:', error);
    return NextResponse.json(
      { error: 'Failed to create group booking' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: bookings, error } = await supabase
      .from('group_bookings')
      .select(`
        *,
        activity:activities(*),
        participants:group_participants(*)
      `)
      .eq('organizer_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching group bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch group bookings' },
      { status: 500 }
    );
  }
}