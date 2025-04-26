import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin } from 'lucide-react';

interface ActivityCardProps {
  activity: {
    id: string;
    title: string;
    description: string;
    city: string;
    priceFrom: number;
    image: string;
    category: string;
    rating: number;
  };
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <Link href={`/activities/${activity.id}`} className="group">
      <Card className="overflow-hidden h-full flex flex-col transition-transform group-hover:scale-[1.02] group-hover:shadow-lg">
        <div className="relative h-48">
          <Image
            src={activity.image}
            alt={activity.title}
            fill
            className="object-cover"
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
          <p className="font-semibold">From £{activity.priceFrom}pp</p>
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
  );
}