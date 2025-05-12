import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Get overall stats
    const { data: activityStats, error: statsError } = await supabase
      .from('activity_stats')
      .select('*')
      .order('views_count', { ascending: false });

    // Get revenue data for the last 30 days
    const { data: revenueData, error: revenueError } = await supabase
      .from('activity_analytics')
      .select('date, revenue')
      .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('date', { ascending: true });

    // Get bookings by category
    const { data: categoryData, error: categoryError } = await supabase
      .from('activities')
      .select(`
        category,
        bookings:bookings(count)
      `)
      .order('category', { ascending: true });

    // Get recent bookings
    const { data: recentBookings, error: bookingsError } = await supabase
      .from('bookings')
      .select(`
        *,
        activity:activities(*),
        user:profiles(*)
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    if (statsError || revenueError || categoryError || bookingsError) {
      return NextResponse.json(
        { error: 'Failed to fetch analytics data' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      stats: activityStats,
      revenue: revenueData,
      categories: categoryData,
      recentBookings
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}