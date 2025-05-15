import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useTheme } from '../context/ThemeContext';
import { MapPin, Star, Check, X, Info, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '../hooks/use-toast';
import RoomCard from '../components/hotels/RoomCard';
import ImageGallery from '../components/hotels/ImageGallery';

interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  amenities: string[];
  images: string[];
  maxOccupancy: number;
  beds: number;
  isAvailable: boolean;
}

interface Hotel {
  id: string;
  name: string;
  description: string;
  location: string;
  state: string;
  rating: number;
  amenities: string[];
  images: string[];
  rooms: Room[];
}

// Sample hotel data (replace with actual data fetching)
const hotelData: Hotel = {
  id: "hotel123",
  name: "The Grand Indian Hotel",
  description: "A luxurious hotel offering the best of Indian hospitality. Located in the heart of the city, it's the perfect place to experience India.",
  location: "New Delhi",
  state: "Delhi",
  rating: 4.5,
  amenities: ["Free WiFi", "Swimming Pool", "Spa", "Fitness Center", "Restaurant", "Bar", "24/7 Room Service"],
  images: [
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop"
  ],
  rooms: [
    {
      id: "room1",
      name: "Deluxe Room",
      description: "A spacious room with a king-size bed and a city view.",
      price: 10000,
      discountedPrice: 8000,
      amenities: ["Free WiFi", "Air Conditioning", "TV", "Mini Bar"],
      images: [
        "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=1000&auto=format&fit=crop"
      ],
      maxOccupancy: 3,
      beds: 1,
      isAvailable: true
    },
    {
      id: "room2",
      name: "Suite",
      description: "A luxurious suite with a separate living area and a balcony.",
      price: 20000,
      amenities: ["Free WiFi", "Air Conditioning", "TV", "Mini Bar", "Balcony"],
      images: [
        "https://images.unsplash.com/photo-1616697978994-99104aa91942?q=80&w=1000&auto=format&fit=crop"
      ],
      maxOccupancy: 4,
      beds: 2,
      isAvailable: true
    },
    {
      id: "room3",
      name: "Standard Room",
      description: "A comfortable room with a queen-size bed.",
      price: 5000,
      amenities: ["Free WiFi", "Air Conditioning", "TV"],
      images: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1000&auto=format&fit=crop"
      ],
      maxOccupancy: 2,
      beds: 1,
      isAvailable: false
    }
  ]
};

const HotelDetails = () => {
  const { hotelId } = useParams<{ hotelId: string }>();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [nights, setNights] = useState(0);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [showGallery, setShowGallery] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [scrollToBooking, setScrollToBooking] = useState(false);
  
  // Using the sample hotel data for demo purposes
  // In a real app, you'd fetch this based on the hotelId
  const hotel = hotelData;
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  
  useEffect(() => {
    // Calculate number of nights
    if (checkInDate && checkOutDate) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const timeDiff = checkOut.getTime() - checkIn.getTime();
      const numNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
      setNights(numNights);
    } else {
      setNights(0);
    }
  }, [checkInDate, checkOutDate]);
  
  useEffect(() => {
    // Scroll to booking section when state changes
    if (scrollToBooking) {
      const bookingElement = document.getElementById('booking-section');
      if (bookingElement) {
        // Use scrollIntoView instead of focus
        bookingElement.scrollIntoView({ behavior: 'smooth' });
      }
      setScrollToBooking(false);
    }
  }, [scrollToBooking]);
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'checkInDate') {
      setCheckInDate(value);
    } else if (name === 'checkOutDate') {
      setCheckOutDate(value);
    }
  };
  
  const handleBookNow = () => {
    if (!checkInDate || !checkOutDate) {
      toast({
        title: 'Date required',
        description: 'Please select check-in and check-out dates',
        variant: 'destructive',
      });
      return;
    }
    
    if (!selectedRoomId) {
      toast({
        title: 'Room required',
        description: 'Please select a room to book',
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: 'Booking confirmed!',
      description: `Your booking for ${nights} nights has been confirmed`,
    });
  };
  
  const openGallery = (index: number) => {
    setCurrentPhotoIndex(index);
    setShowGallery(true);
  };
  
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
              src={hotel.images[0]} 
              alt={hotel.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-2">
                {hotel.name}
              </h1>
              <div className="flex items-center text-white/80 mb-2">
                <MapPin size={18} className="mr-2" />
                <span>{hotel.location}, {hotel.state}</span>
              </div>
              <div className="flex items-center">
                <div className="flex items-center">
                  <Star size={16} className="text-yellow-400 fill-yellow-400 mr-1" />
                  <span className="text-white/80">{hotel.rating} / 5</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
            {/* Hotel Details */}
            <div className="lg:col-span-2">
              <section className="mb-8">
                <h2 className="text-2xl font-display font-semibold mb-4">Hotel Overview</h2>
                <p className="text-muted-foreground mb-6">
                  {hotel.description}
                </p>
                
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-2">Top Amenities</h3>
                  <div className="flex flex-wrap gap-3">
                    {hotel.amenities.slice(0, showAllAmenities ? hotel.amenities.length : 5).map((amenity, index) => (
                      <span key={index} className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                        <Check size={16} className="mr-2" />
                        {amenity}
                      </span>
                    ))}
                    {hotel.amenities.length > 5 && (
                      <button onClick={() => setShowAllAmenities(!showAllAmenities)} className="text-sm text-blue-500">
                        {showAllAmenities ? 'Show Less' : 'Show All'}
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Hotel Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {hotel.images.map((image, index) => (
                      <button key={index} onClick={() => openGallery(index)} className="relative rounded-md overflow-hidden aspect-video">
                        <img 
                          src={image} 
                          alt={`${hotel.name} - Image ${index + 1}`} 
                          className="w-full h-full object-cover transition-transform hover:scale-105" 
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-8">
                  <h2 className="text-2xl font-display font-semibold mb-4">Rooms & Suites</h2>
                  <div className="space-y-6">
                    {hotel.rooms.map(room => (
                      <RoomCard 
                        key={room.id}
                        room={room}
                        selectedRoomId={selectedRoomId}
                        onSelect={() => {
                          setSelectedRoomId(room.id);
                          setScrollToBooking(true);
                        }}
                      />
                    ))}
                  </div>
                </div>
              </section>
            </div>
            
            {/* Booking Sidebar */}
            <div>
              <div id="booking-section" className={`sticky top-24 p-6 rounded-lg border shadow-sm ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <h3 className="text-xl font-display font-semibold mb-4">Book Your Stay</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Check-in Date</label>
                  <input
                    type="date"
                    name="checkInDate"
                    className={`w-full p-2 rounded-md border ${
                      theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    }`}
                    value={checkInDate}
                    onChange={handleDateChange}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Check-out Date</label>
                  <input
                    type="date"
                    name="checkOutDate"
                    className={`w-full p-2 rounded-md border ${
                      theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    }`}
                    value={checkOutDate}
                    onChange={handleDateChange}
                  />
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold">Price:</span>
                    <div>
                      {selectedRoomId && (
                        <>
                          <span className="text-xl font-semibold text-india-orange">
                            ₹{hotel.rooms.find(room => room.id === selectedRoomId)?.discountedPrice?.toLocaleString() || hotel.rooms.find(room => room.id === selectedRoomId)?.price?.toLocaleString()}
                          </span>
                          {hotel.rooms.find(room => room.id === selectedRoomId)?.discountedPrice && (
                            <span className="ml-2 text-sm line-through text-muted-foreground">
                              ₹{hotel.rooms.find(room => room.id === selectedRoomId)?.price?.toLocaleString()}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground text-right">per night</p>
                  
                  <div className={`h-px w-full my-4 ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  }`}></div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Number of Adults</label>
                  <input
                    type="number"
                    className={`w-full p-2 rounded-md border ${
                      theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    }`}
                    value={adults}
                    onChange={(e) => setAdults(parseInt(e.target.value))}
                    min="1"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Number of Children</label>
                  <input
                    type="number"
                    className={`w-full p-2 rounded-md border ${
                      theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    }`}
                    value={children}
                    onChange={(e) => setChildren(parseInt(e.target.value))}
                    min="0"
                  />
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span>Room Cost</span>
                    <span>₹{selectedRoomId && (hotel.rooms.find(room => room.id === selectedRoomId)?.discountedPrice || hotel.rooms.find(room => room.id === selectedRoomId)?.price)?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Taxes & Fees</span>
                    <span>₹{selectedRoomId && Math.round(((hotel.rooms.find(room => room.id === selectedRoomId)?.discountedPrice || hotel.rooms.find(room => room.id === selectedRoomId)?.price) || 0) * 0.18).toLocaleString()}</span>
                  </div>
                  <div className={`h-px w-full my-2 ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  }`}></div>
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{selectedRoomId && Math.round(((hotel.rooms.find(room => room.id === selectedRoomId)?.discountedPrice || hotel.rooms.find(room => room.id === selectedRoomId)?.price) || 0) * 1.18).toLocaleString()}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-india-orange hover:bg-india-orange/90 text-white"
                  onClick={handleBookNow}
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
      
      {/* Image Gallery Modal */}
      {showGallery && (
        <ImageGallery 
          images={hotel.images}
          name={hotel.name}
          onClose={() => setShowGallery(false)}
        />
      )}
    </Layout>
  );
};

export default HotelDetails;
