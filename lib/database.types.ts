export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            activities: {
                Row: {
                    id: string
                    title: string
                    description: string
                    city: string
                    price_from: number
                    image: string
                    category: string
                    rating: number
                    duration: string
                    group_size: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description: string
                    city: string
                    price_from: number
                    image: string
                    category: string
                    rating?: number
                    duration: string
                    group_size: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string
                    city?: string
                    price_from?: number
                    image?: string
                    category?: string
                    rating?: number
                    duration?: string
                    group_size?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            reviews: {
                Row: {
                    id: string
                    activity_id: string
                    user_id: string
                    rating: number
                    title: string
                    content: string
                    status: string
                    moderated_at: string | null
                    moderated_by: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    activity_id: string
                    user_id: string
                    rating: number
                    title: string
                    content: string
                    status?: string
                    moderated_at?: string | null
                    moderated_by?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    activity_id?: string
                    user_id?: string
                    rating?: number
                    title?: string
                    content?: string
                    status?: string
                    moderated_at?: string | null
                    moderated_by?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            activity_stats: {
                Row: {
                    id: string
                    activity_id: string
                    views_count: number
                    bookings_count: number
                    avg_rating: number
                    revenue_total: number
                    last_updated: string
                }
                Insert: {
                    id?: string
                    activity_id: string
                    views_count?: number
                    bookings_count?: number
                    avg_rating?: number
                    revenue_total?: number
                    last_updated?: string
                }
                Update: {
                    id?: string
                    activity_id?: string
                    views_count?: number
                    bookings_count?: number
                    avg_rating?: number
                    revenue_total?: number
                    last_updated?: string
                }
            }
            activity_analytics: {
                Row: {
                    id: string
                    activity_id: string
                    date: string
                    bookings_count: number
                    revenue: number
                    avg_group_size: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    activity_id: string
                    date: string
                    bookings_count?: number
                    revenue?: number
                    avg_group_size?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    activity_id?: string
                    date?: string
                    bookings_count?: number
                    revenue?: number
                    avg_group_size?: number
                    created_at?: string
                }
            }
            profiles: {
                Row: {
                    id: string
                    email: string
                    name: string
                    role: string
                    status: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    name: string
                    role?: string
                    status?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    name?: string
                    role?: string
                    status?: string
                    created_at?: string
                    updated_at?: string
                }
            }
        }
    }
}