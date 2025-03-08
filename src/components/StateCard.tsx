
import React from 'react';
import { motion } from 'framer-motion';

const StateCard = ({ title, children, icon, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        ease: [0.19, 1, 0.22, 1],
        delay 
      }}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center gap-3 bg-secondary/50 px-6 py-4 border-b">
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
