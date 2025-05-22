/*
  # Add Gift Cards and Enhanced Packages

  1. New Tables
    - gift_cards
      - Store gift card information and balances
    - package_addons
      - Additional options for packages
    
  2. Security
    - Enable RLS
    - Add appropriate policies
*/

-- Gift Cards table
CREATE TABLE gift_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  initial_balance decimal(10,2) NOT NULL,
  current_balance decimal(10,2) NOT NULL,
  purchaser_id uuid REFERENCES auth.users(id),
  recipient_email text,
  recipient_name text,
  message text,
  expires_at timestamptz,
  redeemed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Package Addons table
CREATE TABLE package_addons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id uuid REFERENCES packages(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Gift Card Transactions table
CREATE TABLE gift_card_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gift_card_id uuid REFERENCES gift_cards(id) ON DELETE CASCADE,
  booking_id uuid REFERENCES bookings(id),
  amount decimal(10,2) NOT NULL,
  type text NOT NULL CHECK (type IN ('purchase', 'redemption')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE gift_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_card_transactions ENABLE ROW LEVEL SECURITY;

-- Gift Cards policies
CREATE POLICY "Users can view their purchased or received gift cards"
  ON gift_cards FOR SELECT
  USING (
    purchaser_id = auth.uid() OR 
    recipient_email IN (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can purchase gift cards"
  ON gift_cards FOR INSERT
  WITH CHECK (purchaser_id = auth.uid());

-- Package Addons policies
CREATE POLICY "Package addons are viewable by everyone"
  ON package_addons FOR SELECT
  USING (true);

-- Gift Card Transactions policies
CREATE POLICY "Users can view their gift card transactions"
  ON gift_card_transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM gift_cards
      WHERE gift_cards.id = gift_card_transactions.gift_card_id
      AND (
        gift_cards.purchaser_id = auth.uid() OR
        gift_cards.recipient_email IN (
          SELECT email FROM auth.users WHERE id = auth.uid()
        )
      )
    )
  );

-- Indexes
CREATE INDEX idx_gift_cards_code ON gift_cards(code);
CREATE INDEX idx_gift_cards_purchaser ON gift_cards(purchaser_id);
CREATE INDEX idx_package_addons_package ON package_addons(package_id);
CREATE INDEX idx_gift_card_transactions_gift_card ON gift_card_transactions(gift_card_id);
CREATE INDEX idx_gift_card_transactions_booking ON gift_card_transactions(booking_id);