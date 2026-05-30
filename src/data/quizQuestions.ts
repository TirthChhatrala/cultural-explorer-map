import type { Difficulty } from '@/lib/rewards';

export interface QuizQ {
  q: string;
  options: string[];
  answer: number;
  fact: string;
  difficulty: Difficulty;
  category: 'geography' | 'culture' | 'history' | 'festivals' | 'food';
}

export const QUESTION_BANK: QuizQ[] = [
  // Easy
  { q: 'Which state is famous for the Backwaters and houseboat tours?', options: ['Tamil Nadu', 'Kerala', 'Goa', 'Karnataka'], answer: 1, fact: "Kerala's 900+ km of interconnected lagoons are UNESCO-recognised.", difficulty: 'easy', category: 'geography' },
  { q: 'The Taj Mahal is located in which state?', options: ['Rajasthan', 'Madhya Pradesh', 'Uttar Pradesh', 'Delhi'], answer: 2, fact: 'Built between 1632 and 1653 in Agra.', difficulty: 'easy', category: 'history' },
  { q: 'Which mountain range runs along India\'s northern border?', options: ['Western Ghats', 'Aravalli', 'Vindhya', 'Himalayas'], answer: 3, fact: 'The Himalayas span 2,400 km.', difficulty: 'easy', category: 'geography' },
  { q: 'Pongal is celebrated primarily in:', options: ['Tamil Nadu', 'Punjab', 'West Bengal', 'Assam'], answer: 0, fact: 'A four-day Tamil harvest festival.', difficulty: 'easy', category: 'festivals' },
  { q: 'India\'s national animal is the:', options: ['Lion', 'Elephant', 'Bengal Tiger', 'Peacock'], answer: 2, fact: 'Declared in 1973 alongside Project Tiger.', difficulty: 'easy', category: 'culture' },
  { q: 'Which is the longest river in India?', options: ['Yamuna', 'Brahmaputra', 'Godavari', 'Ganges'], answer: 3, fact: 'The Ganges flows ~2,525 km.', difficulty: 'easy', category: 'geography' },
  // Medium
  { q: 'Which classical dance form originated in Andhra Pradesh?', options: ['Kathak', 'Bharatanatyam', 'Kuchipudi', 'Odissi'], answer: 2, fact: 'Named after the village Kuchipudi.', difficulty: 'medium', category: 'culture' },
  { q: 'How many officially recognised languages are in the 8th Schedule?', options: ['14', '18', '22', '28'], answer: 2, fact: 'The 8th Schedule lists 22 languages.', difficulty: 'medium', category: 'culture' },
  { q: 'Which state celebrates Bihu as its main harvest festival?', options: ['Odisha', 'Assam', 'Bihar', 'Sikkim'], answer: 1, fact: 'Bihu has three celebrations per year.', difficulty: 'medium', category: 'festivals' },
  { q: 'Hampi, a UNESCO World Heritage Site, was the capital of which empire?', options: ['Maurya', 'Chola', 'Vijayanagara', 'Mughal'], answer: 2, fact: 'Vijayanagara peaked in the 14th–16th centuries.', difficulty: 'medium', category: 'history' },
  { q: 'Which spice is Kerala historically most famous for exporting?', options: ['Saffron', 'Black Pepper', 'Cardamom', 'Cumin'], answer: 1, fact: 'Kerala was nicknamed "land of black gold".', difficulty: 'medium', category: 'food' },
  { q: 'Which fort is known as the "Golden Fort" of Rajasthan?', options: ['Amber', 'Mehrangarh', 'Jaisalmer', 'Chittorgarh'], answer: 2, fact: 'Jaisalmer Fort glows golden at sunset.', difficulty: 'medium', category: 'history' },
  // Hard
  { q: 'The Ajanta Caves\' paintings primarily depict which religious tradition?', options: ['Jainism', 'Buddhism', 'Hinduism', 'Sikhism'], answer: 1, fact: 'Ajanta paintings illustrate Jataka tales.', difficulty: 'hard', category: 'history' },
  { q: 'Which Indian state has the highest literacy rate?', options: ['Mizoram', 'Kerala', 'Goa', 'Tripura'], answer: 1, fact: 'Kerala consistently leads at ~96%.', difficulty: 'hard', category: 'geography' },
  { q: 'The "Konark Sun Temple" is a chariot pulled by how many horses?', options: ['5', '7', '9', '12'], answer: 1, fact: 'Seven horses represent the days of the week.', difficulty: 'hard', category: 'history' },
  { q: 'Which is the only Indian state with a "matrilineal" tribal society (Khasi)?', options: ['Nagaland', 'Manipur', 'Meghalaya', 'Mizoram'], answer: 2, fact: 'Khasi & Garo tribes pass lineage through women.', difficulty: 'hard', category: 'culture' },
  { q: 'Which dynasty built the Brihadeeswarar Temple in Thanjavur?', options: ['Pallava', 'Chola', 'Pandya', 'Chera'], answer: 1, fact: 'Built by Raja Raja Chola I, c. 1010 CE.', difficulty: 'hard', category: 'history' },
  { q: '"Phirni" is a traditional dessert primarily made of:', options: ['Wheat', 'Rice', 'Lentils', 'Coconut'], answer: 1, fact: 'Ground rice cooked in milk and sugar.', difficulty: 'hard', category: 'food' },
];

export const pickQuestions = (difficulty: Difficulty, count = 6, seed?: number): QuizQ[] => {
  const pool = QUESTION_BANK.filter(q => q.difficulty === difficulty);
  const rand = seed !== undefined
    ? (() => { let s = seed; return () => (s = (s * 9301 + 49297) % 233280) / 233280; })()
    : Math.random;
  const shuffled = [...pool].sort(() => rand() - 0.5);
  return shuffled.slice(0, Math.min(count, pool.length));
};

// Bonus question pool (mixed difficulty)
export const BONUS_QUESTIONS: QuizQ[] = [
  { q: 'BONUS: Which is the smallest state in India by area?', options: ['Goa', 'Sikkim', 'Tripura', 'Nagaland'], answer: 0, fact: 'Goa is ~3,702 km².', difficulty: 'medium', category: 'geography' },
  { q: 'BONUS: Which festival is also known as the "Festival of Colors"?', options: ['Diwali', 'Holi', 'Onam', 'Lohri'], answer: 1, fact: 'Holi marks the arrival of spring.', difficulty: 'easy', category: 'festivals' },
];