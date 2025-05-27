import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const { reviewId } = await req.json();

    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.rpc('increment_helpful', {
      review_id: reviewId
    });

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      newCount: data 
    });
  } catch (error) {
    console.error('Helpful vote error:', error);
    return NextResponse.json(
      { error: 'Failed to process helpful vote' },
      { status: 500 }
    );
  }
}