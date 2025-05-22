/*
  # Enhanced Booking Features and Party Planning Tools

  1. New Tables
    - party_plans
      - Store party planning details and timelines
    - guest_lists
      - Manage guest information and RSVPs
    - menu_items
      - Food and beverage options
    - table_plans
      - Table arrangements and seating
    - checklists
      - Planning tasks and timelines
    
  2. Security
    - Enable RLS
    - Add appropriate policies
*/

-- Party Plans
CREATE TABLE party_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  date date NOT NULL,
  budget decimal(10,2),
  status text DEFAULT 'planning',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Guest Lists
CREATE TABLE guest_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  party_plan_id uuid REFERENCES party_plans(id) ON DELETE CASCADE,
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

-- Menu Items
CREATE TABLE menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  party_plan_id uuid REFERENCES party_plans(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    price decimal(10,2) NOT NULL,
)