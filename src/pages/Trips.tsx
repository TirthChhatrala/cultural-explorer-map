
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { trips } from '../data/tripData';
import { states } from '../data/states';
import TripCard from '../components/trips/TripCard';
import TripFilter from '../components/trips/TripFilter';

const Trips = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 100000]);

  // Get unique categories
  const categories = ['all', ...new Set(trips.map(trip => trip.category))];

  // Get unique durations for filter
  const durations = ['all', '1-3 days', '4-7 days', '8+ days'];
  
  // Filter trips based on search and filters
  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       trip.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || trip.category === selectedCategory;
    
    const matchesState = selectedState === 'all' || trip.states.includes(selectedState);
    
    let matchesDuration = true;
    if (selectedDuration === '1-3 days') {
      matchesDuration = trip.duration >= 1 && trip.duration <= 3;
    } else if (selectedDuration === '4-7 days') {
      matchesDuration = trip.duration >= 4 && trip.duration <= 7;
    } else if (selectedDuration === '8+ days') {
      matchesDuration = trip.duration >= 8;
    }
    
    const matchesPrice = trip.price >= priceRange[0] && trip.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesState && matchesDuration && matchesPrice;
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
              Discover India
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 tracking-tight">
              Explore Our <span className="text-india-orange">Trip Packages</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find the perfect journey through India with our curated trip packages or create your own custom adventure.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-india-orange text-white rounded-lg shadow-md hover:bg-india-orange/90 transition-colors"
                onClick={() => navigate('/custom-trip')}
              >
                Create Custom Trip
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-lg shadow-md ${
                  theme === 'dark' 
                    ? 'bg-gray-800 hover:bg-gray-700' 
                    : 'bg-gray-100 hover:bg-gray-200'
                } transition-colors`}
                onClick={() => {
                  const featuredTrip = trips.find(trip => trip.featured);
                  if (featuredTrip) {
                    navigate(`/trips/${featuredTrip.id}`);
                  }
                }}
              >
                View Featured Trips
              </motion.button>
            </div>
          </section>
        </motion.div>

        <TripFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          selectedDuration={selectedDuration}
          setSelectedDuration={setSelectedDuration}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          categories={categories}
          durations={durations}
          states={states}
          theme={theme}
        />

        <section className="mt-12 mb-20">
          {filteredTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTrips.map((trip, index) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  states={trip.states.map(stateId => 
                    states.find(s => s.id === stateId)?.name || stateId
                  )}
                  index={index}
                  theme={theme}
                  onClick={() => navigate(`/trips/${trip.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-6">No trips found matching your criteria.</p>
              <button
                className={`px-6 py-3 rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-gray-800 hover:bg-gray-700' 
                    : 'bg-gray-100 hover:bg-gray-200'
                } transition-colors`}
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedState('all');
                  setSelectedDuration('all');
                  setPriceRange([0, 100000]);
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default Trips;
