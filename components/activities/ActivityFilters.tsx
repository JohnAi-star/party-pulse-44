"use client";

import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CATEGORIES, CITIES, MOCK_ACTIVITIES } from "@/lib/constants";

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

interface ActivityFiltersProps {
  filters: Filters;
  updateFiltersAction: (newFilters: Partial<Filters>) => void;
}

const durationOptions = [
  { value: "1h", label: "1 hour" },
  { value: "1:30h", label: "1:30 hours" },
  { value: "2h", label: "2 hours" },
  { value: "2:30h", label: "2:30 hours" },
  { value: "3h", label: "3 hours" },
  { value: "half-day", label: "Half day" },
];

const groupSizeOptions = [
  { value: "solo", label: "Solo" },
  { value: "small", label: "Small Group (2-4)" },
  { value: "medium", label: "Medium Group (5-10)" },
  { value: "large", label: "Large Group (10+)" },
];

export default function ActivityFilters({
  filters,
  updateFiltersAction,
}: ActivityFiltersProps) {
  const getSubcategories = () => {
    if (!filters.category) return [];
    const category = CATEGORIES.find((cat) => cat.id === filters.category);
    return category?.subcategories || [];
  };

  const handleCategoryChange = (value: string) => {
    updateFiltersAction({
      category: value === "all" ? null : value,
      subcategory: null
    });
  };

  const handleSubcategoryChange = (value: string) => {
    updateFiltersAction({ 
      subcategory: value === "all" ? null : value.toLowerCase() 
    });
  };

  const handleLocationChange = (value: string) => {
    updateFiltersAction({ 
      location: value === "all" ? null : value.toLowerCase() 
    });
  };

  const handleGroupSizeChange = (value: string) => {
    updateFiltersAction({ 
      groupSize: value === "all" ? null : value
    });
  };

  const handleDurationChange = (value: string) => {
    updateFiltersAction({ 
      duration: value === "all" ? null : value
    });
  };

  const handlePriceChange = (value: number[]) => {
    updateFiltersAction({ 
      priceRange: [value[0], value[1]] as [number, number] 
    });
  };

  const handleRatingChange = (value: number) => {
    updateFiltersAction({ rating: value });
  };

  const priceRangeMin = Math.min(...MOCK_ACTIVITIES.map(a => a.priceFrom));
  const priceRangeMax = Math.max(...MOCK_ACTIVITIES.map(a => a.priceFrom));

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="category">Category</Label>
        <Select
          value={filters.category || "all"}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger id="category" className="mt-1">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((category) => (
              <SelectItem 
                key={category.id} 
                value={category.id}
              >
                {category.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filters.category && getSubcategories().length > 0 && (
        <div>
          <Label htmlFor="subcategory">Subcategory</Label>
          <Select
            value={filters.subcategory || "all"}
            onValueChange={handleSubcategoryChange}
          >
            <SelectTrigger id="subcategory" className="mt-1">
              <SelectValue placeholder="All Subcategories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subcategories</SelectItem>
              {getSubcategories().map((subcategory) => (
                <SelectItem 
                  key={subcategory} 
                  value={subcategory.toLowerCase().replace(/\s+/g, '-')}
                >
                  {subcategory}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label htmlFor="location">Location</Label>
        <Select
          value={filters.location || "all"}
          onValueChange={handleLocationChange}
        >
          <SelectTrigger id="location" className="mt-1">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {CITIES.map((city) => (
              <SelectItem 
                key={city.id} 
                value={city.id.toLowerCase()}
              >
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Price Range (£)</Label>
        <div className="px-2 mt-1">
          <Slider
            min={priceRangeMin}
            max={priceRangeMax}
            step={5}
            value={filters.priceRange}
            onValueChange={handlePriceChange}
            className="my-4"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>£{filters.priceRange[0]}</span>
            <span>£{filters.priceRange[1]}+</span>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="groupSize">Group Size</Label>
        <Select
          value={filters.groupSize || "all"}
          onValueChange={handleGroupSizeChange}
        >
          <SelectTrigger id="groupSize" className="mt-1">
            <SelectValue placeholder="Any Group Size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Group Size</SelectItem>
            {groupSizeOptions.map((size) => (
              <SelectItem 
                key={size.value} 
                value={size.value}
              >
                {size.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="duration">Duration</Label>
        <Select
          value={filters.duration || "all"}
          onValueChange={handleDurationChange}
        >
          <SelectTrigger id="duration" className="mt-1">
            <SelectValue placeholder="Any Duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Duration</SelectItem>
            {durationOptions.map((duration) => (
              <SelectItem 
                key={duration.value} 
                value={duration.value}
              >
                {duration.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Minimum Rating</Label>
        <div className="px-2 mt-1">
          <Slider
            min={0}
            max={5}
            step={0.5}
            value={[filters.rating]}
            onValueChange={(value) => handleRatingChange(value[0])}
            className="my-4"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{filters.rating > 0 ? `${filters.rating} stars` : "Any rating"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}