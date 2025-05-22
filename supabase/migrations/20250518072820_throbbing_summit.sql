/*
  # Final Database Enhancements
  
  1. New Tables
    - Feedback system
    - FAQ management
    - Blog content
    - Marketing preferences
    - Push notification devices
*/

-- Feedback Table
CREATE TABLE feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  content text NOT NULL,
  status text DEFAULT 'pending',
  admin_response text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- FAQ Categories Table
CREATE TABLE faq_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- FAQ Items Table
CREATE TABLE faq_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES faq_categories(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Blog Categories Table
CREATE TABLE blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Blog Posts Table
CREATE TABLE blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text,
  category_id uuid REFERENCES blog_categories(id),
  author_id uuid REFERENCES auth.users(id),
  status text DEFAULT 'draft',
  published_at timestamptz,
  featured_image text,
  meta_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Marketing Preferences Table
CREATE TABLE marketing_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email_newsletter boolean DEFAULT false,
  special_offers boolean DEFAULT false,
  event_updates boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User Devices Table
CREATE TABLE user_devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  device_token text NOT NULL,
  device_type text NOT NULL,
  is_active boolean DEFAULT true,
  last_used timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_devices ENABLE ROW LEVEL SECURITY;

-- Feedback Policies
CREATE POLICY "Users can view their own feedback"
  ON feedback FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create feedback"
  ON feedback FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- FAQ Policies
CREATE POLICY "FAQ categories are viewable by everyone"
  ON faq_categories FOR SELECT
  USING (true);

CREATE POLICY "FAQ items are viewable by everyone"
  ON faq_items FOR SELECT
  USING (true);

-- Blog Policies
CREATE POLICY "Blog categories are viewable by everyone"
  ON blog_categories FOR SELECT
  USING (true);

CREATE POLICY "Published blog posts are viewable by everyone"
  ON blog_posts FOR SELECT
  USING (status = 'published' OR author_id = auth.uid());

-- Marketing Preferences Policies
CREATE POLICY "Users can manage their marketing preferences"
  ON marketing_preferences
  USING (user_id = auth.uid());

-- User Devices Policies
CREATE POLICY "Users can manage their devices"
  ON user_devices
  USING (user_id = auth.uid());

-- Indexes
CREATE INDEX idx_feedback_user ON feedback(user_id);
CREATE INDEX idx_feedback_status ON feedback(status);
CREATE INDEX idx_faq_items_category ON faq_items(category_id);
CREATE INDEX idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_marketing_prefs_user ON marketing_preferences(user_id);
CREATE INDEX idx_user_devices_user ON user_devices(user_id);
CREATE INDEX idx_user_devices_token ON user_devices(device_token);