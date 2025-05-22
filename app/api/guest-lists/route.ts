import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { partyPlanId, guests } = await req.json();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user owns the party plan
    const { data: partyPlan } = await supabase
      .from('party_plans')
      .select('id, booking:bookings(user_id)')
      .eq('id', partyPlanId)
      .single();

    if (
      !partyPlan ||
      !Array.isArray(partyPlan.booking) ||
      partyPlan.booking.length === 0 ||
      partyPlan.booking[0].user_id !== user.id
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Insert guests
    const { data, error } = await supabase
      .from('guest_lists')
      .insert(guests.map((guest: any) => ({
        party_plan_id: partyPlanId,
        ...guest
      })))
      .select();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error adding guests:', error);
    return NextResponse.json(
      { error: 'Failed to add guests' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const url = new URL(req.url);
    const partyPlanId = url.searchParams.get('partyPlanId');

    if (!partyPlanId) {
      return NextResponse.json(
        { error: 'Party plan ID is required' },
        { status: 400 }
      );
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('guest_lists')
      .select('*')
      .eq('party_plan_id', partyPlanId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching guests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch guests' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { id, updates } = await req.json();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('guest_lists')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating guest:', error);
    return NextResponse.json(
      { error: 'Failed to update guest' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { id } = await req.json();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
      .from('guest_lists')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting guest:', error);
    return NextResponse.json(
      { error: 'Failed to delete guest' },
      { status: 500 }
    );
  }
}