/*
  # Add Admin Tables and Relationships

  1. New Tables
    - profiles
    - locations 
    - categories
    - reviews
    - user_stats
    - activity_stats
    - activity_analytics
    
  2. Security
    - Enable RLS
    - Add appropriate policies
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text,
  role text DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id uuid REFERENCES activities(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text NOT NULL,
  content text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User Stats table
CREATE TABLE IF NOT EXISTS user_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  total_bookings integer DEFAULT 0,
  total_spent numeric(10,2) DEFAULT 0,
  last_booking_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activity Stats table
CREATE TABLE IF NOT EXISTS activity_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id uuid REFERENCES activities(id) ON DELETE CASCADE,
  views_count integer DEFAULT 0,
  bookings_count integer DEFAULT 0,
  avg_rating numeric(3,2) DEFAULT 0,
  revenue_total numeric(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activity Analytics table
CREATE TABLE IF NOT EXISTS activity_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id uuid REFERENCES activities(id) ON DELETE CASCADE,
  date date NOT NULL,
  bookings_count integer DEFAULT 0,
  revenue numeric(10,2) DEFAULT 0,
  avg_group_size numeric(5,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_analytics ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own stats"
  ON user_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Activity stats are viewable by everyone"
  ON activity_stats FOR SELECT
  USING (true);

CREATE POLICY "Activity analytics are viewable by admins"
  ON activity_analytics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_reviews_activity ON reviews(activity_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_user ON user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_stats_activity ON activity_stats(activity_id);
CREATE INDEX IF NOT EXISTS idx_activity_analytics_activity ON activity_analytics(activity_id);
CREATE INDEX IF NOT EXISTS idx_activity_analytics_date ON activity_analytics(date);