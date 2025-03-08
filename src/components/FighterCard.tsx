
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const FighterCard = ({ fighter, onClick }) => {
  const { theme } = useTheme();
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={`cursor-pointer rounded-xl overflow-hidden shadow-md ${
        theme === 'dark' ? 'bg-gray-800 hover:shadow-indigo-500/10' : 'bg-white hover:shadow-lg'
      } transition-all duration-300`}
      onClick={() => onClick(fighter)}
    >
      <div className="h-48 overflow-hidden">
        <img 
          src={fighter.image} 
          alt={fighter.name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-display font-semibold">{fighter.name}</h3>
        <p className="text-sm text-muted-foreground">{fighter.state}</p>
        <div className="mt-2 flex items-center">
          <span className="text-xs px-2 py-0.5 rounded-full bg-india-orange/10 text-india-orange">
            {fighter.years}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default FighterCard;
