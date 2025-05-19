
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { MapPin, Filter } from 'lucide-react';
import StateCard from '../components/StateCard';
import { useTheme } from '../context/ThemeContext';
import { states } from '../data/states';

const TouristAttractions = () => {
  const { theme } = useTheme();
  const [filterState, setFilterState] = useState<string>('');

  // Example attractions data - you would typically load this from an API or data file
  const attractionsData = [
    {
      name: "Taj Mahal",
      state: "Uttar Pradesh",
      description: "One of the seven wonders of the world, the Taj Mahal is a marble mausoleum built by Emperor Shah Jahan.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Taj_Mahal_in_India_-_Kristian_Bertel.jpg/800px-Taj_Mahal_in_India_-_Kristian_Bertel.jpg"
    },
    {
      name: "Golden Temple",
      state: "Punjab",
      description: "The holiest shrine of Sikhism, known for its stunning golden architecture and spiritual significance.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Golden_Temple_Amritsar_Punjab_India.jpg/800px-Golden_Temple_Amritsar_Punjab_India.jpg"
    },
    {
      name: "Mysore Palace",
      state: "Karnataka",
      description: "A historical palace known for its Indo-Saracenic architecture and the annual Mysore Dasara festival.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mysore_Palace_Morning.jpg/800px-Mysore_Palace_Morning.jpg"
    },
    {
      name: "Ajanta and Ellora Caves",
      state: "Maharashtra",
      description: "Ancient rock-cut cave monuments featuring Buddhist, Hindu and Jain sculptures and paintings.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Ellora_Cave_Temple_16.jpg/800px-Ellora_Cave_Temple_16.jpg"
    },
    {
      name: "Backwaters of Kerala",
      state: "Kerala",
      description: "A network of lagoons, lakes, and canals parallel to the Arabian Sea coast, famous for houseboat cruises.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Kerala_house_boat_DSW.jpg/800px-Kerala_house_boat_DSW.jpg"
    },
    {
      name: "Hawa Mahal",
      state: "Rajasthan",
      description: "A magnificent palace with 953 small windows, built so royal women could observe street festivals without being seen.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Hawa_Mahal_Jaipur_JLM0005.jpg/800px-Hawa_Mahal_Jaipur_JLM0005.jpg"
    },
    {
      name: "Khajuraho Temples",
      state: "Madhya Pradesh",
      description: "Famous for their nagara-style architectural symbolism and erotic sculptures, these are UNESCO World Heritage sites.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Khajuraho_Group_of_Monuments-B7.jpg/800px-Khajuraho_Group_of_Monuments-B7.jpg"
    },
    {
      name: "Valley of Flowers",
      state: "Uttarakhand",
      description: "A national park known for its meadows of endemic alpine flowers and the variety of flora.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Valley_of_Flowers_National_Park.jpg/800px-Valley_of_Flowers_National_Park.jpg"
    }
  ];

  const filteredAttractions = filterState 
    ? attractionsData.filter(attraction => attraction.state === filterState) 
    : attractionsData;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4">
        <section className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-sm font-medium mb-4">
              Cultural Explorer
            </span>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Tourist Attractions
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover India's most iconic destinations and hidden gems
            </p>
          </motion.div>
        </section>
        
        <section className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-display font-semibold">Featured Attractions</h2>
            <div className="relative">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } shadow-sm border border-gray-200 dark:border-gray-700`}>
                <Filter size={18} className="text-muted-foreground" />
                <select
                  value={filterState}
                  onChange={(e) => setFilterState(e.target.value)}
                  className="bg-transparent outline-none appearance-none pr-8 text-sm"
                >
                  <option value="">All States</option>
                  {states.map((state) => (
                    <option key={state.id} value={state.name}>{state.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAttractions.map((attraction, index) => (
              <motion.div
                key={attraction.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`block h-full rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <div className="h-48 relative">
                  <img 
                    src={attraction.image} 
                    alt={attraction.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 px-4 py-2 bg-black/50 text-white w-full">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      <span className="text-sm">{attraction.state}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-display font-semibold mb-2">{attraction.name}</h3>
                  <p className="text-muted-foreground text-sm">{attraction.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
        
        <section className="mb-16">
          <StateCard
            title="Plan Your Visit"
            icon={<MapPin size={24} />}
          >
            <div className="space-y-4">
              <p className="text-muted-foreground">
                India's diverse landscape offers everything from mountains and valleys to deserts and beaches.
                Plan your visit based on the season, as different parts of India experience different climate patterns throughout the year.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h4 className="font-medium mb-2">Best Time to Visit</h4>
                  <p className="text-sm text-muted-foreground">
                    October to March is generally the best time to visit most parts of India, 
                    when the weather is pleasant and suitable for sightseeing.
                  </p>
                </div>
                
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h4 className="font-medium mb-2">Travel Tips</h4>
                  <p className="text-sm text-muted-foreground">
                    Carry appropriate clothing based on the region and season. Always carry drinking water and stay hydrated.
                    Respect local customs and traditions when visiting religious sites.
                  </p>
                </div>
              </div>
            </div>
          </StateCard>
        </section>
      </div>
    </Layout>
  );
};

export default TouristAttractions;
