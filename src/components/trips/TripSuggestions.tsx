
import React from 'react';
import { TripCard } from './TripCard';
import { tripData } from '../../data/tripData';
import { motion } from 'framer-motion';

interface TripSuggestionsProps {
  className?: string;
  limit?: number;
}

export const TripSuggestions = ({ className = "", limit = 3 }: TripSuggestionsProps) => {
  // Get featured trips (just taking the first few trips for this example)
  const featuredTrips = tripData.slice(0, limit);

  return (
    <div className={className}>
      <div className="text-center mb-10">
        <span className="inline-block px-3 py-1 bg-india-orange/10 text-india-orange rounded-full text-sm font-medium mb-4">
          Popular Experiences
        </span>
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Featured Trips</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover our most popular cultural experiences and immersive journeys across India
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {featuredTrips.map((trip, index) => (
          <motion.div
            key={trip.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="dark:bg-transparent"
          >
            <TripCard trip={trip} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
