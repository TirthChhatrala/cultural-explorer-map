
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useTheme } from '../context/ThemeContext';
import { MapPin, Search, Star, Dice1 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface Casino {
  id: string;
  name: string;
  description: string;
  location: string;
  state: string;
  price: number;
  rating: number;
  amenities: string[];
  image: string;
  games: string[];
}

const casinos: Casino[] = [
  {
    id: "casino1",
    name: "Deltin Royale",
    description: "India's largest floating casino with premium gaming and entertainment",
    location: "Panjim",
    state: "goa",
    price: 4000,
    rating: 4.5,
    amenities: ["Gaming Tables", "Slot Machines", "Restaurants", "Live Entertainment", "VIP Rooms"],
    image: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?q=80&w=1000&auto=format&fit=crop",
    games: ["Poker", "Blackjack", "Roulette", "Baccarat", "Slots"]
  },
  {
    id: "casino2",
    name: "Casino Pride",
    description: "Exciting casino experience with stunning river views",
    location: "Panjim",
    state: "goa",
    price: 3500,
    rating: 4.3,
    amenities: ["Gaming Tables", "Slot Machines", "Bar", "Restaurant", "Live Music"],
    image: "https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?q=80&w=1000&auto=format&fit=crop",
    games: ["Poker", "Blackjack", "Roulette", "Teen Patti", "Slots"]
  },
  {
    id: "casino3",
    name: "Big Daddy Casino",
    description: "Premium gaming destination with luxury amenities",
    location: "Panjim",
    state: "goa",
    price: 3000,
    rating: 4.2,
    amenities: ["Gaming Tables", "Slot Machines", "Fine Dining", "Bar", "Private Gaming Areas"],
    image: "https://images.unsplash.com/photo-1518433324253-3f2439736ad9?q=80&w=1000&auto=format&fit=crop",
    games: ["Poker", "Blackjack", "Roulette", "Andar Bahar", "Slots"]
  }
];

const Casinos = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredCasinos = casinos.filter(casino =>
    casino.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    casino.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    casino.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCasinoClick = (casinoId: string) => {
    navigate(`/casinos/${casinoId}`);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
        >
          <section className="text-center py-16">
            <span className="inline-block px-3 py-1 bg-india-orange/10 text-india-orange rounded-full text-sm font-medium mb-4">
              Gaming & Entertainment
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 tracking-tight">
              Premium <span className="text-india-orange">Casino</span> Experience
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover India's finest casinos and gaming destinations. Book your gaming experience instantly!
            </p>
            
            <div className="mt-8 max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    type="text"
                    placeholder="Search casinos, locations, games..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
                <Button className="h-12 bg-india-orange hover:bg-india-orange/90">
                  Search
                </Button>
              </div>
            </div>
          </section>
        </motion.div>

        <div className="pb-16">
          <div className="flex justify-between items-center mb-6">
            <p className="text-muted-foreground">
              {filteredCasinos.length} {filteredCasinos.length === 1 ? 'casino' : 'casinos'} found
            </p>
          </div>
          
          {filteredCasinos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCasinos.map((casino, index) => (
                <motion.div
                  key={casino.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl" onClick={() => handleCasinoClick(casino.id)}>
                    <div className="relative">
                      <img 
                        src={casino.image} 
                        alt={casino.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="absolute top-3 left-3 bg-india-orange text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Dice1 className="h-3 w-3" />
                        Gaming
                      </div>
                    </div>
                    
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{casino.name}</CardTitle>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm">{casino.rating}</span>
                        </div>
                      </div>
                      <CardDescription className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {casino.location}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{casino.description}</p>
                      
                      <div className="mb-3">
                        <h4 className="text-sm font-medium mb-1">Popular Games:</h4>
                        <div className="flex flex-wrap gap-1">
                          {casino.games.slice(0, 3).map((game, idx) => (
                            <span key={idx} className="text-xs bg-muted px-2 py-1 rounded">
                              {game}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-india-orange">
                          ₹{casino.price.toLocaleString()}
                        </span>
                        <span className="text-xs text-muted-foreground">per person</span>
                      </div>
                    </CardContent>
                    
                    <CardFooter>
                      <Button className="w-full">
                        Book Experience
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold mb-2">No casinos found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or browse all available options.
              </p>
              <Button 
                variant="outline" 
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Casinos;
