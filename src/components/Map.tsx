
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { states } from '../data/states';

const Map = () => {
  const [activeState, setActiveState] = useState(null);
  const [tooltip, setTooltip] = useState({ visible: false, content: '', x: 0, y: 0 });
  const navigate = useNavigate();

  const handleStateClick = (stateId) => {
    navigate(`/state/${stateId}`);
  };

  const handleStateHover = (stateName, x, y) => {
    setTooltip({
      visible: true,
      content: stateName,
      x,
      y
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto relative">
      <motion.div 
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
      >
        <svg 
          viewBox="0 0 650 700" 
          className="w-full h-auto drop-shadow-xl"
        >
          {/* Simple outline of India */}
          <path
            className="fill-white/5 stroke-gray-300 stroke-1"
            d="M150,100 L200,50 L300,30 L400,50 L500,100 L550,200 L600,300 L580,400 L500,500 L400,550 L300,580 L200,550 L150,500 L100,400 L120,300 L150,200 Z"
          />
          
          {/* Interactive states - these would be accurate SVG paths for each state in a real implementation */}
          {/* For now using simplified shapes to represent states */}
          <g>
            {/* Rajasthan (simplified) */}
            <path
              className={`state-path ${activeState === 'rajasthan' ? 'active' : ''}`}
              d="M150,150 L250,130 L300,180 L270,250 L190,270 L150,200 Z"
              onClick={() => handleStateClick('rajasthan')}
              onMouseEnter={(e) => {
                setActiveState('rajasthan');
                const bounds = e.currentTarget.getBoundingClientRect();
                handleStateHover('Rajasthan', bounds.left + bounds.width/2, bounds.top);
              }}
              onMouseLeave={() => {
                setActiveState(null);
                setTooltip({ ...tooltip, visible: false });
              }}
            />
            
            {/* Kerala (simplified) */}
            <path
              className={`state-path ${activeState === 'kerala' ? 'active' : ''}`}
              d="M250,450 L270,500 L240,550 L200,530 L190,480 Z"
              onClick={() => handleStateClick('kerala')}
              onMouseEnter={(e) => {
                setActiveState('kerala');
                const bounds = e.currentTarget.getBoundingClientRect();
                handleStateHover('Kerala', bounds.left + bounds.width/2, bounds.top);
              }}
              onMouseLeave={() => {
                setActiveState(null);
                setTooltip({ ...tooltip, visible: false });
              }}
            />
            
            {/* Tamil Nadu (simplified) */}
            <path
              className={`state-path ${activeState === 'tamilnadu' ? 'active' : ''}`}
              d="M280,500 L330,480 L350,520 L320,570 L270,550 Z"
              onClick={() => handleStateClick('tamilnadu')}
              onMouseEnter={(e) => {
                setActiveState('tamilnadu');
                const bounds = e.currentTarget.getBoundingClientRect();
                handleStateHover('Tamil Nadu', bounds.left + bounds.width/2, bounds.top);
              }}
              onMouseLeave={() => {
                setActiveState(null);
                setTooltip({ ...tooltip, visible: false });
              }}
            />
            
            {/* Add more states here */}
          </g>
        </svg>
        
        {/* Tooltip */}
        {tooltip.visible && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass absolute text-sm font-medium px-3 py-1.5 rounded-full shadow-lg text-foreground pointer-events-none"
            style={{
              left: tooltip.x,
              top: tooltip.y - 40,
              transform: 'translateX(-50%)',
            }}
          >
            {tooltip.content}
          </motion.div>
        )}
      </motion.div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {states.map((state) => (
          <motion.div
            key={state.id}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
            onClick={() => handleStateClick(state.id)}
          >
            <div className="h-40 overflow-hidden">
              <img 
                src={state.image} 
                alt={state.name} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-display font-semibold">{state.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{state.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Map;
