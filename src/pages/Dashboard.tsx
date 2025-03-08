
import React from 'react';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Info, Newspaper, Calendar, Users, Shield } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Dashboard = () => {
  const { theme } = useTheme();
  
  const pageLinks = [
    {
      title: "Map Explorer",
      description: "Explore all Indian states through our interactive map",
      icon: <MapPin size={24} />,
      link: "/",
    },
    {
      title: "About Us",
      description: "Learn about our mission and team",
      icon: <Info size={24} />,
      link: "/about",
    },
    {
      title: "News",
      description: "Latest news from across India",
      icon: <Newspaper size={24} />,
      link: "/news",
    },
    {
      title: "Festivals & Events",
      description: "Discover cultural celebrations across states",
      icon: <Calendar size={24} />,
      link: "/festivals",
    },
    {
      title: "Political Parties",
      description: "Information about India's major political parties",
      icon: <Users size={24} />,
      link: "/political-parties",
    },
    {
      title: "Freedom Fighters",
      description: "Heroes who fought for India's independence",
      icon: <Shield size={24} />,
      link: "/freedom-fighters",
    },
  ];
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <section className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Welcome to Your Dashboard
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore the diverse cultural heritage of India through our various sections
            </p>
          </motion.div>
        </section>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {pageLinks.map((page, index) => (
            <motion.div
              key={page.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link 
                to={page.link}
                className={`block h-full p-6 rounded-xl ${
                  theme === 'dark' 
                    ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700' 
                    : 'bg-white hover:bg-gray-50 border border-gray-200'
                } transition-all duration-300 shadow-sm hover:shadow`}
              >
                <div className={`w-12 h-12 mb-4 rounded-full flex items-center justify-center ${
                  theme === 'dark' ? 'bg-gray-700 text-india-orange' : 'bg-india-orange/10 text-india-orange'
                }`}>
                  {page.icon}
                </div>
                <h3 className="text-xl font-display font-semibold mb-2">{page.title}</h3>
                <p className="text-muted-foreground">{page.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
