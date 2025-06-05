import Link from 'next/link';
import Image from 'next/image';
import { MOCK_ACTIVITIES } from '@/lib/constants';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin } from 'lucide-react';

export default function FeaturedActivities() {
  // Select first 6 activities for featured display
  const featuredActivities = MOCK_ACTIVITIES.slice(0, 6);
  
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-3xl font-bold mb-2">Featured Activities</h2>
          <p className="text-muted-foreground">Our most popular experiences, handpicked for you</p>
        </div>
        <Link href="/activities">
          <Button variant="outline">View All</Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredActivities.map((activity) => (
          <Link key={activity.id} href={`/activities/${activity.id}`} className="group">
            <Card className="overflow-hidden h-full flex flex-col transition-transform group-hover:scale-[1.02] group-hover:shadow-lg">
              <div className="relative h-48">
                <Image
                  src={activity.image}
                  alt={activity.title}
                  fill
                  className="object-cover"
                  loading='lazy'
                />
                <Badge className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-pink-600">
                  {activity.category}
                </Badge>
              </div>
              
              <CardContent className="py-5 flex-grow">
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{activity.city}</span>
                  <span className="mx-2">•</span>
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span>{activity.rating}</span>
                </div>
                
                <h3 className="font-bold text-xl mb-2 line-clamp-1">{activity.title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                  {activity.description}
                </p>
                <p className="font-semibold">From £{activity.priceFrom}</p>
              </CardContent>
              
              <CardFooter className="pt-0">
                <Button 
                  variant="ghost" 
                  className="w-full group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:text-white transition-colors"
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}