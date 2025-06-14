
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
  Car,
  Utensils,
  Camera
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
            <p className="text-muted-foreground mb-8">Please log in to access our comprehensive booking system</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/login')}>
                Login to Continue
              </Button>
              <Button variant="outline" onClick={() => navigate('/signup')}>
                Create Account
              </Button>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  const bookingTypes = [
    {
      id: 'trips',
      title: 'Cultural Trips',
      description: 'Explore India\'s heritage with guided tours',
      icon: <Plane className="h-8 w-8" />,
      color: 'text-blue-500',
      features: ['Guided Tours', 'Cultural Sites', 'Local Experiences']
    },
    {
      id: 'hotels',
      title: 'Hotels & Resorts',
      description: 'Comfortable stays at premium locations',
      icon: <Building className="h-8 w-8" />,
      color: 'text-green-500',
      features: ['Luxury Stays', 'Traditional Hotels', 'Heritage Properties']
    },
    {
      id: 'casinos',
      title: 'Entertainment',
      description: 'Premium casino and entertainment experiences',
      icon: <Dice1 className="h-8 w-8" />,
      color: 'text-purple-500',
      features: ['Gaming', 'Shows', 'Fine Dining']
    }
  ];

  const additionalServices = [
    { icon: <Car className="h-6 w-6" />, title: 'Transportation', description: 'Cars, buses, and local transport' },
    { icon: <Utensils className="h-6 w-6" />, title: 'Food Tours', description: 'Authentic local cuisine experiences' },
    { icon: <Camera className="h-6 w-6" />, title: 'Photography', description: 'Professional travel photography' },
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
            Complete Booking System
          </h1>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Book your entire Indian cultural experience - from heritage trips and luxury hotels to entertainment venues and additional services, all in one place
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
                <div className="mt-4">
                  {type.features.map((feature, index) => (
                    <span key={index} className="inline-block bg-gray-100 dark:bg-gray-800 text-xs px-2 py-1 rounded-full mr-1 mb-1">
                      {feature}
                    </span>
                  ))}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-center">Additional Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {additionalServices.map((service, index) => (
              <Card key={index} className="text-center p-4">
                <div className="flex items-center justify-center mb-2 text-india-orange">
                  {service.icon}
                </div>
                <h4 className="font-medium mb-1">{service.title}</h4>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </Card>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {activeTab === 'trips' && <Plane className="h-5 w-5" />}
              {activeTab === 'hotels' && <Building className="h-5 w-5" />}
              {activeTab === 'casinos' && <Dice1 className="h-5 w-5" />}
              Booking Details & Reservation
            </CardTitle>
            <CardDescription>
              Complete your booking with detailed information and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="trips">Cultural Trips</TabsTrigger>
                <TabsTrigger value="hotels">Hotels</TabsTrigger>
                <TabsTrigger value="casinos">Entertainment</TabsTrigger>
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

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Need help with your booking? Our support team is here to assist you.
          </p>
          <Button variant="outline" onClick={() => navigate('/contact')}>
            Contact Support
          </Button>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Booking;
