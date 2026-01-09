import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Check, Calendar, MapPin, User, Download, Plane, Building, Dice1 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import jsPDF from 'jspdf';

interface Booking {
  id: string;
  tripId?: string;
  tripTitle: string;
  userId?: string;
  price: number;
  bookingDate: string;
  status: string;
  travelers?: number;
  type?: string;
  isPrivate?: boolean;
  startDate?: string;
  endDate?: string;
}

interface CasinoBooking {
  id: string;
  casinoId?: string;
  casinoName: string;
  userId?: string;
  guestName: string;
  guestEmail: string;
  guests: string;
  visitDate: string;
  package: string;
  price: number;
  bookingDate: string;
  status: string;
}

interface HotelBooking {
  id: string;
  hotelId?: string;
  hotelName: string;
  userId?: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  price: number;
  bookingDate: string;
  status: string;
}

const MyTrips = () => {
  const { theme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'trips' | 'hotels' | 'casinos'>('trips');
  const [tripBookings, setTripBookings] = useState<Booking[]>([]);
  const [hotelBookings, setHotelBookings] = useState<HotelBooking[]>([]);
  const [casinoBookings, setCasinoBookings] = useState<CasinoBooking[]>([]);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Load trip bookings
      const allTripBookings = JSON.parse(localStorage.getItem('tripBookings') || '[]');
      const userTripBookings = allTripBookings.filter((b: Booking) => b.userId === user.email);
      setTripBookings(userTripBookings);
      
      // Load hotel bookings
      const allHotelBookings = JSON.parse(localStorage.getItem('hotelBookings') || '[]');
      const userHotelBookings = allHotelBookings.filter((b: HotelBooking) => b.userId === user.email);
      setHotelBookings(userHotelBookings);
      
      // Load casino bookings
      const allCasinoBookings = JSON.parse(localStorage.getItem('casinoBookings') || '[]');
      const userCasinoBookings = allCasinoBookings.filter((b: CasinoBooking) => b.userId === user.email);
      setCasinoBookings(userCasinoBookings);
    }
  }, [isAuthenticated, user]);
  
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to view your trips",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [isAuthenticated, navigate, toast]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const downloadReceipt = (booking: Booking | CasinoBooking | HotelBooking, type: string) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    
    // Header
    pdf.setFillColor(255, 152, 0);
    pdf.rect(0, 0, pageWidth, 40, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Indian Cultural Explorer', pageWidth / 2, 20, { align: 'center' });
    pdf.setFontSize(12);
    pdf.text('Booking Confirmation', pageWidth / 2, 32, { align: 'center' });
    
    pdf.setTextColor(0, 0, 0);
    
    // Booking details
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Booking Details', 20, 55);
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    let yPos = 65;
    
    if (type === 'trip') {
      const tripBooking = booking as Booking;
      const details = [
        `Booking ID: ${tripBooking.id}`,
        `Trip: ${tripBooking.tripTitle}`,
        `Type: ${tripBooking.isPrivate ? 'Private Trip' : tripBooking.type === 'custom' ? 'Custom Trip' : 'Standard Trip'}`,
        `Travelers: ${tripBooking.travelers || 1}`,
        `Booking Date: ${formatDate(tripBooking.bookingDate)}`,
        `Status: ${tripBooking.status.toUpperCase()}`,
        `Amount Paid: ₹${tripBooking.price.toLocaleString()}`,
      ];
      
      details.forEach(detail => {
        pdf.text(detail, 20, yPos);
        yPos += 8;
      });
    } else if (type === 'casino') {
      const casinoBooking = booking as CasinoBooking;
      const details = [
        `Booking ID: ${casinoBooking.id}`,
        `Casino: ${casinoBooking.casinoName}`,
        `Package: ${casinoBooking.package}`,
        `Guest Name: ${casinoBooking.guestName}`,
        `Guests: ${casinoBooking.guests}`,
        `Visit Date: ${formatDate(casinoBooking.visitDate)}`,
        `Status: ${casinoBooking.status.toUpperCase()}`,
        `Amount Paid: ₹${casinoBooking.price.toLocaleString()}`,
      ];
      
      details.forEach(detail => {
        pdf.text(detail, 20, yPos);
        yPos += 8;
      });
    } else if (type === 'hotel') {
      const hotelBooking = booking as HotelBooking;
      const details = [
        `Booking ID: ${hotelBooking.id}`,
        `Hotel: ${hotelBooking.hotelName}`,
        `Guest Name: ${hotelBooking.guestName}`,
        `Check-in: ${formatDate(hotelBooking.checkIn)}`,
        `Check-out: ${formatDate(hotelBooking.checkOut)}`,
        `Rooms: ${hotelBooking.rooms}`,
        `Status: ${hotelBooking.status.toUpperCase()}`,
        `Amount Paid: ₹${hotelBooking.price.toLocaleString()}`,
      ];
      
      details.forEach(detail => {
        pdf.text(detail, 20, yPos);
        yPos += 8;
      });
    }
    
    // Footer
    yPos = 250;
    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.text('Thank you for choosing Indian Cultural Explorer!', pageWidth / 2, yPos, { align: 'center' });
    pdf.text('For any queries, contact: support@indianculturalexplorer.com', pageWidth / 2, yPos + 8, { align: 'center' });
    
    pdf.save(`booking-${booking.id}.pdf`);
    
    toast({
      title: 'Receipt Downloaded',
      description: 'Your booking receipt has been downloaded as PDF',
    });
  };

  const renderTripBookings = () => {
    if (tripBookings.length === 0) {
      return (
        <div className="text-center py-16">
          <Plane className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-lg mb-6">You haven't booked any trips yet.</p>
          <Button onClick={() => navigate('/trips')}>Explore Trip Packages</Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tripBookings.map((booking, index) => (
          <motion.div
            key={booking.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{booking.tripTitle}</CardTitle>
                    <CardDescription className="mt-1">
                      Booked on {formatDate(booking.bookingDate)}
                    </CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-300">
                    <Check className="h-3 w-3 mr-1" />
                    {booking.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-2 items-center">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{booking.travelers || 1} Travelers</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm capitalize">
                      {booking.isPrivate ? 'Private Trip' : booking.type === 'custom' ? 'Custom Trip' : 'Standard Trip'}
                    </span>
                  </div>
                  <div className="mt-2 pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Amount Paid</span>
                      <span className="font-bold text-india-orange">₹{booking.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => downloadReceipt(booking, 'trip')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Receipt
                </Button>
                {booking.tripId && (
                  <Button
                    className="flex-1"
                    onClick={() => navigate(`/trips/${booking.tripId}`)}
                  >
                    View Trip
                  </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderHotelBookings = () => {
    if (hotelBookings.length === 0) {
      return (
        <div className="text-center py-16">
          <Building className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-lg mb-6">You haven't booked any hotels yet.</p>
          <Button onClick={() => navigate('/hotels')}>Browse Hotels</Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hotelBookings.map((booking, index) => (
          <motion.div
            key={booking.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{booking.hotelName}</CardTitle>
                    <CardDescription className="mt-1">
                      Booked on {formatDate(booking.bookingDate)}
                    </CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-300">
                    <Check className="h-3 w-3 mr-1" />
                    {booking.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-2 items-center">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{booking.rooms} Room(s)</span>
                  </div>
                  <div className="mt-2 pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Amount Paid</span>
                      <span className="font-bold text-india-orange">₹{booking.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => downloadReceipt(booking, 'hotel')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderCasinoBookings = () => {
    if (casinoBookings.length === 0) {
      return (
        <div className="text-center py-16">
          <Dice1 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-lg mb-6">You haven't booked any casino experiences yet.</p>
          <Button onClick={() => navigate('/casinos')}>Browse Casinos</Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {casinoBookings.map((booking, index) => (
          <motion.div
            key={booking.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{booking.casinoName}</CardTitle>
                    <CardDescription className="mt-1">
                      {booking.package}
                    </CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-300">
                    <Check className="h-3 w-3 mr-1" />
                    {booking.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-2 items-center">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Visit: {formatDate(booking.visitDate)}</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{booking.guests} Guest(s)</span>
                  </div>
                  <div className="mt-2 pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">Amount Paid</span>
                      <span className="font-bold text-india-orange">₹{booking.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => downloadReceipt(booking, 'casino')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  };

  if (!isAuthenticated) return null;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <section className="text-center mb-10">
            <span className="inline-block px-3 py-1 bg-india-orange/10 text-india-orange rounded-full text-sm font-medium mb-4">
              My Bookings
            </span>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              My Trips & Bookings
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              View all your confirmed bookings and download receipts
            </p>
          </section>
        </motion.div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'trips' | 'hotels' | 'casinos')}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="trips" className="text-base">
              <Plane className="h-4 w-4 mr-2" />
              Trips ({tripBookings.length})
            </TabsTrigger>
            <TabsTrigger value="hotels" className="text-base">
              <Building className="h-4 w-4 mr-2" />
              Hotels ({hotelBookings.length})
            </TabsTrigger>
            <TabsTrigger value="casinos" className="text-base">
              <Dice1 className="h-4 w-4 mr-2" />
              Casinos ({casinoBookings.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="trips" className="mt-0">
            {renderTripBookings()}
          </TabsContent>
          <TabsContent value="hotels" className="mt-0">
            {renderHotelBookings()}
          </TabsContent>
          <TabsContent value="casinos" className="mt-0">
            {renderCasinoBookings()}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MyTrips;