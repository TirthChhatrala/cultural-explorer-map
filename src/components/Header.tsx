
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ease-out-expo ${
        scrolled ? 'py-4 bg-white/80 backdrop-blur-md shadow-sm' : 'py-6 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group">
          <motion.div 
            className="w-8 h-8 bg-india-orange rounded-full"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
          />
          <div>
            <h1 className="text-xl font-display font-bold tracking-tight group-hover:text-india-orange transition-colors">
              Indian Cultural Explorer
            </h1>
            <p className="text-xs text-muted-foreground">Discover the beauty of India's heritage</p>
          </div>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink to="/" label="Home" active={isHome} />
          <NavLink to="/about" label="About" active={location.pathname === '/about'} />
          <NavLink to="/gallery" label="Gallery" active={location.pathname === '/gallery'} />
        </nav>
        
        <motion.button
          className="md:hidden w-10 h-10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu">
            <line x1="4" x2="20" y1="12" y2="12"/>
            <line x1="4" x2="20" y1="6" y2="6"/>
            <line x1="4" x2="20" y1="18" y2="18"/>
          </svg>
        </motion.button>
      </div>
    </header>
  );
};

const NavLink = ({ to, label, active }) => {
  return (
    <Link 
      to={to} 
      className={`relative text-sm font-medium transition-colors hover:text-india-orange ${
        active ? 'text-india-orange' : 'text-foreground'
      }`}
    >
      {label}
      {active && (
        <motion.div 
          layoutId="activeIndicator"
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-india-orange rounded-full"
          transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
        />
      )}
    </Link>
  );
};

export default Header;
