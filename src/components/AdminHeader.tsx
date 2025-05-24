
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogOut, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import ThemeToggle from './ThemeToggle';
import { useToast } from '../hooks/use-toast';

const AdminHeader = () => {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your admin account",
    });
    navigate('/');
  };

  const adminLinks = [
    { path: '/admin', label: 'Dashboard' },
    { path: '/admin/trips', label: 'Trip Management' },
    { path: '/admin/states', label: 'States' },
    { path: '/admin/news', label: 'News' },
    { path: '/admin/festivals', label: 'Festivals' },
    { path: '/admin/political-parties', label: 'Political Parties' },
    { path: '/admin/freedom-fighters', label: 'Freedom Fighters' },
    { path: '/admin/images', label: 'Images' },
  ];

  return (
    <header className={`sticky top-0 z-50 w-full border-b ${
      theme === 'dark'
        ? 'bg-gray-900 border-gray-800'
        : 'bg-white border-gray-200'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/admin" className="flex items-center">
              <div className="h-8 w-8 mr-2 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">ICE</span>
              </div>
              <span className="font-display font-bold text-xl hidden sm:inline-block">
                Admin Panel
              </span>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center space-x-1">
            {adminLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1 rounded-md text-sm ${
                  location.pathname === link.path
                    ? 'bg-red-500/10 text-red-500 font-medium'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                } transition-colors`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Visit Site
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-500 border-red-500 hover:bg-red-50 dark:hover:bg-red-950"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
            <ThemeToggle />
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
                <SheetTitle>Admin Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-3 py-4">
                {adminLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block py-2 ${
                      location.pathname === link.path
                        ? "text-red-500 font-medium"
                        : ""
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigate('/');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2"
                  >
                    <Home className="h-4 w-4" />
                    Visit Site
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 text-red-500 border-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
