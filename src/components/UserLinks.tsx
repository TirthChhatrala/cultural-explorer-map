
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface UserLinksProps {
  isMobile?: boolean;
  onLinkClick?: () => void;
}

const UserLinks: React.FC<UserLinksProps> = ({ isMobile = false, onLinkClick }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return isAuthenticated ? (
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
    </>
  ) : (
    <>
      <Link
        to="/login"
        className={`${isMobile ? 'block w-full py-2' : 'px-3 py-1 rounded-md'} ${
          isActive('/login') 
            ? 'bg-india-orange/10 text-india-orange font-medium' 
            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
        } transition-colors`}
        onClick={onLinkClick}
      >
        Login
      </Link>
      <Link
        to="/signup"
        className={`${isMobile ? 'block w-full py-2' : 'px-4 py-1 rounded-md bg-india-orange text-white hover:bg-india-orange/90'}`}
        onClick={onLinkClick}
      >
        Sign Up
      </Link>
    </>
  );
};

export default UserLinks;
