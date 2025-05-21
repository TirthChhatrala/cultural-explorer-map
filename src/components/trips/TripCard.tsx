
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Trip } from '../../data/tripData';
import { Calendar, Clock, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TripCardProps {
  trip: Trip;
  className?: string;
}

export const TripCard = ({ trip, className = "" }: TripCardProps) => {
  return (
    <Link to={`/trips/${trip.id}`} className="block transition-transform duration-300 hover:-translate-y-2">
      <Card className={`overflow-hidden border h-full shadow-sm hover:shadow-md transition-shadow ${className} dark:bg-card dark:border-border`}>
        <AspectRatio ratio={4/3} className="bg-muted">
          <img 
            src={trip.image || '/placeholder.svg'} 
            alt={trip.title}
            className="object-cover w-full h-full"
          />
          {trip.discountPercentage > 0 && (
            <Badge className="absolute top-3 right-3 bg-india-orange">
              {trip.discountPercentage}% off
            </Badge>
          )}
        </AspectRatio>
        
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardDescription className="flex items-center mb-1">
              <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
              {trip.states.join(', ')}
            </CardDescription>
            <div className="flex items-center text-yellow-500">
              <Star className="h-4 w-4 fill-yellow-400 stroke-yellow-400 mr-1" />
              <span className="text-sm font-medium">{trip.rating}</span>
            </div>
          </div>
          <h3 className="font-semibold text-lg leading-tight">{trip.title}</h3>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="flex flex-wrap text-sm text-muted-foreground">
            <div className="flex items-center mr-4">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span>{trip.duration} days</span>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>Best time: {trip.bestTime}</span>
            </div>
          </div>
          
          <div className="mt-4">
            {trip.originalPrice && trip.originalPrice > trip.price ? (
              <div className="flex items-baseline gap-2">
                <p className="text-xl font-semibold">₹{trip.price.toLocaleString()}</p>
                <p className="text-muted-foreground line-through text-sm">
                  ₹{trip.originalPrice.toLocaleString()}
                </p>
              </div>
            ) : (
              <p className="text-xl font-semibold">₹{trip.price.toLocaleString()}</p>
            )}
            <p className="text-sm text-muted-foreground">per person</p>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button className="w-full">View Details</Button>
        </CardFooter>
      </Card>
    </Link>
  );
};
