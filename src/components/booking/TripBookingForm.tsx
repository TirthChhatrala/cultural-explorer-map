
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, MapPin, Users, Clock } from 'lucide-react';
import { trips } from '../../data/tripData';
import { states } from '../../data/states';
import PaymentModal from '../PaymentModal';

const tripBookingSchema = z.object({
  selectedTrip: z.string().min(1, "Please select a trip"),
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

const TripBookingForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTripData, setSelectedTripData] = useState<any>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);

  const form = useForm<z.infer<typeof tripBookingSchema>>({
    resolver: zodResolver(tripBookingSchema),
    defaultValues: {
      selectedTrip: "",
      guestName: user?.name || "",
      guestEmail: user?.email || "",
      guestPhone: "",
      travelers: "2",
      accommodationType: "",
      transportMode: "",
      specialRequests: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof tripBookingSchema>) => {
    const trip = trips.find(t => t.id === values.selectedTrip);
    if (!trip) {
      toast({ title: "Error", description: "Trip not found", variant: "destructive" });
      return;
    }

    const basePrice = trip.discountedPrice || trip.price;
    const accommodationMultiplier = values.accommodationType === 'luxury' ? 1.5 : 
                                  values.accommodationType === 'premium' ? 1.3 : 1;
    const transportMultiplier = values.transportMode === 'flight' ? 1.4 : 
                              values.transportMode === 'ac-train' ? 1.2 : 1;
    
    const totalPrice = Math.round(basePrice * parseInt(values.travelers) * accommodationMultiplier * transportMultiplier);

    setBookingData({
      type: 'Trip Booking',
      title: trip.title,
      amount: totalPrice,
      guestName: values.guestName,
      guestEmail: values.guestEmail,
      guestPhone: values.guestPhone,
      startDate: values.startDate.toISOString(),
      endDate: values.endDate.toISOString(),
      travelers: parseInt(values.travelers),
      accommodationType: values.accommodationType,
      transportMode: values.transportMode,
      tripId: trip.id,
    });
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    if (bookingData) {
      const booking = {
        id: `trip-booking-${Date.now()}`,
        ...bookingData,
        bookingDate: new Date().toISOString(),
        status: 'confirmed',
      };
      const existingBookings = JSON.parse(localStorage.getItem('tripBookings') || '[]');
      existingBookings.push(booking);
      localStorage.setItem('tripBookings', JSON.stringify(existingBookings));
    }
    navigate('/admin');
  };

  const handleTripSelection = (tripId: string) => {
    const trip = trips.find(t => t.id === tripId);
    setSelectedTripData(trip);
  };

  return (
    <div className="space-y-6">
      {selectedTripData && (
        <div className="p-4 bg-india-orange/10 rounded-lg">
          <div className="flex items-center gap-4">
            <img 
              src={selectedTripData.image} 
              alt={selectedTripData.title}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <h3 className="font-semibold">{selectedTripData.title}</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {selectedTripData.duration} Days
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {selectedTripData.states?.length || 0} States
                </div>
              </div>
              <div className="text-lg font-bold text-india-orange mt-1">
                ₹{(selectedTripData.discountedPrice || selectedTripData.price).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="selectedTrip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Trip</FormLabel>
                <Select onValueChange={(value) => {
                  field.onChange(value);
                  handleTripSelection(value);
                }}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a trip package" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {trips.map((trip) => (
                      <SelectItem key={trip.id} value={trip.id}>
                        {trip.title} - {trip.duration} Days (₹{(trip.discountedPrice || trip.price).toLocaleString()})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="accommodationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Accommodation Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select accommodation" />
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
                  <FormLabel>Transport Mode</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transport" />
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
          </div>

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
            {isSubmitting ? 'Processing Booking...' : 'Book Trip Now'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default TripBookingForm;
