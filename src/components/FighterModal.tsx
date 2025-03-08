
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const FighterModal = ({ isOpen, onClose, fighter }) => {
  const { theme } = useTheme();
  
  if (!fighter) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
            className={`relative w-full max-w-2xl max-h-[90vh] overflow-auto rounded-xl shadow-2xl ${
              theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/10 hover:bg-black/20 transition-colors text-white"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="h-64 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
              <img 
                src={fighter.image} 
                alt={fighter.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <span className="inline-block px-3 py-1 bg-india-orange text-white rounded-full text-sm font-medium mb-2">
                  {fighter.state}
                </span>
                <h2 className="text-3xl font-display font-bold text-white mb-1">{fighter.name}</h2>
                <p className="text-white/80">{fighter.years}</p>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid gap-6">
                <div>
                  <h3 className="text-xl font-display font-semibold mb-2">Biography</h3>
                  <p className="text-muted-foreground">{fighter.biography}</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-display font-semibold mb-2">Contributions</h3>
                  <ul className="space-y-2">
                    {fighter.contributions.map((contribution, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-india-orange mt-2" />
                        <span>{contribution}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-display font-semibold mb-2">Legacy</h3>
                  <p className="text-muted-foreground">{fighter.legacy}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FighterModal;
