
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Info, Newspaper, Calendar, Users, User, Shield, LogOut, Settings } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { theme } = useTheme();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { toast } = useToast();

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

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
  };

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ease-out-expo ${
        scrolled 
          ? theme === 'dark'
            ? 'py-4 bg-gray-900/80 backdrop-blur-md shadow-md shadow-black/10'
            : 'py-4 bg-white/80 backdrop-blur-md shadow-sm'
          : 'py-6 bg-transparent'
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
          <NavLink to="/freedom-fighters" label="Freedom Fighters" icon={<Shield className="w-4 h-4" />} active={location.pathname === '/freedom-fighters'} />
        </nav>
        
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="relative">
              <motion.button
                className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                  theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                } transition-colors`}
                onClick={toggleUserMenu}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={`w-8 h-8 rounded-full ${isAdmin ? 'bg-red-500/10 text-red-500' : 'bg-india-orange/10 text-india-orange'} flex items-center justify-center`}>
                  <User size={16} />
                </div>
                <span className="font-medium text-sm">{isAdmin ? 'Admin' : user?.name.split(' ')[0]}</span>
              </motion.button>
              
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg overflow-hidden ${
                    theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
                  }`}
                >
                  <div className="p-3 border-b border-gray-700/20">
                    <p className="font-medium text-sm">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  
                  {isAdmin ? (
                    <Link 
                      to="/admin" 
                      className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                        theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings size={14} className="mr-2" />
                      Admin Dashboard
                    </Link>
                  ) : (
                    <Link 
                      to="/dashboard" 
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  
                  <button 
                    className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                      theme === 'dark' ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-gray-50 text-red-500'
                    }`}
                    onClick={handleLogout}
                  >
                    <LogOut size={14} className="mr-2" />
                    Log out
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium hover:text-india-orange transition-colors">Login</Link>
              <Link to="/signup" className="px-4 py-2 bg-india-orange text-white rounded-full text-sm font-medium hover:bg-india-orange/90 transition-colors">Sign Up</Link>
            </>
          )}
        </div>
        
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

      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={`md:hidden ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} shadow-lg`}
        >
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-3">
            <MobileNavLink to="/" label="Home" icon={<MapPin className="w-5 h-5" />} active={isHome} onClick={() => setMobileMenuOpen(false)} />
            <MobileNavLink to="/about" label="About Us" icon={<Info className="w-5 h-5" />} active={location.pathname === '/about'} onClick={() => setMobileMenuOpen(false)} />
            <MobileNavLink to="/news" label="News" icon={<Newspaper className="w-5 h-5" />} active={location.pathname === '/news'} onClick={() => setMobileMenuOpen(false)} />
            <MobileNavLink to="/festivals" label="Festivals & Events" icon={<Calendar className="w-5 h-5" />} active={location.pathname === '/festivals'} onClick={() => setMobileMenuOpen(false)} />
            <MobileNavLink to="/political-parties" label="Political Parties" icon={<Users className="w-5 h-5" />} active={location.pathname === '/political-parties'} onClick={() => setMobileMenuOpen(false)} />
            <MobileNavLink to="/freedom-fighters" label="Freedom Fighters" icon={<Shield className="w-5 h-5" />} active={location.pathname === '/freedom-fighters'} onClick={() => setMobileMenuOpen(false)} />
            
            <div className="pt-3 border-t border-gray-200 flex space-x-4">
              {isAuthenticated ? (
                <>
                  {isAdmin ? (
                    <Link 
                      to="/admin" 
                      className="block px-4 py-2 w-full text-center rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  ) : (
                    <Link 
                      to="/dashboard" 
                      className="block px-4 py-2 w-full text-center rounded-lg bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  <button 
                    className="block px-4 py-2 w-full text-center rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-4 py-2 w-full text-center rounded-lg bg-secondary text-foreground hover:bg-secondary/80 transition-colors" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                  <Link to="/signup" className="block px-4 py-2 w-full text-center rounded-lg bg-india-orange text-white hover:bg-india-orange/90 transition-colors" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
};

const NavLink = ({ to, label, icon, active }) => {
  const { theme } = useTheme();
  return (
    <Link 
      to={to} 
      className={`relative flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-india-orange ${
        active ? 'text-india-orange' : theme === 'dark' ? 'text-gray-200' : 'text-foreground'
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
  const { theme } = useTheme();
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
        active 
          ? theme === 'dark'
            ? 'bg-gray-800 text-india-orange'
            : 'bg-secondary text-india-orange' 
          : theme === 'dark'
            ? 'text-gray-200 hover:bg-gray-800/50'
            : 'text-foreground hover:bg-secondary/50'
      }`}
      onClick={onClick}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
};

export default Header;
