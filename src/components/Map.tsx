
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
          viewBox="0 0 450 500" 
          className="w-full h-auto drop-shadow-xl"
        >
          {/* Accurate Map of India */}
          <g className="india-map">
            {/* Jammu and Kashmir */}
            <path
              className={`state-path ${activeState === 'jammukashmir' ? 'active' : ''}`}
              d="M148,63 L167,52 L190,50 L213,67 L196,81 L204,88 L189,102 L175,98 L162,110 L145,102 L152,86 L136,80 Z"
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
              d="M162,110 L175,98 L189,102 L182,116 L166,125 L155,118 Z"
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
              d="M145,102 L162,110 L155,118 L145,120 L138,113 Z"
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
              d="M166,125 L182,116 L192,123 L185,135 L170,138 Z"
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
              d="M145,120 L155,118 L166,125 L170,138 L155,143 L145,135 Z"
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
              d="M155,143 L158,146 L155,149 L152,146 Z"
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
              d="M85,165 L100,145 L138,113 L145,120 L145,135 L155,143 L152,146 L155,149 L153,156 L140,157 L132,180 L111,191 L100,185 L85,185 Z"
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
              d="M170,138 L185,135 L205,140 L215,155 L213,175 L190,175 L180,182 L153,156 L155,149 L158,146 L155,143 Z"
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
              d="M213,175 L240,170 L245,185 L225,195 L190,175 Z"
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
              d="M240,155 L245,160 L240,170 L235,165 Z"
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
              d="M240,170 L245,160 L260,160 L262,190 L245,225 L235,210 L245,185 Z"
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
              d="M85,165 L85,185 L100,185 L90,205 L72,225 L60,225 L55,210 L65,180 Z"
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
              d="M111,191 L132,180 L140,157 L153,156 L180,182 L190,175 L190,220 L160,250 L130,215 L110,208 Z"
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
              d="M190,175 L225,195 L220,215 L190,220 Z"
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
              d="M190,220 L220,215 L210,250 L190,270 L160,250 Z"
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
              d="M90,205 L110,208 L130,215 L160,250 L130,280 L100,270 L60,260 L72,225 Z"
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
              d="M190,270 L210,250 L220,215 L235,210 L245,225 L230,260 L190,285 Z"
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
              d="M130,280 L160,250 L190,270 L190,285 L170,310 L130,310 Z"
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
              d="M130,310 L170,310 L190,285 L230,260 L220,320 L180,350 L140,340 Z"
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
              d="M100,270 L130,280 L130,310 L140,340 L120,365 L90,350 L80,320 Z"
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
              d="M140,340 L180,350 L175,400 L145,425 L115,385 L120,365 Z"
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
              d="M90,350 L120,365 L115,385 L95,410 L80,375 Z"
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
              d="M80,320 L90,325 L85,330 L75,325 Z"
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
              d="M280,145 L310,140 L320,150 L290,160 L275,155 Z"
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
              d="M275,155 L290,160 L320,150 L325,170 L280,190 L260,160 Z"
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
              d="M315,190 L325,170 L330,180 L320,195 Z"
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
