import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const { data: reviews, error } = await supabase
      .from('reviews')
      .select(`
        *,
        activity:activities(*),
        user:profiles(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { id, status } = await request.json();

    const { data, error } = await supabase
      .from('reviews')
      .update({
        status,
        moderated_at: new Date().toISOString(),
        moderated_by: (await supabase.auth.getUser()).data.user?.id
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log the moderation action
    await supabase.from('admin_logs').insert({
      admin_id: (await supabase.auth.getUser()).data.user?.id,
      action: 'review_moderation',
      entity_type: 'review',
      entity_id: id,
      details: { status }
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}