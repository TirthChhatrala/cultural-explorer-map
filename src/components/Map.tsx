
import React from 'react';
import { states } from '../data/states';
import { useTheme } from '../context/ThemeContext';

interface MapProps {
  onStateHover: (stateId: string | null) => void;
  onStateClick: (stateId: string) => void;
  hoveredState: string | null;
  activeState: string | null;
  selectedStates?: string[];
}

const Map: React.FC<MapProps> = ({
  onStateHover,
  onStateClick,
  hoveredState,
  activeState,
  selectedStates = []
}) => {
  const { theme } = useTheme();
  
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        viewBox="0 0 500 500"
        className="w-full h-full"
        style={{
          maxWidth: '100%',
          height: 'auto',
          filter: theme === 'dark' ? 'brightness(0.8)' : 'none'
        }}
      >
        {/* Background with gradient */}
        <defs>
          <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: theme === 'dark' ? '#1f2937' : '#f8fafc', stopOpacity: 0.2 }} />
            <stop offset="100%" style={{ stopColor: theme === 'dark' ? '#111827' : '#f1f5f9', stopOpacity: 0.2 }} />
          </linearGradient>
          
          {/* Added pattern for selected states */}
          <pattern id="selectedPattern" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)">
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="10"
              stroke={theme === 'dark' ? "#ffffff" : "#000000"}
              strokeWidth="1"
              strokeOpacity="0.1"
            />
          </pattern>
        </defs>
        
        <rect
          x="0"
          y="0"
          width="500"
          height="500"
          fill="url(#mapGradient)"
        />
        
        {/* Border with rounded corners */}
        <rect
          x="1"
          y="1"
          width="498"
          height="498"
          fill="none"
          stroke={theme === 'dark' ? '#374151' : '#e2e8f0'}
          strokeWidth="2"
          rx="8"
          ry="8"
        />
        
        {/* Map title */}
        <text
          x="250"
          y="25"
          textAnchor="middle"
          className="text-lg font-semibold"
          fill={theme === 'dark' ? '#ffffff' : '#000000'}
          style={{ fontFamily: 'sans-serif' }}
        >
          India
        </text>
        
        {/* States */}
        <g transform="scale(0.9) translate(25, 25)">
          {states.map((state) => {
            // Determine the fill color based on hover, active, or selected state
            const isSelected = selectedStates.includes(state.id);
            const isHovered = hoveredState === state.id;
            const isActive = activeState === state.id;
            
            let fillColor = theme === 'dark' 
              ? 'fill-india-orange/80' 
              : 'fill-india-orange/70';
              
            let strokeColor = theme === 'dark'
              ? 'stroke-gray-300/50'
              : 'stroke-white/70';
              
            let strokeWidth = 'stroke-[0.5px]';
            
            if (isSelected) {
              fillColor = 'fill-india-orange';
              strokeColor = 'stroke-white';
              strokeWidth = 'stroke-[1px]';
            } else if (isHovered) {
              fillColor = 'fill-india-orange';
              strokeColor = 'stroke-white';
              strokeWidth = 'stroke-[1px]';
            } else if (isActive) {
              fillColor = 'fill-india-orange';
              strokeColor = 'stroke-white';
              strokeWidth = 'stroke-[1px]';
            }
            
            return (
              <path
                key={state.id}
                d={state.path}
                className={`transition-all duration-300 ease-in-out cursor-pointer ${
                  fillColor
                } ${strokeColor} ${strokeWidth} hover:fill-india-orange hover:stroke-white`}
                onMouseEnter={() => onStateHover(state.id)}
                onMouseLeave={() => onStateHover(null)}
                onClick={() => onStateClick(state.id)}
                style={isSelected ? { fill: 'url(#selectedPattern)'} : {}}
              />
            );
          })}
        </g>
        
        {/* Legend */}
        <g transform="translate(10, 470)">
          <rect
            x="0"
            y="0"
            width="12"
            height="12"
            fill="url(#selectedPattern)"
            stroke={theme === 'dark' ? '#374151' : '#e2e8f0'}
            strokeWidth="1"
            className="fill-india-orange"
          />
          <text
            x="18"
            y="10"
            fontSize="10"
            fill={theme === 'dark' ? '#ffffff' : '#000000'}
            style={{ fontFamily: 'sans-serif' }}
          >
            Selected States
          </text>
        </g>
        
        {/* Map overlay for depth effect */}
        <rect
          x="0"
          y="0"
          width="500"
          height="500"
          fill={theme === 'dark' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}
          className="pointer-events-none"
        />
      </svg>
    </div>
  );
};

export default Map;
