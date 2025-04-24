interface State {
  id: string;
  name: string;
  capital: string;
  description: string;
  image: string;
  population: string;
  area: string;
  language: string;
  famousFor: string;
  freedomFighters: string[];
  path: string; // Add the path property
}

export const states: State[] = [
  {
    id: "andhrapradesh",
    name: "Andhra Pradesh",
    capital: "Amaravati",
    description: "Known for its rich history, culture, and delicious cuisine.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Bheemunipatnam_Beach_AP.jpg/1920px-Bheemunipatnam_Beach_AP.jpg",
    population: "49,668,000",
    area: "162,975 km²",
    language: "Telugu",
    famousFor: "Tirupati Temple, Borra Caves, Araku Valley",
    freedomFighters: ["Alluri Sitarama Raju", "Tanguturi Prakasam Pantulu"],
    path: "/state/andhrapradesh",
  },
  {
    id: "arunachalpradesh",
    name: "Arunachal Pradesh",
    capital: "Itanagar",
    description:
      "The 'Land of the Dawn-Lit Mountains' is known for its tribal culture and scenic beauty.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Tawang_Monastery_Arunachal_Pradesh.jpg/1920px-Tawang_Monastery_Arunachal_Pradesh.jpg",
    population: "1,384,000",
    area: "83,743 km²",
    language: "English",
    famousFor: "Tawang Monastery, Sela Pass, Namdapha National Park",
    freedomFighters: ["Moje Riba"],
    path: "/state/arunachalpradesh",
  },
  {
    id: "assam",
    name: "Assam",
    capital: "Dispur",
    description: "Famous for its tea plantations and the mighty Brahmaputra River.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Guwahati_Kamakhya_Temple.jpg/1920px-Guwahati_Kamakhya_Temple.jpg",
    population: "31,205,000",
    area: "78,438 km²",
    language: "Assamese",
    famousFor: "Kaziranga National Park, Kamakhya Temple, Majuli Island",
    freedomFighters: ["Maniram Dewan", "Kushal Konwar"],
    path: "/state/assam",
  },
  {
    id: "bihar",
    name: "Bihar",
    capital: "Patna",
    description:
      "Rich in historical significance, being home to ancient empires and religious sites.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Mahabodhi_Temple_at_Bodh_Gaya.jpg/1920px-Mahabodhi_Temple_at_Bodh_Gaya.jpg",
    population: "104,099,000",
    area: "94,163 km²",
    language: "Hindi",
    famousFor: "Mahabodhi Temple, Nalanda University, Vaishali",
    freedomFighters: ["Kunwar Singh", "Jayaprakash Narayan"],
    path: "/state/bihar",
  },
  {
    id: "chhattisgarh",
    name: "Chhattisgarh",
    capital: "Raipur",
    description: "Known for its dense forests, ancient temples, and tribal culture.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Chitrakote_Falls_Chhattisgarh.jpg/1920px-Chitrakote_Falls_Chhattisgarh.jpg",
    population: "25,545,000",
    area: "135,192 km²",
    language: "Hindi",
    famousFor: "Chitrakote Falls, Bastar, Kanha National Park",
    freedomFighters: [" শহীদ বীর নারায়ণ সিং "],
    path: "/state/chhattisgarh",
  },
  {
    id: "goa",
    name: "Goa",
    capital: "Panaji",
    description: "Famous for its beaches, nightlife, and Portuguese heritage.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Baga_Beach_in_Goa.jpg/1920px-Baga_Beach_in_Goa.jpg",
    population: "1,459,000",
    area: "3,702 km²",
    language: "Konkani",
    famousFor: "Beaches, Churches, Dudhsagar Falls",
    freedomFighters: ["T.B. Cunha"],
    path: "/state/goa",
  },
  {
    id: "gujarat",
    name: "Gujarat",
    capital: "Gandhinagar",
    description:
      "Known for its vibrant culture, historical sites, and the birthplace of Mahatma Gandhi.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Statue_of_Unity_view_from_the_top.jpg/1920px-Statue_of_Unity_view_from_the_top.jpg",
    population: "60,439,000",
    area: "196,024 km²",
    language: "Gujarati",
    famousFor: "Statue of Unity, Gir National Park, Rann of Kutch",
    freedomFighters: ["Mahatma Gandhi", "Sardar Vallabhbhai Patel"],
    path: "/state/gujarat",
  },
  {
    id: "haryana",
    name: "Haryana",
    capital: "Chandigarh",
    description:
      "Known for its agricultural significance and proximity to Delhi.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Sultanpur_National_Park_bird_watching.jpg/1920px-Sultanpur_National_Park_bird_watching.jpg",
    population: "25,351,000",
    area: "44,212 km²",
    language: "Hindi",
    famousFor: "Sultanpur National Park, Kurukshetra, Chandigarh",
    freedomFighters: ["Rao Tula Ram"],
    path: "/state/haryana",
  },
  {
    id: "himachalpradesh",
    name: "Himachal Pradesh",
    capital: "Shimla",
    description: "A Himalayan state famous for its scenic beauty and hill stations.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Dalhousie_India.jpg/1920px-Dalhousie_India.jpg",
    population: "6,865,000",
    area: "55,673 km²",
    language: "Hindi",
    famousFor: "Shimla, Manali, Dharamshala",
    freedomFighters: ["Padma Dev"],
    path: "/state/himachalpradesh",
  },
  {
    id: "jharkhand",
    name: "Jharkhand",
    capital: "Ranchi",
    description: "Known for its mineral resources and tribal heritage.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Jonha_Falls.jpg/1920px-Jonha_Falls.jpg",
    population: "32,988,000",
    area: "79,714 km²",
    language: "Hindi",
    famousFor: "Waterfalls, Temples, Wildlife",
    freedomFighters: ["Birsa Munda", "Sidhu and Kanhu Murmu"],
    path: "/state/jharkhand",
  },
  {
    id: "karnataka",
    name: "Karnataka",
    capital: "Bangalore",
    description:
      "A state with diverse landscapes, historical sites, and technological advancements.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Bangalore_Palace_front_view.jpg/1920px-Bangalore_Palace_front_view.jpg",
    population: "61,095,000",
    area: "191,791 km²",
    language: "Kannada",
    famousFor: "Bangalore, Mysore, Hampi",
    freedomFighters: ["Kittur Chennamma", "Sangolli Rayanna"],
    path: "/state/karnataka",
  },
  {
    id: "kerala",
    name: "Kerala",
    capital: "Thiruvananthapuram",
    description: "Known as 'God's Own Country' for its natural beauty and backwaters.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Kerala_Backwaters_Alappuzha.jpg/1920px-Kerala_Backwaters_Alappuzha.jpg",
    population: "33,406,000",
    area: "38,863 km²",
    language: "Malayalam",
    famousFor: "Backwaters, Beaches, Spices",
    freedomFighters: ["Velu Thampi Dalawa", "Pazhassi Raja"],
    path: "/state/kerala",
  },
  {
    id: "madhyapradesh",
    name: "Madhya Pradesh",
    capital: "Bhopal",
    description:
      "Located in the heart of India, known for its historical sites and wildlife.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Khajuraho_Temple_Madhya_Pradesh.jpg/1920px-Khajuraho_Temple_Madhya_Pradesh.jpg",
    population: "72,627,000",
    area: "308,252 km²",
    language: "Hindi",
    famousFor: "Khajuraho, Sanchi, Kanha National Park",
    freedomFighters: ["Rani Lakshmibai", "Tatya Tope"],
    path: "/state/madhyapradesh",
  },
  {
    id: "maharashtra",
    name: "Maharashtra",
    capital: "Mumbai",
    description:
      "A state with a rich cultural heritage, bustling cities, and historical monuments.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Gateway_of_India_Mumbai_India_01.jpg/1920px-Gateway_of_India_Mumbai_India_01.jpg",
    population: "112,374,000",
    area: "307,713 km²",
    language: "Marathi",
    famousFor: "Mumbai, Ajanta Caves, Ellora Caves",
    freedomFighters: ["Shivaji Maharaj", "Bal Gangadhar Tilak"],
    path: "/state/maharashtra",
  },
  {
    id: "manipur",
    name: "Manipur",
    capital: "Imphal",
    description: "Known for its classical dance, scenic landscapes, and unique culture.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Loktak_Lake_and_Sendra_Island_aerial_view.jpg/1920px-Loktak_Lake_and_Sendra_Island_aerial_view.jpg",
    population: "2,856,000",
    area: "22,327 km²",
    language: "Manipuri",
    famousFor: "Loktak Lake, Imphal, Kangla Fort",
    freedomFighters: ["Paona Brajabasi", "Bir Tikendrajit Singh"],
    path: "/state/manipur",
  },
  {
    id: "meghalaya",
    name: "Meghalaya",
    capital: "Shillong",
    description:
      "The 'Abode of the Clouds' is known for its heavy rainfall, caves, and living root bridges.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Nohkalikai_Falls_Meghalaya.jpg/1920px-Nohkalikai_Falls_Meghalaya.jpg",
    population: "2,967,000",
    area: "22,429 km²",
    language: "English",
    famousFor: "Cherrapunjee, Shillong, Living Root Bridges",
    freedomFighters: ["U Tirot Sing", "Kiang Nangbah"],
    path: "/state/meghalaya",
  },
  {
    id: "mizoram",
    name: "Mizoram",
    capital: "Aizawl",
    description: "Known for its rolling hills, dense forests, and vibrant culture.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Phawngpui_Mizoram.jpg/1920px-Phawngpui_Mizoram.jpg",
    population: "1,097,000",
    area: "21,081 km²",
    language: "Mizo",
    famousFor: "Aizawl, Phawngpui, Dampa Tiger Reserve",
    freedomFighters: ["Ropuiliani"],
    path: "/state/mizoram",
  },
  {
    id: "nagaland",
    name: "Nagaland",
    capital: "Kohima",
    description: "Known for its unique tribal culture and festivals.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Khonoma_village_entrance.jpg/1920px-Khonoma_village_entrance.jpg",
    population: "1,978,000",
    area: "16,579 km²",
    language: "English",
    famousFor: "Hornbill Festival, Kohima, Naga Tribes",
    freedomFighters: ["Rani Gaidinliu"],
    path: "/state/nagaland",
  },
  {
    id: "odisha",
    name: "Odisha",
    capital: "Bhubaneswar",
    description: "Known for its ancient temples, art, and culture.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Konark_Sun_Temple.jpg/1920px-Konark_Sun_Temple.jpg",
    population: "41,974,000",
    area: "155,707 km²",
    language: "Odia",
    famousFor: "Puri Jagannath Temple, Konark Sun Temple, Chilika Lake",
    freedomFighters: ["Baji Rout", "Laxman Nayak"],
    path: "/state/odisha",
  },
  {
    id: "punjab",
    name: "Punjab",
    capital: "Chandigarh",
    description: "The 'Land of Five Rivers' is known for its agriculture and Sikh heritage.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Golden_Temple_at_night.jpg/1920px-Golden_Temple_at_night.jpg",
    population: "27,743,000",
    area: "50,362 km²",
    language: "Punjabi",
    famousFor: "Golden Temple, Wagah Border, Jallianwala Bagh",
    freedomFighters: ["Bhagat Singh", "Kartar Singh Sarabha"],
    path: "/state/punjab",
  },
  {
    id: "rajasthan",
    name: "Rajasthan",
    capital: "Jaipur",
    description:
      "The 'Land of Kings' is known for its forts, palaces, and vibrant culture.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Hawa_Mahal_in_Jaipur.jpg/1920px-Hawa_Mahal_in_Jaipur.jpg",
    population: "68,548,000",
    area: "342,239 km²",
    language: "Hindi",
    famousFor: "Jaipur, Udaipur, Jodhpur",
    freedomFighters: ["Maharana Pratap", "Rao Tula Ram"],
    path: "/state/rajasthan",
  },
  {
    id: "sikkim",
    name: "Sikkim",
    capital: "Gangtok",
    description: "A Himalayan state known for its biodiversity and scenic beauty.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/TsomgoLakeSikkim.jpg/1920px-TsomgoLakeSikkim.jpg",
    population: "610,000",
    area: "7,096 km²",
    language: "Nepali",
    famousFor: "Gangtok, Tsomgo Lake, Kanchenjunga",
    freedomFighters: [],
    path: "/state/sikkim",
  },
  {
    id: "tamilnadu",
    name: "Tamil Nadu",
    capital: "Chennai",
    description:
      "Known for its ancient temples, classical arts, and Dravidian culture.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Brihadeeswarar_Temple.jpg/1920px-Brihadeeswarar_Temple.jpg",
    population: "72,147,000",
    area: "130,058 km²",
    language: "Tamil",
    famousFor: "Chennai, Madurai, Temples",
    freedomFighters: ["Veerapandiya Kattabomman", "V.O. Chidambaram Pillai"],
    path: "/state/tamilnadu",
  },
  {
    id: "telangana",
    name: "Telangana",
    capital: "Hyderabad",
    description:
      "Known for its rich history, monuments, and the city of Hyderabad.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Charminar_at_night_%28cropped%29.jpg/1920px-Charminar_at_night_%28cropped%29.jpg",
    population: "35,193,000",
    area: "112,077 km²",
    language: "Telugu",
    famousFor: "Hyderabad, Charminar, Golconda Fort",
    freedomFighters: ["Komaram Bheem"],
    path: "/state/telangana",
  },
  {
    id: "tripura",
    name: "Tripura",
    capital: "Agartala",
    description: "Known for its palaces, temples, and tribal culture.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Neermahal_Lake_Palace_in_Tripura.jpg/1920px-Neermahal_Lake_Palace_in_Tripura.jpg",
    population: "3,674,000",
    area: "10,491 km²",
    language: "Bengali",
    famousFor: "Agartala, Udaipur, Neermahal Palace",
    freedomFighters: [],
    path: "/state/tripura",
  },
  {
    id: "uttarpradesh",
    name: "Uttar Pradesh",
    capital: "Lucknow",
    description:
      "India's most populous state, known for its historical and religious significance.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Taj_Mahal_in_March_2004.jpg/1920px-Taj_Mahal_in_March_2004.jpg",
    population: "199,812,000",
    area: "243,286 km²",
    language: "Hindi",
    famousFor: "Taj Mahal, Varanasi, Allahabad",
    freedomFighters: ["Mangal Pandey", "Rani Lakshmibai"],
    path: "/state/uttarpradesh",
  },
  {
    id: "uttarakhand",
    name: "Uttarakhand",
    capital: "Dehradun",
    description: "Known for its Himalayan landscapes, pilgrimage sites, and adventure activities.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Nainital_Lake_Uttarakhand.jpg/1920px-Nainital_Lake_Uttarakhand.jpg",
    population: "10,086,000",
    area: "53,483 km²",
    language: "Hindi",
    famousFor: "Nainital, Rishikesh, Char Dham",
    freedomFighters: [],
    path: "/state/uttarakhand",
  },
  {
    id: "westbengal",
    name: "West Bengal",
    capital: "Kolkata",
    description:
      "Known for its cultural heritage, literature, and the city of Kolkata.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Howrah_Bridge_Kolkata.jpg/1920px-Howrah_Bridge_Kolkata.jpg",
    population: "91,276,000",
    area: "88,752 km²",
    language: "Bengali",
    famousFor: "Kolkata, Howrah Bridge, Sundarbans",
    freedomFighters: ["Netaji Subhas Chandra Bose", "Khudiram Bose"],
    path: "/state/westbengal",
  },
  {
    id: "delhi",
    name: "Delhi",
    capital: "New Delhi",
    description: "The capital of India, known for its historical monuments and political significance.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Humayun%27s_Tomb_Delhi.jpg/1920px-Humayun%27s_Tomb_Delhi.jpg",
    population: "16,788,000",
    area: "1,484 km²",
    language: "Hindi",
    famousFor: "India Gate, Red Fort, Qutub Minar",
    freedomFighters: [],
    path: "/state/delhi",
  },
];

export default states;
