
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { hotels } from '../data/hotelData';
import { states } from '../data/states';
import { 
  MapPin, Calendar, Users, Star, IndianRupee, ChevronRight, 
  ChevronDown, Check, Wifi, Clock, ListFilter, MapIcon, Coffee, ExternalLink
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { Button } from '@/components/ui/button';
import RoomCard from '../components/hotels/RoomCard';
import ImageGallery from '../components/hotels/ImageGallery';

const HotelDetails = () => {
  const { hotelId } = useParams<{ hotelId: string }>();
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(2);
  const [selectedTab, setSelectedTab] = useState('rooms');
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showAllImages, setShowAllImages] = useState(false);
  
  // Find the hotel based on the hotelId
  const hotel = hotels.find(h => h.id === hotelId);
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Set default dates
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const twoWeeksFromNow = new Date(today);
    twoWeeksFromNow.setDate(today.getDate() + 3);
    
    setCheckInDate(tomorrow.toISOString().substring(0, 10));
    setCheckOutDate(twoWeeksFromNow.toISOString().substring(0, 10));
  }, []);
  
  const handleBookRoom = () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to book this accommodation',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }
    
    if (!checkInDate || !checkOutDate) {
      toast({
        title: 'Dates required',
        description: 'Please select both check-in and check-out dates',
        variant: 'destructive',
      });
      return;
    }
    
    if (!selectedRoomId) {
      toast({
        title: 'Room selection required',
        description: 'Please select a room to continue with your booking',
        variant: 'destructive',
      });
      return;
    }
    
    const selectedRoom = hotel?.rooms.find(room => room.id === selectedRoomId);
    
    toast({
      title: 'Booking confirmed!',
      description: `Your ${selectedRoom?.name} at ${hotel?.name} has been booked for ${checkInDate}`,
    });
  };
  
  if (!hotel) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-display font-bold mb-4">Accommodation not found</h2>
          <p className="text-muted-foreground mb-8">The accommodation you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/hotels')}>
            View All Accommodations
          </Button>
        </div>
      </Layout>
    );
  }
  
  // Calculate the number of nights
  const nights = checkInDate && checkOutDate ? 
    Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;
  
  // Get state name
  const stateName = states.find(s => s.id === hotel.state)?.name || hotel.state;
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Hero Section */}
          <div className="relative mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 h-[50vh] min-h-[400px]">
              <div className="md:col-span-2 h-full overflow-hidden rounded-tl-xl rounded-bl-xl">
                <img 
                  src={hotel.images[0]} 
                  alt={hotel.name} 
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
                  onClick={() => setShowAllImages(true)}
                />
              </div>
              <div className="hidden md:grid grid-rows-2 gap-2 h-full">
                <div className="overflow-hidden rounded-tr-xl">
                  <img 
                    src={hotel.images[1] || hotel.images[0]} 
                    alt={hotel.name} 
                    className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
                    onClick={() => setShowAllImages(true)}
                  />
                </div>
                <div className="overflow-hidden rounded-br-xl relative">
                  <img 
                    src={hotel.images[2] || hotel.images[0]} 
                    alt={hotel.name} 
                    className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
                    onClick={() => setShowAllImages(true)}
                  />
                  <div 
                    className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer hover:bg-black/40 transition-colors"
                    onClick={() => setShowAllImages(true)}
                  >
                    <span className="text-white font-medium">View all photos</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile view images button */}
            <div className="md:hidden mt-2">
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => setShowAllImages(true)}
              >
                View all photos
              </Button>
            </div>
          </div>
          
          {showAllImages && (
            <ImageGallery 
              images={hotel.images} 
              name={hotel.name} 
              onClose={() => setShowAllImages(false)} 
            />
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
            {/* Hotel Details */}
            <div className="lg:col-span-2">
              <section className="mb-8">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {hotel.type.charAt(0).toUpperCase() + hotel.type.slice(1)}
                    </span>
                    <h1 className="text-3xl md:text-4xl font-display font-bold mt-2 mb-2">
                      {hotel.name}
                    </h1>
                    <div className="flex items-center text-sm gap-1 mb-3">
                      <div className="flex items-center">
                        <Star size={16} className="text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="font-medium">{hotel.rating}</span>
                      </div>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">{hotel.reviews} reviews</span>
                      <span className="text-muted-foreground">•</span>
                      <div className="flex items-center">
                        <MapPin size={14} className="mr-1 text-muted-foreground" />
                        <span className="text-muted-foreground">{hotel.location}, {stateName}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex flex-col items-end">
                      {hotel.discountedPrice ? (
                        <>
                          <span className="text-lg font-semibold text-india-orange">
                            ₹{hotel.discountedPrice.toLocaleString()}
                          </span>
                          <span className="text-sm line-through text-muted-foreground">
                            ₹{hotel.price.toLocaleString()}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-semibold">
                          ₹{hotel.price.toLocaleString()}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">per night</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-6">
                  {hotel.description}
                </p>
                
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Top Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3">
                    {hotel.amenities.slice(0, showAllAmenities ? hotel.amenities.length : 6).map((amenity, index) => (
                      <div key={index} className="flex items-center">
                        <Check size={16} className="mr-2 text-green-500" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                  {hotel.amenities.length > 6 && (
                    <Button 
                      variant="link" 
                      className="mt-2 p-0 h-auto text-india-orange"
                      onClick={() => setShowAllAmenities(!showAllAmenities)}
                    >
                      {showAllAmenities ? 'Show Less' : `Show All (${hotel.amenities.length})`}
                    </Button>
                  )}
                </div>
              </section>
              
              <div className="border-b mb-6">
                <div className="flex overflow-x-auto">
                  <button
                    className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                      selectedTab === 'rooms' 
                        ? 'border-india-orange text-india-orange' 
                        : 'border-transparent hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTab('rooms')}
                  >
                    Rooms
                  </button>
                  <button
                    className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                      selectedTab === 'location' 
                        ? 'border-india-orange text-india-orange' 
                        : 'border-transparent hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTab('location')}
                  >
                    Location
                  </button>
                  <button
                    className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                      selectedTab === 'policies' 
                        ? 'border-india-orange text-india-orange' 
                        : 'border-transparent hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTab('policies')}
                  >
                    Policies
                  </button>
                  <button
                    className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                      selectedTab === 'reviews' 
                        ? 'border-india-orange text-india-orange' 
                        : 'border-transparent hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTab('reviews')}
                  >
                    Reviews
                  </button>
                </div>
              </div>
              
              {selectedTab === 'rooms' && (
                <section className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Available Rooms</h3>
                  <div className="space-y-6">
                    {hotel.rooms.map((room) => (
                      <RoomCard
                        key={room.id}
                        room={room}
                        isSelected={selectedRoomId === room.id}
                        onSelect={() => setSelectedRoomId(room.id)}
                        theme={theme}
                        nights={nights}
                      />
                    ))}
                  </div>
                </section>
              )}
              
              {selectedTab === 'location' && (
                <section className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Location</h3>
                  <div className="mb-4">
                    <p className="text-muted-foreground">
                      {hotel.location}, {stateName}, India
                    </p>
                  </div>
                  <div className="aspect-video mb-6 bg-gray-200 rounded-lg overflow-hidden">
                    {/* In a real implementation, this would be a proper map */}
                    <div className={`h-full flex items-center justify-center ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                    }`}>
                      <div className="text-center">
                        <MapIcon size={48} className="mx-auto mb-2 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Map view would be displayed here
                        </span>
                        <p className="text-sm text-muted-foreground mt-1">
                          Coordinates: {hotel.coordinates.latitude}, {hotel.coordinates.longitude}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <h4 className="font-medium mb-2">Nearby Attractions</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {hotel.nearbyAttractions.map((attraction, index) => (
                      <li key={index}>{attraction}</li>
                    ))}
                  </ul>
                </section>
              )}
              
              {selectedTab === 'policies' && (
                <section className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Policies</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="flex items-center font-medium mb-2">
                        <Clock size={18} className="mr-2 text-india-orange" />
                        Check-in / Check-out
                      </h4>
                      <ul className="list-inside space-y-1 text-muted-foreground">
                        <li>Check-in time: {hotel.policies.checkIn}</li>
                        <li>Check-out time: {hotel.policies.checkOut}</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="flex items-center font-medium mb-2">
                        <Users size={18} className="mr-2 text-india-orange" />
                        Children & Pets
                      </h4>
                      <ul className="list-inside space-y-1 text-muted-foreground">
                        <li>{hotel.policies.children}</li>
                        <li>{hotel.policies.pets}</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="flex items-center font-medium mb-2">
                      <ListFilter size={18} className="mr-2 text-india-orange" />
                      Cancellation Policy
                    </h4>
                    <p className="text-muted-foreground">{hotel.policies.cancellation}</p>
                  </div>
                </section>
              )}
              
              {selectedTab === 'reviews' && (
                <section className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Guest Reviews</h3>
                    <div className="flex items-center">
                      <Star size={18} className="text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="text-lg font-semibold">{hotel.rating}</span>
                      <span className="text-muted-foreground ml-1">({hotel.reviews})</span>
                    </div>
                  </div>
                  
                  <div className="text-center py-10">
                    <Star size={48} className="mx-auto mb-2 text-yellow-500 fill-yellow-500" />
                    <h3 className="text-xl font-semibold mb-2">Reviews coming soon!</h3>
                    <p className="text-muted-foreground">
                      We're working on gathering authentic reviews from our guests.
                    </p>
                  </div>
                </section>
              )}
            </div>
            
            {/* Booking Sidebar */}
            <div>
              <div className={`sticky top-24 p-6 rounded-lg border shadow-sm ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <h3 className="text-xl font-display font-semibold mb-4">Book this accommodation</h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Check-in</label>
                    <input
                      type="date"
                      className={`w-full p-2 rounded-md border ${
                        theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                      }`}
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Check-out</label>
                    <input
                      type="date"
                      className={`w-full p-2 rounded-md border ${
                        theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                      }`}
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      min={checkInDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Guests</label>
                    <div className="flex">
                      <button
                        className={`px-3 py-1 ${
                          theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                        } rounded-l-md transition-colors`}
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        className={`w-full p-1 text-center border-y ${
                          theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                        }`}
                        value={guests}
                        onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value) || 1))}
                        min="1"
                      />
                      <button
                        className={`px-3 py-1 ${
                          theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                        } rounded-r-md transition-colors`}
                        onClick={() => setGuests(guests + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                
                {nights > 0 && selectedRoomId ? (
                  <>
                    <div className={`p-4 rounded-md mb-4 ${
                      theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                    }`}>
                      <h4 className="font-medium mb-2">Selected Room</h4>
                      <div className="text-sm">
                        {hotel.rooms.find(r => r.id === selectedRoomId)?.name}
                      </div>
                    </div>
                    
                    <div className="mb-4 space-y-2">
                      <div className="flex justify-between">
                        <span>
                          ₹{hotel.rooms.find(r => r.id === selectedRoomId)?.price.toLocaleString()} x {nights} {nights === 1 ? 'night' : 'nights'}
                        </span>
                        <span>
                          ₹{(hotel.rooms.find(r => r.id === selectedRoomId)?.price || 0 * nights).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taxes & Fees</span>
                        <span>
                          ₹{Math.round((hotel.rooms.find(r => r.id === selectedRoomId)?.price || 0) * nights * 0.18).toLocaleString()}
                        </span>
                      </div>
                      <div className={`h-px w-full my-2 ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                      }`}></div>
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>
                          ₹{Math.round((hotel.rooms.find(r => r.id === selectedRoomId)?.price || 0) * nights * 1.18).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-india-orange hover:bg-india-orange/90 text-white"
                      onClick={handleBookRoom}
                    >
                      Book Now
                    </Button>
                    
                    <p className="text-xs text-muted-foreground text-center mt-4">
                      You won't be charged yet
                    </p>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-4">
                      {nights <= 0 
                        ? 'Please select check-in and check-out dates' 
                        : 'Please select a room above'}
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        if (nights <= 0) {
                          // Set focus to check-in date input
                          document.querySelector('input[type="date"]')?.focus();
                        } else {
                          // Scroll to rooms section
                          setSelectedTab('rooms');
                          window.scrollBy({ top: 300, behavior: 'smooth' });
                        }
                      }}
                    >
                      {nights <= 0 ? 'Select Dates' : 'Select a Room'}
                    </Button>
                  </div>
                )}
              </div>
              
              <div className={`mt-4 p-4 rounded-md ${
                theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
              }`}>
                <div className="flex items-center mb-2">
                  <Coffee size={18} className="mr-2 text-india-orange" />
                  <h4 className="font-medium">Why Book With Us?</h4>
                </div>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li className="flex items-center">
                    <Check size={14} className="mr-2 text-green-500" />
                    Best price guarantee
                  </li>
                  <li className="flex items-center">
                    <Check size={14} className="mr-2 text-green-500" />
                    Free cancellation on most rooms
                  </li>
                  <li className="flex items-center">
                    <Check size={14} className="mr-2 text-green-500" />
                    No booking fees
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default HotelDetails;
