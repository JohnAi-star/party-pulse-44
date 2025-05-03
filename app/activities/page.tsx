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

  // Check title match (highest weight)
  searchTerms.forEach(term => {
    if (activity.title.toLowerCase().includes(term)) score += 3;
  });

  // Check description match
  searchTerms.forEach(term => {
    if (activity.description.toLowerCase().includes(term)) score += 2;
  });

  // Check category match
  searchTerms.forEach(term => {
    if (activity.category.toLowerCase().includes(term)) score += 2;
  });

  // Check city match
  searchTerms.forEach(term => {
    if (activity.city.toLowerCase().includes(term)) score += 1;
  });

  return score;
}

export default function ActivitiesPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  const [activities, setActivities] = useState(MOCK_ACTIVITIES);
  const [filters, setFilters] = useState({
    category: '',
    subcategory: '',
    location: '',
    region: '',
    priceRange: [0, 100],
    groupSize: '',
  });

  useEffect(() => {
    let filteredActivities = [...MOCK_ACTIVITIES];

    if (searchQuery) {
      // Calculate relevance scores for each activity
      const activitiesWithScores = filteredActivities.map(activity => ({
        ...activity,
        relevanceScore: calculateRelevanceScore(activity, searchQuery)
      }));

      // Filter out irrelevant results (score = 0) and sort by relevance
      filteredActivities = activitiesWithScores
        .filter(activity => activity.relevanceScore > 0)
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .map(({ relevanceScore, ...activity }) => activity);
    }

    // Apply additional filters
    if (filters.category) {
      filteredActivities = filteredActivities.filter(activity =>
        activity.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.location) {
      filteredActivities = filteredActivities.filter(activity =>
        activity.city.toLowerCase() === filters.location.toLowerCase()
      );
    }

    if (filters.groupSize) {
      filteredActivities = filteredActivities.filter(activity =>
        activity.groupSize.toLowerCase().includes(filters.groupSize.toLowerCase())
      );
    }

    filteredActivities = filteredActivities.filter(activity =>
      activity.priceFrom >= filters.priceRange[0] &&
      activity.priceFrom <= filters.priceRange[1]
    );

    setActivities(filteredActivities);
  }, [searchQuery, filters]);

  const updateFilters = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Activities</h1>
      {searchQuery ? (
        <p className="text-muted-foreground mb-8">
          {activities.length === 0
            ? `No activities found for "${searchQuery}"`
            : `Showing results for "${searchQuery}"`}
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
                <ActivityFilters filters={filters} updateFilters={updateFilters} />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden lg:block">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <ActivityFilters filters={filters} updateFilters={updateFilters} />
        </div>

        <div className="lg:col-span-3">
          <ActivityGrid activities={activities} />
        </div>
      </div>
    </div>
  );
}