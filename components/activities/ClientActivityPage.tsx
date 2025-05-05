"use client";

import Image from 'next/image';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Star,
  ChevronLeft,
  ChevronRight,
  Check
} from 'lucide-react';
import BookingForm from '@/components/activities/BookingForm';
import RelatedActivities from '@/components/activities/RelatedActivities';
import { Badge } from '@/components/ui/badge';

interface Activity {
  id: string;
  title: string;
  description: string;
  city: string;
  region: string;
  priceFrom: number;
  image: string;
  category: string;
  subcategory: string;
  rating: number;
  duration: string;
  groupSize: string;
  features: string[];
  availability: string[];
  location: {
    address: string;
    postcode: string;
    coordinates: { lat: number; lng: number };
  };
}

interface ClientActivityPageProps {
  activity: Activity;
  images: string[];
}

export default function ClientActivityPage({ activity, images }: ClientActivityPageProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="mb-4 text-sm">
        <span className="text-muted-foreground">Activities</span>
        <span className="mx-2 text-muted-foreground">/</span>
        <span className="text-muted-foreground">{activity.category}</span>
        <span className="mx-2 text-muted-foreground">/</span>
        <span>{activity.title}</span>
      </div>

      <div className="lg:grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Image Slider */}
          <div className="relative mb-6 rounded-lg overflow-hidden h-[400px]">
            <Image 
              src={images[currentImageIndex]} 
              alt={activity.title}
              className="object-cover"
              fill
              priority
            />
            {images.length > 1 && (
              <>
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80"
                  onClick={prevImage}
                >
                  <ChevronLeft />
                </Button>
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80"
                  onClick={nextImage}
                >
                  <ChevronRight />
                </Button>
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                  {images.map((_, index) => (
                    <div 
                      key={index} 
                      className={`h-2 w-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Activity Info */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="secondary">{activity.category}</Badge>
            <Badge variant="outline">{activity.subcategory}</Badge>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">{activity.title}</h1>
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
              <span className="text-muted-foreground">{activity.city}, {activity.region}</span>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span>{activity.rating} (42 reviews)</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 text-muted-foreground mr-1" />
              <span className="text-muted-foreground">{activity.groupSize}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-muted-foreground mr-1" />
              <span className="text-muted-foreground">{activity.duration}</span>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="description" className="mb-8">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-4">
              <p className="mb-6">{activity.description}</p>
              
              <h3 className="text-lg font-semibold mb-4">Key Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {activity.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <h3 className="text-lg font-semibold mb-4">Activity Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-sm text-muted-foreground">{activity.duration}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Group Size</p>
                    <p className="text-sm text-muted-foreground">{activity.groupSize} people</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Available</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.availability.slice(0, 3).join(', ')}
                      {activity.availability.length > 3 && '...'}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="mt-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">What's Included</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    {activity.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Important Information</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Arrive 15 minutes before start time</li>
                    <li>Comfortable clothing recommended</li>
                    <li>No experience necessary</li>
                    <li>Minimum age: 18 years</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Cancellation Policy</h3>
                  <p className="text-muted-foreground">
                    Free cancellation up to 48 hours before the activity. 
                    Cancellations made within 48 hours of the activity are non-refundable.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="location" className="mt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Address</h3>
                  <p className="text-muted-foreground">{activity.location.address}</p>
                  <p className="text-muted-foreground">{activity.city}</p>
                  <p className="text-muted-foreground">{activity.location.postcode}</p>
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

                <div>
                  <h3 className="text-lg font-semibold mb-3">Getting There</h3>
                  <div className="space-y-2 text-muted-foreground">
                    <p>Nearest public transport:</p>
                    <ul className="list-disc list-inside">
                      <li>Bus: Routes 12, 24, 88 (2 min walk)</li>
                      <li>Train: Central Station (10 min walk)</li>
                      <li>Parking available on site</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-4">
              <div className="text-center py-8">
                <p className="text-muted-foreground">Reviews coming soon!</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Booking sidebar */}
        <div>
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <div className="mb-4">
                <p className="text-2xl font-bold">From £{activity.priceFrom}</p>
                <p className="text-sm text-muted-foreground">Price varies based on group size and date</p>
              </div>
              <BookingForm activity={activity} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related Activities */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <RelatedActivities 
          currentActivityId={activity.id} 
          category={activity.category}
          city={activity.city}
        />
      </div>
    </div>
  );
}