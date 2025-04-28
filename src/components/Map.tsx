
import React from 'react';
import { states } from '../data/states';
import { useTheme } from '../context/ThemeContext';

interface MapProps {
  onStateHover: (stateId: string) => void;
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
    <svg
      viewBox="0 0 500 500"
      className="w-full h-full"
      style={{
        maxWidth: '100%',
        height: 'auto'
      }}
    >
      {/* Background */}
      <rect
        x="0"
        y="0"
        width="500"
        height="500"
        fill={theme === 'dark' ? '#1f2937' : '#f8fafc'}
        opacity="0.2"
      />
      
      {/* Border */}
      <rect
        x="1"
        y="1"
        width="498"
        height="498"
        fill="none"
        stroke={theme === 'dark' ? '#4b5563' : '#e2e8f0'}
        strokeWidth="2"
      />
      
      {/* States */}
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
                  ? 'fill-india-orange/80 stroke-gray-300 stroke-[0.5px] hover:fill-india-orange hover:stroke-white'
                  : 'fill-india-orange/70 stroke-white stroke-[0.5px] hover:fill-india-orange hover:stroke-white'
          }`}
          onMouseEnter={() => onStateHover(state.id)}
          onMouseLeave={() => onStateHover(null)}
          onClick={() => onStateClick(state.id)}
          transform="scale(0.9) translate(25, 25)"
        />
      ))}
    </svg>
  );
};

export default Map;
