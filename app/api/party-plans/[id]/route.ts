import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/database.types';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  try {
    // Fetch party plan from database (no auth required)
    const { data: partyPlan, error } = await supabase
      .from('party_plans')
      .select('id, title, description, image')
      .eq('id', params.id)
      .single();

    if (error || !partyPlan) {
      return NextResponse.json(
        { error: 'Party plan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(partyPlan);
  } catch (error) {
    console.error('Error fetching party plan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}