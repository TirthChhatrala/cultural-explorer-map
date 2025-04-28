
import React from 'react';
import { states } from '../data/states';
import { useTheme } from '../context/ThemeContext';

interface MapProps {
  onStateHover: (stateId: string | null) => void;
  onStateClick: (stateId: string) => void;
  hoveredState: string | null;
  activeState: string | null;
}

const Map: React.FC<MapProps> = ({
  onStateHover,
  onStateClick,
  hoveredState,
  activeState
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
        
        {/* States */}
        <g transform="scale(0.9) translate(25, 25)">
          {states.map((state) => (
            <path
              key={state.id}
              d={state.path}
              className={`transition-all duration-300 ease-in-out cursor-pointer ${
                hoveredState === state.id 
                  ? 'fill-india-orange stroke-white stroke-[1px]' 
                  : activeState === state.id 
                    ? 'fill-india-orange stroke-white stroke-[1px]'
                    : theme === 'dark' 
                      ? 'fill-india-orange/80 stroke-gray-300/50 stroke-[0.5px] hover:fill-india-orange hover:stroke-white'
                      : 'fill-india-orange/70 stroke-white/70 stroke-[0.5px] hover:fill-india-orange hover:stroke-white'
              }`}
              onMouseEnter={() => onStateHover(state.id)}
              onMouseLeave={() => onStateHover(null)}
              onClick={() => onStateClick(state.id)}
            />
          ))}
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
