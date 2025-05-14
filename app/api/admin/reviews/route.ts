import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

type Review = {
  id: string
  rating: number
  content: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  activity_id: string
  user_id: string
  activity?: {
    id: string
    title: string
  }
  user?: {
    id: string
    name: string
  }
}

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Fetch reviews with related data
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select(`
        id,
        rating,
        content,
        status,
        created_at,
        activity:activities(id, title),
        user:profiles(id, name)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      throw new Error('Database query failed')
    }

    return NextResponse.json({
      success: true,
      data: reviews || []
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch reviews'
    }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    const { id, status } = await request.json()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { data: updatedReview, error } = await supabase
      .from('reviews')
      .update({
        status,
        moderated_at: new Date().toISOString(),
        moderated_by: user.id
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: updatedReview
    })

  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update review'
    }, { status: 500 })
  }
}