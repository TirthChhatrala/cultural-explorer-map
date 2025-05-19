
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { Landmark, Castle, Church, Search } from 'lucide-react';
import StateCard from '../components/StateCard';
import { useTheme } from '../context/ThemeContext';

const HistoricalSites = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Example historical sites data
  const sitesData = [
    {
      name: "Qutub Minar",
      location: "Delhi",
      period: "Medieval",
      year: "1193-1220 CE",
      significance: "UNESCO World Heritage Site, tallest brick minaret in the world.",
      description: "Qutub Minar is a 73-meter tall minaret built by Qutb al-Din Aibak, founder of the Delhi Sultanate. The tower is adorned with intricate carvings and verses from the Quran.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Qutb_Minar_Overview.jpg/800px-Qutb_Minar_Overview.jpg",
      type: "Monument"
    },
    {
      name: "Ajanta Caves",
      location: "Maharashtra",
      period: "Ancient",
      year: "2nd century BCE - 6th century CE",
      significance: "UNESCO World Heritage Site, finest surviving examples of ancient Indian art.",
      description: "The Ajanta Caves are 29 rock-cut Buddhist cave monuments containing paintings and sculptures that are among the finest examples of ancient Indian art and architecture.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Ajanta_cave9_facade.jpg/800px-Ajanta_cave9_facade.jpg",
      type: "Cave Temple"
    },
    {
      name: "Konark Sun Temple",
      location: "Odisha",
      period: "Medieval",
      year: "13th century CE",
      significance: "UNESCO World Heritage Site, architectural marvel of Eastern India.",
      description: "The Konark Sun Temple is dedicated to the Hindu Sun God Surya. The temple is in the shape of a gigantic chariot with intricately carved stone wheels, pillars, and walls.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Konarka_Temple.jpg/800px-Konarka_Temple.jpg",
      type: "Temple"
    },
    {
      name: "Hampi",
      location: "Karnataka",
      period: "Medieval",
      year: "14th-16th century CE",
      significance: "UNESCO World Heritage Site, capital of the Vijayanagara Empire.",
      description: "Hampi is a vast ruined city that encompasses an area of 16 square miles. It contains numerous temples, royal complexes, and other structures that showcase the wealth and architectural prowess of the Vijayanagara Empire.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Hampi_virupaksha_temple.jpg/800px-Hampi_virupaksha_temple.jpg",
      type: "Ancient City"
    },
    {
      name: "Fatehpur Sikri",
      location: "Uttar Pradesh",
      period: "Medieval",
      year: "1569-1585 CE",
      significance: "UNESCO World Heritage Site, former capital of the Mughal Empire.",
      description: "Fatehpur Sikri was built by Emperor Akbar and served as the capital of the Mughal Empire for about 10 years. The complex includes several remarkable buildings, including the Buland Darwaza, Jama Masjid, and Panch Mahal.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Buland_Darwaza_Gate_of_Victory.jpg/800px-Buland_Darwaza_Gate_of_Victory.jpg",
      type: "Historical Complex"
    },
    {
      name: "Khajuraho Group of Monuments",
      location: "Madhya Pradesh",
      period: "Medieval",
      year: "950-1050 CE",
      significance: "UNESCO World Heritage Site, known for their nagara-style architectural symbolism and erotic sculptures.",
      description: "The Khajuraho Group of Monuments includes several Hindu and Jain temples known for their beautiful stone carvings. The temples are famous for their nagara-style architectural symbolism and explicit sculptures.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Khajuraho_-_Kandariya_Mahadeo_Temple_2.jpg/800px-Khajuraho_-_Kandariya_Mahadeo_Temple_2.jpg",
      type: "Temple Complex"
    },
    {
      name: "Sanchi Stupa",
      location: "Madhya Pradesh",
      period: "Ancient",
      year: "3rd century BCE - 1st century CE",
      significance: "UNESCO World Heritage Site, one of the oldest stone structures in India.",
      description: "The Great Stupa at Sanchi is one of the oldest stone structures in India and was commissioned by Emperor Ashoka in the 3rd century BCE. It is known for its massive hemispherical dome and the intricate carvings on its four gateways.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Sanchi_Stupa_from_Eastern_gateway%2C_Madhya_Pradesh.jpg/800px-Sanchi_Stupa_from_Eastern_gateway%2C_Madhya_Pradesh.jpg",
      type: "Buddhist Monument"
    },
    {
      name: "Rani ki Vav",
      location: "Gujarat",
      period: "Medieval",
      year: "11th century CE",
      significance: "UNESCO World Heritage Site, one of the finest stepwells in India.",
      description: "Rani ki Vav, or the Queen's Stepwell, is an intricately constructed stepwell built as a memorial to King Bhimdev I by his widowed queen. It is known for its sculptures and design, showcasing the height of the Maru-Gurjara architectural style.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Rani_ki_vav_Patan_Gujarat.jpg/800px-Rani_ki_vav_Patan_Gujarat.jpg",
      type: "Stepwell"
    }
  ];
  
  // Filter sites based on search term
  const filteredSites = sitesData.filter(site => 
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Group sites by period
  const ancientSites = filteredSites.filter(site => site.period === "Ancient");
  const medievalSites = filteredSites.filter(site => site.period === "Medieval");

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
              Historical & Cultural Sites
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover India's rich architectural heritage through its remarkable historical monuments
            </p>
          </motion.div>
        </section>
        
        <section className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-display font-semibold">Notable Historical Sites</h2>
            <div className={`relative max-w-xs ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              <input
                type="text"
                placeholder="Search sites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 w-full rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700 focus:border-gray-600' 
                    : 'bg-white border-gray-300 focus:border-gray-400'
                } border focus:outline-none`}
              />
              <Search className="absolute left-3 top-2.5 text-muted-foreground" size={18} />
            </div>
          </div>
          
          <StateCard
            title="Ancient Period (up to 8th century CE)"
            icon={<Church size={24} />}
            collapsible={false}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ancientSites.map((site, index) => (
                <div 
                  key={site.name}
                  className={`rounded-lg overflow-hidden shadow-sm ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                  }`}
                >
                  <div className="relative h-48">
                    <img 
                      src={site.image} 
                      alt={site.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-3">
                      <div className="flex justify-between items-center">
                        <h3 className="font-display font-semibold">{site.name}</h3>
                        <span className="text-xs px-2 py-1 bg-white/20 rounded-full">{site.year}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-white/80 mt-1">
                        <Landmark size={12} />
                        <span>{site.location}</span>
                        <span className="mx-1">•</span>
                        <span>{site.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm mb-2"><span className="font-medium">Significance:</span> {site.significance}</p>
                    <p className="text-sm text-muted-foreground">{site.description}</p>
                  </div>
                </div>
              ))}
              
              {ancientSites.length === 0 && (
                <p className="text-muted-foreground col-span-2">No ancient sites found matching your search.</p>
              )}
            </div>
          </StateCard>
          
          <div className="mt-8">
            <StateCard
              title="Medieval Period (8th-18th century CE)"
              icon={<Castle size={24} />}
              collapsible={false}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {medievalSites.map((site, index) => (
                  <div 
                    key={site.name}
                    className={`rounded-lg overflow-hidden shadow-sm ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                    }`}
                  >
                    <div className="relative h-48">
                      <img 
                        src={site.image} 
                        alt={site.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-3">
                        <div className="flex justify-between items-center">
                          <h3 className="font-display font-semibold">{site.name}</h3>
                          <span className="text-xs px-2 py-1 bg-white/20 rounded-full">{site.year}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-white/80 mt-1">
                          <Landmark size={12} />
                          <span>{site.location}</span>
                          <span className="mx-1">•</span>
                          <span>{site.type}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm mb-2"><span className="font-medium">Significance:</span> {site.significance}</p>
                      <p className="text-sm text-muted-foreground">{site.description}</p>
                    </div>
                  </div>
                ))}
                
                {medievalSites.length === 0 && (
                  <p className="text-muted-foreground col-span-2">No medieval sites found matching your search.</p>
                )}
              </div>
            </StateCard>
          </div>
        </section>
        
        <section className="mb-16">
          <h2 className="text-2xl font-display font-semibold mb-6">Architectural Styles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <h3 className="text-xl font-display font-semibold mb-3">Nagara Style</h3>
              <p className="text-muted-foreground">
                Developed in North India, characterized by a tall curved spire (shikhara) and ornate decoration. 
                Examples include temples at Khajuraho and the Sun Temple at Konark.
              </p>
            </div>
            
            <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <h3 className="text-xl font-display font-semibold mb-3">Dravida Style</h3>
              <p className="text-muted-foreground">
                South Indian temple architecture featuring pyramid-shaped towers (vimana), enclosed by rectangular walls. 
                Notable examples include Brihadisvara Temple at Thanjavur and Shore Temple at Mahabalipuram.
              </p>
            </div>
            
            <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <h3 className="text-xl font-display font-semibold mb-3">Indo-Islamic Style</h3>
              <p className="text-muted-foreground">
                Blend of Indian and Islamic architectural elements featuring domes, arches, and intricate geometrical patterns. 
                Examples include the Taj Mahal, Qutub Minar, and various structures in Fatehpur Sikri.
              </p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HistoricalSites;
