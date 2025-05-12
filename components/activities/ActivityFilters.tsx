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

interface ActivityFiltersProps {
  filters: {
    category: string;
    subcategory: string;
    location: string;
    region: string;
    priceRange: number[];
    groupSize: string;
    date: Date | null;
    sortBy: string;
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
      category: '',
      subcategory: '',
      location: '',
      region: '',
      priceRange: [0, 1000],
      groupSize: '',
      date: null,
      sortBy: 'recommended'
    };
    setLocalFilters(resetValues);
    updateFilters(resetValues);
  };

  const selectedCategory = CATEGORIES.find(cat => cat.id === localFilters.category);
  const subcategories = selectedCategory?.subcategories || [];

  return (
    <div className="space-y-6">
      <Accordion type="multiple" defaultValue={['category', 'location', 'price', 'date', 'group-size', 'sort']} className="space-y-4">
        {/* Date Filter */}
        <AccordionItem value="date" className="border rounded-lg">
          <AccordionTrigger className="px-4">Date</AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <DatePicker
              date={localFilters.date}
              onChange={(date: any) => handleUpdate('date', date)}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Category Filter */}
        <AccordionItem value="category" className="border rounded-lg">
          <AccordionTrigger className="px-4">Categories</AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  {CATEGORIES.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`category-${category.id}`} 
                        checked={localFilters.category === category.id}
                        onCheckedChange={(checked) => {
                          handleUpdate('category', checked ? category.id : '');
                          handleUpdate('subcategory', '');
                        }}
                      />
                      <Label htmlFor={`category-${category.id}`}>{category.title}</Label>
                    </div>
                  ))}
                </div>

                {subcategories.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Subcategories</h4>
                    <div className="flex flex-wrap gap-2">
                      {subcategories.map((subcategory) => (
                        <Badge
                          key={subcategory}
                          variant={localFilters.subcategory === subcategory ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => handleUpdate('subcategory', 
                            localFilters.subcategory === subcategory ? '' : subcategory
                          )}
                        >
                          {subcategory}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>

        {/* Location Filter */}
        <AccordionItem value="location" className="border rounded-lg">
          <AccordionTrigger className="px-4">Location</AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Regions</h4>
                  <div className="space-y-2">
                    {REGIONS.map((region) => (
                      <div key={region.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`region-${region.id}`} 
                          checked={localFilters.region === region.id}
                          onCheckedChange={(checked) => {
                            handleUpdate('region', checked ? region.id : '');
                            handleUpdate('location', '');
                          }}
                        />
                        <Label htmlFor={`region-${region.id}`}>
                          {region.name} ({region.activities} activities)
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Cities</h4>
                  <div className="space-y-2">
                    {CITIES
                      .filter(city => !localFilters.region || 
                        REGIONS.find(r => r.id === localFilters.region)?.cities.includes(city.name))
                      .map((city) => (
                        <div key={city.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`city-${city.id}`} 
                            checked={localFilters.location === city.id}
                            onCheckedChange={(checked) => {
                              handleUpdate('location', checked ? city.id : '');
                            }}
                          />
                          <Label htmlFor={`city-${city.id}`}>
                            {city.name} ({city.activities} activities)
                          </Label>
                        </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range Filter */}
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

        {/* Group Size Filter */}
        <AccordionItem value="group-size" className="border rounded-lg">
          <AccordionTrigger className="px-4">Group Size</AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <RadioGroup 
              value={localFilters.groupSize}
              onValueChange={(value) => handleUpdate('groupSize', value)}
            >
              {GROUP_SIZES.map((size) => (
                <div key={size.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={size.id} id={`group-${size.id}`} />
                  <Label htmlFor={`group-${size.id}`}>{size.name} ({size.range})</Label>
                </div>
              ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        {/* Sort By */}
        <AccordionItem value="sort" className="border rounded-lg">
          <AccordionTrigger className="px-4">Sort By</AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <RadioGroup 
              value={localFilters.sortBy}
              onValueChange={(value) => handleUpdate('sortBy', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="recommended" id="sort-recommended" />
                <Label htmlFor="sort-recommended">Recommended</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="price-low" id="sort-price-low" />
                <Label htmlFor="sort-price-low">Price: Low to High</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="price-high" id="sort-price-high" />
                <Label htmlFor="sort-price-high">Price: High to Low</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rating" id="sort-rating" />
                <Label htmlFor="sort-rating">Highest Rated</Label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Filter Actions */}
      <div className="space-y-2">
        <Button 
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          onClick={() => updateFilters(localFilters)}
        >
          Apply Filters
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={resetFilters}
        >
          Reset All
        </Button>
      </div>
    </div>
  );
}