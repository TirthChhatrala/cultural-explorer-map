
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useTheme } from '../context/ThemeContext';
import { hotels, hotelAmenities, hotelTypes } from '../data/hotelData';
import { states } from '../data/states';
import HotelCard from '../components/hotels/HotelCard';
import HotelFilter from '../components/hotels/HotelFilter';
import { MapPin, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Hotels = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('recommended');
  
  const filteredHotels = hotels.filter(hotel => {
    // Search query filter
    const matchesSearch = hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        hotel.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        hotel.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Type filter
    const matchesType = !selectedType || hotel.type === selectedType;
    
    // State filter
    const matchesState = !selectedState || hotel.state === selectedState;
    
    // Amenities filter
    const matchesAmenities = selectedAmenities.length === 0 || 
                          selectedAmenities.every(amenity => hotel.amenities.includes(amenity));
    
    // Price filter
    const matchesPrice = hotel.price >= priceRange[0] && hotel.price <= priceRange[1];
    
    // Rating filter
    const matchesRating = !ratingFilter || hotel.rating >= ratingFilter;
    
    return matchesSearch && matchesType && matchesState && matchesAmenities && matchesPrice && matchesRating;
  });
  
  // Sort hotels based on selected option
  const sortedHotels = [...filteredHotels].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return (a.discountedPrice || a.price) - (b.discountedPrice || b.price);
      case 'price-desc':
        return (b.discountedPrice || b.price) - (a.discountedPrice || a.price);
      case 'rating':
        return b.rating - a.rating;
      case 'recommended':
      default:
        // Mix of featured, rating, and reviews
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b.rating * b.reviews - a.rating * a.reviews;
    }
  });

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
        >
          <section className="text-center py-16">
            <span className="inline-block px-3 py-1 bg-india-orange/10 text-india-orange rounded-full text-sm font-medium mb-4">
              Stay in India
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 tracking-tight">
              Find the Perfect <span className="text-india-orange">Accommodations</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover top-rated hotels, resorts, and homestays across India. Book instantly without any restrictions!
            </p>
            
            <div className="mt-8 max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    type="text"
                    placeholder="Search hotels, locations, amenities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
                <div className="relative w-full sm:w-auto">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <select 
                    className={`h-12 pl-10 rounded-md w-full sm:w-40 ${
                      theme === 'dark' 
                        ? 'bg-background border-input' 
                        : 'bg-background border-input'
                    }`}
                    value={selectedState || ''}
                    onChange={(e) => setSelectedState(e.target.value || null)}
                  >
                    <option value="">All Locations</option>
                    {states.map((state) => (
                      <option key={state.id} value={state.id}>{state.name}</option>
                    ))}
                  </select>
                </div>
                <Button className="h-12 bg-india-orange hover:bg-india-orange/90">
                  Search
                </Button>
              </div>
            </div>
          </section>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <HotelFilter
              hotelTypes={hotelTypes}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              selectedAmenities={selectedAmenities}
              setSelectedAmenities={setSelectedAmenities}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              ratingFilter={ratingFilter}
              setRatingFilter={setRatingFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              theme={theme}
            />
          </div>
          
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                {filteredHotels.length} {filteredHotels.length === 1 ? 'accommodation' : 'accommodations'} found
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`p-2 rounded-md ${
                    theme === 'dark' 
                      ? 'bg-background border-input' 
                      : 'bg-background border-input'
                  } text-sm`}
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>
            
            {sortedHotels.length > 0 ? (
              <div className="space-y-6">
                {sortedHotels.map((hotel, index) => (
                  <HotelCard
                    key={hotel.id}
                    hotel={hotel}
                    index={index}
                    theme={theme}
                    stateName={states.find(s => s.id === hotel.state)?.name || hotel.state}
                    onClick={() => navigate(`/hotels/${hotel.id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold mb-2">No accommodations found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search for something different.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedType(null);
                    setSelectedState(null);
                    setSelectedAmenities([]);
                    setPriceRange([0, 50000]);
                    setRatingFilter(null);
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Hotels;
