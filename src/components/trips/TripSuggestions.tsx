
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { states } from '../../data/states';
import { hotels, attractions as allAttractions } from '../../data/tripData';
import { MapPin, Star, Hotel, Utensils, Landmark } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TripSuggestionsProps {
  selectedStates: string[];
  budget: number;
  selectedPreferences: string[];
}

// Sample regional cuisine data by state
const cuisineByState: Record<string, string[]> = {
  rajasthan: ['Dal Baati Churma', 'Laal Maas', 'Ghewar', 'Pyaaz Kachori'],
  kerala: ['Appam with Stew', 'Malabar Biryani', 'Fish Molee', 'Puttu and Kadala Curry'],
  punjab: ['Butter Chicken', 'Amritsari Kulcha', 'Sarson da Saag', 'Makki di Roti'],
  goa: ['Fish Curry Rice', 'Vindaloo', 'Bebinca', 'Xacuti'],
  maharashtra: ['Vada Pav', 'Puran Poli', 'Misal Pav', 'Modak'],
  uttarpradesh: ['Kebabs', 'Lucknowi Biryani', 'Malai Kofta', 'Petha'],
  karnataka: ['Mysore Masala Dosa', 'Bisi Bele Bath', 'Coorg Pork Curry', 'Neer Dosa'],
  himachalpradesh: ['Dham', 'Chha Gosht', 'Madra', 'Babru'],
  gujarat: ['Dhokla', 'Khandvi', 'Undhiyu', 'Fafda-Jalebi'],
  tamilnadu: ['Chettinad Chicken', 'Pongal', 'Rasam', 'Kozhukattai'],
  andhra_pradesh: ['Pesarattu', 'Gongura Pachadi', 'Pulihora', 'Boorelu'],
  assam: ['Masor Tenga', 'Khar', 'Pitha', 'Jolpan'],
  odisha: ['Dalma', 'Chhena Poda', 'Pakhala', 'Chhena Jhili'],
  westbengal: ['Macher Jhol', 'Mishti Doi', 'Rasgulla', 'Shorshe Ilish']
};

// Notable attractions by category
const popularAttractionsByType: Record<string, { name: string, state: string, image: string }[]> = {
  historical: [
    { name: 'Taj Mahal', state: 'uttarpradesh', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=500' },
    { name: 'Amber Fort', state: 'rajasthan', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=500' },
    { name: 'Mysore Palace', state: 'karnataka', image: 'https://images.unsplash.com/photo-1628837136005-68b2da1c9484?q=80&w=500' },
    { name: 'Hampi Ruins', state: 'karnataka', image: 'https://images.unsplash.com/photo-1590050752117-32fe189a453b?q=80&w=500' }
  ],
  religious: [
    { name: 'Golden Temple', state: 'punjab', image: 'https://images.unsplash.com/photo-1514222788835-3a1a1d5b32f8?q=80&w=500' },
    { name: 'Varanasi Ghats', state: 'uttarpradesh', image: 'https://images.unsplash.com/photo-1561361058-c24e01901c1c?q=80&w=500' },
    { name: 'Tirupati Temple', state: 'andhra_pradesh', image: 'https://images.unsplash.com/photo-1590756254933-2873d72a83b6?q=80&w=500' },
    { name: 'Meenakshi Temple', state: 'tamilnadu', image: 'https://images.unsplash.com/photo-1605804097616-ed26bb4450b2?q=80&w=500' }
  ],
  nature: [
    { name: 'Kerala Backwaters', state: 'kerala', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=500' },
    { name: 'Valley of Flowers', state: 'uttarakhand', image: 'https://images.unsplash.com/photo-1589739900869-082b93d8e862?q=80&w=500' },
    { name: 'Sunderbans', state: 'westbengal', image: 'https://images.unsplash.com/photo-1603033156166-2ae22eb2b7e2?q=80&w=500' },
    { name: 'Pangong Lake', state: 'jammu_kashmir', image: 'https://images.unsplash.com/photo-1626015365107-2dd2c4b51bf3?q=80&w=500' }
  ],
  beach: [
    { name: 'Beaches of Goa', state: 'goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=500' },
    { name: 'Marina Beach', state: 'tamilnadu', image: 'https://images.unsplash.com/photo-1582972236019-ea4af5ffe587?q=80&w=500' },
    { name: 'Varkala Beach', state: 'kerala', image: 'https://images.unsplash.com/photo-1623962073316-b11f76e9fc2b?q=80&w=500' },
    { name: 'Radhanagar Beach', state: 'andaman', image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=500' }
  ],
  adventure: [
    { name: 'Rishikesh', state: 'uttarakhand', image: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?q=80&w=500' },
    { name: 'Manali', state: 'himachalpradesh', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=500' },
    { name: 'Andaman Islands', state: 'andaman', image: 'https://images.unsplash.com/photo-1586500036065-8ea0f2d69a6c?q=80&w=500' },
    { name: 'Coorg', state: 'karnataka', image: 'https://images.unsplash.com/photo-1588096947838-62e0d242ebc3?q=80&w=500' }
  ]
};

const TripSuggestions: React.FC<TripSuggestionsProps> = ({ 
  selectedStates, 
  budget,
  selectedPreferences 
}) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  // Generate hotel suggestions based on selected states and budget
  const suggestedHotels = React.useMemo(() => {
    if (selectedStates.length === 0) return [];
    
    return hotels
      .filter(hotel => selectedStates.includes(hotel.state))
      .filter(hotel => hotel.price <= budget)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
  }, [selectedStates, budget]);
  
  // Generate attraction suggestions based on selected states and preferences
  const suggestedAttractions = React.useMemo(() => {
    if (selectedStates.length === 0) return [];
    
    // First filter by selected states
    const stateFiltered = allAttractions.filter(attraction => 
      selectedStates.includes(attraction.state)
    );
    
    // Then filter by preferences if any are selected
    if (selectedPreferences.length > 0) {
      const preferenceFiltered = stateFiltered.filter(attraction => 
        selectedPreferences.includes(attraction.type)
      );
      
      return preferenceFiltered.length > 0 ? preferenceFiltered.slice(0, 4) : stateFiltered.slice(0, 4);
    }
    
    return stateFiltered.slice(0, 4);
  }, [selectedStates, selectedPreferences]);
  
  // Generate cuisine suggestions based on selected states
  const suggestedCuisines = React.useMemo(() => {
    if (selectedStates.length === 0) return [];
    
    const cuisines: string[] = [];
    selectedStates.forEach(stateId => {
      const stateCuisine = cuisineByState[stateId as keyof typeof cuisineByState];
      if (stateCuisine) {
        cuisines.push(...stateCuisine);
      }
    });
    
    // Return unique cuisines
    return Array.from(new Set(cuisines)).slice(0, 8);
  }, [selectedStates]);
  
  // If we have preferences but no attractions match them, suggest popular ones by category
  const fallbackAttractions = React.useMemo(() => {
    if (suggestedAttractions.length > 0 || selectedPreferences.length === 0) return [];
    
    const attractions: any[] = [];
    selectedPreferences.forEach(pref => {
      const preferenceAttractions = popularAttractionsByType[pref as keyof typeof popularAttractionsByType];
      if (preferenceAttractions) {
        preferenceAttractions.forEach(attraction => {
          if (selectedStates.includes(attraction.state)) {
            attractions.push(attraction);
          }
        });
      }
    });
    
    return attractions.slice(0, 4);
  }, [selectedPreferences, selectedStates, suggestedAttractions]);
  
  if (selectedStates.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Please select at least one state to get personalized suggestions.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Attractions Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Landmark className="text-india-orange" size={20} />
          <h3 className="text-lg font-medium">Recommended Attractions</h3>
        </div>
        
        {suggestedAttractions.length > 0 || fallbackAttractions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(suggestedAttractions.length > 0 ? suggestedAttractions : fallbackAttractions).map((attraction, index) => (
              <motion.div 
                key={attraction.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`rounded-lg border overflow-hidden ${
                  theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
                } group cursor-pointer hover:shadow-md transition-all`}
              >
                <div className="h-32 overflow-hidden">
                  <img 
                    src={attraction.image} 
                    alt={attraction.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3">
                  <h4 className="font-medium truncate">{attraction.name}</h4>
                  <div className="flex items-center mt-1 text-sm text-muted-foreground">
                    <MapPin size={14} className="mr-1" />
                    <span>{states.find(s => s.id === attraction.state)?.name || attraction.state}</span>
                  </div>
                  <div className="mt-2">
                    <span className={`inline-block text-xs px-2 py-1 rounded-full ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      {attraction.type}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className={`p-4 rounded-lg text-center ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
          }`}>
            <p className="text-muted-foreground">No attractions found matching your criteria.</p>
          </div>
        )}
      </div>
      
      {/* Hotels Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Hotel className="text-india-orange" size={20} />
          <h3 className="text-lg font-medium">Suggested Accommodations</h3>
        </div>
        
        {suggestedHotels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suggestedHotels.map((hotel, index) => (
              <motion.div 
                key={hotel.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`rounded-lg border overflow-hidden ${
                  theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
                } group cursor-pointer hover:shadow-md transition-all`}
                onClick={() => navigate(`/hotel/${hotel.id}`)}
              >
                <div className="h-36 overflow-hidden relative">
                  <img 
                    src={hotel.image} 
                    alt={hotel.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 flex items-center bg-india-orange text-white px-1.5 py-0.5 rounded text-xs">
                    <span className="font-bold mr-0.5">{hotel.rating}</span>
                    <Star size={10} className="fill-white" />
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-medium truncate">{hotel.name}</h4>
                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                    <MapPin size={12} className="mr-1" />
                    <span className="truncate">{hotel.location}, {states.find(s => s.id === hotel.state)?.name}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground">Starting from</span>
                    <span className="text-india-orange font-medium">₹{hotel.price.toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className={`p-4 rounded-lg text-center ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
          }`}>
            <p className="text-muted-foreground">No hotels found matching your budget and preferences.</p>
            <Button variant="link" onClick={() => navigate('/hotels')} className="text-india-orange">
              Browse All Hotels
            </Button>
          </div>
        )}
      </div>
      
      {/* Cuisines Section */}
      {suggestedCuisines.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Utensils className="text-india-orange" size={20} />
            <h3 className="text-lg font-medium">Regional Cuisines to Try</h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {suggestedCuisines.map((cuisine, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={`px-3 py-2 rounded-full ${
                  theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-india-orange/10 hover:bg-india-orange/20'
                } text-sm cursor-default transition-colors`}
              >
                {cuisine}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TripSuggestions;
