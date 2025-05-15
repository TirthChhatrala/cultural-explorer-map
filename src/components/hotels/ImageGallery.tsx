
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  name: string;
  onClose: () => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, name, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <button 
        className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
        onClick={onClose}
      >
        <X size={24} />
      </button>
      
      <div className="absolute top-4 left-4 text-white">
        <h3 className="text-xl font-medium">{name}</h3>
        <p className="text-sm text-white/70">{currentIndex + 1} / {images.length}</p>
      </div>
      
      <button 
        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
        onClick={handlePrevious}
      >
        <ChevronLeft size={24} />
      </button>
      
      <button 
        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
        onClick={handleNext}
      >
        <ChevronRight size={24} />
      </button>
      
      <div className="w-full h-full flex items-center justify-center p-10" onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`${name} - Image ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>
      </div>
      
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 overflow-x-auto p-2">
        {images.map((image, index) => (
          <button
            key={index}
            className={`w-16 h-12 overflow-hidden rounded border-2 ${
              index === currentIndex ? 'border-white' : 'border-transparent'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(index);
            }}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default ImageGallery;
