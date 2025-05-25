
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Main Pages
import Index from './pages/Index';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Booking from './pages/Booking';

// State and Details
import StateDetails from './pages/StateDetails';
import PoliticalParties from './pages/PoliticalParties';
import FreedomFighters from './pages/FreedomFighters';
import CulturalInformation from './pages/CulturalInformation';

// News and Events
import News from './pages/News';
import Festivals from './pages/Festivals';

// Cultural Sections
import CuisineFood from './pages/CuisineFood';
import TouristAttractions from './pages/TouristAttractions';
import WeatherPatterns from './pages/WeatherPatterns';
import TraditionalClothing from './pages/TraditionalClothing';
import HistoricalSites from './pages/HistoricalSites';

// Travel and Hospitality
import Trips from './pages/Trips';
import TripDetails from './pages/TripDetails';
import CustomTrip from './pages/CustomTrip';
import MyTrips from './pages/MyTrips';
import Hotels from './pages/Hotels';
import HotelDetails from './pages/HotelDetails';
import Casinos from './pages/Casinos';
import CasinoDetails from './pages/CasinoDetails';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import ManageStates from './pages/admin/ManageStates';
import ManageParties from './pages/admin/ManageParties';
import ManageFreedomFighters from './pages/admin/ManageFreedomFighters';
import ManageNews from './pages/admin/ManageNews';
import ManageFestivals from './pages/admin/ManageFestivals';
import ManageTrips from './pages/admin/ManageTrips';
import ManageImages from './pages/admin/ManageImages';

// 404 Page
import NotFound from './pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* Booking System */}
      <Route path="/booking" element={<Booking />} />
      
      {/* State and Cultural Routes */}
      <Route path="/state/:stateId" element={<StateDetails />} />
      <Route path="/political-parties" element={<PoliticalParties />} />
      <Route path="/freedom-fighters" element={<FreedomFighters />} />
      <Route path="/cultural-information" element={<CulturalInformation />} />
      
      {/* News and Events */}
      <Route path="/news" element={<News />} />
      <Route path="/festivals" element={<Festivals />} />
      
      {/* Cultural Sections */}
      <Route path="/cuisine-food" element={<CuisineFood />} />
      <Route path="/tourist-attractions" element={<TouristAttractions />} />
      <Route path="/weather-patterns" element={<WeatherPatterns />} />
      <Route path="/traditional-clothing" element={<TraditionalClothing />} />
      <Route path="/historical-sites" element={<HistoricalSites />} />
      
      {/* Travel and Hospitality */}
      <Route path="/trips" element={<Trips />} />
      <Route path="/trips/:tripId" element={<TripDetails />} />
      <Route path="/custom-trip" element={<CustomTrip />} />
      <Route path="/my-trips" element={<MyTrips />} />
      
      <Route path="/hotels" element={<Hotels />} />
      <Route path="/hotels/:hotelId" element={<HotelDetails />} />
      
      <Route path="/casinos" element={<Casinos />} />
      <Route path="/casinos/:casinoId" element={<CasinoDetails />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/states" element={<ManageStates />} />
      <Route path="/admin/parties" element={<ManageParties />} />
      <Route path="/admin/fighters" element={<ManageFreedomFighters />} />
      <Route path="/admin/news" element={<ManageNews />} />
      <Route path="/admin/festivals" element={<ManageFestivals />} />
      <Route path="/admin/trips" element={<ManageTrips />} />
      <Route path="/admin/images" element={<ManageImages />} />
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
