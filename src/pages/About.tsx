
import React from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { Users, BookOpen, Map, Compass } from 'lucide-react';

const About = () => {
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
              Who We Are
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 tracking-tight">
              About <span className="text-india-orange">Us</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Dedicated to showcasing the diverse cultural heritage of India through an interactive platform.
            </p>
          </motion.div>
        </section>

        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <h2 className="text-3xl font-display font-semibold mb-6">Our Mission</h2>
              <p className="text-muted-foreground mb-6">
                Indian Cultural Explorer is dedicated to preserving and promoting the rich cultural tapestry of India. Our mission is to create an accessible, comprehensive, and engaging platform that showcases the diverse heritage of all Indian states.
              </p>
              <p className="text-muted-foreground mb-6">
                We believe that understanding cultural diversity fosters greater appreciation and respect. Through our platform, we aim to educate people about the unique traditions, histories, and contributions of each Indian state.
              </p>
              <div className="flex items-center gap-4 text-india-orange">
                <BookOpen size={24} />
                <span className="font-medium">Educate • Inspire • Connect</span>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="bg-gradient-to-r from-india-orange/10 to-india-blue/10 p-1 rounded-xl"
            >
              <div className="rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1532664189809-02133fee698d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3" 
                  alt="Cultural diversity of India"
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
            </motion.div>
          </div>
        </section>

        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-display font-semibold mb-4">What We Offer</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform provides comprehensive resources about all Indian states, their unique cultural identities, and significant contributions.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Map className="h-10 w-10" />}
              title="Interactive Exploration"
              description="Navigate through our interactive map to discover detailed information about each Indian state."
              delay={0.1}
            />
            
            <FeatureCard 
              icon={<BookOpen className="h-10 w-10" />}
              title="Cultural Resources"
              description="Access comprehensive information about the history, cuisine, festivals, and traditions of each state."
              delay={0.2}
            />
            
            <FeatureCard 
              icon={<Compass className="h-10 w-10" />}
              title="Travel Insights"
              description="Learn about attractions, best times to visit, and cultural experiences unique to each region."
              delay={0.3}
            />
          </div>
        </section>

        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-display font-semibold mb-4">Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We are a passionate team of historians, cultural researchers, and technology enthusiasts dedicated to preserving and promoting India's cultural heritage.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TeamMember
              name="Priya Sharma"
              role="Cultural Historian"
              bio="Specializes in the historical evolution of Indian states and their cultural significance."
              image="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3"
              delay={0.1}
            />
            
            <TeamMember
              name="Arjun Patel"
              role="Content Director"
              bio="Leads our content strategy and ensures accuracy and quality of all cultural information."
              image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3"
              delay={0.2}
            />
            
            <TeamMember
              name="Meera Iyer"
              role="User Experience Designer"
              bio="Creates engaging and intuitive experiences that make cultural exploration enjoyable."
              image="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3"
              delay={0.3}
            />
          </div>
        </section>

        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-india-blue/5 rounded-2xl p-8 text-center"
          >
            <Users className="w-12 h-12 text-india-blue mx-auto mb-4" />
            <h2 className="text-2xl font-display font-semibold mb-3">Join Our Community</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              We invite you to be part of our growing community of culture enthusiasts. Share your experiences, contribute your knowledge, and help us preserve India's rich heritage.
            </p>
            <button className="px-6 py-3 bg-india-blue text-white rounded-full font-medium hover:bg-india-blue/90 transition-colors">
              Get Involved
            </button>
          </motion.div>
        </section>
      </div>
    </Layout>
  );
};

const FeatureCard = ({ icon, title, description, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        ease: [0.19, 1, 0.22, 1], 
        delay 
      }}
      className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="w-16 h-16 rounded-full bg-india-orange/10 flex items-center justify-center text-india-orange mb-6 mx-auto">
        {icon}
      </div>
      <h3 className="text-xl font-display font-semibold mb-3 text-center">{title}</h3>
      <p className="text-muted-foreground text-center">{description}</p>
    </motion.div>
  );
};

const TeamMember = ({ name, role, bio, image, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        ease: [0.19, 1, 0.22, 1], 
        delay 
      }}
      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="h-64 overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-display font-semibold">{name}</h3>
        <p className="text-india-orange font-medium text-sm mb-2">{role}</p>
        <p className="text-muted-foreground text-sm">{bio}</p>
      </div>
    </motion.div>
  );
};

export default About;
