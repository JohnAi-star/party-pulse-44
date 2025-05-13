-- ========================
-- Add Admin Features and Analytics
-- ========================

-- 1. New Tables
-- ----------------

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

-- 2. Enable Row Level Security (RLS)
-- ----------------
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies (using Clerk's JWT structure)
-- ----------------

-- User Stats Policies
CREATE POLICY "Users can view their own stats or admins can view all"
  ON user_stats FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR (auth.jwt() -> 'publicMetadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admins can insert user stats"
  ON user_stats FOR INSERT
  TO authenticated
  USING (
    (auth.jwt() -> 'publicMetadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Admins can update user stats"
  ON user_stats FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() -> 'publicMetadata' ->> 'role') = 'admin'
  );

-- Activity Analytics Policies
CREATE POLICY "Only admins can access analytics"
  ON activity_analytics FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() -> 'publicMetadata' ->> 'role') = 'admin'
  );

CREATE POLICY "Only admins can insert analytics"
  ON activity_analytics FOR INSERT
  TO authenticated
  USING (
    (auth.jwt() -> 'publicMetadata' ->> 'role') = 'admin'
  );

-- Admin Settings Policies
CREATE POLICY "Only admins can manage settings"
  ON admin_settings FOR ALL
  TO authenticated
  USING (
    (auth.jwt() -> 'publicMetadata' ->> 'role') = 'admin'
  );

-- 4. Indexes
-- ----------------
CREATE INDEX idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX idx_activity_analytics_activity_id ON activity_analytics(activity_id);
CREATE INDEX idx_activity_analytics_date ON activity_analytics(date);
CREATE INDEX idx_admin_settings_key ON admin_settings(key);
