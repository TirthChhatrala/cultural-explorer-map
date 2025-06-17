
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import ThemeToggle from './ThemeToggle';
import UserLinks from './UserLinks';

const Header = () => {
  const { theme } = useTheme();
  const { pathname } = useLocation();
  const { isAdmin } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Hide header on admin dashboard to avoid duplicate navbar
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return null;
  }

  const links = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/trips', label: 'Trip' },
    { path: '/cuisine-food', label: 'Cuisine' },
    { path: '/political-parties', label: 'Political Parties' },
    { path: '/freedom-fighters', label: 'Freedom Fighters' },
    { path: '/news', label: 'News' },
    { path: '/festivals', label: 'Festivals' },
    { path: '/booking', label: 'Booking' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? `${
              theme === 'dark'
                ? 'bg-gray-900/90 backdrop-blur-md border-b border-gray-800'
                : 'bg-white/90 backdrop-blur-md border-b border-gray-200'
            }`
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="h-8 w-8 mr-2 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">ICE</span>
              </div>
              <span className="font-display font-bold text-xl hidden sm:inline-block">
                Indian Cultural Explorer
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1 rounded-md ${
                  pathname === link.path
                    ? 'bg-india-orange/10 text-india-orange font-medium'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                } transition-colors`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-2">
            <UserLinks />
            <ThemeToggle />
          </div>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="md:hidden p-2"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 sm:w-80">
              <SheetHeader className="mb-4">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-3 py-4">
                {links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block py-2 ${
                      pathname === link.path
                        ? "text-india-orange font-medium"
                        : ""
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <UserLinks isMobile={true} onLinkClick={() => setMobileMenuOpen(false)} />
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex md:hidden items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
