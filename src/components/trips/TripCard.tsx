
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, Star } from 'lucide-react';
import { Trip } from '../../data/tripData';
import { useTheme } from '../../context/ThemeContext';

interface TripCardProps {
  trip: Trip;
  states?: string[];
  index?: number;
  theme?: string;
  onClick?: () => void;
}

export const TripCard = ({ trip, states = [], index = 0, theme, onClick }: TripCardProps) => {
  const { theme: contextTheme } = useTheme();
  const currentTheme = theme || contextTheme;

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl rounded-xl overflow-hidden border ${
        currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}
      onClick={handleClick}
    >
      <div className="relative">
        <img 
          src={trip.image} 
          alt={trip.title}
          className="w-full h-48 object-cover"
        />
        {trip.featured && (
          <div className="absolute top-3 left-3 bg-india-orange text-white px-2 py-1 rounded-full text-xs font-medium">
            Featured
          </div>
        )}
        {trip.discountedPrice && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            {Math.round((1 - trip.discountedPrice / trip.price) * 100)}% OFF
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="inline-block px-2 py-1 bg-india-orange/10 text-india-orange rounded-full text-xs font-medium">
            {trip.category}
          </span>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm">{trip.rating}</span>
          </div>
        </div>
        
        <h3 className="text-lg font-display font-semibold mb-2 line-clamp-2">
          {trip.title}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {trip.description}
        </p>
        
        <div className="space-y-2 mb-4">
          {states.length > 0 && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{states.join(', ')}</span>
            </div>
          )}
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{trip.duration} days</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-2" />
            <span>Up to 10 travelers</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            {trip.discountedPrice ? (
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-india-orange">
                  ₹{trip.discountedPrice.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  ₹{trip.price.toLocaleString()}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-india-orange">
                ₹{trip.price.toLocaleString()}
              </span>
            )}
          </div>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentTheme === 'dark'
                ? 'bg-india-orange/20 text-india-orange hover:bg-india-orange/30'
                : 'bg-india-orange/10 text-india-orange hover:bg-india-orange/20'
            }`}
          >
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};
