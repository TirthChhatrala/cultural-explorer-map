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

// Adding capacity to Room interface to fix the type error
interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number; // Added this field
  amenities: string[];
  images: string[];
}

interface Hotel {
  id: string;
  name: string;
  description: string;
  location: string;
  rating: number;
  price: number;
  images: string[];
  amenities: string[];
  rooms: Room[];
}

// Sample hotel data for demonstration
const hotelData: Hotel = {
  id: "grand-palace-hotel",
  name: "Grand Palace Hotel",
  description: "A luxurious 5-star hotel located in the heart of the city, offering stunning views of the skyline and unparalleled service.",
  location: "Central Business District, Mumbai",
  rating: 4.8,
  price: 12000,
  images: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3"
  ],
  amenities: [
    "Free Wi-Fi",
    "Swimming Pool",
    "Fitness Center",
    "Spa",
    "Restaurant",
    "Bar/Lounge",
    "24-hour Front Desk",
    "Room Service",
    "Business Center",
    "Airport Shuttle",
    "Concierge Service",
    "Laundry Service",
    "Dry Cleaning",
    "Babysitting",
    "Currency Exchange",
    "ATM on Site"
  ],
  rooms: [
    {
      id: "deluxe-room",
      name: "Deluxe Room",
      description: "Spacious room with a king-size bed, modern amenities, and city views.",
      price: 12000,
      capacity: 2,
      amenities: [
        "King-size bed",
        "40-inch LED TV",
        "Mini bar",
        "Safe",
        "Air conditioning",
        "Free Wi-Fi"
      ],
      images: [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3"
      ]
    },
    {
      id: "executive-suite",
      name: "Executive Suite",
      description: "Luxurious suite with separate living area, premium amenities, and panoramic city views.",
      price: 18000,
      capacity: 2,
      amenities: [
        "King-size bed",
        "Separate living area",
        "55-inch LED TV",
        "Premium toiletries",
        "Jacuzzi",
        "Mini bar",
        "Safe",
        "Air conditioning",
        "Free Wi-Fi"
      ],
      images: [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3"
      ]
    },
    {
      id: "presidential-suite",
      name: "Presidential Suite",
      description: "The epitome of luxury with multiple rooms, private butler service, and the best views in the hotel.",
      price: 35000,
      capacity: 4,
      amenities: [
        "Master bedroom with king-size bed",
        "Second bedroom with queen-size bed",
        "Dining area",
        "Full kitchen",
        "Private butler service",
        "Multiple 65-inch LED TVs",
        "Premium sound system",
        "Private terrace",
        "Jacuzzi",
        "Mini bar",
        "Safe",
        "Air conditioning",
        "Free Wi-Fi"
      ],
      images: [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3"
      ]
    }
  ]
};

const HotelDetails: React.FC = () => {
  const { theme } = useTheme();
  const { hotelId } = useParams<{ hotelId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  // Fetch hotel details (replace with actual data fetching)
  const [hotel, setHotel] = useState<Hotel | null>(null);

  useEffect(() => {
    // Simulate fetching hotel data based on hotelId
    // In a real application, you would fetch this data from an API
    if (hotelId === hotelData.id) {
      setHotel(hotelData);
    } else {
      // Handle hotel not found
      toast({
        title: "Hotel Not Found",
        description: "The requested hotel could not be found.",
        variant: "destructive",
      });
      navigate('/hotels');
    }
  }, [hotelId, navigate, toast]);

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room);
  };

  const handleBookNow = () => {
    if (selectedRoom) {
      // Implement booking logic here
      toast({
        title: "Booking Confirmed",
        description: `You have booked the ${selectedRoom.name} at ${hotel?.name}.`,
      });
    } else {
      toast({
        title: "No Room Selected",
        description: "Please select a room to book.",
        variant: "destructive",
      });
    }
  };

  const openGallery = (images: string[]) => {
    setGalleryImages(images);
    setShowGallery(true);
  };

  const closeGallery = () => {
    setShowGallery(false);
  };

  if (!hotel) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
        className="container mx-auto mt-8 mb-16 px-4"
      >
        {/* Hotel Header */}
        <section className="mb-8">
          <div className="mb-4">
            <Button variant="ghost" onClick={() => navigate('/hotels')}>
              <X className="mr-2 h-4 w-4" />
              Back to Hotels
            </Button>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold font-display">{hotel.name}</h1>
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <MapPin className="mr-2 h-4 w-4" />
                {hotel.location}
              </div>
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-xl font-semibold">{hotel.rating}</span>
              <Star className="text-yellow-500 h-5 w-5" />
            </div>
          </div>
        </section>

        {/* Image Gallery */}
        <section className="mb-8">
          <ImageGallery images={hotel.images} onImageClick={openGallery} />
        </section>

        {/* Hotel Details */}
        <section className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold font-display mb-4">About {hotel.name}</h2>
            <p className="text-gray-700 dark:text-gray-300">{hotel.description}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold font-display mb-4">Amenities</h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
              {hotel.amenities.map((amenity, index) => (
                <li key={index}>{amenity}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Room Selection */}
        <section>
          <h2 className="text-2xl font-semibold font-display mb-4">Rooms & Suites</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotel.rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                selected={selectedRoom?.id === room.id}
                onSelect={handleRoomSelect}
              />
            ))}
          </div>
        </section>

        {/* Booking Section */}
        <section className="mt-8">
          <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-md`}>
            <h3 className="text-xl font-semibold font-display mb-4">Book Your Stay</h3>
            {selectedRoom ? (
              <>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  You have selected the <span className="font-medium">{selectedRoom.name}</span> for ₹{selectedRoom.price.toLocaleString()} per night.
                </p>
                <Button className="w-full bg-india-orange hover:bg-india-orange/90 text-white" onClick={handleBookNow}>
                  Book Now
                </Button>
              </>
            ) : (
              <p className="text-gray-700 dark:text-gray-300">Please select a room to book.</p>
            )}
          </div>
        </section>

        {/* Image Gallery Modal */}
        {showGallery && (
          <div className="fixed top-0 left-0 w-full h-full bg-black/80 z-50 flex items-center justify-center">
            <div className="relative w-full max-w-4xl max-h-full">
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-4 right-4 z-50"
                onClick={closeGallery}
              >
                <X className="h-5 w-5" />
              </Button>
              <ImageGallery images={galleryImages} />
            </div>
          </div>
        )}
      </motion.div>
    </Layout>
  );
};

export default HotelDetails;
