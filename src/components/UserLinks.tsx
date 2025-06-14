
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
  ) : null;
};

export default UserLinks;
