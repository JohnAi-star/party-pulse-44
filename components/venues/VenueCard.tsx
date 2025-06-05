import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Star } from 'lucide-react';

interface VenueCardProps {
    venue: {
        id: string;
        name: string;
        description: string;
        location: string;
        capacity: string;
        priceFrom: number;
        image: string;
        features: string[];
        rating: number;
        reviewCount: number;
    };
}

export default function VenueCard({ venue }: VenueCardProps) {
    return (
        <Link href={`/venues/${venue.id}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
                <div className="relative h-48">
                    <Image
                        src={venue.image}
                        alt={venue.name}
                        fill
                        className="object-cover"
                        loading='lazy'
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                        <Badge className="bg-white/90 text-black">
                            From £{venue.priceFrom}
                        </Badge>
                    </div>
                </div>

                <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm">
                            {venue.rating} ({venue.reviewCount} reviews)
                        </span>
                    </div>

                    <h3 className="text-xl font-bold mb-2">{venue.name}</h3>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {venue.location}
                        </div>
                        <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {venue.capacity}
                        </div>
                    </div>

                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {venue.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {venue.features.slice(0, 3).map((feature) => (
                            <Badge key={feature} variant="outline">
                                {feature}
                            </Badge>
                        ))}
                    </div>
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