export const MOCK_ACTIVITIES = [
  {
    id: '1',
    title: 'Cocktail Making Masterclass',
    description: 'Learn the art of mixology from expert bartenders in this hands-on cocktail making class. Perfect for hen parties, birthdays, or corporate events. Create and enjoy 4 signature cocktails while learning professional techniques and tricks.',
    city: 'London',
    region: 'Greater London',
    priceFrom: 35,
    image: 'https://images.pexels.com/photos/2531186/pexels-photo-2531186.jpeg',
    category: 'Hen Do',
    subcategory: 'Food & Drink',
    rating: 4.8,
    duration: '2 hours',
    groupSize: '8-15',
    features: [
      'Create 4 signature cocktails',
      'Professional mixologist instruction',
      'All equipment and ingredients provided',
      'Take home recipe cards',
      'Welcome drink on arrival',
      'Cocktail making certificate',
      'Photos of your experience'
    ],
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    location: {
      address: '123 Party Street, Soho',
      postcode: 'W1F 7HQ',
      coordinates: { lat: 51.5074, lng: -0.1278 }
    }
  },
  {
    id: '2',
    title: 'Beer Tasting Tour',
    description: 'Sample the finest craft beers with our guided brewery tour. Great for stag dos and team building events.',
    city: 'Manchester',
    region: 'Greater Manchester',
    priceFrom: 35,
    image: 'https://images.pexels.com/photos/5530171/pexels-photo-5530171.jpeg',
    category: 'Stag Do',
    subcategory: 'Food & Drink',
    rating: 4.6,
    duration: '3 hours',
    groupSize: '10-20',
    features: ['5 beer samples', 'Brewery tour', 'Food pairing'],
    availability: ['Thursday', 'Friday', 'Saturday', 'Sunday'],
    location: {
      address: '456 Brewery Lane',
      postcode: 'M1 1AA',
      coordinates: { lat: 53.4808, lng: -2.2426 }
    }
  },
  {
    id: '3',
    title: 'Escape Room Challenge',
    description: 'Test your problem-solving skills in our themed escape rooms. Perfect for team building and birthday parties.',
    city: 'Birmingham',
    region: 'West Midlands',
    priceFrom: 22,
    image: 'https://images.pexels.com/photos/4019766/pexels-photo-4019766.jpeg',
    category: 'Team Building',
    subcategory: 'Games & Puzzles',
    rating: 4.9,
    duration: '1 hour',
    groupSize: '4-8',
    features: ['Multiple themes', 'Game master assistance', 'Team photo'],
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    location: {
      address: '789 Puzzle Street',
      postcode: 'B1 1BB',
      coordinates: { lat: 52.4862, lng: -1.8904 }
    }
  },
  {
    id: '4',
    title: 'Pottery Workshop',
    description: 'Get creative with clay in our hands-on pottery workshop. Ideal for hen parties and special celebrations.',
    city: 'Leeds',
    region: 'West Yorkshire',
    priceFrom: 45,
    image: 'https://images.pexels.com/photos/7262997/pexels-photo-7262997.jpeg',
    category: 'Hen Do',
    subcategory: 'Arts & Crafts',
    rating: 4.7,
    duration: '2.5 hours',
    groupSize: '6-12',
    features: ['Materials included', 'Take home creation', 'Expert guidance'],
    availability: ['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    location: {
      address: '101 Creative Avenue',
      postcode: 'LS1 1AA',
      coordinates: { lat: 53.8008, lng: -1.5491 }
    }
  },
  {
    id: '5',
    title: 'Axe Throwing',
    description: 'Release your inner viking with our exciting axe throwing activity. Perfect for stag dos and team bonding.',
    city: 'Liverpool',
    region: 'Merseyside',
    priceFrom: 25,
    image: 'https://images.pexels.com/photos/8111298/pexels-photo-8111298.jpeg',
    category: 'Stag Do',
    subcategory: 'Sports & Adventure',
    rating: 4.5,
    duration: '1.5 hours',
    groupSize: '8-16',
    features: ['Safety equipment', 'Professional instruction', 'Competition format'],
    availability: ['Thursday', 'Friday', 'Saturday', 'Sunday'],
    location: {
      address: '202 Viking Road',
      postcode: 'L1 1BB',
      coordinates: { lat: 53.4084, lng: -2.9916 }
    }
  },
  {
    id: '6',
    title: 'Sushi Making Class',
    description: 'Learn the art of sushi making from professional chefs. Great for birthdays and corporate events.',
    city: 'Edinburgh',
    region: 'Scotland',
    priceFrom: 40,
    image: 'https://images.pexels.com/photos/8951999/pexels-photo-8951999.jpeg',
    category: 'Birthday',
    subcategory: 'Food & Drink',
    rating: 4.8,
    duration: '2 hours',
    groupSize: '8-12',
    features: ['Ingredients provided', 'Take home sushi', 'Recipe booklet'],
    availability: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    location: {
      address: '303 Sushi Street',
      postcode: 'EH1 1BB',
      coordinates: { lat: 55.9533, lng: -3.1883 }
    }
  },
  {
    id: '7',
    title: 'Wine Tasting Experience',
    description: 'Sample premium wines with expert guidance. Perfect for sophisticated hen parties and celebrations.',
    city: 'Bristol',
    region: 'South West',
    priceFrom: 38,
    image: 'https://images.pexels.com/photos/5946975/pexels-photo-5946975.jpeg',
    category: 'Hen Do',
    subcategory: 'Food & Drink',
    rating: 4.7,
    duration: '2 hours',
    groupSize: '8-20',
    features: ['6 wine samples', 'Cheese pairing', 'Expert sommelier'],
    availability: ['Wednesday', 'Thursday', 'Friday', 'Saturday'],
    location: {
      address: '404 Wine Lane',
      postcode: 'BS1 1AA',
      coordinates: { lat: 51.4545, lng: -2.5879 }
    }
  },
  {
    id: '8',
    title: 'Go Karting Grand Prix',
    description: 'Race against friends on our professional indoor track. Ideal for stag dos and team events.',
    city: 'Newcastle',
    region: 'North East',
    priceFrom: 50,
    image: 'https://images.pexels.com/photos/9827179/pexels-photo-9827179.jpeg',
    category: 'Stag Do',
    subcategory: 'Sports & Adventure',
    rating: 4.9,
    duration: '2 hours',
    groupSize: '10-24',
    features: ['Race suit & helmet', 'Practice laps', 'Trophy ceremony'],
    availability: ['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    location: {
      address: '505 Racing Circuit',
      postcode: 'NE1 1BB',
      coordinates: { lat: 54.9783, lng: -1.6178 }
    }
  },
  {
    id: '9',
    title: 'Indoor Rock Climbing',
    description: 'Challenge yourself on our indoor climbing walls. Great for team building and adventure seekers.',
    city: 'Glasgow',
    region: 'Scotland',
    priceFrom: 30,
    image: 'https://images.pexels.com/photos/371049/pexels-photo-371049.jpeg',
    category: 'Team Building',
    subcategory: 'Sports & Adventure',
    rating: 4.8,
    duration: '2 hours',
    groupSize: '6-12',
    features: ['Equipment provided', 'Qualified instructors', 'All skill levels'],
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    location: {
      address: '606 Climbing Way',
      postcode: 'G1 1AA',
      coordinates: { lat: 55.8642, lng: -4.2518 }
    }
  },
  {
    id: '10',
    title: 'Chocolate Making Workshop',
    description: 'Create your own luxury chocolates with professional chocolatiers. Perfect for birthdays and hen parties.',
    city: 'Cardiff',
    region: 'Wales',
    priceFrom: 45,
    image: 'https://images.pexels.com/photos/65882/chocolate-dark-coffee-confiserie-65882.jpeg',
    category: 'Birthday',
    subcategory: 'Food & Drink',
    rating: 4.9,
    duration: '2.5 hours',
    groupSize: '8-15',
    features: ['All ingredients provided', 'Take home creations', 'Hot chocolate included'],
    availability: ['Thursday', 'Friday', 'Saturday', 'Sunday'],
    location: {
      address: '707 Chocolate Lane',
      postcode: 'CF1 1BB',
      coordinates: { lat: 51.4816, lng: -3.1791 }
    }
  },
  {
    id: '11',
    title: 'Pizza Making Workshop',
    description: 'Learn the secrets of authentic Italian pizza making from our expert chefs. Perfect for team building or birthday celebrations. Create your own pizzas from scratch using premium ingredients and traditional techniques.',
    city: 'Manchester',
    region: 'Greater Manchester',
    priceFrom: 40,
    image: 'https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg',
    category: 'Team Building',
    subcategory: 'Food & Drink',
    rating: 4.7,
    duration: '2.5 hours',
    groupSize: '8-16',
    features: [
      'Make 2 pizzas from scratch',
      'Professional chef instruction',
      'All ingredients provided',
      'Wine or beer included',
      'Take home recipe guide',
      'Eat your creations',
      'Group photo'
    ],
    availability: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    location: {
      address: '45 Culinary Lane',
      postcode: 'M1 2WR',
      coordinates: { lat: 53.4808, lng: -2.2426 }
    }
  },
  {
    id: '12',
    title: 'Pottery Painting Party',
    description: 'Get creative with this relaxing pottery painting session. Choose from a wide selection of ceramic pieces and create your own unique masterpiece. Perfect for hen parties and birthday celebrations.',
    city: 'Brighton',
    region: 'South East',
    priceFrom: 28,
    image: 'https://images.pexels.com/photos/4992432/pexels-photo-4992432.jpeg',
    category: 'Birthday',
    subcategory: 'Arts & Crafts',
    rating: 4.9,
    duration: '2 hours',
    groupSize: '6-12',
    features: [
      'Choose from wide range of ceramics',
      'All paints and materials included',
      'Expert guidance available',
      'Glazing and firing included',
      'Take home your creation',
      'Complimentary refreshments',
      'Private party space'
    ],
    availability: ['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    location: {
      address: '78 Creative Corner',
      postcode: 'BN1 3XP',
      coordinates: { lat: 50.8225, lng: -0.1372 }
    }
  },
  {
    id: '13',
    title: 'Virtual Reality Experience',
    description: 'Step into the future with this immersive VR gaming session. Perfect for stag dos and team building events. Compete in various virtual worlds and challenges using state-of-the-art VR equipment.',
    city: 'Leeds',
    region: 'Yorkshire',
    priceFrom: 32,
    image: 'https://images.pexels.com/photos/8728285/pexels-photo-8728285.jpeg',
    category: 'Stag Do',
    subcategory: 'Gaming',
    rating: 4.8,
    duration: '1.5 hours',
    groupSize: '4-8',
    features: [
      'Latest VR equipment',
      'Multiple game options',
      'Competitive challenges',
      'Professional instruction',
      'Private gaming space',
      'Scoreboard and prizes',
      'Photos and videos included'
    ],
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    location: {
      address: '90 Digital Hub',
      postcode: 'LS1 5QB',
      coordinates: { lat: 53.8008, lng: -1.5491 }
    }
  },
  {
    id: '14',
    title: 'Afternoon Tea Dance',
    description: 'Combine a delightful afternoon tea with dance lessons in this unique experience. Learn classic dance moves while enjoying a selection of sandwiches, scones, and cakes. Perfect for hen parties and special celebrations.',
    city: 'Edinburgh',
    region: 'Scotland',
    priceFrom: 45,
    image: 'https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg',
    category: 'Hen Do',
    subcategory: 'Food & Dance',
    rating: 4.9,
    duration: '3 hours',
    groupSize: '10-20',
    features: [
      'Professional dance instruction',
      'Full afternoon tea service',
      'Prosecco reception',
      'Live music',
      'Private venue hire',
      'Photo opportunities',
      'Take home goodie bag'
    ],
    availability: ['Friday', 'Saturday', 'Sunday'],
    location: {
      address: '123 Royal Mile',
      postcode: 'EH1 1TH',
      coordinates: { lat: 55.9533, lng: -3.1883 }
    }
  },
  {
    id: '15',
    title: 'Chocolate Truffle Making Workshop',
    description: 'Indulge in a decadent chocolate-making session guided by master chocolatiers. Craft your own luxury truffles, perfect for gifting or treating yourself.',
    city: 'Manchester',
    region: 'Greater Manchester',
    priceFrom: 30,
    image: 'https://images.pexels.com/photos/616353/pexels-photo-616353.jpeg',
    category: 'Hen Do',
    subcategory: 'Food & Drink',
    rating: 4.9,
    duration: '1.5 hours',
    groupSize: '6-20',
    features: [
      'Make 12 luxury truffles',
      'Expert chocolatier guidance',
      'Decorating and packaging included',
      'Take-home gift box',
      'Glass of prosecco included'
    ],
    availability: ['Friday', 'Saturday', 'Sunday'],
    location: {
      address: '44 Deansgate, Manchester',
      postcode: 'M3 2BW',
      coordinates: { lat: 53.4810, lng: -2.2446 }
    }
  },
  {
    id: '16',
    title: 'Afternoon Tea Bus Tour',
    description: 'Experience the sights of London aboard a vintage double-decker bus while enjoying a classic British afternoon tea with finger sandwiches, scones, and pastries.',
    city: 'London',
    region: 'Greater London',
    priceFrom: 45,
    image: 'https://images.pexels.com/photos/239581/pexels-photo-239581.jpeg',
    category: 'Hen Do',
    subcategory: 'Food & Drink',
    rating: 4.7,
    duration: '1.5 hours',
    groupSize: '2-30',
    features: [
      'Classic afternoon tea',
      'Vintage double-decker bus ride',
      'Sightseeing around London landmarks',
      'Vegetarian and gluten-free options available'
    ],
    availability: ['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    location: {
      address: 'Victoria Coach Station, London',
      postcode: 'SW1W 9RH',
      coordinates: { lat: 51.4941, lng: -0.1479 }
    }
  },
  {
    id: '17',
    title: 'Flower Crown Making Workshop',
    description: 'Unleash your creativity in this relaxed and fun workshop where you will learn to craft beautiful flower crowns with fresh blooms – perfect for bridal showers or festivals.',
    city: 'Brighton',
    region: 'East Sussex',
    priceFrom: 28,
    image: 'https://images.pexels.com/photos/461940/pexels-photo-461940.jpeg',
    category: 'Hen Do',
    subcategory: 'Creative & Crafty',
    rating: 4.6,
    duration: '2 hours',
    groupSize: '5-15',
    features: [
      'All materials included',
      'Guided by professional florists',
      'Take-home flower crown',
      'Glass of bubbly included'
    ],
    availability: ['Saturday', 'Sunday'],
    location: {
      address: 'North Laine Workshop, Brighton',
      postcode: 'BN1 4GH',
      coordinates: { lat: 50.8284, lng: -0.1411 }
    }
  },
  {
    id: '18',
    title: 'Salsa Dancing Experience',
    description: 'Get your hips moving with an energetic salsa dance lesson, led by passionate instructors. Ideal for groups looking to have fun, laugh, and learn new moves.',
    city: 'Birmingham',
    region: 'West Midlands',
    priceFrom: 25,
    image: 'https://images.pexels.com/photos/797949/pexels-photo-797949.jpeg',
    category: 'Hen Do',
    subcategory: 'Active & Dance',
    rating: 4.5,
    duration: '1 hour',
    groupSize: '6-20',
    features: [
      'Learn salsa basics',
      'Fun group choreography',
      'Professional dance instructor',
      'No experience needed'
    ],
    availability: ['Friday', 'Saturday'],
    location: {
      address: '123 Dance Studio, Birmingham',
      postcode: 'B1 1AA',
      coordinates: { lat: 52.4786, lng: -1.9080 }
    }
  },
  {
    id: '19',
    title: 'Cocktail Making Masterclass',
    description: 'Learn the art of mixology from expert bartenders in this hands-on cocktail making class. Perfect for hen parties, birthdays, or corporate events. Create and enjoy 4 signature cocktails while learning professional techniques and tricks.',
    city: 'London',
    region: 'Greater London',
    priceFrom: 35,
    image: 'https://images.pexels.com/photos/2531186/pexels-photo-2531186.jpeg',
    category: 'Hen Do',
    subcategory: 'Food & Drink',
    rating: 4.8,
    duration: '2 hours',
    groupSize: '8-15',
    features: [
      'Create 4 signature cocktails',
      'Professional mixologist instruction',
      'All equipment and ingredients provided',
      'Take home recipe cards',
      'Welcome drink on arrival',
      'Cocktail making certificate',
      'Photos of your experience'
    ],
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    location: {
      address: '123 Party Street, Soho',
      postcode: 'W1F 7HQ',
      coordinates: { lat: 51.5074, lng: -0.1278 }
    }
  },
  {
    id: '20',
    title: 'Chocolate Making Workshop',
    description: 'A delicious hands-on experience where you’ll learn to craft artisanal chocolates with a master chocolatier. Perfect for date nights, birthdays, or team-building events.',
    city: 'Manchester',
    region: 'North West',
    priceFrom: 30,
    image: 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', // High-res chocolate workshop
    category: 'Team Building',
    subcategory: 'Food & Drink',
    rating: 4.7,
    duration: '1.5 hours',
    groupSize: '6-12',
    features: [
      'Handmade truffles & chocolate bars',
      'Professional chocolatier guidance',
      'All ingredients provided',
      'Take-home treats',
      'Personalized packaging',
      'Tasting session'
    ],
    availability: ['Thursday', 'Friday', 'Saturday', 'Sunday'],
    location: {
      address: '45 Sweet Avenue, Northern Quarter',
      postcode: 'M4 1HQ',
      coordinates: { lat: 53.4839, lng: -2.2446 }
    }
  },
  {
    id: '21',
    title: 'Pottery Painting Experience',
    description: 'Unleash your creativity in this relaxing pottery painting session. Choose from ceramics like mugs, plates, or vases and decorate them with professional guidance.',
    city: 'Bristol',
    region: 'South West',
    priceFrom: 25,
    image: 'https://images.pexels.com/photos/442559/pexels-photo-442559.jpeg', // High-res pottery painting
    category: 'Creative',
    subcategory: 'Arts & Crafts',
    rating: 4.9,
    duration: '2 hours',
    groupSize: '4-10',
    features: [
      'Selection of bisque pottery',
      'Unlimited paints & tools',
      'Expert tips provided',
      'Kiln firing included',
      'Take home your masterpiece',
      'BYOB option available'
    ],
    availability: ['Wednesday', 'Saturday', 'Sunday'],
    location: {
      address: '22 Artisan Lane, Clifton',
      postcode: 'BS8 4PD',
      coordinates: { lat: 51.4545, lng: -2.6226 }
    }
  },
  {
    id: '22',
    title: 'Escape Room Challenge',
    description: 'Test your problem-solving skills in a themed escape room. Work as a team to solve puzzles, crack codes, and escape before time runs out!',
    city: 'Edinburgh',
    region: 'Scotland',
    priceFrom: 20,
    image: 'https://images.pexels.com/photos/7031723/pexels-photo-7031723.jpeg',
    category: 'Adventure',
    subcategory: 'Games',
    rating: 4.8,
    duration: '1 hour',
    groupSize: '2-6',
    features: [
      'Multiple themed rooms',
      'Live hints available',
      'Private group bookings',
      'Difficulty levels',
      'Team photo at the end',
      'Leaderboard ranking'
    ],
    availability: ['Daily'],
    location: {
      address: '7 Mystery Close, Old Town',
      postcode: 'EH1 1RE',
      coordinates: { lat: 55.9533, lng: -3.1883 }
    }
  },
  {
    id: '23',
    title: 'Gin Distillery Tour & Tasting',
    description: 'Discover the craft behind gin production with a guided distillery tour followed by a tasting session of small-batch gins and cocktails.',
    city: 'Liverpool',
    region: 'North West',
    priceFrom: 40,
    image: 'https://images.pexels.com/photos/1089932/pexels-photo-1089932.jpeg',
    category: 'Food & Drink',
    subcategory: 'Tours',
    rating: 4.9,
    duration: '2.5 hours',
    groupSize: '10-20',
    features: [
      'Behind-the-scenes tour',
      'Sample 5 premium gins',
      'Cocktail demonstration',
      'Expert-led tasting notes',
      'Discount on bottle purchases',
      'Exclusive merch available'
    ],
    availability: ['Friday', 'Saturday'],
    location: {
      address: '18 Spirit Lane, Baltic Triangle',
      postcode: 'L1 0AG',
      coordinates: { lat: 53.4009, lng: -2.9915 }
    }
  },
  {
    id: '24',
    title: 'Archery Tag Session',
    description: 'A thrilling mix of dodgeball and archery! Compete in teams using foam-tipped arrows in a high-energy, safe combat game.',
    city: 'Birmingham',
    region: 'West Midlands',
    priceFrom: 28,
    image: 'https://images.pexels.com/photos/6180797/pexels-photo-6180797.jpeg',
    category: 'Adventure',
    subcategory: 'Sports',
    rating: 4.6,
    duration: '1.5 hours',
    groupSize: '8-16',
    features: [
      'All equipment provided',
      'Safety briefing & training',
      'Multiple game modes',
      'Team tournaments',
      'Indoor/outdoor options',
      'Photos & videos included'
    ],
    availability: ['Weekends'],
    location: {
      address: '3 Target Road, Digbeth',
      postcode: 'B5 5RS',
      coordinates: { lat: 52.4756, lng: -1.8833 }
    }
  },
  {
    id: '25',
    title: 'Silent Disco Yoga',
    description: 'A unique fusion of yoga and silent disco—flow to your own beat with wireless headphones while an instructor guides the session.',
    city: 'Brighton',
    region: 'South East',
    priceFrom: 18,
    image: 'https://images.pexels.com/photos/8436685/pexels-photo-8436685.jpeg',
    category: 'Wellness',
    subcategory: 'Fitness',
    rating: 4.7,
    duration: '1 hour',
    groupSize: '15-30',
    features: [
      'Wireless headphones provided',
      'Choice of music genres',
      'Beginner-friendly',
      'Glow-in-the-dark accessories',
      'Relaxation segment',
      'BYO mat or rent onsite'
    ],
    availability: ['Tuesday', 'Thursday', 'Sunday'],
    location: {
      address: '11 Zen Street, North Laine',
      postcode: 'BN1 1AA',
      coordinates: { lat: 50.8225, lng: -0.1372 }
    }
  },
  {
    id: '26',
    title: 'Foraging & Wild Cooking',
    description: 'Explore the countryside with an expert forager, then cook your finds over a fire in this immersive outdoor experience.',
    city: 'Cardiff',
    region: 'Wales',
    priceFrom: 45,
    image: 'https://images.pexels.com/photos/6994982/pexels-photo-6994982.jpeg',
    category: 'Outdoor',
    subcategory: 'Adventure',
    rating: 4.9,
    duration: '3 hours',
    groupSize: '6-12',
    features: [
      'Guided foraging walk',
      'Identify edible plants/mushrooms',
      'Outdoor cooking demo',
      'Wild tea tasting',
      'Recipe booklet',
      'Eco-friendly practices'
    ],
    availability: ['Spring-Autumn weekends'],
    location: {
      address: 'Forest Retreat, Bute Park',
      postcode: 'CF10 3ER',
      coordinates: { lat: 51.4866, lng: -3.1867 }
    }
  },
  {
    id: '27',
    title: 'Neon Sign Making',
    description: 'Design and bend your own LED neon sign with expert guidance—perfect for personalized décor or gifts.',
    city: 'Leeds',
    region: 'Yorkshire',
    priceFrom: 65,
    image: 'https://images.pexels.com/photos/5721908/pexels-photo-5721908.jpeg',
    category: 'Creative',
    subcategory: 'Workshop',
    rating: 4.8,
    duration: '3 hours',
    groupSize: '4-8',
    features: [
      'Custom 15cm sign',
      'Learn tube-bending basics',
      '10+ color options',
      'Take home same day',
      'Aprons & tools provided',
      'BYOB allowed'
    ],
    availability: ['Friday', 'Saturday'],
    location: {
      address: '8 Glow Avenue, Kirkgate',
      postcode: 'LS1 6HA',
      coordinates: { lat: 53.7965, lng: -1.5479 }
    }
  },
  {
    id: '28',
    title: 'Axe Throwing Session',
    description: 'Channel your inner lumberjack with this adrenaline-pumping axe-throwing experience under expert supervision.',
    city: 'Newcastle',
    region: 'North East',
    priceFrom: 22,
    image: 'https://images.pexels.com/photos/6186123/pexels-photo-6186123.jpeg',
    category: 'Adventure',
    subcategory: 'Sports',
    rating: 4.7,
    duration: '1 hour',
    groupSize: '4-10',
    features: [
      'Safety training included',
      'Multiple target games',
      'Competitive scoring',
      'Group tournaments',
      'Photo opportunities',
      'Licensed bar onsite'
    ],
    availability: ['Daily'],
    location: {
      address: '14 Timber Yard, Ouseburn',
      postcode: 'NE1 2PQ',
      coordinates: { lat: 54.9783, lng: -1.6174 }
    }
  },
  {
    id: '29',
    title: 'Virtual Reality Gaming Party',
    description: 'Immerse yourself in VR worlds with multiplayer games, from zombie survival to racing and puzzle adventures.',
    city: 'Glasgow',
    region: 'Scotland',
    priceFrom: 30,
    image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg',
    category: 'Gaming',
    subcategory: 'Tech',
    rating: 4.8,
    duration: '1.5 hours',
    groupSize: '4-12',
    features: [
      'State-of-the-art VR headsets',
      '20+ game options',
      'Private gaming pod',
      'Leaderboard challenges',
      'Screen to watch players',
      'Souvenir digital clips'
    ],
    availability: ['Daily'],
    location: {
      address: '25 Tech Plaza, Merchant City',
      postcode: 'G1 1AA',
      coordinates: { lat: 55.8598, lng: -4.2425 }
    }
  },
  {
    id: '30',
    title: 'Prosecco Painting Party',
    description: 'Sip prosecco while creating canvas art with friends—guided by a local artist. Perfect for hen parties!',
    city: 'London',
    region: 'England',
    priceFrom: 32,
    image: 'https://images.pexels.com/photos/3825519/pexels-photo-3825519.jpeg',
    category: 'Hen Do',
    subcategory: 'Creative',
    rating: 4.8,
    duration: '2 hours',
    groupSize: '6-20',
    features: [
      'All art supplies provided',
      '2 glasses of prosecco',
      'Take-home artwork',
      'BYOB option',
      'Private venue'
    ],
    availability: ['Weekends'],
    location: {
      address: '12 Canvas Lane, Shoreditch',
      postcode: 'E1 6AB',
      coordinates: { lat: 51.5234, lng: -0.0756 }
    }
  },
  {
    id: '31',
    title: 'Belly Dancing Workshop',
    description: 'Learn sensual belly dancing moves in a fun, inclusive class tailored for hen parties.',
    city: 'Barcelona',
    region: 'Spain',
    priceFrom: 25,
    image: 'https://images.pexels.com/photos/8951203/pexels-photo-8951203.jpeg',
    category: 'Hen Do',
    subcategory: 'Dance',
    rating: 4.7,
    duration: '1.5 hours',
    groupSize: '8-15',
    features: [
      'Professional instructor',
      'Costume accessories',
      'Group choreography',
      'Photo session',
      'Option for private class'
    ],
    availability: ['Friday', 'Saturday'],
    location: {
      address: '9 Flamenco Street, Gothic Quarter',
      postcode: '08002',
      coordinates: { lat: 41.3825, lng: 2.1769 }
    }
  },
  {
    id: '32',
    title: 'Sparkly Afternoon Tea',
    description: 'Glamorous afternoon tea with champagne, bespoke cocktails, and edible glitter desserts.',
    city: 'Manchester',
    region: 'England',
    priceFrom: 45,
    image: 'https://images.pexels.com/photos/884600/pexels-photo-884600.jpeg',
    category: 'Hen Do',
    subcategory: 'Food & Drink',
    rating: 4.9,
    duration: '2 hours',
    groupSize: '4-12',
    features: [
      '3-tiered dessert stand',
      'Bottomless prosecco upgrade',
      'Personalized cupcakes',
      'Instagrammable décor',
      'Vegan/GF options'
    ],
    availability: ['Daily'],
    location: {
      address: 'The Glitter Café, Deansgate',
      postcode: 'M3 4EN',
      coordinates: { lat: 53.4775, lng: -2.2511 }
    }
  },
  {
    id: '33',
    title: 'Pole Fitness Class',
    description: 'A beginner-friendly pole dancing session designed for hen parties—build confidence and laugh together!',
    city: 'Berlin',
    region: 'Germany',
    priceFrom: 30,
    image: 'https://images.pexels.com/photos/6456159/pexels-photo-6456159.jpeg',
    category: 'Hen Do',
    subcategory: 'Fitness',
    rating: 4.6,
    duration: '1.5 hours',
    groupSize: '6-10',
    features: [
      'Expert instructor',
      'Safety mats provided',
      'Group discounts',
      'Photo/video package',
      'Private studio'
    ],
    availability: ['Thursday-Sunday'],
    location: {
      address: '14 Neon Studio, Mitte',
      postcode: '10178',
      coordinates: { lat: 52.5200, lng: 13.4050 }
    }
  },
  {
    id: '34',
    title: 'Bridal Makeup Masterclass',
    description: 'Learn professional bridal makeup techniques with a celebrity artist—ideal for pre-wedding prep.',
    city: 'Dublin',
    region: 'Ireland',
    priceFrom: 55,
    image: 'https://images.pexels.com/photos/3998418/pexels-photo-3998418.jpeg',
    category: 'Hen Do',
    subcategory: 'Beauty',
    rating: 4.9,
    duration: '2 hours',
    groupSize: '4-8',
    features: [
      'Luxury product samples',
      'Step-by-step demo',
      'Bride-focused tips',
      'Goody bags',
      'Pro photoshoot'
    ],
    availability: ['Weekends'],
    location: {
      address: '5 Glamour Lane, Temple Bar',
      postcode: 'D02 NX53',
      coordinates: { lat: 53.3458, lng: -6.2636 }
    }
  },

  // STAG DO ACTIVITIES (5)
  {
    id: '35',
    title: 'Tank Driving Experience',
    description: 'Drive a real military tank over obstacles and fire (blank) rounds—epic stag activity!',
    city: 'Prague',
    region: 'Czech Republic',
    priceFrom: 120,
    image: 'https://images.pexels.com/photos/6180797/pexels-photo-6180797.jpeg',
    category: 'Stag Do',
    subcategory: 'Adventure',
    rating: 5.0,
    duration: '3 hours',
    groupSize: '4-10',
    features: [
      '30 mins tank driving',
      'Safety briefing',
      'Army-style challenges',
      'BBQ lunch included',
      'Photos/videos'
    ],
    availability: ['April-October'],
    location: {
      address: 'Tank Base, Prague 9',
      postcode: '19000',
      coordinates: { lat: 50.1264, lng: 14.5164 }
    }
  },

  {
    id: '36',
    title: 'Whiskey & Cigar Tasting',
    description: 'Sample rare whiskeys paired with premium cigars in a private members’ club.',
    city: 'Belfast',
    region: 'Northern Ireland',
    priceFrom: 60,
    image: 'https://images.pexels.com/photos/4825701/pexels-photo-4825701.jpeg',
    category: 'Stag Do',
    subcategory: 'Food & Drink',
    rating: 4.8,
    duration: '2 hours',
    groupSize: '6-12',
    features: [
      '5 premium whiskeys',
      'Hand-rolled cigars',
      'Expert sommelier',
      'Private lounge',
      'Stag trophy'
    ],
    availability: ['Thursday-Saturday'],
    location: {
      address: '8 Distillery Road',
      postcode: 'BT1 5AB',
      coordinates: { lat: 54.5973, lng: -5.9301 }
    }
  },
  {
    id: '37',
    title: 'White Water Rafting',
    description: 'Tackle Grade IV rapids with your crew—includes wetsuits and safety gear.',
    city: 'Cardiff',
    region: 'Wales',
    priceFrom: 65,
    image: 'https://images.pexels.com/photos/7527846/pexels-photo-7527846.jpeg',
    category: 'Stag Do',
    subcategory: 'Extreme',
    rating: 4.9,
    duration: 'Half-day',
    groupSize: '8-16',
    features: [
      'Professional guides',
      'Transport from city',
      'Post-rafting pub lunch',
      'GoPro footage',
      'Min age: 18'
    ],
    availability: ['May-September'],
    location: {
      address: 'River Taff Rafting Centre',
      postcode: 'CF10 1AA',
      coordinates: { lat: 51.4733, lng: -3.1759 }
    }
  },
  {
    id: '38',
    title: 'Casino Night Package',
    description: 'Private casino night with poker, blackjack, and roulette—fake money, real fun!',
    city: 'Amsterdam',
    region: 'Netherlands',
    priceFrom: 40,
    image: 'https://images.pexels.com/photos/269948/pexels-photo-269948.jpeg',
    category: 'Stag Do',
    subcategory: 'Games',
    rating: 4.7,
    duration: '3 hours',
    groupSize: '10-20',
    features: [
      'Dealers & tables provided',
      'Stag-themed prizes',
      'Cocktail package upgrade',
      'VIP area',
      'BYOB allowed'
    ],
    availability: ['Daily'],
    location: {
      address: '22 Casino Street, Red Light District',
      postcode: '1012 LA',
      coordinates: { lat: 52.3702, lng: 4.8952 }
    }
  },
  {
    id: '39',
    title: 'Combat Archery Battle',
    description: 'Like paintball but with bows and foam-tipped arrows—intense team battles!',
    city: 'Glasgow',
    region: 'Scotland',
    priceFrom: 28,
    image: 'https://images.pexels.com/photos/6180797/pexels-photo-6180797.jpeg',
    category: 'Stag Do',
    subcategory: 'Sports',
    rating: 4.8,
    duration: '1.5 hours',
    groupSize: '8-16',
    features: [
      'All equipment provided',
      '3 game modes',
      'Stag team branding',
      'Indoor arena',
      'Photos included'
    ],
    availability: ['Weekends'],
    location: {
      address: 'Battle Arena, Govan',
      postcode: 'G51 1EA',
      coordinates: { lat: 55.8617, lng: -4.3106 }
    }
  },

  // TEAM BUILDING (5)
  {
    id: '40',
    title: 'MasterChef Challenge',
    description: 'Teams compete to cook a 3-course meal under time pressure—judged by a pro chef.',
    city: 'Liverpool',
    region: 'England',
    priceFrom: 45,
    image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg',
    category: 'Team Building',
    subcategory: 'Food & Drink',
    rating: 4.9,
    duration: '3 hours',
    groupSize: '10-30',
    features: [
      'Ingredients provided',
      'Teamwork challenges',
      'Winning team prize',
      'Recipe booklet',
      'Dietary accommodations'
    ],
    availability: ['Weekdays'],
    location: {
      address: 'The Cookhouse, Baltic Triangle',
      postcode: 'L1 0AH',
      coordinates: { lat: 53.4009, lng: -2.9915 }
    }
  },
  {
    id: '41',
    title: 'Escape the Office',
    description: 'Custom escape room designed for corporate teams—solve puzzles to "escape work".',
    city: 'Leeds',
    region: 'England',
    priceFrom: 25,
    image: 'https://images.pexels.com/photos/7031723/pexels-photo-7031723.jpeg',
    category: 'Team Building',
    subcategory: 'Games',
    rating: 4.7,
    duration: '1 hour',
    groupSize: '4-8',
    features: [
      'Work-themed puzzles',
      'Debrief session',
      'Team scoring',
      'Private bookings',
      'Difficulty levels'
    ],
    availability: ['Weekdays'],
    location: {
      address: '12 Puzzle Lane, City Centre',
      postcode: 'LS1 4BR',
      coordinates: { lat: 53.7997, lng: -1.5492 }
    }
  },
  {
    id: '42',
    title: 'Robot Wars Workshop',
    description: 'Build and battle robots with your team—STEM-focused and hilariously competitive.',
    city: 'Bristol',
    region: 'England',
    priceFrom: 50,
    image: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg',
    category: 'Team Building',
    subcategory: 'Tech',
    rating: 4.8,
    duration: '2.5 hours',
    groupSize: '8-20',
    features: [
      'Kits provided',
      'Engineering mentor',
      'Tournament finale',
      'Prizes for winners',
      'No experience needed'
    ],
    availability: ['Weekdays'],
    location: {
      address: 'Tech Hub, Temple Quay',
      postcode: 'BS1 6DG',
      coordinates: { lat: 51.4526, lng: -2.5824 }
    }
  },
  {
    id: '43',
    title: 'Drum Circle Experience',
    description: 'Boost team synergy with rhythmic drumming—led by a professional percussionist.',
    city: 'Birmingham',
    region: 'England',
    priceFrom: 35,
    image: 'https://images.pexels.com/photos/995301/pexels-photo-995301.jpeg',
    category: 'Team Building',
    subcategory: 'Music',
    rating: 4.6,
    duration: '1.5 hours',
    groupSize: '10-50',
    features: [
      'All instruments provided',
      'Collaborative compositions',
      'Energy-building exercises',
      'Outdoor/indoor options',
      'Recording of your performance'
    ],
    availability: ['Weekdays'],
    location: {
      address: 'Rhythm Studio, Digbeth',
      postcode: 'B5 5RS',
      coordinates: { lat: 52.4756, lng: -1.8833 }
    }
  },
  {
    id: '44',
    title: 'Survival Skills Workshop',
    description: 'Learn wilderness survival as a team—fire-making, shelter-building, and navigation.',
    city: 'Newcastle',
    region: 'England',
    priceFrom: 55,
    image: 'https://images.pexels.com/photos/6214378/pexels-photo-6214378.jpeg',
    category: 'Team Building',
    subcategory: 'Outdoor',
    rating: 4.9,
    duration: '4 hours',
    groupSize: '8-15',
    features: [
      'Expert survivalist',
      'Team challenges',
      'Outdoor location',
      'Basic first aid training',
      'Certificate of completion'
    ],
    availability: ['April-October'],
    location: {
      address: 'Wilderness Camp, Northumberland',
      postcode: 'NE65 7PX',
      coordinates: { lat: 55.3289, lng: -1.8881 }
    }
  },

  // BIRTHDAY (5)
  {
    id: '45',
    title: 'Private Karaoke Lounge',
    description: 'Sing your heart out in a private karaoke room with unlimited song choices.',
    city: 'London',
    region: 'England',
    priceFrom: 20,
    image: 'https://images.pexels.com/photos/167491/pexels-photo-167491.jpeg',
    category: 'Birthday',
    subcategory: 'Music',
    rating: 4.7,
    duration: '2 hours',
    groupSize: '4-12',
    features: [
      'Private soundproof room',
      'Unlimited songs',
      'Disco lighting',
      'BYOB allowed',
      'Snack menu'
    ],
    availability: ['Daily'],
    location: {
      address: 'K-Star Karaoke, Soho',
      postcode: 'W1D 4NG',
      coordinates: { lat: 51.5139, lng: -0.1313 }
    }
  },
  {
    id: '46',
    title: 'VIP Cinema Screening',
    description: 'Rent a luxury cinema for a private screening of your favorite film.',
    city: 'Dublin',
    region: 'Ireland',
    priceFrom: 150,
    image: 'https://images.pexels.com/photos/436413/pexels-photo-436413.jpeg',
    category: 'Birthday',
    subcategory: 'Entertainment',
    rating: 4.9,
    duration: '3 hours',
    groupSize: '10-30',
    features: [
      '4K projector & surround sound',
      'Film of your choice',
      'Complimentary popcorn',
      'Bar service available',
      'Red carpet entry'
    ],
    availability: ['Daily'],
    location: {
      address: 'The Premiere Cinema, Temple Bar',
      postcode: 'D02 NX53',
      coordinates: { lat: 53.3458, lng: -6.2636 }
    }
  },
  {
    id: '47',
    title: 'Chocolate Fountain Party',
    description: 'Unlimited chocolate fountain with dippable treats—perfect for sweet-toothed celebrations.',
    city: 'Brighton',
    region: 'England',
    priceFrom: 18,
    image: 'https://images.pexels.com/photos/6605313/pexels-photo-6605313.jpeg',
    category: 'Birthday',
    subcategory: 'Food & Drink',
    rating: 4.8,
    duration: '1.5 hours',
    groupSize: '6-15',
    features: [
      '3 chocolate flavors',
      'Fruit, marshmallows, pretzels',
      'Personalized birthday cake',
      'Vegan options',
      'Themed decorations'
    ],
    availability: ['Weekends'],
    location: {
      address: 'Sweet Tooth Café, The Lanes',
      postcode: 'BN1 1AA',
      coordinates: { lat: 50.8225, lng: -0.1372 }
    }
  },
  {
    id: '48',
    title: 'Laser Tag Party',
    description: 'High-energy laser tag battles in a futuristic arena—great for all ages.',
    city: 'Edinburgh',
    region: 'Scotland',
    priceFrom: 15,
    image: 'https://images.pexels.com/photos/2740956/pexels-photo-2740956.jpeg',
    category: 'Birthday',
    subcategory: 'Games',
    rating: 4.7,
    duration: '1 hour',
    groupSize: '6-20',
    features: [
      'Vest & gun rental',
      'Team-based missions',
      'Score tracking',
      'Party room add-on',
      'Glow-in-the-dark mode'
    ],
    availability: ['Daily'],
    location: {
      address: 'Laser Zone, Leith',
      postcode: 'EH6 6LU',
      coordinates: { lat: 55.9753, lng: -3.1693 }
    }
  },
  {
    id: '49',
    title: 'Pottery Wheel Workshop',
    description: 'Create ceramic masterpieces on a wheel—relaxing and creative birthday activity.',
    city: 'Barcelona',
    region: 'Spain',
    priceFrom: 35,
    image: 'https://images.pexels.com/photos/4240497/pexels-photo-4240497.jpeg',
    category: 'Birthday',
    subcategory: 'Creative',
    rating: 4.9,
    duration: '2 hours',
    groupSize: '4-8',
    features: [
      'Expert potter guidance',
      '2 pieces to take home',
      'Glazing & firing included',
      'BYOB option',
      'Aprons provided'
    ],
    availability: ['Weekends'],
    location: {
      address: 'Clay Studio, El Born',
      postcode: '08003',
      coordinates: { lat: 41.3851, lng: 2.1734 }
    }
  },

  // CORPORATE (5)
  {
    id: '50',
    title: 'Executive Whiskey Tasting',
    description: 'Premium whiskey tasting led by a master distiller—ideal for client entertainment.',
    city: 'London',
    region: 'England',
    priceFrom: 75,
    image: 'https://images.pexels.com/photos/4825701/pexels-photo-4825701.jpeg',
    category: 'Corporate',
    subcategory: 'Food & Drink',
    rating: 4.9,
    duration: '2 hours',
    groupSize: '6-12',
    features: [
      'Rare whiskey selection',
      'Pairing with artisan chocolates',
      'Private tasting room',
      'Branded gift bags',
      'Custom engraving option'
    ],
    availability: ['Weekdays'],
    location: {
      address: 'The Whiskey Library, Mayfair',
      postcode: 'W1K 4HR',
      coordinates: { lat: 51.5099, lng: -0.1476 }
    }
  },
  {
    id: '51',
    title: 'Luxury Yacht Networking',
    description: 'Host clients on a private yacht cruise with catering and city views.',
    city: 'Amsterdam',
    region: 'Netherlands',
    priceFrom: 200,
    image: 'https://images.pexels.com/photos/843633/pexels-photo-843633.jpeg',
    category: 'Corporate',
    subcategory: 'Networking',
    rating: 5.0,
    duration: '3 hours',
    groupSize: '10-25',
    features: [
      'Private yacht rental',
      'Champagne & canapés',
      'Skyline photo ops',
      'Dedicated steward',
      'Custom branding'
    ],
    availability: ['April-September'],
    location: {
      address: 'Amstel River Dock',
      postcode: '1018 AB',
      coordinates: { lat: 52.3676, lng: 4.9041 }
    }
  },
  {
    id: '52',
    title: 'AI Innovation Workshop',
    description: 'Hands-on session exploring AI tools for business—led by tech experts.',
    city: 'Berlin',
    region: 'Germany',
    priceFrom: 90,
    image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
    category: 'Corporate',
    subcategory: 'Tech',
    rating: 4.8,
    duration: '4 hours',
    groupSize: '10-30',
    features: [
      'Case studies',
      'Team ideation exercises',
      'Actionable strategies',
      'Post-workshop resources',
      'Lunch included'
    ],
    availability: ['Weekdays'],
    location: {
      address: 'Tech Hub Berlin, Mitte',
      postcode: '10178',
      coordinates: { lat: 52.5200, lng: 13.4050 }
    }
  },
  {
    id: '53',
    title: 'Golf Tournament Package',
    description: 'Corporate golf day with scoring, prizes, and post-game drinks.',
    city: 'Dublin',
    region: 'Ireland',
    priceFrom: 120,
    image: 'https://images.pexels.com/photos/863006/pexels-photo-863006.jpeg',
    category: 'Corporate',
    subcategory: 'Sports',
    rating: 4.7,
    duration: '6 hours',
    groupSize: '12-48',
    features: [
      '18-hole course',
      'Golf cart rental',
      'Post-game dinner',
      'Custom trophies',
      'Photographer'
    ],
    availability: ['April-October'],
    location: {
      address: 'Elm Green Golf Club',
      postcode: 'D18 XW25',
      coordinates: { lat: 53.2866, lng: -6.2144 }
    }
  },
  {
    id: '54',
    title: 'Mindfulness Retreat',
    description: 'Half-day retreat with meditation, yoga, and stress-management workshops.',
    city: 'Bristol',
    region: 'England',
    priceFrom: 65,
    image: 'https://images.pexels.com/photos/3825507/pexels-photo-3825507.jpeg',
    category: 'Corporate',
    subcategory: 'Wellness',
    rating: 4.9,
    duration: '4 hours',
    groupSize: '10-20',
    features: [
      'Guided meditation',
      'Breathwork session',
      'Healthy lunch',
      'Take-home journal',
      'Nature walk'
    ],
    availability: ['Weekdays'],
    location: {
      address: 'Serenity Spa, Clifton',
      postcode: 'BS8 4PD',
      coordinates: { lat: 51.4545, lng: -2.6226 }
    }
  },

  // KIDS (5)
  {
    id: '55',
    title: 'Dinosaur Fossil Dig',
    description: 'Kids uncover replica fossils and learn about prehistoric life from a paleontologist.',
    city: 'London',
    region: 'England',
    priceFrom: 18,
    image: 'https://images.pexels.com/photos/162389/lost-places-old-decay-ruin-162389.jpeg',
    category: 'Kids',
    subcategory: 'Educational',
    rating: 4.8,
    duration: '1.5 hours',
    groupSize: '10-15',
    features: [
      'Dig site simulation',
      'Take-home fossil',
      'Dino quiz',
      'Age 5-12',
      'Parent participation'
    ],
    availability: ['Weekends'],
    location: {
      address: 'Natural History Museum, Kensington',
      postcode: 'SW7 5BD',
      coordinates: { lat: 51.4967, lng: -0.1764 }
    }
  },
  {
    id: '56',
    title: 'Pirate Adventure Cruise',
    description: 'Interactive boat trip where kids solve pirate puzzles and hunt for treasure.',
    city: 'Liverpool',
    region: 'England',
    priceFrom: 12,
    image: 'https://images.pexels.com/photos/1637122/pexels-photo-1637122.jpeg',
    category: 'Kids',
    subcategory: 'Adventure',
    rating: 4.9,
    duration: '1 hour',
    groupSize: '15-30',
    features: [
      'Costumed pirate guide',
      'Treasure map',
      'Small prizes',
      'Life jackets provided',
      'Age 4-10'
    ],
    availability: ['Summer weekends'],
    location: {
      address: 'Albert Dock Pier',
      postcode: 'L3 4AA',
      coordinates: { lat: 53.4009, lng: -2.9915 }
    }
  },
  {
    id: '57',
    title: 'Magic Workshop',
    description: 'Learn beginner magic tricks with props to take home—taught by a professional magician.',
    city: 'Birmingham',
    region: 'England',
    priceFrom: 15,
    image: 'https://images.pexels.com/photos/356147/pexels-photo-356147.jpeg',
    category: 'Kids',
    subcategory: 'Entertainment',
    rating: 4.7,
    duration: '1 hour',
    groupSize: '8-12',
    features: [
      '5 tricks to learn',
      'Magic kit included',
      'Performance showcase',
      'Age 6-12',
      'Parent viewing area'
    ],
    availability: ['Saturday'],
    location: {
      address: 'Wonder Theatre, Bullring',
      postcode: 'B5 4BU',
      coordinates: { lat: 52.4778, lng: -1.8944 }
    }
  },
  {
    id: '58',
    title: 'Mini MasterChef Junior',
    description: 'Kids cook a 3-course meal with chef supervision—suitable for tiny foodies!',
    city: 'Glasgow',
    region: 'Scotland',
    priceFrom: 22,
    image: 'https://images.pexels.com/photos/699524/pexels-photo-699524.jpeg',
    category: 'Kids',
    subcategory: 'Food & Drink',
    rating: 4.8,
    duration: '2 hours',
    groupSize: '6-10',
    features: [
      'Kid-safe utensils',
      'Apron & chef hat',
      'Recipe booklet',
      'Age 7-12',
      'Dietary accommodations'
    ],
    availability: ['Sunday'],
    location: {
      address: 'Little Cooks Kitchen, West End',
      postcode: 'G12 8RR',
      coordinates: { lat: 55.8746, lng: -4.2919 }
    }
  },
  {
    id: '59',
    title: 'Superhero Training Camp',
    description: 'Obstacle course, "strength" challenges, and capes—kids become heroes for a day!',
    city: 'Cardiff',
    region: 'Wales',
    priceFrom: 14,
    image: 'https://images.pexels.com/photos/1078973/pexels-photo-1078973.jpeg',
    category: 'Kids',
    subcategory: 'Active',
    rating: 4.9,
    duration: '1.5 hours',
    groupSize: '10-20',
    features: [
      'Cape & mask provided',
      'Certified instructors',
      'Photo ops',
      'Age 4-10',
      'Parent participation'
    ],
    availability: ['Weekends'],
    location: {
      address: 'Hero HQ, Cardiff Bay',
      postcode: 'CF10 5AL',
      coordinates: { lat: 51.4645, lng: -3.1649 }
    }
  },

  {
    id: '60',
    title: 'Flamenco Dance Class',
    description: 'Authentic flamenco lesson with live guitar—learn the basics of this passionate art form.',
    city: 'Barcelona',
    region: 'Spain',
    priceFrom: 25,
    image: 'https://images.pexels.com/photos/1755683/pexels-photo-1755683.jpeg',
    category: 'Cultural',
    subcategory: 'Dance',
    rating: 4.8,
    duration: '1.5 hours',
    groupSize: '6-12',
    features: [
      'Professional dancer',
      'Skirt rental included',
      'Beginner-friendly',
      'Video recording',
      'Tapas & sangria option'
    ],
    availability: ['Tuesday', 'Thursday', 'Saturday'],
    location: {
      address: 'Flamenco Studio, El Raval',
      postcode: '08001',
      coordinates: { lat: 41.3809, lng: 2.1734 }
    }
  },
  {
    id: '61',
    title: 'Paella Cooking Class',
    description: 'Master the art of authentic Valencian paella with a local chef in a seaside setting.',
    city: 'Valencia',
    region: 'Spain',
    priceFrom: 40,
    image: 'https://images.pexels.com/photos/5949888/pexels-photo-5949888.jpeg',
    category: 'Food & Drink',
    subcategory: 'Cooking',
    rating: 4.9,
    duration: '3 hours',
    groupSize: '8-15',
    features: [
      'Fresh ingredients',
      'Wine pairing',
      'Beachfront location',
      'Recipe booklet',
      'Vegetarian option'
    ],
    availability: ['Daily'],
    location: {
      address: 'La Paellera, Malvarrosa Beach',
      postcode: '46011',
      coordinates: { lat: 39.4699, lng: -0.3263 }
    }
  },
  {
    id: '62',
    title: 'Hot Air Balloon Ride',
    description: 'Sunrise flight over Catalonia’s countryside with cava toast upon landing.',
    city: 'Barcelona',
    region: 'Spain',
    priceFrom: 150,
    image: 'https://images.pexels.com/photos/358220/pexels-photo-358220.jpeg',
    category: 'Adventure',
    subcategory: 'Outdoor',
    rating: 5.0,
    duration: '4 hours',
    groupSize: '2-8',
    features: [
      '1-hour flight',
      'Breakfast picnic',
      'Flight certificate',
      'Photo package',
      'Weight restrictions apply'
    ],
    availability: ['April-October'],
    location: {
      address: 'Balloon Base, Vic',
      postcode: '08500',
      coordinates: { lat: 41.9307, lng: 2.2549 }
    }
  },
  {
    id: '63',
    title: 'Gaudi Architecture Tour',
    description: 'Guided walkthrough of Barcelona’s iconic Gaudi landmarks, including Sagrada Família.',
    city: 'Barcelona',
    region: 'Spain',
    priceFrom: 30,
    image: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg',
    category: 'Cultural',
    subcategory: 'Tours',
    rating: 4.8,
    duration: '3 hours',
    groupSize: '10-20',
    features: [
      'Skip-the-line tickets',
      'Expert art historian',
      'Small group',
      'Audio headsets',
      'Local tapas stop'
    ],
    availability: ['Daily'],
    location: {
      address: 'Plaça de Gaudí, Eixample',
      postcode: '08025',
      coordinates: { lat: 41.4036, lng: 2.1744 }
    }
  },
  {
    id: '64',
    title: 'Ibiza Beach Yoga',
    description: 'Sunrise/sunset yoga sessions on a secluded Ibiza beach—pure relaxation.',
    city: 'Ibiza',
    region: 'Spain',
    priceFrom: 20,
    image: 'https://images.pexels.com/photos/1812964/pexels-photo-1812964.jpeg',
    category: 'Wellness',
    subcategory: 'Fitness',
    rating: 4.9,
    duration: '1 hour',
    groupSize: '5-15',
    features: [
      'Oceanfront mats',
      'All levels welcome',
      'Fresh coconut water',
      'Sound bath option',
      'Towels provided'
    ],
    availability: ['May-September'],
    location: {
      address: 'Cala Salada Beach',
      postcode: '07820',
      coordinates: { lat: 38.9931, lng: 1.2345 }
    }
  },

  // REGIONS: GERMANY (5)
  {
    id: '65',
    title: 'Beer Brewery Tour',
    description: 'Behind-the-scenes tour of a traditional Bavarian brewery with tasting flight.',
    city: 'Berlin',
    region: 'Germany',
    priceFrom: 28,
    image: 'https://images.pexels.com/photos/1267701/pexels-photo-1267701.jpeg',
    category: 'Food & Drink',
    subcategory: 'Tours',
    rating: 4.7,
    duration: '2 hours',
    groupSize: '8-20',
    features: [
      '5 beer samples',
      'History of brewing',
      'Pretzel snack',
      'Souvenir glass',
      'English/German guides'
    ],
    availability: ['Daily'],
    location: {
      address: 'Berliner Berg Brewery, Kreuzberg',
      postcode: '10999',
      coordinates: { lat: 52.4996, lng: 13.4224 }
    }
  },
  {
    id: '66',
    title: 'Cold War Bunker Tour',
    description: 'Explore a preserved Cold War bunker with stories of Berlin’s divided history.',
    city: 'Berlin',
    region: 'Germany',
    priceFrom: 18,
    image: 'https://images.pexels.com/photos/3990355/pexels-photo-3990355.jpeg',
    category: 'Historical',
    subcategory: 'Tours',
    rating: 4.8,
    duration: '1.5 hours',
    groupSize: '6-15',
    features: [
      'Original bunker artifacts',
      'Expert historian guide',
      'Audio recordings',
      'Not wheelchair accessible',
      'Age 12+'
    ],
    availability: ['Wednesday-Sunday'],
    location: {
      address: 'Bunker Museum, Mitte',
      postcode: '10117',
      coordinates: { lat: 52.5186, lng: 13.4081 }
    }
  },
  {
    id: '67',
    title: 'Black Forest Hiking',
    description: 'Guided hike through fairy-tale forests with waterfall stops and local folklore.',
    city: 'Munich',
    region: 'Germany',
    priceFrom: 35,
    image: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg',
    category: 'Outdoor',
    subcategory: 'Adventure',
    rating: 4.9,
    duration: '5 hours',
    groupSize: '4-12',
    features: [
      'Picnic lunch',
      'Scenic viewpoints',
      'Wildlife spotting',
      'Hiking poles provided',
      'Transport from Munich'
    ],
    availability: ['May-October'],
    location: {
      address: 'Black Forest Trailhead',
      postcode: '79117',
      coordinates: { lat: 47.9333, lng: 7.9000 }
    }
  },
  {
    id: '68',
    title: 'VW Beetle Road Trip',
    description: 'Drive a classic VW Beetle through scenic routes with a curated playlist.',
    city: 'Hamburg',
    region: 'Germany',
    priceFrom: 90,
    image: 'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg',
    category: 'Adventure',
    subcategory: 'Driving',
    rating: 4.8,
    duration: '4 hours',
    groupSize: '2 (per car)',
    features: [
      '1970s Beetle rental',
      'Scenic route map',
      'Polaroid camera',
      'Picnic blanket & basket',
      'Insurance included'
    ],
    availability: ['April-November'],
    location: {
      address: 'Retro Rides, Altona',
      postcode: '22767',
      coordinates: { lat: 53.5500, lng: 9.9333 }
    }
  },
  {
    id: '69',
    title: 'Christmas Market Tour',
    description: 'Guided tasting tour of Germany’s famous Christmas markets (seasonal).',
    city: 'Berlin',
    region: 'Germany',
    priceFrom: 45,
    image: 'https://images.pexels.com/photos/5731874/pexels-photo-5731874.jpeg',
    category: 'Cultural',
    subcategory: 'Food & Drink',
    rating: 4.9,
    duration: '3 hours',
    groupSize: '6-12',
    features: [
      '6 food/drink samples',
      'Local guide',
      'Market history',
      'Souvenir mug',
      'Glühwein included'
    ],
    availability: ['November-December'],
    location: {
      address: 'Gendarmenmarkt, Mitte',
      postcode: '10117',
      coordinates: { lat: 52.5139, lng: 13.3927 }
    }
  },

  // REGIONS: NETHERLANDS (5)
  {
    id: '70',
    title: 'Canal Pizza Cruise',
    description: 'Evening cruise through Amsterdam’s canals with unlimited pizza and drinks.',
    city: 'Amsterdam',
    region: 'Netherlands',
    priceFrom: 45,
    image: 'https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg',
    category: 'Food & Drink',
    subcategory: 'Tours',
    rating: 4.8,
    duration: '2 hours',
    groupSize: '10-30',
    features: [
      '5 pizza varieties',
      'Open bar (beer/wine)',
      'Sunset views',
      'Indoor/outdoor seating',
      'DJ on weekends'
    ],
    availability: ['Daily'],
    location: {
      address: 'Prins Hendrikkade Dock',
      postcode: '1012 TM',
      coordinates: { lat: 52.3758, lng: 4.8976 }
    }
  },
  {
    id: '71',
    title: 'Van Gogh Bike Tour',
    description: 'Cycle to Van Gogh’s inspirations with stops at hidden art spots.',
    city: 'Amsterdam',
    region: 'Netherlands',
    priceFrom: 30,
    image: 'https://images.pexels.com/photos/7249213/pexels-photo-7249213.jpeg',
    category: 'Cultural',
    subcategory: 'Tours',
    rating: 4.7,
    duration: '3 hours',
    groupSize: '6-12',
    features: [
      'Bike rental included',
      'Art historian guide',
      'Sketchbook & pencils',
      'Coffee stop',
      'Small group'
    ],
    availability: ['April-October'],
    location: {
      address: 'Museumplein Bike Hub',
      postcode: '1071 DJ',
      coordinates: { lat: 52.3584, lng: 4.8811 }
    }
  },
  {
    id: '72',
    title: 'Cheese Tasting Workshop',
    description: 'Sample Dutch cheeses paired with wines and jenever in a 17th-century cellar.',
    city: 'Amsterdam',
    region: 'Netherlands',
    priceFrom: 35,
    image: 'https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg',
    category: 'Food & Drink',
    subcategory: 'Tasting',
    rating: 4.9,
    duration: '1.5 hours',
    groupSize: '6-15',
    features: [
      '8 cheese varieties',
      'Wine/jenever pairings',
      'Cheese-making demo',
      'Discount on purchases',
      'Vegetarian-friendly'
    ],
    availability: ['Daily'],
    location: {
      address: 'Old Amsterdam Cheese House',
      postcode: '1012 JS',
      coordinates: { lat: 52.3731, lng: 4.8925 }
    }
  },
  {
    id: '73',
    title: 'Windmill Kayaking',
    description: 'Paddle through Dutch waterways past historic windmills with a guide.',
    city: 'Rotterdam',
    region: 'Netherlands',
    priceFrom: 40,
    image: 'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg',
    category: 'Outdoor',
    subcategory: 'Adventure',
    rating: 4.8,
    duration: '2.5 hours',
    groupSize: '4-10',
    features: [
      'Double kayaks',
      'Safety briefing',
      'Windmill interior visit',
      'Local snack pack',
      'Waterproof bags'
    ],
    availability: ['May-September'],
    location: {
      address: 'Kinderdijk Kayak Center',
      postcode: '2961 AT',
      coordinates: { lat: 51.8853, lng: 4.6361 }
    }
  },
  {
    id: '74',
    title: 'Delft Pottery Workshop',
    description: 'Paint traditional Delft blue pottery in a historic studio.',
    city: 'Delft',
    region: 'Netherlands',
    priceFrom: 50,
    image: 'https://images.pexels.com/photos/753626/pexels-photo-753626.jpeg',
    category: 'Creative',
    subcategory: 'Arts',
    rating: 4.9,
    duration: '2 hours',
    groupSize: '4-8',
    features: [
      'Authentic Delftware',
      'Master painter guidance',
      'Kiln firing included',
      'Shipping available',
      '300-year-old studio'
    ],
    availability: ['Wednesday-Sunday'],
    location: {
      address: 'Royal Delft Workshop',
      postcode: '2628 AR',
      coordinates: { lat: 52.0116, lng: 4.3571 }
    }
  },

  // REGIONS: CZECH REPUBLIC (5)
  {
    id: '75',
    title: 'Prague Ghost Tour',
    description: 'Spooky evening walk through Prague’s haunted alleys with a storyteller guide.',
    city: 'Prague',
    region: 'Czech Republic',
    priceFrom: 18,
    image: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg',
    category: 'Historical',
    subcategory: 'Tours',
    rating: 4.7,
    duration: '1.5 hours',
    groupSize: '8-20',
    features: [
      'Dark history tales',
      'Lanterns provided',
      'Medieval torture exhibit',
      'Age 12+',
      'English/Czech guides'
    ],
    availability: ['Nightly'],
    location: {
      address: 'Old Town Square',
      postcode: '11000',
      coordinates: { lat: 50.0875, lng: 14.4213 }
    }
  },
  {
    id: '76',
    title: 'Beer Spa Relaxation',
    description: 'Soak in a beer-infused tub with unlimited Czech beer on tap beside you.',
    city: 'Prague',
    region: 'Czech Republic',
    priceFrom: 60,
    image: 'https://images.pexels.com/photos/1267354/pexels-photo-1267354.jpeg',
    category: 'Wellness',
    subcategory: 'Spa',
    rating: 4.9,
    duration: '1 hour',
    groupSize: '2-4',
    features: [
      'Private beer bath',
      'Unlimited Pilsner',
      'Herbal compress',
      'Relaxation room',
      'Towels & robes'
    ],
    availability: ['Daily'],
    location: {
      address: 'Bernard Beer Spa, Old Town',
      postcode: '11000',
      coordinates: { lat: 50.0865, lng: 14.4206 }
    }
  },
  {
    id: '77',
    title: 'Bohemian Glassblowing',
    description: 'Watch a master glassblower craft Czech crystal, then try it yourself.',
    city: 'Prague',
    region: 'Czech Republic',
    priceFrom: 45,
    image: 'https://images.pexels.com/photos/6152252/pexels-photo-6152252.jpeg',
    category: 'Cultural',
    subcategory: 'Workshop',
    rating: 4.8,
    duration: '1.5 hours',
    groupSize: '4-8',
    features: [
      'Live demonstration',
      'Hands-on ornament making',
      'Take-home creation',
      'Age 10+',
      'Cooling/finishing service'
    ],
    availability: ['Weekdays'],
    location: {
      address: 'Bohemia Crystal Studio',
      postcode: '11800',
      coordinates: { lat: 50.0755, lng: 14.4378 }
    }
  },
  {
    id: '78',
    title: 'Castle Night Tour',
    description: 'Exclusive after-hours access to Prague Castle with a historian.',
    city: 'Prague',
    region: 'Czech Republic',
    priceFrom: 55,
    image: 'https://images.pexels.com/photos/164336/pexels-photo-164336.jpeg',
    category: 'Historical',
    subcategory: 'Tours',
    rating: 5.0,
    duration: '2 hours',
    groupSize: '6-12',
    features: [
      'Skip-the-line entry',
      'Secret corridors',
      'Crown jewels replica',
      'Ghost stories',
      'Small group only'
    ],
    availability: ['Friday', 'Saturday'],
    location: {
      address: 'Prague Castle Gate',
      postcode: '11908',
      coordinates: { lat: 50.0900, lng: 14.4000 }
    }
  },
  {
    id: '79',
    title: 'Trufa Chocolate Workshop',
    description: 'Learn to make Czech trufa chocolates with a pastry chef in a boutique kitchen.',
    city: 'Prague',
    region: 'Czech Republic',
    priceFrom: 35,
    image: 'https://images.pexels.com/photos/6605313/pexels-photo-6605313.jpeg',
    category: 'Food & Drink',
    subcategory: 'Cooking',
    rating: 4.9,
    duration: '2 hours',
    groupSize: '4-10',
    features: [
      '5 truffle varieties',
      'Personalized packaging',
      'Coffee/tea pairing',
      'Recipe cards',
      'Dietary options'
    ],
    availability: ['Daily'],
    location: {
      address: 'Sweet Prague Kitchen',
      postcode: '12000',
      coordinates: { lat: 50.0830, lng: 14.4256 }
    }
  }


];

export const CATEGORIES = [
  {
    id: 'hen-do',
    title: 'Hen Do',
    description: 'Unforgettable celebrations for brides-to-be',
    image: 'https://images.pexels.com/photos/7551658/pexels-photo-7551658.jpeg',
    icon: 'champagne',
    subcategories: ['Activities', 'Spa & Beauty', 'Food & Drink', 'Dance Classes', 'Crafts']
  },
  {
    id: 'stag-do',
    title: 'Stag Do',
    description: 'Action-packed adventures for the groom-to-be',
    image: 'https://images.pexels.com/photos/5935232/pexels-photo-5935232.jpeg',
    icon: 'beer',
    subcategories: ['Activities', 'Sports', 'Racing', 'Shooting', 'Water Sports']
  },
  {
    id: 'team-building',
    title: 'Team Building',
    description: 'Engaging activities to strengthen team bonds',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
    icon: 'users',
    subcategories: ['Indoor', 'Outdoor', 'Challenges', 'Workshops', 'Games']
  },
  {
    id: 'birthday',
    title: 'Birthday',
    description: 'Memorable celebrations for all ages',
    image: 'https://images.pexels.com/photos/7180795/pexels-photo-7180795.jpeg',
    icon: 'cake',
    subcategories: ['Activities', 'Parties', 'Dining', 'Entertainment']
  },
  {
    id: 'corporate',
    title: 'Corporate',
    description: 'Professional events and team activities',
    image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
    icon: 'briefcase',
    subcategories: ['Meetings', 'Conferences', 'Team Building', 'Workshops']
  },
  {
    id: 'kids',
    title: 'Kids',
    description: 'Fun activities for younger groups',
    image: 'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg',
    icon: 'snowflake',
    subcategories: ['Parties', 'Activities', 'Education', 'Entertainment']
  }
];

export const CITIES = [
  {
    id: 'london',
    name: 'London',
    activities: 120,
    region: 'england',
    image: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg',
    description: 'Discover exciting activities in the capital'
  },
  {
    id: 'manchester',
    name: 'Manchester',
    activities: 85,
    region: 'england',
    image: 'https://images.pexels.com/photos/3584431/pexels-photo-3584431.jpeg',
    description: 'Vibrant activities in the heart of the North'
  },
  {
    id: 'birmingham',
    name: 'Birmingham',
    activities: 65,
    region: 'england',
    image: 'https://images.pexels.com/photos/585829/pexels-photo-585829.jpeg',
    description: 'Fun-filled experiences in the Second City'
  },
  {
    id: 'liverpool',
    name: 'Liverpool',
    activities: 55,
    region: 'england',
    image: 'https://images.pexels.com/photos/427679/pexels-photo-427679.jpeg',
    description: 'Exciting activities in the cultural hub'
  },
  {
    id: 'newcastle',
    name: 'Newcastle',
    activities: 45,
    region: 'england',
    image: 'https://images.pexels.com/photos/258117/pexels-photo-258117.jpeg',
    description: 'Unforgettable experiences in the North East'
  },
  {
    id: 'leeds',
    name: 'Leeds',
    activities: 50,
    region: 'england',
    image: 'https://images.pexels.com/photos/190482/pexels-photo-190482.jpeg',
    description: 'Dynamic activities in Yorkshire'
  },
  {
    id: 'bristol',
    name: 'Bristol',
    activities: 45,
    region: 'england',
    image: 'https://images.pexels.com/photos/302769/pexels-photo-302769.jpeg',
    description: 'Creative experiences in the South West'
  },
  {
    id: 'brighton',
    name: 'Brighton',
    activities: 40,
    region: 'england',
    image: 'https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg',
    description: 'Coastal fun and activities'
  },
  {
    id: 'edinburgh',
    name: 'Edinburgh',
    activities: 60,
    region: 'scotland',
    image: 'https://images.pexels.com/photos/164336/pexels-photo-164336.jpeg',
    description: 'Historic adventures in Scotland\'s capital'
  },
  {
    id: 'glasgow',
    name: 'Glasgow',
    activities: 50,
    region: 'scotland',
    image: 'https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg',
    description: 'Urban excitement in Scotland\'s largest city'
  },
  {
    id: 'cardiff',
    name: 'Cardiff',
    activities: 45,
    region: 'wales',
    image: 'https://images.pexels.com/photos/3990358/pexels-photo-3990358.jpeg',
    description: 'Welsh capital adventures'
  },
  {
    id: 'belfast',
    name: 'Belfast',
    activities: 32,
    region: 'northern-ireland',
    image: 'https://images.pexels.com/photos/355321/pexels-photo-355321.jpeg',
    description: 'Northern Irish experiences'
  },
  {
    id: 'dublin',
    name: 'Dublin',
    activities: 67,
    region: 'ireland',
    image: 'https://images.pexels.com/photos/2583852/pexels-photo-2583852.jpeg',
    description: 'Irish charm and activities'
  },
  {
    id: 'amsterdam',
    name: 'Amsterdam',
    activities: 76,
    region: 'netherlands',
    image: 'https://images.pexels.com/photos/573238/pexels-photo-573238.jpeg',
    description: 'Dutch adventures and experiences'
  },
  {
    id: 'barcelona',
    name: 'Barcelona',
    activities: 85,
    region: 'spain',
    image: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg',
    description: 'Catalan culture and activities'
  },
  {
    id: 'berlin',
    name: 'Berlin',
    activities: 78,
    region: 'germany',
    image: 'https://images.pexels.com/photos/490411/pexels-photo-490411.jpeg',
    description: 'German capital experiences'
  },
  {
    id: 'prague',
    name: 'Prague',
    activities: 54,
    region: 'czech-republic',
    image: 'https://images.pexels.com/photos/3722818/pexels-photo-3722818.jpeg',
    description: 'Czech adventures and culture'
  },
  {
    id: 'budapest',
    name: 'Budapest',
    activities: 43,
    region: 'hungary',
    image: 'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg',
    description: 'Hungarian cultural experiences'
  },
  {
    id: 'warsaw',
    name: 'Warsaw',
    activities: 45,
    region: 'poland',
    image: 'https://images.pexels.com/photos/1797160/pexels-photo-1797160.jpeg',
    description: 'Polish capital adventures'
  },
  {
    id: 'krakow',
    name: 'Krakow',
    activities: 20,
    region: 'poland',
    image: 'https://images.pexels.com/photos/1797162/pexels-photo-1797162.jpeg',
    description: 'Historic Polish city experiences'
  },
  {
    id: 'lisbon',
    name: 'Lisbon',
    activities: 58,
    region: 'portugal',
    image: 'https://images.pexels.com/photos/3757144/pexels-photo-3757144.jpeg',
    description: 'Portuguese capital delights'
  },
  {
    id: 'porto',
    name: 'Porto',
    activities: 20,
    region: 'portugal',
    image: 'https://images.pexels.com/photos/186461/pexels-photo-186461.jpeg',
    description: 'Northern Portuguese charm'
  },
];

export const REGIONS = [
  {
    id: 'england',
    name: 'England',
    activities: 245,
    cities: ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Newcastle', 'Leeds', 'Bristol', 'Brighton', 'Nottingham', 'Bournemouth', 'Bath', 'York', 'Chester']
  },
  {
    id: 'scotland',
    name: 'Scotland',
    activities: 89,
    cities: ['Edinburgh', 'Glasgow']
  },
  {
    id: 'wales',
    name: 'Wales',
    activities: 45,
    cities: ['Cardiff']
  },
  {
    id: 'northern-ireland',
    name: 'Northern Ireland',
    activities: 32,
    cities: ['Belfast']
  },
  {
    id: 'ireland',
    name: 'Ireland',
    activities: 67,
    cities: ['Dublin']
  },
  {
    id: 'spain',
    name: 'Spain',
    activities: 156,
    cities: ['Barcelona', 'Madrid', 'Benidorm', 'Magaluf', 'Marbella']
  },
  {
    id: 'germany',
    name: 'Germany',
    activities: 98,
    cities: ['Berlin', 'Hamburg', 'Munich']
  },
  {
    id: 'netherlands',
    name: 'Netherlands',
    activities: 76,
    cities: ['Amsterdam']
  },
  {
    id: 'czech-republic',
    name: 'Czech Republic',
    activities: 54,
    cities: ['Prague']
  },
  {
    id: 'hungary',
    name: 'Hungary',
    activities: 43,
    cities: ['Budapest']
  },
  {
    id: 'poland',
    name: 'Poland',
    activities: 65,
    cities: ['Krakow']
  },
  {
    id: 'portugal',
    name: 'Portugal',
    activities: 78,
    cities: ['Lisbon']
  }
];

export const BLOG_POSTS = [
  {
    id: '1',
    title: '10 Unique Hen Party Ideas That Break The Mold',
    snippet: 'Move beyond the traditional with these creative hen party activities that will make your celebration truly memorable.',
    image: 'https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg',
    author: 'Sarah Johnson',
    date: '2024-03-15',
    category: 'Party Planning',
    readTime: '5 min read'
  },
  {
    id: '2',
    title: 'The Ultimate Guide to Planning a Corporate Team Building Day',
    snippet: 'Boost team morale and productivity with these engaging activities that will bring your colleagues closer together.',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
    author: 'Michael Chen',
    date: '2024-03-10',
    category: 'Corporate Events',
    readTime: '7 min read'
  },
  {
    id: '3',
    title: 'Budget-Friendly Birthday Party Ideas That Look Expensive',
    snippet: 'Create an unforgettable birthday celebration without breaking the bank with these smart planning tips.',
    image: 'https://images.pexels.com/photos/7180617/pexels-photo-7180617.jpeg',
    author: 'Emma Williams',
    date: '2024-03-05',
    category: 'Party Planning',
    readTime: '4 min read'
  },
  {
    id: '4',
    title: 'Seasonal Activities: Making the Most of Summer Celebrations',
    snippet: 'From outdoor adventures to rooftop parties, discover the best ways to celebrate during the warmer months.',
    image: 'https://images.pexels.com/photos/5530176/pexels-photo-5530176.jpeg',
    author: 'Tom Parker',
    date: '2024-02-28',
    category: 'Seasonal',
    readTime: '6 min read'
  }
];

export const TEAM_MEMBERS = [
  {
    name: 'Emily Thompson',
    role: 'Founder & CEO',
    image: 'https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg',
    bio: 'With over 15 years in event planning, Emily founded Party Pulse to help people create unforgettable celebrations.'
  },
  {
    name: 'James Wilson',
    role: 'Head of Experiences',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    bio: 'James curates our activity selection, ensuring only the highest quality experiences make it onto our platform.'
  },
  {
    name: 'Sophie Chen',
    role: 'Customer Success Manager',
    image: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg',
    bio: 'Sophie leads our customer support team, making sure every booking runs smoothly from start to finish.'
  }
];

export const TESTIMONIALS = [
  {
    name: 'Rachel B.',
    location: 'Manchester',
    image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
    text: 'Party Pulse made organizing my sister\'s hen do so easy! The cocktail making class was a huge hit, and the booking process was seamless.',
    rating: 5
  },
  {
    name: 'Mark T.',
    location: 'London',
    image: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg',
    text: 'We used Party Pulse for our team building day and couldn\'t be happier. The escape room challenge was perfect for bringing the team together.',
    rating: 5
  },
  {
    name: 'Sarah W.',
    location: 'Edinburgh',
    image: 'https://images.pexels.com/photos/1181695/pexels-photo-1181695.jpeg',
    text: 'Found the perfect birthday activity through Party Pulse. The wine tasting experience was sophisticated and fun - exactly what I wanted!',
    rating: 5
  }
];

export const ACTIVITY_CATEGORIES = [
  {
    id: 'hen-parties',
    title: 'Hen Parties',
    description: 'Unforgettable celebrations for the bride-to-be',
    subcategories: [
      'Cocktail Making',
      'Dance Classes',
      'Spa Days',
      'Life Drawing',
      'Afternoon Tea',
      'Wine Tasting'
    ]
  },
  {
    id: 'stag-parties',
    title: 'Stag Parties',
    description: 'Epic last nights of freedom',
    subcategories: [
      'Beer Tasting',
      'Go Karting',
      'Paintball',
      'Casino Nights',
      'Escape Rooms',
      'Adventure Sports'
    ]
  },
  {
    id: 'team-building',
    title: 'Team Building',
    description: 'Build stronger teams with fun activities',
    subcategories: [
      'Cooking Classes',
      'Escape Rooms',
      'Outdoor Activities',
      'Indoor Games',
      'Creative Workshops',
      'Sports Events'
    ]
  },
  {
    id: 'birthdays',
    title: 'Birthdays',
    description: 'Make your birthday extra special',
    subcategories: [
      'Party Packages',
      'Dining Experiences',
      'Activity Days',
      'Entertainment',
      'Adventure Activities',
      'Group Games'
    ]
  },
  {
    id: 'christmas',
    title: 'Christmas',
    description: 'Festive celebrations for groups',
    subcategories: [
      'Party Nights',
      'Dinner & Dance',
      'Themed Events',
      'Lunch Parties',
      'Entertainment',
      'Activities'
    ]

  }
];

export const PARTY_EXTRAS = [
  {
    id: 'decorations',
    name: 'Decorations',
    options: [
      {
        id: 'basic-decorations',
        name: 'Basic Decoration Package',
        price: 50,
        includes: ['Balloons', 'Banners', 'Table decorations']
      },
      {
        id: 'premium-decorations',
        name: 'Premium Decoration Package',
        price: 100,
        includes: ['Themed decorations', 'Photo backdrop', 'Centerpieces', 'LED lights']
      }
    ]
  },
  {
    id: 'catering',
    name: 'Food & Drinks',
    options: [
      {
        id: 'drinks-package',
        name: 'Welcome Drinks Package',
        pricePerPerson: 15,
        includes: ['Prosecco reception', 'Soft drinks', 'Mixers']
      },
      {
        id: 'buffet-package',
        name: 'Buffet Package',
        pricePerPerson: 25,
        includes: ['Selection of sandwiches', 'Hot finger food', 'Desserts', 'Soft drinks']
      }
    ]
  },
  {
    id: 'extras',
    name: 'Additional Extras',
    options: [
      {
        id: 'photographer',
        name: 'Professional Photographer',
        price: 200,
        includes: ['2 hours coverage', 'Digital photos', 'Online gallery']
      },
      {
        id: 'transport',
        name: 'Transport Package',
        pricePerPerson: 20,
        includes: ['Return minibus transfer', 'Professional driver', 'City center pickup']
      }
    ]
  }
];

export const GROUP_SIZES = [
  {
    id: 'small',
    name: 'Small',
    range: '1-5 people'
  },
  {
    id: 'medium',
    name: 'Medium',
    range: '6-15 people'
  },
  {
    id: 'large',
    name: 'Large',
    range: '16+ people'
  }
];