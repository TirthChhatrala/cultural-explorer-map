
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Search, Filter } from 'lucide-react';
import { states } from '../data/states';

// Dummy festivals data
const festivalsData = [
  {
    id: 1,
    name: "Pongal",
    description: "A four-day harvest festival celebrated in Tamil Nadu that includes thanksgiving to nature, welcoming the sun, and worship of cattle.",
    date: "January 14-17",
    image: "https://images.unsplash.com/photo-1610825466385-db6c1e9335e6?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    state: "tamilnadu",
    type: "harvest"
  },
  {
    id: 2,
    name: "Onam",
    description: "The most important festival of Kerala celebrated with elaborate feasts, boat races, tiger dances, and beautiful flower arrangements called pookalam.",
    date: "August-September",
    image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    state: "kerala",
    type: "harvest"
  },
  {
    id: 3,
    name: "Pushkar Camel Fair",
    description: "One of the world's largest camel fairs held annually in Rajasthan with trading of livestock, cultural performances, and religious activities.",
    date: "November",
    image: "https://images.unsplash.com/photo-1607836046730-3317bd58a31b?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    state: "rajasthan",
    type: "cultural"
  },
  {
    id: 4,
    name: "Durga Puja",
    description: "A major festival in West Bengal celebrating the victory of Goddess Durga over the demon Mahishasura, featuring elaborate decorations and cultural performances.",
    date: "September-October",
    image: "https://images.unsplash.com/photo-1544949767-9dc1e8880c3b?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    state: "westbengal",
    type: "religious"
  },
  {
    id: 5,
    name: "Diwali",
    description: "The festival of lights celebrated across India, particularly significant in North India, with homes decorated with oil lamps, fireworks, and family gatherings.",
    date: "October-November",
    image: "https://images.unsplash.com/photo-1605021154408-dfaebe27663e?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    state: "uttarpradesh",
    type: "religious"
  },
  {
    id: 6,
    name: "Rann Utsav",
    description: "A vibrant festival held in the white desert of Kutch in Gujarat, showcasing the area's culture, crafts, and offering luxury tent accommodations under the stars.",
    date: "December-February",
    image: "https://images.unsplash.com/photo-1621496503717-028e695f5c44?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    state: "gujarat",
    type: "cultural"
  }
];

const festivalTypes = ["All", "Religious", "Cultural", "Harvest", "National", "Regional"];

const Festivals = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedType, setSelectedType] = useState('All');
  
  // Filter festivals based on search, state, and type
  const filteredFestivals = festivalsData.filter(festival => {
    const matchesSearch = festival.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         festival.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = selectedState === 'all' || festival.state === selectedState;
    const matchesType = selectedType === 'All' || festival.type.toLowerCase() === selectedType.toLowerCase();
    
    return matchesSearch && matchesState && matchesType;
  });

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <section className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
          >
            <span className="inline-block px-3 py-1 bg-india-orange/10 text-india-orange rounded-full text-sm font-medium mb-4">
              Cultural Celebrations
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 tracking-tight">
              Festivals & <span className="text-india-orange">Important Days</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore the vibrant celebrations and significant occasions observed across India's diverse states.
            </p>
          </motion.div>
        </section>

        <section className="mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search festivals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-india-orange/30 focus:border-india-orange outline-none transition-all"
                />
              </div>
              
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative">
                  <Filter className="absolute left-3 top-3 text-gray-400" size={20} />
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="pl-10 pr-8 py-2.5 border rounded-lg appearance-none focus:ring-2 focus:ring-india-orange/30 focus:border-india-orange outline-none transition-all"
                  >
                    <option value="all">All States</option>
                    {states.map(state => (
                      <option key={state.id} value={state.id}>{state.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="relative">
                  <Filter className="absolute left-3 top-3 text-gray-400" size={20} />
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="pl-10 pr-8 py-2.5 border rounded-lg appearance-none focus:ring-2 focus:ring-india-orange/30 focus:border-india-orange outline-none transition-all"
                  >
                    {festivalTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          {filteredFestivals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredFestivals.map((festival, index) => (
                <FestivalCard 
                  key={festival.id}
                  name={festival.name}
                  description={festival.description}
                  date={festival.date}
                  image={festival.image}
                  state={states.find(s => s.id === festival.state)?.name || ''}
                  type={festival.type}
                  delay={index * 0.1}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-muted-foreground text-lg">No festivals found matching your criteria.</p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedState('all');
                  setSelectedType('All');
                }}
                className="mt-4 px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
              >
                Reset Filters
              </button>
            </motion.div>
          )}
        </section>

        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-display font-semibold mb-6 text-center">Festivals Calendar</h2>
            
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x">
                <CalendarQuarter name="January - March" festivals={[
                  { name: "Pongal", state: "Tamil Nadu", date: "January 14-17" },
                  { name: "Republic Day", state: "All India", date: "January 26" },
                  { name: "Holi", state: "North India", date: "March" }
                ]} />
                
                <CalendarQuarter name="April - June" festivals={[
                  { name: "Bihu", state: "Assam", date: "April 14-15" },
                  { name: "Buddha Purnima", state: "All India", date: "May" },
                  { name: "Thrissur Pooram", state: "Kerala", date: "April-May" }
                ]} />
                
                <CalendarQuarter name="July - September" festivals={[
                  { name: "Rath Yatra", state: "Odisha", date: "July" },
                  { name: "Independence Day", state: "All India", date: "August 15" },
                  { name: "Onam", state: "Kerala", date: "August-September" }
                ]} />
                
                <CalendarQuarter name="October - December" festivals={[
                  { name: "Durga Puja", state: "West Bengal", date: "October" },
                  { name: "Diwali", state: "All India", date: "October-November" },
                  { name: "Christmas", state: "All India", date: "December 25" }
                ]} />
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </Layout>
  );
};

const FestivalCard = ({ name, description, date, image, state, type, delay = 0 }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        ease: [0.19, 1, 0.22, 1], 
        delay 
      }}
      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col md:flex-row"
    >
      <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>
      <div className="p-6 md:w-2/3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium px-2.5 py-1 bg-india-orange/10 text-india-orange rounded-full">
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
        </div>
        
        <h3 className="text-xl font-display font-semibold mb-2">{name}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{description}</p>
        
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {date}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {state}
          </span>
        </div>
      </div>
    </motion.article>
  );
};

const CalendarQuarter = ({ name, festivals }) => {
  return (
    <div className="p-4">
      <h3 className="text-lg font-display font-semibold mb-3 text-india-orange">{name}</h3>
      <ul className="space-y-3">
        {festivals.map((festival, index) => (
          <li key={index} className="border-b border-gray-100 pb-2 last:border-0 last:pb-0">
            <span className="font-medium">{festival.name}</span>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{festival.state}</span>
              <span>{festival.date}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Festivals;
