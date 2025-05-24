import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { trips } from '../data/tripData';
import { states } from '../data/states';
import { TripPreferenceForm } from '../components/trips/TripPreferenceForm';
import { TripPreferences } from '../components/trips/TripPreferences';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '../hooks/use-toast';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Star, 
  ArrowLeft, 
  Heart,
  Share2,
  Camera,
  Mountain,
  Utensils,
  Wifi,
  Car,
  Bed,
  Bath,
  Coffee,
  Shield
} from 'lucide-react';

interface ItineraryItem {
  day: number;
  title: string;
  description: string;
}

interface HotelAmenity {
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const TripDetails = () => {
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [trip, setTrip] = useState<any>(null);
  const [relatedTrips, setRelatedTrips] = useState<any[]>([]);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [userPreferences, setUserPreferences] = useState<TripPreferences>({});

  useEffect(() => {
    if (!tripId) return;

    const foundTrip = trips.find(trip => trip.id === tripId);
    if (foundTrip) {
      setTrip(foundTrip);
      
      // Find related trips (same category, excluding current trip)
      const related = trips.filter(t => t.category === foundTrip.category && t.id !== tripId);
      setRelatedTrips(related.slice(0, 3));
    } else {
      // Redirect to homepage if trip not found
      navigate('/404');
    }
  }, [tripId, navigate]);
  
  const handlePreferencesSubmit = (preferences: TripPreferences) => {
    setUserPreferences(preferences);
    setPreferencesOpen(false);
    
    toast({
      title: "Preferences Saved",
      description: "Your trip preferences have been saved.",
    });
  };

  if (!trip) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <span className="loading loading-spinner text-primary"></span>
        </div>
      </Layout>
    );
  }

  const {
    title,
    description,
    image,
    category,
    rating,
    duration,
    maxTravelers,
    price,
    discountedPrice,
    states: stateIds,
    itinerary,
    hotelAmenities
  } = trip;

  const stateNames = stateIds.map((stateId: string) => {
    const state = states.find(s => s.id === stateId);
    return state ? state.name : 'Unknown State';
  });

  const renderItinerary = (itinerary: ItineraryItem[]) => {
    return itinerary.map(item => (
      <div key={item.day} className="mb-4">
        <h4 className="text-lg font-semibold mb-1">Day {item.day}: {item.title}</h4>
        <p className="text-muted-foreground">{item.description}</p>
      </div>
    ));
  };

  const renderHotelAmenities = (amenities: HotelAmenity[]) => {
    return amenities.map(amenity => (
      <div key={amenity.name} className="flex items-center text-sm mr-4">
        <amenity.icon className="h-5 w-5 mr-2 text-muted-foreground" />
        <span>{amenity.name}</span>
      </div>
    ));
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
        className="container mx-auto py-16 px-4"
      >
        <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image and Trip Info */}
          <div>
            <div className="relative rounded-xl overflow-hidden shadow-md">
              <img
                src={image}
                alt={title}
                className="w-full h-96 object-cover"
              />
              {discountedPrice && (
                <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {Math.round((1 - discountedPrice / price) * 100)}% OFF
                </div>
              )}
            </div>

            <div className="mt-6">
              <h1 className="text-3xl font-display font-bold mb-3">{title}</h1>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <span className="inline-block px-3 py-1 bg-india-orange/10 text-india-orange rounded-full text-sm font-medium mr-2">
                    {category}
                  </span>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                    <span className="text-gray-600 dark:text-gray-400">{rating} / 5</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">
                    <Heart className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">
                    <Share2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-gray-700 dark:text-gray-300">{description}</p>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{stateNames.join(', ')}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>{duration} Days</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Users className="h-5 w-5 mr-2" />
                  <span>Up to {maxTravelers} Travelers</span>
                </div>
              </div>

              <div className="mt-6">
                {discountedPrice ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold text-india-orange">₹{discountedPrice.toLocaleString()}</span>
                    <span className="text-lg text-gray-500 line-through">₹{price.toLocaleString()}</span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-india-orange">₹{price.toLocaleString()}</span>
                )}
                {isAuthenticated ? (
                  <div className="mt-4 flex gap-3">
                    <Button className="w-1/2">Book Now</Button>
                    <Button variant="outline" className="w-1/2" onClick={() => setPreferencesOpen(true)}>
                      Customize
                    </Button>
                  </div>
                ) : (
                  <p className="text-red-500 mt-4">Login to book this trip!</p>
                )}
              </div>
            </div>
          </div>

          {/* Itinerary and Amenities */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Trip Itinerary</CardTitle>
                <CardDescription>A detailed plan for your adventure</CardDescription>
              </CardHeader>
              <CardContent>
                {itinerary && itinerary.length > 0 ? (
                  renderItinerary(itinerary)
                ) : (
                  <p className="text-muted-foreground">Itinerary not available.</p>
                )}
              </CardContent>
            </Card>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Hotel Amenities</CardTitle>
                <CardDescription>What you can expect at your accommodation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap">
                  {hotelAmenities && hotelAmenities.length > 0 ? (
                    renderHotelAmenities(hotelAmenities)
                  ) : (
                    <p className="text-muted-foreground">No amenities listed.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Trips */}
        {relatedTrips.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold font-display mb-6">You might also like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedTrips.map(relatedTrip => (
                <div key={relatedTrip.id} className="rounded-xl overflow-hidden shadow-md">
                  <img
                    src={relatedTrip.image}
                    alt={relatedTrip.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{relatedTrip.title}</h3>
                    <p className="text-muted-foreground">{relatedTrip.description}</p>
                    <Button variant="link" className="mt-4" onClick={() => navigate(`/trips/${relatedTrip.id}`)}>
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
      
      {/* Trip preference form dialog */}
      <Dialog open={preferencesOpen} onOpenChange={setPreferencesOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customize Your Trip Experience</DialogTitle>
          </DialogHeader>
          <TripPreferenceForm
            onSubmit={(preferences: string[], specialRequests: string) => {
              const formPreferences: TripPreferences = {
                activities: preferences,
                specialRequests: specialRequests
              };
              handlePreferencesSubmit(formPreferences);
            }}
            onClose={() => setPreferencesOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default TripDetails;
