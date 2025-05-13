import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';

const supabase = createClientComponentClient<Database>();

export const activities = {
  getAll: async () => {
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

    if (error) throw error;
    return data;
  },
  create: async (data: any) => {
    const { data: newActivity, error } = await supabase
      .from('activities')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return newActivity;
  },
  update: async (id: string, data: any) => {
    const { data: updatedActivity, error } = await supabase
      .from('activities')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return updatedActivity;
  },
  delete: async (id: string) => {
    const { error } = await supabase
      .from('activities')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  }
};

export const reviews = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        activity:activities(*),
        user:profiles(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },
  approve: async (id: string) => {
    const { data, error } = await supabase
      .from('reviews')
      .update({ status: 'approved', moderated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
  delete: async (id: string) => {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  }
};

export const users = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        stats:user_stats(*),
        bookings:bookings(count),
        reviews:reviews(count)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },
  updateRole: async (userId: string, role: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
  deactivate: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ status: 'inactive' })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

export const analytics = {
  getStats: async () => {
    const { data, error } = await supabase
      .from('activity_stats')
      .select('*')
      .order('views_count', { ascending: false });

    if (error) throw error;
    return data;
  },
  getRecentActivity: async () => {
    const { data, error } = await supabase
      .from('activity_analytics')
      .select('*')
      .order('date', { ascending: false })
      .limit(30);

    if (error) throw error;
    return data;
  }
};