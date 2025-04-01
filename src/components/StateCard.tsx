
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

interface StateCardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  delay?: number;
  collapsible?: boolean;
}

const StateCard: React.FC<StateCardProps> = ({ 
  title, 
  children, 
  icon, 
  delay = 0,
  collapsible = false 
}) => {
  const { theme } = useTheme();
  const [expanded, setExpanded] = React.useState(!collapsible);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        ease: [0.19, 1, 0.22, 1],
        delay 
      }}
      className={`rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 ${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'
      }`}
    >
      <div 
        className={`flex items-center justify-between gap-3 px-6 py-4 border-b ${
          theme === 'dark' ? 'bg-gray-700/50 border-gray-700' : 'bg-secondary/50 border-gray-100'
        } ${collapsible ? 'cursor-pointer' : ''}`}
        onClick={collapsible ? () => setExpanded(!expanded) : undefined}
      >
        <div className="flex items-center gap-3">
          {icon && (
            <div className="text-india-orange">
              {icon}
            </div>
          )}
          <h3 className="text-lg font-display font-semibold">{title}</h3>
        </div>
        
        {collapsible && (
          <div className="text-india-orange">
            {expanded ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m18 15-6-6-6 6"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            )}
          </div>
        )}
      </div>
      
      {(!collapsible || expanded) && (
        <div className="p-6 font-sans">
          {children}
        </div>
      )}
    </motion.div>
  );
};

export default StateCard;
