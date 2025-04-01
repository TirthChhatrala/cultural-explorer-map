
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
              title="Basic Information"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4"/>
                  <path d="M12 8h.01"/>
                </svg>
              }
              delay={0.1}
            >
              <div className="space-y-2">
                <p className="flex justify-between"><span className="font-medium">Population:</span> <span>{state.population}</span></p>
                <p className="flex justify-between"><span className="font-medium">Area:</span> <span>{state.area}</span></p>
                <p className="flex justify-between"><span className="font-medium">Language:</span> <span>{state.language}</span></p>
              </div>
            </StateCard>
            
            <StateCard 
              title="Famous For"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              }
              delay={0.2}
            >
              <p className="text-gray-700 leading-relaxed font-cursive">{state.famousFor}</p>
            </StateCard>
            
            <StateCard 
              title="Capital City"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-landmark">
                  <line x1="3" x2="21" y1="22" y2="22"/>
                  <line x1="6" x2="6" y1="18" y2="22"/>
                  <line x1="10" x2="10" y1="18" y2="22"/>
                  <line x1="14" x2="14" y1="18" y2="22"/>
                  <line x1="18" x2="18" y1="18" y2="22"/>
                  <polygon points="12 2 20 7 20 16 4 16 4 7"/>
                </svg>
              }
              delay={0.3}
            >
              <p className="text-gray-700 leading-relaxed font-serif">The capital city of {state.name} is {state.capital}, serving as the administrative headquarters of the state.</p>
            </StateCard>
            
            <StateCard 
              title="Freedom Fighters"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-flag">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
                  <line x1="4" x2="4" y1="22" y2="15"/>
                </svg>
              }
              delay={0.4}
            >
              <ul className="space-y-2">
                {state.freedomFighters.map((fighter, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-india-orange"></div>
                    <span className="font-cursive">{fighter}</span>
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
                  About {state.name}
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto font-cursive">
                  Learn more about this beautiful state
                </p>
              </motion.div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 mb-8">
              <h3 className="text-xl font-display font-semibold mb-4">Overview</h3>
              <p className="text-gray-700 leading-relaxed mb-4 font-serif">{state.description}</p>
              
              <div className="mt-6">
                <h4 className="text-lg font-display font-medium mb-2">Key Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-secondary/10 p-4 rounded-lg">
                    <h5 className="font-medium text-india-orange mb-2">Geography</h5>
                    <p className="text-sm font-cursive">Area of {state.area} with diverse landscapes.</p>
                  </div>
                  <div className="bg-secondary/10 p-4 rounded-lg">
                    <h5 className="font-medium text-india-orange mb-2">Demographics</h5>
                    <p className="text-sm font-cursive">Home to approximately {state.population} people.</p>
                  </div>
                  <div className="bg-secondary/10 p-4 rounded-lg">
                    <h5 className="font-medium text-india-orange mb-2">Culture</h5>
                    <p className="text-sm font-cursive">Rich cultural heritage with {state.language} as primary language.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          <div className="mt-12 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-india-orange text-white rounded-full font-medium hover:bg-india-orange/80 transition-colors"
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
