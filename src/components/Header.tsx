
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Info, Newspaper, Calendar, Users } from 'lucide-react';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

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
        
        <nav className="hidden md:flex items-center space-x-6">
          <NavLink to="/" label="Home" icon={<MapPin className="w-4 h-4" />} active={isHome} />
          <NavLink to="/about" label="About Us" icon={<Info className="w-4 h-4" />} active={location.pathname === '/about'} />
          <NavLink to="/news" label="News" icon={<Newspaper className="w-4 h-4" />} active={location.pathname === '/news'} />
          <NavLink to="/festivals" label="Festivals & Events" icon={<Calendar className="w-4 h-4" />} active={location.pathname === '/festivals'} />
          <NavLink to="/political-parties" label="Political Parties" icon={<Users className="w-4 h-4" />} active={location.pathname === '/political-parties'} />
        </nav>
        
        <motion.button
          className="md:hidden w-10 h-10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleMobileMenu}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu">
            <line x1="4" x2="20" y1="12" y2="12"/>
            <line x1="4" x2="20" y1="6" y2="6"/>
            <line x1="4" x2="20" y1="18" y2="18"/>
          </svg>
        </motion.button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white shadow-lg"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-3">
            <MobileNavLink to="/" label="Home" icon={<MapPin className="w-5 h-5" />} active={isHome} onClick={() => setMobileMenuOpen(false)} />
            <MobileNavLink to="/about" label="About Us" icon={<Info className="w-5 h-5" />} active={location.pathname === '/about'} onClick={() => setMobileMenuOpen(false)} />
            <MobileNavLink to="/news" label="News" icon={<Newspaper className="w-5 h-5" />} active={location.pathname === '/news'} onClick={() => setMobileMenuOpen(false)} />
            <MobileNavLink to="/festivals" label="Festivals & Events" icon={<Calendar className="w-5 h-5" />} active={location.pathname === '/festivals'} onClick={() => setMobileMenuOpen(false)} />
            <MobileNavLink to="/political-parties" label="Political Parties" icon={<Users className="w-5 h-5" />} active={location.pathname === '/political-parties'} onClick={() => setMobileMenuOpen(false)} />
          </div>
        </motion.div>
      )}
    </header>
  );
};

const NavLink = ({ to, label, icon, active }) => {
  return (
    <Link 
      to={to} 
      className={`relative flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-india-orange ${
        active ? 'text-india-orange' : 'text-foreground'
      }`}
    >
      {icon}
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

const MobileNavLink = ({ to, label, icon, active, onClick }) => {
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
        active ? 'bg-secondary text-india-orange' : 'text-foreground hover:bg-secondary/50'
      }`}
      onClick={onClick}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
};

export default Header;
