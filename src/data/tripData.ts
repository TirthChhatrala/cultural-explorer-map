export interface Hotel {
  id: string;
  name: string;
  description: string;
  location: string;
  state: string;
  price: number;
  rating: number; // 1-5
  amenities: string[];
  image: string;
}

export interface Attraction {
  id: string;
  name: string;
  description: string;
  location: string;
  state: string;
  type: 'monument' | 'nature' | 'religious' | 'adventure' | 'cultural';
  image: string;
}

export interface TripDay {
  day: number;
  attractions: string[];
  meals: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
  };
  accommodation: string;
  transportation: string;
}

export interface Trip {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  originalPrice?: number;
  discountedPrice?: number;
  discountPercentage: number;
  duration: number; // in days
  states: string[];
  category: 'Small' | 'Luxury' | 'Royal' | 'Budget' | 'Adventure' | 'Spiritual' | 'Beach' | 'Hill' | 'Wildlife' | 'Cultural';
  itinerary: TripDay[];
  rating: number;
  reviews: number;
  featured: boolean;
  bestTime: string;
}

export interface CustomTripRequest {
  id: string;
  userId: string;
  userDetails?: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  memberDetails?: Array<{
    name: string;
    age: number;
    relation: string;
  }>;
  startDate: string;
  endDate: string;
  travelers: number;
  transportMode: 'bus' | 'car' | 'train' | 'flight';
  states: string[];
  budget: number;
  preferences: string[];
  status: 'pending' | 'approved' | 'rejected' | 'in-progress' | 'completed';
  createdAt: string;
  hotelBookings?: Array<{
    hotelId: string;
    checkIn: string;
    checkOut: string;
    rooms: number;
    totalPrice: number;
  }>;
}

export interface Review {
  id: string;
  tripId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: string;
}

// Sample Hotels Data
export const hotels: Hotel[] = [
  {
    id: "hotel1",
    name: "Taj Lake Palace",
    description: "Luxury hotel in the middle of Lake Pichola",
    location: "Udaipur",
    state: "rajasthan",
    price: 25000,
    rating: 5,
    amenities: ["Swimming Pool", "Spa", "Free WiFi", "Restaurant", "24/7 Room Service"],
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "hotel2",
    name: "The Oberoi Udaivilas",
    description: "Luxury resort with views of Lake Pichola and the City Palace",
    location: "Udaipur",
    state: "rajasthan",
    price: 35000,
    rating: 5,
    amenities: ["Swimming Pool", "Spa", "Free WiFi", "Restaurant", "24/7 Room Service", "Fitness Center"],
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "hotel3",
    name: "Zostel Munnar",
    description: "Budget-friendly hostel with beautiful mountain views",
    location: "Munnar",
    state: "kerala",
    price: 800,
    rating: 4,
    amenities: ["Free WiFi", "Shared Kitchen", "Common Area", "Mountain Views"],
    image: "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "hotel4",
    name: "Wildflower Resort",
    description: "Beautiful resort surrounded by pine forests",
    location: "Shimla",
    state: "himachalpradesh",
    price: 12000,
    rating: 4.5,
    amenities: ["Mountain Views", "Restaurant", "Spa", "Free WiFi", "Room Service"],
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "hotel5",
    name: "Goa Marriott Resort & Spa",
    description: "Beachfront resort with amazing sunset views",
    location: "Panjim",
    state: "goa",
    price: 18000,
    rating: 4.7,
    amenities: ["Beach Access", "Swimming Pool", "Spa", "Multiple Restaurants", "Fitness Center"],
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop"
  }
];

// Sample Attractions Data
export const attractions: Attraction[] = [
  {
    id: "attraction1",
    name: "Taj Mahal",
    description: "An ivory-white marble mausoleum on the right bank of the river Yamuna",
    location: "Agra",
    state: "uttarpradesh",
    type: "monument",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "attraction2",
    name: "Amber Fort",
    description: "Historic fort built of red sandstone and marble",
    location: "Jaipur",
    state: "rajasthan",
    type: "monument",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "attraction3",
    name: "Alleppey Backwaters",
    description: "A network of brackish lagoons, lakes, and canals",
    location: "Alleppey",
    state: "kerala",
    type: "nature",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "attraction4",
    name: "Golden Temple",
    description: "The holiest gurdwara of Sikhism",
    location: "Amritsar",
    state: "punjab",
    type: "religious",
    image: "https://images.unsplash.com/photo-1591427904109-a3049acbfeon?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "attraction5",
    name: "Dudhsagar Falls",
    description: "Four-tiered waterfall located on the Mandovi River",
    location: "South Goa",
    state: "goa",
    type: "nature",
    image: "https://images.unsplash.com/photo-1544922993-953febe3b673?q=80&w=1000&auto=format&fit=crop"
  }
];

// Sample Trips Data
export const trips: Trip[] = [
  {
    id: "trip1",
    title: "Royal Rajasthan Tour",
    description: "Experience the royal heritage of Rajasthan with stays in heritage hotels and visits to majestic forts and palaces.",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1000&auto=format&fit=crop",
    price: 75000,
    originalPrice: 75000,
    discountedPrice: 67500,
    discountPercentage: 10,
    duration: 7,
    states: ["rajasthan"],
    category: "Royal",
    bestTime: "October to March",
    itinerary: [
      {
        day: 1,
        attractions: ["attraction2"],
        meals: {
          breakfast: "Hotel breakfast",
          lunch: "Local thali at LMB Restaurant",
          dinner: "Dinner at hotel"
        },
        accommodation: "hotel1",
        transportation: "Private car"
      },
    ],
    rating: 4.8,
    reviews: 120,
    featured: true
  },
  {
    id: "trip2",
    title: "Kerala Backwaters Bliss",
    description: "Relax and unwind on a houseboat as you float through the serene backwaters of Kerala.",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1000&auto=format&fit=crop",
    price: 45000,
    originalPrice: 45000,
    discountPercentage: 0,
    duration: 5,
    states: ["kerala"],
    category: "Luxury",
    bestTime: "November to February",
    itinerary: [
      {
        day: 1,
        attractions: ["attraction3"],
        meals: {
          breakfast: "Kerala breakfast with appam and stew",
          lunch: "Seafood lunch",
          dinner: "Traditional Kerala dinner on houseboat"
        },
        accommodation: "hotel3",
        transportation: "Houseboat"
      },
    ],
    rating: 4.9,
    reviews: 95,
    featured: true
  },
  {
    id: "trip3",
    title: "Hillside Retreat in Himachal",
    description: "Escape to the cool mountains of Himachal Pradesh with stays in scenic locations.",
    image: "https://images.unsplash.com/photo-1502943693086-33b5b1cfdf2f?q=80&w=1000&auto=format&fit=crop",
    price: 30000,
    originalPrice: 30000,
    discountedPrice: 25500,
    discountPercentage: 15,
    duration: 6,
    states: ["himachalpradesh"],
    category: "Hill",
    bestTime: "March to June",
    itinerary: [
      {
        day: 1,
        attractions: ["attraction4"],
        meals: {
          breakfast: "Continental breakfast",
          lunch: "Local Himachali thali",
          dinner: "Dinner at hotel"
        },
        accommodation: "hotel4",
        transportation: "Car"
      },
    ],
    rating: 4.6,
    reviews: 82,
    featured: false
  },
  {
    id: "trip4",
    title: "Beach Paradise in Goa",
    description: "Enjoy the sun, sand and sea in beautiful Goa with activities and beach time.",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1000&auto=format&fit=crop",
    price: 35000,
    originalPrice: 35000,
    discountPercentage: 0,
    duration: 4,
    states: ["goa"],
    category: "Beach",
    bestTime: "October to March",
    itinerary: [
      {
        day: 1,
        attractions: ["attraction5"],
        meals: {
          breakfast: "Hotel breakfast",
          lunch: "Seafood at beach shack",
          dinner: "BBQ dinner"
        },
        accommodation: "hotel5",
        transportation: "Scooter"
      },
    ],
    rating: 4.7,
    reviews: 110,
    featured: true
  },
  {
    id: "trip5",
    title: "Budget North India Explorer",
    description: "Explore the highlights of North India including the Taj Mahal on a budget.",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1000&auto=format&fit=crop",
    price: 20000,
    originalPrice: 20000,
    discountedPrice: 18000,
    discountPercentage: 10,
    duration: 8,
    states: ["uttarpradesh", "delhi"],
    category: "Budget",
    bestTime: "October to April",
    itinerary: [
      {
        day: 1,
        attractions: ["attraction1"],
        meals: {
          breakfast: "Hotel breakfast",
          lunch: "Local thali",
          dinner: "Street food tour"
        },
        accommodation: "Budget hotel",
        transportation: "Train"
      },
    ],
    rating: 4.4,
    reviews: 75,
    featured: false
  },
  {
    id: "trip6",
    title: "Spiritual Journey to Varanasi",
    description: "Experience the spiritual essence of India in the holy city of Varanasi.",
    image: "https://images.unsplash.com/photo-1561361058-c24e01901c1c?q=80&w=1000&auto=format&fit=crop",
    price: 25000,
    originalPrice: 25000,
    discountPercentage: 0,
    duration: 5,
    states: ["uttarpradesh"],
    category: "Spiritual",
    bestTime: "October to March",
    itinerary: [
      {
        day: 1,
        attractions: ["Dashashwamedh Ghat"],
        meals: {
          breakfast: "Hotel breakfast",
          lunch: "Local vegetarian thali",
          dinner: "Dinner at hotel"
        },
        accommodation: "Riverside hotel",
        transportation: "Walking tour"
      },
    ],
    rating: 4.9,
    reviews: 65,
    featured: true
  },
  {
    id: "trip7",
    title: "Wildlife Safari in Ranthambore",
    description: "Spot tigers and other wildlife in the famous Ranthambore National Park.",
    image: "https://images.unsplash.com/photo-1566742329846-ce32629a2c1e?q=80&w=1000&auto=format&fit=crop",
    price: 40000,
    originalPrice: 40000,
    discountedPrice: 36000,
    discountPercentage: 10,
    duration: 4,
    states: ["rajasthan"],
    category: "Wildlife",
    bestTime: "October to April",
    itinerary: [
      {
        day: 1,
        attractions: ["Ranthambore National Park"],
        meals: {
          breakfast: "Early morning tea and snacks",
          lunch: "Lunch at resort",
          dinner: "Dinner with wildlife documentary"
        },
        accommodation: "Jungle resort",
        transportation: "Jeep safari"
      },
    ],
    rating: 4.7,
    reviews: 88,
    featured: false
  },
  {
    id: "trip8",
    title: "Adventure in Rishikesh",
    description: "Experience thrilling activities like river rafting, bungee jumping and more in Rishikesh.",
    image: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?q=80&w=1000&auto=format&fit=crop",
    price: 28000,
    originalPrice: 28000,
    discountPercentage: 0,
    duration: 5,
    states: ["uttarakhand"],
    category: "Adventure",
    bestTime: "September to June",
    itinerary: [
      {
        day: 1,
        attractions: ["River Ganges"],
        meals: {
          breakfast: "Hotel breakfast",
          lunch: "Packed lunch",
          dinner: "Dinner at camp"
        },
        accommodation: "Riverside camp",
        transportation: "Shared jeep"
      },
    ],
    rating: 4.8,
    reviews: 92,
    featured: true
  },
  {
    id: "trip9",
    title: "Cultural Tour of South India",
    description: "Explore the rich cultural heritage, temples, and cuisine of South India.",
    image: "https://images.unsplash.com/photo-1555394752-30cacce17cb8?q=80&w=1000&auto=format&fit=crop",
    price: 55000,
    originalPrice: 55000,
    discountPercentage: 0,
    duration: 10,
    states: ["tamil_nadu", "karnataka", "kerala"],
    category: "Cultural",
    bestTime: "October to March",
    itinerary: [
      {
        day: 1,
        attractions: ["Meenakshi Temple"],
        meals: {
          breakfast: "South Indian breakfast",
          lunch: "Traditional banana leaf meal",
          dinner: "Hotel dinner"
        },
        accommodation: "Heritage hotel",
        transportation: "Car with driver"
      },
    ],
    rating: 4.6,
    reviews: 70,
    featured: false
  },
  {
    id: "trip10",
    title: "Quick Delhi Gateway",
    description: "A short but comprehensive tour of India's capital city.",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1000&auto=format&fit=crop",
    price: 15000,
    originalPrice: 15000,
    discountPercentage: 0,
    duration: 3,
    states: ["delhi"],
    category: "Small",
    bestTime: "October to March",
    itinerary: [
      {
        day: 1,
        attractions: ["Red Fort"],
        meals: {
          breakfast: "Hotel breakfast",
          lunch: "Old Delhi street food",
          dinner: "Dinner at hotel"
        },
        accommodation: "City center hotel",
        transportation: "Metro and auto-rickshaw"
      },
    ],
    rating: 4.3,
    reviews: 45,
    featured: false
  }
];

export const tripData = trips;
