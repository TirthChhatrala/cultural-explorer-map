
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Hotel } from '@/data/tripData';
import { Calendar as CalendarIcon, MapPin, Star, Users, CreditCard } from 'lucide-react';
import { format } from 'date-fns';

interface HotelBookingFormProps {
  hotel: Hotel;
  tripId: string;
  onBookingComplete: (bookingDetails: any) => void;
  onClose: () => void;
}

export const HotelBookingForm = ({ hotel, tripId, onBookingComplete, onClose }: HotelBookingFormProps) => {
  const { toast } = useToast();
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [guests, setGuests] = useState(1);
  const [rooms, setRooms] = useState(1);
  const [guestDetails, setGuestDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });
  const [specialRequests, setSpecialRequests] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const calculateTotalPrice = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    return nights * hotel.price * rooms;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkInDate || !checkOutDate) {
      toast({
        title: "Missing Information",
        description: "Please select check-in and check-out dates",
        variant: "destructive"
      });
      return;
    }

    if (!guestDetails.firstName || !guestDetails.lastName || !guestDetails.email || !guestDetails.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required guest details",
        variant: "destructive"
      });
      return;
    }

    const bookingDetails = {
      id: `booking-${Date.now()}`,
      tripId,
      hotelId: hotel.id,
      hotelName: hotel.name,
      checkInDate: checkInDate.toISOString(),
      checkOutDate: checkOutDate.toISOString(),
      guests,
      rooms,
      totalPrice: calculateTotalPrice(),
      guestDetails,
      specialRequests,
      paymentMethod,
      bookingDate: new Date().toISOString(),
      status: 'confirmed'
    };

    // Save booking to localStorage
    const existingBookings = JSON.parse(localStorage.getItem('hotelBookings') || '[]');
    existingBookings.push(bookingDetails);
    localStorage.setItem('hotelBookings', JSON.stringify(existingBookings));

    toast({
      title: "Booking Confirmed",
      description: `Your booking at ${hotel.name} has been confirmed!`,
    });

    onBookingComplete(bookingDetails);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Book {hotel.name}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-2">
              <span>{hotel.location}</span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 stroke-yellow-400" />
                <span>{hotel.rating}</span>
              </div>
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">₹{hotel.price.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">per night</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dates and Rooms */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Check-in Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkInDate ? format(checkInDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkInDate}
                    onSelect={setCheckInDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Check-out Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkOutDate ? format(checkOutDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkOutDate}
                    onSelect={setCheckOutDate}
                    disabled={(date) => date < (checkInDate || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Guests</Label>
              <Select value={guests.toString()} onValueChange={(value) => setGuests(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select guests" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <SelectItem key={num} value={num.toString()}>{num} Guest{num > 1 ? 's' : ''}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Rooms</Label>
              <Select value={rooms.toString()} onValueChange={(value) => setRooms(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select rooms" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4].map(num => (
                    <SelectItem key={num} value={num.toString()}>{num} Room{num > 1 ? 's' : ''}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Guest Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Guest Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={guestDetails.firstName}
                  onChange={(e) => setGuestDetails(prev => ({ ...prev, firstName: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={guestDetails.lastName}
                  onChange={(e) => setGuestDetails(prev => ({ ...prev, lastName: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={guestDetails.email}
                  onChange={(e) => setGuestDetails(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={guestDetails.phone}
                  onChange={(e) => setGuestDetails(prev => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={guestDetails.address}
                  onChange={(e) => setGuestDetails(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={guestDetails.city}
                  onChange={(e) => setGuestDetails(prev => ({ ...prev, city: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={guestDetails.zipCode}
                  onChange={(e) => setGuestDetails(prev => ({ ...prev, zipCode: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div className="space-y-2">
            <Label htmlFor="specialRequests">Special Requests</Label>
            <Textarea
              id="specialRequests"
              placeholder="Any special requests or requirements..."
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              rows={3}
            />
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit-card">Credit Card</SelectItem>
                <SelectItem value="debit-card">Debit Card</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="net-banking">Net Banking</SelectItem>
                <SelectItem value="pay-at-hotel">Pay at Hotel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Hotel Amenities */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Hotel Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {hotel.amenities.map((amenity, index) => (
                <Badge key={index} variant="secondary">{amenity}</Badge>
              ))}
            </div>
          </div>

          {/* Price Summary */}
          {checkInDate && checkOutDate && (
            <div className="border rounded-lg p-4 bg-muted/50">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Price Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>₹{hotel.price.toLocaleString()} × {Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))} nights × {rooms} room{rooms > 1 ? 's' : ''}</span>
                  <span>₹{calculateTotalPrice().toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{calculateTotalPrice().toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Confirm Booking
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
