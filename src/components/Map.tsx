
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { states } from '../data/states';
import { useTheme } from '../context/ThemeContext';

const Map = () => {
  const [activeState, setActiveState] = useState(null);
  const [tooltip, setTooltip] = useState({ visible: false, content: '', x: 0, y: 0 });
  const navigate = useNavigate();
  const { theme } = useTheme();

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
          viewBox="0 0 600 700" 
          className="w-full h-auto drop-shadow-xl"
          xmlSpace="preserve"
        >
          {/* More Accurate Map of India */}
          <g className="india-map">
            {/* Jammu and Kashmir */}
            <path
              className={`state-path ${activeState === 'jammukashmir' ? 'active' : ''}`}
              d="M195,85 L220,65 L255,60 L290,85 L265,105 L275,115 L255,135 L235,130 L220,145 L195,135 L205,115 L180,105 Z"
              onClick={() => handleStateClick('jammukashmir')}
              onMouseEnter={(e) => {
                setActiveState('jammukashmir');
                const bounds = e.currentTarget.getBoundingClientRect();
                handleStateHover('Jammu & Kashmir', bounds.left + bounds.width/2, bounds.top);
              }}
              onMouseLeave={() => {
                setActiveState(null);
                setTooltip({ ...tooltip, visible: false });
              }}
            />
            
            {/* Himachal Pradesh */}
            <path
              className={`state-path ${activeState === 'himachalpradesh' ? 'active' : ''}`}
              d="M220,145 L235,130 L255,135 L245,155 L225,165 L215,155 Z"
              onClick={() => handleStateClick('himachalpradesh')}
              onMouseEnter={(e) => {
                setActiveState('himachalpradesh');
                const bounds = e.currentTarget.getBoundingClientRect();
                handleStateHover('Himachal Pradesh', bounds.left + bounds.width/2, bounds.top);
              }}
              onMouseLeave={() => {
                setActiveState(null);
                setTooltip({ ...tooltip, visible: false });
              }}
            />
            
            {/* Punjab */}
            <path
              className={`state-path ${activeState === 'punjab' ? 'active' : ''}`}
              d="M195,135 L215,155 L195,165 L185,150 Z"
              onClick={() => handleStateClick('punjab')}
              onMouseEnter={(e) => {
                setActiveState('punjab');
                const bounds = e.currentTarget.getBoundingClientRect();
                handleStateHover('Punjab', bounds.left + bounds.width/2, bounds.top);
              }}
              onMouseLeave={() => {
                setActiveState(null);
                setTooltip({ ...tooltip, visible: false });
              }}
            />
            
            {/* Uttarakhand */}
            <path
              className={`state-path ${activeState === 'uttarakhand' ? 'active' : ''}`}
              d="M225,165 L245,155 L260,165 L250,180 L230,185 Z"
              onClick={() => handleStateClick('uttarakhand')}
              onMouseEnter={(e) => {
                setActiveState('uttarakhand');
                const bounds = e.currentTarget.getBoundingClientRect();
                handleStateHover('Uttarakhand', bounds.left + bounds.width/2, bounds.top);
              }}
              onMouseLeave={() => {
                setActiveState(null);
                setTooltip({ ...tooltip, visible: false });
              }}
            />
            
            {/* Haryana */}
            <path
              className={`state-path ${activeState === 'haryana' ? 'active' : ''}`}
              d="M195,165 L215,155 L225,165 L230,185 L210,190 L195,180 Z"
              onClick={() => handleStateClick('haryana')}
              onMouseEnter={(e) => {
                setActiveState('haryana');
                const bounds = e.currentTarget.getBoundingClientRect();
                handleStateHover('Haryana', bounds.left + bounds.width/2, bounds.top);
              }}
              onMouseLeave={() => {
                setActiveState(null);
                setTooltip({ ...tooltip, visible: false });
              }}
            />
            
            {/* Delhi */}
            <path
              className={`state-path ${activeState === 'delhi' ? 'active' : ''}`}
              d="M210,190 L214,195 L210,200 L205,195 Z"
              onClick={() => handleStateClick('delhi')}
              onMouseEnter={(e) => {
                setActiveState('delhi');
                const bounds = e.currentTarget.getBoundingClientRect();
                handleStateHover('Delhi', bounds.left + bounds.width/2, bounds.top);
              }}
              onMouseLeave={() => {
                setActiveState(null);
                setTooltip({ ...tooltip, visible: false });
              }}
            />
            
            {/* Rajasthan */}
            <path
              className={`state-path ${activeState === 'rajasthan' ? 'active' : ''}`}
              d="M115,220 L135,195 L185,150 L195,165 L195,180 L210,190 L205,195 L210,200 L205,210 L190,212 L180,240 L150,255 L135,250 L115,250 Z"
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
            
            {/* Uttar Pradesh */}
            <path
              className={`state-path ${activeState === 'uttarpradesh' ? 'active' : ''}`}
              d="M230,185 L250,180 L275,188 L290,210 L285,235 L255,235 L240,245 L205,210 L210,200 L214,195 L210,190 Z"
              onClick={() => handleStateClick('uttarpradesh')}
              onMouseEnter={(e) => {
                setActiveState('uttarpradesh');
                const bounds = e.currentTarget.getBoundingClientRect();
                handleStateHover('Uttar Pradesh', bounds.left + bounds.width/2, bounds.top);
              }}
              onMouseLeave={() => {
                setActiveState(null);
                setTooltip({ ...tooltip, visible: false });
              }}
            />
            
            {/* Bihar */}
            <path
              className={`state-path ${activeState === 'bihar' ? 'active' : ''}`}
              d="M285,235 L320,230 L330,250 L300,265 L255,235 Z"
              onClick={() => handleStateClick('bihar')}
              onMouseEnter={(e) => {
                setActiveState('bihar');
                const bounds = e.currentTarget.getBoundingClientRect();
                handleStateHover('Bihar', bounds.left + bounds.width/2, bounds.top);
              }}
              onMouseLeave={() => {
                setActiveState(null);
                setTooltip({ ...tooltip, visible: false });
              }}
            />
            
            {/* Sikkim */}
            <path
              className={`state-path ${activeState === 'sikkim' ? 'active' : ''}`}
              d="M320,210 L325,215 L320,225 L315,220 Z"
              onClick={() => handleStateClick('sikkim')}
              onMouseEnter={(e) => {
                setActiveState('sikkim');
                const bounds = e.currentTarget.getBoundingClientRect();
                handleStateHover('Sikkim', bounds.left + bounds.width/2, bounds.top);
              }}
              onMouseLeave={() => {
                setActiveState(null);
                setTooltip({ ...tooltip, visible: false });
              }}
            />
            
            {/* West Bengal */}
            <path
              className={`state-path ${activeState === 'westbengal' ? 'active' : ''}`}
              d="M320,225 L325,215 L345,215 L350,255 L325,300 L315,280 L330,250 Z"
              onClick={() => handleStateClick('westbengal')}
              onMouseEnter={(e) => {
                setActiveState('westbengal');
                const bounds = e.currentTarget.getBoundingClientRect();
                handleStateHover('West Bengal', bounds.left + bounds.width/2, bounds.top);
              }}
              onMouseLeave={() => {
                setActiveState(null);
                setTooltip({ ...tooltip, visible: false });
              }}
            />
            
            {/* Gujarat */}
            <path
              className={`state-path ${activeState === 'gujarat' ? 'active' : ''}`}
              d="M115,220 L115,250 L135,250 L120,275 L95,300 L80,300 L75,280 L87,240 Z"
              onClick={() => handleStateClick('gujarat')}
              onMouseEnter={(e) => {
                setActiveState('gujarat');
                const bounds = e.currentTarget.getBoundingClientRect();
                handleStateHover('Gujarat', bounds.left + bounds.width/2, bounds.top);
              }}
              onMouseLeave={() => {
                setActiveState(null);
                setTooltip({ ...tooltip, visible: false });
              }}
            />
            
            {/* Madhya Pradesh */}
            <path
              className={`state-path ${activeState === 'madhyapradesh' ? 'active' : ''}`}
              d="M150,255 L180,240 L190,212 L205,210 L240,245 L255,235 L255,295 L215,335 L175,290 L150,280 Z"
              onClick={() => handleStateClick('madhyapradesh')}
              onMouseEnter={(e) => {
                setActiveState('madhyapradesh');
                const bounds = e.currentTarget.getBoundingClientRect();
                handleStateHover('Madhya Pradesh', bounds.left + bounds.width/2, bounds.top);
              }}
              onMouseLeave={() => {
                setActiveState(null);
                setTooltip({ ...tooltip, visible: false });
              }}
            />
            
            {/* Jharkhand */}
            <path
              className={`state-path ${activeState === 'jharkhand' ? 'active' : ''}`}
              d="M255,235 L300,265 L290,290 L255,295 Z"
              onClick={() => handleStateClick('jharkhand')}
              onMouseEnter={(e) => {
                setActiveState('jharkhand');
                const bounds = e.currentTarget.getBoundingClientRect();
                handleStateHover('Jharkhand', bounds.left + bounds.width/2, bounds.top);
              }}
              onMouseLeave={() => {
                setActiveState(null);
                setTooltip({ ...tooltip, visible: false });
              }}
            />
            
            {/* Chattisgarh */}
            <path
              className={`state-path ${activeState === 'chattisgarh' ? 'active' : ''}`}
              d="M255,295 L290,290 L280,335 L255,360 L215,335 Z"
              onClick={() => handleStateClick('chattisgarh')}
              onMouseEnter={(e) => {
                setActiveState('chattisgarh');
                const bounds = e.currentTarget.getBoundingClientRect();
                handleStateHover('Chattisgarh', bounds.left + bounds.width/2, bounds.top);
              }}
              onMouseLeave={() => {
                setActiveState(null);
                setTooltip({ ...tooltip, visible: false });
              }}
            />
            
            {/* Maharashtra */}
            <path
              className={`state-path ${activeState === 'maharashtra' ? 'active' : ''}`}
              d="M120,275 L150,280 L175,290 L215,335 L175,375 L135,365 L80,350 L95,300 Z"
              onClick={() => handleStateClick('maharashtra')}
              onMouseEnter={(e) => {
                setActiveState('maharashtra');
                const bounds = e.currentTarget.getBoundingClientRect();
                handleStateHover('Maharashtra', bounds.left + bounds.width/2, bounds.top);
              }}
              onMouseLeave={() => {
                setActiveState(null);
                setTooltip({ ...tooltip, visible: false });
              }}
            />
            
            {/* Odisha */}
            <path
              className={`state-path ${activeState === 'odisha' ? 'active' : ''}`}
              d="M255,360 L280,335 L290,290 L315,280 L325,300 L310,350 L255,380 Z"
              onClick={() => handleStateClick('odisha')}
              onMouseEnter={(e) => {
                setActiveState('odisha');
                const bounds = e.currentTarget.getBoundingClientRect();
                handleStateHover('Odisha', bounds.left + bounds.width/2, bounds.top);
              }}
              onMouseLeave={() => {
                setActiveState(null);
                setTooltip({ ...tooltip, visible: false });
              }}
            />
            
            {/* Telangana */}
            <path
              className={`state-path ${activeState === 'telangana' ? 'active' : ''}`}
              d="M175,375 L215,335 L255,360 L255,380 L230,415 L175,415 Z"
              onClick={() => handleStateClick('telangana')}
              onMouseEnter={(e) => {
                setActiveState('telangana');
                const bounds = e.currentTarget.getBoundingClientRect();
                handleStateHover('Telangana', bounds.left + bounds.width/2, bounds.top);
              }}
              onMouseLeave={() => {
                setActiveState(null);
                setTooltip({ ...tooltip, visible: false });
              }}
            />
            
            {/* Andhra Pradesh */}
            <path
              className={`state-path ${activeState === 'andhrapradesh' ? 'active' : ''}`}
              d="M175,415 L230,415 L255,380 L310,350 L295,430 L240,465 L190,455 Z"
              onClick={() => handleStateClick('andhrapradesh')}
              onMouseEnter={(e) => {
                setActiveState('andhrapradesh');
                const bounds = e.currentTarget.getBoundingClientRect();
                handleStateHover('Andhra Pradesh', bounds.left + bounds.width/2, bounds.top);
              }}
              onMouseLeave={() => {
                setActiveState(null);
                setTooltip({ ...tooltip, visible: false });
              }}
            />
            
            {/* Karnataka */}
            <path
              className={`state-path ${activeState === 'karnataka' ? 'active' : ''}`}
              d="M135,365 L175,375 L175,415 L190,455 L160,490 L120,470 L110,430 Z"
              onClick={() => handleStateClick('karnataka')}
              onMouseEnter={(e) => {
                setActiveState('karnataka');
                const bounds = e.currentTarget.getBoundingClientRect();
                handleStateHover('Karnataka', bounds.left + bounds.width/2, bounds.top);
              }}
              onMouseLeave={() => {
                setActiveState(null);
                setTooltip({ ...tooltip, visible: false });
              }}
            />
            
            {/* Tamil Nadu */}
            <path
              className={`state-path ${activeState === 'tamilnadu' ? 'active' : ''}`}
              d="M190,455 L240,465 L235,535 L195,570 L155,515 L160,490 Z"
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
            
            {/* Kerala */}
            <path
              className={`state-path ${activeState === 'kerala' ? 'active' : ''}`}
              d="M120,470 L160,490 L155,515 L130,550 L105,505 Z"
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
            
            {/* Goa */}
            <path
              className={`state-path ${activeState === 'goa' ? 'active' : ''}`}
              d="M110,430 L120,435 L115,445 L105,435 Z"
              onClick={() => handleStateClick('goa')}
              onMouseEnter={(e) => {
                setActiveState('goa');
                const bounds = e.currentTarget.getBoundingClientRect();
                handleStateHover('Goa', bounds.left + bounds.width/2, bounds.top);
              }}
              onMouseLeave={() => {
                setActiveState(null);
                setTooltip({ ...tooltip, visible: false });
              }}
            />
            
            {/* Northeast States */}
            <path
              className={`state-path ${activeState === 'arunachalpradesh' ? 'active' : ''}`}
              d="M380,195 L415,190 L430,200 L395,215 L380,210 Z"
              onClick={() => handleStateClick('arunachalpradesh')}
              onMouseEnter={(e) => {
                setActiveState('arunachalpradesh');
                const bounds = e.currentTarget.getBoundingClientRect();
                handleStateHover('Arunachal Pradesh', bounds.left + bounds.width/2, bounds.top);
              }}
              onMouseLeave={() => {
                setActiveState(null);
                setTooltip({ ...tooltip, visible: false });
              }}
            />
            
            <path
              className={`state-path ${activeState === 'assam' ? 'active' : ''}`}
              d="M380,210 L395,215 L430,200 L435,225 L380,255 L345,215 Z"
              onClick={() => handleStateClick('assam')}
              onMouseEnter={(e) => {
                setActiveState('assam');
                const bounds = e.currentTarget.getBoundingClientRect();
                handleStateHover('Assam', bounds.left + bounds.width/2, bounds.top);
              }}
              onMouseLeave={() => {
                setActiveState(null);
                setTooltip({ ...tooltip, visible: false });
              }}
            />
            
            <path
              className={`state-path ${activeState === 'manipur' ? 'active' : ''}`}
              d="M425,255 L435,225 L445,240 L430,260 Z"
              onClick={() => handleStateClick('manipur')}
              onMouseEnter={(e) => {
                setActiveState('manipur');
                const bounds = e.currentTarget.getBoundingClientRect();
                handleStateHover('Manipur', bounds.left + bounds.width/2, bounds.top);
              }}
              onMouseLeave={() => {
                setActiveState(null);
                setTooltip({ ...tooltip, visible: false });
              }}
            />

            {/* Add other northeastern states like Meghalaya, Mizoram, Nagaland, Tripura */}
            <path
              className={`state-path ${activeState === 'meghalaya' ? 'active' : ''}`}
              d="M380,255 L415,255 L415,265 L380,265 Z"
              onClick={() => handleStateClick('meghalaya')}
              onMouseEnter={(e) => {
                setActiveState('meghalaya');
                const bounds = e.currentTarget.getBoundingClientRect();
                handleStateHover('Meghalaya', bounds.left + bounds.width/2, bounds.top);
              }}
              onMouseLeave={() => {
                setActiveState(null);
                setTooltip({ ...tooltip, visible: false });
              }}
            />
            
            <path
              className={`state-path ${activeState === 'tripura' ? 'active' : ''}`}
              d="M415,265 L425,265 L425,285 L415,285 Z"
              onClick={() => handleStateClick('tripura')}
              onMouseEnter={(e) => {
                setActiveState('tripura');
                const bounds = e.currentTarget.getBoundingClientRect();
                handleStateHover('Tripura', bounds.left + bounds.width/2, bounds.top);
              }}
              onMouseLeave={() => {
                setActiveState(null);
                setTooltip({ ...tooltip, visible: false });
              }}
            />
            
            <path
              className={`state-path ${activeState === 'mizoram' ? 'active' : ''}`}
              d="M425,285 L440,285 L440,305 L425,305 Z"
              onClick={() => handleStateClick('mizoram')}
              onMouseEnter={(e) => {
                setActiveState('mizoram');
                const bounds = e.currentTarget.getBoundingClientRect();
                handleStateHover('Mizoram', bounds.left + bounds.width/2, bounds.top);
              }}
              onMouseLeave={() => {
                setActiveState(null);
                setTooltip({ ...tooltip, visible: false });
              }}
            />
            
            <path
              className={`state-path ${activeState === 'nagaland' ? 'active' : ''}`}
              d="M430,240 L445,240 L445,260 L430,260 Z"
              onClick={() => handleStateClick('nagaland')}
              onMouseEnter={(e) => {
                setActiveState('nagaland');
                const bounds = e.currentTarget.getBoundingClientRect();
                handleStateHover('Nagaland', bounds.left + bounds.width/2, bounds.top);
              }}
              onMouseLeave={() => {
                setActiveState(null);
                setTooltip({ ...tooltip, visible: false });
              }}
            />
          </g>
        </svg>
        
        {/* Tooltip */}
        {tooltip.visible && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass absolute text-sm font-medium px-3 py-1.5 rounded-full shadow-lg pointer-events-none ${
              theme === 'dark' ? 'text-white' : 'text-foreground'
            }`}
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
            className={`rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
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
