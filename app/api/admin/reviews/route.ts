import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { userId } = auth();

  // Immediate auth check
  if (!userId) {
    return NextResponse.json(
      { error: 'Authentication required', code: 'UNAUTHORIZED' },
      { status: 401 }
    );
  }

  try {
    // Parse and validate request
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body', code: 'INVALID_BODY' },
        { status: 400 }
      );
    }

    // Strict validation
    type StringRule = { type: 'string'; minLength?: number };
    type NumberRule = { type: 'number'; min?: number; max?: number };
    type FieldRule = StringRule | NumberRule;

    const requiredFields: Record<string, FieldRule> = {
      activityId: { type: 'string', minLength: 1 },
      rating: { type: 'number', min: 1, max: 5 },
      title: { type: 'string', minLength: 5 },
      content: { type: 'string', minLength: 20 }
    };

    const errors: string[] = [];
    for (const [field, rules] of Object.entries(requiredFields)) {
      if (typeof body[field] !== rules.type) {
        errors.push(`${field} must be a ${rules.type}`);
      } else if (
        rules.type === 'string' &&
        typeof rules.minLength === 'number' &&
        typeof body[field] === 'string' &&
        body[field].trim().length < rules.minLength
      ) {
        errors.push(`${field} must be at least ${rules.minLength} characters`);
      } else if (
        rules.type === 'number' &&
        typeof rules.min === 'number' &&
        body[field] < rules.min
      ) {
        errors.push(`${field} must be at least ${rules.min}`);
      } else if (
        rules.type === 'number' &&
        typeof rules.max === 'number' &&
        body[field] > rules.max
      ) {
        errors.push(`${field} must be at most ${rules.max}`);
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors, code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // Ensure profile exists (with retry logic)
    let profileExists = false;
    let retries = 0;
    const maxRetries = 2;

    while (!profileExists && retries < maxRetries) {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      if (profile) {
        profileExists = true;
      } else {
        // Create profile if missing
        const { error: createError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            name: 'Anonymous',
            created_at: new Date().toISOString()
          });

        if (!createError) profileExists = true;
        retries++;
      }
    }

    if (!profileExists) {
      throw new Error('Failed to verify/create user profile');
    }

    // Insert review with error isolation
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
      // Handle specific constraint violations
      if (insertError.code === '23503') { // Foreign key violation
        if (insertError.message.includes('activity_id')) {
          throw new Error('Invalid activity ID');
        }
        if (insertError.message.includes('user_id')) {
          throw new Error('User profile not found');
        }
      }
      throw insertError;
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
    // Detailed error diagnostics
    const errorInfo = {
      message: error.message,
      code: error.code || 'UNKNOWN_ERROR',
      ...(process.env.NODE_ENV === 'development' && {
        stack: error.stack,
        details: error.details
      })
    };

    return NextResponse.json(
      {
        error: 'Internal Server Error',
        ...errorInfo
      },
      { status: 500 }
    );
  }
}