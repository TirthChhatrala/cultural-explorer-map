import React from 'react';
import Layout from '../components/Layout';
import { states } from '../data/states'; // Add this import
import { motion } from 'framer-motion';

const News = () => {
  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
      >
        <section className="text-center py-20">
          <span className="inline-block px-3 py-1 bg-india-orange/10 text-india-orange rounded-full text-sm font-medium mb-4">
            Stay Informed
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 tracking-tight">
            Latest <span className="text-india-orange">News</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get the latest updates and happenings from around India.
          </p>
        </section>
      </motion.div>
    </Layout>
  );
};

export default News;
