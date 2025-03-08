
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import FighterCard from '../components/FighterCard';
import FighterModal from '../components/FighterModal';
import { useTheme } from '../context/ThemeContext';

// Sample freedom fighters data (would be expanded with more in real usage)
const freedomFighters = [
  {
    id: 1,
    name: "Mahatma Gandhi",
    state: "Gujarat",
    years: "1869-1948",
    image: "https://images.unsplash.com/photo-1628367282397-a886c965af34?q=80&w=1000&auto=format&fit=crop",
    biography: "Mohandas Karamchand Gandhi, popularly known as Mahatma Gandhi, was an Indian lawyer, anti-colonial nationalist and political ethicist who employed nonviolent resistance to lead the successful campaign for India's independence from British rule. He inspired movements for civil rights and freedom across the world.",
    contributions: [
      "Led the Salt March in 1930 to protest the British monopoly on salt.",
      "Spearheaded the Quit India Movement in 1942.",
      "Advocated for non-violent civil disobedience as a means to achieve independence.",
      "Worked towards Hindu-Muslim unity and the eradication of untouchability."
    ],
    legacy: "Gandhi's legacy includes numerous memorials and statues across India. His birthday, 2 October, is commemorated as Gandhi Jayanti, a national holiday in India, and is celebrated worldwide as the International Day of Nonviolence. He is considered the Father of the Nation in India."
  },
  {
    id: 2,
    name: "Bhagat Singh",
    state: "Punjab",
    years: "1907-1931",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Bhagat_Singh_%28cropped%29.jpg/640px-Bhagat_Singh_%28cropped%29.jpg",
    biography: "Bhagat Singh was an Indian socialist revolutionary whose two acts of dramatic violence against the British in India and execution at the age of 23 made him a folk hero of the Indian independence movement.",
    contributions: [
      "Formed the Hindustan Socialist Republican Association to fight for India's independence.",
      "Protested against the Public Safety Bill and the Trade Dispute Act by throwing non-lethal bombs in the Central Legislative Assembly.",
      "His hunger strike in prison drew attention to the plight of Indian political prisoners.",
      "Was influential in popularizing the slogan 'Inquilab Zindabad' (Long Live the Revolution)."
    ],
    legacy: "Bhagat Singh's legacy includes numerous films, plays, and books based on his life. His image appears on Indian postage stamps, and several educational institutions and parks are named after him. He remains a symbol of youth and courage in the fight against oppression."
  },
  {
    id: 3,
    name: "Rani Lakshmi Bai",
    state: "Uttar Pradesh",
    years: "1828-1858",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Rani_of_jhansi.jpg/640px-Rani_of_jhansi.jpg",
    biography: "Rani Lakshmi Bai, the Rani of Jhansi, was an Indian queen and warrior. She was one of the leading figures of the Indian Rebellion of 1857 and a symbol of resistance to British rule in India.",
    contributions: [
      "Led her forces against the British during the Indian Rebellion of 1857.",
      "Refused to cede Jhansi to the British under the Doctrine of Lapse.",
      "Organized an army that included women soldiers.",
      "Participated in securing Gwalior Fort before her death in battle."
    ],
    legacy: "Rani Lakshmi Bai has become an icon of the Indian independence movement and a symbol of female power and resistance. She is remembered in India as a national heroine and a symbol of resistance to British colonial rule."
  },
  {
    id: 4,
    name: "Subhas Chandra Bose",
    state: "Odisha",
    years: "1897-1945",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Subhas_Chandra_Bose_NRB.jpg/640px-Subhas_Chandra_Bose_NRB.jpg",
    biography: "Subhas Chandra Bose, widely known as Netaji, was an Indian nationalist whose defiant patriotism made him a hero in India. During World War II, he sought assistance from Nazi Germany and Imperial Japan to overthrow British rule in India.",
    contributions: [
      "Founded and led the Indian National Army (Azad Hind Fauj) to fight against the British.",
      "Established the provisional government of Free India (Azad Hind) in 1943.",
      "Gave the famous slogan 'Give me blood, and I shall give you freedom'.",
      "Promoted women's equality by forming the Rani of Jhansi Regiment, an all-female combat unit."
    ],
    legacy: "Bose's legacy is commemorated through numerous statues, the naming of various institutions, and the declassification of files related to his disappearance. His birthday is celebrated as 'Parakram Divas' in India."
  },
  {
    id: 5,
    name: "Sardar Vallabhbhai Patel",
    state: "Gujarat",
    years: "1875-1950",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Sardar_patel_%28cropped%29.jpg/640px-Sardar_patel_%28cropped%29.jpg",
    biography: "Vallabhbhai Patel, commonly known as Sardar Patel, was an Indian statesman who served as the first Deputy Prime Minister of India. He is known for his role in the integration of over 500 princely states into the Indian Union.",
    contributions: [
      "Played a crucial role in India's freedom struggle, particularly during the Bardoli Satyagraha.",
      "Unified 562 princely states to form the Indian Union after independence.",
      "Organized relief efforts during the 1928 Bardoli floods and 1934 Bihar earthquake.",
      "Played a key role in the formation of the All India Services."
    ],
    legacy: "Patel's legacy includes the Statue of Unity, the world's tallest statue, dedicated to him. His birthday, 31 October, is celebrated as National Unity Day in India. He is remembered as the 'Iron Man of India' for his commitment to national integration."
  },
  {
    id: 6,
    name: "Sarojini Naidu",
    state: "Telangana",
    years: "1879-1949",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sarojini_Naidu_1946_%28cropped%29.JPG/640px-Sarojini_Naidu_1946_%28cropped%29.JPG",
    biography: "Sarojini Naidu was an Indian political activist and poet. A proponent of civil rights, women's emancipation, and anti-imperialistic ideas, she was an important figure in India's struggle for independence from colonial rule.",
    contributions: [
      "Was the first Indian woman to become the President of the Indian National Congress.",
      "Led the Civil Disobedience Movement in 1930 after Gandhi's arrest.",
      "Advocated for women's rights and education.",
      "Became the first woman governor of an Indian state (Uttar Pradesh) after independence."
    ],
    legacy: "Naidu is known as the 'Nightingale of India' for her poetry. Her birthday, 13 February, is celebrated as National Women's Day in India. She is remembered for her contributions to literature, politics, and women's rights."
  }
];

const FreedomFighters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedFighter, setSelectedFighter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { theme } = useTheme();
  
  const states = [...new Set(freedomFighters.map(fighter => fighter.state))];
  
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
        
        <section className="mb-12">
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
                  {states.map((state) => (
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
        </section>
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
