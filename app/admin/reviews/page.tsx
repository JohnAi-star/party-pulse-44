import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

type Review = {
  id: string
  activity_id: string
  user_id: string
  rating: number
  content: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  moderated_at?: string
  moderated_by?: string
}

type Activity = {
  id: string
  title: string
}

type Profile = {
  id: string
  name: string
  email: string
}

type ReviewWithRelations = Review & {
  activity: Activity
  user: Profile
}

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })

  try {
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
      .order('created_at', { ascending: false })
      `)

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: reviews || []
    })
  } catch (error) {
    console.error('Reviews API Error:', error)
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
    const user = (await supabase.auth.getUser()).data.user

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    const { data: review, error } = await supabase
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

    // Log the moderation action
    await supabase.from('admin_logs').insert({
      admin_id: user.id,
      action: 'review_moderation',
      entity_type: 'review',
      entity_id: id,
      details: { status }
    })

    return NextResponse.json({
      success: true,
      data: review
    })
  } catch (error) {
    console.error('Review Update Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update review'
    }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    const { id } = await request.json()
    const user = (await supabase.auth.getUser()).data.user

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id)

    if (error) throw error

    // Log the deletion action
    await supabase.from('admin_logs').insert({
      admin_id: user.id,
      action: 'review_deletion',
      entity_type: 'review',
      entity_id: id
    })

    return NextResponse.json({
      success: true
    })
  } catch (error) {
    console.error('Review Delete Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete review'
    }, { status: 500 })
  }
}