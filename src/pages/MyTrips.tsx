import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { CustomTripRequest } from '../data/tripData';
import { Check, X, Clock, Loader, Circle, User, Calendar, MapPin, Building, Heart } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ApprovedTripOptions } from '@/components/trips/ApprovedTripOptions';
import { TripSummary } from '@/components/trips/TripSummary';

interface TravelerInfo {
  name: string;
  age: string;
  gender: string;
  idType: string;
  idNumber: string;
}

interface TripPreferences {
  accommodationPreference?: string;
  dietaryRestrictions?: string[];
  travelPace?: string;
  activities?: string[];
  specialRequests?: string;
}

interface Booking {
  bookingId: string;
  tripId: string;
  tripTitle: string;
  userEmail: string;
  userName: string;
  phone: string;
  travelers: number;
  travelDate: string;
  bookingDate: string;
  travelerDetails?: TravelerInfo[];
  customizations?: string[];
  preferences?: TripPreferences;
  notes?: string;
  totalCost: number;
  status: string;
}

const MyTrips = () => {
  const { theme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'requests' | 'bookings'>('requests');
  const [tripRequests, setTripRequests] = useState<CustomTripRequest[]>([]);
  const [bookedTrips, setBookedTrips] = useState<Booking[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<CustomTripRequest | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [bookingDetailsOpen, setBookingDetailsOpen] = useState(false);
  const [completedTrips, setCompletedTrips] = useState<string[]>([]);

  // Load trip data from localStorage with real-time sync
  useEffect(() => {
    if (isAuthenticated && user) {
      const loadTripData = () => {
        // Load custom trip requests
        const allRequests = JSON.parse(localStorage.getItem('customTripRequests') || '[]');
        const userRequests = allRequests.filter((req: CustomTripRequest) => req.userId === user.email);
        setTripRequests(userRequests);
        
        // Load booked trips (regular package trips)
        const allBookings = JSON.parse(localStorage.getItem('bookedTrips') || '[]');
        const userBookings = allBookings.filter((booking: any) => booking.userEmail === user.email);
        setBookedTrips(userBookings);
        
        // Load completed trips
        const completed = JSON.parse(localStorage.getItem('completedTrips') || '[]');
        setCompletedTrips(completed);
      };

      // Initial load
      loadTripData();

      // Set up real-time sync listener
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'customTripRequests' || e.key === 'bookedTrips') {
          loadTripData();
        }
      };

      window.addEventListener('storage', handleStorageChange);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, [isAuthenticated, user]);
  
  // If not authenticated, redirect to login
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

  // Get status badge based on status value
  const renderStatusBadge = (status: CustomTripRequest['status']) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-500 dark:border-yellow-800 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-500 dark:border-green-800 flex items-center gap-1">
            <Check className="h-3 w-3" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-500 dark:border-red-800 flex items-center gap-1">
            <X className="h-3 w-3" />
            Rejected
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-500 dark:border-blue-800 flex items-center gap-1">
            <Loader className="h-3 w-3 animate-spin" />
            In Progress
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-500 dark:border-purple-800 flex items-center gap-1">
            <Circle className="h-3 w-3 fill-current" />
            Completed
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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

  // View trip details
  const viewTripDetails = (trip: CustomTripRequest) => {
    setSelectedTrip(trip);
    setDetailsOpen(true);
  };
  
  // View booking details
  const viewBookingDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setBookingDetailsOpen(true);
  };

  const renderBookedTrips = () => {
    if (bookedTrips.length === 0) {
      return (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg mb-6">You haven't booked any trips yet.</p>
          <Button onClick={() => navigate('/trips')}>Explore Trip Packages</Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bookedTrips.map((booking, index) => (
          <motion.div
            key={booking.bookingId || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{booking.tripTitle}</CardTitle>
                    <CardDescription className="mt-1">
                      Booked on {formatDate(booking.bookingDate)}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-500 dark:border-green-800">
                    {booking.status || 'Confirmed'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-2 items-center">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p><span className="text-sm font-medium text-muted-foreground">Travel Date:</span> {formatDate(booking.travelDate)}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <p><span className="text-sm font-medium text-muted-foreground">Travelers:</span> {booking.travelers}</p>
                  </div>
                  
                  {booking.preferences?.accommodationPreference && (
                    <div className="flex gap-2 items-center">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <p>
                        <span className="text-sm font-medium text-muted-foreground">Accommodation:</span> {' '}
                        <span className="capitalize">{booking.preferences.accommodationPreference}</span>
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-2 pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-muted-foreground">Total Cost</p>
                      <p className="font-semibold">₹{booking.totalCost.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => viewBookingDetails(booking)}
                >
                  View Details
                </Button>
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={() => navigate(`/trips/${booking.tripId}`)}
                >
                  View Trip
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  };

  // Render trip request cards with the ability to show completed status
  const renderTripRequests = () => {
    if (tripRequests.length === 0) {
      return (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg mb-6">You haven't submitted any custom trip requests yet.</p>
          <Button onClick={() => navigate('/custom-trip')}>Create Custom Trip</Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tripRequests.map((trip) => (
          <motion.div
            key={trip.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Custom Trip Request</CardTitle>
                    <CardDescription className="mt-1">
                      {formatDate(trip.createdAt)}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    {renderStatusBadge(trip.status)}
                    {completedTrips.includes(trip.id) && (
                      <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800">
                        Completed
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-2 items-center">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Destinations</p>
                      <p>{getStateNames(trip.states)}</p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Dates</p>
                        <p>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Budget</p>
                      <p>₹{trip.budget.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Show hotel & casino options for approved trips */}
                {(trip.status === 'approved' || trip.status === 'in-progress') && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Your trip has been approved! 🎉</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => viewTripDetails(trip)}
                    >
                      View Accommodation & Activities
                    </Button>
                  </div>
                )}
                
                {/* Show download summary option for all trips */}
                {completedTrips.includes(trip.id) && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Your trip is complete!</p>
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="w-full"
                      onClick={() => viewTripDetails(trip)}
                    >
                      View Trip Summary
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => viewTripDetails(trip)}
                >
                  View Details
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
              My Experiences
            </span>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              My Trips
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Track the status of your custom trip requests and view your booked trips
            </p>
          </section>
        </motion.div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'requests' | 'bookings')}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="requests" className="text-base">Custom Trip Requests</TabsTrigger>
            <TabsTrigger value="bookings" className="text-base">Booked Trips</TabsTrigger>
          </TabsList>
          <TabsContent value="requests" className="mt-0">
            {renderTripRequests()}
          </TabsContent>
          <TabsContent value="bookings" className="mt-0">
            {renderBookedTrips()}
          </TabsContent>
        </Tabs>

        {/* Trip requests details dialog */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Trip Request Details</DialogTitle>
              <DialogDescription>
                Your custom trip request information
              </DialogDescription>
            </DialogHeader>
            {selectedTrip && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Status</h3>
                  <div className="flex gap-2">
                    {renderStatusBadge(selectedTrip.status)}
                    {completedTrips.includes(selectedTrip.id) && (
                      <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800">
                        Completed
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Show trip summary if the trip is marked as completed */}
                {completedTrips.includes(selectedTrip.id) && (
                  <div className="my-6 border-t pt-6">
                    <TripSummary trip={selectedTrip} />
                  </div>
                )}
                
                {/* Show regular trip details if not viewing summary */}
                {!completedTrips.includes(selectedTrip.id) && (
                  <>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Request Date</h3>
                      <p>{formatDate(selectedTrip.createdAt)}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Start Date</h3>
                        <p>{formatDate(selectedTrip.startDate)}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">End Date</h3>
                        <p>{formatDate(selectedTrip.endDate)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Travelers</h3>
                        <p>{selectedTrip.travelers}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Transport</h3>
                        <p className="capitalize">{selectedTrip.transportMode}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Destinations</h3>
                      <p>{getStateNames(selectedTrip.states)}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Budget</h3>
                      <p>₹{selectedTrip.budget.toLocaleString()}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Preferences</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedTrip.preferences.map(pref => (
                          <Badge key={pref} variant="outline">{pref}</Badge>
                        ))}
                      </div>
                    </div>

                    {selectedTrip.status === 'rejected' && (
                      <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800 rounded-md">
                        <p className="text-red-600 dark:text-red-400 font-medium">This request was declined</p>
                        <p className="text-sm text-red-500 dark:text-red-300 mt-1">
                          Please create a new request with adjusted preferences or budget.
                        </p>
                      </div>
                    )}

                    {(selectedTrip.status === 'approved' || selectedTrip.status === 'in-progress') && (
                      <>
                        <div className="p-4 border border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-800 rounded-md mb-6">
                          <p className="text-green-600 dark:text-green-400 font-medium">Your request has been approved!</p>
                          <p className="text-sm text-green-500 dark:text-green-300 mt-1">
                            You can now access accommodation and activity options.
                          </p>
                        </div>
                        
                        <ApprovedTripOptions trip={selectedTrip} />
                        
                        {/* Option to mark trip as completed */}
                        {!completedTrips.includes(selectedTrip.id) && selectedTrip.status === 'approved' && (
                          <div className="mt-6 pt-6 border-t">
                            <Button
                              onClick={() => {
                                const completed = [...completedTrips, selectedTrip.id];
                                setCompletedTrips(completed);
                                localStorage.setItem('completedTrips', JSON.stringify(completed));
                                
                                toast({
                                  title: "Trip Marked as Completed",
                                  description: "You can now view and download your trip summary",
                                });
                                
                                // Force re-render
                                setDetailsOpen(false);
                                setTimeout(() => {
                                  viewTripDetails(selectedTrip);
                                }, 100);
                              }}
                              className="w-full"
                            >
                              Mark Trip as Completed
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
        
        {/* Booked trips details dialog */}
        <Dialog open={bookingDetailsOpen} onOpenChange={setBookingDetailsOpen}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
              <DialogDescription>
                Your trip booking information
              </DialogDescription>
            </DialogHeader>
            {selectedBooking && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold">{selectedBooking.tripTitle}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    <p>Booked on {formatDate(selectedBooking.bookingDate)}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Booking ID</h4>
                    <p>{selectedBooking.bookingId}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-500 dark:border-green-800">
                      {selectedBooking.status}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Travel Date</h4>
                  <p>{formatDate(selectedBooking.travelDate)}</p>
                </div>
                
                {selectedBooking.preferences && (
                  <div className="space-y-3 p-3 border rounded-md">
                    <h4 className="text-sm font-medium flex items-center mb-1">
                      <Heart className="h-4 w-4 mr-1" />
                      Trip Preferences
                    </h4>
                    
                    {selectedBooking.preferences.accommodationPreference && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Accommodation:</span>
                        <span className="text-sm capitalize">{selectedBooking.preferences.accommodationPreference}</span>
                      </div>
                    )}
                    
                    {selectedBooking.preferences.travelPace && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Travel pace:</span>
                        <span className="text-sm capitalize">{selectedBooking.preferences.travelPace}</span>
                      </div>
                    )}
                    
                    {selectedBooking.preferences.dietaryRestrictions && selectedBooking.preferences.dietaryRestrictions.length > 0 && (
                      <div>
                        <span className="text-sm text-muted-foreground">Dietary restrictions:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedBooking.preferences.dietaryRestrictions.map(restriction => (
                            <Badge key={restriction} variant="secondary" className="text-xs">
                              {restriction}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedBooking.preferences.activities && selectedBooking.preferences.activities.length > 0 && (
                      <div>
                        <span className="text-sm text-muted-foreground">Preferred activities:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedBooking.preferences.activities.map(activity => (
                            <Badge key={activity} variant="secondary" className="text-xs">
                              {activity.replace(/-/g, ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedBooking.preferences.specialRequests && (
                      <div>
                        <span className="text-sm text-muted-foreground">Special requests:</span>
                        <p className="text-sm mt-1">{selectedBooking.preferences.specialRequests}</p>
                      </div>
                    )}
                  </div>
                )}
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Traveler Details</h4>
                  <div className="space-y-4">
                    {selectedBooking.travelerDetails ? (
                      selectedBooking.travelerDetails.map((traveler, index) => (
                        <div key={index} className="p-3 border rounded-md">
                          <div className="flex justify-between mb-2">
                            <h5 className="font-medium text-sm">{index === 0 ? 'Primary Traveler' : `Traveler ${index + 1}`}</h5>
                            <Badge variant="outline">{traveler.gender}</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-y-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Name:</span> {traveler.name}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Age:</span> {traveler.age}
                            </div>
                            <div>
                              <span className="text-muted-foreground">ID:</span> {traveler.idType}
                            </div>
                            <div>
                              <span className="text-muted-foreground">ID Number:</span> {traveler.idNumber.slice(0, 4)}****
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <p>{selectedBooking.travelers} travelers</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedBooking.customizations && selectedBooking.customizations.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Selected Customizations</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedBooking.customizations.map(custom => (
                        <Badge key={custom} variant="secondary">{custom.replace(/-/g, ' ')}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedBooking.notes && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Special Requests</h4>
                    <p className="text-sm">{selectedBooking.notes}</p>
                  </div>
                )}
                
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Payment Summary</h4>
                  <div className="flex justify-between font-semibold">
                    <span>Total Amount</span>
                    <span>₹{selectedBooking.totalCost.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex justify-center pt-2">
                  <Button 
                    onClick={() => navigate(`/trips/${selectedBooking.tripId}`)}
                    variant="default"
                  >
                    View Trip Details
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default MyTrips;
