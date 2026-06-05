
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
import { hasPaidAccess } from '@/lib/rewards';
import LanguageSelector from './LanguageSelector';
import { useT } from '@/context/LanguageContext';

const Header = () => {
  const { theme } = useTheme();
  const { pathname } = useLocation();
  const { isAuthenticated, user } = useAuth();
  const t = useT();
  const paid = isAuthenticated && hasPaidAccess(user?.email);
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

  const publicLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/trips', label: t('nav.trip') },
    { path: '/casinos', label: t('nav.casino') },
    { path: '/political-parties', label: t('nav.politicalParties') },
    { path: '/freedom-fighters', label: t('nav.freedomFighters') },
    { path: '/news', label: t('nav.news') },
    { path: '/festivals', label: t('nav.festivals') },
    { path: '/stories', label: 'Stories' },
    { path: '/compare-cultures', label: t('nav.compare') },
    { path: '/booking', label: t('nav.booking') },
  ];

  const rewardLinks = paid
    ? [
        { path: '/cultural-quiz', label: t('nav.quiz') },
        { path: '/rewards', label: t('nav.rewards') },
      ]
    : [];

  const allLinks = [...publicLinks, ...rewardLinks];

  // Show fewer navigation items when authenticated to make room for user menu
  const displayLinks = isAuthenticated
    ? [...publicLinks.slice(0, 5), ...rewardLinks]
    : publicLinks;

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

          <nav className="hidden lg:flex items-center space-x-1 flex-1 justify-center">
            {displayLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-2 py-1 rounded-md text-sm ${
                  pathname === link.path
                    ? 'bg-india-orange/10 text-india-orange font-medium'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                } transition-colors`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center">
            <LanguageSelector />
            <UserLinks />
          </div>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="lg:hidden p-2"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 sm:w-80">
              <SheetHeader className="mb-4">
                <SheetTitle>{t('nav.menu')}</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-3 py-4">
                <div className="pb-2 border-b border-gray-200 dark:border-gray-700">
                  <LanguageSelector />
                </div>
                {allLinks.map((link) => (
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

          <div className="flex lg:hidden items-center">
            <LanguageSelector compact />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
