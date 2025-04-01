
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

interface StateCardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  delay?: number;
}

const StateCard: React.FC<StateCardProps> = ({ title, children, icon, delay = 0 }) => {
  const { theme } = useTheme();
  
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
      <div className={`flex items-center gap-3 px-6 py-4 border-b ${
        theme === 'dark' ? 'bg-gray-700/50 border-gray-700' : 'bg-secondary/50 border-gray-100'
      }`}>
        {icon && (
          <div className="text-india-orange">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-display font-semibold">{title}</h3>
      </div>
      <div className="p-6">
        {children}
      </div>
    </motion.div>
  );
};

export default StateCard;
