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
    // 1. Get activities data
    const { data: activities, error } = await supabase
      .from('activities')
      .select(`
        id,
        title,
        price_from,
        rating,
        category_id,
        categories(name),
        subcategory,
        created_at
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    // 2. Format response
    const response = {
      summary: {
        totalActivities: activities?.length || 0,
        totalRevenue: activities?.reduce((sum, a) => sum + a.price_from, 0) || 0,
        averageRating: activities?.reduce((sum, a) => sum + (a.rating || 0), 0) / (activities?.length || 1) || 0
      },
      categories: activities?.reduce((acc, activity) => {
        const category = activity.categories?.[0]?.name || activity.subcategory || 'Uncategorized'
        acc[category] = (acc[category] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      recentActivities: activities?.slice(0, 5).map(a => ({
        id: a.id,
        title: a.title,
        price: a.price_from,
        category: a.categories?.[0].name || a.subcategory || 'Uncategorized',
        date: new Date(a.created_at).toLocaleDateString()
      })) || []
    }

    return NextResponse.json({
      success: true,
      data: response
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch analytics data'
    }, { status: 500 })
  }
}