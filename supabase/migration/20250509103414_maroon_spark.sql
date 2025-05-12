/*
  # Add Reviews and Administrative Features

  1. New Tables
    - reviews
      - User reviews and ratings for activities
      - Metadata and moderation status
    - activity_stats
      - Analytics and metrics for activities
    - admin_logs
      - Audit trail for administrative actions
    
  2. Security
    - Enable RLS on all new tables
    - Add admin-specific policies
*/

-- Reviews Table
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id uuid REFERENCES activities(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text NOT NULL,
  content text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  moderated_at timestamptz,
  moderated_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activity Stats Table
CREATE TABLE activity_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id uuid REFERENCES activities(id) ON DELETE CASCADE,
  views_count integer DEFAULT 0,
  bookings_count integer DEFAULT 0,
  avg_rating numeric(3,2) DEFAULT 0,
  revenue_total numeric(10,2) DEFAULT 0,
  last_updated timestamptz DEFAULT now()
);

-- Admin Logs Table
CREATE TABLE admin_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  details jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- Reviews Policies
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  TO public
  USING (status = 'approved');

CREATE POLICY "Users can create reviews for booked activities"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE user_id = auth.uid()
      AND activity_id = reviews.activity_id
      AND status = 'completed'
    )
  );

-- Activity Stats Policies
CREATE POLICY "Stats are viewable by everyone"
  ON activity_stats FOR SELECT
  TO public
  USING (true);

-- Admin Logs Policies
CREATE POLICY "Admin logs are viewable by admins only"
  ON admin_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Add indexes
CREATE INDEX idx_reviews_activity_id ON reviews(activity_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_activity_stats_activity_id ON activity_stats(activity_id);
CREATE INDEX idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX idx_admin_logs_entity_type ON admin_logs(entity_type);