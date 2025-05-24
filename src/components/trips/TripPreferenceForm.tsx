
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Mountain, Waves, Star, Utensils, Camera, Gamepad2 } from 'lucide-react';

interface TripPreferenceFormProps {
  onSubmit: (preferences: string[], specialRequests: string) => void;
  onClose: () => void;
}

const preferenceOptions = [
  { id: 'heritage', label: 'Heritage Sites', icon: <Star className="h-4 w-4" /> },
  { id: 'nature', label: 'Nature & Wildlife', icon: <Mountain className="h-4 w-4" /> },
  { id: 'beaches', label: 'Beaches', icon: <Waves className="h-4 w-4" /> },
  { id: 'cuisine', label: 'Local Cuisine', icon: <Utensils className="h-4 w-4" /> },
  { id: 'photography', label: 'Photography', icon: <Camera className="h-4 w-4" /> },
  { id: 'adventure', label: 'Adventure Sports', icon: <Mountain className="h-4 w-4" /> },
  { id: 'spiritual', label: 'Spiritual Places', icon: <Star className="h-4 w-4" /> },
  { id: 'shopping', label: 'Shopping', icon: <MapPin className="h-4 w-4" /> },
  { id: 'nightlife', label: 'Entertainment & Nightlife', icon: <Gamepad2 className="h-4 w-4" /> },
  { id: 'luxury', label: 'Luxury Hotels', icon: <Star className="h-4 w-4" /> },
  { id: 'budget', label: 'Budget-Friendly', icon: <MapPin className="h-4 w-4" /> },
  { id: 'casino', label: 'Casino & Gaming', icon: <Gamepad2 className="h-4 w-4" /> }
];

export const TripPreferenceForm = ({ onSubmit, onClose }: TripPreferenceFormProps) => {
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [specialRequests, setSpecialRequests] = useState('');

  const handlePreferenceChange = (preferenceId: string, checked: boolean) => {
    if (checked) {
      setSelectedPreferences([...selectedPreferences, preferenceId]);
    } else {
      setSelectedPreferences(selectedPreferences.filter(id => id !== preferenceId));
    }
  };

  const handleSubmit = () => {
    onSubmit(selectedPreferences, specialRequests);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Tell us about your preferences</CardTitle>
        <CardDescription>
          Help us customize your trip experience by selecting your interests
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">What interests you most?</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {preferenceOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={option.id}
                  checked={selectedPreferences.includes(option.id)}
                  onCheckedChange={(checked) => 
                    handlePreferenceChange(option.id, checked as boolean)
                  }
                />
                <label 
                  htmlFor={option.id} 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer"
                >
                  {option.icon}
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Special Requests or Requirements</h3>
          <Textarea
            placeholder="Any special dietary requirements, accessibility needs, or specific requests..."
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Skip for Now
          </Button>
          <Button onClick={handleSubmit} className="flex-1">
            Save Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
