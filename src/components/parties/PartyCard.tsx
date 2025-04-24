
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

interface PartyCardProps {
  name: string;
  abbreviation: string;
  founded: number;
  ideology: string;
  leader: string;
  description: string;
  logo: string;
  color: string;
  states: string[];
  delay?: number;
  theme: 'dark' | 'light';
}

const PartyCard: React.FC<PartyCardProps> = ({
  name,
  abbreviation,
  founded,
  ideology,
  leader,
  description,
  logo,
  color,
  states,
  delay = 0,
  theme
}) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1], delay }}
      className={`rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow ${
        theme === 'dark' ? 'bg-gray-800/90' : 'bg-white'
      }`}
    >
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4 flex flex-col items-center">
            <div 
              className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center mb-4"
              style={{ backgroundColor: `${color}20` }}
            >
              <img 
                src={logo} 
                alt={`${name} logo`} 
                className="w-16 h-16 object-contain"
              />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold">{name}</h3>
              <p className="text-india-orange font-medium">{abbreviation}</p>
              <div className="mt-2 text-sm text-muted-foreground">
                <p>Founded: {founded}</p>
              </div>
            </div>
          </div>
          
          <div className="md:w-3/4">
            <div className="flex flex-col md:flex-row justify-between mb-3">
              <div>
                <span className="text-sm font-medium">Ideology:</span>
                <p className="text-muted-foreground text-sm">{ideology}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Leader:</span>
                <p className="text-muted-foreground text-sm">{leader}</p>
              </div>
            </div>
            
            <p className="text-muted-foreground mb-4">{description}</p>
            
            <div>
              <span className="text-sm font-medium flex items-center gap-1 mb-2">
                <MapPin className="w-4 h-4" /> Prominent in:
              </span>
              <div className="flex flex-wrap gap-2">
                {states.map((state, index) => (
                  <span 
                    key={index} 
                    className={`text-xs px-2 py-1 rounded-full ${
                      theme === 'dark' 
                        ? 'bg-gray-700 text-gray-300' 
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {state}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default PartyCard;
