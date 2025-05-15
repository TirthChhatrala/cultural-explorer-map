
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Map from './Map';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { states } from '../data/states';
import { Plus, Minus, MapPin, Map as MapIcon, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface EnhancedMapProps {
  onStateSelect?: (stateId: string) => void;
  selectedStates?: string[];
  interactive?: boolean;
  showControls?: boolean;
  showStateInfo?: boolean;
}

const EnhancedMap: React.FC<EnhancedMapProps> = ({
  onStateSelect,
  selectedStates = [],
  interactive = true,
  showControls = true,
  showStateInfo = true
}) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [activeState, setActiveState] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // State facts for tooltips
  const stateFacts: Record<string, string> = {
    'andhra_pradesh': 'Known for its rich cultural heritage and delicious cuisine.',
    'arunachal_pradesh': 'Home to diverse tribal cultures and stunning mountain landscapes.',
    'assam': 'Famous for tea plantations and the mighty Brahmaputra river.',
    'bihar': 'Ancient center of learning and home to important Buddhist sites.',
    'chhattisgarh': 'Rich in tribal culture and natural resources.',
    'goa': 'Known for beautiful beaches, Portuguese influence, and vibrant nightlife.',
    'gujarat': 'Birthplace of Mahatma Gandhi with rich textiles and business culture.',
    'haryana': 'Agricultural heartland and hub of automobile industry.',
    'himachal_pradesh': 'Known for apple orchards and scenic hill stations.',
    'jammu_kashmir': 'Known as "Paradise on Earth" with breathtaking landscapes.',
    'jharkhand': 'Rich in minerals and tribal culture.',
    'karnataka': 'Home to the IT hub Bangalore and historical sites of Hampi.',
    'kerala': 'Known as "God's Own Country" with beautiful backwaters and beaches.',
    'madhya_pradesh': 'Heart of India with ancient temples and tiger reserves.',
    'maharashtra': 'Home to Mumbai and has a rich Maratha heritage.',
    'manipur': 'Known for classical dance forms and the unique Loktak Lake.',
    'meghalaya': 'Known as "Abode of Clouds" with living root bridges.',
    'mizoram': 'Land of rolling hills and valleys with vibrant tribal culture.',
    'nagaland': 'Known for the Hornbill Festival and tribal diversity.',
    'odisha': 'Famous for ancient temples and classical dance forms.',
    'punjab': 'Land of five rivers with rich agriculture and vibrant culture.',
    'rajasthan': 'Land of kings with magnificent forts and colorful culture.',
    'sikkim': 'Nestled in the Himalayas with stunning mountain views.',
    'tamil_nadu': 'Rich in Dravidian culture and ancient temples.',
    'telangana': 'Known for the historic city of Hyderabad and Biryani.',
    'tripura': 'Known for its diverse tribal culture and handloom textiles.',
    'uttar_pradesh': 'Home to the Taj Mahal and important religious sites.',
    'uttarakhand': 'Known as "Land of Gods" with Himalayan pilgrimage sites.',
    'west_bengal': 'Known for Kolkata, Durga Puja, and Bengali culture.'
  };

  const handleStateHover = useCallback((stateId: string | null) => {
    if (!isDragging && interactive) {
      setHoveredState(stateId);
    }
  }, [isDragging, interactive]);

  const handleStateClick = useCallback((stateId: string) => {
    if (!isDragging && interactive) {
      setActiveState(stateId);
      if (onStateSelect) {
        onStateSelect(stateId);
      } else {
        navigate(`/state/${stateId}`);
      }
    }
  }, [isDragging, interactive, navigate, onStateSelect]);

  const handleZoomIn = () => {
    if (scale < 2) setScale(prev => prev + 0.1);
  };

  const handleZoomOut = () => {
    if (scale > 0.6) setScale(prev => prev - 0.1);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (interactive && showControls) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && interactive && showControls) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`${
          theme === 'dark' 
            ? 'bg-gray-800/80 border-gray-700' 
            : 'bg-white/80 border-gray-200'
          } rounded-2xl border overflow-hidden backdrop-blur-sm shadow-xl`}
      >
        <div 
          className="relative aspect-square cursor-grab"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <div 
            style={{ 
              transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`, 
              transformOrigin: 'center',
              transition: isDragging ? 'none' : 'transform 0.3s ease-out'
            }}
          >
            <Map
              onStateHover={handleStateHover}
              onStateClick={handleStateClick}
              hoveredState={hoveredState}
              activeState={selectedStates.length ? null : activeState}
              selectedStates={selectedStates}
            />
          </div>
          
          {showControls && (
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <Button 
                size="icon"
                variant="secondary"
                onClick={handleZoomIn}
                className={`rounded-full shadow-md ${
                  theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'
                }`}
                aria-label="Zoom in"
              >
                <Plus size={18} />
              </Button>
              <Button 
                size="icon"
                variant="secondary"
                onClick={handleZoomOut}
                className={`rounded-full shadow-md ${
                  theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'
                }`}
                aria-label="Zoom out"
              >
                <Minus size={18} />
              </Button>
              <Button 
                size="icon"
                variant="secondary"
                onClick={handleReset}
                className={`rounded-full shadow-md ${
                  theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'
                }`}
                aria-label="Reset view"
              >
                <MapIcon size={18} />
              </Button>
            </div>
          )}
          
          {showStateInfo && (
            <div className="absolute bottom-4 left-4 right-4">
              <AnimatePresence>
                {hoveredState && (
                  <motion.div
                    key={hoveredState}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className={`p-4 rounded-lg ${
                      theme === 'dark' 
                        ? 'bg-gray-800/90 border-gray-700' 
                        : 'bg-white/90 border-gray-200'
                      } border backdrop-blur-sm shadow-lg`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <MapPin className="text-india-orange" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">
                          {states.find(state => state.id === hoveredState)?.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {stateFacts[hoveredState] || 
                           "Click to explore more about this state"}
                        </p>
                        <div className="flex gap-2">
                          {selectedStates.length > 0 ? (
                            <Button 
                              size="sm" 
                              variant={selectedStates.includes(hoveredState) ? "destructive" : "default"}
                              className={selectedStates.includes(hoveredState) ? "" : "bg-india-orange hover:bg-india-orange/90 text-white"}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStateClick(hoveredState);
                              }}
                            >
                              {selectedStates.includes(hoveredState) ? "Remove from Trip" : "Add to Trip"}
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="bg-india-orange/10 border-india-orange/20 text-india-orange hover:bg-india-orange/20"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/state/${hoveredState}`);
                              }}
                            >
                              Explore State
                            </Button>
                          )}
                          
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="gap-1"
                              >
                                <Info size={14} />
                                Quick Facts
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-4 pointer-events-auto">
                              <h3 className="font-medium mb-2">
                                {states.find(state => state.id === hoveredState)?.name} Facts
                              </h3>
                              <ul className="text-sm space-y-1">
                                <li>• Capital: {getStateCapital(hoveredState)}</li>
                                <li>• Official Language: {getStateLanguage(hoveredState)}</li>
                                <li>• Popular Cuisine: {getStateCuisine(hoveredState)}</li>
                                <li>• Famous For: {getStateFamousFor(hoveredState)}</li>
                              </ul>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          
          <div className="absolute bottom-4 right-4">
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {Math.round(scale * 100)}%
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Helper functions for state information
const getStateCapital = (stateId: string): string => {
  const capitals: Record<string, string> = {
    'andhra_pradesh': 'Amaravati',
    'arunachal_pradesh': 'Itanagar',
    'assam': 'Dispur',
    'bihar': 'Patna',
    'chhattisgarh': 'Raipur',
    'goa': 'Panaji',
    'gujarat': 'Gandhinagar',
    'haryana': 'Chandigarh',
    'himachal_pradesh': 'Shimla',
    'jammu_kashmir': 'Srinagar (Summer) & Jammu (Winter)',
    'jharkhand': 'Ranchi',
    'karnataka': 'Bengaluru',
    'kerala': 'Thiruvananthapuram',
    'madhya_pradesh': 'Bhopal',
    'maharashtra': 'Mumbai',
    'manipur': 'Imphal',
    'meghalaya': 'Shillong',
    'mizoram': 'Aizawl',
    'nagaland': 'Kohima',
    'odisha': 'Bhubaneswar',
    'punjab': 'Chandigarh',
    'rajasthan': 'Jaipur',
    'sikkim': 'Gangtok',
    'tamil_nadu': 'Chennai',
    'telangana': 'Hyderabad',
    'tripura': 'Agartala',
    'uttar_pradesh': 'Lucknow',
    'uttarakhand': 'Dehradun',
    'west_bengal': 'Kolkata'
  };
  
  return capitals[stateId] || 'Unknown';
};

const getStateLanguage = (stateId: string): string => {
  const languages: Record<string, string> = {
    'andhra_pradesh': 'Telugu',
    'arunachal_pradesh': 'English',
    'assam': 'Assamese',
    'bihar': 'Hindi',
    'chhattisgarh': 'Hindi',
    'goa': 'Konkani',
    'gujarat': 'Gujarati',
    'haryana': 'Hindi',
    'himachal_pradesh': 'Hindi',
    'jammu_kashmir': 'Urdu, Kashmiri',
    'jharkhand': 'Hindi',
    'karnataka': 'Kannada',
    'kerala': 'Malayalam',
    'madhya_pradesh': 'Hindi',
    'maharashtra': 'Marathi',
    'manipur': 'Manipuri',
    'meghalaya': 'English, Khasi',
    'mizoram': 'Mizo',
    'nagaland': 'English',
    'odisha': 'Odia',
    'punjab': 'Punjabi',
    'rajasthan': 'Hindi',
    'sikkim': 'Nepali',
    'tamil_nadu': 'Tamil',
    'telangana': 'Telugu',
    'tripura': 'Bengali, Kokborok',
    'uttar_pradesh': 'Hindi',
    'uttarakhand': 'Hindi, Sanskrit',
    'west_bengal': 'Bengali'
  };
  
  return languages[stateId] || 'Unknown';
};

const getStateCuisine = (stateId: string): string => {
  const cuisines: Record<string, string> = {
    'andhra_pradesh': 'Hyderabadi Biryani, Gongura Pachadi',
    'arunachal_pradesh': 'Thukpa, Momos',
    'assam': 'Assamese Duck Curry, Masor Tenga',
    'bihar': 'Litti Chokha, Sattu Paratha',
    'chhattisgarh': 'Farra, Chila',
    'goa': 'Fish Curry, Vindaloo',
    'gujarat': 'Dhokla, Khandvi, Thepla',
    'haryana': 'Singri ki Sabzi, Bajra Khichdi',
    'himachal_pradesh': 'Dham, Madra',
    'jammu_kashmir': 'Rogan Josh, Dum Aloo',
    'jharkhand': 'Dhuska, Pittha',
    'karnataka': 'Bisi Bele Bath, Mysore Pak',
    'kerala': 'Appam, Fish Molee, Kerala Sadya',
    'madhya_pradesh': 'Poha, Bhutte Ka Kees',
    'maharashtra': 'Vada Pav, Puran Poli',
    'manipur': 'Eromba, Kangsoi',
    'meghalaya': 'Jadoh, Tungrymbai',
    'mizoram': 'Bai, Koat Pitha',
    'nagaland': 'Axone, Smoked Pork',
    'odisha': 'Dalma, Chenna Poda',
    'punjab': 'Sarson ka Saag, Makki di Roti',
    'rajasthan': 'Dal Baati Churma, Gatte ki Sabzi',
    'sikkim': 'Momo, Thukpa, Sel Roti',
    'tamil_nadu': 'Dosa, Idli, Sambar',
    'telangana': 'Hyderabadi Biryani, Mirchi ka Salan',
    'tripura': 'Mui Borok, Chakhwi',
    'uttar_pradesh': 'Kebabs, Tundey Kababi',
    'uttarakhand': 'Kafuli, Chainsoo',
    'west_bengal': 'Mishti Doi, Rosogolla'
  };
  
  return cuisines[stateId] || 'Various regional specialties';
};

const getStateFamousFor = (stateId: string): string => {
  const famousFor: Record<string, string> = {
    'andhra_pradesh': 'Tirupati Temple, Charminar',
    'arunachal_pradesh': 'Tawang Monastery, Tribal Culture',
    'assam': 'Tea Gardens, Kaziranga National Park',
    'bihar': 'Bodh Gaya, Nalanda University',
    'chhattisgarh': 'Chitrakote Falls, Tribal Art',
    'goa': 'Beaches, Portuguese Architecture',
    'gujarat': 'Rann of Kutch, Statue of Unity',
    'haryana': 'Kurukshetra, Sports Culture',
    'himachal_pradesh': 'Shimla, Manali, Dharamshala',
    'jammu_kashmir': 'Dal Lake, Gulmarg',
    'jharkhand': 'Waterfalls, Tribal Culture',
    'karnataka': 'Hampi, Mysore Palace',
    'kerala': 'Backwaters, Ayurveda',
    'madhya_pradesh': 'Khajuraho, Sanchi Stupa',
    'maharashtra': 'Ajanta-Ellora Caves, Mumbai',
    'manipur': 'Loktak Lake, Polo',
    'meghalaya': 'Living Root Bridges, Cherrapunji',
    'mizoram': 'Bamboo Forests, Phawngpui Peak',
    'nagaland': 'Hornbill Festival, Tribal Culture',
    'odisha': 'Konark Sun Temple, Puri Jagannath',
    'punjab': 'Golden Temple, Agriculture',
    'rajasthan': 'Forts & Palaces, Desert Culture',
    'sikkim': 'Kanchenjunga, Monasteries',
    'tamil_nadu': 'Ancient Temples, Classical Music',
    'telangana': 'Ramoji Film City, Golconda Fort',
    'tripura': 'Royal Palaces, Rock Carvings',
    'uttar_pradesh': 'Taj Mahal, Varanasi Ghats',
    'uttarakhand': 'Char Dham, Jim Corbett Park',
    'west_bengal': 'Sundarbans, Darjeeling'
  };
  
  return famousFor[stateId] || 'Rich cultural heritage';
};

export default EnhancedMap;
