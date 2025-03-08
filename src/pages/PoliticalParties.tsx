
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { Filter, Search, Flag, Users, MapPin } from 'lucide-react';
import { states } from '../data/states';

// Dummy political parties data
const partiesData = [
  {
    id: 1,
    name: "Bharatiya Janata Party",
    abbreviation: "BJP",
    founded: 1980,
    ideology: "Conservatism, Nationalism, Hindu nationalism",
    leader: "J.P. Nadda (President)",
    description: "One of India's two major political parties, advocating for cultural nationalism (Hindutva) and conservative policies.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Bharatiya_Janata_Party_logo.svg/1200px-Bharatiya_Janata_Party_logo.svg.png",
    color: "#FF9933",
    states: ["uttarpradesh", "gujarat", "madhyapradesh", "karnataka", "rajasthan", "haryana", "himachalpradesh"]
  },
  {
    id: 2,
    name: "Indian National Congress",
    abbreviation: "INC",
    founded: 1885,
    ideology: "Centrism, Liberalism, Social democracy, Secularism",
    leader: "Mallikarjun Kharge (President)",
    description: "One of India's oldest political parties, advocating for secular and liberal democratic values.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Indian_National_Congress_hand_logo.svg/1200px-Indian_National_Congress_hand_logo.svg.png",
    color: "#138808",
    states: ["rajasthan", "punjab", "tamil_nadu", "telangana", "karnataka"]
  },
  {
    id: 3,
    name: "All India Trinamool Congress",
    abbreviation: "AITC",
    founded: 1998,
    ideology: "Populism, Social democracy, Bengali nationalism",
    leader: "Mamata Banerjee (Chairperson)",
    description: "A major political party in West Bengal, formed after splitting from the Indian National Congress.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/All_India_Trinamool_Congress_logo.svg/2048px-All_India_Trinamool_Congress_logo.svg.png",
    color: "#23A3DD",
    states: ["westbengal"]
  },
  {
    id: 4,
    name: "Aam Aadmi Party",
    abbreviation: "AAP",
    founded: 2012,
    ideology: "Populism, Social democracy, Anti-corruption",
    leader: "Arvind Kejriwal (National Convenor)",
    description: "A political party that emerged from the anti-corruption movement, focused on good governance and anti-corruption measures.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Aam_Aadmi_Party_logo.svg/1200px-Aam_Aadmi_Party_logo.svg.png",
    color: "#0065C1",
    states: ["delhi", "punjab"]
  },
  {
    id: 5,
    name: "Dravida Munnetra Kazhagam",
    abbreviation: "DMK",
    founded: 1949,
    ideology: "Dravidian politics, Social democracy, Tamil nationalism",
    leader: "M. K. Stalin (President)",
    description: "A major political party in Tamil Nadu, promoting Dravidian ideology and Tamil cultural nationalism.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Seal_of_Dravida_Munnetra_Kazhagam.svg/1200px-Seal_of_Dravida_Munnetra_Kazhagam.svg.png",
    color: "#FF0000",
    states: ["tamilnadu"]
  },
  {
    id: 6,
    name: "Communist Party of India (Marxist)",
    abbreviation: "CPI(M)",
    founded: 1964,
    ideology: "Communism, Marxism-Leninism",
    leader: "Sitaram Yechury (General Secretary)",
    description: "A communist political party in India advocating for socialism and worker's rights.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Communist_Party_of_India_%28Marxist%29_logo.svg/1200px-Communist_Party_of_India_%28Marxist%29_logo.svg.png",
    color: "#FF0000",
    states: ["kerala", "westbengal"]
  }
];

const PoliticalParties = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  
  // Filter parties based on search and state
  const filteredParties = partiesData.filter(party => {
    const matchesSearch = party.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         party.abbreviation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         party.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = selectedState === 'all' || party.states.includes(selectedState);
    
    return matchesSearch && matchesState;
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
              Political Landscape
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 tracking-tight">
              Political <span className="text-india-orange">Parties</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Learn about the major political parties and their influence across different states in India.
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
                  placeholder="Search political parties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-india-orange/30 focus:border-india-orange outline-none transition-all"
                />
              </div>
              
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
            </div>
          </div>
        </section>

        <section className="mb-16">
          {filteredParties.length > 0 ? (
            <div className="space-y-8">
              {filteredParties.map((party, index) => (
                <PartyCard 
                  key={party.id}
                  name={party.name}
                  abbreviation={party.abbreviation}
                  founded={party.founded}
                  ideology={party.ideology}
                  leader={party.leader}
                  description={party.description}
                  logo={party.logo}
                  color={party.color}
                  states={party.states.map(stateId => states.find(s => s.id === stateId)?.name).filter(Boolean)}
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
              <p className="text-muted-foreground text-lg">No political parties found matching your criteria.</p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedState('all');
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
            <h2 className="text-3xl font-display font-semibold mb-6 text-center">Electoral System</h2>
            
            <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-display font-semibold mb-3">General Elections</h3>
                  <p className="text-muted-foreground mb-4">
                    India follows a parliamentary system of government, where general elections are held every five years to elect members of the Lok Sabha (House of the People), the lower house of India's bicameral parliament.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="bg-india-orange/20 text-india-orange rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">1</span>
                      <span>India uses the first-past-the-post electoral system.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-india-orange/20 text-india-orange rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">2</span>
                      <span>The party or coalition with a majority forms the government.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-india-orange/20 text-india-orange rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">3</span>
                      <span>The Prime Minister is typically the leader of the majority party or coalition.</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-display font-semibold mb-3">State Elections</h3>
                  <p className="text-muted-foreground mb-4">
                    State Legislative Assembly elections are held separately for each state, following a similar electoral system. The Chief Minister is typically the leader of the majority party or coalition in the state.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="bg-india-blue/20 text-india-blue rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">1</span>
                      <span>State governments have significant autonomy in certain policy areas.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-india-blue/20 text-india-blue rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">2</span>
                      <span>Different parties may govern at the state and central levels.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-india-blue/20 text-india-blue rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">3</span>
                      <span>Regional parties often play significant roles in state politics.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </Layout>
  );
};

const PartyCard = ({ name, abbreviation, founded, ideology, leader, description, logo, color, states, delay = 0 }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        ease: [0.19, 1, 0.22, 1], 
        delay 
      }}
      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4 flex flex-col items-center">
            <div 
              className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center mb-4"
              style={{ backgroundColor: `${color}20` }}
            >
              <img 
                src={logo} 
                alt={`${name} logo`} 
                className="w-16 h-16 object-contain"
              />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-display font-semibold">{name}</h3>
              <p className="text-india-orange font-medium">{abbreviation}</p>
              <div className="mt-2 text-sm text-muted-foreground">
                <p>Founded: {founded}</p>
              </div>
            </div>
          </div>
          
          <div className="md:w-3/4">
            <div className="flex flex-col md:flex-row justify-between mb-3">
              <div>
                <span className="text-sm font-medium">Ideology:</span>
                <p className="text-muted-foreground text-sm">{ideology}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Leader:</span>
                <p className="text-muted-foreground text-sm">{leader}</p>
              </div>
            </div>
            
            <p className="text-muted-foreground mb-4">{description}</p>
            
            <div>
              <span className="text-sm font-medium flex items-center gap-1 mb-2">
                <MapPin className="w-4 h-4" /> Prominent in:
              </span>
              <div className="flex flex-wrap gap-2">
                {states.map((state, index) => (
                  <span 
                    key={index} 
                    className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700"
                  >
                    {state}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default PoliticalParties;
