
import React from 'react';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Info, Newspaper, Calendar, Users, Shield, User, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';

const Dashboard = () => {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
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

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    navigate('/');
  };
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4">
        <section className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Welcome to Your Dashboard, {user?.name}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore the diverse cultural heritage of India through our various sections
            </p>
          </motion.div>
        </section>
        
        <section className="mb-12">
          <div className={`rounded-xl p-8 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow-lg mb-8`}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full bg-india-orange/10 flex items-center justify-center text-india-orange`}>
                  <User size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-semibold">{user?.name}</h2>
                  <p className="text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                <LogOut size={18} />
                Log Out
              </motion.button>
            </div>
          </div>
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
        
        <section className="mb-16">
          <div className={`rounded-xl p-8 ${
            theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
          } shadow-lg text-center`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h3 className="text-2xl font-display font-semibold mb-3">Need Help?</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                If you have any questions or need assistance, our support team is always ready to help.
              </p>
              <button className="px-6 py-3 bg-india-orange text-white rounded-lg font-medium hover:bg-india-orange/90 transition-colors">
                Contact Support
              </button>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Dashboard;
