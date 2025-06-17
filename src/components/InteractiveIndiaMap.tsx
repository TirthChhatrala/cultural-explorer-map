
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, ZoomIn, ZoomOut, Info, Globe, ExternalLink, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface StateInfo {
  name: string;
  capital: string;
  population: string;
  area: string;
  languages: string[];
  majorCities: string[];
  description: string;
  climate: string;
  famousFor: string[];
  bestTimeToVisit: string;
}

interface CountryData {
  name: {
    common: string;
    official: string;
  };
  population: number;
  area: number;
  capital: string[];
  languages: { [key: string]: string };
  region: string;
  subregion: string;
  timezones: string[];
}

const InteractiveIndiaMap = () => {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedState, setSelectedState] = useState<StateInfo | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [countryData, setCountryData] = useState<CountryData | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Enhanced state data with more realistic information
  const stateData: { [key: string]: StateInfo } = {
    'Maharashtra': {
      name: 'Maharashtra',
      capital: 'Mumbai (Commercial), Nagpur (Winter)',
      population: '112.4 million',
      area: '307,713 km²',
      languages: ['Marathi', 'Hindi', 'English'],
      majorCities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
      description: 'The economic powerhouse of India, known for Bollywood and financial capital Mumbai.',
      climate: 'Tropical monsoon climate with three distinct seasons',
      famousFor: ['Bollywood', 'Gateway of India', 'Ajanta & Ellora Caves', 'Lonavala', 'Shirdi'],
      bestTimeToVisit: 'October to March'
    },
    'Gujarat': {
      name: 'Gujarat',
      capital: 'Gandhinagar',
      population: '60.4 million',
      area: '196,244 km²',
      languages: ['Gujarati', 'Hindi', 'English'],
      majorCities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
      description: 'Known for its entrepreneurial spirit, vibrant culture, and the birthplace of Mahatma Gandhi.',
      climate: 'Arid to semi-arid with hot summers and mild winters',
      famousFor: ['Rann of Kutch', 'Statue of Unity', 'Gir National Park', 'Dwarka', 'Somnath Temple'],
      bestTimeToVisit: 'November to February'
    },
    'Karnataka': {
      name: 'Karnataka',
      capital: 'Bengaluru',
      population: '61.1 million',
      area: '191,791 km²',
      languages: ['Kannada', 'Hindi', 'English'],
      majorCities: ['Bengaluru', 'Mysuru', 'Hubli', 'Mangaluru', 'Belagavi'],
      description: 'The Silicon Valley of India, known for IT industry and rich cultural heritage.',
      climate: 'Tropical savanna climate with pleasant weather year-round',
      famousFor: ['Mysore Palace', 'Coorg', 'Hampi', 'Gokarna', 'Bandipur National Park'],
      bestTimeToVisit: 'October to March'
    },
    'Tamil Nadu': {
      name: 'Tamil Nadu',
      capital: 'Chennai',
      population: '72.1 million',
      area: '130,060 km²',
      languages: ['Tamil', 'English', 'Hindi'],
      majorCities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
      description: 'Known for its ancient temples, classical dance, and automotive industry.',
      climate: 'Tropical climate with hot summers and moderate monsoons',
      famousFor: ['Meenakshi Temple', 'Marina Beach', 'Ooty', 'Kodaikanal', 'Mamallapuram'],
      bestTimeToVisit: 'November to March'
    },
    'Rajasthan': {
      name: 'Rajasthan',
      capital: 'Jaipur',
      population: '68.5 million',
      area: '342,239 km²',
      languages: ['Hindi', 'Rajasthani', 'English'],
      majorCities: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'],
      description: 'The land of kings and deserts, famous for its palaces, forts, and vibrant culture.',
      climate: 'Desert climate with extreme temperatures and low rainfall',
      famousFor: ['Thar Desert', 'Hawa Mahal', 'City Palace', 'Amber Fort', 'Lake Palace'],
      bestTimeToVisit: 'October to March'
    },
    'West Bengal': {
      name: 'West Bengal',
      capital: 'Kolkata',
      population: '91.3 million',
      area: '88,752 km²',
      languages: ['Bengali', 'Hindi', 'English'],
      majorCities: ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri'],
      description: 'Cultural capital of India, known for literature, arts, and intellectual heritage.',
      climate: 'Tropical wet-dry climate with hot humid summers',
      famousFor: ['Victoria Memorial', 'Howrah Bridge', 'Darjeeling', 'Sundarbans', 'Durga Puja'],
      bestTimeToVisit: 'October to March'
    }
  };

  // Fetch country data from REST Countries API
  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/name/india?fullText=true');
        const data = await response.json();
        if (data && data.length > 0) {
          setCountryData(data[0]);
        }
      } catch (error) {
        console.error('Error fetching country data:', error);
      }
    };

    fetchCountryData();
  }, []);

  useEffect(() => {
    // Simulate map loading with realistic timing
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleStateClick = (stateName: string) => {
    const state = stateData[stateName];
    if (state) {
      setSelectedState(state);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.2, 0.5));
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Current location:', position.coords.latitude, position.coords.longitude);
          // Could integrate with reverse geocoding API here
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const handleExploreMore = () => {
    if (selectedState) {
      const stateNameSlug = selectedState.name.toLowerCase().replace(/\s+/g, '');
      navigate(`/state/${stateNameSlug}`);
    }
  };

  const toggleFavorite = (stateName: string) => {
    setFavorites(prev => 
      prev.includes(stateName) 
        ? prev.filter(name => name !== stateName)
        : [...prev, stateName]
    );
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="h-full relative"
      >
        {/* Map Container */}
        <div ref={mapRef} className="w-full h-full relative">
          {!mapLoaded ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="relative">
                  <div className="animate-spin rounded-full h-20 w-20 border-4 border-orange-500 border-t-transparent mx-auto mb-6"></div>
                  <Globe className="absolute top-6 left-6 text-orange-500 animate-pulse" size={32} />
                </div>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Loading Interactive India Map...</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Fetching real-time data...</p>
              </div>
            </div>
          ) : (
            <div className="w-full h-full relative overflow-hidden">
              {/* Enhanced India Map SVG */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.svg
                  viewBox="0 0 1000 800"
                  className="w-full h-full max-w-6xl drop-shadow-2xl"
                  style={{ 
                    transform: `scale(${zoomLevel})`,
                    transition: 'transform 0.3s ease-in-out'
                  }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: zoomLevel, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  {/* Enhanced gradient definitions */}
                  <defs>
                    <linearGradient id="stateGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#ff7849', stopOpacity: 0.9 }} />
                      <stop offset="50%" style={{ stopColor: '#ff6b35', stopOpacity: 0.8 }} />
                      <stop offset="100%" style={{ stopColor: '#ff5722', stopOpacity: 0.9 }} />
                    </linearGradient>
                    <linearGradient id="hoverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#ffab00', stopOpacity: 1 }} />
                      <stop offset="50%" style={{ stopColor: '#ff9800', stopOpacity: 0.9 }} />
                      <stop offset="100%" style={{ stopColor: '#ff5722', stopOpacity: 1 }} />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Enhanced Maharashtra */}
                  <motion.path
                    d="M300 350 L420 340 L430 420 L370 460 L280 450 Z"
                    fill="url(#stateGradient)"
                    stroke="#fff"
                    strokeWidth="4"
                    filter="url(#glow)"
                    className="cursor-pointer hover:brightness-110 transition-all duration-300"
                    onClick={() => handleStateClick('Maharashtra')}
                    whileHover={{ scale: 1.03, filter: "brightness(1.2)" }}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.1 }}
                  />
                  <text x="365" y="400" textAnchor="middle" className="text-sm fill-white font-bold pointer-events-none drop-shadow-lg">
                    Maharashtra
                  </text>

                  {/* Enhanced Gujarat */}
                  <motion.path
                    d="M180 280 L300 270 L310 350 L220 370 L160 350 Z"
                    fill="url(#stateGradient)"
                    stroke="#fff"
                    strokeWidth="4"
                    filter="url(#glow)"
                    className="cursor-pointer hover:brightness-110 transition-all duration-300"
                    onClick={() => handleStateClick('Gujarat')}
                    whileHover={{ scale: 1.03, filter: "brightness(1.2)" }}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                  <text x="245" y="320" textAnchor="middle" className="text-sm fill-white font-bold pointer-events-none drop-shadow-lg">
                    Gujarat
                  </text>

                  {/* Enhanced Karnataka */}
                  <motion.path
                    d="M300 480 L420 470 L430 560 L340 580 L280 560 Z"
                    fill="url(#stateGradient)"
                    stroke="#fff"
                    strokeWidth="4"
                    filter="url(#glow)"
                    className="cursor-pointer hover:brightness-110 transition-all duration-300"
                    onClick={() => handleStateClick('Karnataka')}
                    whileHover={{ scale: 1.03, filter: "brightness(1.2)" }}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                  <text x="365" y="525" textAnchor="middle" className="text-sm fill-white font-bold pointer-events-none drop-shadow-lg">
                    Karnataka
                  </text>

                  {/* Enhanced Tamil Nadu */}
                  <motion.path
                    d="M420 560 L520 550 L530 630 L440 650 L410 630 Z"
                    fill="url(#stateGradient)"
                    stroke="#fff"
                    strokeWidth="4"
                    filter="url(#glow)"
                    className="cursor-pointer hover:brightness-110 transition-all duration-300"
                    onClick={() => handleStateClick('Tamil Nadu')}
                    whileHover={{ scale: 1.03, filter: "brightness(1.2)" }}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                  />
                  <text x="475" y="595" textAnchor="middle" className="text-sm fill-white font-bold pointer-events-none drop-shadow-lg">
                    Tamil Nadu
                  </text>

                  {/* Enhanced Rajasthan */}
                  <motion.path
                    d="M150 150 L350 140 L360 280 L180 290 L140 220 Z"
                    fill="url(#stateGradient)"
                    stroke="#fff"
                    strokeWidth="4"
                    filter="url(#glow)"
                    className="cursor-pointer hover:brightness-110 transition-all duration-300"
                    onClick={() => handleStateClick('Rajasthan')}
                    whileHover={{ scale: 1.03, filter: "brightness(1.2)" }}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                  <text x="250" y="215" textAnchor="middle" className="text-sm fill-white font-bold pointer-events-none drop-shadow-lg">
                    Rajasthan
                  </text>

                  {/* Enhanced West Bengal */}
                  <motion.path
                    d="M600 280 L720 270 L730 360 L620 370 L590 330 Z"
                    fill="url(#stateGradient)"
                    stroke="#fff"
                    strokeWidth="4"
                    filter="url(#glow)"
                    className="cursor-pointer hover:brightness-110 transition-all duration-300"
                    onClick={() => handleStateClick('West Bengal')}
                    whileHover={{ scale: 1.03, filter: "brightness(1.2)" }}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                  />
                  <text x="660" y="320" textAnchor="middle" className="text-sm fill-white font-bold pointer-events-none drop-shadow-lg">
                    West Bengal
                  </text>
                </motion.svg>
              </div>

              {/* Enhanced Map Controls */}
              <div className="absolute top-6 right-6 flex flex-col gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleZoomIn}
                  className="bg-white/95 backdrop-blur-md hover:bg-white shadow-xl border-2 hover:border-orange-300 transition-all duration-300"
                >
                  <ZoomIn size={20} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleZoomOut}
                  className="bg-white/95 backdrop-blur-md hover:bg-white shadow-xl border-2 hover:border-orange-300 transition-all duration-300"
                >
                  <ZoomOut size={20} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCurrentLocation}
                  className="bg-white/95 backdrop-blur-md hover:bg-white shadow-xl border-2 hover:border-orange-300 transition-all duration-300"
                >
                  <Navigation size={20} />
                </Button>
              </div>

              {/* Enhanced Legend */}
              <div className="absolute bottom-6 left-6">
                <Card className="bg-white/95 backdrop-blur-md shadow-2xl border-2 border-orange-100">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-base font-semibold">
                        <MapPin size={20} className="text-orange-500" />
                        <span>Click states to explore</span>
                      </div>
                      {countryData && (
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <Info size={16} />
                          <span>Population: {(countryData.population / 1000000).toFixed(0)}M people</span>
                        </div>
                      )}
                      <div className="text-xs text-gray-500">
                        Real-time data powered by REST Countries API
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Country Info Display */}
              {countryData && (
                <div className="absolute top-6 left-6">
                  <Card className="bg-white/95 backdrop-blur-md shadow-2xl border-2 border-orange-100">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <Globe className="text-orange-500" size={24} />
                        <h3 className="font-bold text-xl">{countryData.name.common}</h3>
                      </div>
                      <div className="text-sm text-gray-600 space-y-2">
                        <p><strong>Capital:</strong> {countryData.capital?.[0]}</p>
                        <p><strong>Region:</strong> {countryData.region}</p>
                        <p><strong>Area:</strong> {countryData.area.toLocaleString()} km²</p>
                        <p><strong>Languages:</strong> {Object.values(countryData.languages || {}).slice(0, 3).join(', ')}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Enhanced State Information Panel */}
        {selectedState && (
          <motion.div
            initial={{ opacity: 0, x: 400, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 400, scale: 0.9 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
            className="absolute top-6 right-24 w-[420px] max-h-[85vh] overflow-y-auto"
          >
            <Card className="bg-white/98 backdrop-blur-xl shadow-2xl border-2 border-orange-200 rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10">
                  <CardTitle className="flex items-center justify-between text-2xl">
                    <div className="flex items-center gap-3">
                      <MapPin size={28} />
                      {selectedState.name}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFavorite(selectedState.name)}
                      className="text-white hover:bg-white/20"
                    >
                      <Heart 
                        size={20} 
                        className={favorites.includes(selectedState.name) ? "fill-current" : ""} 
                      />
                    </Button>
                  </CardTitle>
                  <CardDescription className="text-orange-100 text-base mt-1">
                    Capital: {selectedState.capital}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h4 className="font-semibold text-orange-600 mb-2 text-sm uppercase tracking-wide">About</h4>
                  <p className="text-gray-700 leading-relaxed">{selectedState.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-orange-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-orange-600 mb-1 text-sm">Population</h4>
                    <p className="text-gray-800 font-medium">{selectedState.population}</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-orange-600 mb-1 text-sm">Area</h4>
                    <p className="text-gray-800 font-medium">{selectedState.area}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-orange-600 mb-3 text-sm uppercase tracking-wide">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedState.languages.map((lang, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 text-sm rounded-full font-medium border border-orange-300"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-orange-600 mb-2 text-sm uppercase tracking-wide">Famous For</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedState.famousFor.map((item, index) => (
                      <span
                        key={index}
                        className="text-sm text-gray-700 bg-gray-100 px-3 py-2 rounded-lg font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-blue-600 mb-1 text-sm">Climate</h4>
                    <p className="text-gray-700 text-sm">{selectedState.climate}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-green-600 mb-1 text-sm">Best Time to Visit</h4>
                    <p className="text-gray-700 text-sm font-medium">{selectedState.bestTimeToVisit}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-orange-600 mb-2 text-sm uppercase tracking-wide">Major Cities</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedState.majorCities.map((city, index) => (
                      <span
                        key={index}
                        className="text-sm text-gray-600 bg-gray-200 px-3 py-1 rounded-md"
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    className="flex-1 border-2 border-gray-300 hover:border-gray-400 transition-colors duration-300"
                    onClick={() => setSelectedState(null)}
                  >
                    Close
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg transition-all duration-300 transform hover:scale-105"
                    onClick={handleExploreMore}
                  >
                    <ExternalLink size={16} className="mr-2" />
                    Explore More
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default InteractiveIndiaMap;
