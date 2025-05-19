
import React from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { CloudSun, CloudRain, CloudSnow } from 'lucide-react';
import StateCard from '../components/StateCard';
import { useTheme } from '../context/ThemeContext';

const WeatherPatterns = () => {
  const { theme } = useTheme();

  // Example climate data for different regions
  const climateData = [
    {
      region: "North India",
      states: ["Punjab", "Haryana", "Uttar Pradesh", "Delhi", "Rajasthan"],
      seasons: {
        summer: "Hot and dry with temperatures reaching 45°C in May-June",
        monsoon: "Moderate rainfall from July to September",
        winter: "Cool to cold with temperatures dropping below 5°C in December-January",
        spring: "Pleasant with moderate temperatures from February to April"
      },
      icon: <CloudSun size={24} />
    },
    {
      region: "South India",
      states: ["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana"],
      seasons: {
        summer: "Hot and humid with temperatures around 30-35°C from March to May",
        monsoon: "Heavy rainfall during both southwest (June-September) and northeast monsoons (October-December)",
        winter: "Mild and pleasant with temperatures rarely going below 20°C from December to February",
        spring: "Warm with gradually increasing temperatures from February to March"
      },
      icon: <CloudRain size={24} />
    },
    {
      region: "East India",
      states: ["West Bengal", "Bihar", "Jharkhand", "Odisha"],
      seasons: {
        summer: "Hot and humid with temperatures around 35-40°C from April to June",
        monsoon: "Heavy rainfall from June to September",
        winter: "Cool with temperatures around 15-25°C from December to February",
        spring: "Moderate temperatures from February to March"
      },
      icon: <CloudRain size={24} />
    },
    {
      region: "Northeast India",
      states: ["Assam", "Meghalaya", "Arunachal Pradesh", "Nagaland", "Manipur", "Mizoram", "Tripura", "Sikkim"],
      seasons: {
        summer: "Moderate temperatures around 25-32°C from May to June",
        monsoon: "Very heavy rainfall from June to September, with Cherrapunji and Mawsynram being among the wettest places on Earth",
        winter: "Cool to cold with temperatures around 10-15°C from December to February",
        spring: "Pleasant with moderate temperatures from March to April"
      },
      icon: <CloudRain size={24} />
    },
    {
      region: "Western India",
      states: ["Gujarat", "Maharashtra", "Goa"],
      seasons: {
        summer: "Hot with temperatures around 35-40°C from April to June",
        monsoon: "Heavy rainfall from June to September",
        winter: "Mild with temperatures around 15-25°C from December to February",
        spring: "Moderate temperatures from February to March"
      },
      icon: <CloudSun size={24} />
    },
    {
      region: "Central India",
      states: ["Madhya Pradesh", "Chhattisgarh"],
      seasons: {
        summer: "Hot with temperatures around 35-45°C from April to June",
        monsoon: "Moderate rainfall from July to September",
        winter: "Cool with temperatures around 10-25°C from December to February",
        spring: "Moderate temperatures from February to March"
      },
      icon: <CloudSun size={24} />
    },
    {
      region: "Himalayan Region",
      states: ["Himachal Pradesh", "Uttarakhand", "Jammu and Kashmir", "Ladakh"],
      seasons: {
        summer: "Cool to mild with temperatures around 15-25°C from May to June",
        monsoon: "Moderate rainfall and occasional landslides from July to September",
        winter: "Very cold with temperatures often below freezing and heavy snowfall from December to February",
        spring: "Cold to cool with gradually increasing temperatures from March to April"
      },
      icon: <CloudSnow size={24} />
    }
  ];

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
              Weather Patterns
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover India's diverse climate zones and seasonal variations across regions
            </p>
          </motion.div>
        </section>
        
        <section className="mb-12">
          <div className={`rounded-xl p-6 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow-lg mb-8`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                <CloudSun />
              </div>
              <h2 className="text-2xl font-display font-semibold">Climate Overview</h2>
            </div>
            <p className="text-muted-foreground">
              India's climate is strongly influenced by the Himalayas and the Thar Desert, which drive the monsoons. 
              The country has four main seasons: winter (December-February), summer (March-May), 
              monsoon (June-September), and post-monsoon (October-November). Climate varies significantly 
              across India's vast geography, from tropical in the south to temperate and alpine in the 
              Himalayan north, where elevated regions receive sustained winter snowfall.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {climateData.map((climate, index) => (
              <StateCard
                key={climate.region}
                title={climate.region}
                icon={climate.icon}
                delay={index * 0.1}
                collapsible
              >
                <div>
                  <div className="mb-3">
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">States:</h4>
                    <p>{climate.states.join(", ")}</p>
                  </div>
                  
                  <h4 className="font-medium mb-2">Seasonal Variations:</h4>
                  <ul className="space-y-3">
                    <li className="flex gap-3">
                      <div className="mt-1">
                        <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                          <CloudSun size={14} />
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Summer:</span> {climate.seasons.summer}
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="mt-1">
                        <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                          <CloudRain size={14} />
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Monsoon:</span> {climate.seasons.monsoon}
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="mt-1">
                        <div className="w-6 h-6 rounded-full bg-blue-700/10 flex items-center justify-center text-blue-700">
                          <CloudSnow size={14} />
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Winter:</span> {climate.seasons.winter}
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="mt-1">
                        <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                          <CloudSun size={14} />
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Spring:</span> {climate.seasons.spring}
                      </div>
                    </li>
                  </ul>
                </div>
              </StateCard>
            ))}
          </div>
        </section>
        
        <section className="mb-16">
          <h2 className="text-2xl font-display font-semibold mb-6">Weather Impact on Culture</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <h3 className="text-xl font-display font-semibold mb-3">Festivals</h3>
              <p className="text-muted-foreground">
                Many Indian festivals are tied to seasonal changes, such as harvest festivals like Pongal, Baisakhi, and Onam, 
                which celebrate the agricultural cycles determined by weather patterns.
              </p>
            </div>
            
            <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <h3 className="text-xl font-display font-semibold mb-3">Cuisine</h3>
              <p className="text-muted-foreground">
                Regional cuisines have developed based on local climate conditions and available ingredients. 
                Hot, spicy foods are common in warmer regions, while areas with cold climates favor richer, 
                heartier dishes.
              </p>
            </div>
            
            <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <h3 className="text-xl font-display font-semibold mb-3">Architecture</h3>
              <p className="text-muted-foreground">
                Traditional architecture across India reflects adaptations to local climate. From the thick 
                walls of Rajasthani havelis that keep interiors cool, to the sloped roofs in Kerala that 
                manage heavy rainfall.
              </p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default WeatherPatterns;
