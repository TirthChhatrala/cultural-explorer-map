
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Tag } from 'lucide-react';

interface NewsCardProps {
  title: string;
  excerpt: string;
  date: string;
  author: string;
  image: string;
  state: string;
  category: string;
  delay: number;
  theme: 'dark' | 'light';
}

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  excerpt,
  date,
  author,
  image,
  state,
  category,
  delay,
  theme
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`rounded-xl overflow-hidden shadow-lg ${
        theme === 'dark' ? 'bg-gray-800/90' : 'bg-white'
      }`}
    >
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
          {excerpt}
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-1">
            <Calendar size={16} className="text-india-orange" />
            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{date}</span>
          </div>
          <div className="flex items-center gap-1">
            <User size={16} className="text-india-orange" />
            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Tag size={16} className="text-india-orange" />
            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
              {state} - {category}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NewsCard;

