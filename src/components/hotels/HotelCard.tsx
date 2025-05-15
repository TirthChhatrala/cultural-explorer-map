
import React from 'react';
import { motion } from 'framer-motion';
import { Hotel } from '../../data/hotelData';
import { MapPin, Star, IndianRupee } from 'lucide-react';

interface HotelCardProps {
  hotel: Hotel;
  index: number;
  theme: string;
  stateName: string;
  onClick: () => void;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, index, theme, stateName, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`overflow-hidden rounded-xl cursor-pointer transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border`}
      onClick={onClick}
    >
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 relative">
          <img 
            src={hotel.image} 
            alt={hotel.name} 
            className="w-full h-full object-cover md:h-48 lg:h-64"
          />
          
          {hotel.discountedPrice && (
            <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              {Math.round((1 - hotel.discountedPrice / hotel.price) * 100)}% OFF
            </div>
          )}
          
          {hotel.featured && (
            <div className="absolute top-4 right-4 bg-india-orange text-white text-xs font-medium px-2 py-1 rounded-full">
              Featured
            </div>
          )}
        </div>
        
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center text-xs mb-2">
              <span className={`inline-block px-2 py-1 rounded-full ${
                theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
              }`}>
                {hotel.type.charAt(0).toUpperCase() + hotel.type.slice(1)}
              </span>
            </div>
            
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-display font-semibold">{hotel.name}</h3>
              <div className="flex items-center">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <span className="ml-1 text-sm">{hotel.rating}</span>
              </div>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground mb-3">
              <MapPin size={14} className="mr-1" />
              <span>{hotel.location}, {stateName}</span>
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{hotel.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {hotel.amenities.slice(0, 3).map((amenity, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 text-xs rounded ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  }`}
                >
                  {amenity}
                </span>
              ))}
              {hotel.amenities.length > 3 && (
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  }`}
                >
                  +{hotel.amenities.length - 3} more
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center">
                <IndianRupee size={14} className="mr-1" />
                <span className={`font-semibold ${hotel.discountedPrice ? 'text-red-500' : ''}`}>
                  {hotel.discountedPrice ? hotel.discountedPrice.toLocaleString() : hotel.price.toLocaleString()}
                </span>
                {hotel.discountedPrice && (
                  <span className="ml-2 text-sm text-muted-foreground line-through">₹{hotel.price.toLocaleString()}</span>
                )}
              </div>
              <span className="text-xs text-muted-foreground">per night</span>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1 text-sm bg-india-orange text-white rounded hover:bg-india-orange/90 transition-colors"
            >
              View Details
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HotelCard;
