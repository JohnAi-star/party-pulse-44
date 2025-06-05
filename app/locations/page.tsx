import Image from 'next/image';
import Link from 'next/link';
import { CITIES } from '@/lib/constants';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

export default function LocationsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Explore Activities by City</h1>
        <p className="text-xl text-muted-foreground">
          Discover amazing group experiences in cities across the UK
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {CITIES.map((city) => (
          <Link key={city.id} href={`/activities?location=${city.id}`}>
            <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="relative h-64">
                <Image
                  src={city.image}
                  alt={city.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  loading='lazy'
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h2 className="text-2xl font-bold mb-2">{city.name}</h2>
                  <p className="text-white/90 mb-3">{city.description}</p>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{city.activities} activities available</span>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}