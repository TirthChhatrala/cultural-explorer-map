import React from 'react';
import { useParams } from 'react-router-dom';
import { trips } from '../data/tripData';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { Calendar, Star, MapPin, IndianRupee, Clock } from 'lucide-react';
import EnhancedMap from '../components/EnhancedMap';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useTheme } from '../context/ThemeContext';

const TripDetails = () => {
  const { tripId } = useParams();
  const trip = trips.find(trip => trip.id === tripId);
  const { theme } = useTheme();

  const [open, setOpen] = useState(false)

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
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6">
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
                    <Button variant="default">Book Now</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Book Your Trip</DialogTitle>
                      <DialogDescription>
                        Fill in your details to book this amazing trip.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input id="name" defaultValue="John Doe" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                          Email
                        </Label>
                        <Input id="email" defaultValue="john.doe@example.com" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                          Phone
                        </Label>
                        <Input id="phone" defaultValue="+91-9999999999" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="message" className="text-right">
                          Additional Details
                        </Label>
                        <Textarea id="message" className="col-span-3" />
                      </div>
                    </div>
                    <Button type="submit">
                      Submit
                    </Button>
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
