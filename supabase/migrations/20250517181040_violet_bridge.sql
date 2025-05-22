/*
  # Party Planning Schema

  1. New Tables
    - `party_plans`
      - Main table for party planning details
      - Tracks budget, date, status, etc.
    - `guest_lists`
      - Manages guest information and RSVPs
    - `menu_items`
      - Stores menu planning details
    - `table_layouts`
      - Handles seating arrangements
    - `party_timelines`
      - Tracks event schedule and milestones
    - `suppliers`
      - Stores vendor/supplier information
    - `supplier_services`
      - Links suppliers to specific services
    - `payment_plans`
      - Manages split payments and installments
    - `payment_installments`
      - Tracks individual payment installments

  2. Security
    - Enable RLS on all tables
    - Add policies for user access
*/

-- Party Plans
CREATE TABLE IF NOT EXISTS party_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id),
  title text NOT NULL,
  description text,
  date timestamptz NOT NULL,
  budget decimal(10,2),
  status text DEFAULT 'planning',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE party_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own party plans"
  ON party_plans
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = party_plans.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

-- Guest Lists
CREATE TABLE IF NOT EXISTS guest_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  party_plan_id uuid REFERENCES party_plans(id),
  name text NOT NULL,
  email text,
  phone text,
  status text DEFAULT 'pending',
  dietary_requirements text,
  plus_ones integer DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE guest_lists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their guest lists"
  ON guest_lists
  USING (
    EXISTS (
      SELECT 1 FROM party_plans
      JOIN bookings ON bookings.id = party_plans.booking_id
      WHERE party_plans.id = guest_lists.party_plan_id
      AND bookings.user_id = auth.uid()
    )
  );

-- Menu Items
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  party_plan_id uuid REFERENCES party_plans(id),
  name text NOT NULL,
  description text,
  type text NOT NULL,
  price_per_person decimal(10,2),
  dietary_info jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their menu items"
  ON menu_items
  USING (
    EXISTS (
      SELECT 1 FROM party_plans
      JOIN bookings ON bookings.id = party_plans.booking_id
      WHERE party_plans.id = menu_items.party_plan_id
      AND bookings.user_id = auth.uid()
    )
  );

-- Table Layouts
CREATE TABLE IF NOT EXISTS table_layouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  party_plan_id uuid REFERENCES party_plans(id),
  name text NOT NULL,
  capacity integer NOT NULL,
  layout jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE table_layouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their table layouts"
  ON table_layouts
  USING (
    EXISTS (
      SELECT 1 FROM party_plans
      JOIN bookings ON bookings.id = party_plans.booking_id
      WHERE party_plans.id = table_layouts.party_plan_id
      AND bookings.user_id = auth.uid()
    )
  );

-- Party Timelines
CREATE TABLE IF NOT EXISTS party_timelines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  party_plan_id uuid REFERENCES party_plans(id),
  title text NOT NULL,
  description text,
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE party_timelines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their timelines"
  ON party_timelines
  USING (
    EXISTS (
      SELECT 1 FROM party_plans
      JOIN bookings ON bookings.id = party_plans.booking_id
      WHERE party_plans.id = party_timelines.party_plan_id
      AND bookings.user_id = auth.uid()
    )
  );

-- Suppliers
CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  contact_name text,
  email text,
  phone text,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view suppliers"
  ON suppliers
  FOR SELECT
  TO authenticated
  USING (true);

-- Supplier Services
CREATE TABLE IF NOT EXISTS supplier_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid REFERENCES suppliers(id),
  name text NOT NULL,
  description text,
  price decimal(10,2),
  min_guests integer,
  max_guests integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE supplier_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view supplier services"
  ON supplier_services
  FOR SELECT
  TO authenticated
  USING (true);

-- Payment Plans
CREATE TABLE IF NOT EXISTS payment_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id),
  total_amount decimal(10,2) NOT NULL,
  deposit_amount decimal(10,2) NOT NULL,
  installment_count integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE payment_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their payment plans"
  ON payment_plans
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = payment_plans.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

-- Payment Installments
CREATE TABLE IF NOT EXISTS payment_installments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_plan_id uuid REFERENCES payment_plans(id),
  amount decimal(10,2) NOT NULL,
  due_date date NOT NULL,
  status text DEFAULT 'pending',
  paid_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE payment_installments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their payment installments"
  ON payment_installments
  USING (
    EXISTS (
      SELECT 1 FROM payment_plans
      JOIN bookings ON bookings.id = payment_plans.booking_id
      WHERE payment_plans.id = payment_installments.payment_plan_id
      AND bookings.user_id = auth.uid()
    )
  );

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_party_plans_updated_at
    BEFORE UPDATE ON party_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guest_lists_updated_at
    BEFORE UPDATE ON guest_lists
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at
    BEFORE UPDATE ON menu_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_table_layouts_updated_at
    BEFORE UPDATE ON table_layouts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_party_timelines_updated_at
    BEFORE UPDATE ON party_timelines
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at
    BEFORE UPDATE ON suppliers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_supplier_services_updated_at
    BEFORE UPDATE ON supplier_services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_plans_updated_at
    BEFORE UPDATE ON payment_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_installments_updated_at
    BEFORE UPDATE ON payment_installments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();