import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Users, Search } from 'lucide-react';
import VenueCard from '@/components/venues/VenueCard';

export const metadata: Metadata = {
  title: 'Venues | Party Pulse',
  description: 'Find the perfect venue for your celebration',
};

const MOCK_VENUES = [
  {
    id: '1',
    name: 'The Grand Ballroom',
    description: 'Elegant venue perfect for weddings and corporate events',
    location: 'London',
    capacity: '50-300',
    priceFrom: 1000,
    image: 'https://images.pexels.com/photos/169190/pexels-photo-169190.jpeg',
    features: ['Dance Floor', 'Bar', 'Kitchen', 'Sound System'],
    rating: 4.8,
    reviewCount: 156
  },
  {
    id: '2',
    name: 'Urban Loft',
    description: 'Modern industrial space ideal for parties and exhibitions',
    location: 'Manchester',
    capacity: '20-150',
    priceFrom: 750,
    image: 'https://images.pexels.com/photos/260931/pexels-photo-260931.jpeg',
    features: ['Rooftop Access', 'Bar', 'WiFi', 'AV Equipment'],
    rating: 4.6,
    reviewCount: 98
  },
  {
    id: '3',
    name: 'The Garden Room',
    description: 'Beautiful garden venue perfect for summer celebrations',
    location: 'Birmingham',
    capacity: '30-200',
    priceFrom: 850,
    image: 'https://images.pexels.com/photos/265947/pexels-photo-265947.jpeg',
    features: ['Outdoor Space', 'Marquee', 'Catering Kitchen', 'Parking'],
    rating: 4.7,
    reviewCount: 124
  },
  {
    id: "4",
    name: "The Skyline Loft",
    description: "Modern rooftop venue with panoramic city views",
    location: "Manchester",
    capacity: "50-150",
    priceFrom: 1200,
    image: "https://images.pexels.com/photos/2587054/pexels-photo-2587054.jpeg",
    features: ["Rooftop Terrace", "Minimalist Decor", "AV Equipment", "Bar"],
    rating: 4.8,
    reviewCount: 98
  },
  {
    id: "5",
    name: "The Vintage Barn",
    description: "Rustic countryside barn for weddings and events",
    location: "Cotswolds",
    capacity: "80-250",
    priceFrom: 1800,
    image: "https://images.pexels.com/photos/169523/pexels-photo-169523.jpeg",
    features: ["Exposed Beams", "Outdoor Ceremony Space", "Catering Options", "Parking"],
    rating: 4.9,
    reviewCount: 210
  },
  {
    id: "6",
    name: "The Marina Club",
    description: "Elegant waterfront venue for corporate or social events",
    location: "Brighton",
    capacity: "40-120",
    priceFrom: 950,
    image: "https://images.pexels.com/photos/2373201/pexels-photo-2373201.jpeg",
    features: ["Sea Views", "Private Dock", "Indoor/Outdoor Space", "WiFi"],
    rating: 4.6,
    reviewCount: 87
  },
  {
    id: "7",
    name: "The Urban Warehouse",
    description: "Industrial-chic space for creative gatherings",
    location: "London",
    capacity: "60-300",
    priceFrom: 1500,
    image: "https://images.pexels.com/photos/325876/pexels-photo-325876.jpeg",
    features: ["High Ceilings", "Custom Lighting", "Flexible Layout", "Sound System"],
    rating: 4.5,
    reviewCount: 145
  },
  {
    id: "8",
    name: "The Orchard Pavilion",
    description: "Tented venue surrounded by apple orchards",
    location: "Kent",
    capacity: "100-400",
    priceFrom: 2200,
    image: "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg",
    features: ["Seasonal Flowers", "Outdoor Dance Floor", "Bridal Suite", "On-site Staff"],
    rating: 4.7,
    reviewCount: 176
  },
  {
    id: "9",
    name: "The Library Lounge",
    description: "Intimate book-lined venue for sophisticated soirées",
    location: "Edinburgh",
    capacity: "20-80",
    priceFrom: 700,
    image: "https://images.pexels.com/photos/1319854/pexels-photo-1319854.jpeg",
    features: ["Antique Decor", "Fireplace", "Private Bar", "Projector"],
    rating: 4.9,
    reviewCount: 112
  },
  {
    id: "10",
    name: "The Glasshouse",
    description: "Sunlit conservatory venue with botanical gardens",
    location: "Bristol",
    capacity: "30-100",
    priceFrom: 1100,
    image: "https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg",
    features: ["Floor-to-Ceiling Windows", "Heated Floors", "Catering Kitchen", "Disabled Access"],
    rating: 4.8,
    reviewCount: 134
  },
  {
    id: "11",
    name: "The Brewery Cellar",
    description: "Underground brick vaults for unique parties",
    location: "Leeds",
    capacity: "50-180",
    priceFrom: 850,
    image: "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg",
    features: ["Exposed Brick", "Craft Beer Bar", "Live Music Setup", "Vintage Furniture"],
    rating: 4.4,
    reviewCount: 92
  },
  {
    id: "12",
    name: "The Lakeside Pavilion",
    description: "Scenic venue with private lake access",
    location: "Lake District",
    capacity: "50-200",
    priceFrom: 2000,
    image: "https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg",
    features: ["Boathouse", "BBQ Area", "Glamping Options", "Pet Friendly"],
    rating: 4.9,
    reviewCount: 203
  },
  {
    id: "13",
    name: "The Gallery Hall",
    description: "Art-filled space for upscale events",
    location: "London",
    capacity: "70-250",
    priceFrom: 1600,
    image: "https://images.pexels.com/photos/3435272/pexels-photo-3435272.jpeg",
    features: ["Rotating Exhibits", "Grand Piano", "Catering Partners", "Valet Parking"],
    rating: 4.7,
    reviewCount: 158
  }
];

export default function VenuesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Find Your Perfect Venue</h1>
        <p className="text-xl text-muted-foreground">
          Discover amazing spaces for any celebration
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search venues..."
                className="pl-9"
              />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="london">London</SelectItem>
                <SelectItem value="manchester">Manchester</SelectItem>
                <SelectItem value="birmingham">Birmingham</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Capacity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Up to 50 guests</SelectItem>
                <SelectItem value="medium">51-150 guests</SelectItem>
                <SelectItem value="large">151+ guests</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
              Search Venues
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Venues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_VENUES.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>
    </div>
  );
}