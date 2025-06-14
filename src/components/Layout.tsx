
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useLocation } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import BackToHome from './BackToHome';

const Layout = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Don't show BackToHome on the home page itself
  const showBackToHome = location.pathname !== '/';

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
      <footer className={`py-6 border-t ${theme === 'dark' ? 'border-gray-800 bg-gray-900/50' : 'border-border bg-secondary/50'} backdrop-blur-sm`}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Indian Cultural Explorer. All rights reserved.
          </p>
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-full ${theme === 'dark' ? 'bg-gray-800 text-yellow-300' : 'bg-secondary text-indigo-600'} hover:opacity-80 transition-colors`}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
