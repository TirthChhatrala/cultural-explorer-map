import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { states } from '../data/states';
import { Check } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PaymentModal from '../components/PaymentModal';

const CustomTrip = () => {
  const { theme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [transport, setTransport] = useState('');
  const [budget, setBudget] = useState(50000);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);

  const preferences = [
    'Historical Sites',
    'Beaches',
    'Mountains',
    'Adventure Activities',
    'Wildlife',
    'Cultural Experiences',
    'Religious Sites',
    'Food & Cuisine',
    'Shopping',
    'Relaxation & Wellness'
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to create a custom trip',
        variant: 'destructive',
      });
      navigate('/login');
    }
  }, [isAuthenticated, navigate, toast]);

  const handleStateSelection = (stateId: string) => {
    setSelectedStates(prevStates => {
      if (prevStates.includes(stateId)) {
        return prevStates.filter(id => id !== stateId);
      } else {
        return [...prevStates, stateId];
      }
    });
  };

  const handlePreferenceSelection = (preference: string) => {
    setSelectedPreferences(prevPreferences => {
      if (prevPreferences.includes(preference)) {
        return prevPreferences.filter(p => p !== preference);
      } else {
        return [...prevPreferences, preference];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a custom trip",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (selectedStates.length === 0) {
      toast({
        title: "Select Destinations",
        description: "Please select at least one destination",
        variant: "destructive",
      });
      return;
    }

    if (!transport) {
      toast({
        title: "Select Transport",
        description: "Please select a transport mode",
        variant: "destructive",
      });
      return;
    }

    const stateNames = selectedStates.map(id => states.find(s => s.id === id)?.name || id).join(', ');

    setBookingData({
      type: 'Custom Trip',
      title: `Custom Trip to ${stateNames}`,
      amount: budget,
      guestName: user?.name || 'Guest',
      guestEmail: user?.email || '',
      guestPhone: '',
      startDate: startDate || new Date().toISOString(),
      endDate: endDate || new Date().toISOString(),
      travelers: travelers,
      transportMode: transport,
    });
    setPaymentOpen(true);
  };

  const handlePaymentSuccess = () => {
    const tripRequest = {
      id: `custom-trip-${Date.now()}`,
      userId: user?.email || 'anonymous',
      startDate,
      endDate,
      travelers,
      transportMode: transport,
      states: selectedStates,
      budget,
      preferences: selectedPreferences,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      paidAt: new Date().toISOString(),
    };
    
    const existingBookings = JSON.parse(localStorage.getItem('tripBookings') || '[]');
    existingBookings.push({
      id: tripRequest.id,
      tripId: tripRequest.id,
      tripTitle: `Custom Trip to ${selectedStates.map(id => states.find(s => s.id === id)?.name || id).join(', ')}`,
      userId: user?.email,
      price: budget,
      bookingDate: new Date().toISOString(),
      status: 'confirmed',
      travelers: travelers,
      type: 'custom',
    });
    localStorage.setItem('tripBookings', JSON.stringify(existingBookings));

    toast({
      title: "Custom Trip Booked!",
      description: "Your custom trip has been confirmed and paid.",
    });

    navigate('/my-trips');
  };
  
  if (!isAuthenticated) return null;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
        >
          <section className="text-center py-16">
            <span className="inline-block px-3 py-1 bg-india-orange/10 text-india-orange rounded-full text-sm font-medium mb-4">
              Design Your Dream Trip
            </span>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4 tracking-tight">
              Create Your <span className="text-india-orange">Custom Trip</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tell us your preferences, pay now, and your custom trip is confirmed!
            </p>
          </section>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className={`rounded-xl border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h2 className="text-xl font-semibold mb-4">Trip Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  type="date"
                  id="start-date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  type="date"
                  id="end-date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="travelers">Number of Travelers</Label>
                <Input
                  type="number"
                  id="travelers"
                  min="1"
                  value={travelers}
                  onChange={(e) => setTravelers(parseInt(e.target.value))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="budget">Budget (₹)</Label>
                <Input
                  type="number"
                  id="budget"
                  min="10000"
                  step="1000"
                  value={budget}
                  onChange={(e) => setBudget(parseInt(e.target.value))}
                  required
                />
              </div>
            </div>
          </div>

          <div className={`rounded-xl border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h2 className="text-xl font-semibold mb-4">Destinations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {states.map((state) => (
                <label
                  key={state.id}
                  className={`flex items-center rounded-md p-3 cursor-pointer border ${
                    selectedStates.includes(state.id) ? 'bg-india-orange/10 border-india-orange' : theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                  }`}
                >
                  <Input
                    type="checkbox"
                    className="mr-2"
                    value={state.id}
                    checked={selectedStates.includes(state.id)}
                    onChange={() => handleStateSelection(state.id)}
                  />
                  {state.name}
                </label>
              ))}
            </div>
          </div>

          <div className={`rounded-xl border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h2 className="text-xl font-semibold mb-4">Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {preferences.map((preference) => (
                <label
                  key={preference}
                  className={`flex items-center rounded-md p-3 cursor-pointer border ${
                    selectedPreferences.includes(preference) ? 'bg-india-orange/10 border-india-orange' : theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                  }`}
                >
                  <Input
                    type="checkbox"
                    className="mr-2"
                    value={preference}
                    checked={selectedPreferences.includes(preference)}
                    onChange={() => handlePreferenceSelection(preference)}
                  />
                  {preference}
                </label>
              ))}
            </div>
          </div>

          <div className={`rounded-xl border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h2 className="text-xl font-semibold mb-4">Transportation</h2>
            <Select onValueChange={setTransport} value={transport}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a transport mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bus">Bus</SelectItem>
                <SelectItem value="car">Car</SelectItem>
                <SelectItem value="train">Train</SelectItem>
                <SelectItem value="flight">Flight</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={`rounded-xl border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Total Budget</h3>
                <p className="text-muted-foreground">Pay now to confirm your custom trip</p>
              </div>
              <div className="text-2xl font-bold text-india-orange">₹{budget.toLocaleString()}</div>
            </div>
          </div>

          <div className="flex justify-center mt-8 pb-8">
            <Button type="submit" className="bg-india-orange hover:bg-orange-600 px-8 py-3">
              Proceed to Payment
            </Button>
          </div>
        </form>
      </div>

      {bookingData && (
        <PaymentModal
          isOpen={paymentOpen}
          onClose={() => setPaymentOpen(false)}
          bookingDetails={bookingData}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </Layout>
  );
};

export default CustomTrip;
