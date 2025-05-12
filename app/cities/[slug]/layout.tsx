"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CITIES } from '@/lib/constants';
import { MapPin } from 'lucide-react';

export default function CityLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const [activeCity, setActiveCity] = useState(params.slug);

  return (
    <div>
      <div className="bg-slate-50 border-b">
        <div className="container mx-auto px-4 py-4 overflow-x-auto">
          <div className="flex space-x-2">
            {CITIES.map((city) => (
              <Link key={city.id} href={`/cities/${city.id}`}>
                <Button
                  variant={activeCity === city.id ? "default" : "outline"}
                  className="whitespace-nowrap"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  {city.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}