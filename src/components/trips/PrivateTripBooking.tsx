
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, Users, MapPin, Clock, Crown, Star } from 'lucide-react';

interface PrivateTripBookingProps {
  trip: {
    id: string;
    title: string;
    description: string;
    image: string;
    price: number;
    discountedPrice?: number;
    duration: number;
    category: string;
    rating: number;
  };
  isOpen: boolean;
  onClose: () => void;
}

const bookingSchema = z.object({
  guestName: z.string().min(2, "Name must be at least 2 characters"),
  guestEmail: z.string().email("Please enter a valid email address"),
  guestPhone: z.string().min(10, "Please enter a valid phone number"),
  travelers: z.string().min(1, "Number of travelers is required"),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  accommodationType: z.string().min(1, "Please select accommodation type"),
  transportMode: z.string().min(1, "Please select transport mode"),
  specialRequests: z.string().optional(),
});

const PrivateTripBooking: React.FC<PrivateTripBookingProps> = ({ trip, isOpen, onClose }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      guestName: user?.name || "",
      guestEmail: user?.email || "",
      guestPhone: "",
      travelers: "2",
      accommodationType: "",
      transportMode: "",
      specialRequests: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof bookingSchema>) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to book this private trip.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate total price based on travelers and selected options
      const basePrice = trip.discountedPrice || trip.price;
      const accommodationMultiplier = values.accommodationType === 'luxury' ? 1.5 : 
                                    values.accommodationType === 'premium' ? 1.3 : 1;
      const transportMultiplier = values.transportMode === 'flight' ? 1.4 : 
                                values.transportMode === 'ac-train' ? 1.2 : 1;
      
      const totalPrice = Math.round(basePrice * parseInt(values.travelers) * accommodationMultiplier * transportMultiplier);

      // Create private booking record
      const booking = {
        id: `private-trip-${Date.now()}`,
        tripId: trip.id,
        tripTitle: trip.title,
        userId: user?.email,
        type: 'private',
        guestName: values.guestName,
        guestEmail: values.guestEmail,
        guestPhone: values.guestPhone,
        travelers: parseInt(values.travelers),
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
        accommodationType: values.accommodationType,
        transportMode: values.transportMode,
        specialRequests: values.specialRequests,
        totalPrice,
        basePrice: trip.discountedPrice || trip.price,
        duration: trip.duration,
        category: trip.category,
        bookingDate: new Date().toISOString(),
        status: 'confirmed',
        isPrivate: true,
        personalizedServices: [
          'Dedicated Tour Guide',
          'Flexible Itinerary',
          'Private Transportation',
          '24/7 Support',
          'Customized Meals'
        ]
      };

      // Save to localStorage
      const existingBookings = JSON.parse(localStorage.getItem('tripBookings') || '[]');
      existingBookings.push(booking);
      localStorage.setItem('tripBookings', JSON.stringify(existingBookings));

      toast({
        title: "Private Trip Booked!",
        description: `Your exclusive ${trip.title} experience has been confirmed. Our team will contact you within 24 hours.`,
      });

      onClose();
      navigate('/my-trips');
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateEstimatedPrice = () => {
    const basePrice = trip.discountedPrice || trip.price;
    const travelers = parseInt(form.watch('travelers') || '2');
    const accommodation = form.watch('accommodationType');
    const transport = form.watch('transportMode');
    
    const accommodationMultiplier = accommodation === 'luxury' ? 1.5 : 
                                  accommodation === 'premium' ? 1.3 : 1;
    const transportMultiplier = transport === 'flight' ? 1.4 : 
                              transport === 'ac-train' ? 1.2 : 1;
    
    return Math.round(basePrice * travelers * accommodationMultiplier * transportMultiplier);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-india-orange" />
            Book Private Experience - {trip.title}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Trip Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trip Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <img 
                src={trip.image} 
                alt={trip.title} 
                className="w-full h-32 object-cover rounded-lg mb-4" 
              />
              <h3 className="font-semibold mb-2">{trip.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{trip.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{trip.duration} Days</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span>{trip.rating}/5 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-india-orange" />
                  <span>Private Experience</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-india-orange/10 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Included Services:</h4>
                <ul className="text-xs space-y-1">
                  <li>• Dedicated Personal Guide</li>
                  <li>• Flexible Itinerary</li>
                  <li>• Private Transportation</li>
                  <li>• 24/7 Customer Support</li>
                  <li>• Customized Meal Options</li>
                </ul>
              </div>

              {form.watch('travelers') && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Estimated Total:</span>
                    <span className="text-lg font-bold text-india-orange">
                      ₹{calculateEstimatedPrice().toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Booking Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Booking Details</CardTitle>
              <CardDescription>Customize your private experience</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="guestName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="guestEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="guestPhone"
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

                  <FormField
                    control={form.control}
                    name="travelers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Travelers</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select travelers" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} {num === 1 ? 'Person' : 'People'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick date</span>
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

                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>End Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick date</span>
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
                    name="accommodationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Accommodation Preference</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select accommodation type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="standard">Standard (+0%)</SelectItem>
                            <SelectItem value="premium">Premium (+30%)</SelectItem>
                            <SelectItem value="luxury">Luxury (+50%)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="transportMode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transport Preference</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select transport mode" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="bus">Bus (+0%)</SelectItem>
                            <SelectItem value="ac-train">AC Train (+20%)</SelectItem>
                            <SelectItem value="flight">Flight (+40%)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="specialRequests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Requests (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any special requirements or preferences..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Processing...' : 'Book Private Experience'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrivateTripBooking;
