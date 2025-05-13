-- Insert seed data for categories
INSERT INTO categories (name, description) VALUES
  ('Hen Do', 'Fun activities for hen parties and bachelorette celebrations'),
  ('Stag Do', 'Exciting activities for stag parties and bachelor celebrations'),
  ('Team Building', 'Activities designed to improve team collaboration and bonding'),
  ('Birthday', 'Special activities for birthday celebrations'),
  ('Corporate', 'Professional events and activities for corporate groups');

-- Insert seed data for locations
INSERT INTO locations (name, address, city, postcode, coordinates) VALUES
  ('Central London Venue', '123 Oxford Street', 'London', 'W1D 2JD', point(51.5074, -0.1278)),
  ('Manchester City Center', '456 Deansgate', 'Manchester', 'M3 4LQ', point(53.4808, -2.2426)),
  ('Birmingham Hub', '789 Broad Street', 'Birmingham', 'B1 2EA', point(52.4862, -1.8904)),
  ('Edinburgh Castle Area', '321 Royal Mile', 'Edinburgh', 'EH1 2PB', point(55.9533, -3.1883));

-- Insert seed data for activities
INSERT INTO activities (title, description, location_id, category_id, price_from, duration, group_size, image) VALUES
  (
    'Cocktail Masterclass',
    'Learn to mix and create delicious cocktails with professional bartenders',
    (SELECT id FROM locations WHERE city = 'London' LIMIT 1),
    (SELECT id FROM categories WHERE name = 'Hen Do' LIMIT 1),
    35.00,
    '2 hours',
    '6-12 people',
    'https://images.pexels.com/photos/2531186/pexels-photo-2531186.jpeg'
  ),
  (
    'Adventure Racing',
    'Exciting racing experience with professional instructors',
    (SELECT id FROM locations WHERE city = 'Manchester' LIMIT 1),
    (SELECT id FROM categories WHERE name = 'Stag Do' LIMIT 1),
    75.00,
    '3 hours',
    '8-16 people',
    'https://images.pexels.com/photos/12920/pexels-photo-12920.jpeg'
  ),
  (
    'Escape Room Challenge',
    'Test your problem-solving skills in our themed escape rooms',
    (SELECT id FROM locations WHERE city = 'Birmingham' LIMIT 1),
    (SELECT id FROM categories WHERE name = 'Team Building' LIMIT 1),
    25.00,
    '1 hour',
    '4-8 people',
    'https://images.pexels.com/photos/7551658/pexels-photo-7551658.jpeg'
  );

-- Insert seed data for packages
INSERT INTO packages (activity_id, name, description, price, min_participants, max_participants) VALUES
  (
    (SELECT id FROM activities WHERE title = 'Cocktail Masterclass' LIMIT 1),
    'Basic Package',
    'Learn to make 2 classic cocktails',
    35.00,
    6,
    12
  ),
  (
    (SELECT id FROM activities WHERE title = 'Cocktail Masterclass' LIMIT 1),
    'Premium Package',
    'Learn to make 4 cocktails with snacks included',
    55.00,
    6,
    12
  ),
  (
    (SELECT id FROM activities WHERE title = 'Adventure Racing' LIMIT 1),
    'Standard Race',
    '2 races with basic instruction',
    75.00,
    8,
    16
  ),
  (
    (SELECT id FROM activities WHERE title = 'Adventure Racing' LIMIT 1),
    'Pro Experience',
    '4 races with advanced instruction and video recording',
    125.00,
    8,
    16
  ),
  (
    (SELECT id FROM activities WHERE title = 'Escape Room Challenge' LIMIT 1),
    'Single Room',
    'One themed escape room experience',
    25.00,
    4,
    8
  ),
  (
    (SELECT id FROM activities WHERE title = 'Escape Room Challenge' LIMIT 1),
    'Double Room',
    'Two different themed escape rooms',
    45.00,
    4,
    8
  );