
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Import all pages
import Index from './pages/Index';
import About from './pages/About';
import PoliticalParties from './pages/PoliticalParties';
import FreedomFighters from './pages/FreedomFighters';
import News from './pages/News';
import Festivals from './pages/Festivals';
import StateDetails from './pages/StateDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import CulturalInformation from './pages/CulturalInformation';
import CuisineFood from './pages/CuisineFood';
import TouristAttractions from './pages/TouristAttractions';
import WeatherPatterns from './pages/WeatherPatterns';
import TraditionalClothing from './pages/TraditionalClothing';
import HistoricalSites from './pages/HistoricalSites';
import AdminDashboard from './pages/AdminDashboard';
import ManageStates from './pages/admin/ManageStates';
import ManageNews from './pages/admin/ManageNews';
import ManageFestivals from './pages/admin/ManageFestivals';
import ManageParties from './pages/admin/ManageParties';
import ManageFreedomFighters from './pages/admin/ManageFreedomFighters';
import ManageImages from './pages/admin/ManageImages';
import ManageTrips from './pages/admin/ManageTrips';
import Hotels from './pages/Hotels';
import HotelDetails from './pages/HotelDetails';
import Trips from './pages/Trips';
import TripDetails from './pages/TripDetails';
import CustomTrip from './pages/CustomTrip';
import MyTrips from './pages/MyTrips';

const AppRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/political-parties" element={<PoliticalParties />} />
        <Route path="/freedom-fighters" element={<FreedomFighters />} />
        <Route path="/news" element={<News />} />
        <Route path="/festivals" element={<Festivals />} />
        <Route path="/state/:stateId" element={<StateDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cultural-information" element={<CulturalInformation />} />
        <Route path="/cuisine-food" element={<CuisineFood />} />
        <Route path="/tourist-attractions" element={<TouristAttractions />} />
        <Route path="/weather-patterns" element={<WeatherPatterns />} />
        <Route path="/traditional-clothing" element={<TraditionalClothing />} />
        <Route path="/historical-sites" element={<HistoricalSites />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/states" element={<ManageStates />} />
        <Route path="/admin/news" element={<ManageNews />} />
        <Route path="/admin/festivals" element={<ManageFestivals />} />
        <Route path="/admin/political-parties" element={<ManageParties />} />
        <Route path="/admin/freedom-fighters" element={<ManageFreedomFighters />} />
        <Route path="/admin/images" element={<ManageImages />} />
        <Route path="/admin/trips" element={<ManageTrips />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/hotels/:hotelId" element={<HotelDetails />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/trips/:tripId" element={<TripDetails />} />
        <Route path="/custom-trip" element={<CustomTrip />} />
        <Route path="/my-trips" element={<MyTrips />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes;
