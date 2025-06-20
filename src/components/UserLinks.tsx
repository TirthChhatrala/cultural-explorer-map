
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';

interface UserLinksProps {
  isMobile?: boolean;
  onLinkClick?: () => void;
}

const UserLinks: React.FC<UserLinksProps> = ({ isMobile = false, onLinkClick }) => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const handleLogout = () => {
    logout();
    if (onLinkClick) onLinkClick();
  };
  
  return (
    <div className={`${isMobile ? 'flex flex-col space-y-2' : 'flex items-center space-x-2'}`}>
      {/* Always show Login and Signup buttons */}
      <Link 
        to="/login" 
        onClick={onLinkClick}
      >
        <Button 
          variant="ghost" 
          size={isMobile ? "default" : "sm"}
          className={`${isMobile ? 'w-full justify-start' : ''} ${
            isActive('/login') ? 'bg-india-orange/10 text-india-orange' : ''
          }`}
        >
          Login
        </Button>
      </Link>
      
      <Link 
        to="/signup" 
        onClick={onLinkClick}
      >
        <Button 
          variant="outline" 
          size={isMobile ? "default" : "sm"}
          className={`${isMobile ? 'w-full justify-start' : ''} ${
            isActive('/signup') ? 'bg-india-orange/10 text-india-orange' : ''
          }`}
        >
          Sign Up
        </Button>
      </Link>

      {/* Show authenticated user options when logged in */}
      {isAuthenticated && (
        <>
          <Link 
            to="/my-trips" 
            className={`${isMobile ? 'block w-full py-2' : 'px-3 py-1 rounded-md'} ${
              isActive('/my-trips') 
                ? 'bg-india-orange/10 text-india-orange font-medium' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            } transition-colors`}
            onClick={onLinkClick}
          >
            My Trips
          </Link>
          <Link 
            to="/dashboard" 
            className={`${isMobile ? 'block w-full py-2' : 'px-3 py-1 rounded-md'} ${
              isActive('/dashboard') 
                ? 'bg-india-orange/10 text-india-orange font-medium' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            } transition-colors`}
            onClick={onLinkClick}
          >
            Profile
          </Link>
          <Button 
            variant="ghost" 
            size={isMobile ? "default" : "sm"}
            onClick={handleLogout}
            className={`${isMobile ? 'w-full justify-start' : ''} text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20`}
          >
            Logout
          </Button>
        </>
      )}
    </div>
  );
};

export default UserLinks;
