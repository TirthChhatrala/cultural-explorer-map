
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
}

export interface Attraction {
  name: string;
  description: string;
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
    }
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
    }
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
    }
  }
];

export const getStateById = (id: string): State | undefined => {
  return states.find(state => state.id === id);
};

export const stateIds = states.map(state => state.id);
