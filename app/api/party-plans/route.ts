import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { bookingId, title, description, date, budget } = await req.json();

    const { data: partyPlan, error } = await supabase
      .from('party_plans')
      .insert({
        booking_id: bookingId,
        title,
        description,
        date,
        budget
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(partyPlan);
  } catch (error) {
    console.error('Error creating party plan:', error);
    return NextResponse.json(
      { error: 'Failed to create party plan' },
      { status: 500 }
    );
  }
}