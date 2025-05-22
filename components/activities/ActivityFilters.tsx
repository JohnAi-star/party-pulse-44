import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { CATEGORIES, CITIES, REGIONS, GROUP_SIZES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DatePicker } from '../ui/date-picker';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface ActivityFiltersProps {
  filters: {
    searchQuery: string | number | readonly string[] | undefined;
    category: string;
    subcategory: string;
    location: string;
    region: string;
    priceRange: number[];
    groupSize: string;
    date: Date | null;
    sortBy: string;
    amenities: string[];
    duration: string;
    rating: number;
    availability: string[];
  };
  updateFilters: (newFilters: any) => void;
}

export default function ActivityFilters({ filters, updateFilters }: ActivityFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleUpdate = (filterName: string, value: any) => {
    const newFilters = { ...localFilters, [filterName]: value };
    setLocalFilters(newFilters);
    updateFilters(newFilters);
  };

  const resetFilters = () => {
    const resetValues = {
      searchQuery: '',
      category: '',
      subcategory: '',
      location: '',
      region: '',
      priceRange: [0, 1000],
      groupSize: '',
      date: null,
      sortBy: 'recommended',
      amenities: [],
      duration: '',
      rating: 0,
      availability: []
    };
    setLocalFilters(resetValues);
    updateFilters(resetValues);
  };

  const amenitiesList = [
    'Parking',
    'Wheelchair Accessible',
    'Food Included',
    'Drinks Included',
    'Equipment Provided',
    'Indoor Activity',
    'Outdoor Activity'
  ];

  const durationOptions = [
    '1-2 hours',
    '2-4 hours',
    'Half Day',
    'Full Day'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Input
          placeholder="Search activities..."
          className="flex-1"
          value={localFilters.searchQuery}
          onChange={(e) => handleUpdate('searchQuery', e.target.value)}
        />
        <Button variant="outline" onClick={resetFilters}>
          Reset
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={['category', 'location', 'price', 'amenities', 'duration']} className="space-y-4">
        {/* Existing Category Filter */}
        <AccordionItem value="category" className="border rounded-lg">
          <AccordionTrigger className="px-4">Categories</AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2">
                {CATEGORIES.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`category-${category.id}`} 
                      checked={localFilters.category === category.id}
                      onCheckedChange={(checked) => {
                        handleUpdate('category', checked ? category.id : '');
                      }}
                    />
                    <Label htmlFor={`category-${category.id}`}>{category.title}</Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>

        {/* New Amenities Filter */}
        <AccordionItem value="amenities" className="border rounded-lg">
          <AccordionTrigger className="px-4">Amenities</AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-2">
              {amenitiesList.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`amenity-${amenity}`}
                    checked={localFilters.amenities?.includes(amenity)}
                    onCheckedChange={(checked) => {
                      const newAmenities = checked 
                        ? [...(localFilters.amenities || []), amenity]
                        : localFilters.amenities?.filter(a => a !== amenity);
                      handleUpdate('amenities', newAmenities);
                    }}
                  />
                  <Label htmlFor={`amenity-${amenity}`}>{amenity}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* New Duration Filter */}
        <AccordionItem value="duration" className="border rounded-lg">
          <AccordionTrigger className="px-4">Duration</AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <RadioGroup 
              value={localFilters.duration}
              onValueChange={(value) => handleUpdate('duration', value)}
            >
              {durationOptions.map((duration) => (
                <div key={duration} className="flex items-center space-x-2">
                  <RadioGroupItem value={duration} id={`duration-${duration}`} />
                  <Label htmlFor={`duration-${duration}`}>{duration}</Label>
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        {/* Existing and Enhanced Filters */}
        <AccordionItem value="price" className="border rounded-lg">
          <AccordionTrigger className="px-4">Price Range</AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4">
              <Slider
                defaultValue={[0, 1000]}
                max={1000}
                step={50}
                value={localFilters.priceRange}
                onValueChange={(value) => handleUpdate('priceRange', value)}
              />
              <div className="flex justify-between text-sm">
                <span>£{localFilters.priceRange[0]}</span>
                <span>£{localFilters.priceRange[1]}+</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="rating" className="border rounded-lg">
          <AccordionTrigger className="px-4">Rating</AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <RadioGroup 
              value={localFilters.rating.toString()}
              onValueChange={(value) => handleUpdate('rating', parseInt(value))}
            >
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                  <Label htmlFor={`rating-${rating}`}>{rating}+ Stars</Label>
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="availability" className="border rounded-lg">
          <AccordionTrigger className="px-4">Availability</AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-2">
              {['Weekdays', 'Weekends', 'Evenings', 'Mornings'].map((time) => (
                <div key={time} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`time-${time}`}
                    checked={localFilters.availability?.includes(time)}
                    onCheckedChange={(checked) => {
                      const newAvailability = checked 
                        ? [...(localFilters.availability || []), time]
                        : localFilters.availability?.filter(t => t !== time);
                      handleUpdate('availability', newAvailability);
                    }}
                  />
                  <Label htmlFor={`time-${time}`}>{time}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button 
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
        onClick={() => updateFilters(localFilters)}
      >
        Apply Filters
      </Button>
    </div>
  );
}