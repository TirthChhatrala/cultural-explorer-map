
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Map from './Map';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { states } from '../data/states';

const EnhancedMap = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [activeState, setActiveState] = useState<string | null>(null);

  const handleStateHover = (stateId: string | null) => {
    setHoveredState(stateId);
  };

  const handleStateClick = (stateId: string) => {
    setActiveState(stateId);
    navigate(`/state/${stateId}`);
  };

  return (
    <div className="relative w-full aspect-square max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`${
          theme === 'dark' 
            ? 'bg-gray-800/80 border-gray-700' 
            : 'bg-white/80 border-gray-200'
          } rounded-2xl border overflow-hidden backdrop-blur-sm shadow-xl`}
      >
        <div className="relative aspect-square">
          <Map
            onStateHover={handleStateHover}
            onStateClick={handleStateClick}
            hoveredState={hoveredState}
            activeState={activeState}
          />
          
          <div className="absolute bottom-4 left-4 right-4">
            {hoveredState && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`p-4 rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-gray-800/90 border-gray-700' 
                    : 'bg-white/90 border-gray-200'
                  } border backdrop-blur-sm shadow-lg`}
              >
                <h3 className="font-semibold text-lg mb-1">
                  {states.find(state => state.id === hoveredState)?.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Click to explore more about this state
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EnhancedMap;
