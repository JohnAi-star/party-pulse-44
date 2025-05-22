import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Users, Star, Calendar, Info, Check } from 'lucide-react';

const MOCK_VENUES = [
  {
    id: '1',
    name: 'The Grand Ballroom',
    description: 'Elegant venue perfect for weddings and corporate events. Our Grand Ballroom features crystal chandeliers, a sprung dance floor, and state-of-the-art sound system. The space can be configured for various events from formal dinners to conference presentations.',
    location: {
      address: '123 Elegant Street',
      city: 'London',
      postcode: 'W1A 1AA',
      coordinates: { lat: 51.5074, lng: -0.1278 }
    },
    capacity: '50-300',
    priceFrom: 1000,
    image: 'https://images.pexels.com/photos/169190/pexels-photo-169190.jpeg',
    images: [
      'https://images.pexels.com/photos/169190/pexels-photo-169190.jpeg',
      'https://images.pexels.com/photos/260928/pexels-photo-260928.jpeg',
      'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg'
    ],
    features: [
      'Dance Floor',
      'Bar',
      'Kitchen',
      'Sound System',
      'Air Conditioning',
      'Disabled Access',
      'Private Entrance',
      'Parking'
    ],
    amenities: {
      catering: ['In-house catering', 'External caterers allowed'],
      bar: ['Licensed bar', 'BYO alcohol permitted'],
      facilities: ['Changing rooms', 'Green room', 'Loading bay']
    },
    floorPlan: 'https://images.pexels.com/photos/271667/pexels-photo-271667.jpeg',
    virtualTour: 'https://example.com/virtual-tour',
    rating: 4.8,
    reviewCount: 156,
    availability: ['Monday-Sunday', '8:00-00:00'],
    packages: [
      {
        name: 'Basic Package',
        price: 1000,
        includes: ['Venue hire', 'Basic lighting', 'Sound system']
      },
      {
        name: 'Premium Package',
        price: 2000,
        includes: ['Venue hire', 'Professional lighting', 'Sound system', 'Security', 'Bar staff']
      }
    ]
  },
  {
    id: '2',
    name: 'Urban Loft',
    description: 'Modern industrial space ideal for parties and exhibitions. Features exposed brick walls, high ceilings, and panoramic city views.',
    location: {
      address: '456 Industrial Ave',
      city: 'Manchester',
      postcode: 'M1 1AA',
      coordinates: { lat: 53.4808, lng: -2.2426 }
    },
    capacity: '20-150',
    priceFrom: 750,
    image: 'https://images.pexels.com/photos/260931/pexels-photo-260931.jpeg',
    images: [
      'https://images.pexels.com/photos/260931/pexels-photo-260931.jpeg',
      'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg',
      'https://images.pexels.com/photos/260928/pexels-photo-260928.jpeg'
    ],
    features: [
      'Rooftop Access',
      'Bar',
      'WiFi',
      'AV Equipment',
      'Industrial Kitchen',
      'Freight Elevator',
      'Outdoor Space'
    ],
    amenities: {
      catering: ['Kitchen access', 'Preferred caterer list'],
      bar: ['Full bar service', 'Bartender included'],
      facilities: ['Elevator access', 'Loading dock', 'Restrooms']
    },
    floorPlan: 'https://images.pexels.com/photos/271667/pexels-photo-271667.jpeg',
    virtualTour: 'https://example.com/virtual-tour',
    rating: 4.6,
    reviewCount: 98,
    availability: ['Monday-Sunday', '9:00-02:00'],
    packages: [
      {
        name: 'Half Day',
        price: 750,
        includes: ['6-hour venue hire', 'Basic setup', 'Cleaning']
      },
      {
        name: 'Full Day',
        price: 1200,
        includes: ['12-hour venue hire', 'Full setup', 'Cleaning', 'Security']
      }
    ]
  },
  {
    id: '3',
    name: 'The Garden Room',
    description: 'Beautiful garden venue perfect for summer celebrations. Features a stunning glass conservatory and manicured gardens.',
    location: {
      address: '789 Garden Lane',
      city: 'Birmingham',
      postcode: 'B1 1AA',
      coordinates: { lat: 52.4862, lng: -1.8904 }
    },
    capacity: '30-200',
    priceFrom: 850,
    image: 'https://images.pexels.com/photos/265947/pexels-photo-265947.jpeg',
    images: [
      'https://images.pexels.com/photos/265947/pexels-photo-265947.jpeg',
      'https://images.pexels.com/photos/265938/pexels-photo-265938.jpeg',
      'https://images.pexels.com/photos/265937/pexels-photo-265937.jpeg'
    ],
    features: [
      'Outdoor Space',
      'Marquee',
      'Catering Kitchen',
      'Parking',
      'Garden Lighting',
      'Indoor Backup Space',
      'Heating'
    ],
    amenities: {
      catering: ['Full kitchen', 'BBQ area', 'External catering allowed'],
      bar: ['Mobile bar service', 'Wine service'],
      facilities: ['Restrooms', 'Changing rooms', 'Coat check']
    },
    floorPlan: 'https://images.pexels.com/photos/271667/pexels-photo-271667.jpeg',
    virtualTour: 'https://example.com/virtual-tour',
    rating: 4.7,
    reviewCount: 124,
    availability: ['Monday-Sunday', '10:00-23:00'],
    packages: [
      {
        name: 'Garden Party',
        price: 850,
        includes: ['Venue hire', 'Garden furniture', 'Marquee']
      },
      {
        name: 'Deluxe Package',
        price: 1500,
        includes: ['Venue hire', 'Garden furniture', 'Marquee', 'Lighting', 'Heaters']
      }
    ]
  },
  {
    id: '4',
    name: 'The Skyline Loft',
    description: 'Modern rooftop venue with panoramic city views. Features a stylish lounge area and retractable glass roof for all-weather events.',
    location: {
      address: '12 Highrise Avenue',
      city: 'Manchester',
      postcode: 'M1 1AB',
      coordinates: { lat: 53.4808, lng: -2.2426 }
    },
    capacity: '50-150',
    priceFrom: 1200,
    image: 'https://images.pexels.com/photos/2587054/pexels-photo-2587054.jpeg',
    images: [
      'https://images.pexels.com/photos/2587054/pexels-photo-2587054.jpeg',
      'https://images.pexels.com/photos/2587055/pexels-photo-2587055.jpeg',
      'https://images.pexels.com/photos/2587056/pexels-photo-2587056.jpeg'
    ],
    features: [
      'Rooftop Terrace',
      'Minimalist Decor',
      'AV Equipment',
      'Bar',
      'City Views',
      'Retractable Roof',
      'LED Lighting'
    ],
    amenities: {
      catering: ['Prep kitchen', 'External catering allowed'],
      bar: ['Built-in cocktail bar', 'Champagne service'],
      facilities: ['Restrooms', 'VIP lounge', 'Elevator access']
    },
    floorPlan: 'https://images.pexels.com/photos/271668/pexels-photo-271668.jpeg',
    virtualTour: 'https://example.com/skyline-tour',
    rating: 4.8,
    reviewCount: 98,
    availability: ['Thursday-Sunday', '17:00-01:00'],
    packages: [
      {
        name: 'Standard Hire',
        price: 1200,
        includes: ['Venue hire', 'Basic AV equipment', 'Furniture']
      },
      {
        name: 'Premium Package',
        price: 2200,
        includes: ['Venue hire', 'Premium AV', 'Furniture', 'Bar staff', 'Lighting']
      }
    ]
  },
  {
    id: '5',
    name: 'The Vintage Barn',
    description: 'Rustic countryside barn for weddings and events. Features original oak beams and picturesque farmland views.',
    location: {
      address: 'Farm Road',
      city: 'Cotswolds',
      postcode: 'GL7 7AA',
      coordinates: { lat: 51.8333, lng: -1.8333 }
    },
    capacity: '80-250',
    priceFrom: 1800,
    image: 'https://images.pexels.com/photos/169523/pexels-photo-169523.jpeg',
    images: [
      'https://images.pexels.com/photos/169523/pexels-photo-169523.jpeg',
      'https://images.pexels.com/photos/169524/pexels-photo-169524.jpeg',
      'https://images.pexels.com/photos/169525/pexels-photo-169525.jpeg'
    ],
    features: [
      'Exposed Beams',
      'Outdoor Ceremony Space',
      'Catering Options',
      'Parking',
      'Bridal Suite',
      'Wood Burners',
      'Garden Area'
    ],
    amenities: {
      catering: ['Commercial kitchen', 'BBQ area', 'Preferred caterers'],
      bar: ['Mobile bar service', 'Local ales'],
      facilities: ['Restrooms', 'Bridal suite', 'Disabled access']
    },
    floorPlan: 'https://images.pexels.com/photos/271669/pexels-photo-271669.jpeg',
    virtualTour: 'https://example.com/barn-tour',
    rating: 4.9,
    reviewCount: 210,
    availability: ['Monday-Sunday', '09:00-00:00'],
    packages: [
      {
        name: 'Weekday Hire',
        price: 1800,
        includes: ['Venue hire', 'Tables/chairs', 'Basic decor']
      },
      {
        name: 'Wedding Package',
        price: 3500,
        includes: ['Full weekend hire', 'All furniture', 'Setup/teardown', 'Coordination']
      }
    ]
  },
  {
    id: '6',
    name: 'The Marina Club',
    description: 'Elegant waterfront venue for corporate or social events. Features private dock access and nautical-themed decor.',
    location: {
      address: 'Harbour Way',
      city: 'Brighton',
      postcode: 'BN1 1BB',
      coordinates: { lat: 50.8225, lng: -0.1372 }
    },
    capacity: '40-120',
    priceFrom: 950,
    image: 'https://images.pexels.com/photos/2373201/pexels-photo-2373201.jpeg',
    images: [
      'https://images.pexels.com/photos/2373201/pexels-photo-2373201.jpeg',
      'https://images.pexels.com/photos/2373202/pexels-photo-2373202.jpeg',
      'https://images.pexels.com/photos/2373203/pexels-photo-2373203.jpeg'
    ],
    features: [
      'Sea Views',
      'Private Dock',
      'Indoor/Outdoor Space',
      'WiFi',
      'Yacht Access',
      'Heated Terrace',
      'Sound System'
    ],
    amenities: {
      catering: ['Small kitchen', 'Seafood specialists'],
      bar: ['Full liquor license', 'Champagne bar'],
      facilities: ['Restrooms', 'Coat check', 'Waterfront access']
    },
    floorPlan: 'https://images.pexels.com/photos/271670/pexels-photo-271670.jpeg',
    virtualTour: 'https://example.com/marina-tour',
    rating: 4.6,
    reviewCount: 87,
    availability: ['Wednesday-Sunday', '10:00-23:00'],
    packages: [
      {
        name: 'Daytime Hire',
        price: 950,
        includes: ['Venue hire', 'Basic furniture', 'AV setup']
      },
      {
        name: 'Evening Package',
        price: 1800,
        includes: ['Venue hire', 'Furniture', 'Lighting', 'Sound system', 'Security']
      }
    ]
  },
  {
    id: '7',
    name: 'The Urban Warehouse',
    description: 'Industrial-chic space for creative gatherings in the heart of London. Features exposed brick walls and customizable lighting systems.',
    location: {
      address: '42 Factory Road',
      city: 'London',
      postcode: 'E1 6LT',
      coordinates: { lat: 51.5074, lng: -0.1278 }
    },
    capacity: '60-300',
    priceFrom: 1500,
    image: 'https://images.pexels.com/photos/325876/pexels-photo-325876.jpeg',
    images: [
      'https://images.pexels.com/photos/325876/pexels-photo-325876.jpeg',
      'https://images.pexels.com/photos/325877/pexels-photo-325877.jpeg',
      'https://images.pexels.com/photos/325878/pexels-photo-325878.jpeg'
    ],
    features: [
      'High Ceilings',
      'Custom Lighting',
      'Flexible Layout',
      'Sound System',
      'Loading Access',
      'Projector Screen',
      'Dressing Rooms'
    ],
    amenities: {
      catering: ['Prep area', 'Food trucks allowed'],
      bar: ['Portable bars', 'Craft beer taps'],
      facilities: ['Restrooms', 'Green room', 'Street parking']
    },
    floorPlan: 'https://images.pexels.com/photos/271671/pexels-photo-271671.jpeg',
    virtualTour: 'https://example.com/warehouse-tour',
    rating: 4.5,
    reviewCount: 145,
    availability: ['Monday-Sunday', '08:00-02:00'],
    packages: [
      {
        name: 'Basic Hire',
        price: 1500,
        includes: ['Empty space', 'Basic lighting', 'Security']
      },
      {
        name: 'Production Package',
        price: 3500,
        includes: ['Full AV setup', 'Lighting design', 'Staff support', 'Furniture rental']
      }
    ]
  },
  {
    id: '8',
    name: 'The Orchard Pavilion',
    description: 'Tented venue surrounded by apple orchards in Kent. Features seasonal blossoms and a wooden dance floor under elegant sailcloth.',
    location: {
      address: 'Orchard Lane',
      city: 'Kent',
      postcode: 'ME17 1AA',
      coordinates: { lat: 51.2787, lng: 0.5217 }
    },
    capacity: '100-400',
    priceFrom: 2200,
    image: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg',
    images: [
      'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg',
      'https://images.pexels.com/photos/1457843/pexels-photo-1457843.jpeg',
      'https://images.pexels.com/photos/1457844/pexels-photo-1457844.jpeg'
    ],
    features: [
      'Seasonal Flowers',
      'Outdoor Dance Floor',
      'Bridal Suite',
      'On-site Staff',
      'Festoon Lighting',
      'Heated Tents',
      'Fire Pits'
    ],
    amenities: {
      catering: ['Outdoor kitchen', 'Wood-fired oven'],
      bar: ['Gin bar', 'Cider station'],
      facilities: ['Luxury restrooms', 'Bridal cottage', 'Ample parking']
    },
    floorPlan: 'https://images.pexels.com/photos/271672/pexels-photo-271672.jpeg',
    virtualTour: 'https://example.com/orchard-tour',
    rating: 4.7,
    reviewCount: 176,
    availability: ['April-October', '10:00-00:00'],
    packages: [
      {
        name: 'Weekend Hire',
        price: 2200,
        includes: ['Venue hire', 'Basic furniture', 'Setup support']
      },
      {
        name: 'Full Wedding',
        price: 5000,
        includes: ['3-day hire', 'All furniture', 'Lighting', 'Coordination', 'Floral arch']
      }
    ]
  },
  {
    id: '9',
    name: 'The Library Lounge',
    description: 'Intimate book-lined venue for sophisticated soirées in Edinburgh. Features leather armchairs and a working fireplace.',
    location: {
      address: '22 Bookworm Street',
      city: 'Edinburgh',
      postcode: 'EH1 1AB',
      coordinates: { lat: 55.9533, lng: -3.1883 }
    },
    capacity: '20-80',
    priceFrom: 700,
    image: 'https://images.pexels.com/photos/1319854/pexels-photo-1319854.jpeg',
    images: [
      'https://images.pexels.com/photos/1319854/pexels-photo-1319854.jpeg',
      'https://images.pexels.com/photos/1319855/pexels-photo-1319855.jpeg',
      'https://images.pexels.com/photos/1319856/pexels-photo-1319856.jpeg'
    ],
    features: [
      'Antique Decor',
      'Fireplace',
      'Private Bar',
      'Projector',
      'Grand Piano',
      'Whiskey Library',
      'Soundproofing'
    ],
    amenities: {
      catering: ['Canapé service', 'Cheese/wine pairings'],
      bar: ['Scotch selection', 'Vintage cocktails'],
      facilities: ['Restrooms', 'Coat room', 'Disabled access']
    },
    floorPlan: 'https://images.pexels.com/photos/271673/pexels-photo-271673.jpeg',
    virtualTour: 'https://example.com/library-tour',
    rating: 4.9,
    reviewCount: 112,
    availability: ['Tuesday-Sunday', '18:00-23:00'],
    packages: [
      {
        name: 'Evening Hire',
        price: 700,
        includes: ['Venue hire', 'Basic furniture', 'Bartender']
      },
      {
        name: 'Whiskey Tasting',
        price: 1200,
        includes: ['Venue hire', 'Expert host', '5 premium whiskeys', 'Cheese board']
      }
    ]
  },
  {
    id: '10',
    name: 'The Glasshouse',
    description: 'Sunlit conservatory venue with botanical gardens in Bristol. Features exotic plants and a retractable glass ceiling.',
    location: {
      address: 'Botanical Gardens',
      city: 'Bristol',
      postcode: 'BS1 1AA',
      coordinates: { lat: 51.4545, lng: -2.5879 }
    },
    capacity: '30-100',
    priceFrom: 1100,
    image: 'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg',
    images: [
      'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg',
      'https://images.pexels.com/photos/931178/pexels-photo-931178.jpeg',
      'https://images.pexels.com/photos/931179/pexels-photo-931179.jpeg'
    ],
    features: [
      'Floor-to-Ceiling Windows',
      'Heated Floors',
      'Catering Kitchen',
      'Disabled Access',
      'Tropical Plants',
      'Water Features',
      'Climate Control'
    ],
    amenities: {
      catering: ['Commercial kitchen', 'Garden-to-table menus'],
      bar: ['Botanical cocktails', 'Local ciders'],
      facilities: ['Restrooms', 'Green room', 'Garden access']
    },
    floorPlan: 'https://images.pexels.com/photos/271674/pexels-photo-271674.jpeg',
    virtualTour: 'https://example.com/glasshouse-tour',
    rating: 4.8,
    reviewCount: 134,
    availability: ['Wednesday-Sunday', '09:00-22:00'],
    packages: [
      {
        name: 'Daytime Hire',
        price: 1100,
        includes: ['Venue hire', 'Basic setup', 'Garden access']
      },
      {
        name: 'Botanical Package',
        price: 2500,
        includes: ['Floral installations', 'Custom lighting', 'Garden tours', 'Staff']
      }
    ]
  },
  {
    id: '11',
    name: 'The Brewery Cellar',
    description: 'Underground brick vaults for unique parties in Leeds. Features craft beer taps and vintage industrial charm.',
    location: {
      address: 'Brewery Yard',
      city: 'Leeds',
      postcode: 'LS1 1AB',
      coordinates: { lat: 53.8008, lng: -1.5491 }
    },
    capacity: '50-180',
    priceFrom: 850,
    image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg',
    images: [
      'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg',
      'https://images.pexels.com/photos/1267321/pexels-photo-1267321.jpeg',
      'https://images.pexels.com/photos/1267322/pexels-photo-1267322.jpeg'
    ],
    features: [
      'Exposed Brick',
      'Craft Beer Bar',
      'Live Music Setup',
      'Vintage Furniture',
      'Barrel Tables',
      'Stage Area',
      'Smoking Courtyard'
    ],
    amenities: {
      catering: ['Bar snacks', 'Food trucks welcome'],
      bar: ['10 craft taps', 'Brewery tours'],
      facilities: ['Restrooms', 'Coat check', 'Loading access']
    },
    floorPlan: 'https://images.pexels.com/photos/271675/pexels-photo-271675.jpeg',
    virtualTour: 'https://example.com/brewery-tour',
    rating: 4.4,
    reviewCount: 92,
    availability: ['Thursday-Saturday', '19:00-02:00'],
    packages: [
      {
        name: 'Basic Hire',
        price: 850,
        includes: ['Venue hire', 'Basic sound system', 'Staff']
      },
      {
        name: 'Beer Lover Package',
        price: 1500,
        includes: ['Private brewery tour', 'Beer tasting', 'Dedicated bartenders']
      }
    ]
  },
  {
    id: '12',
    name: 'The Lakeside Pavilion',
    description: 'Scenic venue with private lake access in the Lake District. Features a boathouse and mountain views.',
    location: {
      address: 'Lakeview Estate',
      city: 'Lake District',
      postcode: 'LA23 1AA',
      coordinates: { lat: 54.4609, lng: -3.0886 }
    },
    capacity: '50-200',
    priceFrom: 2000,
    image: 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg',
    images: [
      'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg',
      'https://images.pexels.com/photos/1450361/pexels-photo-1450361.jpeg',
      'https://images.pexels.com/photos/1450362/pexels-photo-1450362.jpeg'
    ],
    features: [
      'Boathouse',
      'BBQ Area',
      'Glamping Options',
      'Pet Friendly',
      'Hot Tub',
      'Dock Access',
      'Mountain Views'
    ],
    amenities: {
      catering: ['Outdoor kitchen', 'Local meat/cheese'],
      bar: ['Lakeview bar', 'Local spirits'],
      facilities: ['Luxury restrooms', 'Changing rooms', 'Parking']
    },
    floorPlan: 'https://images.pexels.com/photos/271676/pexels-photo-271676.jpeg',
    virtualTour: 'https://example.com/lakeside-tour',
    rating: 4.9,
    reviewCount: 203,
    availability: ['May-September', '09:00-23:00'],
    packages: [
      {
        name: 'Day Retreat',
        price: 2000,
        includes: ['Venue hire', 'Furniture', 'Boat rides']
      },
      {
        name: 'Weekend Escape',
        price: 5000,
        includes: ['2-night hire', 'Glamping tents', 'BBQ feast', 'Water activities']
      }
    ]
  },
  {
    id: '13',
    name: 'The Gallery Hall',
    description: 'Art-filled space for upscale events in London. Features rotating exhibitions and a grand piano.',
    location: {
      address: '88 Art Street',
      city: 'London',
      postcode: 'SW1Y 1AB',
      coordinates: { lat: 51.5074, lng: -0.1278 }
    },
    capacity: '70-250',
    priceFrom: 1600,
    image: 'https://images.pexels.com/photos/3435272/pexels-photo-3435272.jpeg',
    images: [
      'https://images.pexels.com/photos/3435272/pexels-photo-3435272.jpeg',
      'https://images.pexels.com/photos/3435273/pexels-photo-3435273.jpeg',
      'https://images.pexels.com/photos/3435274/pexels-photo-3435274.jpeg'
    ],
    features: [
      'Rotating Exhibits',
      'Grand Piano',
      'Catering Partners',
      'Valet Parking',
      'Projector Walls',
      'Skylights',
      'Acoustic Panels'
    ],
    amenities: {
      catering: ['Gourmet partners', 'Tasting menus'],
      bar: ['Signature cocktails', 'Sommelier service'],
      facilities: ['Restrooms', 'Coat check', 'VIP lounge']
    },
    floorPlan: 'https://images.pexels.com/photos/271677/pexels-photo-271677.jpeg',
    virtualTour: 'https://example.com/gallery-tour',
    rating: 4.7,
    reviewCount: 158,
    availability: ['Monday-Sunday', '10:00-23:00'],
    packages: [
      {
        name: 'Standard Hire',
        price: 1600,
        includes: ['Venue hire', 'Basic setup', 'Piano use']
      },
      {
        name: 'Gala Package',
        price: 3500,
        includes: ['Full staff', 'Lighting design', 'Exhibition curation', 'Valet service']
      }
    ]
  }
];

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const venue = MOCK_VENUES.find(v => v.id === params.id);
  
  if (!venue) {
    return {
      title: 'Venue Not Found | Party Pulse',
      description: 'The requested venue could not be found.'
    };
  }

  return {
    title: `${venue.name} | Party Pulse Venues`,
    description: venue.description,
    openGraph: {
      images: [venue.image]
    }
  };
}

export default function VenueDetailsPage({ params }: { params: { id: string } }) {
  const venue = MOCK_VENUES.find(v => v.id === params.id);

  if (!venue) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Gallery */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image
                  src={venue.images[0]}
                  alt={venue.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            {venue.images.slice(1).map((image, index) => (
              <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                <Image
                  src={image}
                  alt={`${venue.name} ${index + 2}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          {/* Venue Info */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-3xl font-bold">{venue.name}</h1>
              <Badge variant="outline" className="text-sm">
                From £{venue.priceFrom}
              </Badge>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {venue.location.city}
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {venue.capacity} guests
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                {venue.rating} ({venue.reviewCount} reviews)
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="packages">Packages</TabsTrigger>
              <TabsTrigger value="floorplan">Floor Plan</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">About this venue</h3>
                <p className="text-muted-foreground">{venue.description}</p>
                
                <h3 className="text-lg font-semibold mt-6 mb-4">Features</h3>
                <div className="grid grid-cols-2 gap-2">
                  {venue.features.map((feature) => (
                    <div key={feature} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Amenities</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Catering</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {venue.amenities.catering.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Bar</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {venue.amenities.bar.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Facilities</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {venue.amenities.facilities.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="packages">
              <div className="grid md:grid-cols-2 gap-6">
                {venue.packages.map((pkg) => (
                  <Card key={pkg.name}>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{pkg.name}</h3>
                      <p className="text-2xl font-bold mb-4">£{pkg.price}</p>
                      <ul className="space-y-2">
                        {pkg.includes.map((item) => (
                          <li key={item} className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="floorplan">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                <Image
                  src={venue.floorPlan}
                  alt="Floor Plan"
                  fill
                  className="object-cover"
                />
              </div>
            </TabsContent>

            <TabsContent value="location">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Address</h3>
                  <p className="text-muted-foreground">
                    {venue.location.address}<br />
                    {venue.location.city}<br />
                    {venue.location.postcode}
                  </p>
                </div>
                
                <div className="aspect-video relative rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${venue.location.coordinates.lat},${venue.location.coordinates.lng}`}
                  ></iframe>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Booking Sidebar */}
        <div>
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <div className="mb-6">
                <p className="text-2xl font-bold">From £{venue.priceFrom}</p>
                <p className="text-sm text-muted-foreground">
                  Price varies based on date and package
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Availability</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    {venue.availability.map((time) => (
                      <div key={time} className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {time}
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                  Check Availability
                </Button>

                <Button variant="outline" className="w-full">
                  Request Viewing
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Info className="h-4 w-4" />
                  <span>Free cancellation up to 14 days before event</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}