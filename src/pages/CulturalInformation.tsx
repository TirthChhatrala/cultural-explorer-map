
import React from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Utensils, MapPin, CloudSun, Shirt, Landmark } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const CulturalInformation = () => {
  const { theme } = useTheme();
  
  const culturalSections = [
    {
      title: "Cuisine & Food",
      description: "Explore the diverse culinary traditions across Indian states",
      icon: <Utensils size={24} />,
      link: "/cuisine-food",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Indian_Food_at_a_muslim_wedding.jpg/800px-Indian_Food_at_a_muslim_wedding.jpg",
    },
    {
      title: "Tourist Attractions",
      description: "Discover India's most iconic destinations and hidden gems",
      icon: <MapPin size={24} />,
      link: "/tourist-attractions",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Inside_Jama_Masjid_of_Delhi.jpg/800px-Inside_Jama_Masjid_of_Delhi.jpg",
    },
    {
      title: "Weather Patterns",
      description: "Learn about India's diverse climate zones and seasonal variations",
      icon: <CloudSun size={24} />,
      link: "/weather-patterns",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Cherry_blossoms_at_the_hindu_kush.jpg/800px-Cherry_blossoms_at_the_hindu_kush.jpg",
    },
    {
      title: "Traditional Clothing",
      description: "Explore the diverse textile traditions and attire across Indian regions",
      icon: <Shirt size={24} />,
      link: "/traditional-clothing",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Rajput_wedding_turban_chaniya_choli_wedding_photo_shoot.jpg/800px-Rajput_wedding_turban_chaniya_choli_wedding_photo_shoot.jpg",
    },
    {
      title: "Historical & Cultural Sites",
      description: "Discover India's rich architectural heritage through its remarkable monuments",
      icon: <Landmark size={24} />,
      link: "/historical-sites",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Golden_Temple%2C_Amritsar%2C_Punjab%2C_India.jpg/800px-Golden_Temple%2C_Amritsar%2C_Punjab%2C_India.jpg",
    }
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4">
        <section className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-sm font-medium mb-4">
              Explore India
            </span>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Cultural & Local Information
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover the rich cultural heritage of India through its cuisine, attractions, 
              weather patterns, traditional clothing, and historical sites
            </p>
          </motion.div>
        </section>
        
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {culturalSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <Link 
                  to={section.link}
                  className="block h-full"
                >
                  <div className={`h-full rounded-xl overflow-hidden ${
                    theme === 'dark' 
                      ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700' 
                      : 'bg-white hover:bg-gray-50 border border-gray-200'
                  } transition-all duration-300 shadow hover:shadow-md`}>
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={section.image} 
                        alt={section.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          theme === 'dark' ? 'bg-gray-700 text-red-400' : 'bg-red-500/10 text-red-500'
                        }`}>
                          {section.icon}
                        </div>
                        <h3 className="text-xl font-display font-semibold">{section.title}</h3>
                      </div>
                      <p className="text-muted-foreground mb-4">{section.description}</p>
                      <div className={`inline-flex items-center text-sm font-medium ${
                        theme === 'dark' ? 'text-red-400' : 'text-red-500'
                      }`}>
                        Explore
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
        
        <section className="mb-16">
          <div className={`rounded-xl p-8 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow-lg text-center`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-2xl font-display font-semibold mb-4">Dive Deeper Into Indian Culture</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                India's cultural tapestry is woven with thousands of years of history, diverse traditions, and artistic expressions.
                Explore each section to gain deeper insights into the fascinating aspects of Indian heritage.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                {culturalSections.map((section) => (
                  <Link
                    key={section.title}
                    to={section.link}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                      theme === 'dark' 
                        ? 'bg-gray-700 hover:bg-gray-600' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    {section.icon}
                    <span>{section.title}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default CulturalInformation;
