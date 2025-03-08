
import React from 'react';
import Header from './Header';
import { motion } from 'framer-motion';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-page-gradient">
      <Header />
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'url(/lovable-uploads/87e03e01-1cae-414e-8e9d-f0e1eb9b6b92.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: -1
        }}
      />
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
        className="container mx-auto px-4 py-8 pt-28 min-h-screen"
      >
        {children}
      </motion.main>
      <footer className="py-6 border-t border-border bg-secondary/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Indian Cultural Explorer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
