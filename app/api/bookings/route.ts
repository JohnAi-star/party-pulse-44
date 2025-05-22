import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { sendBookingConfirmation } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { activityId, date, groupSize } = body;

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        activity_id: activityId,
        participants: groupSize,
        date: new Date(date).toISOString(),
      })
      .select('*, activities(*)')
      .single();

    if (bookingError) {
      console.error('Booking error:', bookingError);
      return NextResponse.json(
        { error: bookingError.message },
        { status: 500 }
      );
    }

    // Send confirmation email
    try {
      await sendBookingConfirmation(user.email!, {
        id: booking.id,
        activityName: booking.activities.title,
        date: new Date(booking.date).toLocaleDateString(),
        groupSize: booking.participants,
        totalPrice: booking.activities.price_from * booking.participants,
      });
    } catch (emailError) {
      console.error('Email error:', emailError);
      // Don't fail the booking if email fails
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        activities (
          id,
          title,
          price_from,
          image,
          city
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}