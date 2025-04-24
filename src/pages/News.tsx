import React, { useState } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import NewsCard from '../components/news/NewsCard';
import NewsFilter from '../components/news/NewsFilter';
import NewsletterSubscription from '../components/news/NewsletterSubscription';
import { useToast } from '../hooks/use-toast';

// Dummy news data
const newsData = [
  {
    id: 1,
    title: "Kerala Tourism Wins Global Award for Sustainable Initiatives",
    excerpt: "Kerala's tourism department received international recognition for its eco-friendly approaches to tourism development.",
    date: "2023-06-15",
    author: "Rajesh Kumar",
    image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    state: "kerala",
    category: "tourism"
  },
  {
    id: 2,
    title: "Rajasthan's Desert Festival Attracts Record Number of Visitors",
    excerpt: "The annual desert festival in Jaisalmer saw unprecedented attendance, boosting local economy and cultural awareness.",
    date: "2023-05-22",
    author: "Priya Sharma",
    image: "https://images.unsplash.com/photo-1607836046730-3317bd58a31b?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    state: "rajasthan",
    category: "culture"
  },
  {
    id: 3,
    title: "Tamil Nadu Inaugurates New Cultural Heritage Museum in Chennai",
    excerpt: "A state-of-the-art museum showcasing the rich cultural history of Tamil Nadu opened its doors to the public.",
    date: "2023-07-10",
    author: "Arun Krishnan",
    image: "https://images.unsplash.com/photo-1583420516175-d73d910f2e5c?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    state: "tamilnadu",
    category: "culture"
  },
  {
    id: 4,
    title: "Punjab Farmers Adopt New Agricultural Technologies",
    excerpt: "Progressive farmers in Punjab are embracing innovative farming methods to increase yield while reducing environmental impact.",
    date: "2023-08-05",
    author: "Harpreet Singh",
    image: "https://images.unsplash.com/photo-1625466991342-fa4b71dfdd73?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    state: "punjab",
    category: "agriculture"
  },
  {
    id: 5,
    title: "Gujarat's Textile Industry Exports Hit New Record",
    excerpt: "Traditional and modern textile products from Gujarat are seeing unprecedented demand in international markets.",
    date: "2023-04-18",
    author: "Meera Patel",
    image: "https://images.unsplash.com/photo-1621496503717-028e695f5c44?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    state: "gujarat",
    category: "business"
  },
  {
    id: 6,
    title: "West Bengal Literature Festival Celebrates Regional Authors",
    excerpt: "The annual literary event brought together authors, poets, and readers to celebrate Bengali literature.",
    date: "2023-09-01",
    author: "Sanjay Ghosh",
    image: "https://images.unsplash.com/photo-1544949767-9dc1e8880c3b?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    state: "westbengal",
    category: "culture"
  }
];

const categories = ["All", "Culture", "Tourism", "Business", "Agriculture", "Technology", "Education", "Healthcare"];

const News = () => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [email, setEmail] = useState('');
  const { toast } = useToast();
  
  // Filter news based on search, state, and category
  const filteredNews = newsData.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         news.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = selectedState === 'all' || news.state === selectedState;
    const matchesCategory = selectedCategory === 'All' || news.category.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesState && matchesCategory;
  });

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
    <Layout>
      <div className="max-w-6xl mx-auto px-4">
        <section className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
          >
            <span className="inline-block px-3 py-1 bg-india-orange/10 text-india-orange rounded-full text-sm font-medium mb-4">
              Stay Updated
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 tracking-tight">
              Latest <span className="text-india-orange">News</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover the latest developments and stories from across India's diverse states.
            </p>
          </motion.div>
        </section>

        <section className="mb-8">
          <NewsFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
            theme={theme}
          />
        </section>

        <section className="mb-16">
          {filteredNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((news, index) => (
                <NewsCard
                  key={news.id}
                  title={news.title}
                  excerpt={news.excerpt}
                  date={news.date}
                  author={news.author}
                  image={news.image}
                  state={states.find(s => s.id === news.state)?.name || ''}
                  category={news.category}
                  delay={index * 0.1}
                  theme={theme}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-muted-foreground text-lg">No news found matching your criteria.</p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedState('all');
                  setSelectedCategory('All');
                }}
                className={`mt-4 px-4 py-2 rounded-lg hover:bg-secondary/80 transition-colors ${
                  theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-secondary text-foreground'
                }`}
              >
                Reset Filters
              </button>
            </motion.div>
          )}
        </section>

        <section className="mb-16">
          <NewsletterSubscription theme={theme} />
        </section>
      </div>
    </Layout>
  );
};

export default News;
