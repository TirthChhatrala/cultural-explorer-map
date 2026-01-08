import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ZoomIn, ZoomOut, Navigation, Info, Globe, ExternalLink, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface StateInfo {
  name: string;
  capital: string;
  population: string;
  area: string;
  languages: string[];
  majorCities: string[];
  description: string;
  climate: string;
  famousFor: string[];
  bestTimeToVisit: string;
}

// Actual SVG paths for Indian states (simplified but visible)
const statesPaths: { [key: string]: { path: string; x: number; y: number } } = {
  'Jammu & Kashmir': { path: 'M 280 50 L 350 40 L 380 80 L 360 120 L 320 130 L 280 100 Z', x: 320, y: 80 },
  'Himachal Pradesh': { path: 'M 320 130 L 360 120 L 380 150 L 350 170 L 310 160 Z', x: 340, y: 145 },
  'Punjab': { path: 'M 280 140 L 320 130 L 310 170 L 280 180 L 260 160 Z', x: 290, y: 155 },
  'Uttarakhand': { path: 'M 350 170 L 390 150 L 420 170 L 400 200 L 360 195 Z', x: 380, y: 175 },
  'Haryana': { path: 'M 280 180 L 310 170 L 320 195 L 300 220 L 270 200 Z', x: 295, y: 195 },
  'Delhi': { path: 'M 300 205 L 315 200 L 320 215 L 305 220 Z', x: 310, y: 210 },
  'Rajasthan': { path: 'M 180 200 L 270 180 L 300 220 L 290 300 L 230 320 L 160 280 Z', x: 230, y: 250 },
  'Uttar Pradesh': { path: 'M 300 220 L 400 200 L 450 240 L 440 300 L 380 320 L 320 300 L 290 260 Z', x: 370, y: 260 },
  'Bihar': { path: 'M 450 240 L 510 230 L 540 270 L 520 300 L 470 310 L 440 280 Z', x: 485, y: 270 },
  'Sikkim': { path: 'M 545 230 L 560 225 L 570 240 L 555 255 L 540 245 Z', x: 555, y: 240 },
  'Arunachal Pradesh': { path: 'M 580 200 L 680 180 L 700 220 L 660 260 L 590 250 Z', x: 640, y: 220 },
  'Nagaland': { path: 'M 660 260 L 700 250 L 710 280 L 680 300 L 650 285 Z', x: 680, y: 275 },
  'Manipur': { path: 'M 650 300 L 690 290 L 700 320 L 670 340 L 640 320 Z', x: 670, y: 315 },
  'Mizoram': { path: 'M 640 340 L 680 330 L 690 370 L 660 400 L 630 380 Z', x: 660, y: 365 },
  'Tripura': { path: 'M 610 340 L 640 330 L 650 365 L 625 380 L 600 360 Z', x: 625, y: 355 },
  'Meghalaya': { path: 'M 570 280 L 620 270 L 640 295 L 610 315 L 565 305 Z', x: 600, y: 290 },
  'Assam': { path: 'M 540 250 L 590 240 L 660 260 L 650 300 L 600 320 L 560 300 Z', x: 600, y: 275 },
  'West Bengal': { path: 'M 520 300 L 560 290 L 580 340 L 560 400 L 520 420 L 500 380 L 510 340 Z', x: 535, y: 355 },
  'Jharkhand': { path: 'M 470 310 L 520 300 L 530 350 L 500 380 L 460 370 L 450 340 Z', x: 490, y: 340 },
  'Odisha': { path: 'M 460 370 L 520 360 L 540 420 L 510 470 L 450 460 L 430 410 Z', x: 480, y: 415 },
  'Chhattisgarh': { path: 'M 400 340 L 460 330 L 470 400 L 440 450 L 380 440 L 370 390 Z', x: 420, y: 385 },
  'Madhya Pradesh': { path: 'M 280 280 L 380 260 L 410 320 L 400 380 L 330 400 L 260 370 L 240 320 Z', x: 325, y: 330 },
  'Gujarat': { path: 'M 120 280 L 180 260 L 220 300 L 210 370 L 160 420 L 100 400 L 80 340 Z', x: 155, y: 340 },
  'Maharashtra': { path: 'M 210 370 L 280 340 L 340 380 L 380 440 L 340 500 L 260 520 L 180 480 L 170 420 Z', x: 280, y: 440 },
  'Goa': { path: 'M 180 490 L 200 480 L 210 510 L 190 525 L 175 510 Z', x: 190, y: 505 },
  'Karnataka': { path: 'M 180 510 L 260 500 L 300 540 L 280 600 L 220 620 L 170 580 L 160 530 Z', x: 220, y: 560 },
  'Andhra Pradesh': { path: 'M 280 480 L 380 460 L 430 500 L 420 560 L 360 600 L 290 580 L 260 530 Z', x: 345, y: 525 },
  'Telangana': { path: 'M 300 440 L 380 420 L 400 470 L 370 510 L 310 500 L 280 460 Z', x: 340, y: 465 },
  'Kerala': { path: 'M 200 620 L 240 600 L 260 660 L 240 720 L 210 710 L 195 660 Z', x: 225, y: 665 },
  'Tamil Nadu': { path: 'M 240 600 L 320 580 L 360 620 L 340 700 L 280 720 L 230 690 L 220 640 Z', x: 290, y: 650 },
};

const stateData: { [key: string]: StateInfo } = {
  'Jammu & Kashmir': {
    name: 'Jammu & Kashmir',
    capital: 'Srinagar (Summer), Jammu (Winter)',
    population: '12.5 million',
    area: '222,236 km²',
    languages: ['Kashmiri', 'Urdu', 'Dogri', 'Hindi'],
    majorCities: ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla'],
    description: 'Known as "Paradise on Earth" for its stunning natural beauty, snow-capped mountains, and serene lakes.',
    climate: 'Temperate climate with cold winters and mild summers',
    famousFor: ['Dal Lake', 'Gulmarg', 'Vaishno Devi', 'Shalimar Bagh', 'Houseboats'],
    bestTimeToVisit: 'April to October'
  },
  'Himachal Pradesh': {
    name: 'Himachal Pradesh',
    capital: 'Shimla',
    population: '6.9 million',
    area: '55,673 km²',
    languages: ['Hindi', 'Pahari', 'Punjabi', 'English'],
    majorCities: ['Shimla', 'Dharamshala', 'Manali', 'Solan', 'Mandi'],
    description: 'Hill state known for its scenic beauty, adventure sports, and spiritual retreats.',
    climate: 'Temperate climate with snow in higher altitudes',
    famousFor: ['Shimla', 'Manali', 'Dharamshala', 'Spiti Valley', 'Adventure Sports'],
    bestTimeToVisit: 'March to June, September to November'
  },
  'Punjab': {
    name: 'Punjab',
    capital: 'Chandigarh',
    population: '27.7 million',
    area: '50,362 km²',
    languages: ['Punjabi', 'Hindi', 'English'],
    majorCities: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda'],
    description: 'Land of five rivers, known for agriculture, Sikh heritage, and vibrant culture.',
    climate: 'Continental climate with hot summers and cold winters',
    famousFor: ['Golden Temple', 'Wagah Border', 'Punjabi Culture', 'Agriculture', 'Bhangra'],
    bestTimeToVisit: 'October to March'
  },
  'Rajasthan': {
    name: 'Rajasthan',
    capital: 'Jaipur',
    population: '68.5 million',
    area: '342,239 km²',
    languages: ['Hindi', 'Rajasthani', 'English'],
    majorCities: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'],
    description: 'The land of kings and deserts, famous for its palaces, forts, and vibrant culture.',
    climate: 'Desert climate with extreme temperatures and low rainfall',
    famousFor: ['Thar Desert', 'Hawa Mahal', 'City Palace', 'Amber Fort', 'Lake Palace'],
    bestTimeToVisit: 'October to March'
  },
  'Gujarat': {
    name: 'Gujarat',
    capital: 'Gandhinagar',
    population: '60.4 million',
    area: '196,244 km²',
    languages: ['Gujarati', 'Hindi', 'English'],
    majorCities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
    description: 'Known for its entrepreneurial spirit, vibrant culture, and the birthplace of Mahatma Gandhi.',
    climate: 'Arid to semi-arid with hot summers and mild winters',
    famousFor: ['Rann of Kutch', 'Statue of Unity', 'Gir National Park', 'Dwarka', 'Somnath Temple'],
    bestTimeToVisit: 'November to February'
  },
  'Maharashtra': {
    name: 'Maharashtra',
    capital: 'Mumbai',
    population: '112.4 million',
    area: '307,713 km²',
    languages: ['Marathi', 'Hindi', 'English'],
    majorCities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
    description: 'The economic powerhouse of India, known for Bollywood and financial capital Mumbai.',
    climate: 'Tropical monsoon climate with three distinct seasons',
    famousFor: ['Bollywood', 'Gateway of India', 'Ajanta & Ellora Caves', 'Lonavala', 'Shirdi'],
    bestTimeToVisit: 'October to March'
  },
  'Karnataka': {
    name: 'Karnataka',
    capital: 'Bengaluru',
    population: '61.1 million',
    area: '191,791 km²',
    languages: ['Kannada', 'Hindi', 'English'],
    majorCities: ['Bengaluru', 'Mysuru', 'Hubli', 'Mangaluru', 'Belagavi'],
    description: 'The Silicon Valley of India, known for IT industry and rich cultural heritage.',
    climate: 'Tropical savanna climate with pleasant weather year-round',
    famousFor: ['Mysore Palace', 'Coorg', 'Hampi', 'Gokarna', 'Bandipur National Park'],
    bestTimeToVisit: 'October to March'
  },
  'Kerala': {
    name: 'Kerala',
    capital: 'Thiruvananthapuram',
    population: '33.4 million',
    area: '38,852 km²',
    languages: ['Malayalam', 'Tamil', 'Hindi', 'English'],
    majorCities: ['Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Alappuzha'],
    description: "God's Own Country with backwaters, spices, and Ayurvedic traditions.",
    climate: 'Tropical climate with heavy monsoons',
    famousFor: ['Backwaters', 'Beaches', 'Spice Plantations', 'Ayurveda', 'Kathakali'],
    bestTimeToVisit: 'September to March'
  },
  'Tamil Nadu': {
    name: 'Tamil Nadu',
    capital: 'Chennai',
    population: '72.1 million',
    area: '130,060 km²',
    languages: ['Tamil', 'English', 'Hindi'],
    majorCities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
    description: 'Known for its ancient temples, classical dance, and automotive industry.',
    climate: 'Tropical climate with hot summers and moderate monsoons',
    famousFor: ['Meenakshi Temple', 'Marina Beach', 'Ooty', 'Kodaikanal', 'Mamallapuram'],
    bestTimeToVisit: 'November to March'
  },
  'Uttar Pradesh': {
    name: 'Uttar Pradesh',
    capital: 'Lucknow',
    population: '199.8 million',
    area: '240,928 km²',
    languages: ['Hindi', 'Urdu', 'English'],
    majorCities: ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Allahabad'],
    description: 'Most populous state with rich history, spiritual significance, and the Taj Mahal.',
    climate: 'Subtropical climate with hot summers and cold winters',
    famousFor: ['Taj Mahal', 'Varanasi', 'Allahabad', 'Mathura', 'Ayodhya'],
    bestTimeToVisit: 'October to March'
  },
  'West Bengal': {
    name: 'West Bengal',
    capital: 'Kolkata',
    population: '91.3 million',
    area: '88,752 km²',
    languages: ['Bengali', 'Hindi', 'English'],
    majorCities: ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri'],
    description: 'Cultural capital of India, known for literature, arts, and intellectual heritage.',
    climate: 'Tropical wet-dry climate with hot humid summers',
    famousFor: ['Victoria Memorial', 'Howrah Bridge', 'Darjeeling', 'Sundarbans', 'Durga Puja'],
    bestTimeToVisit: 'October to March'
  },
  'Goa': {
    name: 'Goa',
    capital: 'Panaji',
    population: '1.5 million',
    area: '3,702 km²',
    languages: ['Konkani', 'Marathi', 'Hindi', 'English'],
    majorCities: ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda'],
    description: "India's beach paradise with Portuguese colonial heritage and vibrant nightlife.",
    climate: 'Tropical climate with monsoon season',
    famousFor: ['Beaches', 'Churches', 'Portuguese Architecture', 'Dudhsagar Falls', 'Carnival'],
    bestTimeToVisit: 'November to February'
  },
  'Madhya Pradesh': {
    name: 'Madhya Pradesh',
    capital: 'Bhopal',
    population: '72.6 million',
    area: '308,245 km²',
    languages: ['Hindi', 'Bundeli', 'Malvi', 'Bhili'],
    majorCities: ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain'],
    description: 'Heart of India with historical monuments, wildlife sanctuaries, and ancient temples.',
    climate: 'Subtropical climate with hot summers',
    famousFor: ['Khajuraho Temples', 'Sanchi Stupa', 'Kanha National Park', 'Bhimbetka Caves', 'Ujjain'],
    bestTimeToVisit: 'October to March'
  },
  'Andhra Pradesh': {
    name: 'Andhra Pradesh',
    capital: 'Amaravati',
    population: '49.4 million',
    area: '162,968 km²',
    languages: ['Telugu', 'Hindi', 'English'],
    majorCities: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool'],
    description: 'Known for its rich cultural heritage, spicy cuisine, and the famous Tirupati temple.',
    climate: 'Tropical climate with hot summers and moderate winters',
    famousFor: ['Tirupati Temple', 'Araku Valley', 'Borra Caves', 'Gandikota Canyon', 'Amaravati'],
    bestTimeToVisit: 'October to March'
  },
  'Telangana': {
    name: 'Telangana',
    capital: 'Hyderabad',
    population: '35.0 million',
    area: '112,077 km²',
    languages: ['Telugu', 'Hindi', 'English', 'Urdu'],
    majorCities: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam'],
    description: 'Known for IT industry, pearls, and the historic city of Hyderabad.',
    climate: 'Semi-arid climate with hot summers',
    famousFor: ['Charminar', 'Golconda Fort', 'IT Hub', 'Biryani', 'Ramoji Film City'],
    bestTimeToVisit: 'October to March'
  },
  'Odisha': {
    name: 'Odisha',
    capital: 'Bhubaneswar',
    population: '42.0 million',
    area: '155,707 km²',
    languages: ['Odia', 'Hindi', 'English', 'Telugu'],
    majorCities: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur'],
    description: 'Land of temples with classical dance, art, and the famous Jagannath temple.',
    climate: 'Tropical climate with hot summers',
    famousFor: ['Jagannath Temple', 'Konark Sun Temple', 'Chilika Lake', 'Odissi Dance', 'Handicrafts'],
    bestTimeToVisit: 'October to March'
  },
  'Chhattisgarh': {
    name: 'Chhattisgarh',
    capital: 'Raipur',
    population: '25.5 million',
    area: '135,192 km²',
    languages: ['Hindi', 'Chhattisgarhi', 'Gondi'],
    majorCities: ['Raipur', 'Bhilai', 'Korba', 'Bilaspur', 'Durg'],
    description: 'Known for its tribal culture, waterfalls, and ancient temples.',
    climate: 'Tropical climate with distinct wet and dry seasons',
    famousFor: ['Chitrakote Falls', 'Bastar', 'Sirpur', 'Barnawapara Sanctuary', 'Tribal Culture'],
    bestTimeToVisit: 'October to March'
  },
  'Jharkhand': {
    name: 'Jharkhand',
    capital: 'Ranchi',
    population: '33.0 million',
    area: '79,716 km²',
    languages: ['Hindi', 'Santali', 'Mundari', 'Ho'],
    majorCities: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar'],
    description: 'Rich in minerals and tribal heritage with beautiful waterfalls and forests.',
    climate: 'Tropical climate with distinct seasons',
    famousFor: ['Waterfalls', 'Tribal Culture', 'Minerals', 'Betla National Park', 'Parasnath Hill'],
    bestTimeToVisit: 'October to March'
  },
  'Bihar': {
    name: 'Bihar',
    capital: 'Patna',
    population: '104.1 million',
    area: '94,163 km²',
    languages: ['Hindi', 'Bhojpuri', 'Maithili', 'Urdu'],
    majorCities: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga'],
    description: 'Ancient land of Buddha and Mahavira, rich in history and spirituality.',
    climate: 'Subtropical climate with hot summers and cold winters',
    famousFor: ['Bodh Gaya', 'Nalanda University', 'Rajgir', 'Vaishali', 'Vikramshila'],
    bestTimeToVisit: 'October to March'
  },
  'Assam': {
    name: 'Assam',
    capital: 'Dispur',
    population: '31.2 million',
    area: '78,438 km²',
    languages: ['Assamese', 'Bengali', 'Hindi', 'English'],
    majorCities: ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon'],
    description: 'Famous for tea gardens, silk production, and the mighty Brahmaputra River.',
    climate: 'Subtropical climate with heavy monsoons',
    famousFor: ['Kaziranga National Park', 'Majuli Island', 'Kamakhya Temple', 'Tea Gardens', 'Assam Silk'],
    bestTimeToVisit: 'November to April'
  },
  'Arunachal Pradesh': {
    name: 'Arunachal Pradesh',
    capital: 'Itanagar',
    population: '1.4 million',
    area: '83,743 km²',
    languages: ['English', 'Hindi', 'Local dialects'],
    majorCities: ['Itanagar', 'Naharlagun', 'Pasighat', 'Tawang', 'Ziro'],
    description: 'The "Land of Dawn-lit Mountains" known for its pristine beauty and diverse tribal culture.',
    climate: 'Subtropical highland climate with heavy monsoons',
    famousFor: ['Tawang Monastery', 'Sela Pass', 'Namdapha National Park', 'Ziro Valley', 'Bumla Pass'],
    bestTimeToVisit: 'October to April'
  },
  'Sikkim': {
    name: 'Sikkim',
    capital: 'Gangtok',
    population: '0.6 million',
    area: '7,096 km²',
    languages: ['Nepali', 'Sikkimese', 'Lepcha', 'English'],
    majorCities: ['Gangtok', 'Namchi', 'Gyalshing', 'Mangan', 'Jorethang'],
    description: 'Himalayan paradise with monasteries, mountain peaks, and organic farming.',
    climate: 'Alpine climate with cool summers and cold winters',
    famousFor: ['Kanchenjunga', 'Tsomgo Lake', 'Monasteries', 'Yak Safari', 'Organic State'],
    bestTimeToVisit: 'March to June, September to December'
  },
  'Meghalaya': {
    name: 'Meghalaya',
    capital: 'Shillong',
    population: '3.0 million',
    area: '22,429 km²',
    languages: ['English', 'Khasi', 'Garo', 'Jaintia'],
    majorCities: ['Shillong', 'Tura', 'Cherrapunji', 'Jowai', 'Nongpoh'],
    description: 'Abode of Clouds with living root bridges, waterfalls, and matrilineal society.',
    climate: 'Subtropical highland climate with heavy rainfall',
    famousFor: ['Living Root Bridges', 'Cherrapunji', 'Mawsynram', 'Dawki River', 'Nohkalikai Falls'],
    bestTimeToVisit: 'October to April'
  },
  'Tripura': {
    name: 'Tripura',
    capital: 'Agartala',
    population: '3.7 million',
    area: '10,486 km²',
    languages: ['Bengali', 'Tripuri', 'English', 'Hindi'],
    majorCities: ['Agartala', 'Dharmanagar', 'Udaipur', 'Kailashahar', 'Belonia'],
    description: 'Land of palaces with rich tribal culture and historical monuments.',
    climate: 'Subtropical climate with heavy monsoons',
    famousFor: ['Ujjayanta Palace', 'Neermahal', 'Tripura Sundari Temple', 'Bamboo Handicrafts', 'Tea Gardens'],
    bestTimeToVisit: 'October to March'
  },
  'Mizoram': {
    name: 'Mizoram',
    capital: 'Aizawl',
    population: '1.1 million',
    area: '21,081 km²',
    languages: ['Mizo', 'English', 'Hindi'],
    majorCities: ['Aizawl', 'Lunglei', 'Serchhip', 'Champhai', 'Kolasib'],
    description: 'Land of rolling hills with rich cultural traditions and bamboo forests.',
    climate: 'Subtropical highland climate',
    famousFor: ['Blue Mountain', 'Phawngpui Peak', 'Reiek Peak', 'Vantawng Falls', 'Bamboo Crafts'],
    bestTimeToVisit: 'October to March'
  },
  'Manipur': {
    name: 'Manipur',
    capital: 'Imphal',
    population: '2.9 million',
    area: '22,327 km²',
    languages: ['Manipuri', 'English', 'Hindi'],
    majorCities: ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur', 'Kakching'],
    description: 'Known for classical dance, natural beauty, and unique floating islands.',
    climate: 'Subtropical highland climate',
    famousFor: ['Loktak Lake', 'Manipuri Dance', 'Kangla Fort', 'Keibul Lamjao National Park', 'Handloom'],
    bestTimeToVisit: 'October to March'
  },
  'Nagaland': {
    name: 'Nagaland',
    capital: 'Kohima',
    population: '2.0 million',
    area: '16,579 km²',
    languages: ['English', 'Ao', 'Angami', 'Sema'],
    majorCities: ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha'],
    description: 'Land of festivals with vibrant tribal culture and warrior traditions.',
    climate: 'Subtropical highland climate',
    famousFor: ['Hornbill Festival', 'Naga Cuisine', 'Traditional Crafts', 'Dzukou Valley', 'War Cemetery'],
    bestTimeToVisit: 'October to May'
  },
  'Haryana': {
    name: 'Haryana',
    capital: 'Chandigarh',
    population: '25.4 million',
    area: '44,212 km²',
    languages: ['Hindi', 'Haryanvi', 'Punjabi', 'English'],
    majorCities: ['Faridabad', 'Gurgaon', 'Panipat', 'Ambala', 'Yamunanagar'],
    description: 'Agricultural heartland and industrial hub near the national capital.',
    climate: 'Semi-arid climate with hot summers and cold winters',
    famousFor: ['Kurukshetra', 'Sultanpur Bird Sanctuary', 'Pinjore Gardens', 'Morni Hills', 'Industrial Growth'],
    bestTimeToVisit: 'October to March'
  },
  'Uttarakhand': {
    name: 'Uttarakhand',
    capital: 'Dehradun',
    population: '10.1 million',
    area: '53,483 km²',
    languages: ['Hindi', 'Garhwali', 'Kumaoni', 'English'],
    majorCities: ['Dehradun', 'Haridwar', 'Rishikesh', 'Nainital', 'Mussoorie'],
    description: 'Dev Bhoomi with Himalayan peaks, pilgrimage sites, and adventure tourism.',
    climate: 'Varies from subtropical to alpine',
    famousFor: ['Char Dham', 'Nainital', 'Rishikesh', 'Valley of Flowers', 'Jim Corbett National Park'],
    bestTimeToVisit: 'March to June, September to November'
  },
  'Delhi': {
    name: 'Delhi',
    capital: 'New Delhi',
    population: '16.8 million',
    area: '1,484 km²',
    languages: ['Hindi', 'Punjabi', 'Urdu', 'English'],
    majorCities: ['New Delhi', 'Old Delhi'],
    description: 'The capital of India, known for its historical monuments and political significance.',
    climate: 'Subtropical climate with hot summers and cold winters',
    famousFor: ['India Gate', 'Red Fort', 'Qutub Minar', 'Lotus Temple', 'Parliament House'],
    bestTimeToVisit: 'October to March'
  }
};

const IndiaMapSVG = () => {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState<StateInfo | null>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [favorites, setFavorites] = useState<string[]>([]);

  const handleStateClick = (stateName: string) => {
    const state = stateData[stateName];
    if (state) {
      setSelectedState(state);
    }
  };

  const handleExploreMore = () => {
    if (selectedState) {
      const stateSlug = selectedState.name.toLowerCase().replace(/\s+/g, '').replace(/&/g, '');
      navigate(`/state/${stateSlug}`);
    }
  };

  const toggleFavorite = (stateName: string) => {
    setFavorites(prev =>
      prev.includes(stateName)
        ? prev.filter(name => name !== stateName)
        : [...prev, stateName]
    );
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden rounded-xl">
      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setZoomLevel(prev => Math.min(prev * 1.2, 2))}
          className="bg-white/90 backdrop-blur-sm shadow-lg"
        >
          <ZoomIn size={18} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setZoomLevel(prev => Math.max(prev / 1.2, 0.6))}
          className="bg-white/90 backdrop-blur-sm shadow-lg"
        >
          <ZoomOut size={18} />
        </Button>
      </div>

      {/* Map SVG */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <motion.svg
          viewBox="50 20 700 720"
          className="w-full h-full max-w-2xl"
          style={{ transform: `scale(${zoomLevel})` }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: zoomLevel }}
          transition={{ duration: 0.5 }}
        >
          <defs>
            <linearGradient id="stateGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#ff9800', stopOpacity: 0.9 }} />
              <stop offset="100%" style={{ stopColor: '#ff5722', stopOpacity: 0.9 }} />
            </linearGradient>
            <linearGradient id="hoverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#ffeb3b', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#ff9800', stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="selectedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#4caf50', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#2e7d32', stopOpacity: 1 }} />
            </linearGradient>
            <filter id="shadow">
              <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Render states */}
          {Object.entries(statesPaths).map(([name, data]) => (
            <motion.g key={name}>
              <motion.path
                d={data.path}
                fill={
                  selectedState?.name === name
                    ? 'url(#selectedGradient)'
                    : hoveredState === name
                    ? 'url(#hoverGradient)'
                    : 'url(#stateGradient)'
                }
                stroke="#ffffff"
                strokeWidth="2"
                filter="url(#shadow)"
                className="cursor-pointer transition-all duration-200"
                onClick={() => handleStateClick(name)}
                onMouseEnter={() => setHoveredState(name)}
                onMouseLeave={() => setHoveredState(null)}
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: Math.random() * 0.5 }}
              />
              <text
                x={data.x}
                y={data.y}
                textAnchor="middle"
                fontSize="8"
                fill="#333"
                fontWeight="600"
                className="pointer-events-none select-none"
                style={{ textShadow: '0 1px 2px rgba(255,255,255,0.8)' }}
              >
                {name.length > 12 ? name.slice(0, 10) + '..' : name}
              </text>
            </motion.g>
          ))}
        </motion.svg>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-20">
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <MapPin size={16} className="text-india-orange" />
              <span>Click on any state to explore</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {Object.keys(statesPaths).length} States & UTs
            </div>
          </CardContent>
        </Card>
      </div>

      {/* State Info Panel */}
      {selectedState && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="absolute top-4 right-16 w-80 max-h-[calc(100%-2rem)] overflow-y-auto z-30"
        >
          <Card className="bg-white/95 backdrop-blur-md shadow-2xl border-2 border-india-orange/30">
            <CardHeader className="bg-gradient-to-r from-india-orange to-orange-600 text-white rounded-t-lg pb-3">
              <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex items-center gap-2">
                  <MapPin size={20} />
                  {selectedState.name}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleFavorite(selectedState.name)}
                  className="text-white hover:bg-white/20 h-8 w-8"
                >
                  <Heart
                    size={16}
                    className={favorites.includes(selectedState.name) ? 'fill-current' : ''}
                  />
                </Button>
              </CardTitle>
              <CardDescription className="text-orange-100 text-sm">
                Capital: {selectedState.capital}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <p className="text-sm text-gray-700">{selectedState.description}</p>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-orange-50 p-2 rounded-lg">
                  <p className="text-xs text-orange-600 font-medium">Population</p>
                  <p className="text-sm font-semibold">{selectedState.population}</p>
                </div>
                <div className="bg-orange-50 p-2 rounded-lg">
                  <p className="text-xs text-orange-600 font-medium">Area</p>
                  <p className="text-sm font-semibold">{selectedState.area}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-orange-600 font-medium mb-1">Famous For</p>
                <div className="flex flex-wrap gap-1">
                  {selectedState.famousFor.slice(0, 4).map((item, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-gray-100 px-2 py-1 rounded-full"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-green-50 p-2 rounded-lg">
                <p className="text-xs text-green-600 font-medium">Best Time to Visit</p>
                <p className="text-sm font-semibold">{selectedState.bestTimeToVisit}</p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setSelectedState(null)}
                >
                  Close
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-india-orange hover:bg-orange-600"
                  onClick={handleExploreMore}
                >
                  <ExternalLink size={14} className="mr-1" />
                  Explore
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default IndiaMapSVG;
