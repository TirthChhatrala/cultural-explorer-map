
import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import EnhancedMap from '../components/EnhancedMap'; 
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <section className="mb-24 mt-8">
        <div className="flex flex-col lg:flex-row items-center gap-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
            className="lg:w-1/2 text-center lg:text-left"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
              Explore the Rich <span className="text-india-orange">Cultural Heritage</span> of India
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl lg:max-w-none mx-auto lg:mx-0">
              Dive into the diverse traditions, festivals, landmarks, and history of each state in India through our interactive guide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-india-orange hover:bg-india-orange/90 text-white"
                onClick={() => navigate('/state/gujarat')}
              >
                Start Exploring
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/about')}
              >
                Learn More
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:w-1/2"
          >
            <EnhancedMap />
          </motion.div>
        </div>
      </section>
      
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="mb-24"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Featured Cultural Highlights</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Discover the most iconic cultural elements from across India's diverse states</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredHighlights.map((highlight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="group cursor-pointer"
              onClick={() => navigate(highlight.link)}
            >
              <div className="relative h-64 rounded-xl overflow-hidden mb-4">
                <img 
                  src={highlight.image} 
                  alt={highlight.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <span className="px-2 py-1 bg-india-orange/90 text-white text-xs rounded-full">
                    {highlight.category}
                  </span>
                  <h3 className="text-white font-display font-semibold text-xl mt-2">{highlight.title}</h3>
                </div>
              </div>
              <p className="text-muted-foreground line-clamp-2">{highlight.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </Layout>
  );
};

const featuredHighlights = [
  {
    title: "The Great Rann of Kutch",
    description: "A stunning white salt desert that transforms into a surreal landscape, especially during the Rann Utsav festival.",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    category: "Festival",
    link: "/festivals"
  },
  {
    title: "Kerala's Backwaters",
    description: "A network of lagoons, lakes, and canals paralleling the Arabian Sea coast, best explored via traditional houseboats.",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    category: "Natural Wonder",
    link: "/state/kerala"
  },
  {
    title: "Taj Mahal",
    description: "An ivory-white marble mausoleum commissioned by Mughal emperor Shah Jahan, a symbol of eternal love.",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    category: "Monument",
    link: "/state/uttarpradesh"
  },
  {
    title: "Konark Sun Temple",
    description: "A 13th-century temple dedicated to the sun god, known for its exquisite stone carvings and architectural grandeur.",
    image: "https://images.unsplash.com/photo-1589308140669-870987f3ebdd?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    category: "Temple",
    link: "/state/odisha"
  },
  {
    title: "Freedom Fighters Legacy",
    description: "Discover the stories of brave individuals who fought for India's independence and shaped the nation's destiny.",
    image: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    category: "History",
    link: "/freedom-fighters"
  },
  {
    title: "Political Landscape",
    description: "Explore the complex political ecosystem of the world's largest democracy and its diverse regional parties.",
    image: "https://images.unsplash.com/photo-1604880050467-8d450f5358fd?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    category: "Politics",
    link: "/political-parties"
  }
];

export default Index;
