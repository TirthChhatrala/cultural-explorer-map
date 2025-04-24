import React from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import PartyCard from '../components/parties/PartyCard';
import ElectoralSystem from '../components/parties/ElectoralSystem';
import SearchAndFilter from '../components/parties/SearchAndFilter';
import { usePartyFilter } from '../hooks/usePartyFilter';
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
  const { theme } = useTheme();
  const {
    searchQuery,
    setSearchQuery,
    selectedState,
    setSelectedState,
    filteredParties
  } = usePartyFilter(partiesData);

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

        <SearchAndFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          theme={theme}
        />

        <section className="mb-16">
          {filteredParties.length > 0 ? (
            <div className="space-y-8">
              {filteredParties.map((party, index) => (
                <PartyCard 
                  key={party.id}
                  {...party}
                  states={party.states.map(stateId => 
                    states.find(s => s.id === stateId)?.name
                  ).filter(Boolean) as string[]}
                  delay={index * 0.1}
                  theme={theme}
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
                className={`mt-4 px-4 py-2 rounded-lg hover:bg-secondary/80 transition-colors ${
                  theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-secondary text-foreground'
                }`}
              >
                Reset Filters
              </button>
            </motion.div>
          )}
        </section>

        <ElectoralSystem theme={theme} />
      </div>
    </Layout>
  );
};

export default PoliticalParties;
