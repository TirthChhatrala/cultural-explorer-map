
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useLocation, Link } from 'react-router-dom';
import { Sun, Moon, MapPin, Plane, Building, Utensils, Newspaper, Calendar, Shield, Users, Phone, Mail, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import BackToHome from './BackToHome';

const Layout = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const showBackToHome = location.pathname !== '/';

  const quickLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/trips', label: 'Trip Packages' },
    { path: '/hotels', label: 'Hotels' },
    { path: '/casinos', label: 'Casinos' },
    { path: '/booking', label: 'Booking' },
  ];

  const exploreLinks = [
    { path: '/political-parties', label: 'Political Parties' },
    { path: '/freedom-fighters', label: 'Freedom Fighters' },
    { path: '/festivals', label: 'Festivals & Events' },
    { path: '/news', label: 'Latest News' },
    { path: '/cuisine-food', label: 'Cuisine & Food' },
    { path: '/cultural-information', label: 'Cultural Info' },
  ];

  const travelLinks = [
    { path: '/tourist-attractions', label: 'Tourist Attractions' },
    { path: '/historical-sites', label: 'Historical Sites' },
    { path: '/weather-patterns', label: 'Weather Patterns' },
    { path: '/traditional-clothing', label: 'Traditional Clothing' },
    { path: '/my-trips', label: 'My Bookings' },
    { path: '/payment-history', label: 'Payment History' },
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-page-gradient'}`}>
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'url(/lovable-uploads/87e03e01-1cae-414e-8e9d-f0e1eb9b6b92.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: -1
        }}
      />
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
        className="container mx-auto px-4 py-8 pt-28 min-h-screen"
      >
        {children}
      </motion.main>
      {showBackToHome && <BackToHome />}
      
      {/* Enhanced Footer */}
      <footer className={`border-t ${theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-border bg-gray-50'}`}>
        {/* Main Footer */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 mr-3 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">ICE</span>
                </div>
                <span className="font-display font-bold text-xl">Indian Cultural Explorer</span>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                Discover the rich cultural heritage of India. Explore states, festivals, historical sites, and plan unforgettable trips across the country.
              </p>
              <div className="flex gap-3">
                {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                  <a key={i} href="#" className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                    theme === 'dark' ? 'bg-gray-800 hover:bg-orange-500 text-gray-400 hover:text-white' : 'bg-gray-200 hover:bg-orange-500 text-gray-600 hover:text-white'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-display font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {quickLinks.map(link => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-muted-foreground hover:text-orange-500 text-sm transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Explore India */}
            <div>
              <h3 className="font-display font-semibold text-lg mb-4">Explore India</h3>
              <ul className="space-y-2">
                {exploreLinks.map(link => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-muted-foreground hover:text-orange-500 text-sm transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Travel & Contact */}
            <div>
              <h3 className="font-display font-semibold text-lg mb-4">Travel & Support</h3>
              <ul className="space-y-2 mb-6">
                {travelLinks.map(link => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-muted-foreground hover:text-orange-500 text-sm transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 text-orange-500" />
                  <span>+91-800-123-4567</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 text-orange-500" />
                  <span>support@indianculturalexplorer.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Indian Cultural Explorer. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/about" className="text-xs text-muted-foreground hover:text-orange-500">Privacy Policy</Link>
              <Link to="/about" className="text-xs text-muted-foreground hover:text-orange-500">Terms of Service</Link>
              <Link to="/contact" className="text-xs text-muted-foreground hover:text-orange-500">Contact Us</Link>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-800 text-yellow-300' : 'bg-secondary text-indigo-600'} hover:opacity-80 transition-colors`}
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
