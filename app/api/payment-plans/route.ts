import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

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

    const {
      bookingId,
      totalAmount,
      depositAmount,
      installmentCount,
      installmentDates,
    } = await request.json();

    // Start a transaction
    const { data: paymentPlan, error: planError } = await supabase
      .from('payment_plans')
      .insert({
        booking_id: bookingId,
        total_amount: totalAmount,
        deposit_amount: depositAmount,
        installment_count: installmentCount,
      })
      .select()
      .single();

    if (planError) {
      console.error('Error creating payment plan:', planError);
      return NextResponse.json(
        { error: 'Failed to create payment plan' },
        { status: 500 }
      );
    }

    // Calculate installment amount
    const remainingAmount = totalAmount - depositAmount;
    const installmentAmount = remainingAmount / installmentCount;

    // Create installments
    const installments = installmentDates.map((dueDate: string) => ({
      payment_plan_id: paymentPlan.id,
      amount: installmentAmount,
      due_date: dueDate,
    }));

    const { error: installmentsError } = await supabase
      .from('payment_installments')
      .insert(installments);

    if (installmentsError) {
      console.error('Error creating installments:', installmentsError);
      return NextResponse.json(
        { error: 'Failed to create installments' },
        { status: 500 }
      );
    }

    return NextResponse.json(paymentPlan);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('bookingId');

    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: paymentPlan, error } = await supabase
      .from('payment_plans')
      .select(`
        *,
        payment_installments (
          id,
          amount,
          due_date,
          status,
          paid_at
        )
      `)
      .eq('booking_id', bookingId)
      .single();

    if (error) {
      console.error('Error fetching payment plan:', error);
      return NextResponse.json(
        { error: 'Failed to fetch payment plan' },
        { status: 500 }
      );
    }

    return NextResponse.json(paymentPlan);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}