
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Search, Filter, User, Info } from 'lucide-react';
import { states } from '../data/states';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

// Extended festivals data with more details and freedom fighter connections
const festivalsData = [
  {
    id: 1,
    name: "Pongal",
    description: "A four-day harvest festival celebrated in Tamil Nadu that includes thanksgiving to nature, welcoming the sun, and worship of cattle.",
    date: "January 14-17",
    image: "https://images.unsplash.com/photo-1610825466385-db6c1e9335e6?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    state: "tamilnadu",
    type: "harvest",
    significance: "Pongal marks the start of the sun's northward journey and is dedicated to the Sun God. The festival's name literally means 'to boil over' and refers to the tradition of boiling freshly harvested rice with milk and jaggery in a new clay pot until it overflows.",
    freedomFighterConnection: "V.O. Chidambaram Pillai, a prominent freedom fighter from Tamil Nadu, advocated for preserving cultural traditions like Pongal even during the independence movement."
  },
  {
    id: 2,
    name: "Onam",
    description: "The most important festival of Kerala celebrated with elaborate feasts, boat races, tiger dances, and beautiful flower arrangements called pookalam.",
    date: "August-September",
    image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    state: "kerala",
    type: "harvest",
    significance: "Onam commemorates the return of the mythical King Mahabali, who is believed to visit Kerala during this festival. The celebration includes sumptuous feasts called Onasadya, boat races (Vallam Kali), and the creation of intricate flower carpets (Pookalam).",
    freedomFighterConnection: "K. Kelappan, known as the 'Kerala Gandhi,' encouraged the celebration of Onam as a unifying festival that transcended religious boundaries during the independence struggle."
  },
  {
    id: 3,
    name: "Pushkar Camel Fair",
    description: "One of the world's largest camel fairs held annually in Rajasthan with trading of livestock, cultural performances, and religious activities.",
    date: "November",
    image: "https://images.unsplash.com/photo-1607836046730-3317bd58a31b?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    state: "rajasthan",
    type: "cultural",
    significance: "The Pushkar Camel Fair coincides with the Kartik Purnima, a sacred full moon day. While camel trading is the main attraction, the fair includes folk performances, religious rituals at the Pushkar Lake, and a vibrant crafts market.",
    freedomFighterConnection: "Arjun Lal Sethi, a freedom fighter from Rajasthan, used traditional gatherings like the Pushkar Fair to spread messages of independence and unity among rural communities."
  },
  {
    id: 4,
    name: "Durga Puja",
    description: "A major festival in West Bengal celebrating the victory of Goddess Durga over the demon Mahishasura, featuring elaborate decorations and cultural performances.",
    date: "September-October",
    image: "https://images.unsplash.com/photo-1544949767-9dc1e8880c3b?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    state: "westbengal",
    type: "religious",
    significance: "Durga Puja celebrates the victory of Goddess Durga over the buffalo demon Mahishasura. The festival features spectacular temporary temples (pandals), elaborate idols of the goddess, cultural performances, and community feasting.",
    freedomFighterConnection: "Subhas Chandra Bose often attended Durga Puja celebrations and emphasized how the goddess symbolized the strength needed in India's fight for independence."
  },
  {
    id: 5,
    name: "Diwali",
    description: "The festival of lights celebrated across India, particularly significant in North India, with homes decorated with oil lamps, fireworks, and family gatherings.",
    date: "October-November",
    image: "https://images.unsplash.com/photo-1605021154408-dfaebe27663e?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    state: "uttarpradesh",
    type: "religious",
    significance: "Diwali symbolizes the victory of light over darkness and good over evil. In Uttar Pradesh, it has special significance as Lord Rama's homecoming to Ayodhya after 14 years of exile, celebrated with diyas (oil lamps), rangoli, prayers, and exchange of sweets.",
    freedomFighterConnection: "Rani Lakshmi Bai of Jhansi used the occasion of Diwali to plan strategies with fellow revolutionaries, as the festival provided a natural cover for gatherings without raising suspicion."
  },
  {
    id: 6,
    name: "Rann Utsav",
    description: "A vibrant festival held in the white desert of Kutch in Gujarat, showcasing the area's culture, crafts, and offering luxury tent accommodations under the stars.",
    date: "December-February",
    image: "https://images.unsplash.com/photo-1621496503717-028e695f5c44?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    state: "gujarat",
    type: "cultural",
    significance: "Rann Utsav showcases the culture, crafts, and natural beauty of the Kutch region. Set against the backdrop of the white salt desert, it features traditional music and dance, handicrafts, and adventure activities under the full moon.",
    freedomFighterConnection: "Sardar Vallabhbhai Patel, who hailed from Gujarat, emphasized preserving local cultural festivals as part of national identity even while fighting for independence."
  },
  {
    id: 7,
    name: "Ganesh Chaturthi",
    description: "A ten-day festival honoring the elephant-headed God Ganesha, celebrated with great devotion throughout Maharashtra with elaborate idol installations.",
    date: "August-September",
    image: "https://images.unsplash.com/photo-1629972234996-32742b65c3db?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    state: "maharashtra",
    type: "religious",
    significance: "Ganesh Chaturthi celebrates the birth of Lord Ganesha, the remover of obstacles. The festival begins with the installation of clay idols at home or in public pandals and concludes with their immersion in water. It's a time for prayers, community gatherings, and cultural events.",
    freedomFighterConnection: "Lokmanya Tilak transformed Ganesh Chaturthi from a private household celebration into a grand public event to build unity during the Indian independence movement."
  },
  {
    id: 8,
    name: "Bihu",
    description: "The most important festival of Assam, celebrating the agricultural cycle with traditional dance, music, and feasting.",
    date: "April, October, and January",
    image: "https://images.unsplash.com/photo-1603204077779-bed963ea7d0e?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    state: "assam",
    type: "harvest",
    significance: "Bihu is celebrated three times a year, with Bohag Bihu (spring) being the most important. It marks the beginning of the agricultural season and the Assamese New Year. Celebrations include Bihu dance, feasts, and exchange of Bihuwan (traditional handwoven gamcha).",
    freedomFighterConnection: "Kanaklata Barua, a young freedom fighter from Assam, used Bihu gatherings to secretly spread the message of independence before her martyrdom at the age of 17."
  }
];

const festivalTypes = ["All", "Religious", "Cultural", "Harvest", "National", "Regional"];

const Festivals = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedFestival, setSelectedFestival] = useState(null);
  const { theme } = useTheme();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter festivals based on search, state, and type
  const filteredFestivals = festivalsData.filter(festival => {
    const matchesSearch = festival.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         festival.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = selectedState === 'all' || festival.state === selectedState;
    const matchesType = selectedType === 'All' || festival.type.toLowerCase() === selectedType.toLowerCase();
    
    return matchesSearch && matchesState && matchesType;
  });

  const handleFestivalClick = (festival) => {
    setSelectedFestival(festival);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeDetails = () => {
    setSelectedFestival(null);
  };

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

        {selectedFestival ? (
          <FestivalDetailView festival={selectedFestival} onClose={closeDetails} />
        ) : (
          <>
            <section className="mb-8">
              <div className={`rounded-xl shadow-sm p-4 md:p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search festivals..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-india-orange/30 focus:border-india-orange outline-none transition-all ${
                        theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`}
                    />
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative">
                      <Filter className="absolute left-3 top-3 text-gray-400" size={20} />
                      <select
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                        className={`pl-10 pr-8 py-2.5 border rounded-lg appearance-none focus:ring-2 focus:ring-india-orange/30 focus:border-india-orange outline-none transition-all ${
                          theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                        }`}
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
                        className={`pl-10 pr-8 py-2.5 border rounded-lg appearance-none focus:ring-2 focus:ring-india-orange/30 focus:border-india-orange outline-none transition-all ${
                          theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                        }`}
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
                      festival={festival}
                      state={states.find(s => s.id === festival.state)?.name || ''}
                      delay={index * 0.1}
                      onClick={() => handleFestivalClick(festival)}
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
                    className={`mt-4 px-4 py-2 rounded-lg hover:bg-secondary/80 transition-colors ${
                      theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-secondary text-foreground'
                    }`}
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
                
                <div className={`rounded-xl shadow-sm overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
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
          </>
        )}
      </div>
    </Layout>
  );
};

const FestivalCard = ({ festival, state, delay = 0, onClick }) => {
  const { theme } = useTheme();
  
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        ease: [0.19, 1, 0.22, 1], 
        delay 
      }}
      onClick={onClick}
      className={`rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col md:flex-row cursor-pointer ${
        theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
      }`}
    >
      <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
        <img 
          src={festival.image} 
          alt={festival.name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>
      <div className="p-6 md:w-2/3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium px-2.5 py-1 bg-india-orange/10 text-india-orange rounded-full">
            {festival.type.charAt(0).toUpperCase() + festival.type.slice(1)}
          </span>
        </div>
        
        <h3 className="text-xl font-display font-semibold mb-2">{festival.name}</h3>
        <p className={`text-sm mb-4 line-clamp-3 ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}`}>
          {festival.description}
        </p>
        
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {festival.date}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {state}
          </span>
        </div>
      </div>
    </motion.article>
  );
};

const FestivalDetailView = ({ festival, onClose }) => {
  const { theme } = useTheme();
  const stateName = states.find(s => s.id === festival.state)?.name || '';
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mb-16"
    >
      <button 
        onClick={onClose}
        className={`mb-6 px-4 py-2 rounded-lg flex items-center gap-2 ${
          theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-secondary text-foreground hover:bg-secondary/80'
        }`}
      >
        ← Back to All Festivals
      </button>
      
      <div className={`rounded-xl overflow-hidden shadow-lg ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="relative h-72 md:h-96">
          <img 
            src={festival.image} 
            alt={festival.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
            <span className="text-xs font-medium px-2.5 py-1 bg-india-orange/90 text-white rounded-full inline-block mb-2 w-fit">
              {festival.type.charAt(0).toUpperCase() + festival.type.slice(1)}
            </span>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">{festival.name}</h1>
            <div className="flex flex-wrap gap-4 text-white/90">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> {festival.date}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {stateName}
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-display font-semibold mb-4">About {festival.name}</h2>
              <p className={`mb-6 leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {festival.description}
              </p>
              
              <h3 className="text-xl font-display font-semibold mb-3">Significance</h3>
              <p className={`mb-6 leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {festival.significance}
              </p>
              
              <h3 className="text-xl font-display font-semibold mb-3">
                <div className="flex items-center gap-2">
                  <User size={20} />
                  Freedom Fighter Connection
                </div>
              </h3>
              <p className={`mb-6 leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {festival.freedomFighterConnection}
              </p>
              
              <Link to="/freedom-fighters" className="inline-flex items-center gap-2 text-india-orange hover:underline">
                <Info size={16} />
                View all Freedom Fighters of India
              </Link>
            </div>
            
            <div>
              <div className={`rounded-xl overflow-hidden p-6 ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <h3 className="text-xl font-display font-semibold mb-4">Festival Highlights</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="min-w-2 h-2 rounded-full bg-india-orange mt-2"></div>
                    <span>Celebrated in {stateName}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="min-w-2 h-2 rounded-full bg-india-orange mt-2"></div>
                    <span>Occurs during {festival.date}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="min-w-2 h-2 rounded-full bg-india-orange mt-2"></div>
                    <span>Type: {festival.type.charAt(0).toUpperCase() + festival.type.slice(1)} festival</span>
                  </li>
                </ul>
                
                {festival.state && (
                  <div className="mt-6">
                    <Link 
                      to={`/state/${festival.state}`}
                      className={`block w-full py-2 px-4 text-center rounded-lg ${
                        theme === 'dark' 
                          ? 'bg-india-orange text-white hover:bg-india-orange/90' 
                          : 'bg-india-orange text-white hover:bg-india-orange/90'
                      }`}
                    >
                      Explore {stateName}
                    </Link>
                  </div>
                )}
              </div>
              
              <div className={`rounded-xl overflow-hidden p-6 mt-6 ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <h3 className="text-xl font-display font-semibold mb-4">Related Festivals</h3>
                {festivalsData
                  .filter(f => f.state === festival.state && f.id !== festival.id)
                  .slice(0, 3)
                  .map(relatedFestival => (
                    <div 
                      key={relatedFestival.id} 
                      onClick={() => onClose()}
                      className={`p-4 mb-3 last:mb-0 rounded-lg cursor-pointer ${
                        theme === 'dark' ? 'bg-gray-800 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'
                      }`}
                    >
                      <div className="font-medium">{relatedFestival.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{relatedFestival.date}</div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CalendarQuarter = ({ name, festivals }) => {
  const { theme } = useTheme();
  
  return (
    <div className="p-4">
      <h3 className="text-lg font-display font-semibold mb-3 text-india-orange">{name}</h3>
      <ul className="space-y-3">
        {festivals.map((festival, index) => (
          <li key={index} className={`border-b pb-2 last:border-0 last:pb-0 ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-100'
          }`}>
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
