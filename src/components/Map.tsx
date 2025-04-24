
import React from 'react';
import { states } from '../data/states';

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
  return (
    <svg
      viewBox="0 0 500 500"
      className="w-full h-full"
    >
      {states.map((state) => (
        <path
          key={state.id}
          d={state.path}
          className={`state-path ${
            hoveredState === state.id ? 'fill-india-orange' : ''
          } ${activeState === state.id ? 'active' : ''}`}
          onMouseEnter={() => onStateHover(state.id)}
          onMouseLeave={() => onStateHover(null)}
          onClick={() => onStateClick(state.id)}
        />
      ))}
    </svg>
  );
};

export default Map;
