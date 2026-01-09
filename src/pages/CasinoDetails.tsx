import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { MapPin, Star, ChevronLeft, Calendar as CalendarIcon, Dice1 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PaymentModal from '../components/PaymentModal';

const bookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Please enter a valid phone number."),
  guests: z.string().refine((value) => {
    const num = parseInt(value, 10);
    return !isNaN(num) && num > 0;
  }, "Number of guests must be greater than 0."),
  visitDate: z.date({ required_error: "A visit date is required." }),
  package: z.string().min(1, "Please select a package."),
  message: z.string().optional(),
});

const CasinoDetails = () => {
  const { casinoId } = useParams<{ casinoId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  const [casino, setCasino] = useState<any>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);

  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      guests: "1",
      visitDate: new Date(),
      package: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof bookingSchema>) {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to complete your booking.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    const selectedPackage = casino?.packages?.find((pkg: any) => pkg.name === values.package);
    const packagePrice = selectedPackage?.price || casino?.price || 4000;
    const totalAmount = packagePrice * parseInt(values.guests);

    setBookingData({
      type: 'Casino Experience',
      title: `${casino?.name} - ${values.package}`,
      amount: totalAmount,
      guestName: values.name,
      guestEmail: values.email,
      guestPhone: values.phone,
      startDate: values.visitDate.toISOString(),
      endDate: values.visitDate.toISOString(),
      travelers: parseInt(values.guests),
    });
    setPaymentOpen(true);
  }

  const handlePaymentSuccess = () => {
    const values = form.getValues();
    
    const booking = {
      id: `casino-booking-${Date.now()}`,
      casinoId: casino?.id,
      casinoName: casino?.name,
      userId: user?.email,
      guestName: values.name,
      guestEmail: values.email,
      guestPhone: values.phone,
      guests: values.guests,
      visitDate: values.visitDate.toISOString(),
      package: values.package,
      price: bookingData.amount,
      message: values.message,
      bookingDate: new Date().toISOString(),
      status: 'confirmed'
    };

    const existingBookings = JSON.parse(localStorage.getItem('casinoBookings') || '[]');
    existingBookings.push(booking);
    localStorage.setItem('casinoBookings', JSON.stringify(existingBookings));

    toast({
      title: "Booking Confirmed!",
      description: `Your casino experience at ${casino?.name} has been confirmed.`,
    });

    navigate('/my-trips');
  };

  useEffect(() => {
    const mockCasino = {
      id: casinoId,
      name: "Deltin Royale",
      description: "India's largest floating casino with premium gaming and entertainment",
      location: "Panjim, Goa",
      price: 4000,
      rating: 4.5,
      amenities: ["Gaming Tables", "Slot Machines", "Restaurants", "Live Entertainment", "VIP Rooms"],
      image: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?q=80&w=1000&auto=format&fit=crop",
      games: ["Poker", "Blackjack", "Roulette", "Baccarat", "Slots", "Teen Patti"],
      packages: [
        { name: "Basic Entry", price: 3000, includes: ["Entry", "Welcome Drink", "Gaming Chips (₹500)"] },
        { name: "Premium Package", price: 5000, includes: ["Entry", "Buffet Dinner", "Gaming Chips (₹1000)", "Complimentary Drinks"] },
        { name: "VIP Experience", price: 8000, includes: ["VIP Entry", "Private Gaming Area", "Premium Buffet", "Gaming Chips (₹2000)", "Personal Host"] }
      ]
    };
    setCasino(mockCasino);
  }, [casinoId]);

  if (!casino) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <span className="loading loading-spinner text-india-orange loading-lg"></span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
        className="max-w-5xl mx-auto px-4 py-8"
      >
        <Button variant="ghost" onClick={() => navigate('/casinos')} className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Casinos
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="relative rounded-xl overflow-hidden shadow-md">
              <img
                src={casino.image}
                alt={casino.name}
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="inline-block px-3 py-1 bg-india-orange/90 text-white rounded-full text-sm font-medium flex items-center gap-1">
                  <Dice1 className="h-4 w-4" />
                  {casino.rating} <Star size={14} className="inline-block align-text-top" />
                </span>
              </div>
            </div>

            <div className="mt-6">
              <h1 className="text-2xl font-bold">{casino.name}</h1>
              <div className="flex items-center text-gray-600 dark:text-gray-400 mt-1">
                <MapPin size={16} className="mr-1" />
                <span>{casino.location}</span>
              </div>
              <p className="text-muted-foreground mt-2">{casino.description}</p>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold">Available Games</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {casino.games.map((game: string, index: number) => (
                  <Badge key={index} variant="secondary">{game}</Badge>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold">Amenities</h2>
              <ul className="mt-2 list-disc list-inside text-muted-foreground">
                {casino.amenities.map((amenity: string, index: number) => (
                  <li key={index}>{amenity}</li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Book Your Gaming Experience</CardTitle>
                <CardDescription>
                  Reserve your spot at {casino.name} - Pay & Confirm Instantly!
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex gap-4">
                      <FormField
                        control={form.control}
                        name="guests"
                        render={({ field }) => (
                          <FormItem className="w-1/2">
                            <FormLabel>Guests</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                                  <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="visitDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col w-1/2">
                            <FormLabel>Visit Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date < new Date()}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="package"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Package</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a package" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {casino.packages.map((pkg: any, index: number) => (
                                <SelectItem key={index} value={pkg.name}>
                                  {pkg.name} - ₹{pkg.price.toLocaleString()}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Special Requests (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any special requests or questions..."
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full bg-india-orange hover:bg-orange-600">
                      Proceed to Payment
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>

      {bookingData && (
        <PaymentModal
          isOpen={paymentOpen}
          onClose={() => setPaymentOpen(false)}
          bookingDetails={bookingData}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </Layout>
  );
};

export default CasinoDetails;
