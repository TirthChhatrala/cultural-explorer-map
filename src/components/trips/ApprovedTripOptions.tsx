
import React from 'react';
import { Link } from 'react-router-dom';
import { Hotel, Casino, Receipt, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CustomTripRequest } from '@/data/tripData';

interface ApprovedTripOptionsProps {
  trip: CustomTripRequest;
}

export const ApprovedTripOptions = ({ trip }: ApprovedTripOptionsProps) => {
  const { toast } = useToast();
  
  const handleDownloadReceipt = () => {
    // In a real app, this would generate a PDF receipt with booking details
    const receiptData = {
      id: trip.id,
      date: new Date().toISOString(),
      userId: trip.userId,
      amount: trip.budget,
      description: `Custom Trip to ${trip.states.join(', ')}`
    };
    
    // Simulate receipt download
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
    
    // Send receipt data to admin dashboard
    const existingReceipts = JSON.parse(localStorage.getItem('tripReceipts') || '[]');
    existingReceipts.push({
      ...receiptData,
      downloadedAt: new Date().toISOString()
    });
    localStorage.setItem('tripReceipts', JSON.stringify(existingReceipts));
  };

  return (
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
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link to="/hotels">Browse Hotels</Link>
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Casino className="h-5 w-5" />
            Entertainment & Activities
          </CardTitle>
          <CardDescription>Explore casinos and entertainment options</CardDescription>
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
  );
};
