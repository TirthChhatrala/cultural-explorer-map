
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Map from './Map';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { states } from '../data/states';

const EnhancedMap = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [hoveredState, setHoveredState] = useState(null);
  const [activeState, setActiveState] = useState(null);

  const handleStateHover = (stateId) => {
    setHoveredState(stateId);
  };

  const handleStateClick = (stateId) => {
    setActiveState(stateId);
    navigate(`/state/${stateId}`);
  };

  return (
    <div className="relative">
      <div className={`${
        theme === 'dark' 
          ? 'bg-gray-800/80 border-gray-700' 
          : 'bg-white/80 border-gray-200'
        } shadow-xl rounded-2xl border overflow-hidden p-4`}
      >
        <div className="relative h-[500px] md:h-[600px] lg:h-[700px]">
          <Map
            onStateHover={handleStateHover}
            onStateClick={handleStateClick}
            hoveredState={hoveredState}
            activeState={activeState}
          />
          
          <div className="absolute bottom-4 left-4 right-4 z-10">
            {hoveredState && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className={`p-4 rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border border-gray-700' 
                    : 'bg-white border border-gray-200'
                  } shadow-lg`}
              >
                {states.find(state => state.id === hoveredState) && (
                  <div>
                    <h3 className="font-display font-semibold text-lg">
                      {states.find(state => state.id === hoveredState)?.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Click to explore more about this state
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
          
          <div className={`absolute top-4 right-4 p-3 rounded-lg ${
            theme === 'dark' 
              ? 'bg-gray-800/90 border border-gray-700' 
              : 'bg-white/90 border border-gray-200'
            }`}>
            <h4 className="text-sm font-medium mb-2">Map Legend</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-india-orange/70"></div>
                <span>State</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-india-orange"></div>
                <span>Hovered State</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-india-orange border border-white"></div>
                <span>Selected State</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedMap;
