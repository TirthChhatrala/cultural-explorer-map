
import React from 'react';
import { Button } from '@/components/ui/button';
import { CustomTripRequest } from '@/data/tripData';
import { useToast } from '@/hooks/use-toast';
import { Download, FileText, Calendar, MapPin, Users, Car } from 'lucide-react';
import { ReceiptGenerator } from './ReceiptGenerator';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface TripSummaryProps {
  trip: CustomTripRequest;
  className?: string;
}

// Helper function to format dates
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Helper function to map state IDs to names
const getStateNames = (stateIds: string[]) => {
  const stateMap: { [key: string]: string } = {
    'rajasthan': 'Rajasthan',
    'kerala': 'Kerala',
    'himachalpradesh': 'Himachal Pradesh',
    'uttarakhand': 'Uttarakhand',
    'goa': 'Goa',
    'delhi': 'Delhi',
    'uttarpradesh': 'Uttar Pradesh',
    'tamil_nadu': 'Tamil Nadu',
    'karnataka': 'Karnataka',
    'punjab': 'Punjab'
  };
  
  return stateIds.map(id => stateMap[id] || id).join(', ');
};

export const TripSummary = ({ trip, className = "" }: TripSummaryProps) => {
  const { toast } = useToast();
  
  // Create receipt data from trip information
  const receiptData = {
    id: trip.id,
    date: trip.createdAt,
    userId: trip.userId,
    amount: trip.budget,
    description: `Custom Trip to ${getStateNames(trip.states)}`,
    items: [
      {
        name: "Trip Booking",
        price: trip.budget * 0.8,
        quantity: 1
      },
      {
        name: "Accommodation",
        price: trip.budget * 0.15,
        quantity: 1
      },
      {
        name: "Activities & Entertainment",
        price: trip.budget * 0.05,
        quantity: 1
      }
    ]
  };

  const handleDownloadPDF = async () => {
    const summaryElement = document.getElementById('trip-summary');
    const receiptElement = document.getElementById('receipt-content');
    
    if (!summaryElement || !receiptElement) {
      toast({
        title: "Error",
        description: "Could not generate PDF",
        variant: "destructive"
      });
      return;
    }
    
    try {
      toast({
        title: "Preparing Download",
        description: "Generating your trip summary PDF...",
      });
      
      // Create PDF document
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Add trip summary
      const summaryCanvas = await html2canvas(summaryElement, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      const summaryImgData = summaryCanvas.toDataURL('image/png');
      
      // Calculate dimensions and positioning
      const imgWidth = pdfWidth - 20;
      const imgHeight = (summaryCanvas.height * imgWidth) / summaryCanvas.width;
      
      pdf.setFontSize(18);
      pdf.text('Trip Summary', 105, 15, { align: 'center' });
      pdf.addImage(summaryImgData, 'PNG', 10, 20, imgWidth, imgHeight);
      
      // Add receipt on new page
      pdf.addPage();
      pdf.setFontSize(18);
      pdf.text('Trip Receipt', 105, 15, { align: 'center' });
      
      const receiptCanvas = await html2canvas(receiptElement, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      const receiptImgData = receiptCanvas.toDataURL('image/png');
      const receiptImgWidth = pdfWidth - 20;
      const receiptImgHeight = (receiptCanvas.height * receiptImgWidth) / receiptCanvas.width;
      
      pdf.addImage(receiptImgData, 'PNG', 10, 20, receiptImgWidth, receiptImgHeight);
      
      // Download PDF
      pdf.save(`trip-summary-${trip.id}.pdf`);
      
      // Show success toast
      toast({
        title: "Success",
        description: "Trip summary downloaded successfully",
      });
      
      // Save trip completion status to localStorage
      const completedTrips = JSON.parse(localStorage.getItem('completedTrips') || '[]');
      if (!completedTrips.includes(trip.id)) {
        completedTrips.push(trip.id);
        localStorage.setItem('completedTrips', JSON.stringify(completedTrips));
      }
      
      // Send receipt data to admin dashboard
      const tripSummaries = JSON.parse(localStorage.getItem('tripSummaries') || '[]');
      const existingSummaryIndex = tripSummaries.findIndex((summary: any) => summary.tripId === trip.id);
      
      if (existingSummaryIndex >= 0) {
        tripSummaries[existingSummaryIndex].downloadCount += 1;
        tripSummaries[existingSummaryIndex].lastDownloaded = new Date().toISOString();
      } else {
        tripSummaries.push({
          tripId: trip.id,
          userId: trip.userId,
          createdAt: new Date().toISOString(),
          downloadCount: 1,
          lastDownloaded: new Date().toISOString(),
          states: trip.states,
          budget: trip.budget
        });
      }
      
      localStorage.setItem('tripSummaries', JSON.stringify(tripSummaries));
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className={className}>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Trip Summary
        </h2>
        <Button 
          onClick={handleDownloadPDF}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download as PDF
        </Button>
      </div>
      
      <div className="space-y-8">
        <div id="trip-summary" className="p-6 border rounded-lg bg-card">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Custom Trip Summary</h1>
            <p className="text-muted-foreground">Trip ID: {trip.id}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Travel Period</p>
                <p>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Destinations</p>
                <p>{getStateNames(trip.states)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Travelers</p>
                <p>{trip.travelers} {trip.travelers === 1 ? 'person' : 'people'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Car className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Transportation</p>
                <p className="capitalize">{trip.transportMode}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Preferences</h3>
            <div className="flex flex-wrap gap-2">
              {trip.preferences.map((pref, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                >
                  {pref}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Budget Summary</h3>
            <div className="border-t border-b py-2">
              <div className="flex justify-between py-1">
                <span>Trip Cost</span>
                <span>₹{Math.round(trip.budget * 0.8).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Accommodation</span>
                <span>₹{Math.round(trip.budget * 0.15).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Activities & Entertainment</span>
                <span>₹{Math.round(trip.budget * 0.05).toLocaleString()}</span>
              </div>
            </div>
            <div className="flex justify-between font-semibold pt-2">
              <span>Total Budget</span>
              <span>₹{trip.budget.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div className="hidden">
          <ReceiptGenerator receipt={receiptData} />
        </div>
      </div>
    </div>
  );
};
