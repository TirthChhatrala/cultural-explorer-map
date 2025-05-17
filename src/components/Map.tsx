
import React from 'react';
import { states } from '../data/states';
import { useTheme } from '../context/ThemeContext';
import { Route, Navigation } from 'lucide-react';

// Extend the State type to include centroids for route visualization
interface State {
  id: string;
  name: string;
  path: string;
  centroid?: {
    x: number;
    y: number;
  };
}

interface MapProps {
  onStateHover: (stateId: string | null) => void;
  onStateClick: (stateId: string) => void;
  hoveredState: string | null;
  activeState: string | null;
  selectedStates?: string[];
  showRoutes?: boolean;
}

const Map: React.FC<MapProps> = ({
  onStateHover,
  onStateClick,
  hoveredState,
  activeState,
  selectedStates = [],
  showRoutes = false
}) => {
  const { theme } = useTheme();
  
  // Generate route paths between selected states
  const renderRoutes = () => {
    if (!showRoutes || selectedStates.length < 2) return null;
    
    const routes = [];
    
    // Get centroids for selected states
    const stateCentroids = selectedStates.map(stateId => {
      const state = states.find(s => s.id === stateId) as State | undefined;
      if (!state || !state.centroid) return null;
      return { id: stateId, x: state.centroid.x, y: state.centroid.y };
    }).filter(Boolean);
    
    // Create routes between consecutive states
    for (let i = 0; i < stateCentroids.length - 1; i++) {
      const start = stateCentroids[i];
      const end = stateCentroids[i + 1];
      
      if (start && end) {
        // Create a slightly curved path for visual appeal
        const midX = (start.x + end.x) / 2;
        const midY = (start.y + end.y) / 2 - 10; // Offset for curve
        
        const pathData = `M${start.x},${start.y} Q${midX},${midY} ${end.x},${end.y}`;
        
        routes.push(
          <g key={`route-${start.id}-${end.id}`}>
            <path
              d={pathData}
              fill="none"
              stroke={theme === 'dark' ? '#e5e7eb' : '#374151'}
              strokeWidth="2"
              strokeDasharray="5,3"
              className="animate-pulse"
            />
            <circle cx={start.x} cy={start.y} r="3" fill={theme === 'dark' ? '#e5e7eb' : '#374151'} />
            <circle cx={end.x} cy={end.y} r="3" fill={theme === 'dark' ? '#e5e7eb' : '#374151'} />
          </g>
        );
      }
    }
    
    return routes;
  };
  
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
          
          {/* Route indicator marker */}
          <marker
            id="routeArrow"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="4"
            markerHeight="4"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={theme === 'dark' ? '#e5e7eb' : '#374151'} />
          </marker>
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
          
          {/* Render route paths */}
          {renderRoutes()}
        </g>
        
        {/* Legend */}
        <g transform="translate(10, 440)">
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
          
          {showRoutes && selectedStates.length >= 2 && (
            <g transform="translate(0, 20)">
              <line
                x1="0"
                y1="6"
                x2="12"
                y2="6"
                stroke={theme === 'dark' ? '#e5e7eb' : '#374151'}
                strokeWidth="2"
                strokeDasharray="5,3"
              />
              <text
                x="18"
                y="10"
                fontSize="10"
                fill={theme === 'dark' ? '#ffffff' : '#000000'}
                style={{ fontFamily: 'sans-serif' }}
              >
                Recommended Route
              </text>
            </g>
          )}
        </g>
        
        {/* Route information */}
        {showRoutes && selectedStates.length >= 2 && (
          <g transform="translate(380, 450)">
            <rect
              x="-10"
              y="-10"
              width="120"
              height="50"
              rx="5"
              ry="5"
              fill={theme === 'dark' ? 'rgba(31,41,55,0.7)' : 'rgba(255,255,255,0.7)'}
              stroke={theme === 'dark' ? '#374151' : '#e2e8f0'}
              strokeWidth="1"
            />
            <Route size={16} x="-5" y="0" color={theme === 'dark' ? '#ffffff' : '#000000'} />
            <text
              x="15"
              y="4"
              fontSize="10"
              fill={theme === 'dark' ? '#ffffff' : '#000000'}
              style={{ fontFamily: 'sans-serif' }}
            >
              {selectedStates.length - 1} Stops
            </text>
            <Navigation size={16} x="-5" y="20" color={theme === 'dark' ? '#ffffff' : '#000000'} />
            <text
              x="15"
              y="24"
              fontSize="10"
              fill={theme === 'dark' ? '#ffffff' : '#000000'}
              style={{ fontFamily: 'sans-serif' }}
            >
              {(selectedStates.length - 1) * 500} km (approx)
            </text>
          </g>
        )}
        
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
