
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';

const ManualIndiaMap = ({ interactive = true, showControls = true, showStateInfo = true }) => {
  const navigate = useNavigate();
  const [hoveredState, setHoveredState] = useState(null);

  const states = [
    { id: 'rajasthan', name: 'Rajasthan', x: 25, y: 35, popular: true },
    { id: 'gujarat', name: 'Gujarat', x: 20, y: 45, popular: true },
    { id: 'maharashtra', name: 'Maharashtra', x: 30, y: 55, popular: true },
    { id: 'kerala', name: 'Kerala', x: 32, y: 80, popular: true },
    { id: 'goa', name: 'Goa', x: 28, y: 65, popular: true },
    { id: 'uttarpradesh', name: 'Uttar Pradesh', x: 50, y: 40, popular: true },
    { id: 'delhi', name: 'Delhi', x: 45, y: 30, popular: true },
    { id: 'punjab', name: 'Punjab', x: 40, y: 25, popular: false },
    { id: 'haryana', name: 'Haryana', x: 45, y: 28, popular: false },
    { id: 'uttarakhand', name: 'Uttarakhand', x: 50, y: 25, popular: false },
    { id: 'himachalpradesh', name: 'Himachal Pradesh', x: 42, y: 20, popular: false },
    { id: 'jammu_kashmir', name: 'Jammu & Kashmir', x: 38, y: 15, popular: false },
    { id: 'bihar', name: 'Bihar', x: 58, y: 42, popular: false },
    { id: 'jharkhand', name: 'Jharkhand', x: 58, y: 48, popular: false },
    { id: 'westbengal', name: 'West Bengal', x: 62, y: 50, popular: false },
    { id: 'odisha', name: 'Odisha', x: 58, y: 55, popular: false },
    { id: 'chhattisgarh', name: 'Chhattisgarh', x: 52, y: 52, popular: false },
    { id: 'madhyapradesh', name: 'Madhya Pradesh', x: 45, y: 48, popular: false },
    { id: 'karnataka', name: 'Karnataka', x: 32, y: 68, popular: true },
    { id: 'tamilnadu', name: 'Tamil Nadu', x: 38, y: 75, popular: true },
    { id: 'andhrapradesh', name: 'Andhra Pradesh', x: 42, y: 65, popular: false },
    { id: 'telangana', name: 'Telangana', x: 42, y: 60, popular: false },
    { id: 'assam', name: 'Assam', x: 70, y: 45, popular: false },
    { id: 'meghalaya', name: 'Meghalaya', x: 68, y: 48, popular: false },
    { id: 'manipur', name: 'Manipur', x: 72, y: 52, popular: false },
    { id: 'mizoram', name: 'Mizoram', x: 70, y: 55, popular: false },
    { id: 'tripura', name: 'Tripura', x: 68, y: 52, popular: false },
    { id: 'nagaland', name: 'Nagaland', x: 72, y: 48, popular: false },
    { id: 'arunachalpradesh', name: 'Arunachal Pradesh', x: 74, y: 40, popular: false },
    { id: 'sikkim', name: 'Sikkim', x: 62, y: 38, popular: false },
  ];

  const handleStateClick = (stateId) => {
    if (interactive) {
      navigate(`/state/${stateId}`);
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-xl">
      <div className="relative w-full h-96 bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-gray-700 dark:to-gray-800 rounded-xl overflow-hidden border-2 border-india-orange/20">
        {/* Map Title */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <h3 className="text-xl font-bold text-india-orange bg-white/90 dark:bg-gray-800/90 px-4 py-2 rounded-full shadow-md">
            Interactive India Map
          </h3>
        </div>

        {/* States */}
        {states.map((state) => (
          <motion.div
            key={state.id}
            className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
              interactive ? 'hover:scale-110' : ''
            }`}
            style={{ left: `${state.x}%`, top: `${state.y}%` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: Math.random() * 0.5, duration: 0.3 }}
            whileHover={interactive ? { scale: 1.2, zIndex: 10 } : {}}
            onClick={() => handleStateClick(state.id)}
            onMouseEnter={() => setHoveredState(state)}
            onMouseLeave={() => setHoveredState(null)}
          >
            <div className={`relative ${
              state.popular 
                ? 'text-yellow-500' 
                : 'text-india-orange'
            }`}>
              {state.popular ? (
                <Star className="w-6 h-6 fill-current" />
              ) : (
                <MapPin className="w-5 h-5 fill-current" />
              )}
              <div className={`absolute top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-white dark:bg-gray-800 px-2 py-1 rounded shadow-lg text-xs font-medium transition-opacity ${
                hoveredState?.id === state.id ? 'opacity-100' : 'opacity-0'
              }`}>
                {state.name}
                {state.popular && (
                  <span className="ml-1 text-yellow-500">★</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Decorative Elements */}
        <div className="absolute bottom-4 right-4 text-xs text-gray-500 dark:text-gray-400">
          ★ Popular Destinations
        </div>
      </div>

      {showStateInfo && hoveredState && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
        >
          <h4 className="font-semibold text-india-orange">{hoveredState.name}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {hoveredState.popular ? 'Popular tourist destination' : 'Explore this beautiful state'}
          </p>
        </motion.div>
      )}

      {showControls && (
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => navigate('/political-parties')}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Political Parties
          </button>
          <button
            onClick={() => navigate('/freedom-fighters')}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          >
            Freedom Fighters
          </button>
          <button
            onClick={() => navigate('/festivals')}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
          >
            Festivals
          </button>
        </div>
      )}
    </div>
  );
};

export default ManualIndiaMap;
