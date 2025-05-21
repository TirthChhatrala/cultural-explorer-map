import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { trips, Review, hotels, Hotel } from '../data/tripData';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { Calendar, Star, MapPin, IndianRupee, Clock, MessageSquare, Camera, User, Plus, Minus, Building, Bed } from 'lucide-react';
import EnhancedMap from '../components/EnhancedMap';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import TripReview from '../components/trips/TripReview';
import ReviewDisplay from '../components/trips/ReviewDisplay';
import { TripPreferenceForm, TripPreferences } from '../components/trips/TripPreferenceForm';

interface TravelerInfo {
  name: string;
  age: string;
  gender: string;
  idType: string;
  idNumber: string;
}

const TripDetails = () => {
  const { tripId } = useParams();
  const trip = trips.find(trip => trip.id === tripId);
  const { theme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState("itinerary");
  
  // Dynamic pricing and traveler information
  const [travelers, setTravelers] = useState(1);
  const [travelerInfo, setTravelerInfo] = useState<TravelerInfo[]>([{
    name: '',
    age: '',
    gender: 'male',
    idType: 'aadhar',
    idNumber: ''
  }]);
  const [bookingDate, setBookingDate] = useState('');
  const [customizations, setCustomizations] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState(trip?.price || 0);
  
  // New booking state variables
  const [showPreferenceForm, setShowPreferenceForm] = useState(false);
  const [preferences, setPreferences] = useState<TripPreferences | null>(null);
  
  // Find hotels related to the trip
  const [tripHotels, setTripHotels] = useState<Hotel[]>([]);
  
  // Available customizations with their price impacts
  const availableCustomizations = [
    { id: 'premium-transport', label: 'Premium Transport', priceIncrease: 2000 },
    { id: 'private-guide', label: 'Private Guide', priceIncrease: 3500 },
    { id: 'special-meals', label: 'Special Dietary Meals', priceIncrease: 1500 },
    { id: 'photo-package', label: 'Professional Photo Package', priceIncrease: 2500 },
  ];

  useEffect(() => {
    // Find hotels related to this trip
    if (trip) {
      const relatedHotels = hotels.filter(hotel => 
        trip.states.includes(hotel.state)
      ).slice(0, 3); // Limit to 3 hotels for display
      
      setTripHotels(relatedHotels);
    }
  }, [trip]);

  // Calculate total price whenever relevant factors change
  useEffect(() => {
    if (!trip) return;
    
    let basePrice = trip.discountedPrice || trip.price;
    let total = basePrice * travelers;
    
    // Add costs of selected customizations
    customizations.forEach(customId => {
      const customization = availableCustomizations.find(c => c.id === customId);
      if (customization) {
        total += customization.priceIncrease;
      }
    });
    
    // Apply group discount for 4+ travelers (5% off)
    if (travelers >= 4) {
      total = total * 0.95;
    }
    
    setTotalPrice(total);
  }, [travelers, customizations, trip]);

  // Update traveler info fields when number of travelers changes
  useEffect(() => {
    const currentCount = travelerInfo.length;
    
    if (travelers > currentCount) {
      // Add more traveler forms
      const newTravelers = Array(travelers - currentCount).fill(null).map(() => ({
        name: '',
        age: '',
        gender: 'male',
        idType: 'aadhar',
        idNumber: ''
      }));
      
      setTravelerInfo([...travelerInfo, ...newTravelers]);
    } else if (travelers < currentCount) {
      // Remove excess traveler forms
      setTravelerInfo(travelerInfo.slice(0, travelers));
    }
  }, [travelers]);
  
  useEffect(() => {
    // Load reviews from localStorage
    const savedReviews = JSON.parse(localStorage.getItem('tripReviews') || '[]');
    const tripReviews = savedReviews.filter((review: Review) => review.tripId === tripId);
    setReviews(tripReviews);
  }, [tripId]);

  const handleReviewSubmit = (review: Review) => {
    setReviews(prev => [review, ...prev]);
    setActiveTab("reviews");
  };
  
  const handleCustomizationToggle = (customId: string) => {
    setCustomizations(prev => {
      if (prev.includes(customId)) {
        return prev.filter(id => id !== customId);
      } else {
        return [...prev, customId];
      }
    });
  };
  
  const updateTravelerInfo = (index: number, field: keyof TravelerInfo, value: string) => {
    const updated = [...travelerInfo];
    updated[index] = { ...updated[index], [field]: value };
    setTravelerInfo(updated);
  };

  const handlePreferenceComplete = (formPreferences: TripPreferences) => {
    setPreferences(formPreferences);
    setShowPreferenceForm(false);
    
    toast({
      title: "Preferences saved",
      description: "We'll take these into account for your trip",
    });
  };

  const handleStartBooking = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to book this trip",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    setShowPreferenceForm(true);
    setOpen(true);
  };

  const handleBooking = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isAuthenticated || !trip) {
      toast({
        title: "Authentication required",
        description: "Please log in to book this trip",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    // Validate traveler information
    const isTravelerInfoComplete = travelerInfo.every(info => 
      info.name && info.age && info.gender && info.idType && info.idNumber
    );
    
    if (!isTravelerInfoComplete) {
      toast({
        title: "Incomplete information",
        description: "Please fill in details for all travelers",
        variant: "destructive",
      });
      return;
    }
    
    if (!bookingDate) {
      toast({
        title: "Select a date",
        description: "Please select your travel date",
        variant: "destructive",
      });
      return;
    }
    
    const formData = new FormData(e.currentTarget);
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;
    
    // Calculate total cost from our state
    const finalPrice = totalPrice;
    
    // Create booking object
    const booking = {
      bookingId: `BK-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      tripId: trip.id,
      tripTitle: trip.title,
      userEmail: user?.email,
      userName: travelerInfo[0].name, // Primary traveler
      phone,
      travelers,
      travelDate: bookingDate,
      bookingDate: new Date().toISOString(),
      travelerDetails: travelerInfo,
      customizations,
      notes: message,
      preferences: preferences || undefined,
      totalCost: finalPrice,
      status: 'Confirmed'
    };
    
    // Save booking to localStorage
    const existingBookings = JSON.parse(localStorage.getItem('bookedTrips') || '[]');
    existingBookings.push(booking);
    localStorage.setItem('bookedTrips', JSON.stringify(existingBookings));
    
    // Close dialog and show toast
    setOpen(false);
    toast({
      title: "Booking Confirmed",
      description: "Your trip booking has been received. We'll contact you soon!"
    });
    
    // Navigate to my trips
    setTimeout(() => {
      navigate('/my-trips');
    }, 1000);
  };

  if (!trip) {
    return (
      <Layout>
        <div>Trip not found</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
        >
          <div className="relative rounded-xl overflow-hidden shadow-lg">
            <img
              src={trip.image}
              alt={trip.title}
              className="w-full h-96 object-cover"
            />
            <div className="absolute top-4 left-4 bg-white/80 rounded-full px-3 py-1 text-sm font-medium">
              {trip.category}
            </div>
            <div className="absolute bottom-0 left-0 p-6 w-full bg-gradient-to-t from-black/80 to-transparent text-white">
              <h1 className="text-3xl font-bold">{trip.title}</h1>
              <div className="flex items-center mt-2">
                <Star className="mr-2 h-5 w-5 text-yellow-500 fill-yellow-500" />
                <span>{trip.rating} ({trip.reviews} reviews)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                  <TabsTrigger value="hotels" className="flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    <span>Hotels</span>
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>Reviews</span>
                  </TabsTrigger>
                  <TabsTrigger value="photos" className="flex items-center gap-1">
                    <Camera className="h-4 w-4" />
                    <span>Photos</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="itinerary" className="mt-4">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-4">Overview</h2>
                    <p className="text-gray-700 dark:text-gray-300">{trip.description}</p>
                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-5 w-5 text-gray-500" />
                        <span>{trip.duration} Days</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-5 w-5 text-gray-500" />
                        <span>{trip.states.join(', ')}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-5 w-5 text-gray-500" />
                        <span>Flexible Dates</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mt-8">
                    <h2 className="text-2xl font-bold mb-4">Itinerary</h2>
                    {trip.itinerary.map((day) => (
                      <div key={day.day} className="mb-4">
                        <h3 className="text-xl font-semibold mb-2">Day {day.day}</h3>
                        <p className="text-gray-700 dark:text-gray-300">
                          {day.attractions.join(', ')}
                        </p>
                        <p className="text-sm text-gray-500">
                          Meals: {day.meals.breakfast}, {day.meals.lunch}, {day.meals.dinner}
                        </p>
                        <p className="text-sm text-gray-500">
                          Accommodation: {day.accommodation}
                        </p>
                        <p className="text-sm text-gray-500">
                          Transportation: {day.transportation}
                        </p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="hotels" className="mt-4">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-4">Accommodations</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                      During this trip, you will stay at selected accommodations that offer comfort and convenience.
                    </p>
                    
                    {tripHotels.length > 0 ? (
                      <div className="space-y-6">
                        {tripHotels.map((hotel) => (
                          <div key={hotel.id} className="border rounded-lg overflow-hidden flex flex-col md:flex-row">
                            <div className="md:w-1/3 relative">
                              <img 
                                src={hotel.image} 
                                alt={hotel.name} 
                                className="h-48 md:h-full w-full object-cover"
                              />
                            </div>
                            <div className="p-4 md:w-2/3">
                              <div className="flex justify-between items-start">
                                <h3 className="text-lg font-semibold">{hotel.name}</h3>
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                  <span className="ml-1">{hotel.rating}</span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-500 mb-2">{hotel.location}</p>
                              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{hotel.description}</p>
                              <div className="flex flex-wrap gap-2">
                                {hotel.amenities.slice(0, 5).map((amenity, idx) => (
                                  <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                                    {amenity}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        <div className="text-center mt-4">
                          <Button variant="outline" onClick={() => navigate('/hotels')}>
                            View More Hotels
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-10 border rounded-lg">
                        <Bed className="mx-auto h-10 w-10 text-gray-400" />
                        <p className="mt-2 text-gray-500">
                          Hotel information for this trip will be provided soon.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews" className="mt-4">
                  <div className="space-y-6">
                    {isAuthenticated ? (
                      <TripReview tripId={trip.id} onSubmitSuccess={handleReviewSubmit} />
                    ) : (
                      <div className="p-6 rounded-xl border bg-background/50 shadow-sm text-center">
                        <h3 className="text-lg font-medium mb-2">Login to leave a review</h3>
                        <p className="text-muted-foreground mb-4">Share your experience with other travelers</p>
                        <Button onClick={() => navigate('/login')}>
                          Login to Continue
                        </Button>
                      </div>
                    )}
                    
                    <div className="mt-8">
                      <h2 className="text-2xl font-bold mb-4">Traveler Reviews</h2>
                      <ReviewDisplay reviews={reviews} />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="photos" className="mt-4">
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-4">Trip Photos</h2>
                    
                    {/* Official trip photos */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-3">Official Photos</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        <img 
                          src={trip.image} 
                          alt={trip.title}
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                        {/* More official photos would go here */}
                      </div>
                    </div>
                    
                    {/* User uploaded photos from reviews */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Traveler Photos</h3>
                      {reviews.some(review => review.images && review.images.length > 0) ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {reviews.flatMap(review => 
                            review.images ? 
                              review.images.map((image, idx) => (
                                <div key={`${review.id}-${idx}`} className="relative group">
                                  <img 
                                    src={image} 
                                    alt={`Photo by ${review.userName}`}
                                    className="w-full aspect-square object-cover rounded-lg"
                                  />
                                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-b-lg">
                                    By {review.userName}
                                  </div>
                                </div>
                              )) 
                            : []
                          )}
                        </div>
                      ) : (
                        <div className="text-center p-8 border rounded-lg bg-muted/10">
                          <p className="text-muted-foreground">No traveler photos yet. Be the first to share!</p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-24">
                <h2 className="text-2xl font-bold mb-4">Trip Cost</h2>
                <div className="flex items-center mb-4">
                  <IndianRupee className="mr-2 h-5 w-5 text-green-500" />
                  <span className="text-2xl font-bold">
                    {totalPrice.toLocaleString()}
                  </span>
                  {trip.discountedPrice && (
                    <span className="ml-2 text-gray-500 line-through">₹{trip.price.toLocaleString()}</span>
                  )}
                </div>
                <p className="text-gray-500 mb-6">for {travelers} {travelers === 1 ? 'traveler' : 'travelers'}</p>

                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button variant="default" className="w-full" onClick={handleStartBooking}>Book Now</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Book Your Trip</DialogTitle>
                      <DialogDescription>
                        {showPreferenceForm ? 
                          "Tell us about your preferences to help us customize your trip" :
                          "Fill in your details to book this amazing trip"
                        }
                      </DialogDescription>
                    </DialogHeader>
                    
                    {showPreferenceForm ? (
                      <TripPreferenceForm 
                        onComplete={handlePreferenceComplete} 
                        onBack={() => setOpen(false)}
                      />
                    ) : (
                      <form onSubmit={handleBooking} className="grid gap-4 py-4">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-lg font-semibold mb-2 flex items-center">
                              <Calendar className="h-5 w-5 mr-2" />
                              Travel Date
                            </h3>
                            <Input 
                              type="date" 
                              id="date" 
                              value={bookingDate}
                              onChange={(e) => setBookingDate(e.target.value)}
                              required 
                            />
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-semibold mb-2 flex items-center">
                              <User className="h-5 w-5 mr-2" />
                              Number of Travelers
                            </h3>
                            <div className="flex items-center space-x-2 mb-4">
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="icon"
                                onClick={() => travelers > 1 && setTravelers(travelers - 1)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="text-xl font-medium w-8 text-center">{travelers}</span>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="icon"
                                onClick={() => setTravelers(travelers + 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Customizations</h3>
                            <div className="space-y-2">
                              {availableCustomizations.map(custom => (
                                <div key={custom.id} className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <input 
                                      type="checkbox" 
                                      id={`custom-${custom.id}`}
                                      className="mr-2"
                                      checked={customizations.includes(custom.id)}
                                      onChange={() => handleCustomizationToggle(custom.id)}
                                    />
                                    <Label htmlFor={`custom-${custom.id}`}>{custom.label}</Label>
                                  </div>
                                  <span className="text-sm text-muted-foreground">+₹{custom.priceIncrease.toLocaleString()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="space-y-6">
                            <h3 className="text-lg font-semibold">Traveler Information</h3>
                            
                            {travelerInfo.map((traveler, index) => (
                              <div key={index} className="space-y-4 p-4 border rounded-lg">
                                <h4 className="font-medium">
                                  {index === 0 ? 'Primary Traveler' : `Traveler ${index + 1}`}
                                </h4>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor={`name-${index}`}>Full Name</Label>
                                    <Input 
                                      id={`name-${index}`}
                                      value={traveler.name}
                                      onChange={(e) => updateTravelerInfo(index, 'name', e.target.value)}
                                      required
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor={`age-${index}`}>Age</Label>
                                    <Input 
                                      id={`age-${index}`}
                                      type="number"
                                      min="0"
                                      value={traveler.age}
                                      onChange={(e) => updateTravelerInfo(index, 'age', e.target.value)}
                                      required
                                    />
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor={`gender-${index}`}>Gender</Label>
                                    <Select 
                                      value={traveler.gender} 
                                      onValueChange={(value) => updateTravelerInfo(index, 'gender', value)}
                                    >
                                      <SelectTrigger id={`gender-${index}`}>
                                        <SelectValue placeholder="Select Gender" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label htmlFor={`idType-${index}`}>ID Type</Label>
                                    <Select 
                                      value={traveler.idType} 
                                      onValueChange={(value) => updateTravelerInfo(index, 'idType', value)}
                                    >
                                      <SelectTrigger id={`idType-${index}`}>
                                        <SelectValue placeholder="Select ID Type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="aadhar">Aadhar Card</SelectItem>
                                        <SelectItem value="passport">Passport</SelectItem>
                                        <SelectItem value="driving">Driving License</SelectItem>
                                        <SelectItem value="voter">Voter ID</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                
                                <div>
                                  <Label htmlFor={`idNumber-${index}`}>ID Number</Label>
                                  <Input 
                                    id={`idNumber-${index}`}
                                    value={traveler.idNumber}
                                    onChange={(e) => updateTravelerInfo(index, 'idNumber', e.target.value)}
                                    required
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" required />
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="message">Special Requests</Label>
                            <Textarea id="message" placeholder="Any special requirements or requests?" />
                          </div>
                          
                          <div className="bg-muted/50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-2">Price Summary</h3>
                            <div className="space-y-1 mb-2">
                              <div className="flex justify-between">
                                <span>Base Price ({travelers} {travelers === 1 ? 'traveler' : 'travelers'})</span>
                                <span>₹{((trip.discountedPrice || trip.price) * travelers).toLocaleString()}</span>
                              </div>
                              
                              {customizations.length > 0 && customizations.map(customId => {
                                const custom = availableCustomizations.find(c => c.id === customId);
                                if (!custom) return null;
                                return (
                                  <div key={custom.id} className="flex justify-between">
                                    <span>{custom.label}</span>
                                    <span>₹{custom.priceIncrease.toLocaleString()}</span>
                                  </div>
                                );
                              })}
                              
                              {travelers >= 4 && (
                                <div className="flex justify-between text-green-600 dark:text-green-400">
                                  <span>Group Discount (5%)</span>
                                  <span>-₹{(totalPrice * 0.05).toLocaleString()}</span>
                                </div>
                              )}
                            </div>
                            <div className="border-t pt-2 flex justify-between font-semibold">
                              <span>Total</span>
                              <span>₹{totalPrice.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end mt-4">
                          <Button type="submit">
                            Confirm Booking (₹{totalPrice.toLocaleString()})
                          </Button>
                        </div>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>

                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-2">Trip Route</h3>
                  <div className="h-64 rounded-xl overflow-hidden">
                    <EnhancedMap
                      selectedStates={trip.states}
                      interactive={false}
                      showStateInfo={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default TripDetails;
