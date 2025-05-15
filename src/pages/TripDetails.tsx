
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { trips, hotels, attractions } from '../data/tripData';
import { states } from '../data/states';
import { MapPin, Calendar, Users, Clock, Star, IndianRupee, ChevronRight, ChevronDown } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { Button } from '@/components/ui/button';

const TripDetails = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [travelers, setTravelers] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [expandedDay, setExpandedDay] = useState(1);
  
  // Find the trip based on the tripId
  const trip = trips.find(t => t.id === tripId);
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Set default selected date to 2 weeks from now
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
    setSelectedDate(twoWeeksFromNow.toISOString().substring(0, 10));
  }, []);
  
  const handleBookTrip = () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to book this trip',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }
    
    if (!selectedDate) {
      toast({
        title: 'Date required',
        description: 'Please select a start date for your trip',
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: 'Booking confirmed!',
      description: `Your ${trip?.title} trip has been booked for ${selectedDate}`,
    });
  };
  
  if (!trip) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-display font-bold mb-4">Trip not found</h2>
          <p className="text-muted-foreground mb-8">The trip you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/trips')}>
            View All Trips
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Hero Section */}
          <div className="relative h-[50vh] min-h-[400px] w-full mb-8 rounded-xl overflow-hidden">
            <img 
              src={trip.image} 
              alt={trip.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8">
              <span className="inline-block px-3 py-1 bg-india-orange text-white rounded-full text-sm font-medium mb-4">
                {trip.category}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-2">
                {trip.title}
              </h1>
              <div className="flex items-center text-white/80 mb-2">
                <MapPin size={18} className="mr-2" />
                <span>
                  {trip.states.map(stateId => 
                    states.find(s => s.id === stateId)?.name
                  ).join(', ')}
                </span>
              </div>
              <div className="flex items-center">
                <div className="flex items-center mr-4">
                  <Calendar size={16} className="text-white/80 mr-1" />
                  <span className="text-white/80">{trip.duration} days</span>
                </div>
                <div className="flex items-center">
                  <Star size={16} className="text-yellow-400 fill-yellow-400 mr-1" />
                  <span className="text-white/80">{trip.rating} ({trip.reviews} reviews)</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
            {/* Trip Details */}
            <div className="lg:col-span-2">
              <section className="mb-8">
                <h2 className="text-2xl font-display font-semibold mb-4">Trip Overview</h2>
                <p className="text-muted-foreground mb-6">
                  {trip.description}
                </p>
                <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                }`}>
                  <div className="text-center">
                    <Calendar className="mx-auto mb-2 text-india-orange" size={24} />
                    <span className="block text-sm text-muted-foreground">Duration</span>
                    <span className="font-medium">{trip.duration} Days</span>
                  </div>
                  <div className="text-center">
                    <MapPin className="mx-auto mb-2 text-india-orange" size={24} />
                    <span className="block text-sm text-muted-foreground">Destinations</span>
                    <span className="font-medium">{trip.states.length}</span>
                  </div>
                  <div className="text-center">
                    <Star className="mx-auto mb-2 text-india-orange" size={24} />
                    <span className="block text-sm text-muted-foreground">Rating</span>
                    <span className="font-medium">{trip.rating}/5</span>
                  </div>
                  <div className="text-center">
                    <Users className="mx-auto mb-2 text-india-orange" size={24} />
                    <span className="block text-sm text-muted-foreground">Group Size</span>
                    <span className="font-medium">Any</span>
                  </div>
                </div>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-display font-semibold mb-4">Itinerary</h2>
                <div className="space-y-4">
                  {trip.itinerary.map((day) => (
                    <div 
                      key={day.day}
                      className={`border rounded-lg overflow-hidden ${
                        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                      }`}
                    >
                      <div 
                        className={`flex items-center justify-between p-4 cursor-pointer ${
                          expandedDay === day.day 
                            ? (theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100') 
                            : ''
                        }`}
                        onClick={() => setExpandedDay(expandedDay === day.day ? -1 : day.day)}
                      >
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            theme === 'dark' ? 'bg-gray-600' : 'bg-india-orange/10'
                          } text-india-orange font-medium mr-3`}>
                            {day.day}
                          </div>
                          <div>
                            <h3 className="font-semibold">Day {day.day}</h3>
                            <p className="text-sm text-muted-foreground">
                              {day.attractions.map(attractionId => {
                                const attraction = attractions.find(a => a.id === attractionId);
                                return attraction ? attraction.name : attractionId;
                              }).join(', ')}
                            </p>
                          </div>
                        </div>
                        {expandedDay === day.day ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                      </div>
                      
                      {expandedDay === day.day && (
                        <div className="p-4 border-t">
                          <div className="mb-4">
                            <h4 className="font-medium mb-2">Activities</h4>
                            <ul className="list-disc list-inside text-muted-foreground pl-2">
                              {day.attractions.map(attractionId => {
                                const attraction = attractions.find(a => a.id === attractionId);
                                return (
                                  <li key={attractionId} className="mb-1">
                                    {attraction ? attraction.name : attractionId}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                          
                          <div className="mb-4">
                            <h4 className="font-medium mb-2">Meals</h4>
                            <div className="flex flex-wrap gap-3">
                              {day.meals.breakfast && (
                                <span className={`px-2 py-1 rounded-md text-xs ${
                                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                                }`}>
                                  Breakfast: {day.meals.breakfast}
                                </span>
                              )}
                              {day.meals.lunch && (
                                <span className={`px-2 py-1 rounded-md text-xs ${
                                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                                }`}>
                                  Lunch: {day.meals.lunch}
                                </span>
                              )}
                              {day.meals.dinner && (
                                <span className={`px-2 py-1 rounded-md text-xs ${
                                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                                }`}>
                                  Dinner: {day.meals.dinner}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <h4 className="font-medium mb-2">Accommodation</h4>
                            <p className="text-muted-foreground">
                              {hotels.find(h => h.id === day.accommodation)?.name || day.accommodation}
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Transportation</h4>
                            <p className="text-muted-foreground">{day.transportation}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </div>
            
            {/* Booking Sidebar */}
            <div>
              <div className={`sticky top-24 p-6 rounded-lg border shadow-sm ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <h3 className="text-xl font-display font-semibold mb-4">Book this trip</h3>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold">Price:</span>
                    <div>
                      {trip.discountedPrice ? (
                        <>
                          <span className="text-xl font-semibold text-india-orange">
                            ₹{trip.discountedPrice.toLocaleString()}
                          </span>
                          <span className="ml-2 text-sm line-through text-muted-foreground">
                            ₹{trip.price.toLocaleString()}
                          </span>
                        </>
                      ) : (
                        <span className="text-xl font-semibold">
                          ₹{trip.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground text-right">per person</p>
                  
                  <div className={`h-px w-full my-4 ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  }`}></div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Start Date</label>
                  <input
                    type="date"
                    className={`w-full p-2 rounded-md border ${
                      theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    }`}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Number of Travelers</label>
                  <div className="flex">
                    <button
                      className={`px-3 py-1 ${
                        theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                      } rounded-l-md transition-colors`}
                      onClick={() => setTravelers(Math.max(1, travelers - 1))}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      className={`w-full p-1 text-center border-y ${
                        theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                      }`}
                      value={travelers}
                      onChange={(e) => setTravelers(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                    />
                    <button
                      className={`px-3 py-1 ${
                        theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                      } rounded-r-md transition-colors`}
                      onClick={() => setTravelers(travelers + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span>Trip Cost</span>
                    <span>₹{((trip.discountedPrice || trip.price) * travelers).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Taxes & Fees</span>
                    <span>₹{Math.round((trip.discountedPrice || trip.price) * travelers * 0.18).toLocaleString()}</span>
                  </div>
                  <div className={`h-px w-full my-2 ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  }`}></div>
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{Math.round((trip.discountedPrice || trip.price) * travelers * 1.18).toLocaleString()}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-india-orange hover:bg-india-orange/90 text-white"
                  onClick={handleBookTrip}
                >
                  Book Now
                </Button>
                
                <p className="text-xs text-muted-foreground text-center mt-4">
                  No payment required now. We'll contact you to finalize the booking.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default TripDetails;
