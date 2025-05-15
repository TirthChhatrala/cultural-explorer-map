
import React from 'react';
import { Search, Filter, Map } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface TripFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedState: string;
  setSelectedState: (state: string) => void;
  selectedDuration: string;
  setSelectedDuration: (duration: string) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  categories: string[];
  durations: string[];
  states: any[];
  theme: string;
}

const TripFilter: React.FC<TripFilterProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedState,
  setSelectedState,
  selectedDuration,
  setSelectedDuration,
  priceRange,
  setPriceRange,
  categories,
  durations,
  states,
  theme
}) => {
  return (
    <div className={`p-6 rounded-xl ${
      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } border shadow-sm`}>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              type="text"
              placeholder="Search trips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="w-full md:w-40">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`w-full p-2 rounded-md border ${
                theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              }`}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
          
          <div className="w-full md:w-40">
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className={`w-full p-2 rounded-md border ${
                theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              }`}
            >
              {durations.map((duration) => (
                <option key={duration} value={duration}>
                  {duration === 'all' ? 'All Durations' : duration}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Price Range</label>
          <div className="px-2">
            <Slider
              defaultValue={[0, 100000]}
              max={100000}
              step={1000}
              value={priceRange}
              onValueChange={setPriceRange}
              className="my-4"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>₹{priceRange[0].toLocaleString()}</span>
              <span>₹{priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block flex items-center">
            <Map size={16} className="mr-1" />
            Select State
          </label>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className={`w-full p-2 rounded-md border ${
              theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
            }`}
          >
            <option value="all">All States</option>
            {states.map((state) => (
              <option key={state.id} value={state.id}>
                {state.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedState('all');
              setSelectedDuration('all');
              setPriceRange([0, 100000]);
            }}
            className="w-full md:w-auto"
          >
            <Filter size={16} className="mr-1" />
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TripFilter;
