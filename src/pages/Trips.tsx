
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { trips } from '../data/tripData';
import { states } from '../data/states';
import { TripCard } from '../components/trips/TripCard';
import TripFilter from '../components/trips/TripFilter';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import { Tent, Wallet, Map, Crown, Diamond, Church, Mountain, Ticket, TreeDeciduous, Landmark } from 'lucide-react';

// Define trip categories with icons and descriptions
const tripCategories = [
  {
    id: 'Small',
    title: 'Small Trip',
    description: 'Quick getaways perfect for busy schedules',
    icon: Ticket,
    color: 'bg-blue-500'
  },
  {
    id: 'Luxury',
    title: 'Luxury Trip',
    description: 'Premium experiences with top-tier accommodations',
    icon: Diamond,
    color: 'bg-purple-500'
  },
  {
    id: 'Royal',
    title: 'Royal Trip',
    description: 'Experience heritage stays in palaces and royal treatment',
    icon: Crown,
    color: 'bg-amber-500'
  },
  {
    id: 'Budget',
    title: 'Budget Trip',
    description: 'Affordable adventures that don\'t compromise on experiences',
    icon: Wallet,
    color: 'bg-green-500'
  },
  {
    id: 'Adventure',
    title: 'Adventure Trip',
    description: 'Thrilling activities for the adrenaline seekers',
    icon: Tent,
    color: 'bg-red-500'
  },
  {
    id: 'Spiritual',
    title: 'Spiritual Journey',
    description: 'Connect with India\'s rich spiritual heritage',
    icon: Church,
    color: 'bg-yellow-500'
  },
  {
    id: 'Beach',
    title: 'Beach Vacation',
    description: 'Relax on India\'s beautiful coastal shores',
    icon: Map,
    color: 'bg-cyan-500'
  },
  {
    id: 'Hill',
    title: 'Hill Station Escape',
    description: 'Cool retreats in India\'s picturesque mountain towns',
    icon: Mountain,
    color: 'bg-emerald-500'
  },
  {
    id: 'Wildlife',
    title: 'Wildlife Tour',
    description: 'Explore India\'s diverse national parks and sanctuaries',
    icon: TreeDeciduous,
    color: 'bg-lime-500'
  },
  {
    id: 'Cultural',
    title: 'Cultural Heritage Trip',
    description: 'Immerse in India\'s rich history and traditions',
    icon: Landmark,
    color: 'bg-orange-500'
  }
];

const Trips = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [viewMode, setViewMode] = useState<'list' | 'categories'>('categories');

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

  // Handler for the Create Custom Trip button
  const handleCreateCustomTrip = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to create a custom trip',
        variant: 'destructive',
      });
      navigate('/login');
    } else {
      navigate('/custom-trip');
    }
  };

  // Get trips by category for the category view
  const getTripsByCategory = (categoryId: string) => {
    return trips.filter(trip => trip.category === categoryId);
  };

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
                onClick={handleCreateCustomTrip}
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

        {/* View Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className={`inline-flex rounded-md shadow-sm ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                viewMode === 'categories' 
                  ? 'bg-india-orange text-white' 
                  : `${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`
              }`}
              onClick={() => setViewMode('categories')}
            >
              Trip Categories
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                viewMode === 'list' 
                  ? 'bg-india-orange text-white' 
                  : `${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`
              }`}
              onClick={() => setViewMode('list')}
            >
              All Trips
            </button>
          </div>
        </div>

        {viewMode === 'list' ? (
          <>
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
          </>
        ) : (
          <section className="mt-12 mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {tripCategories.map((category, index) => {
                const categoryTrips = getTripsByCategory(category.id);
                const tripCount = categoryTrips.length;
                
                return (
                  <motion.div 
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`p-6 rounded-xl shadow-md cursor-pointer transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border ${
                      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setViewMode('list');
                    }}
                  >
                    <div className="flex items-start">
                      <div className={`p-3 rounded-lg ${category.color} text-white mr-4`}>
                        <category.icon size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-display font-semibold mb-2">{category.title}</h3>
                        <p className="text-muted-foreground mb-3">{category.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">{tripCount} {tripCount === 1 ? 'package' : 'packages'} available</span>
                          <span className="text-india-orange text-sm font-medium">View All &rarr;</span>
                        </div>
                      </div>
                    </div>

                    {categoryTrips.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                          {categoryTrips.slice(0, 3).map(trip => (
                            <div 
                              key={trip.id} 
                              className="min-w-[200px] rounded overflow-hidden shadow-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/trips/${trip.id}`);
                              }}
                            >
                              <img 
                                src={trip.image} 
                                alt={trip.title} 
                                className="w-full h-24 object-cover" 
                              />
                              <div className="p-2">
                                <h4 className="font-medium text-sm truncate">{trip.title}</h4>
                                <p className="text-xs text-muted-foreground">₹{trip.discountedPrice?.toLocaleString() || trip.price.toLocaleString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default Trips;
