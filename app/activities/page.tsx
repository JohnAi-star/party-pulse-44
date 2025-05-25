"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ActivityFilters from '@/components/activities/ActivityFilters';
import ActivityGrid from '@/components/activities/ActivityGrid';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Filter } from 'lucide-react';
import { MOCK_ACTIVITIES } from '@/lib/constants';

function calculateRelevanceScore(activity: any, searchQuery: string): number {
  const searchTerms = searchQuery.toLowerCase().split(' ');
  let score = 0;

  searchTerms.forEach(term => {
    if (activity.title.toLowerCase().includes(term)) score += 3;
    if (activity.description.toLowerCase().includes(term)) score += 2;
    if (activity.category.toLowerCase().includes(term)) score += 2;
    if (activity.city.toLowerCase().includes(term)) score += 1;
  });

  return score;
}

interface Filters {
  searchQuery: string;
  category: string | null;
  subcategory: string | null;
  location: string | null;
  region: string | null;
  priceRange: [number, number];
  groupSize: string | null;
  date: Date | null;
  sortBy: string;
  amenities: string[];
  duration: string | null;
  rating: number;
  availability: string[];
}

export default function ActivitiesPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  const [activities, setActivities] = useState(MOCK_ACTIVITIES);
  const [filters, setFilters] = useState<Filters>({
    searchQuery: searchQuery,
    category: null,
    subcategory: null,
    location: null,
    region: null,
    priceRange: [0, 100],
    groupSize: null,
    date: null,
    sortBy: '',
    amenities: [],
    duration: null,
    rating: 0,
    availability: [],
  });

  const normalizeString = (str: string) => {
    return str.toLowerCase().replace(/\s+/g, '-');
  };

  const matchesGroupSize = (activitySize: string, filterSize: string) => {
    if (!activitySize) return false;

    const activityLower = activitySize.toLowerCase();
    const filterLower = filterSize.toLowerCase();

    if (filterLower === 'solo') {
      return /1|solo|individual/.test(activityLower);
    }
    if (filterLower === 'small') {
      return /2-4|small|few/.test(activityLower);
    }
    if (filterLower === 'medium') {
      return /5-10|medium|several/.test(activityLower);
    }
    if (filterLower === 'large') {
      return /10\+|large|many|group/.test(activityLower);
    }
    return false;
  };

  const matchesDuration = (activityDuration: string, filterDuration: string) => {
    if (!activityDuration) return false;

    const activityLower = activityDuration.toLowerCase();
    const filterLower = filterDuration.toLowerCase();

    if (filterLower === '1h') {
      return /1(\s)?h|1(\s)?hour|60(\s)?min/.test(activityLower);
    }
    if (filterLower === '1:30h') {
      return /1:30(\s)?h|1\.5(\s)?h|1(\s)?h(\s)?30|90(\s)?min|1(\s)?hour(\s)?30/.test(activityLower);
    }
    if (filterLower === '2h') {
      return /2(\s)?h|2(\s)?hour|120(\s)?min/.test(activityLower);
    }
    if (filterLower === '2:30h') {
      return /2:30(\s)?h|2\.5(\s)?h|2(\s)?h(\s)?30|150(\s)?min|2(\s)?hour(\s)?30/.test(activityLower);
    }
    if (filterLower === '3h') {
      return /3(\s)?h|3(\s)?hour|180(\s)?min/.test(activityLower);
    }
    if (filterLower === 'half-day') {
      return /half(\s)?day|morning|afternoon|3-4(\s)?h|3-4(\s)?hour/.test(activityLower);
    }
  };

  useEffect(() => {
    let filteredActivities = [...MOCK_ACTIVITIES];

    if (searchQuery) {
      const activitiesWithScores = filteredActivities.map(activity => ({
        ...activity,
        relevanceScore: calculateRelevanceScore(activity, searchQuery)
      }));

      filteredActivities = activitiesWithScores
        .filter(activity => activity.relevanceScore > 0)
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .map(({ relevanceScore, ...activity }) => activity);
    }

    if (filters.category && filters.category !== "all") {
      filteredActivities = filteredActivities.filter(activity => {
        if (!activity.category) return false;
        return normalizeString(activity.category) === filters.category;
      });
    }

    if (filters.subcategory && filters.subcategory !== "all") {
      filteredActivities = filteredActivities.filter(activity =>
        activity.subcategory &&
        normalizeString(activity.subcategory) === filters.subcategory
      );
    }

    if (filters.location && filters.location !== "all") {
      filteredActivities = filteredActivities.filter(activity =>
        activity.city &&
        normalizeString(activity.city) === filters.location
      );
    }

    if (filters.region && filters.region !== "all") {
      filteredActivities = filteredActivities.filter(activity =>
        activity.region &&
        normalizeString(activity.region) === filters.region
      );
    }

    filteredActivities = filteredActivities.filter(activity =>
      activity.priceFrom >= filters.priceRange[0] &&
      activity.priceFrom <= filters.priceRange[1]
    );

    if (filters.groupSize && filters.groupSize !== "all") {
      filteredActivities = filteredActivities.filter(activity =>
        activity.groupSize &&
        matchesGroupSize(activity.groupSize, filters.groupSize!)
      );
    }

    if (filters.rating > 0) {
      filteredActivities = filteredActivities.filter(activity =>
        activity.rating >= filters.rating
      );
    }

    if (filters.duration && filters.duration !== "all") {
      filteredActivities = filteredActivities.filter(activity =>
        activity.duration &&
        matchesDuration(activity.duration, filters.duration!)
      );
    }

    setActivities(filteredActivities);
  }, [searchQuery, filters]);

  const updateFilters = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Activities</h1>
      {searchQuery ? (
        <p className="text-muted-foreground mb-8">
          {activities.length === 0
            ? `No activities found for "${searchQuery}"`
            : `Showing ${activities.length} results for "${searchQuery}"`}
        </p>
      ) : (
        <p className="text-muted-foreground mb-8">Find and book the perfect activity for your group</p>
      )}

      <div className="lg:grid lg:grid-cols-4 gap-8">
        <div className="lg:hidden mb-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="py-4">
                <h2 className="text-lg font-semibold mb-4">Filters</h2>
                <ActivityFilters
                  filters={filters}
                  updateFiltersAction={updateFilters}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden lg:block">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <ActivityFilters
            filters={filters}
            updateFiltersAction={updateFilters}
          />
        </div>

        <div className="lg:col-span-3">
          {activities.length > 0 ? (
            <ActivityGrid activities={activities.map(activity => ({
              ...activity,
              id: activity.id.toString()
            }))} />
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-lg text-muted-foreground">
                No activities found. Try adjusting your filters.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => updateFilters({
                  category: null,
                  subcategory: null,
                  location: null,
                  region: null,
                  groupSize: null,
                  duration: null,
                  rating: 0
                })}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}