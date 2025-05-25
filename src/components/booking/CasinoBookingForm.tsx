
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
import { CalendarIcon, Dice1, Star, Shield } from 'lucide-react';

const casinoBookingSchema = z.object({
  guestName: z.string().min(2, "Name must be at least 2 characters"),
  guestEmail: z.string().email("Please enter a valid email address"),
  guestPhone: z.string().min(10, "Please enter a valid phone number"),
  visitDate: z.date({ required_error: "Visit date is required" }),
  guests: z.string().min(1, "Number of guests is required"),
  packageType: z.string().min(1, "Please select package type"),
  location: z.string().min(1, "Please select casino location"),
  timeSlot: z.string().min(1, "Please select time slot"),
  specialRequests: z.string().optional(),
});

const CasinoBookingForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof casinoBookingSchema>>({
    resolver: zodResolver(casinoBookingSchema),
    defaultValues: {
      guestName: user?.name || "",
      guestEmail: user?.email || "",
      guestPhone: "",
      guests: "2",
      packageType: "",
      location: "",
      timeSlot: "",
      specialRequests: "",
    },
  });

  const locations = [
    'Goa - Deltin Royale',
    'Goa - Casino Pride',
    'Goa - Deltin Jaqk',
    'Sikkim - Casino Mahjong',
    'Daman - Deltin Daman'
  ];

  const packages = [
    { value: 'basic', label: 'Basic Entry - ₹2,000/person', price: 2000 },
    { value: 'premium', label: 'Premium Package - ₹5,000/person', price: 5000 },
    { value: 'vip', label: 'VIP Experience - ₹10,000/person', price: 10000 },
    { value: 'high-roller', label: 'High Roller Suite - ₹25,000/person', price: 25000 }
  ];

  const timeSlots = [
    'Morning (10 AM - 2 PM)',
    'Afternoon (2 PM - 6 PM)',
    'Evening (6 PM - 10 PM)',
    'Night (10 PM - 2 AM)',
    'Full Day (10 AM - 2 AM)'
  ];

  const onSubmit = async (values: z.infer<typeof casinoBookingSchema>) => {
    setIsSubmitting(true);

    try {
      const packageData = packages.find(pkg => pkg.value === values.packageType);
      const basePrice = packageData?.price || 2000;
      const totalPrice = basePrice * parseInt(values.guests);

      const booking = {
        id: `casino-booking-${Date.now()}`,
        type: 'casino',
        userId: user?.email,
        guestName: values.guestName,
        guestEmail: values.guestEmail,
        guestPhone: values.guestPhone,
        visitDate: values.visitDate.toISOString(),
        guests: parseInt(values.guests),
        packageType: values.packageType,
        location: values.location,
        timeSlot: values.timeSlot,
        specialRequests: values.specialRequests,
        totalPrice,
        basePrice,
        bookingDate: new Date().toISOString(),
        status: 'confirmed',
      };

      const existingBookings = JSON.parse(localStorage.getItem('casinoBookings') || '[]');
      existingBookings.push(booking);
      localStorage.setItem('casinoBookings', JSON.stringify(existingBookings));

      toast({
        title: "Casino Booking Confirmed!",
        description: `Your casino experience at ${values.location} has been booked.`,
      });

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

  return (
    <div className="space-y-6">
      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
        <h3 className="font-semibold mb-2">Casino Experience Includes</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Dice1 className="h-4 w-4" />
            Gaming Access
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Premium Service
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Secure Environment
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Casino Location</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select casino location" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location.toLowerCase()}>
                        {location}
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
            name="visitDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Visit Date</FormLabel>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="guests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Guests</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Guests" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.from({ length: 6 }, (_, i) => i + 1).map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? 'Guest' : 'Guests'}
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
              name="packageType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Package Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select package" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {packages.map((pkg) => (
                        <SelectItem key={pkg.value} value={pkg.value}>
                          {pkg.label}
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
              name="timeSlot"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Slot</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot.toLowerCase()}>
                          {slot}
                        </SelectItem>
                      ))}
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
                    placeholder="Any special requirements..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Processing Booking...' : 'Book Casino Experience'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CasinoBookingForm;
