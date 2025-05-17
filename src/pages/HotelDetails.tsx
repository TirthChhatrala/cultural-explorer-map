
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { useTheme } from '../context/ThemeContext';
import { hotels } from '../data/tripData';
import { MapPin, Phone, Link, Star, ChevronLeft, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  beds?: number;
  images: string[];
  amenities?: string[]; // Added missing amenities property from component use
}

interface Hotel {
  id: string;
  name: string;
  description: string;
  location: string;
  state: string;
  price: number;
  rating: number;
  amenities: string[];
  image: string;
  images: string[];
  contact: string;
  website: string;
  rooms: Room[];
}

interface ImageGalleryProps {
  images: string[];
  name: string;
  onClose: () => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, name, onClose }) => {
  const { theme } = useTheme();
  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[825px]">
        <DialogHeader>
          <DialogTitle>{name} - Gallery</DialogTitle>
          <DialogDescription>
            All the images related to this property.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4">
          {images.map((image, index) => (
            <img key={index} src={image} alt={`${name} - ${index}`} className="rounded-md" />
          ))}
        </div>
        <Button className="mt-4" onClick={() => onClose()}>Close</Button>
      </DialogContent>
    </Dialog>
  );
};

interface RoomCardProps {
  room: Room;
  onClick: (room: Room) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onClick }) => {
  const { theme } = useTheme();
  return (
    <div
      className={`border rounded-lg p-4 cursor-pointer transition-shadow hover:shadow-md ${
        theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      }`}
      onClick={() => onClick(room)}
    >
      <h3 className="text-lg font-semibold">{room.name}</h3>
      <p className="text-muted-foreground">{room.description}</p>
      <div className="mt-2 flex justify-between items-center">
        <div>
          <span className="text-sm">Capacity: {room.capacity}</span>
          <span className="ml-2 text-sm">Beds: {room.beds}</span>
        </div>
        <span className="text-india-orange font-semibold">₹{room.price}</span>
      </div>
    </div>
  );
};

const bookingSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().regex(/^(\+?\d{1,4}[-.\s]?)?(\(?\d{1,}\)?[-.\s]?)?(\d{1,}[-.\s]?){1,}$/, {
    message: "Please enter a valid phone number.",
  }),
  adults: z.string().refine((value) => {
    const num = parseInt(value, 10);
    return !isNaN(num) && num > 0;
  }, {
    message: "Number of adults must be greater than 0.",
  }),
  children: z.string().optional(),
  checkIn: z.date({
    required_error: "A date of checkIn is required.",
  }),
  checkOut: z.date({
    required_error: "A date of checkOut is required.",
  }),
  message: z.string().optional(),
})

const HotelDetails = () => {
  const { hotelId } = useParams<{ hotelId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [hotel, setHotel] = useState<Hotel | undefined>(undefined);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const { toast } = useToast()

  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      adults: "1",
      children: "0",
      checkIn: new Date(),
      checkOut: new Date(),
      message: "",
    },
  })

  function onSubmit(values: z.infer<typeof bookingSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 font-mono text-white">
          <code className="break-words">{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
    })
  }

  useEffect(() => {
    if (hotelId) {
      const foundHotel = hotels.find(hotel => hotel.id === hotelId);
      if (foundHotel) {
        setHotel(foundHotel);
      } else {
        navigate('/hotels');
      }
    }
  }, [hotelId, navigate]);

  if (!hotel) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <span className="loading loading-spinner text-india-orange loading-lg"></span>
        </div>
      </Layout>
    );
  }

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room);
    setSelectedImages(room.images);
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
        className="max-w-5xl mx-auto px-4 py-8"
      >
        <Button variant="ghost" onClick={() => navigate('/hotels')} className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Hotels
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="relative rounded-xl overflow-hidden shadow-md">
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="inline-block px-3 py-1 bg-india-orange/90 text-white rounded-full text-sm font-medium">
                  {hotel.rating} <Star size={14} className="inline-block align-text-top" />
                </span>
              </div>
              <div className="absolute bottom-0 left-0 p-4 w-full bg-gradient-to-t from-black/80 to-transparent">
                <h1 className="text-2xl font-bold text-white">{hotel.name}</h1>
                <div className="flex items-center text-gray-300 mt-1">
                  <MapPin size={16} className="mr-1" />
                  <span>{hotel.location}, {hotel.state}</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold">Hotel Overview</h2>
              <p className="text-muted-foreground mt-2">{hotel.description}</p>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold">Amenities</h2>
              <ul className="mt-2 list-disc list-inside text-muted-foreground">
                {hotel.amenities.map((amenity, index) => (
                  <li key={index}>{amenity}</li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold">Contact Information</h2>
              <div className="mt-2 text-muted-foreground">
                <div className="flex items-center">
                  <Phone size={16} className="mr-2" />
                  <span>{hotel.contact}</span>
                </div>
                <div className="flex items-center mt-1">
                  <Link size={16} className="mr-2" />
                  <a href={hotel.website} target="_blank" rel="noopener noreferrer" className="text-india-orange hover:underline">
                    Visit Website
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">View Gallery</Button>
                </DialogTrigger>
                <ImageGallery 
                  images={hotel.images} 
                  name={hotel.name}
                  onClose={() => {}}
                />
              </Dialog>
            </div>
          </div>

          <div>
            <div className="shadow-md rounded-xl overflow-hidden">
              <div className="px-4 py-5 sm:px-6 bg-muted">
                <h3 className="text-lg font-medium leading-6">Rooms & Pricing</h3>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                  Explore our available rooms and select the perfect one for your stay.
                </p>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {hotel.rooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={{
                      ...room,
                      beds: room.beds || 1 // Add the missing beds property with a default value
                    }}
                    onClick={() => handleRoomSelect(room)}
                  />
                ))}
              </div>
              {selectedRoom && (
                <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:px-6">
                  <h4 className="text-md font-semibold">Selected Room: {selectedRoom.name}</h4>
                  <p className="text-muted-foreground mt-1">{selectedRoom.description}</p>
                  <p className="text-india-orange font-semibold mt-2">Price: ₹{selectedRoom.price}</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="mt-4">View Room Images</Button>
                    </DialogTrigger>
                    <ImageGallery
                      images={selectedImages} 
                      name="Room Images"
                      onClose={() => setSelectedImages([])}
                    />
                  </Dialog>
                </div>
              )}
            </div>
            <div className="mt-6 shadow-md rounded-xl overflow-hidden">
              <div className="px-4 py-5 sm:px-6 bg-muted">
                <h3 className="text-lg font-medium leading-6">Booking Form</h3>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                  Fill in your details to book your stay at {hotel.name}.
                </p>
              </div>
              <div className="px-4 py-5">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-4">
                      <FormField
                        control={form.control}
                        name="adults"
                        render={({ field }) => (
                          <FormItem className="w-1/2">
                            <FormLabel>Adults</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                                  <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="children"
                        render={({ field }) => (
                          <FormItem className="w-1/2">
                            <FormLabel>Children (Optional)</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Array.from({ length: 10 }, (_, i) => i).map((num) => (
                                  <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex gap-4">
                      <FormField
                        control={form.control}
                        name="checkIn"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Check In</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-[240px] pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date < new Date()
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="checkOut"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Check Out</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-[240px] pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date < new Date()
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter any special requests or questions"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Book Now</Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default HotelDetails;
