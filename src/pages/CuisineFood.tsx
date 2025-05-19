
import React from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { Utensils } from 'lucide-react';
import StateCard from '../components/StateCard';
import { useTheme } from '../context/ThemeContext';
import { states } from '../data/states';

const CuisineFood = () => {
  const { theme } = useTheme();

  // Example cuisine data - you would typically load this from an API or data file
  const cuisineData = [
    {
      state: "Punjab",
      dishes: ["Chole Bhature", "Butter Chicken", "Sarson Da Saag", "Makki Di Roti"],
      description: "Punjabi cuisine is known for its rich, buttery flavors and extensive use of dairy products."
    },
    {
      state: "Kerala",
      dishes: ["Appam", "Kerala Fish Curry", "Puttu", "Malabar Biryani"],
      description: "Kerala cuisine features coconut-infused dishes and an abundance of seafood options."
    },
    {
      state: "Gujarat",
      dishes: ["Dhokla", "Thepla", "Fafda", "Khandvi"],
      description: "Gujarati cuisine is primarily vegetarian and known for its distinctive sweet, salty, and spicy flavors."
    },
    {
      state: "West Bengal",
      dishes: ["Rasgulla", "Fish Curry", "Mishti Doi", "Sandesh"],
      description: "Bengali cuisine is known for its subtle flavors, fish dishes, and sweet delicacies."
    },
    {
      state: "Tamil Nadu",
      dishes: ["Dosa", "Idli", "Sambar", "Chettinad Chicken"],
      description: "Tamil cuisine is characterized by its use of rice, lentils and distinct flavors of tamarind, curry leaves and mustard seeds."
    }
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4">
        <section className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-sm font-medium mb-4">
              Cultural Explorer
            </span>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Cuisine & Food
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore the diverse culinary traditions across Indian states
            </p>
          </motion.div>
        </section>
        
        <section className="mb-16">
          <div className={`rounded-xl p-6 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow-lg mb-8`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                <Utensils />
              </div>
              <h2 className="text-2xl font-display font-semibold">Indian Cuisine Overview</h2>
            </div>
            <p className="text-muted-foreground">
              Indian cuisine encompasses a wide variety of regional culinary traditions, each with its own distinctive ingredients, 
              spices, and cooking methods. From the rich, creamy curries of North India to the coconut-infused dishes of the South, 
              the tangy seafood delicacies of the coastal regions to the vegetarian specialties of Gujarat, India's food reflects 
              its cultural diversity and historical influences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {cuisineData.map((cuisine, index) => (
              <StateCard 
                key={cuisine.state}
                title={cuisine.state}
                icon={<Utensils size={24} />}
                delay={index * 0.1}
                collapsible
              >
                <div className="space-y-4">
                  <p className="text-muted-foreground">{cuisine.description}</p>
                  <h3 className="font-medium text-lg">Popular Dishes</h3>
                  <ul className="space-y-2">
                    {cuisine.dishes.map((dish, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                        <span>{dish}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </StateCard>
            ))}
          </div>
        </section>
        
        <section className="mb-16">
          <h2 className="text-2xl font-display font-semibold mb-6">Explore State Cuisines</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {states.slice(0, 6).map((state) => (
              <motion.div
                key={state.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`block h-full p-6 rounded-xl ${
                  theme === 'dark' 
                    ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700' 
                    : 'bg-white hover:bg-gray-50 border border-gray-200'
                } transition-all duration-300 shadow-sm hover:shadow`}
              >
                <h3 className="text-xl font-display font-semibold mb-3">{state.name}</h3>
                <div className="h-40 mb-4 rounded-lg overflow-hidden">
                  <img 
                    src={state.image} 
                    alt={state.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-muted-foreground mb-4">
                  Explore the unique flavors of {state.name}'s traditional cuisine.
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default CuisineFood;
