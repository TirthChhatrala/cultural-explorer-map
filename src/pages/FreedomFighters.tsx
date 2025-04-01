
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import FighterCard from '../components/FighterCard';
import FighterModal from '../components/FighterModal';
import StateCard from '../components/StateCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from '../context/ThemeContext';
import { freedomFighters } from '../data/states';
import { Users, MapPin, Filter } from 'lucide-react';

// All states of India
const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  // Union Territories
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
  'Andaman and Nicobar Islands', 'Dadra and Nagar Haveli and Daman and Diu', 'Lakshadweep'
];

const FreedomFighters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedFighter, setSelectedFighter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const { theme } = useTheme();
  
  const statesWithFighters = [...new Set(freedomFighters.map(fighter => fighter.state))].sort();
  
  const filteredFighters = freedomFighters.filter(fighter => {
    return (
      (searchTerm === '' || fighter.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedState === '' || fighter.state === selectedState)
    );
  });
  
  const handleCardClick = (fighter) => {
    setSelectedFighter(fighter);
    setIsModalOpen(true);
  };

  const stateBasedFighters = {};
  indianStates.forEach(state => {
    stateBasedFighters[state] = freedomFighters.filter(fighter => fighter.state === state);
  });
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4">
        <section className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
          >
            <span className="inline-block px-3 py-1 bg-india-orange/10 text-india-orange rounded-full text-sm font-medium mb-4">
              Heroes of Independence
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight">
              India's Freedom Fighters
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover the brave men and women who fought for India's independence and shaped the nation's history.
            </p>
          </motion.div>
        </section>
        
        <Tabs defaultValue="all" className="mb-12" onValueChange={setActiveTab}>
          <TabsList className="mb-6 flex justify-center">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Users size={16} />
              <span>All Fighters</span>
            </TabsTrigger>
            <TabsTrigger value="by-state" className="flex items-center gap-2">
              <MapPin size={16} />
              <span>By State</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className={`p-6 rounded-xl mb-8 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-secondary/30'
            }`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Search by Name</label>
                  <input
                    type="text"
                    placeholder="Search freedom fighters..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-india-orange ${
                      theme === 'dark' 
                        ? 'bg-gray-900 border border-gray-700' 
                        : 'bg-white border border-gray-200'
                    }`}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Filter by State</label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className={`w-full py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-india-orange ${
                      theme === 'dark' 
                        ? 'bg-gray-900 border border-gray-700' 
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    <option value="">All States</option>
                    {indianStates.sort().map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredFighters.map((fighter) => (
                <FighterCard
                  key={fighter.id}
                  fighter={fighter}
                  onClick={handleCardClick}
                />
              ))}
            </div>
            
            {filteredFighters.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No freedom fighters found matching your criteria.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="by-state">
            <div className="space-y-8">
              {indianStates.map((state) => {
                const stateFighters = stateBasedFighters[state] || [];
                
                if (stateFighters.length === 0) return null;
                
                return (
                  <StateCard 
                    key={state} 
                    title={state} 
                    icon={<MapPin className="w-5 h-5" />}
                  >
                    {stateFighters.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {stateFighters.map((fighter) => (
                          <motion.div
                            key={fighter.id}
                            whileHover={{ scale: 1.02 }}
                            className={`p-4 rounded-lg cursor-pointer flex items-center gap-4 ${
                              theme === 'dark' 
                                ? 'bg-gray-700/50 hover:bg-gray-700' 
                                : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                            onClick={() => handleCardClick(fighter)}
                          >
                            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                              <img 
                                src={fighter.image} 
                                alt={fighter.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium">{fighter.name}</h4>
                              <p className="text-xs text-muted-foreground">{fighter.years}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-2">No freedom fighters from this state in our database yet.</p>
                    )}
                  </StateCard>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <FighterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fighter={selectedFighter}
      />
    </Layout>
  );
};

export default FreedomFighters;
