import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';

const supabase = createClientComponentClient<Database>();

// Type definitions for better type safety
type Activity = Database['public']['Tables']['activities']['Row'] & {
  location: Database['public']['Tables']['locations']['Row'] | null;
  category: Database['public']['Tables']['categories']['Row'] | null;
  packages: Database['public']['Tables']['packages']['Row'][];
  reviews: Database['public']['Tables']['reviews']['Row'][];
};

type Review = Database['public']['Tables']['reviews']['Row'] & {
  activity: Activity | null;
  user: Database['public']['Tables']['profiles']['Row'] | null;
};

type User = Database['public']['Tables']['profiles']['Row'] & {
  stats: Database['public']['Tables']['user_stats']['Row'] | null;
  bookings: { count: number }[];
  reviews: { count: number }[];
};

type Booking = Database['public']['Tables']['bookings']['Row'] & {
  user: Database['public']['Tables']['profiles']['Row'] | null;
  activity: Activity | null;
};

// Activities Service
export const activities = {
  getAll: async (): Promise<Activity[]> => {
    const { data, error } = await supabase
      .from('activities')
      .select(`
        *,
        location:locations(*),
        category:categories(*),
        packages(*),
        reviews(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching activities:', error);
      throw new Error(error.message);
    }
    
    return data || [];
  },

  getById: async (id: string): Promise<Activity | null> => {
    const { data, error } = await supabase
      .from('activities')
      .select(`
        *,
        location:locations(*),
        category:categories(*),
        packages(*),
        reviews(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching activity ${id}:`, error);
      return null;
    }
    
    return data;
  },

  create: async (activityData: Omit<Activity, 'id' | 'created_at'>): Promise<Activity> => {
    const { data, error } = await supabase
      .from('activities')
      .insert(activityData)
      .select()
      .single();

    if (error) {
      console.error('Error creating activity:', error);
      throw new Error(error.message);
    }
    
    return data;
  },

  update: async (id: string, updates: Partial<Activity>): Promise<Activity> => {
    const { data, error } = await supabase
      .from('activities')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating activity ${id}:`, error);
      throw new Error(error.message);
    }
    
    return data;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('activities')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting activity ${id}:`, error);
      throw new Error(error.message);
    }
  }
};

// Reviews Service
export const reviews = {
  getAll: async (): Promise<Review[]> => {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        activity:activities(*),
        user:profiles(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      throw new Error(error.message);
    }
    
    return data || [];
  },

  approve: async (id: string): Promise<Review> => {
    const { data, error } = await supabase
      .from('reviews')
      .update({ 
        status: 'approved', 
        moderated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error approving review ${id}:`, error);
      throw new Error(error.message);
    }
    
    return data;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting review ${id}:`, error);
      throw new Error(error.message);
    }
  }
};

// Users Service
export const users = {
  getAll: async (): Promise<User[]> => {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        stats:user_stats(*),
        bookings:bookings(count),
        reviews:reviews(count)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      throw new Error(error.message);
    }
    
    return data || [];
  },

  updateRole: async (userId: string, role: string): Promise<User> => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error(`Error updating user role ${userId}:`, error);
      throw new Error(error.message);
    }
    
    return data;
  },

  deactivate: async (userId: string): Promise<User> => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ status: 'inactive' })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error(`Error deactivating user ${userId}:`, error);
      throw new Error(error.message);
    }
    
    return data;
  }
};

// Analytics Service
export const analytics = {
  getStats: async () => {
    const { data, error } = await supabase
      .from('activity_stats')
      .select('*')
      .order('views_count', { ascending: false });

    if (error) {
      console.error('Error fetching analytics stats:', error);
      throw new Error(error.message);
    }
    
    return data || [];
  },

  getRecentActivity: async () => {
    const { data, error } = await supabase
      .from('activity_analytics')
      .select('*')
      .order('date', { ascending: false })
      .limit(30);

    if (error) {
      console.error('Error fetching recent activity:', error);
      throw new Error(error.message);
    }
    
    return data || [];
  }
};

// Bookings Service
export const bookings = {
  getAll: async (): Promise<Booking[]> => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        user:profiles(*),
        activity:activities(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
      throw new Error(error.message);
    }
    
    return data || [];
  },

  getById: async (id: string): Promise<Booking | null> => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        user:profiles(*),
        activity:activities(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching booking ${id}:`, error);
      return null;
    }
    
    return data;
  },

  getBooking: async (id: string): Promise<Booking | null> => {
    return bookings.getById(id);
  },

  create: async (bookingData: Omit<Booking, 'id' | 'created_at'>): Promise<Booking> => {
    const { data, error } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select()
      .single();

    if (error) {
      console.error('Error creating booking:', error);
      throw new Error(error.message);
    }
    
    return data;
  },

  update: async (id: string, updates: Partial<Booking>): Promise<Booking> => {
    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating booking ${id}:`, error);
      throw new Error(error.message);
    }
    
    return data;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting booking ${id}:`, error);
      throw new Error(error.message);
    }
  }
};