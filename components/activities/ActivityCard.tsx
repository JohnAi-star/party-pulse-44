import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Clock, Users, Heart } from 'lucide-react';

interface ActivityCardProps {
  activity: {
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
    reviewCount?: number;
    isFavorite?: boolean;
  };
  onFavoriteToggle?: (id: string) => void;
}

export default function ActivityCard({ activity, onFavoriteToggle }: ActivityCardProps) {
  return (
    <Link href={`/activities/${activity.id}`} className="group">
      <Card className="overflow-hidden h-full flex flex-col transition-transform group-hover:scale-[1.02] group-hover:shadow-lg">
        <div className="relative h-48">
          <Image
            src={activity.image}
            alt={activity.title}
            fill
            className="object-cover"
            loading='lazy'
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600">
              {activity.category}
            </Badge>
            {activity.subcategory && (
              <Badge variant="outline" className="bg-white/80">
                {activity.subcategory}
              </Badge>
            )}
          </div>
          {onFavoriteToggle && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 bg-white/80 hover:bg-white"
              onClick={(e) => {
                e.preventDefault();
                onFavoriteToggle(activity.id);
              }}
            >
              <Heart
                className={`h-5 w-5 ${
                  activity.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                }`}
              />
            </Button>
          )}
        </div>

        <CardContent className="py-5 flex-grow">
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-2">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{activity.city}</span>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span>{activity.rating}</span>
              {activity.reviewCount && (
                <span className="ml-1">({activity.reviewCount})</span>
              )}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{activity.duration}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>{activity.groupSize}</span>
            </div>
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