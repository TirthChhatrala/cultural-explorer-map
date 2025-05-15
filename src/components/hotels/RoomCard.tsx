
import React from 'react';
import { motion } from 'framer-motion';
import { Room } from '../../data/hotelData';
import { Users, Check, IndianRupee } from 'lucide-react';

interface RoomCardProps {
  room: Room;
  isSelected: boolean;
  onSelect: () => void;
  theme: string;
  nights: number;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, isSelected, onSelect, theme, nights }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onSelect}
      className={`p-4 rounded-lg cursor-pointer transition-all ${
        isSelected
          ? theme === 'dark' 
            ? 'bg-india-orange/30 border-india-orange' 
            : 'bg-india-orange/10 border-india-orange'
          : theme === 'dark' 
            ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' 
            : 'bg-white border-gray-200 hover:bg-gray-50'
      } border`}
    >
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/4">
          <img 
            src={room.images[0]} 
            alt={room.name}
            className="w-full h-32 object-cover rounded-md"
          />
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className="font-medium">{room.name}</h4>
            <div className="flex items-center text-sm">
              <Users size={14} className="mr-1 text-muted-foreground" />
              <span className="text-muted-foreground">Up to {room.capacity} guests</span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mt-1 mb-3">{room.description}</p>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {room.amenities.slice(0, 4).map((amenity, index) => (
              <span
                key={index}
                className={`px-2 py-1 text-xs rounded ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              >
                {amenity}
              </span>
            ))}
            {room.amenities.length > 4 && (
              <span
                className={`px-2 py-1 text-xs rounded ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              >
                +{room.amenities.length - 4} more
              </span>
            )}
          </div>
          
          <div className="text-sm">
            <div className="flex items-center mb-1">
              <Check size={16} className="mr-1 text-green-500" />
              {room.beds}
            </div>
          </div>
        </div>
        
        <div className="md:w-1/4 flex flex-col items-end justify-between">
          <div className="flex flex-col items-end">
            <div className="flex items-center">
              <IndianRupee size={14} className="mr-1" />
              <span className="font-semibold">{room.price.toLocaleString()}</span>
            </div>
            <span className="text-xs text-muted-foreground">per night</span>
            
            {nights > 0 && (
              <div className="text-xs text-muted-foreground mt-1">
                ₹{(room.price * nights).toLocaleString()} total for {nights} {nights === 1 ? 'night' : 'nights'}
              </div>
            )}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-1 mt-4 text-sm rounded ${
              isSelected
                ? 'bg-india-orange text-white'
                : theme === 'dark' 
                  ? 'bg-gray-700 text-white' 
                  : 'bg-gray-100 text-gray-800'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            {isSelected ? 'Selected' : 'Select'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default RoomCard;
