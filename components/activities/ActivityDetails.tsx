import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, Users, Clock, Star, Heart, Info } from 'lucide-react';
import ReviewList from '@/components/reviews/ReviewList';
import ReviewForm from '@/components/reviews/ReviewForm';
import { DatePicker } from '@/components/ui/date-picker';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
}

interface ActivityDetailsProps {
  activity: {
    id: string;
    title: string;
    description: string;
    city: string;
    location: {
      address: string;
      coordinates: {
        lat: number;
        lng: number;
      };
    };
    priceFrom: number;
    images: string[];
    category: string;
    subcategory?: string;
    rating: number;
    reviewCount: number;
    duration: string;
    groupSize: string;
    features: string[];
    packages: Package[];
    availability: string[];
    isFavorite?: boolean;
  };
  onFavoriteToggle: () => void;
  onBookNow: (packageId: string, date: Date, groupSize: number) => void;
}

export default function ActivityDetails({
  activity,
  onFavoriteToggle,
  onBookNow,
}: ActivityDetailsProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string>(activity.packages[0]?.id);
  const [groupSize, setGroupSize] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleBookNow = () => {
    if (!selectedDate || !selectedPackage) return;
    onBookNow(selectedPackage, selectedDate, groupSize);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        {/* Image Gallery */}
        <div className="relative aspect-video rounded-lg overflow-hidden">
          <Image
            src={activity.images[currentImageIndex]}
            alt={activity.title}
            fill
            className="object-cover"
          />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {activity.images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Activity Info */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex gap-2 mb-2">
                <Badge>{activity.category}</Badge>
                {activity.subcategory && <Badge variant="outline">{activity.subcategory}</Badge>}
              </div>
              <h1 className="text-3xl font-bold mb-2">{activity.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {activity.city}
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  {activity.rating} ({activity.reviewCount} reviews)
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {activity.duration}
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {activity.groupSize}
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={onFavoriteToggle}
              className={activity.isFavorite ? 'text-red-500' : ''}
            >
              <Heart className={`h-5 w-5 ${activity.isFavorite ? 'fill-current' : ''}`} />
            </Button>
          </div>

          <Tabs defaultValue="description">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <div className="prose max-w-none">
                <p className="text-muted-foreground">{activity.description}</p>

                <h3 className="text-lg font-semibold mt-6 mb-4">Features</h3>
                <ul className="grid grid-cols-2 gap-2">
                  {activity.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Info className="h-4 w-4 mr-2 text-purple-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="details" className="mt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">What's Included</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    {activity.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Important Information</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>Arrive 15 minutes before start time</li>
                    <li>Comfortable clothing recommended</li>
                    <li>No experience necessary</li>
                    <li>Minimum age: 18 years</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="location" className="mt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Address</h3>
                  <p className="text-muted-foreground">{activity.location.address}</p>
                </div>

                <div className="aspect-video relative rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${activity.location.coordinates.lat},${activity.location.coordinates.lng}`}
                  ></iframe>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <ReviewList />
              <div className="mt-8">
                <ReviewForm activityId={activity.id} onSuccess={() => { }} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Booking Card */}
      <div className="lg:col-span-1">
        <Card className="sticky top-4">
          <CardContent className="p-6">
            <div className="mb-6">
              <p className="text-2xl font-bold">From £{activity.priceFrom}pp</p>
              <p className="text-sm text-muted-foreground">
                Price varies based on group size and package
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Select Date
                </label>
                <DatePicker
                  date={selectedDate}
                  onChange={setSelectedDate}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Select Package
                </label>
                <ScrollArea className="h-48">
                  <div className="space-y-2">
                    {activity.packages.map((pkg) => (
                      <Card
                        key={pkg.id}
                        className={`cursor-pointer transition-colors ${selectedPackage === pkg.id
                          ? 'border-purple-600'
                          : 'hover:border-purple-600/50'
                          }`}
                        onClick={() => setSelectedPackage(pkg.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">{pkg.name}</h4>
                            <p className="font-medium">£{pkg.price}pp</p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {pkg.description}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Group Size
                </label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setGroupSize(Math.max(1, groupSize - 1))}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center">{groupSize}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setGroupSize(groupSize + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                size="lg"
                onClick={handleBookNow}
                disabled={!selectedDate || !selectedPackage}
              >
                Book Now
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Free cancellation up to 48 hours before the activity
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}