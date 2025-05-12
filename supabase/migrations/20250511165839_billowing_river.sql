/*
  # Add Admin Features and Analytics

  1. New Tables
    - user_stats
      - User activity metrics and engagement data
    - activity_analytics
      - Detailed analytics for activities including revenue
    - admin_settings
      - System-wide configuration for admin features

  2. Security
    - Enable RLS on all new tables
    - Add admin-specific policies
*/

-- User Stats Table
CREATE TABLE user_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  total_bookings integer DEFAULT 0,
  total_spent numeric(10,2) DEFAULT 0,
  last_booking_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activity Analytics Table
CREATE TABLE activity_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id uuid REFERENCES activities(id) ON DELETE CASCADE,
  date date NOT NULL,
  bookings_count integer DEFAULT 0,
  revenue numeric(10,2) DEFAULT 0,
  avg_group_size numeric(5,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Admin Settings Table
CREATE TABLE admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL,
  description text,
  updated_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- User Stats Policies
CREATE POLICY "Users can view their own stats"
  ON user_stats FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'role' = 'admin'
  ));

-- Activity Analytics Policies
CREATE POLICY "Only admins can access analytics"
  ON activity_analytics FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Admin Settings Policies
CREATE POLICY "Only admins can manage settings"
  ON admin_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Add indexes
CREATE INDEX idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX idx_activity_analytics_activity_id ON activity_analytics(activity_id);
CREATE INDEX idx_activity_analytics_date ON activity_analytics(date);
CREATE INDEX idx_admin_settings_key ON admin_settings(key);