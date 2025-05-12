import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Star } from 'lucide-react';
import { CITIES, MOCK_ACTIVITIES } from '@/lib/constants';

interface CityGuideProps {
  params: {
    slug: string;
  };
}

export default function CityGuidePage({ params }: CityGuideProps) {
  const city = CITIES.find((city) => city.id === params.slug);
  
  if (!city) {
    return notFound();
  }

  const cityActivities = MOCK_ACTIVITIES.filter(
    (activity) => activity.city.toLowerCase() === city.name.toLowerCase()
  );

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="relative h-[400px] rounded-xl overflow-hidden mb-12">
        <Image
          src={city.image}
          alt={city.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 text-white">
          <h1 className="text-4xl font-bold mb-4">Guide to {city.name}</h1>
          <p className="text-xl max-w-2xl">{city.description}</p>
        </div>
      </div>

      {/* Quick Facts */}
      <Card className="mb-12">
        <CardContent className="grid md:grid-cols-3 gap-6 p-6">
          <div>
            <h3 className="font-semibold mb-2">Best Time to Visit</h3>
            <p className="text-muted-foreground">March to October</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Popular For</h3>
            <p className="text-muted-foreground">
              Hen Parties, Stag Dos, Team Building
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Average Group Size</h3>
            <p className="text-muted-foreground">8-12 people</p>
          </div>
        </CardContent>
      </Card>

      {/* Popular Activities */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Popular Activities in {city.name}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cityActivities.slice(0, 6).map((activity) => (
            <Link key={activity.id} href={`/activities/${activity.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={activity.image}
                    alt={activity.title}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{activity.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      {activity.rating}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {activity.groupSize}
                    </div>
                  </div>
                  <p className="font-medium">From £{activity.priceFrom}pp</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href={`/activities?location=${city.id}`}>
            <Button>View All Activities</Button>
          </Link>
        </div>
      </div>

      {/* Local Information */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Getting Around</h3>
            <div className="space-y-4 text-muted-foreground">
              <p>
                {city.name} has excellent public transport links, including buses and trains.
                Most activity venues are easily accessible from the city center.
              </p>
              <ul className="list-disc list-inside">
                <li>Main train station: {city.name} Central</li>
                <li>Bus services run throughout the city</li>
                <li>Many venues within walking distance</li>
                <li>Taxis and ride-sharing services readily available</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Accommodation</h3>
            <div className="space-y-4 text-muted-foreground">
              <p>
                From luxury hotels to budget-friendly hostels, {city.name} offers
                accommodation options for every group size and budget.
              </p>
              <ul className="list-disc list-inside">
                <li>City center hotels</li>
                <li>Group-friendly apartments</li>
                <li>Boutique guesthouses</li>
                <li>Party hostels</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Section */}
      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-semibold mb-4">Need Help Planning?</h3>
          <p className="text-muted-foreground mb-6">
            Our local experts are here to help you plan the perfect group activity in {city.name}.
          </p>
          <Link href="/contact">
            <Button>Contact Us</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}