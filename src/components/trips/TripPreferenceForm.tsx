
import React, { useState } from 'react';
import { CheckCircle2, FlagTriangleRight, Heart, Utensils, Map, Sun, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

interface TripPreferenceFormProps {
  onComplete: (preferences: TripPreferences) => void;
  onBack: () => void;
}

export interface TripPreferences {
  accommodationPreference: string;
  dietaryRestrictions: string[];
  travelPace: string;
  activities: string[];
  specialRequests: string;
}

export function TripPreferenceForm({ onComplete, onBack }: TripPreferenceFormProps) {
  const [preferences, setPreferences] = useState<TripPreferences>({
    accommodationPreference: 'mid-range',
    dietaryRestrictions: [],
    travelPace: 'medium',
    activities: [],
    specialRequests: '',
  });

  const dietaryOptions = [
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'gluten-free', label: 'Gluten-free' },
    { id: 'dairy-free', label: 'Dairy-free' },
    { id: 'nut-allergy', label: 'Nut allergy' },
  ];

  const activityOptions = [
    { id: 'historical-sites', label: 'Historical Sites' },
    { id: 'nature', label: 'Nature & Outdoors' },
    { id: 'food-tours', label: 'Food Tours' },
    { id: 'shopping', label: 'Shopping' },
    { id: 'cultural-events', label: 'Cultural Events' },
    { id: 'adventure', label: 'Adventure Activities' },
    { id: 'relaxation', label: 'Relaxation' },
  ];

  const handleDietaryChange = (restriction: string) => {
    setPreferences(prev => {
      const updated = prev.dietaryRestrictions.includes(restriction)
        ? prev.dietaryRestrictions.filter(item => item !== restriction)
        : [...prev.dietaryRestrictions, restriction];
      
      return { ...prev, dietaryRestrictions: updated };
    });
  };

  const handleActivityChange = (activity: string) => {
    setPreferences(prev => {
      const updated = prev.activities.includes(activity)
        ? prev.activities.filter(item => item !== activity)
        : [...prev.activities, activity];
      
      return { ...prev, activities: updated };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(preferences);
  };

  return (
    <div className="space-y-6 p-6 bg-card rounded-lg border shadow-sm">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Help us improve your trip experience</h3>
        <p className="text-sm text-muted-foreground">
          Share your preferences to help us tailor your trip to your interests.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium flex items-center mb-3">
              <FlagTriangleRight className="w-4 h-4 mr-2" />
              Accommodation Preference
            </h4>
            <RadioGroup 
              value={preferences.accommodationPreference}
              onValueChange={(val) => setPreferences({...preferences, accommodationPreference: val})}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="budget" id="budget" />
                <Label htmlFor="budget">Budget-friendly</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mid-range" id="mid-range" />
                <Label htmlFor="mid-range">Mid-range</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="luxury" id="luxury" />
                <Label htmlFor="luxury">Luxury</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <h4 className="text-sm font-medium flex items-center mb-3">
              <Utensils className="w-4 h-4 mr-2" />
              Dietary Restrictions
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {dietaryOptions.map(option => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`diet-${option.id}`}
                    checked={preferences.dietaryRestrictions.includes(option.id)}
                    onCheckedChange={() => handleDietaryChange(option.id)}
                  />
                  <Label htmlFor={`diet-${option.id}`}>{option.label}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium flex items-center mb-3">
              <Users className="w-4 h-4 mr-2" />
              Travel Pace
            </h4>
            <RadioGroup 
              value={preferences.travelPace}
              onValueChange={(val) => setPreferences({...preferences, travelPace: val})}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="slow" id="slow" />
                <Label htmlFor="slow">Relaxed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium">Balanced</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fast" id="fast" />
                <Label htmlFor="fast">Active</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <h4 className="text-sm font-medium flex items-center mb-3">
              <Heart className="w-4 h-4 mr-2" />
              Preferred Activities
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {activityOptions.map(option => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`activity-${option.id}`}
                    checked={preferences.activities.includes(option.id)}
                    onCheckedChange={() => handleActivityChange(option.id)}
                  />
                  <Label htmlFor={`activity-${option.id}`}>{option.label}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium flex items-center mb-3">
              <Map className="w-4 h-4 mr-2" />
              Special Requests or Notes
            </h4>
            <Textarea 
              value={preferences.specialRequests}
              onChange={(e) => setPreferences({...preferences, specialRequests: e.target.value})}
              placeholder="Tell us about any specific requirements or interests..."
              className="resize-none"
              rows={3}
            />
          </div>
        </div>
        
        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" className="gap-1">
            <CheckCircle2 className="h-4 w-4 mr-1" />
            Continue to Booking
          </Button>
        </div>
      </form>
    </div>
  );
}
