
import React, { useEffect } from 'react';
import AdminHeader from '../components/AdminHeader';
import { motion } from 'framer-motion';
import { 
  MapPin, Info, Newspaper, Calendar, Users, User, 
  Shield, LogOut, Plus, Edit, Trash, Image, Upload,
  Percent, Utensils, CloudSun, Shirt, Landmark, Book
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';

const AdminDashboard = () => {
  const { theme } = useTheme();
  const { user, isAdmin, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Redirect if not logged in as admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
      toast({
        title: "Admin Access Required",
        description: "You must be logged in as an admin to view this page",
        variant: "destructive"
      });
    }
  }, [isAdmin, navigate, toast]);

  const adminSections = [
    {
      title: "States Management",
      description: "Add, edit, or remove state information",
      icon: <MapPin size={24} />,
      link: "/admin/states",
      action: "Manage States"
    },
    {
      title: "Image Gallery",
      description: "Upload and manage images for states and attractions",
      icon: <Image size={24} />,
      link: "/admin/images",
      action: "Manage Images"
    },
    {
      title: "News Management",
      description: "Add, edit, or remove news articles",
      icon: <Newspaper size={24} />,
      link: "/admin/news",
      action: "Manage News"
    },
    {
      title: "Festivals & Events",
      description: "Update festival information and dates",
      icon: <Calendar size={24} />,
      link: "/admin/festivals",
      action: "Manage Events"
    },
    {
      title: "Political Parties",
      description: "Edit political party information",
      icon: <Users size={24} />,
      link: "/admin/political-parties",
      action: "Manage Parties"
    },
    {
      title: "Freedom Fighters",
      description: "Add or edit freedom fighter profiles",
      icon: <Shield size={24} />,
      link: "/admin/freedom-fighters",
      action: "Manage Profiles"
    },
    {
      title: "Trip Management",
      description: "Manage trip requests, packages and discounts",
      icon: <Percent size={24} />,
      link: "/admin/trips",
      action: "Manage Trips"
    },
    {
      title: "Cultural Information",
      description: "Manage cultural and local information content",
      icon: <Book size={24} />,
      link: "/cultural-information",
      action: "Manage Content"
    }
  ];

  const culturalSections = [
    {
      title: "Cuisine & Food",
      description: "Manage information about regional cuisines",
      icon: <Utensils size={24} />,
      link: "/cuisine-food",
    },
    {
      title: "Tourist Attractions",
      description: "Update tourist attraction details",
      icon: <MapPin size={24} />,
      link: "/tourist-attractions",
    },
    {
      title: "Weather Patterns",
      description: "Edit regional climate information",
      icon: <CloudSun size={24} />,
      link: "/weather-patterns",
    },
    {
      title: "Traditional Clothing",
      description: "Manage data about regional attire",
      icon: <Shirt size={24} />,
      link: "/traditional-clothing",
    },
    {
      title: "Historical Sites",
      description: "Edit information about historical monuments",
      icon: <Landmark size={24} />,
      link: "/historical-sites",
    }
  ];

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your admin account",
    });
    navigate('/');
  };
  
  if (!isAdmin) return null;
  
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <AdminHeader />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <section className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-sm font-medium mb-4">
              Admin Area
            </span>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Manage all aspects of the Indian Cultural Explorer platform
            </p>
          </motion.div>
        </section>
        
        <section className="mb-10">
          <div className={`rounded-xl p-8 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500`}>
                  <User size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-semibold">Administrator</h2>
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
        
        <h2 className="text-2xl font-display font-semibold mb-6">Admin Controls</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {adminSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`block h-full p-6 rounded-xl ${
                theme === 'dark' 
                  ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700' 
                  : 'bg-white hover:bg-gray-50 border border-gray-200'
              } transition-all duration-300 shadow-sm hover:shadow`}
            >
              <div className={`w-12 h-12 mb-4 rounded-full flex items-center justify-center ${
                theme === 'dark' ? 'bg-gray-700 text-red-400' : 'bg-red-500/10 text-red-500'
              }`}>
                {section.icon}
              </div>
              <h3 className="text-xl font-display font-semibold mb-2">{section.title}</h3>
              <p className="text-muted-foreground mb-4">{section.description}</p>
              <button 
                onClick={() => navigate(section.link)}
                className="mt-2 flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm transition-colors"
              >
                <Plus size={16} />
                {section.action}
              </button>
            </motion.div>
          ))}
        </div>

        <section className="mb-16">
          <h2 className="text-2xl font-display font-semibold mb-6">Cultural Information Sections</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {culturalSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => navigate(section.link)}
                className={`cursor-pointer p-4 rounded-xl flex flex-col items-center text-center ${
                  theme === 'dark' 
                    ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700' 
                    : 'bg-white hover:bg-gray-50 border border-gray-200'
                } transition-all duration-300 shadow-sm hover:shadow`}
              >
                <div className={`w-10 h-10 mb-3 rounded-full flex items-center justify-center ${
                  theme === 'dark' ? 'bg-gray-700 text-red-400' : 'bg-red-500/10 text-red-500'
                }`}>
                  {section.icon}
                </div>
                <h3 className="font-semibold mb-1">{section.title}</h3>
                <p className="text-xs text-muted-foreground">{section.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className={`rounded-xl p-8 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow-lg text-center`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h3 className="text-2xl font-display font-semibold mb-3">Website Statistics</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                Access comprehensive analytics, user engagement metrics, traffic statistics, and monitoring dashboard from the Trip Management section.
              </p>
              <button 
                onClick={() => navigate('/admin/trips')}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
              >
                View Analytics Dashboard
              </button>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
