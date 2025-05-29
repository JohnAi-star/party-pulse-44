import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json(
      { error: 'Authentication required', code: 'UNAUTHORIZED' },
      { status: 401 }
    );
  }

  try {
    // Parse request body
    const body = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body', code: 'INVALID_BODY' },
        { status: 400 }
      );
    }

    // Validate required fields
    const validationErrors = [];
    if (!body.activityId) validationErrors.push('activityId is required');
    if (!body.rating || body.rating < 1 || body.rating > 5) validationErrors.push('rating must be 1-5');
    if (!body.title || body.title.trim().length < 5) validationErrors.push('title must be ≥5 characters');
    if (!body.content || body.content.trim().length < 20) validationErrors.push('content must be ≥20 characters');

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    // Check if user exists in profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      // Create profile if doesn't exist
      const { error: createError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          name: 'Anonymous',
          created_at: new Date().toISOString()
        });

      if (createError) {
        console.error('Profile creation failed:', createError);
        throw new Error('Failed to create user profile');
      }
    }

    // Insert review
    const { data: review, error: insertError } = await supabase
      .from('reviews')
      .insert({
        activity_id: body.activityId,
        user_id: userId,
        rating: body.rating,
        title: body.title.trim(),
        comment: body.content.trim(),
        status: 'pending'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Review insertion failed:', insertError);
      throw new Error('Failed to create review');
    }

    return NextResponse.json({
      success: true,
      data: {
        id: review.id,
        activityId: review.activity_id,
        userId: review.user_id,
        rating: review.rating,
        title: review.title,
        content: review.comment,
        status: review.status,
        createdAt: review.created_at
      }
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        message: error.message,
        code: 'SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(req.url);

  try {
    const activityId = searchParams.get('activityId');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');

    let query = supabase
      .from('reviews')
      .select(`
        id,
        activity_id,
        user_id,
        rating,
        title,
        comment,
        status,
        created_at,
        profiles:user_id(
          id,
          name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false });

    if (activityId) query = query.eq('activity_id', activityId);
    if (status) query = query.eq('status', status);
    if (limit) query = query.limit(limit);

    const { data: reviews, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: reviews?.map(review => ({
        id: review.id,
        activityId: review.activity_id,
        userId: review.user_id,
        rating: review.rating,
        title: review.title,
        content: review.comment,
        status: review.status,
        createdAt: review.created_at,
        user: review.profiles
      })) || []
    });

  } catch (error: any) {
    console.error('Fetch Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews', code: 'FETCH_ERROR' },
      { status: 500 }
    );
  }
}