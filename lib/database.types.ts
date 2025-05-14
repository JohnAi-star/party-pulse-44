// database.types.ts
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
          region: string | null
          price_from: number
          image: string
          status: string
          category_id: string | null
          subcategory: string | null
          rating: number | null
          duration: string
          group_size: string
          features: string[] | null
          availability: string[] | null
          location: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          city: string
          region?: string | null
          price_from: number
          image: string
          category_id?: string | null
          subcategory?: string | null
          rating?: number | null
          duration: string
          group_size: string
          features?: string[] | null
          availability?: string[] | null
          location?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          city?: string
          region?: string | null
          price_from?: number
          image?: string
          category_id?: string | null
          subcategory?: string | null
          rating?: number | null
          duration?: string
          group_size?: string
          features?: string[] | null
          availability?: string[] | null
          location?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      locations: {
        Row: {
          id: string
          name: string
          address: string
          city: string
          country: string
          postcode: string
          coordinates: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          city: string
          country: string
          postcode: string
          coordinates?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          city?: string
          country?: string
          postcode?: string
          coordinates?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      packages: {
        Row: {
          id: string
          activity_id: string
          name: string
          description: string
          price: number
          min_participants: number
          max_participants: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          activity_id: string
          name: string
          description: string
          price: number
          min_participants: number
          max_participants: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          activity_id?: string
          name?: string
          description?: string
          price?: number
          min_participants?: number
          max_participants?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "packages_activity_id_fkey"
            columns: ["activity_id"]
            referencedRelation: "activities"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      reviews: {
        Row: {
          id: string
          activity_id: string
          user_id: string
          rating: number
          comment: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          activity_id: string
          user_id: string
          rating: number
          comment?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          activity_id?: string
          user_id?: string
          rating?: number
          comment?: string | null
          status?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_activity_id_fkey"
            columns: ["activity_id"]
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          activity_id: string
          package_id: string | null
          participants: number
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          activity_id: string
          package_id?: string | null
          participants: number
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          activity_id?: string
          package_id?: string | null
          participants?: number
          status?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_activity_id_fkey"
            columns: ["activity_id"]
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_package_id_fkey"
            columns: ["package_id"]
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      user_stats: {
        Row: {
          user_id: string
          reviews_count: number
          bookings_count: number
          views_count: number
          last_active_at: string
        }
        Insert: {
          user_id: string
          reviews_count?: number
          bookings_count?: number
          views_count?: number
          last_active_at?: string
        }
        Update: {
          user_id?: string
          reviews_count?: number
          bookings_count?: number
          views_count?: number
          last_active_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_stats_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      activity_stats: {
        Row: {
          activity_id: string
          views_count: number
          bookings_count: number
          average_rating: number | null
        }
        Insert: {
          activity_id: string
          views_count?: number
          bookings_count?: number
          average_rating?: number | null
        }
        Update: {
          activity_id?: string
          views_count?: number
          bookings_count?: number
          average_rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_stats_activity_id_fkey"
            columns: ["activity_id"]
            referencedRelation: "activities"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "activity_analytics_activity_id_fkey"
            columns: ["activity_id"]
            referencedRelation: "activities"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}