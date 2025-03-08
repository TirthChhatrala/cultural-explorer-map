
import React from 'react';
import Layout from '../components/Layout';
import Map from '../components/Map';
import { motion } from 'framer-motion';

const Index = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <section className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
          >
            <span className="inline-block px-3 py-1 bg-india-orange/10 text-india-orange rounded-full text-sm font-medium mb-4">
              Explore India's Cultural Heritage
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 tracking-tight">
              Discover the Beauty of <span className="text-india-orange">India</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Embark on a virtual journey through India's diverse states, each with its unique history, cuisine, and cultural traditions.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1], delay: 0.3 }}
            className="mt-8 flex justify-center gap-4"
          >
            <button className="px-6 py-3 bg-india-orange text-white rounded-full font-medium hover:bg-india-orange/90 transition-colors">
              Start Exploring
            </button>
            <button className="px-6 py-3 bg-white border border-gray-200 rounded-full font-medium hover:bg-gray-50 transition-colors">
              Learn More
            </button>
          </motion.div>
        </section>
        
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-semibold mb-2">
              Interactive Map of India
            </h2>
            <p className="text-muted-foreground">
              Click on any state to discover its rich cultural heritage
            </p>
          </div>
          
          <Map />
        </section>
        
        <section className="mt-24 mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
          >
            <span className="inline-block px-3 py-1 bg-secondary rounded-full text-sm font-medium mb-4">
              Cultural Diversity
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-semibold mb-6">
              Why Explore Indian Culture?
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <Feature 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-history">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                  <path d="M12 7v5l4 2"/>
                </svg>
              }
              title="Rich History"
              description="Explore thousands of years of fascinating history across diverse regions and civilizations."
              delay={0.1}
            />
            
            <Feature 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-utensils">
                  <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
                  <path d="M7 2v20"/>
                  <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Z"/>
                </svg>
              }
              title="Culinary Delights"
              description="Discover the diverse flavors and cooking techniques that make Indian cuisine world-famous."
              delay={0.2}
            />
            
            <Feature 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shirt">
                  <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
                </svg>
              }
              title="Traditional Clothing"
              description="Learn about the colorful and diverse traditional attire from different states of India."
              delay={0.3}
            />
          </div>
        </section>
      </div>
    </Layout>
  );
};

const Feature = ({ icon, title, description, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        ease: [0.19, 1, 0.22, 1], 
        delay 
      }}
      className="bg-white p-6 rounded-xl shadow-sm"
    >
      <div className="w-12 h-12 rounded-full bg-india-orange/10 flex items-center justify-center text-india-orange mb-4 mx-auto">
        {icon}
      </div>
      <h3 className="text-xl font-display font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
};

export default Index;
