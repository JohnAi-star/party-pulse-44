import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { CATEGORIES, CITIES, REGIONS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ActivityFiltersProps {
  filters: {
    category: string;
    subcategory: string;
    location: string;
    region: string;
    priceRange: number[];
    groupSize: string;
  };
  updateFilters: (newFilters: any) => void;
}

export default function ActivityFilters({ filters, updateFilters }: ActivityFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleUpdate = (filterName: string, value: any) => {
    setLocalFilters({ ...localFilters, [filterName]: value });
  };

  const applyFilters = () => {
    updateFilters(localFilters);
  };

  const resetFilters = () => {
    const resetValues = {
      category: '',
      subcategory: '',
      location: '',
      region: '',
      priceRange: [0, 100],
      groupSize: '',
    };
    setLocalFilters(resetValues);
    updateFilters(resetValues);
  };

  // Get subcategories for selected category
  const selectedCategory = CATEGORIES.find(cat => cat.id === localFilters.category);
  const subcategories = selectedCategory?.subcategories || [];

  return (
    <div className="space-y-6">
      <Accordion type="multiple" defaultValue={['category', 'location', 'price', 'group-size']}>
        {/* Category Filter */}
        <AccordionItem value="category">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="space-y-2">
                {CATEGORIES.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`category-${category.id}`} 
                      checked={localFilters.category === category.id}
                      onCheckedChange={(checked) => {
                        handleUpdate('category', checked ? category.id : '');
                        handleUpdate('subcategory', ''); // Reset subcategory when category changes
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
          </AccordionContent>
        </AccordionItem>

        {/* Location Filter */}
        <AccordionItem value="location">
          <AccordionTrigger>Location</AccordionTrigger>
          <AccordionContent>
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
                          handleUpdate('location', ''); // Reset city when region changes
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
          </AccordionContent>
        </AccordionItem>

        {/* Price Range Filter */}
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 px-1">
              <Slider
                defaultValue={[0, 100]}
                max={100}
                step={5}
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
        <AccordionItem value="group-size">
          <AccordionTrigger>Group Size</AccordionTrigger>
          <AccordionContent>
            <RadioGroup 
              value={localFilters.groupSize}
              onValueChange={(value) => handleUpdate('groupSize', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="small" id="group-small" />
                <Label htmlFor="group-small">Small (1-5 people)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="group-medium" />
                <Label htmlFor="group-medium">Medium (6-15 people)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="large" id="group-large" />
                <Label htmlFor="group-large">Large (16+ people)</Label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Filter Actions */}
      <div className="space-y-2">
        <Button 
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          onClick={applyFilters}
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