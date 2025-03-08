
export interface State {
  id: string;
  name: string;
  capital: string;
  description: string;
  history: string;
  cuisine: string;
  culture: string;
  clothing: string;
  weather: string;
  attractions: Attraction[];
  famousFor: string[];
  image: string;
  coordinates: {
    x: number;
    y: number;
  };
  politicalParties?: PoliticalParty[];
  festivals?: Festival[];
}

export interface Attraction {
  name: string;
  description: string;
  image: string;
}

export interface PoliticalParty {
  name: string;
  abbreviation: string;
  foundedYear: number;
  ideology: string;
  currentLeader: string;
  description: string;
  logo?: string;
}

export interface Festival {
  name: string;
  month: string;
  description: string;
  significance: string;
  image: string;
}

// This is a subset of data for demonstration. In a real app, you'd have complete data for all states.
export const states: State[] = [
  {
    id: "rajasthan",
    name: "Rajasthan",
    capital: "Jaipur",
    description: "The Land of Kings, known for its vibrant culture and grand palaces.",
    history: "Rajasthan, literally meaning 'Land of Kings', is a state in northern India. The state covers an area of 342,239 square kilometers and is the largest Indian state by area. It is located on the western side of the country, where it comprises most of the wide and inhospitable Thar Desert and shares a border with Pakistan. The history of Rajasthan dates back to the Indus Valley Civilization. The foundation of the Rajput clans in the region marked the dawn of the Rajput era in Rajasthan's history. These clans established their dominance between the 7th and 12th centuries. The Rajput clans, known for their valor and chivalry, built numerous forts and palaces across the state, many of which stand till today as a testament to their rich heritage.",
    cuisine: "Rajasthani cuisine is influenced by both the war-like lifestyles of its inhabitants and the availability of ingredients in this arid region. Food that could last for several days and could be eaten without heating was preferred. Rajasthani cuisine includes dishes like Dal Baati Churma, Gatte ki Sabzi, Ker Sangri, Laal Maas, and Bajre ki Roti. Sweets include Ghevar, Feeni, Mawa Kachori, and Moong Dal Halwa.",
    culture: "Rajasthan has a vibrant and distinct culture influenced by its history, geography, and the Rajputana legacy. The state is home to numerous folk dances and music that reflect its cultural richness. Ghoomar, Kalbeliya, and Bhavai are some of the famous folk dances. 'Padharo Mhare Desh', which means 'Welcome to my land', is a popular Rajasthani song used to welcome guests.",
    clothing: "Traditional Rajasthani attire is colorful and vibrant, reflecting the state's rich cultural heritage. Men traditionally wear a dhoti, kurta, and pagri (turban). The color and style of the pagri can denote a man's caste, region, and the occasion. Women wear the traditional ghagra choli (long skirt and blouse) along with a dupatta or odhni (veil). These clothes are often adorned with intricate mirror work, embroidery, and block prints.",
    weather: "Rajasthan has a hot and dry climate with temperatures often exceeding 40°C in summer. Winters are mild with temperatures ranging from 8-28°C. The state receives limited rainfall, primarily during the monsoon season from July to September.",
    attractions: [
      {
        name: "Hawa Mahal",
        description: "The Palace of Winds, a five-story palace with 953 small windows called jharokhas decorated with intricate latticework.",
        image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3"
      },
      {
        name: "Amber Fort",
        description: "A majestic fort situated on a hill, known for its artistic style elements, large ramparts, and series of gates and cobbled paths.",
        image: "https://images.unsplash.com/photo-1624463652447-c14ad85a4472?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3"
      },
      {
        name: "Jaisalmer Fort",
        description: "A UNESCO World Heritage Site and one of the largest fully preserved fortified cities in the world, located in the heart of the Thar Desert.",
        image: "https://images.unsplash.com/photo-1591089101324-2280d9260000?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3"
      },
      {
        name: "Udaipur City Palace",
        description: "A magnificent palace complex built over a period of nearly 400 years, with contributions from several rulers of the Mewar dynasty.",
        image: "https://images.unsplash.com/photo-1587135941948-670b381f08ce?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3"
      }
    ],
    famousFor: [
      "Majestic Forts and Palaces",
      "Vibrant Festivals",
      "Desert Safaris",
      "Rajput Heritage",
      "Folk Music and Dance",
      "Colorful Textiles and Handicrafts"
    ],
    image: "https://images.unsplash.com/photo-1607836046730-3317bd58a31b?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    coordinates: {
      x: 27,
      y: 73
    },
    politicalParties: [
      {
        name: "Bharatiya Janata Party",
        abbreviation: "BJP",
        foundedYear: 1980,
        ideology: "Nationalism, Conservatism",
        currentLeader: "Bhajan Lal Sharma (Chief Minister)",
        description: "BJP is one of the two major political parties in India. In Rajasthan, it has a significant presence and has formed the government multiple times."
      },
      {
        name: "Indian National Congress",
        abbreviation: "INC",
        foundedYear: 1885,
        ideology: "Liberalism, Social democracy",
        currentLeader: "Govind Singh Dotasra (State President)",
        description: "The Indian National Congress is one of India's oldest political parties. In Rajasthan, it has alternated power with the BJP in recent decades."
      }
    ],
    festivals: [
      {
        name: "Pushkar Camel Fair",
        month: "November",
        description: "An annual camel and livestock fair held in the town of Pushkar.",
        significance: "It's one of the world's largest camel fairs, attracting thousands of camels, horses and cattle for trading.",
        image: "https://images.unsplash.com/photo-1516146619866-aaa0384b0bcd?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3"
      },
      {
        name: "Desert Festival",
        month: "February",
        description: "A colorful event showcasing the rich cultural heritage of Rajasthan, held in Jaisalmer.",
        significance: "This festival highlights the traditions and customs of the desert dwellers with music, dance, and competitions.",
        image: "https://images.unsplash.com/photo-1603206004639-38d94223ddc5?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3"
      }
    ]
  },
  {
    id: "kerala",
    name: "Kerala",
    capital: "Thiruvananthapuram",
    description: "God's Own Country, famous for its backwaters, beaches, and lush green landscapes.",
    history: "Kerala, located on the southwestern coast of India, has a rich and diverse history dating back to ancient times. The region was an important spice trading center as early as 3000 BCE, with trading relationships established with Phoenicians, Arabs, Greeks, and Romans. Kerala's history is characterized by various dynasties that ruled different parts of the region, including the Cheras, Cholas, and Pandyas. The arrival of European powers, particularly the Portuguese, Dutch, and British, in the 15th-19th centuries significantly influenced Kerala's history, culture, and economy.",
    cuisine: "Kerala cuisine is known for its abundant use of coconut, rice, and spices, especially black pepper, cloves, cinnamon, and ginger. It offers a multitude of vegetarian and non-vegetarian dishes. Popular dishes include Appam with Stew, Karimeen Pollichathu (Pearl Spot fish wrapped in banana leaf), Puttu (steamed rice cake) with Kadala Curry, and Sadhya, a vegetarian feast served on a banana leaf. Kerala is also known for its snacks like Pazham Pori (banana fritters) and Unniyappam (sweet fried rice balls).",
    culture: "Kerala has a rich cultural heritage influenced by Hinduism, Islam, and Christianity. The state is famous for its classical dance forms like Kathakali, Mohiniyattam, and Koodiyattam. It also has a rich tradition of martial arts (Kalaripayattu), Ayurvedic medicine, and literature. The Malayalam language, spoken in Kerala, has one of the richest literary traditions in India.",
    clothing: "Traditional attire in Kerala is simple yet elegant. Men wear a mundu (a long piece of cloth wrapped around the waist) with a shirt. For formal occasions, they might add a veshti (a cloth used as an upper garment). Women traditionally wear the mundum neriyathum (a two-piece cloth), but the Kerala saree (kasavu saree), a cream-colored cotton saree with golden border, is more commonly worn today. The Kasavu saree is the traditional wear for women during festivals and ceremonies.",
    weather: "Kerala has a tropical climate with temperatures ranging from 28-32°C throughout the year. The state experiences two monsoon seasons: Southwest Monsoon from June to September and Northeast Monsoon from October to November, making it one of the wettest regions in India.",
    attractions: [
      {
        name: "Alleppey Backwaters",
        description: "A network of brackish lagoons, lakes, and canals best explored on a traditional houseboat.",
        image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3"
      },
      {
        name: "Munnar",
        description: "A hill station known for its tea plantations, rolling hills, and cool climate.",
        image: "https://images.unsplash.com/photo-1611811236503-413c81644c78?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3"
      },
      {
        name: "Fort Kochi",
        description: "A historic coastal area with colonial buildings, Chinese fishing nets, and a vibrant art scene.",
        image: "https://images.unsplash.com/photo-1589829529583-c08aa1cd8fa6?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3"
      },
      {
        name: "Wayanad",
        description: "A rural district with lush forests, wildlife, and tribal heritage.",
        image: "https://images.unsplash.com/photo-1609946860441-a51ffbe8a3a8?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3"
      }
    ],
    famousFor: [
      "Backwaters and Houseboats",
      "Pristine Beaches",
      "Ayurvedic Treatments",
      "Spice Plantations",
      "Wildlife Sanctuaries",
      "Classical Art Forms"
    ],
    image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    coordinates: {
      x: 10,
      y: 76
    },
    politicalParties: [
      {
        name: "Communist Party of India (Marxist)",
        abbreviation: "CPI(M)",
        foundedYear: 1964,
        ideology: "Communism, Marxism",
        currentLeader: "Pinarayi Vijayan (Chief Minister)",
        description: "The CPI(M) has been a dominant political force in Kerala for decades, leading the Left Democratic Front coalition."
      },
      {
        name: "Indian National Congress",
        abbreviation: "INC",
        foundedYear: 1885,
        ideology: "Liberalism, Social democracy",
        currentLeader: "K. Sudhakaran (State President)",
        description: "The INC leads the United Democratic Front in Kerala, traditionally alternating power with the LDF."
      }
    ],
    festivals: [
      {
        name: "Onam",
        month: "August-September",
        description: "A harvest festival celebrated with elaborate feasts, boat races, dances, and floral decorations.",
        significance: "Kerala's most important festival, commemorating the return of the mythical King Mahabali.",
        image: "https://images.unsplash.com/photo-1600096194534-95cf5ece04cf?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3"
      },
      {
        name: "Thrissur Pooram",
        month: "April-May",
        description: "A spectacular temple festival featuring decorated elephants, percussion performances and fireworks.",
        significance: "Considered the most magnificent temple festival in Kerala with a rich cultural display.",
        image: "https://images.unsplash.com/photo-1626968361222-291e74711449?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3"
      }
    ]
  },
  {
    id: "tamilnadu",
    name: "Tamil Nadu",
    capital: "Chennai",
    description: "The Land of Temples, rich in Dravidian culture and classical arts.",
    history: "Tamil Nadu has a rich history dating back to ancient times. It was ruled by several dynasties including the Cheras, Cholas, Pandyas, and Pallavas who contributed significantly to its cultural heritage. The region was known for its maritime trade with ancient Rome, Greece, and China. The British colonial period and the Indian independence movement also left their mark on Tamil Nadu's history. The state is known for its ancient Tamil language, one of the longest-surviving classical languages in the world.",
    cuisine: "Tamil cuisine is known for its use of rice, legumes, and a variety of spices. Traditional dishes are served on a banana leaf and include Idli, Dosa, Sambar, Rasam, Vada, and various types of Chutneys. Non-vegetarian specialties include Chettinad dishes known for their spicy and aromatic nature. Sweets like Mysore Pak, Jangiri, and Adhirasam are popular desserts.",
    culture: "Tamil Nadu has a rich cultural heritage with classical dance forms like Bharatanatyam, music traditions like Carnatic music, and a rich literary tradition in the Tamil language. The state is known for its numerous ancient temples with intricate architecture and its vibrant festivals like Pongal and Navaratri. Temple festivals often include processions with decorated temple chariots (rathas).",
    clothing: "Traditional attire for men includes the veshti (dhoti) and angavastram (upper cloth), while women wear the sari in a distinctive style. The Kanchipuram silk sari, known for its durable quality and gold thread work, is a significant part of Tamil Nadu's textile heritage. These saris are especially popular for weddings and special occasions.",
    weather: "Tamil Nadu has a tropical climate with temperatures ranging from 20-40°C throughout the year. The state receives rainfall primarily from the Northeast monsoon from October to December, leading to higher precipitation along the southeastern coastal regions.",
    attractions: [
      {
        name: "Meenakshi Amman Temple",
        description: "A historic Hindu temple located in Madurai, known for its stunning architecture and thousands of stone sculptures.",
        image: "https://images.unsplash.com/photo-1583420516175-d73d910f2e5c?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3"
      },
      {
        name: "Marina Beach",
        description: "The second-longest urban beach in the world, stretching 13 km along the Bay of Bengal in Chennai.",
        image: "https://images.unsplash.com/photo-1590077428593-a33c3abc3af5?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3"
      },
      {
        name: "Ooty",
        description: "A popular hill station with beautiful lakes, gardens, and colonial architecture.",
        image: "https://images.unsplash.com/photo-1586883091030-8c52f2feef74?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3"
      },
      {
        name: "Thanjavur",
        description: "Home to the Brihadeeswarar Temple, a UNESCO World Heritage Site, and the seat of the great Chola empire.",
        image: "https://images.unsplash.com/photo-1633069322673-79a76dd2e1fb?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3"
      }
    ],
    famousFor: [
      "Ancient Temples",
      "Classical Arts (Bharatanatyam and Carnatic Music)",
      "Silk Sarees",
      "Film Industry (Kollywood)",
      "Traditional Cuisine",
      "Hill Stations"
    ],
    image: "https://images.unsplash.com/photo-1583420516175-d73d910f2e5c?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    coordinates: {
      x: 11,
      y: 78
    },
    politicalParties: [
      {
        name: "Dravida Munnetra Kazhagam",
        abbreviation: "DMK",
        foundedYear: 1949,
        ideology: "Social democracy, Dravidian nationalism",
        currentLeader: "M. K. Stalin (Chief Minister)",
        description: "The DMK emerged from the Dravidian movement and has been a dominant political force in Tamil Nadu for decades."
      },
      {
        name: "All India Anna Dravida Munnetra Kazhagam",
        abbreviation: "AIADMK",
        foundedYear: 1972,
        ideology: "Populism, Dravidian nationalism",
        currentLeader: "Edappadi K. Palaniswami",
        description: "The AIADMK was founded by M. G. Ramachandran and has alternated power with the DMK in Tamil Nadu since the 1970s."
      }
    ],
    festivals: [
      {
        name: "Pongal",
        month: "January",
        description: "A four-day harvest festival celebrating the Sun God and the harvest season.",
        significance: "Tamil Nadu's most important festival, marking the beginning of the sun's northward journey.",
        image: "https://images.unsplash.com/photo-1611334837534-29d22128389a?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3"
      },
      {
        name: "Madurai Chithirai Festival",
        month: "April-May",
        description: "A grand celebration at the Meenakshi Amman Temple commemorating the celestial wedding of Goddess Meenakshi to Lord Sundareswarar.",
        significance: "One of the most famous temple festivals in Tamil Nadu, attracting devotees from across the country.",
        image: "https://images.unsplash.com/photo-1623079398424-860afdba8f2d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3"
      }
    ]
  }
];

export const getStateById = (id: string): State | undefined => {
  return states.find(state => state.id === id);
};

export const stateIds = states.map(state => state.id);

export interface FreedomFighter {
  id: string;
  name: string;
  image: string;
  lifespan: string;
  state: string;
  years: string;
  contribution: string;
  biography: string;
}

export const freedomFighters: FreedomFighter[] = [
  {
    id: "mahatma-gandhi",
    name: "Mahatma Gandhi",
    image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    lifespan: "1869-1948",
    state: "Gujarat",
    years: "1915-1948",
    contribution: "Father of the Nation, led non-violent civil disobedience movements",
    biography: "Mohandas Karamchand Gandhi, widely known as Mahatma Gandhi, was an Indian lawyer, anti-colonial nationalist, and political ethicist who employed nonviolent resistance to lead the successful campaign for India's independence from British rule. He inspired movements for civil rights and freedom across the world. Born in Porbandar, Gujarat, Gandhi studied law in London and practiced in South Africa, where he developed his political views and activism. Upon returning to India, he organized farmers, laborers, and urban laborers to protest against excessive land-tax and discrimination. His philosophy of Satyagraha (truth-force) and Ahimsa (non-violence) became fundamental concepts in the independence movement. He led nationwide campaigns for various social causes and for achieving Swaraj or self-rule. He was assassinated on January 30, 1948, by Nathuram Godse."
  },
  {
    id: "subhas-chandra-bose",
    name: "Subhas Chandra Bose",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3", 
    lifespan: "1897-1945 (disputed)",
    state: "West Bengal",
    years: "1920-1945",
    contribution: "Founded Indian National Army, led militant movement for independence",
    biography: "Subhas Chandra Bose was an Indian nationalist whose defiant patriotism made him a hero in India. He is popularly known as 'Netaji' (Respected Leader). Bose advocated complete independence for India at the earliest, whereas the All-India Congress Committee wanted it in phases, through Dominion status. During World War II, he sought assistance from Nazi Germany and Imperial Japan to overthrow British rule in India. He founded the Indian National Army (Azad Hind Fauj) with Japanese assistance following the Fall of Singapore, drawing ex-prisoners of war and plantation workers from the Indian diaspora in Southeast Asia. His sudden disappearance after a plane crash in Taiwan in 1945 has led to various theories about his fate."
  },
  {
    id: "bhagat-singh",
    name: "Bhagat Singh",
    image: "https://images.unsplash.com/photo-1621118209941-e1ef27858e69?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    lifespan: "1907-1931",
    state: "Punjab",
    years: "1926-1931",
    contribution: "Revolutionary freedom fighter, advocated armed resistance",
    biography: "Bhagat Singh was an Indian socialist revolutionary whose acts of dramatic violence against the British in India, followed by his execution at age 23, made him a folk hero of the Indian independence movement. Born into a Sikh family in Punjab, Singh became involved in nationalist politics as a teenager and quickly rose to prominence in the Hindustan Republican Association (HRA). He gained nationwide support after the Lahore Conspiracy Case, when he underwent a 116-day fast in jail, demanding equal rights for Indian and European prisoners. Singh and his associates were sentenced to death for killing a British police officer, John Saunders, and conspiracies against the government. He was hanged on March 23, 1931, at the age of 23. His legacy continues to inspire generations of young Indians."
  },
  {
    id: "rani-lakshmibai",
    name: "Rani Lakshmibai",
    image: "https://images.unsplash.com/photo-1580618864482-f006386dc0ec?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    lifespan: "1828-1858",
    state: "Uttar Pradesh",
    years: "1857-1858",
    contribution: "Led armed rebellion during the 1857 Indian Rebellion",
    biography: "Rani Lakshmibai, also known as Jhansi Ki Rani, was an Indian queen and warrior. She was one of the leading figures of the Indian Rebellion of 1857 and became a symbol of resistance to the British Raj. Born Manikarnika Tambe in Varanasi, she was married to Raja Gangadhar Rao, the Maharaja of Jhansi. After her husband's death, the British East India Company, under Governor-General Lord Dalhousie, applied the Doctrine of Lapse, annexing the state of Jhansi as Gangadhar Rao and Lakshmibai had no biological children. Refusing to cede her kingdom, she fought against the British, riding into battle with her adopted son tied to her back. She died on June 18, 1858, during the Siege of Gwalior, fighting against the British. Her courage, leadership, and fierceness in battle have made her an icon in Indian history."
  },
  {
    id: "sardar-vallabhbhai-patel",
    name: "Sardar Vallabhbhai Patel",
    image: "https://images.unsplash.com/photo-1627740283004-a4abe8f006e9?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    lifespan: "1875-1950",
    state: "Gujarat",
    years: "1918-1950",
    contribution: "Iron Man of India, integrated princely states into Indian Union",
    biography: "Vallabhbhai Jhaverbhai Patel, commonly known as Sardar Patel, was an Indian barrister, statesman, and a founding father of the Republic of India. He served as the first Deputy Prime Minister of India and the first Home Minister from 1947 to 1950. As India's first Minister of Home Affairs, he played a crucial role in the integration of over 560 princely states into the Indian Union. His commitment to national integration earned him the title 'Iron Man of India'. He was also instrumental in organizing the peasants of Bardoli, Gujarat, in a non-violent Civil Disobedience against oppressive policies imposed by the British. After independence, he reorganized the Indian Civil Service and helped establish the All India Administrative Service. His birth anniversary, October 31, is celebrated as National Unity Day in India."
  },
  {
    id: "sarojini-naidu",
    name: "Sarojini Naidu",
    image: "https://images.unsplash.com/photo-1694661042254-fda17de64563?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    lifespan: "1879-1949",
    state: "Telangana",
    years: "1917-1947",
    contribution: "Nightingale of India, poet and political activist",
    biography: "Sarojini Naidu was an Indian political activist, feminist, and poet. A proponent of civil rights, women's emancipation, and anti-imperialistic ideas, she was an important figure in India's struggle for independence from colonial rule. Born in Hyderabad, she was a brilliant student who mastered several languages and began writing poetry at an early age. Her works earned her the sobriquet 'The Nightingale of India'. She joined the Indian National Congress and the Indian independence movement in 1905. She became a follower of Mahatma Gandhi and his ideas of non-violent resistance. As a mark of her political involvement, she was appointed as the first female governor of the United Provinces, now Uttar Pradesh, in 1947. She was also the first woman to become the president of the Indian National Congress."
  }
];
