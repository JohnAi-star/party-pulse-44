-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories Table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Locations Table
CREATE TABLE locations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  postcode text NOT NULL,
  coordinates point,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activities Table
CREATE TABLE activities (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text NOT NULL,
  location_id uuid REFERENCES locations(id),
  category_id uuid REFERENCES categories(id),
  price_from decimal(10,2) NOT NULL,
  duration text NOT NULL,
  group_size text NOT NULL,
  image text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Packages Table
CREATE TABLE packages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity_id uuid REFERENCES activities(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL,
  price decimal(10,2) NOT NULL,
  min_participants integer NOT NULL,
  max_participants integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Bookings Table
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id uuid REFERENCES activities(id) ON DELETE CASCADE,
  package_id uuid REFERENCES packages(id),
  date date NOT NULL,
  group_size integer NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Transactions Table
CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE UNIQUE,
  amount decimal(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'gbp',
  status text NOT NULL,
  stripe_id text UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policies

-- Categories (public read, admin write)
CREATE POLICY "Categories are viewable by everyone" 
  ON categories FOR SELECT 
  TO public 
  USING (true);

-- Locations (public read, admin write)
CREATE POLICY "Locations are viewable by everyone" 
  ON locations FOR SELECT 
  TO public 
  USING (true);

-- Activities (public read, admin write)
CREATE POLICY "Activities are viewable by everyone" 
  ON activities FOR SELECT 
  TO public 
  USING (true);

-- Packages (public read, admin write)
CREATE POLICY "Packages are viewable by everyone" 
  ON packages FOR SELECT 
  TO public 
  USING (true);

-- Bookings (user can read/write own, admin all)
CREATE POLICY "Users can view own bookings" 
  ON bookings FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings" 
  ON bookings FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

-- Transactions (user can read own, admin all)
CREATE POLICY "Users can view own transactions" 
  ON transactions FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE bookings.id = transactions.booking_id 
      AND bookings.user_id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX idx_activities_category ON activities(category_id);
CREATE INDEX idx_activities_location ON activities(location_id);
CREATE INDEX idx_packages_activity ON packages(activity_id);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_activity ON bookings(activity_id);
CREATE INDEX idx_transactions_booking ON transactions(booking_id);