"use client";

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import ActivityFilters from '@/components/activities/ActivityFilters';
import ActivityGrid from '@/components/activities/ActivityGrid';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Filter } from 'lucide-react';
import { MOCK_ACTIVITIES } from '@/lib/constants';

interface Activity {
  id: string;
  title: string;
  description: string;
  priceFrom: number;
  city: string;
  category: string;
  subcategory?: string;
  region?: string;
  duration: string;
  groupSize: string;
  image: string;
  rating: number;
  amenities?: string[];
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

  const [allActivities, setAllActivities] = useState<Activity[]>([]);
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

  // Load activities once on component mount
  useEffect(() => {
    const loadActivities = () => {
      try {
        const savedActivities = localStorage.getItem('publicActivities');
        const initialActivities = savedActivities
          ? JSON.parse(savedActivities)
          : MOCK_ACTIVITIES.map(a => ({
              ...a,
              id: a.id.toString(),
              rating: a.rating || 0,
              subcategory: a.subcategory || '',
              region: a.region || '',
              amenities: 'amenities' in a ? (a as any).amenities : []
            }));
        setAllActivities(initialActivities);
      } catch (error) {
        console.error("Failed to load activities", error);
        setAllActivities(MOCK_ACTIVITIES);
      }
    };
    loadActivities();
  }, []);

  const normalizeString = (str: string) => {
    return str.toLowerCase().replace(/\s+/g, '-');
  };

  const matchesGroupSize = (activitySize: string, filterSize: string) => {
    if (!activitySize) return false;
    const activityLower = activitySize.toLowerCase();
    const filterLower = filterSize.toLowerCase();

    if (filterLower === 'solo') return /1|solo|individual/.test(activityLower);
    if (filterLower === 'small') return /2-4|small|few/.test(activityLower);
    if (filterLower === 'medium') return /5-10|medium|several/.test(activityLower);
    if (filterLower === 'large') return /10\+|large|many|group/.test(activityLower);
    return false;
  };

  const matchesDuration = (activityDuration: string, filterDuration: string) => {
    if (!activityDuration) return false;
    const activityLower = activityDuration.toLowerCase();
    const filterLower = filterDuration.toLowerCase();

    if (filterLower === '1h') return /1(\s)?h|1(\s)?hour|60(\s)?min/.test(activityLower);
    if (filterLower === '1:30h') return /1:30(\s)?h|1\.5(\s)?h|1(\s)?h(\s)?30|90(\s)?min|1(\s)?hour(\s)?30/.test(activityLower);
    if (filterLower === '2h') return /2(\s)?h|2(\s)?hour|120(\s)?min/.test(activityLower);
    if (filterLower === '2:30h') return /2:30(\s)?h|2\.5(\s)?h|2(\s)?h(\s)?30|150(\s)?min|2(\s)?hour(\s)?30/.test(activityLower);
    if (filterLower === '3h') return /3(\s)?h|3(\s)?hour|180(\s)?min/.test(activityLower);
    if (filterLower === 'half-day') return /half(\s)?day|morning|afternoon|3-4(\s)?h|3-4(\s)?hour/.test(activityLower);
    return false;
  };

  const calculateRelevanceScore = (activity: Activity, query: string) => {
    const searchTerms = query.toLowerCase().split(' ');
    let score = 0;

    searchTerms.forEach(term => {
      if (activity.title.toLowerCase().includes(term)) score += 3;
      if (activity.description.toLowerCase().includes(term)) score += 2;
      if (activity.category.toLowerCase().includes(term)) score += 2;
      if (activity.city.toLowerCase().includes(term)) score += 1;
    });

    return score;
  };

  // Use useMemo to compute filtered activities without causing re-renders
  const filteredActivities = useMemo(() => {
    let result = [...allActivities];

    if (searchQuery) {
      const activitiesWithScores = result.map(activity => ({
        ...activity,
        relevanceScore: calculateRelevanceScore(activity, searchQuery)
      }));

      result = activitiesWithScores
        .filter(activity => activity.relevanceScore > 0)
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .map(({ relevanceScore, ...activity }) => activity);
    }

    if (filters.category && filters.category !== "all") {
      result = result.filter(activity => {
        if (!activity.category) return false;
        return normalizeString(activity.category) === filters.category;
      });
    }

    if (filters.subcategory && filters.subcategory !== "all") {
      result = result.filter(activity =>
        activity.subcategory &&
        normalizeString(activity.subcategory) === filters.subcategory
      );
    }

    if (filters.location && filters.location !== "all") {
      result = result.filter(activity =>
        activity.city &&
        normalizeString(activity.city) === filters.location
      );
    }

    if (filters.region && filters.region !== "all") {
      result = result.filter(activity =>
        activity.region &&
        normalizeString(activity.region) === filters.region
      );
    }

    result = result.filter(activity =>
      activity.priceFrom >= filters.priceRange[0] &&
      activity.priceFrom <= filters.priceRange[1]
    );

    if (filters.groupSize && filters.groupSize !== "all") {
      result = result.filter(activity =>
        activity.groupSize &&
        matchesGroupSize(activity.groupSize, filters.groupSize!)
      );
    }

    if (filters.rating > 0) {
      result = result.filter(activity =>
        activity.rating >= filters.rating
      );
    }

    if (filters.duration && filters.duration !== "all") {
      result = result.filter(activity =>
        activity.duration &&
        matchesDuration(activity.duration, filters.duration!)
      );
    }

    if (filters.amenities.length > 0) {
      result = result.filter(activity =>
        activity.amenities &&
        filters.amenities.every(amenity => 
          activity.amenities!.includes(amenity)
        )
      );
    }

    return result;
  }, [allActivities, searchQuery, filters]);

  const updateFilters = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Activities</h1>
      {searchQuery ? (
        <p className="text-muted-foreground mb-8">
          {filteredActivities.length === 0
            ? `No activities found for "${searchQuery}"`
            : `Showing ${filteredActivities.length} results for "${searchQuery}"`}
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
          {filteredActivities.length > 0 ? (
            <ActivityGrid activities={filteredActivities.map(activity => ({
              ...activity,
              subcategory: activity.subcategory ?? '',
              region: activity.region ?? ''
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
                  rating: 0,
                  amenities: []
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