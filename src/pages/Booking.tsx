
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '../hooks/use-toast';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Plane,
  Building,
  Dice1,
  ArrowRight
} from 'lucide-react';
import TripBookingForm from '../components/booking/TripBookingForm';
import HotelBookingForm from '../components/booking/HotelBookingForm';
import CasinoBookingForm from '../components/booking/CasinoBookingForm';

const Booking = () => {
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('trips');

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto py-16 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-3xl font-display font-bold mb-4">Login Required</h1>
            <p className="text-muted-foreground mb-8">Please log in to access our booking system</p>
            <Button onClick={() => navigate('/login')}>
              Login to Continue
            </Button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  const bookingTypes = [
    {
      id: 'trips',
      title: 'Travel Trips',
      description: 'Book amazing trips across India',
      icon: <Plane className="h-8 w-8" />,
      color: 'text-blue-500'
    },
    {
      id: 'hotels',
      title: 'Hotels',
      description: 'Comfortable stays at great locations',
      icon: <Building className="h-8 w-8" />,
      color: 'text-green-500'
    },
    {
      id: 'casinos',
      title: 'Casinos',
      description: 'Premium casino experiences',
      icon: <Dice1 className="h-8 w-8" />,
      color: 'text-purple-500'
    }
  ];

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="container mx-auto py-16 px-4"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold mb-4">
            Book Your Experience
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose from our wide range of travel experiences, luxury hotels, and premium casino destinations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {bookingTypes.map((type) => (
            <Card 
              key={type.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                activeTab === type.id ? 'ring-2 ring-india-orange' : ''
              }`}
              onClick={() => setActiveTab(type.id)}
            >
              <CardHeader className="text-center">
                <div className={`mx-auto mb-4 ${type.color}`}>
                  {type.icon}
                </div>
                <CardTitle>{type.title}</CardTitle>
                <CardDescription>{type.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {activeTab === 'trips' && <Plane className="h-5 w-5" />}
              {activeTab === 'hotels' && <Building className="h-5 w-5" />}
              {activeTab === 'casinos' && <Dice1 className="h-5 w-5" />}
              Booking Details
            </CardTitle>
            <CardDescription>
              Fill in your details to complete your booking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="trips">Trips</TabsTrigger>
                <TabsTrigger value="hotels">Hotels</TabsTrigger>
                <TabsTrigger value="casinos">Casinos</TabsTrigger>
              </TabsList>
              
              <TabsContent value="trips" className="mt-6">
                <TripBookingForm />
              </TabsContent>
              
              <TabsContent value="hotels" className="mt-6">
                <HotelBookingForm />
              </TabsContent>
              
              <TabsContent value="casinos" className="mt-6">
                <CasinoBookingForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </Layout>
  );
};

export default Booking;
