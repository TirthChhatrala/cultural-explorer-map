
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { trips, Review } from '../data/tripData';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { Calendar, Star, MapPin, IndianRupee, Clock, MessageSquare, Camera } from 'lucide-react';
import EnhancedMap from '../components/EnhancedMap';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import TripReview from '../components/trips/TripReview';
import ReviewDisplay from '../components/trips/ReviewDisplay';

const TripDetails = () => {
  const { tripId } = useParams();
  const trip = trips.find(trip => trip.id === tripId);
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState("itinerary");

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

  const handleBooking = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOpen(false);
    toast({
      title: "Booking Confirmed",
      description: "Your trip booking has been received. We'll contact you soon!"
    });
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
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                  <TabsTrigger value="reviews" className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>Reviews ({reviews.length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="photos" className="flex items-center gap-1">
                    <Camera className="h-4 w-4" />
                    <span>Photos</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="itinerary" className="mt-4">
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-4">Overview</h2>
                    <p className="text-gray-700">{trip.description}</p>
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

                  <div className="bg-white rounded-xl shadow-md p-6 mt-8">
                    <h2 className="text-2xl font-bold mb-4">Itinerary</h2>
                    {trip.itinerary.map((day) => (
                      <div key={day.day} className="mb-4">
                        <h3 className="text-xl font-semibold mb-2">Day {day.day}</h3>
                        <p className="text-gray-700">
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
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <h2 className="text-2xl font-bold mb-4">Trip Cost</h2>
                <div className="flex items-center mb-4">
                  <IndianRupee className="mr-2 h-5 w-5 text-green-500" />
                  <span className="text-2xl font-bold">
                    {trip.discountedPrice ? trip.discountedPrice.toLocaleString() : trip.price.toLocaleString()}
                  </span>
                  {trip.discountedPrice && (
                    <span className="ml-2 text-gray-500 line-through">₹{trip.price.toLocaleString()}</span>
                  )}
                </div>
                <p className="text-gray-500 mb-6">per person</p>

                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button variant="default" className="w-full">Book Now</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Book Your Trip</DialogTitle>
                      <DialogDescription>
                        Fill in your details to book this amazing trip.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleBooking} className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input id="name" defaultValue="" required className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                          Email
                        </Label>
                        <Input id="email" type="email" defaultValue="" required className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                          Phone
                        </Label>
                        <Input id="phone" defaultValue="" required className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="travelers" className="text-right">
                          Travelers
                        </Label>
                        <Input id="travelers" type="number" min="1" defaultValue="1" required className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">
                          Date
                        </Label>
                        <Input id="date" type="date" required className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="message" className="text-right">
                          Notes
                        </Label>
                        <Textarea id="message" className="col-span-3" />
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button type="submit">
                          Confirm Booking
                        </Button>
                      </div>
                    </form>
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
