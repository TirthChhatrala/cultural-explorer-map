
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Star, IndianRupee } from 'lucide-react';
import { Trip } from '../../data/tripData';

interface TripCardProps {
  trip: Trip;
  states: string[];
  index: number;
  theme: string;
  onClick: () => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip, states, index, theme, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`overflow-hidden rounded-xl shadow-md cursor-pointer transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border`}
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={trip.image} 
          alt={trip.title} 
          className="w-full h-48 object-cover"
        />
        
        {trip.discountedPrice && (
          <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            {Math.round((1 - trip.discountedPrice / trip.price) * 100)}% OFF
          </div>
        )}
        
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent py-4 px-4">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
            theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white/80 text-gray-900'
          }`}>
            {trip.category}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-display font-semibold">{trip.title}</h3>
          <div className="flex items-center">
            <Star size={14} className="text-yellow-500 fill-yellow-500" />
            <span className="ml-1 text-sm">{trip.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <MapPin size={14} className="mr-1" />
          <span>{states.join(', ')}</span>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <Calendar size={14} className="mr-1" />
          <span>{trip.duration} {trip.duration === 1 ? 'day' : 'days'}</span>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{trip.description}</p>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center">
              <IndianRupee size={14} className="mr-1" />
              <span className={`font-semibold ${trip.discountedPrice ? 'text-red-500' : ''}`}>
                {trip.discountedPrice ? trip.discountedPrice.toLocaleString() : trip.price.toLocaleString()}
              </span>
              {trip.discountedPrice && (
                <span className="ml-2 text-sm text-muted-foreground line-through">₹{trip.price.toLocaleString()}</span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">per person</span>
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
    </motion.div>
  );
};

export default TripCard;
