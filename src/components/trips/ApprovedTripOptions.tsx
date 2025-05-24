
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Hotel, Receipt, Download, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { CustomTripRequest } from '@/data/tripData';
import { hotels } from '@/data/tripData';
import { HotelBookingForm } from './HotelBookingForm';
import { ReceiptGenerator } from './ReceiptGenerator';

interface ApprovedTripOptionsProps {
  trip: CustomTripRequest;
}

export const ApprovedTripOptions = ({ trip }: ApprovedTripOptionsProps) => {
  const { toast } = useToast();
  const [hotelBookingOpen, setHotelBookingOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  
  const handleHotelBooking = (hotel: any) => {
    setSelectedHotel(hotel);
    setHotelBookingOpen(true);
  };

  const handleBookingComplete = (bookingDetails: any) => {
    setHotelBookingOpen(false);
    
    // Send booking data to admin dashboard
    const existingBookings = JSON.parse(localStorage.getItem('adminHotelBookings') || '[]');
    existingBookings.push({
      ...bookingDetails,
      tripId: trip.id,
      userId: trip.userId,
      submittedAt: new Date().toISOString()
    });
    localStorage.setItem('adminHotelBookings', JSON.stringify(existingBookings));
  };
  
  const handleDownloadReceipt = () => {
    const receiptData = {
      id: trip.id,
      date: new Date().toISOString(),
      userId: trip.userId,
      amount: trip.budget,
      description: `Custom Trip to ${trip.states.join(', ')}`
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(receiptData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `receipt-${trip.id}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    toast({
      title: "Receipt Downloaded",
      description: "Your booking receipt has been downloaded",
    });
    
    const existingReceipts = JSON.parse(localStorage.getItem('tripReceipts') || '[]');
    existingReceipts.push({
      ...receiptData,
      downloadedAt: new Date().toISOString()
    });
    localStorage.setItem('tripReceipts', JSON.stringify(existingReceipts));
  };

  // Filter hotels by trip states
  const availableHotels = hotels.filter(hotel => 
    trip.states.some(state => hotel.state === state)
  );

  return (
    <>
      <div className="space-y-5">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hotel className="h-5 w-5" />
              Hotel Accommodations
            </CardTitle>
            <CardDescription>Browse and book hotels for your approved trip</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Choose from our selection of partner hotels in {trip.states.join(', ')}.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Your approved budget: ₹{trip.budget.toLocaleString()}
            </p>
            
            {availableHotels.length > 0 && (
              <div className="mt-4 space-y-3">
                <h4 className="font-medium">Available Hotels:</h4>
                <div className="grid gap-3">
                  {availableHotels.slice(0, 3).map(hotel => (
                    <div key={hotel.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h5 className="font-medium">{hotel.name}</h5>
                        <p className="text-sm text-muted-foreground">{hotel.location}</p>
                        <p className="text-sm font-medium">₹{hotel.price.toLocaleString()}/night</p>
                      </div>
                      <Button size="sm" onClick={() => handleHotelBooking(hotel)}>
                        Book Now
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/hotels">Browse All Hotels</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gamepad2 className="h-5 w-5" />
              Entertainment & Activities
            </CardTitle>
            <CardDescription>Explore entertainment options and activities</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Discover entertainment options and activities in {trip.states.join(', ')}.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Recommended based on your preferences: {trip.preferences.join(', ')}
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Explore Activities
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Booking Management
            </CardTitle>
            <CardDescription>Manage your bookings and receipts</CardDescription>
          </CardHeader>
          <CardContent>
            <p>View and download receipts for all your bookings.</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" className="flex items-center gap-2" onClick={handleDownloadReceipt}>
              <Download className="h-4 w-4" />
              Download Receipt
            </Button>
            <Button variant="secondary">View Itinerary</Button>
          </CardFooter>
        </Card>
      </div>

      <Dialog open={hotelBookingOpen} onOpenChange={setHotelBookingOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Hotel Booking</DialogTitle>
          </DialogHeader>
          {selectedHotel && (
            <HotelBookingForm
              hotel={selectedHotel}
              tripId={trip.id}
              onBookingComplete={handleBookingComplete}
              onClose={() => setHotelBookingOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
