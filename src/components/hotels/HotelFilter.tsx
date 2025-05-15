
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Star, ListFilter, Hotel, MapPin, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { hotelAmenities } from '../../data/hotelData';

interface HotelType {
  id: string;
  label: string;
}

interface HotelFilterProps {
  hotelTypes: HotelType[];
  selectedType: string | null;
  setSelectedType: (type: string | null) => void;
  selectedAmenities: string[];
  setSelectedAmenities: (amenities: string[]) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  ratingFilter: number | null;
  setRatingFilter: (rating: number | null) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  theme: string;
}

const HotelFilter: React.FC<HotelFilterProps> = ({
  hotelTypes,
  selectedType,
  setSelectedType,
  selectedAmenities,
  setSelectedAmenities,
  priceRange,
  setPriceRange,
  ratingFilter,
  setRatingFilter,
  theme
}) => {
  const handleAmenityChange = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };
  
  const [showAllAmenities, setShowAllAmenities] = React.useState(false);
  const displayedAmenities = showAllAmenities ? hotelAmenities : hotelAmenities.slice(0, 6);
  
  const resetFilters = () => {
    setSelectedType(null);
    setSelectedAmenities([]);
    setPriceRange([0, 50000]);
    setRatingFilter(null);
  };

  return (
    <div className={`p-5 rounded-xl sticky top-24 ${
      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } border shadow-sm`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center">
          <ListFilter size={18} className="mr-2 text-india-orange" />
          Filters
        </h3>
        <Button 
          variant="link" 
          className="p-0 h-auto text-xs"
          onClick={resetFilters}
        >
          Reset All
        </Button>
      </div>
      
      <div className="space-y-6">
        <div>
          <h4 className="font-medium mb-3 flex items-center">
            <Hotel size={16} className="mr-2 text-india-orange" />
            Accommodation Type
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              className={`p-2 text-sm rounded-md transition-colors ${
                selectedType === null 
                  ? theme === 'dark' 
                    ? 'bg-india-orange/30 border-india-orange text-india-orange' 
                    : 'bg-india-orange/10 border-india-orange text-india-orange' 
                  : theme === 'dark'
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-gray-100 border-gray-300'
              } border`}
              onClick={() => setSelectedType(null)}
            >
              All Types
            </button>
            {hotelTypes.map((type) => (
              <button
                key={type.id}
                className={`p-2 text-sm rounded-md transition-colors ${
                  selectedType === type.id 
                    ? theme === 'dark' 
                      ? 'bg-india-orange/30 border-india-orange text-india-orange' 
                      : 'bg-india-orange/10 border-india-orange text-india-orange' 
                    : theme === 'dark'
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-gray-100 border-gray-300'
                } border`}
                onClick={() => setSelectedType(type.id)}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-3 flex items-center">
            <IndianRupee size={16} className="mr-2 text-india-orange" />
            Price Range (per night)
          </h4>
          <div className="px-2 mb-2">
            <Slider
              defaultValue={[0, 50000]}
              max={50000}
              step={1000}
              value={priceRange}
              onValueChange={(value) => setPriceRange(value as [number, number])}
              className="my-4"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>₹{priceRange[0].toLocaleString()}</span>
              <span>₹{priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-3 flex items-center">
            <Star size={16} className="mr-2 text-india-orange" />
            Rating
          </h4>
          <div className="space-y-2">
            {[null, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating === null ? 'all' : rating}
                className={`flex items-center w-full p-2 rounded-md text-left transition-colors ${
                  ratingFilter === rating 
                    ? theme === 'dark' 
                      ? 'bg-india-orange/30 border-india-orange text-india-orange' 
                      : 'bg-india-orange/10 border-india-orange text-india-orange' 
                    : theme === 'dark'
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-gray-100 border-gray-300'
                } border`}
                onClick={() => setRatingFilter(rating)}
              >
                {rating === null ? (
                  <span>Any Rating</span>
                ) : (
                  <div className="flex items-center">
                    {[...Array(rating)].map((_, i) => (
                      <Star key={i} size={14} className="text-yellow-500 fill-yellow-500" />
                    ))}
                    <span className="ml-1">& above</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-3">Amenities</h4>
          <div className="space-y-2">
            {displayedAmenities.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={`amenity-${amenity}`}
                  checked={selectedAmenities.includes(amenity)}
                  onCheckedChange={() => handleAmenityChange(amenity)}
                />
                <label
                  htmlFor={`amenity-${amenity}`}
                  className="text-sm cursor-pointer"
                >
                  {amenity}
                </label>
              </div>
            ))}
          </div>
          {hotelAmenities.length > 6 && (
            <Button 
              variant="link" 
              className="mt-2 p-0 h-auto text-india-orange"
              onClick={() => setShowAllAmenities(!showAllAmenities)}
            >
              {showAllAmenities ? 'Show Less' : `Show More (${hotelAmenities.length - 6} more)`}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelFilter;
