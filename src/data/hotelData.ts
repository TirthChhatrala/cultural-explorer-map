
export interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  beds: string;
  amenities: string[];
  images: string[];
}

export interface Hotel {
  id: string;
  name: string;
  description: string;
  location: string;
  state: string;
  type: 'hotel' | 'resort' | 'homestay' | 'hostel' | 'villa';
  price: number;
  discountedPrice?: number;
  rating: number;
  reviews: number;
  amenities: string[];
  image: string;
  images: string[];
  featured: boolean;
  rooms: Room[];
  policies: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
    children: string;
    pets: string;
  };
  nearbyAttractions: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export const hotels: Hotel[] = [
  {
    id: "hotel1",
    name: "Taj Lake Palace",
    description: "Luxury hotel in the middle of Lake Pichola offering stunning views and royal service. This former palace provides guests with an unforgettable experience with its white marble architecture and serene surroundings.",
    location: "Udaipur",
    state: "rajasthan",
    type: "hotel",
    price: 25000,
    rating: 5,
    reviews: 487,
    amenities: ["Swimming Pool", "Spa", "Free WiFi", "Restaurant", "24/7 Room Service", "Air Conditioning", "Concierge", "Lake View", "Bar", "Fitness Center"],
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1000&auto=format&fit=crop"
    ],
    featured: true,
    rooms: [
      {
        id: "room1-1",
        name: "Luxury Lake View Room",
        description: "Elegantly appointed room with stunning views of Lake Pichola and the City Palace.",
        price: 25000,
        capacity: 2,
        beds: "1 King Bed",
        amenities: ["Lake View", "Air Conditioning", "Mini Bar", "Free WiFi", "Safe", "Flat-screen TV"],
        images: [
          "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?q=80&w=1000&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000&auto=format&fit=crop"
        ]
      },
      {
        id: "room1-2",
        name: "Royal Suite",
        description: "Expansive suite with separate living area, traditional decor, and panoramic lake views.",
        price: 45000,
        capacity: 3,
        beds: "1 King Bed and 1 Sofa Bed",
        amenities: ["Lake View", "Air Conditioning", "Mini Bar", "Free WiFi", "Safe", "Flat-screen TV", "Living Room", "Butler Service", "Jacuzzi"],
        images: [
          "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1000&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1551525212-a1dc18871d4a?q=80&w=1000&auto=format&fit=crop"
        ]
      }
    ],
    policies: {
      checkIn: "14:00",
      checkOut: "12:00",
      cancellation: "Free cancellation up to 7 days before arrival. After that, a charge equal to 1 night's stay applies.",
      children: "Children of all ages are welcome.",
      pets: "Pets are not allowed."
    },
    nearbyAttractions: ["City Palace", "Jagdish Temple", "Saheliyon-ki-Bari", "Lake Pichola"],
    coordinates: {
      latitude: 24.5753,
      longitude: 73.6831
    }
  },
  {
    id: "hotel2",
    name: "The Oberoi Udaivilas",
    description: "Luxury resort with views of Lake Pichola and the City Palace. The grand architecture and lush gardens create a truly magical setting for a remarkable stay.",
    location: "Udaipur",
    state: "rajasthan",
    type: "resort",
    price: 35000,
    discountedPrice: 31500,
    rating: 5,
    reviews: 562,
    amenities: ["Swimming Pool", "Spa", "Free WiFi", "Restaurant", "24/7 Room Service", "Fitness Center", "Garden", "Lake View", "Bar", "Business Center"],
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000&auto=format&fit=crop", 
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1549638441-b787d2e11f14?q=80&w=1000&auto=format&fit=crop"
    ],
    featured: true,
    rooms: [
      {
        id: "room2-1",
        name: "Premier Room",
        description: "Elegant room with private terrace and semi-private pool access, offering garden or lake views.",
        price: 35000,
        capacity: 2,
        beds: "1 King Bed",
        amenities: ["Terrace", "Pool View", "Air Conditioning", "Mini Bar", "Free WiFi", "Safe", "Flat-screen TV"],
        images: [
          "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1000&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1587985064135-0366536eab42?q=80&w=1000&auto=format&fit=crop"
        ]
      },
      {
        id: "room2-2",
        name: "Luxury Suite with Private Pool",
        description: "Spacious suite with a private pool, courtyard, and butler service.",
        price: 65000,
        capacity: 4,
        beds: "1 King Bed and 2 Twin Beds",
        amenities: ["Private Pool", "Terrace", "Air Conditioning", "Mini Bar", "Free WiFi", "Safe", "Flat-screen TV", "Living Room", "Butler Service"],
        images: [
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1000&auto=format&fit=crop"
        ]
      }
    ],
    policies: {
      checkIn: "14:00",
      checkOut: "12:00",
      cancellation: "Free cancellation up to 14 days before arrival. After that, a charge equal to 50% of the total stay applies.",
      children: "Children of all ages are welcome. Kids under 12 stay free when using existing bedding.",
      pets: "Pets are not allowed."
    },
    nearbyAttractions: ["City Palace", "Jagdish Temple", "Saheliyon-ki-Bari", "Lake Pichola"],
    coordinates: {
      latitude: 24.5754,
      longitude: 73.6808
    }
  },
  {
    id: "hotel3",
    name: "Zostel Munnar",
    description: "Budget-friendly hostel with beautiful mountain views. Perfect for backpackers and those seeking an affordable yet comfortable stay in the tea plantations of Munnar.",
    location: "Munnar",
    state: "kerala",
    type: "hostel",
    price: 800,
    rating: 4,
    reviews: 325,
    amenities: ["Free WiFi", "Shared Kitchen", "Common Area", "Mountain Views", "Terrace", "24/7 Reception", "Tours/Ticket Assistance"],
    image: "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=1000&auto=format&fit=crop"
    ],
    featured: false,
    rooms: [
      {
        id: "room3-1",
        name: "Mixed Dorm",
        description: "6-bed mixed dormitory with lockers and mountain views.",
        price: 800,
        capacity: 1,
        beds: "1 Bunk Bed",
        amenities: ["Shared Bathroom", "Locker", "Free WiFi", "Mountain View"],
        images: [
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1000&auto=format&fit=crop"
        ]
      },
      {
        id: "room3-2",
        name: "Private Room",
        description: "Private room with double bed and mountain views.",
        price: 2000,
        capacity: 2,
        beds: "1 Double Bed",
        amenities: ["Private Bathroom", "Free WiFi", "Mountain View", "Seating Area"],
        images: [
          "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=1000&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1585551897231-77fe523c288a?q=80&w=1000&auto=format&fit=crop"
        ]
      }
    ],
    policies: {
      checkIn: "12:00",
      checkOut: "10:00",
      cancellation: "Free cancellation up to 24 hours before arrival.",
      children: "Adults only (18+).",
      pets: "Pets are not allowed."
    },
    nearbyAttractions: ["Tea Gardens", "Eravikulam National Park", "Tea Museum", "Mattupetty Dam"],
    coordinates: {
      latitude: 10.0889,
      longitude: 77.0595
    }
  },
  {
    id: "hotel4",
    name: "Wildflower Resort",
    description: "Beautiful resort surrounded by pine forests with panoramic Himalayan views. The perfect retreat for those seeking tranquility and natural beauty.",
    location: "Shimla",
    state: "himachalpradesh",
    type: "resort",
    price: 12000,
    rating: 4.5,
    reviews: 218,
    amenities: ["Mountain Views", "Restaurant", "Spa", "Free WiFi", "Room Service", "Hiking", "Bonfire", "Library"],
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1000&auto=format&fit=crop", 
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556438064-2d7646166914?q=80&w=1000&auto=format&fit=crop"
    ],
    featured: false,
    rooms: [
      {
        id: "room4-1",
        name: "Valley View Room",
        description: "Cozy room with breathtaking views of the valley and mountains.",
        price: 12000,
        capacity: 2,
        beds: "1 Queen Bed",
        amenities: ["Mountain View", "Air Conditioning", "Heating", "Mini Bar", "Free WiFi", "Safe", "Flat-screen TV"],
        images: [
          "https://images.unsplash.com/photo-1556438064-2d7646166914?q=80&w=1000&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1000&auto=format&fit=crop"
        ]
      },
      {
        id: "room4-2",
        name: "Luxury Cottage",
        description: "Private cottage with fireplace, sitting area, and panoramic mountain views.",
        price: 18000,
        capacity: 3,
        beds: "1 King Bed and 1 Single Bed",
        amenities: ["Private Balcony", "Fireplace", "Mountain View", "Air Conditioning", "Heating", "Mini Bar", "Free WiFi", "Safe", "Flat-screen TV"],
        images: [
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1000&auto=format&fit=crop"
        ]
      }
    ],
    policies: {
      checkIn: "14:00",
      checkOut: "11:00",
      cancellation: "Free cancellation up to 48 hours before arrival. After that, a charge equal to 1 night's stay applies.",
      children: "Children of all ages are welcome.",
      pets: "Pets are allowed on request. Charges may apply."
    },
    nearbyAttractions: ["Mall Road", "Jakhu Temple", "Christ Church", "The Ridge"],
    coordinates: {
      latitude: 31.1048,
      longitude: 77.1734
    }
  },
  {
    id: "hotel5",
    name: "Goa Marriott Resort & Spa",
    description: "Beachfront resort with amazing sunset views, combining luxury and comfort with the laid-back Goan lifestyle.",
    location: "Panjim",
    state: "goa",
    type: "resort",
    price: 18000,
    discountedPrice: 15300,
    rating: 4.7,
    reviews: 392,
    amenities: ["Beach Access", "Swimming Pool", "Spa", "Multiple Restaurants", "Fitness Center", "Water Sports", "Kids Club", "Casino"],
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1545322894-35b7549c060e?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?q=80&w=1000&auto=format&fit=crop"
    ],
    featured: true,
    rooms: [
      {
        id: "room5-1",
        name: "Deluxe Room with Sea View",
        description: "Spacious room with private balcony offering magnificent views of the Arabian Sea.",
        price: 18000,
        capacity: 2,
        beds: "1 King Bed or 2 Twin Beds",
        amenities: ["Sea View", "Balcony", "Air Conditioning", "Mini Bar", "Free WiFi", "Safe", "Flat-screen TV"],
        images: [
          "https://images.unsplash.com/photo-1545322894-35b7549c060e?q=80&w=1000&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?q=80&w=1000&auto=format&fit=crop"
        ]
      },
      {
        id: "room5-2",
        name: "Executive Suite",
        description: "Luxurious suite with separate living area, dining space, and sea views.",
        price: 30000,
        capacity: 4,
        beds: "1 King Bed and 1 Sofa Bed",
        amenities: ["Sea View", "Balcony", "Living Room", "Dining Area", "Air Conditioning", "Mini Bar", "Free WiFi", "Safe", "Flat-screen TV"],
        images: [
          "https://images.unsplash.com/photo-1612152605347-f93477d5314c?q=80&w=1000&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?q=80&w=1000&auto=format&fit=crop"
        ]
      }
    ],
    policies: {
      checkIn: "15:00",
      checkOut: "12:00",
      cancellation: "Free cancellation up to 72 hours before arrival. After that, a charge equal to 1 night's stay applies.",
      children: "Children of all ages are welcome. Kids under 12 stay free when using existing bedding.",
      pets: "Pets are not allowed."
    },
    nearbyAttractions: ["Miramar Beach", "Dona Paula", "Casino Royale", "Panjim Church"],
    coordinates: {
      latitude: 15.4909,
      longitude: 73.8278
    }
  },
  {
    id: "hotel6",
    name: "The Leela Palace",
    description: "Opulent palace-like hotel featuring grand architecture, landscaped gardens, and world-class amenities.",
    location: "New Delhi",
    state: "delhi",
    type: "hotel",
    price: 22000,
    rating: 4.8,
    reviews: 451,
    amenities: ["Swimming Pool", "Spa", "Multiple Restaurants", "Bar", "Fitness Center", "Butler Service", "Business Center", "Library"],
    image: "https://images.unsplash.com/photo-1605346434674-a440ca2ae372?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1605346434674-a440ca2ae372?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1587985064135-0366536eab42?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1000&auto=format&fit=crop"
    ],
    featured: true,
    rooms: [
      {
        id: "room6-1",
        name: "Deluxe Room",
        description: "Elegant room with beautiful decor and plush furnishings.",
        price: 22000,
        capacity: 2,
        beds: "1 King Bed or 2 Twin Beds",
        amenities: ["Air Conditioning", "Mini Bar", "Free WiFi", "Safe", "Flat-screen TV", "Butler Service"],
        images: [
          "https://images.unsplash.com/photo-1587985064135-0366536eab42?q=80&w=1000&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000&auto=format&fit=crop"
        ]
      },
      {
        id: "room6-2",
        name: "Royal Club Room",
        description: "Spacious room with exclusive access to the Royal Club Lounge.",
        price: 28000,
        capacity: 2,
        beds: "1 King Bed",
        amenities: ["Royal Club Lounge Access", "Air Conditioning", "Mini Bar", "Free WiFi", "Safe", "Flat-screen TV", "Butler Service"],
        images: [
          "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1000&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?q=80&w=1000&auto=format&fit=crop"
        ]
      }
    ],
    policies: {
      checkIn: "14:00",
      checkOut: "12:00",
      cancellation: "Free cancellation up to 48 hours before arrival. After that, a charge equal to 1 night's stay applies.",
      children: "Children of all ages are welcome.",
      pets: "Pets are not allowed."
    },
    nearbyAttractions: ["India Gate", "Qutub Minar", "Lotus Temple", "Humayun's Tomb"],
    coordinates: {
      latitude: 28.5925,
      longitude: 77.2187
    }
  }
];

export const roomAmenities = [
  "Air Conditioning",
  "Balcony",
  "Bathtub",
  "Butler Service",
  "Coffee Machine",
  "Dining Area",
  "Fireplace",
  "Flat-screen TV",
  "Free WiFi",
  "Hairdryer",
  "Heating",
  "Iron",
  "Kitchen",
  "Lake View",
  "Living Room",
  "Locker",
  "Mini Bar",
  "Mountain View",
  "Pool View",
  "Private Bathroom",
  "Private Pool",
  "Safe",
  "Sea View",
  "Seating Area",
  "Shared Bathroom",
  "Sofa",
  "Terrace",
  "Washing Machine",
  "Work Desk"
];

export const hotelAmenities = [
  "24/7 Reception",
  "24/7 Room Service",
  "Airport Shuttle",
  "Bar",
  "Beach Access",
  "Bonfire",
  "Business Center",
  "Casino",
  "Common Area",
  "Concierge",
  "Fitness Center",
  "Free Parking",
  "Free WiFi",
  "Garden",
  "Hiking",
  "Kids Club",
  "Lake View",
  "Library",
  "Mountain Views",
  "Multiple Restaurants",
  "Restaurant",
  "Room Service",
  "Shared Kitchen",
  "Spa",
  "Swimming Pool",
  "Terrace",
  "Tours/Ticket Assistance",
  "Water Sports"
];

export const hotelTypes = [
  { id: "hotel", label: "Hotel" },
  { id: "resort", label: "Resort" },
  { id: "homestay", label: "Homestay" },
  { id: "hostel", label: "Hostel" },
  { id: "villa", label: "Villa" }
];
