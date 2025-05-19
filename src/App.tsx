
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

import Index from "./pages/Index";
import StateDetails from "./pages/StateDetails";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import News from "./pages/News";
import Festivals from "./pages/Festivals";
import PoliticalParties from "./pages/PoliticalParties";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import FreedomFighters from "./pages/FreedomFighters";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ManageStates from "./pages/admin/ManageStates";
import ManageNews from "./pages/admin/ManageNews";
import ManageFestivals from "./pages/admin/ManageFestivals";
import ManageFreedomFighters from "./pages/admin/ManageFreedomFighters";
import ManageParties from "./pages/admin/ManageParties";
import ManageImages from "./pages/admin/ManageImages";
import Trips from "./pages/Trips";
import TripDetails from "./pages/TripDetails";
import ManageTrips from "./pages/admin/ManageTrips";
import CustomTrip from "./pages/CustomTrip";
import Hotels from "./pages/Hotels";
import HotelDetails from "./pages/HotelDetails";
import CulturalInformation from "./pages/CulturalInformation";
import CuisineFood from "./pages/CuisineFood";
import TouristAttractions from "./pages/TouristAttractions";
import WeatherPatterns from "./pages/WeatherPatterns";
import TraditionalClothing from "./pages/TraditionalClothing";
import HistoricalSites from "./pages/HistoricalSites";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/state/:stateId" element={<StateDetails />} />
                <Route path="/about" element={<About />} />
                <Route path="/news" element={<News />} />
                <Route path="/festivals" element={<Festivals />} />
                <Route path="/political-parties" element={<PoliticalParties />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/freedom-fighters" element={<FreedomFighters />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/trips" element={<Trips />} />
                <Route path="/trips/:tripId" element={<TripDetails />} />
                <Route path="/custom-trip" element={<CustomTrip />} />
                <Route path="/hotels" element={<Hotels />} />
                <Route path="/hotels/:hotelId" element={<HotelDetails />} />
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
                <Route path="/admin/freedom-fighters" element={<ManageFreedomFighters />} />
                <Route path="/admin/political-parties" element={<ManageParties />} />
                <Route path="/admin/images" element={<ManageImages />} />
                <Route path="/admin/trips" element={<ManageTrips />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
