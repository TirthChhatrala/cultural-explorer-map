
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface StateInfo {
  name: string;
  capital: string;
  population: string;
  area: string;
  languages: string[];
  majorCities: string[];
}

const InteractiveIndiaMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedState, setSelectedState] = useState<StateInfo | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Sample state data
  const stateData: { [key: string]: StateInfo } = {
    'Maharashtra': {
      name: 'Maharashtra',
      capital: 'Mumbai',
      population: '112.4 million',
      area: '307,713 km²',
      languages: ['Marathi', 'Hindi', 'English'],
      majorCities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik']
    },
    'Gujarat': {
      name: 'Gujarat',
      capital: 'Gandhinagar',
      population: '60.4 million',
      area: '196,244 km²',
      languages: ['Gujarati', 'Hindi', 'English'],
      majorCities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot']
    },
    'Karnataka': {
      name: 'Karnataka',
      capital: 'Bengaluru',
      population: '61.1 million',
      area: '191,791 km²',
      languages: ['Kannada', 'Hindi', 'English'],
      majorCities: ['Bengaluru', 'Mysuru', 'Hubli', 'Mangaluru']
    },
    'Tamil Nadu': {
      name: 'Tamil Nadu',
      capital: 'Chennai',
      population: '72.1 million',
      area: '130,060 km²',
      languages: ['Tamil', 'English', 'Hindi'],
      majorCities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli']
    }
  };

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleStateClick = (stateName: string) => {
    const state = stateData[stateName];
    if (state) {
      setSelectedState(state);
    }
  };

  const handleZoomIn = () => {
    console.log('Zoom in functionality would be implemented here');
  };

  const handleZoomOut = () => {
    console.log('Zoom out functionality would be implemented here');
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Current location:', position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <div className="w-full h-screen bg-gray-50 dark:bg-gray-900 relative">
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-india-orange mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading Interactive India Map...</p>
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
              {/* Simplified India Map SVG Representation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  viewBox="0 0 800 600"
                  className="w-full h-full max-w-4xl max-h-96"
                  style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
                >
                  {/* Maharashtra */}
                  <path
                    d="M200 250 L280 240 L290 280 L250 320 L180 310 Z"
                    fill="#ff7f50"
                    stroke="#fff"
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-india-orange transition-colors"
                    onClick={() => handleStateClick('Maharashtra')}
                  />
                  <text x="235" y="285" textAnchor="middle" className="text-xs fill-white font-semibold">
                    Maharashtra
                  </text>

                  {/* Gujarat */}
                  <path
                    d="M120 200 L200 190 L210 250 L140 260 Z"
                    fill="#4169e1"
                    stroke="#fff"
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-india-orange transition-colors"
                    onClick={() => handleStateClick('Gujarat')}
                  />
                  <text x="165" y="225" textAnchor="middle" className="text-xs fill-white font-semibold">
                    Gujarat
                  </text>

                  {/* Karnataka */}
                  <path
                    d="M200 350 L280 340 L290 400 L220 410 Z"
                    fill="#32cd32"
                    stroke="#fff"
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-india-orange transition-colors"
                    onClick={() => handleStateClick('Karnataka')}
                  />
                  <text x="245" y="380" textAnchor="middle" className="text-xs fill-white font-semibold">
                    Karnataka
                  </text>

                  {/* Tamil Nadu */}
                  <path
                    d="M280 400 L350 390 L360 450 L290 460 Z"
                    fill="#ff1493"
                    stroke="#fff"
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-india-orange transition-colors"
                    onClick={() => handleStateClick('Tamil Nadu')}
                  />
                  <text x="315" y="425" textAnchor="middle" className="text-xs fill-white font-semibold">
                    Tamil Nadu
                  </text>

                  {/* Additional simplified state representations */}
                  <path
                    d="M300 150 L400 140 L410 200 L320 210 Z"
                    fill="#dda0dd"
                    stroke="#fff"
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-india-orange transition-colors"
                  />
                  <text x="355" y="180" textAnchor="middle" className="text-xs fill-white font-semibold">
                    Uttar Pradesh
                  </text>

                  <path
                    d="M400 200 L500 190 L510 250 L420 260 Z"
                    fill="#20b2aa"
                    stroke="#fff"
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-india-orange transition-colors"
                  />
                  <text x="455" y="225" textAnchor="middle" className="text-xs fill-white font-semibold">
                    West Bengal
                  </text>
                </svg>
              </div>

              {/* Map Controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleZoomIn}
                  className="bg-white/90 backdrop-blur-sm"
                >
                  <ZoomIn size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleZoomOut}
                  className="bg-white/90 backdrop-blur-sm"
                >
                  <ZoomOut size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCurrentLocation}
                  className="bg-white/90 backdrop-blur-sm"
                >
                  <Navigation size={16} />
                </Button>
              </div>

              {/* Legend */}
              <div className="absolute bottom-4 left-4">
                <Card className="bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin size={16} className="text-india-orange" />
                      <span>Click on states to explore</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* State Information Panel */}
        {selectedState && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute top-4 left-4 w-80"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="text-india-orange" size={20} />
                  {selectedState.name}
                </CardTitle>
                <CardDescription>Capital: {selectedState.capital}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm">Population</h4>
                    <p className="text-sm text-muted-foreground">{selectedState.population}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Area</h4>
                    <p className="text-sm text-muted-foreground">{selectedState.area}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Languages</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedState.languages.map((lang, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded-full"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Major Cities</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedState.majorCities.join(', ')}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4"
                  onClick={() => setSelectedState(null)}
                >
                  Close
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default InteractiveIndiaMap;
