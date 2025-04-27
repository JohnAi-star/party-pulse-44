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
  ChevronRight
} from 'lucide-react';
import BookingForm from '@/components/activities/BookingForm';
import RelatedActivities from '@/components/activities/RelatedActivities';

interface Activity {
  id: string;
  title: string;
  description: string;
  city: string;
  priceFrom: number;
  image: string;
  category: string;
  rating: number;
  duration: string;
  groupSize: string;
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
          <h1 className="text-3xl font-bold mb-2">{activity.title}</h1>
          <div className="flex items-center mb-4">
            <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
            <span className="text-muted-foreground mr-4">{activity.city}</span>
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            <span className="mr-4">{activity.rating} (42 reviews)</span>
            <Users className="h-4 w-4 text-muted-foreground mr-1" />
            <span className="text-muted-foreground">{activity.groupSize}</span>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="description" className="mb-8">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4">
              <p className="mb-4">{activity.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
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
                  <MapPin className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{activity.city}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="details" className="mt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">What's Included</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Professional instructor</li>
                  <li>All necessary equipment</li>
                  <li>Welcome drink</li>
                  <li>Photos of your experience</li>
                  <li>Insurance coverage</li>
                </ul>
                
                <h3 className="text-lg font-semibold mt-6">Important Information</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Arrive 15 minutes before start time</li>
                  <li>Comfortable clothing recommended</li>
                  <li>No experience necessary</li>
                  <li>Minimum age: 18 years</li>
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-4">
              <p className="text-center py-8 text-muted-foreground">
                Reviews will be displayed here
              </p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Booking sidebar */}
        <div>
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <div className="mb-4">
                <p className="text-2xl font-bold">From £{activity.priceFrom}pp</p>
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
        <RelatedActivities currentActivityId={activity.id} category={activity.category} />
      </div>
    </div>
  );
}