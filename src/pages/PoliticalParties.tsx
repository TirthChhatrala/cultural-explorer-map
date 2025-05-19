
import React from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import PartyCard from '../components/parties/PartyCard';
import ElectoralSystem from '../components/parties/ElectoralSystem';
import SearchAndFilter from '../components/parties/SearchAndFilter';
import { usePartyFilter } from '../hooks/usePartyFilter';
import { states } from '../data/states';

// Enhanced political parties data with type, historical details, and current representation
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
    type: "national" as const,
    states: ["uttarpradesh", "gujarat", "madhyapradesh", "karnataka", "rajasthan", "haryana", "himachalpradesh"],
    historicalDetails: "Founded in 1980, the BJP emerged from the Bharatiya Jana Sangh, which merged with several parties to form the Janata Party after the Emergency in 1977. The BJP has been India's dominant political force since 2014.",
    achievements: [
      "Led by Narendra Modi to majority governments in 2014 and 2019 general elections",
      "Implemented GST (Goods and Services Tax) reform in 2017",
      "Abrogation of Article 370 for Jammu and Kashmir in 2019"
    ],
    currentRepresentation: {
      loksabha: 303,
      rajyasabha: 97,
      stateAssemblies: 1432
    }
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
    type: "national" as const,
    states: ["rajasthan", "punjab", "tamil_nadu", "telangana", "karnataka"],
    historicalDetails: "Founded in 1885, the Indian National Congress led India's independence movement against British rule. Post-independence, it dominated Indian politics for decades under leaders like Jawaharlal Nehru and Indira Gandhi.",
    achievements: [
      "Led India's independence movement against British colonial rule",
      "Implemented economic liberalization reforms in 1991",
      "Passed the Right to Information Act in 2005"
    ],
    currentRepresentation: {
      loksabha: 52,
      rajyasabha: 31,
      stateAssemblies: 752
    }
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
    type: "state" as const,
    states: ["westbengal"],
    historicalDetails: "Founded in 1998 by Mamata Banerjee after breaking away from the Indian National Congress. The party ended 34 years of Communist rule in West Bengal in 2011.",
    achievements: [
      "Ended 34 years of Left Front government in West Bengal in 2011",
      "Implemented Kanyashree Prakalpa scheme for girl education",
      "Developed Kalighat Temple corridor and various infrastructure projects"
    ],
    currentRepresentation: {
      loksabha: 22,
      rajyasabha: 13,
      stateAssemblies: 215
    }
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
    type: "state" as const,
    states: ["delhi", "punjab"],
    historicalDetails: "Founded in 2012, emerging from the India Against Corruption movement led by Anna Hazare. The party made a stunning electoral debut in Delhi in 2013.",
    achievements: [
      "Won Delhi Assembly elections in 2015 with 67 out of 70 seats",
      "Implemented free water and subsidized electricity in Delhi",
      "Reforms in government schools and healthcare (Mohalla Clinics)"
    ],
    currentRepresentation: {
      loksabha: 10,
      rajyasabha: 10,
      stateAssemblies: 92
    }
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
    type: "state" as const,
    states: ["tamilnadu"],
    historicalDetails: "Founded in 1949 by C. N. Annadurai after splitting from Periyar E. V. Ramasamy's Dravidar Kazhagam. The party has been a dominant force in Tamil Nadu politics.",
    achievements: [
      "Successfully opposed imposition of Hindi as national language",
      "Renamed Madras State to Tamil Nadu in 1969",
      "Implemented various social welfare schemes including noon meal program"
    ],
    currentRepresentation: {
      loksabha: 24,
      rajyasabha: 10,
      stateAssemblies: 133
    }
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
    type: "national" as const,
    states: ["kerala", "westbengal"],
    historicalDetails: "Founded in 1964 after splitting from the Communist Party of India. The CPI(M) has been a significant force in Kerala, West Bengal, and Tripura politics.",
    achievements: [
      "Implemented land reforms in West Bengal and Kerala",
      "Kerala model of development with high social indicators",
      "Strong labor union movements across industrial sectors"
    ],
    currentRepresentation: {
      loksabha: 3,
      rajyasabha: 5,
      stateAssemblies: 98
    }
  }
];

const PoliticalParties = () => {
  const { theme } = useTheme();
  const {
    searchQuery,
    setSearchQuery,
    selectedState,
    setSelectedState,
    selectedType,
    setSelectedType,
    selectedLeader,
    setSelectedLeader,
    filteredParties,
    uniqueLeaders
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
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedLeader={selectedLeader}
          setSelectedLeader={setSelectedLeader}
          uniqueLeaders={uniqueLeaders}
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
                  setSelectedType('all');
                  setSelectedLeader('all');
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
