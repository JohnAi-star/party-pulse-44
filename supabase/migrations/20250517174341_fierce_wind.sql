/*
  # Venue Management System and Enhanced Features

  1. New Tables
    - venues
      - Store venue details, capacity, pricing
    - venue_images
      - Photos and virtual tour media
    - venue_availability
      - Calendar and booking slots
    - venue_amenities
      - Features and facilities
    - suppliers
      - Service providers (catering, entertainment, etc.)
    - supplier_services
      - Available services and pricing
    - party_timelines
      - Event planning milestones
    - payment_plans
      - Installment and deposit tracking
    
  2. Security
    - Enable RLS
    - Add appropriate policies
*/

-- Venues Table
CREATE TABLE venues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  postcode text NOT NULL,
  coordinates point,
  capacity_min integer NOT NULL,
  capacity_max integer NOT NULL,
  price_per_hour decimal(10,2) NOT NULL,
  floor_plan_url text,
  virtual_tour_url text,
  features jsonb DEFAULT '[]',
  rules text[],
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Venue Images Table
CREATE TABLE venue_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id uuid REFERENCES venues(id) ON DELETE CASCADE,
  url text NOT NULL,
  type text NOT NULL, -- 'photo', 'virtual_tour', 'floor_plan'
  description text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Venue Availability Table
CREATE TABLE venue_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id uuid REFERENCES venues(id) ON DELETE CASCADE,
  date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_available boolean DEFAULT true,
  price_override decimal(10,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Venue Amenities Table
CREATE TABLE venue_amenities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id uuid REFERENCES venues(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price decimal(10,2),
  is_included boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Suppliers Table
CREATE TABLE suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL, -- 'catering', 'entertainment', 'decoration', 'equipment'
  description text,
  contact_email text,
  contact_phone text,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Supplier Services Table
CREATE TABLE supplier_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid REFERENCES suppliers(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  min_guests integer,
  max_guests integer,
  created_at timestamptz DEFAULT now()
);

-- Party Timelines Table
CREATE TABLE party_timelines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  party_plan_id uuid REFERENCES party_plans(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Payment Plans Table
CREATE TABLE payment_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  total_amount decimal(10,2) NOT NULL,
  deposit_amount decimal(10,2) NOT NULL,
  installment_count integer NOT NULL,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Payment Installments Table
CREATE TABLE payment_installments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_plan_id uuid REFERENCES payment_plans(id) ON DELETE CASCADE,
  amount decimal(10,2) NOT NULL,
  due_date date NOT NULL,
  status text DEFAULT 'pending',
  paid_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE party_timelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_installments ENABLE ROW LEVEL SECURITY;

-- Venues Policies
CREATE POLICY "Venues are viewable by everyone"
  ON venues FOR SELECT
  USING (true);

-- Venue Images Policies
CREATE POLICY "Venue images are viewable by everyone"
  ON venue_images FOR SELECT
  USING (true);

-- Venue Availability Policies
CREATE POLICY "Venue availability is viewable by everyone"
  ON venue_availability FOR SELECT
  USING (true);

-- Venue Amenities Policies
CREATE POLICY "Venue amenities are viewable by everyone"
  ON venue_amenities FOR SELECT
  USING (true);

-- Suppliers Policies
CREATE POLICY "Suppliers are viewable by everyone"
  ON suppliers FOR SELECT
  USING (true);

-- Supplier Services Policies
CREATE POLICY "Supplier services are viewable by everyone"
  ON supplier_services FOR SELECT
  USING (true);

-- Party Timelines Policies
CREATE POLICY "Users can view own party timelines"
  ON party_timelines FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM party_plans
      WHERE party_plans.id = party_timelines.party_plan_id
      AND party_plans.booking_id IN (
        SELECT id FROM bookings WHERE user_id = auth.uid()
      )
    )
  );

-- Payment Plans Policies
CREATE POLICY "Users can view own payment plans"
  ON payment_plans FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = payment_plans.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

-- Payment Installments Policies
CREATE POLICY "Users can view own payment installments"
  ON payment_installments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM payment_plans
      JOIN bookings ON bookings.id = payment_plans.booking_id
      WHERE payment_plans.id = payment_installments.payment_plan_id
      AND bookings.user_id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX idx_venues_city ON venues(city);
CREATE INDEX idx_venue_images_venue ON venue_images(venue_id);
CREATE INDEX idx_venue_availability_venue ON venue_availability(venue_id);
CREATE INDEX idx_venue_availability_date ON venue_availability(date);
CREATE INDEX idx_venue_amenities_venue ON venue_amenities(venue_id);
CREATE INDEX idx_supplier_services_supplier ON supplier_services(supplier_id);
CREATE INDEX idx_party_timelines_party_plan ON party_timelines(party_plan_id);
CREATE INDEX idx_payment_plans_booking ON payment_plans(booking_id);
CREATE INDEX idx_payment_installments_plan ON payment_installments(payment_plan_id);