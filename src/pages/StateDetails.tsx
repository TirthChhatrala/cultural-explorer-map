
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import StateCard from '../components/StateCard';
import { getStateById } from '../data/states';
import { motion } from 'framer-motion';

const StateDetails = () => {
  const { stateId } = useParams();
  const navigate = useNavigate();
  const state = getStateById(stateId);

  useEffect(() => {
    if (!state) {
      navigate('/');
    }
    
    window.scrollTo(0, 0);
  }, [state, navigate]);

  if (!state) return null;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
            className="relative h-[40vh] rounded-xl overflow-hidden mb-8"
          >
            <div className="absolute inset-0 bg-black/30 z-10" />
            <img 
              src={state.image} 
              alt={state.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
              <span className="inline-block px-3 py-1 bg-india-orange text-white rounded-full text-sm font-medium mb-3">
                {state.capital}
              </span>
              <h1 className="text-4xl md:text-5xl text-white font-display font-bold mb-2 tracking-tight">
                {state.name}
              </h1>
              <p className="text-white/90 text-lg max-w-2xl">
                {state.description}
              </p>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <StateCard 
              title="History"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-history">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                  <path d="M12 7v5l4 2"/>
                </svg>
              }
              delay={0.1}
            >
              <p className="text-gray-700 leading-relaxed">{state.history}</p>
            </StateCard>
            
            <StateCard 
              title="Cuisine"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-utensils">
                  <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
                  <path d="M7 2v20"/>
                  <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Z"/>
                </svg>
              }
              delay={0.2}
            >
              <p className="text-gray-700 leading-relaxed">{state.cuisine}</p>
            </StateCard>
            
            <StateCard 
              title="Culture"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-music">
                  <path d="M9 18V5l12-2v13"/>
                  <circle cx="6" cy="18" r="3"/>
                  <circle cx="18" cy="16" r="3"/>
                </svg>
              }
              delay={0.3}
            >
              <p className="text-gray-700 leading-relaxed">{state.culture}</p>
            </StateCard>
            
            <StateCard 
              title="Traditional Clothing"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shirt">
                  <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
                </svg>
              }
              delay={0.4}
            >
              <p className="text-gray-700 leading-relaxed">{state.clothing}</p>
            </StateCard>
            
            <StateCard 
              title="Weather"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cloud-sun">
                  <path d="M12 2v2"/>
                  <path d="m4.93 4.93 1.41 1.41"/>
                  <path d="M20 12h2"/>
                  <path d="m19.07 4.93-1.41 1.41"/>
                  <path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"/>
                  <path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"/>
                </svg>
              }
              delay={0.5}
            >
              <p className="text-gray-700 leading-relaxed">{state.weather}</p>
            </StateCard>
            
            <StateCard 
              title="Famous For"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              }
              delay={0.6}
            >
              <ul className="space-y-2">
                {state.famousFor.map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-india-orange"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </StateCard>
          </div>
          
          <section className="mt-16">
            <div className="text-center mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
              >
                <h2 className="text-3xl font-display font-semibold mb-4">
                  Popular Tourist Attractions
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Explore the must-visit places in {state.name}
                </p>
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {state.attractions.map((attraction, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    ease: [0.19, 1, 0.22, 1], 
                    delay: 0.1 * index 
                  }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={attraction.image} 
                      alt={attraction.name} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-display font-semibold">{attraction.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{attraction.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
          
          <div className="mt-12 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-secondary text-foreground rounded-full font-medium hover:bg-secondary/80 transition-colors"
              onClick={() => navigate('/')}
            >
              Back to Map
            </motion.button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StateDetails;
