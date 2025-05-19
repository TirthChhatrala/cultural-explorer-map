import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { states } from '../data/states';
import { MapPin, Calendar, Users, Route, Car, Train, Plane, Bus, Compass, IndianRupee, AlertCircle, ArrowRight } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import EnhancedMap from '../components/EnhancedMap';
import TripSuggestions from '../components/trips/TripSuggestions';
import { format } from 'date-fns';

const preferences = [
  { id: 'adventure', label: 'Adventure Activities' },
  { id: 'beach', label: 'Beaches' },
  { id: 'cultural', label: 'Cultural Experiences' },
  { id: 'food', label: 'Culinary Exploration' },
  { id: 'historical', label: 'Historical Sites' },
  { id: 'luxury', label: 'Luxury Experiences' },
  { id: 'nature', label: 'Nature & Wildlife' },
  { id: 'religious', label: 'Religious Sites' },
  { id: 'shopping', label: 'Shopping' },
  { id: 'wellness', label: 'Wellness & Spa' },
];

const transportOptions = [
  { id: 'car', label: 'Car', icon: Car },
  { id: 'bus', label: 'Bus', icon: Bus },
  { id: 'train', label: 'Train', icon: Train },
  { id: 'flight', label: 'Flight', icon: Plane },
];

const CustomTrip = () => {
  const { theme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Date selection
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  
  // Trip details
  const [travelers, setTravelers] = useState(2);
  const [transportMode, setTransportMode] = useState('car');
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [budget, setBudget] = useState([20000]);
  
  // UI state
  const [showMap, setShowMap] = useState(true);
  const [activeTab, setActiveTab] = useState('destinations');
  
  useEffect(() => {
    // Enforce login requirement
    if (!isAuthenticated) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to create a custom trip',
        variant: 'destructive',
      });
      navigate('/login', { replace: true });
      return;
    }
    
    // Set default dates
    const today = new Date();
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(today.getDate() + 14);
    
    const threeWeeksFromNow = new Date();
    threeWeeksFromNow.setDate(today.getDate() + 21);
    
    setStartDate(twoWeeksFromNow);
    setEndDate(threeWeeksFromNow);
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
  
  const handlePreferenceChange = (preferenceId: string) => {
    setSelectedPreferences(prevPrefs => {
      if (prevPrefs.includes(preferenceId)) {
        return prevPrefs.filter(id => id !== preferenceId);
      } else {
        return [...prevPrefs, preferenceId];
      }
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      toast({
        title: 'Missing dates',
        description: 'Please select both start and end dates',
        variant: 'destructive',
      });
      return;
    }
    
    if (selectedStates.length === 0) {
      toast({
        title: 'Select destinations',
        description: 'Please select at least one state to visit',
        variant: 'destructive',
      });
      return;
    }
    
    const customTripRequest = {
      id: `request-${Date.now()}`,
      userId: user?.email || 'unknown',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      travelers,
      transportMode,
      states: selectedStates,
      budget: budget[0],
      preferences: selectedPreferences,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    console.log('Trip request submitted:', customTripRequest);
    
    toast({
      title: 'Request submitted!',
      description: 'Your custom trip request has been submitted for review',
    });
    
    navigate('/dashboard');
  };
  
  const getDuration = () => {
    if (!startDate || !endDate) return 0;
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Return null if not authenticated
  if (!isAuthenticated) return null;
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
        >
          <section className="text-center mb-10">
            <span className="inline-block px-3 py-1 bg-india-orange/10 text-india-orange rounded-full text-sm font-medium mb-4">
              Plan Your Dream Trip
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
              Create Your <span className="text-india-orange">Custom Trip</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Tell us your preferences, and we'll design a personalized itinerary just for you. Our travel experts will curate the perfect journey through India.
            </p>
          </section>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="destinations" className="data-[state=active]:bg-india-orange/20 data-[state=active]:text-india-orange">
                  <MapPin className="mr-2 h-4 w-4" />
                  Destinations
                </TabsTrigger>
                <TabsTrigger value="details" className="data-[state=active]:bg-india-orange/20 data-[state=active]:text-india-orange">
                  <Calendar className="mr-2 h-4 w-4" />
                  Trip Details
                </TabsTrigger>
                <TabsTrigger value="preferences" className="data-[state=active]:bg-india-orange/20 data-[state=active]:text-india-orange">
                  <Compass className="mr-2 h-4 w-4" />
                  Preferences
                </TabsTrigger>
                <TabsTrigger value="suggestions" disabled={selectedStates.length === 0} className="data-[state=active]:bg-india-orange/20 data-[state=active]:text-india-orange">
                  <Route className="mr-2 h-4 w-4" />
                  Suggestions
                </TabsTrigger>
              </TabsList>
              
              <form onSubmit={handleSubmit}>
                <TabsContent value="destinations" className="mt-6">
                  <div className={`p-6 rounded-xl border ${
                    theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  } shadow-sm`}>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-display font-semibold flex items-center">
                        <MapPin className="mr-2 text-india-orange" size={20} />
                        Select Destinations
                      </h2>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setShowMap(!showMap)}
                        className="text-xs"
                      >
                        {showMap ? 'Hide Map' : 'Show Map'}
                      </Button>
                    </div>
                    
                    {showMap && (
                      <div className="mb-8">
                        <EnhancedMap 
                          selectedStates={selectedStates}
                          onStateSelect={handleStateSelection}
                          interactive={true}
                          showControls={true}
                          showStateInfo={true}
                        />
                      </div>
                    )}
                    
                    <p className="text-sm text-muted-foreground mb-4">
                      Selected states: <span className="font-medium">{selectedStates.length > 0 ? 
                        selectedStates.map(id => states.find(s => s.id === id)?.name).join(', ') : 
                        'None'}</span>
                    </p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {states.map((state) => (
                        <div
                          key={state.id}
                          className={`p-3 border rounded-md cursor-pointer transition-all ${
                            selectedStates.includes(state.id) 
                              ? 'bg-india-orange/20 border-india-orange' 
                              : theme === 'dark' 
                                ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                                : 'bg-white border-gray-300 hover:bg-gray-100'
                          }`}
                          onClick={() => handleStateSelection(state.id)}
                        >
                          <div className="flex items-center">
                            <Checkbox 
                              checked={selectedStates.includes(state.id)}
                              className="mr-2"
                            />
                            <span className="text-sm">{state.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <Button
                        type="button"
                        onClick={() => setActiveTab("details")}
                        className="bg-india-orange hover:bg-india-orange/90 text-white"
                      >
                        Continue to Trip Details
                        <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="details" className="mt-6">
                  <div className={`p-6 rounded-xl border ${
                    theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  } shadow-sm`}>
                    <h2 className="text-xl font-display font-semibold mb-6 flex items-center">
                      <Calendar className="mr-2 text-india-orange" size={20} />
                      Trip Details
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Start Date</label>
                        <Popover open={showStartCalendar} onOpenChange={setShowStartCalendar}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={`w-full justify-start text-left font-normal ${!startDate && "text-muted-foreground"}`}
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={startDate}
                              onSelect={(date) => {
                                setStartDate(date);
                                setShowStartCalendar(false);
                                
                                // If end date is before the new start date, update it
                                if (endDate && date && endDate < date) {
                                  const newEndDate = new Date(date);
                                  newEndDate.setDate(date.getDate() + 7);
                                  setEndDate(newEndDate);
                                }
                              }}
                              disabled={(date) => date < new Date()}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">End Date</label>
                        <Popover open={showEndCalendar} onOpenChange={setShowEndCalendar}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={`w-full justify-start text-left font-normal ${!endDate && "text-muted-foreground"}`}
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={endDate}
                              onSelect={(date) => {
                                setEndDate(date);
                                setShowEndCalendar(false);
                              }}
                              disabled={(date) => startDate ? date <= startDate : date <= new Date()}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium mb-2 flex items-center">
                          <Users className="mr-1" size={16} />
                          Number of Travelers
                        </label>
                        <div className="flex">
                          <button
                            type="button"
                            className={`px-3 py-1 ${
                              theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                            } rounded-l-md transition-colors`}
                            onClick={() => setTravelers(Math.max(1, travelers - 1))}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            className={`w-full p-1 text-center border-y ${
                              theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                            }`}
                            value={travelers}
                            onChange={(e) => setTravelers(Math.max(1, parseInt(e.target.value) || 1))}
                            min="1"
                            required
                          />
                          <button
                            type="button"
                            className={`px-3 py-1 ${
                              theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                            } rounded-r-md transition-colors`}
                            onClick={() => setTravelers(travelers + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2 flex items-center">
                          <Route className="mr-1" size={16} />
                          Preferred Transportation
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {transportOptions.map((option) => {
                            const IconComponent = option.icon;
                            return (
                              <button
                                key={option.id}
                                type="button"
                                className={`p-2 rounded-md flex flex-col items-center justify-center transition-all ${
                                  transportMode === option.id 
                                    ? 'bg-india-orange/20 border-india-orange' 
                                    : theme === 'dark' 
                                      ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                                      : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
                                } border`}
                                onClick={() => setTransportMode(option.id)}
                              >
                                <IconComponent size={20} className={transportMode === option.id ? 'text-india-orange' : ''} />
                                <span className="text-xs mt-1">{option.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {startDate && endDate && (
                      <div className={`p-4 rounded-lg mb-6 ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                      }`}>
                        <div className="flex items-center text-india-orange">
                          <Calendar size={18} className="mr-2" />
                          <h3 className="font-medium">Trip Duration: {getDuration()} days</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          From {startDate ? format(startDate, "PPP") : "--"} to {endDate ? format(endDate, "PPP") : "--"}
                        </p>
                      </div>
                    )}
                    
                    <div className="mt-6 flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setActiveTab("destinations")}
                      >
                        Back to Destinations
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setActiveTab("preferences")}
                        className="bg-india-orange hover:bg-india-orange/90 text-white"
                      >
                        Continue to Preferences
                        <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="preferences" className="mt-6">
                  <div className={`p-6 rounded-xl border ${
                    theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  } shadow-sm`}>
                    <h2 className="text-xl font-display font-semibold mb-6 flex items-center">
                      <Compass className="mr-2 text-india-orange" size={20} />
                      Preferences
                    </h2>
                    
                    <p className="text-sm text-muted-foreground mb-4">
                      Select your interests to help us customize your trip:
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      {preferences.map((pref) => (
                        <div key={pref.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={pref.id}
                            checked={selectedPreferences.includes(pref.id)}
                            onCheckedChange={() => handlePreferenceChange(pref.id)}
                          />
                          <label
                            htmlFor={pref.id}
                            className="text-sm cursor-pointer"
                          >
                            {pref.label}
                          </label>
                        </div>
                      ))}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center">
                        <IndianRupee className="mr-1" size={16} />
                        Budget per person
                      </label>
                      <div className="px-2">
                        <Slider
                          defaultValue={[20000]}
                          max={100000}
                          step={1000}
                          value={budget}
                          onValueChange={setBudget}
                          className="my-4"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>₹10,000</span>
                          <span>₹{budget[0].toLocaleString()}</span>
                          <span>₹100,000</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setActiveTab("details")}
                      >
                        Back to Trip Details
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setActiveTab("suggestions")}
                        disabled={selectedStates.length === 0}
                        className="bg-india-orange hover:bg-india-orange/90 text-white"
                      >
                        View Suggestions
                        <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="suggestions" className="mt-6">
                  <div className={`p-6 rounded-xl border ${
                    theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  } shadow-sm`}>
                    <h2 className="text-xl font-display font-semibold mb-6 flex items-center">
                      <Route className="mr-2 text-india-orange" size={20} />
                      Trip Suggestions
                    </h2>
                    
                    {selectedStates.length === 0 ? (
                      <div className="text-center py-10">
                        <AlertCircle className="mx-auto mb-4 text-india-orange/60" size={48} />
                        <p className="text-muted-foreground">
                          Please select at least one state to get personalized suggestions.
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setActiveTab("destinations")}
                          className="mt-4"
                        >
                          Select Destinations
                        </Button>
                      </div>
                    ) : (
                      <>
                        <TripSuggestions 
                          selectedStates={selectedStates}
                          budget={budget[0]}
                          selectedPreferences={selectedPreferences}
                        />
                        
                        <div className="mb-4 border-t pt-4 mt-6">
                          <h3 className="text-lg font-medium mb-4">Trip Summary</h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className={`p-3 rounded-lg ${
                              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                            }`}>
                              <p className="text-xs text-muted-foreground">Destinations</p>
                              <p className="font-medium">{selectedStates.length} States</p>
                            </div>
                            <div className={`p-3 rounded-lg ${
                              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                            }`}>
                              <p className="text-xs text-muted-foreground">Duration</p>
                              <p className="font-medium">{getDuration()} Days</p>
                            </div>
                            <div className={`p-3 rounded-lg ${
                              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                            }`}>
                              <p className="text-xs text-muted-foreground">Travelers</p>
                              <p className="font-medium">{travelers} {travelers === 1 ? 'Person' : 'People'}</p>
                            </div>
                            <div className={`p-3 rounded-lg ${
                              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                            }`}>
                              <p className="text-xs text-muted-foreground">Budget / Person</p>
                              <p className="font-medium">₹{budget[0].toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    
                    <div className="mt-6 flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setActiveTab("preferences")}
                      >
                        Back to Preferences
                      </Button>
                      <Button 
                        type="submit"
                        className="bg-india-orange hover:bg-india-orange/90 text-white"
                      >
                        Submit Trip Request
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </form>
            </Tabs>
          </div>
          
          <div className="lg:col-span-1">
            <div className={`sticky top-24 p-6 rounded-lg border shadow-sm ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h3 className="text-xl font-display font-semibold mb-4">How It Works</h3>
              
              <ol className="space-y-4">
                <li className="flex items-start">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-india-orange/10'
                  } text-india-orange font-medium mr-3 flex-shrink-0`}>
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Submit Your Request</h4>
                    <p className="text-sm text-muted-foreground">Fill out the form with your preferences and travel details.</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-india-orange/10'
                  } text-india-orange font-medium mr-3 flex-shrink-0`}>
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Get a Personalized Itinerary</h4>
                    <p className="text-sm text-muted-foreground">Our travel experts will design a custom trip based on your preferences.</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-india-orange/10'
                  } text-india-orange font-medium mr-3 flex-shrink-0`}>
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Review and Approve</h4>
                    <p className="text-sm text-muted-foreground">Review your custom itinerary and request any changes if needed.</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-india-orange/10'
                  } text-india-orange font-medium mr-3 flex-shrink-0`}>
                    4
                  </div>
                  <div>
                    <h4 className="font-medium">Confirm and Enjoy</h4>
                    <p className="text-sm text-muted-foreground">Once confirmed, get ready to enjoy your customized Indian adventure!</p>
                  </div>
                </li>
              </ol>
              
              <div className={`mt-6 p-4 rounded-md ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <p className="text-sm">
                  <strong>Note:</strong> Custom trip requests are typically processed within 48 hours. We'll contact you to discuss details and pricing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CustomTrip;
