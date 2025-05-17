
import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { trips, attractions, hotels, TripDay } from '../../data/tripData';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Calendar, Clock, MapPin, Coffee, Utensils, Hotel, Car, Edit, Trash, Plus, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface ItineraryPlannerProps {
  tripId: string;
  onItineraryChange?: (itinerary: TripDay[]) => void;
  readOnly?: boolean;
}

const ItineraryPlanner: React.FC<ItineraryPlannerProps> = ({ tripId, onItineraryChange, readOnly = false }) => {
  const { theme } = useTheme();
  const { toast } = useToast();
  const trip = trips.find(t => t.id === tripId);
  
  const [itinerary, setItinerary] = useState<TripDay[]>(trip?.itinerary || []);
  const [editingDay, setEditingDay] = useState<TripDay | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingAttractionIndex, setEditingAttractionIndex] = useState<number | null>(null);
  const [availableAttractions, setAvailableAttractions] = useState<string[]>([]);
  
  if (!trip) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Trip not found or itinerary is not available.</AlertDescription>
      </Alert>
    );
  }
  
  // Handle drag and drop reordering
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const { source, destination } = result;
    
    // If dropping in the same day
    if (source.droppableId === destination.droppableId) {
      const dayIndex = parseInt(source.droppableId.replace('day-', ''));
      const day = { ...itinerary[dayIndex] };
      const [movedAttraction] = day.attractions.splice(source.index, 1);
      day.attractions.splice(destination.index, 0, movedAttraction);
      
      const newItinerary = [...itinerary];
      newItinerary[dayIndex] = day;
      
      setItinerary(newItinerary);
      if (onItineraryChange) onItineraryChange(newItinerary);
    } else {
      // Moving between days
      const sourceDayIndex = parseInt(source.droppableId.replace('day-', ''));
      const destDayIndex = parseInt(destination.droppableId.replace('day-', ''));
      
      const sourceDay = { ...itinerary[sourceDayIndex] };
      const destDay = { ...itinerary[destDayIndex] };
      
      const [movedAttraction] = sourceDay.attractions.splice(source.index, 1);
      destDay.attractions.splice(destination.index, 0, movedAttraction);
      
      const newItinerary = [...itinerary];
      newItinerary[sourceDayIndex] = sourceDay;
      newItinerary[destDayIndex] = destDay;
      
      setItinerary(newItinerary);
      if (onItineraryChange) onItineraryChange(newItinerary);
    }
  };
  
  // Open edit dialog for a day
  const handleEditDay = (day: TripDay) => {
    const relevantAttractions = attractions
      .filter(a => trip.states.includes(a.state))
      .map(a => a.id);
      
    setAvailableAttractions(relevantAttractions);
    setEditingDay({ ...day });
    setShowEditDialog(true);
  };
  
  // Add a new day to the itinerary
  const handleAddDay = () => {
    const newDay: TripDay = {
      day: itinerary.length + 1,
      attractions: [],
      meals: {
        breakfast: "Hotel breakfast",
        lunch: "Local cuisine",
        dinner: "Restaurant dinner"
      },
      accommodation: trip.states.length > 0 ? 
        hotels.find(h => h.state === trip.states[0])?.id || "hotel" : 
        "hotel",
      transportation: "Car"
    };
    
    const newItinerary = [...itinerary, newDay];
    setItinerary(newItinerary);
    if (onItineraryChange) onItineraryChange(newItinerary);
    
    handleEditDay(newDay);
  };
  
  // Remove a day from the itinerary
  const handleRemoveDay = (dayNumber: number) => {
    const newItinerary = itinerary
      .filter(day => day.day !== dayNumber)
      .map((day, index) => ({ ...day, day: index + 1 })); // Renumber days
      
    setItinerary(newItinerary);
    if (onItineraryChange) onItineraryChange(newItinerary);
    
    toast({
      title: "Day removed",
      description: `Day ${dayNumber} has been removed from the itinerary`
    });
  };
  
  // Save changes to a day
  const handleSaveDay = () => {
    if (!editingDay) return;
    
    const newItinerary = [...itinerary];
    const index = newItinerary.findIndex(day => day.day === editingDay.day);
    
    if (index >= 0) {
      newItinerary[index] = editingDay;
    } else {
      newItinerary.push(editingDay);
    }
    
    setItinerary(newItinerary);
    if (onItineraryChange) onItineraryChange(newItinerary);
    setShowEditDialog(false);
    
    toast({
      title: "Day updated",
      description: `Day ${editingDay.day} has been updated`
    });
  };
  
  // Add attraction to the day being edited
  const handleAddAttraction = (attractionId: string) => {
    if (!editingDay) return;
    
    setEditingDay({
      ...editingDay,
      attractions: [...editingDay.attractions, attractionId]
    });
  };
  
  // Remove attraction from the day being edited
  const handleRemoveAttraction = (index: number) => {
    if (!editingDay) return;
    
    const newAttractions = [...editingDay.attractions];
    newAttractions.splice(index, 1);
    
    setEditingDay({
      ...editingDay,
      attractions: newAttractions
    });
  };
  
  // Generate an optimized itinerary
  const handleGenerateOptimizedPlan = () => {
    // Simple optimization: group attractions by state to minimize travel
    const stateAttractions = new Map<string, string[]>();
    
    // Group attractions by state
    attractions.forEach(attraction => {
      if (trip.states.includes(attraction.state)) {
        if (!stateAttractions.has(attraction.state)) {
          stateAttractions.set(attraction.state, []);
        }
        stateAttractions.get(attraction.state)?.push(attraction.id);
      }
    });
    
    // Create an optimized itinerary
    let optimizedItinerary: TripDay[] = [];
    let dayCounter = 1;
    
    // Add attractions from each state sequentially
    trip.states.forEach(stateId => {
      const stateAttrs = stateAttractions.get(stateId) || [];
      const stateHotels = hotels.filter(h => h.state === stateId).map(h => h.id);
      const defaultHotel = stateHotels.length > 0 ? stateHotels[0] : "hotel";
      
      // Create days for this state (2 attractions per day)
      for (let i = 0; i < stateAttrs.length; i += 2) {
        const dayAttractions = stateAttrs.slice(i, i + 2);
        
        optimizedItinerary.push({
          day: dayCounter++,
          attractions: dayAttractions,
          meals: {
            breakfast: "Hotel breakfast",
            lunch: "Local cuisine",
            dinner: "Restaurant dinner"
          },
          accommodation: defaultHotel,
          transportation: i === 0 ? "Car/Train" : "Local transport"
        });
      }
    });
    
    // Ensure we have at least the same number of days as the trip duration
    while (optimizedItinerary.length < trip.duration) {
      optimizedItinerary.push({
        day: optimizedItinerary.length + 1,
        attractions: [],
        meals: {
          breakfast: "Hotel breakfast",
          lunch: "Local cuisine",
          dinner: "Restaurant dinner"
        },
        accommodation: "hotel",
        transportation: "Local transport"
      });
    }
    
    // Trim if we have too many days
    if (optimizedItinerary.length > trip.duration) {
      optimizedItinerary = optimizedItinerary.slice(0, trip.duration);
    }
    
    setItinerary(optimizedItinerary);
    if (onItineraryChange) onItineraryChange(optimizedItinerary);
    
    toast({
      title: "Itinerary optimized",
      description: `An optimized ${trip.duration}-day itinerary has been generated`
    });
  };
  
  // Get attraction details by ID
  const getAttractionDetails = (id: string) => {
    return attractions.find(a => a.id === id) || { 
      id, name: id, description: "", location: "", state: "", type: "monument" as const, image: "" 
    };
  };
  
  // Get hotel details by ID
  const getHotelDetails = (id: string) => {
    return hotels.find(h => h.id === id) || { 
      id, name: id, description: "", location: "", state: "", price: 0, rating: 0, amenities: [], image: "" 
    };
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-semibold">
          {trip.duration}-Day Itinerary
        </h2>
        
        {!readOnly && (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleAddDay}
            >
              <Plus size={16} className="mr-1" /> Add Day
            </Button>
            <Button 
              onClick={handleGenerateOptimizedPlan}
              size="sm"
              className="bg-india-orange hover:bg-india-orange/90 text-white"
            >
              <Calendar size={16} className="mr-1" /> Generate Optimized Plan
            </Button>
          </div>
        )}
      </div>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="space-y-4">
          {itinerary.map((day) => (
            <div 
              key={`day-${day.day}`}
              className={`border rounded-lg overflow-hidden ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              <div className={`flex items-center justify-between p-4 ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
              }`}>
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-india-orange/10'
                  } text-india-orange font-medium mr-3`}>
                    {day.day}
                  </div>
                  <div>
                    <h3 className="font-semibold">Day {day.day}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin size={14} className="mr-1" />
                      <span>
                        {day.attractions.length > 0 
                          ? getAttractionDetails(day.attractions[0]).location 
                          : 'No attractions planned'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {!readOnly && (
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEditDay(day)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleRemoveDay(day.day)}
                      className="text-destructive"
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <div className="mb-4">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Clock size={16} className="mr-2 text-india-orange" /> Activities
                  </h4>
                  
                  <Droppable droppableId={`day-${day.day - 1}`} isDropDisabled={readOnly}>
                    {(provided) => (
                      <div 
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`p-3 rounded-lg min-h-[80px] ${
                          theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'
                        }`}
                      >
                        {day.attractions.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-2">
                            No activities planned for this day
                          </p>
                        ) : (
                          <ul className="space-y-2">
                            {day.attractions.map((attractionId, index) => {
                              const attraction = getAttractionDetails(attractionId);
                              return (
                                <Draggable 
                                  key={attractionId} 
                                  draggableId={attractionId} 
                                  index={index}
                                  isDragDisabled={readOnly}
                                >
                                  {(provided) => (
                                    <li
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`p-3 rounded-lg flex items-start justify-between ${
                                        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                                      } border`}
                                    >
                                      <div>
                                        <p className="font-medium">{attraction.name}</p>
                                        <p className="text-xs text-muted-foreground">{attraction.location}</p>
                                        <Badge 
                                          variant="outline" 
                                          className="mt-1 text-xs"
                                        >
                                          {attraction.type}
                                        </Badge>
                                      </div>
                                    </li>
                                  )}
                                </Draggable>
                              );
                            })}
                          </ul>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <Coffee size={16} className="mr-2 text-india-orange" /> Meals
                    </h4>
                    <div className={`p-3 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'
                    }`}>
                      <ul className="space-y-1 text-sm">
                        {day.meals.breakfast && (
                          <li className="flex items-center">
                            <span className="font-medium mr-2">Breakfast:</span> 
                            {day.meals.breakfast}
                          </li>
                        )}
                        {day.meals.lunch && (
                          <li className="flex items-center">
                            <span className="font-medium mr-2">Lunch:</span> 
                            {day.meals.lunch}
                          </li>
                        )}
                        {day.meals.dinner && (
                          <li className="flex items-center">
                            <span className="font-medium mr-2">Dinner:</span> 
                            {day.meals.dinner}
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <Hotel size={16} className="mr-2 text-india-orange" /> Accommodation
                    </h4>
                    <div className={`p-3 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'
                    }`}>
                      <p className="text-sm">
                        {getHotelDetails(day.accommodation).name}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <Car size={16} className="mr-2 text-india-orange" /> Transportation
                    </h4>
                    <div className={`p-3 rounded-lg ${
                      theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'
                    }`}>
                      <p className="text-sm">{day.transportation}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {itinerary.length === 0 && (
            <div className={`p-8 rounded-lg border text-center ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h3 className="font-medium text-lg mb-2">No Itinerary Available</h3>
              <p className="text-muted-foreground mb-4">
                This trip doesn't have an itinerary yet. 
                {!readOnly && " Use the 'Generate Optimized Plan' button to create one automatically."}
              </p>
              
              {!readOnly && (
                <Button 
                  onClick={handleGenerateOptimizedPlan}
                  className="bg-india-orange hover:bg-india-orange/90 text-white"
                >
                  <Calendar size={16} className="mr-2" /> 
                  Generate Optimized Plan
                </Button>
              )}
            </div>
          )}
        </div>
      </DragDropContext>
      
      {/* Edit Day Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingDay ? `Edit Day ${editingDay.day}` : 'Add New Day'}
            </DialogTitle>
          </DialogHeader>
          
          {editingDay && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Activities</h4>
                <div className="space-y-2">
                  {editingDay.attractions.map((attractionId, index) => {
                    const attraction = getAttractionDetails(attractionId);
                    return (
                      <div 
                        key={`editing-${attractionId}-${index}`}
                        className={`p-3 rounded-lg flex items-start justify-between ${
                          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                        }`}
                      >
                        <div>
                          <p className="font-medium">{attraction.name}</p>
                          <p className="text-xs text-muted-foreground">{attraction.location}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleRemoveAttraction(index)}
                          className="text-destructive"
                        >
                          <Trash size={16} />
                        </Button>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-2">
                  <Select onValueChange={(value) => handleAddAttraction(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add attraction..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableAttractions.map(attractionId => {
                        const attraction = getAttractionDetails(attractionId);
                        return (
                          <SelectItem key={attractionId} value={attractionId}>
                            {attraction.name} ({attraction.location})
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Meals</h4>
                  
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm">Breakfast</label>
                      <Input 
                        value={editingDay.meals.breakfast || ''}
                        onChange={(e) => setEditingDay({
                          ...editingDay,
                          meals: { ...editingDay.meals, breakfast: e.target.value }
                        })}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm">Lunch</label>
                      <Input 
                        value={editingDay.meals.lunch || ''}
                        onChange={(e) => setEditingDay({
                          ...editingDay,
                          meals: { ...editingDay.meals, lunch: e.target.value }
                        })}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm">Dinner</label>
                      <Input 
                        value={editingDay.meals.dinner || ''}
                        onChange={(e) => setEditingDay({
                          ...editingDay,
                          meals: { ...editingDay.meals, dinner: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Accommodation</h4>
                    <Select 
                      value={editingDay.accommodation}
                      onValueChange={(value) => setEditingDay({
                        ...editingDay,
                        accommodation: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {hotels
                          .filter(hotel => trip.states.includes(hotel.state))
                          .map(hotel => (
                            <SelectItem key={hotel.id} value={hotel.id}>
                              {hotel.name} ({hotel.location})
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Transportation</h4>
                    <Select 
                      value={editingDay.transportation}
                      onValueChange={(value) => setEditingDay({
                        ...editingDay,
                        transportation: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Car">Car</SelectItem>
                        <SelectItem value="Train">Train</SelectItem>
                        <SelectItem value="Bus">Bus</SelectItem>
                        <SelectItem value="Flight">Flight</SelectItem>
                        <SelectItem value="Local transport">Local transport</SelectItem>
                        <SelectItem value="Walking tour">Walking tour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveDay}
              className="bg-india-orange hover:bg-india-orange/90 text-white"
            >
              <Save size={16} className="mr-2" /> Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ItineraryPlanner;
