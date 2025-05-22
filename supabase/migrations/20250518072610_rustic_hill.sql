/*
  # Add Missing Features and Enhancements

  1. New Tables
    - loyalty_points
    - loyalty_tiers
    - loyalty_rewards
    - notifications
    - notification_preferences
    - messages
    - chat_rooms
    
  2. Security
    - Enable RLS
    - Add appropriate policies
*/

-- Loyalty Points Table
CREATE TABLE loyalty_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  points integer NOT NULL DEFAULT 0,
  earned_from uuid REFERENCES bookings(id),
  type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Loyalty Tiers Table
CREATE TABLE loyalty_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  required_points integer NOT NULL,
  benefits jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Loyalty Rewards Table
CREATE TABLE loyalty_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_type text NOT NULL,
  points_cost integer NOT NULL,
  status text DEFAULT 'active',
  redeemed_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Notifications Table
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  type text NOT NULL,
  read boolean DEFAULT false,
  action_url text,
  created_at timestamptz DEFAULT now()
);

-- Notification Preferences Table
CREATE TABLE notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  email boolean DEFAULT true,
  push boolean DEFAULT true,
  in_app boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Chat Rooms Table
CREATE TABLE chat_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL, -- 'party_planning', 'supplier_chat', 'support'
  party_plan_id uuid REFERENCES party_plans(id),
  created_at timestamptz DEFAULT now()
);

-- Messages Table
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_room_id uuid REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  attachments jsonb DEFAULT '[]',
  read_by jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Loyalty Points Policies
CREATE POLICY "Users can view their own loyalty points"
  ON loyalty_points FOR SELECT
  USING (user_id = auth.uid());

-- Loyalty Tiers Policies
CREATE POLICY "Loyalty tiers are viewable by everyone"
  ON loyalty_tiers FOR SELECT
  USING (true);

-- Loyalty Rewards Policies
CREATE POLICY "Users can view their own rewards"
  ON loyalty_rewards FOR SELECT
  USING (user_id = auth.uid());

-- Notifications Policies
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

-- Notification Preferences Policies
CREATE POLICY "Users can manage their notification preferences"
  ON notification_preferences
  USING (user_id = auth.uid());

-- Chat Rooms Policies
CREATE POLICY "Users can access their chat rooms"
  ON chat_rooms FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM party_plans
      WHERE party_plans.id = chat_rooms.party_plan_id
      AND EXISTS (
        SELECT 1 FROM bookings
        WHERE bookings.id = party_plans.booking_id
        AND bookings.user_id = auth.uid()
      )
    )
    OR
    EXISTS (
      SELECT 1 FROM messages
      WHERE messages.chat_room_id = chat_rooms.id
      AND messages.user_id = auth.uid()
    )
  );

-- Messages Policies
CREATE POLICY "Users can access messages in their chat rooms"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chat_rooms
      WHERE chat_rooms.id = messages.chat_room_id
      AND (
        EXISTS (
          SELECT 1 FROM party_plans
          WHERE party_plans.id = chat_rooms.party_plan_id
          AND EXISTS (
            SELECT 1 FROM bookings
            WHERE bookings.id = party_plans.booking_id
            AND bookings.user_id = auth.uid()
          )
        )
        OR
        EXISTS (
          SELECT 1 FROM messages AS m
          WHERE m.chat_room_id = chat_rooms.id
          AND m.user_id = auth.uid()
        )
      )
    )
  );

-- Indexes
CREATE INDEX idx_loyalty_points_user ON loyalty_points(user_id);
CREATE INDEX idx_loyalty_rewards_user ON loyalty_rewards(user_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notification_prefs_user ON notification_preferences(user_id);
CREATE INDEX idx_messages_chat_room ON messages(chat_room_id);
CREATE INDEX idx_messages_user ON messages(user_id);
CREATE INDEX idx_chat_rooms_party_plan ON chat_rooms(party_plan_id);