import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

type Activity = {
  title: string
  category: string
}

type Profile = {
  name: string
}

type Booking = {
  id: string
  created_at: string
  amount: number
  activities: Activity | null
  profiles: Profile | null
}

type ActivityWithBookings = {
  id: string
  title: string
  views_count: number
  category: string
  bookings: { count: number }[]
}

type SupabaseBookingResponse = {
  id: string
  created_at: string
  amount: number
  activities: Activity[]
  profiles: Profile[]
}

type SupabaseActivityResponse = {
  id: string
  title: string
  category: string
  bookings: { count: number }[]
}

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    // Check if bookings table exists and has data
    const { data: bookingsCheck, error: checkError } = await supabase
      .from('bookings')
      .select('id')
      .limit(1)

    if (checkError) throw checkError
    if (!bookingsCheck || bookingsCheck.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          revenue: [],
          categories: [],
          stats: [],
          recentBookings: []
        },
        message: 'No bookings data found'
      })
    }

    // 1. Get revenue data for last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    
    const { data: revenueData, error: revenueError } = await supabase
      .from('bookings')
      .select('created_at, amount')
      .gte('created_at', thirtyDaysAgo)
      .order('created_at', { ascending: true })

    if (revenueError) throw revenueError

    // 2. Get bookings by category with proper typing
    const { data: categoryData, error: categoryError } = await supabase
      .from('activities')
      .select(`
        id,
        title,
        category,
        bookings:bookings(count)
      `)

    if (categoryError) throw categoryError

    // 3. Get activity stats (most viewed)
    const { data: activityStats, error: statsError } = await supabase
      .from('activities')
      .select('id, title, views_count')
      .order('views_count', { ascending: false })
      .limit(5)

    if (statsError) throw statsError

    // 4. Get recent bookings with proper typing
    const { data: recentBookings, error: bookingsError } = await supabase
      .from('bookings')
      .select(`
        id,
        created_at,
        amount,
        activities:activities(title, category),
        profiles:profiles(name)
      `)
      .order('created_at', { ascending: false })
      .limit(5)

    if (bookingsError) throw bookingsError

    // Format data for charts with null checks
    const formattedRevenue = revenueData?.map(item => ({
      date: new Date(item.created_at).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      revenue: item.amount || 0
    })) || []

    const formattedCategories = categoryData?.map(item => ({
      category: item.category || 'Uncategorized',
      count: item.bookings?.[0]?.count || 0
    })) || []

    const formattedRecentBookings = recentBookings?.map(booking => ({
      id: booking.id,
      created_at: booking.created_at,
      amount: booking.amount || 0,
      activity: {
        title: booking.activities?.[0]?.title || 'Unknown Activity',
        category: booking.activities?.[0]?.category || 'Uncategorized'
      },
      user: {
        name: booking.profiles?.[0]?.name || 'Unknown User'
      }
    })) || []

    return NextResponse.json({
      success: true,
      data: {
        revenue: formattedRevenue,
        categories: formattedCategories,
        stats: activityStats || [],
        recentBookings: formattedRecentBookings
      }
    })

  } catch (error) {
    console.error('Analytics API Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch analytics data',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 })
  }
}