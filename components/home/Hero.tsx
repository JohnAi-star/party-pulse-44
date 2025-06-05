"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (searchQuery.trim()) {
      params.append('search', searchQuery.trim());
    }

    router.push(`/activities?${params.toString()}`);
  };

  return (
    <div className="relative">
      <div className="relative h-[600px] w-full">
        <Image
          src="https://images.pexels.com/photos/7551617/pexels-photo-7551617.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Group of friends celebrating"
          fill
          priority
          className="object-cover brightness-[0.65]"
          loading='lazy'
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-4xl">
            Find Unforgettable Group Experiences
          </h1>
          <p className="text-xl text-white mb-8 max-w-2xl">
            Discover and book amazing activities for hen parties, stag dos, team building, birthdays and more
          </p>

          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-4 w-full max-w-3xl bg-white p-4 rounded-lg shadow-xl"
          >
            <Input
              placeholder="Search activities across the UK..."
              className="flex-grow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}