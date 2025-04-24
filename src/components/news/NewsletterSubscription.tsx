
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '../../hooks/use-toast';

interface NewsletterSubscriptionProps {
  theme: 'dark' | 'light';
}

const NewsletterSubscription: React.FC<NewsletterSubscriptionProps> = ({ theme }) => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Subscription Successful!",
        description: "Thank you for subscribing to our newsletter.",
        variant: "default",
      });
      setEmail('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className={`rounded-2xl p-8 text-center ${
        theme === 'dark' 
          ? 'bg-gray-800/90 border-gray-700' 
          : 'bg-white/90 border-gray-200'
      }`}
    >
      <h2 className="text-2xl font-semibold mb-3">Subscribe to Our Newsletter</h2>
      <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
        Stay updated with the latest news and stories from across India.
      </p>
      <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <input 
          type="email" 
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={`flex-grow px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-india-orange/30 focus:border-india-orange outline-none transition-all ${
            theme === 'dark' 
              ? 'bg-gray-700/90 border-gray-600 text-white' 
              : 'bg-white border-gray-300'
          }`}
        />
        <button 
          type="submit"
          className="px-6 py-2.5 bg-india-orange text-white rounded-lg font-medium hover:bg-india-orange/90 transition-colors"
        >
          Subscribe
        </button>
      </form>
    </motion.div>
  );
};

export default NewsletterSubscription;

