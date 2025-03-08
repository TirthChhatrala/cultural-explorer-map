
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar, User, Flag } from 'lucide-react';
import { states } from '../data/states';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Filter news based on search, state, and category
  const filteredNews = newsData.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         news.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = selectedState === 'all' || news.state === selectedState;
    const matchesCategory = selectedCategory === 'All' || news.category.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesState && matchesCategory;
  });

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
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
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-india-orange/30 focus:border-india-orange outline-none transition-all"
                />
              </div>
              
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative">
                  <Filter className="absolute left-3 top-3 text-gray-400" size={20} />
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="pl-10 pr-8 py-2.5 border rounded-lg appearance-none focus:ring-2 focus:ring-india-orange/30 focus:border-india-orange outline-none transition-all"
                  >
                    <option value="all">All States</option>
                    {states.map(state => (
                      <option key={state.id} value={state.id}>{state.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="relative">
                  <Filter className="absolute left-3 top-3 text-gray-400" size={20} />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="pl-10 pr-8 py-2.5 border rounded-lg appearance-none focus:ring-2 focus:ring-india-orange/30 focus:border-india-orange outline-none transition-all"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
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
                className="mt-4 px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
              >
                Reset Filters
              </button>
            </motion.div>
          )}
        </section>

        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-india-blue/5 rounded-2xl p-8 text-center"
          >
            <h2 className="text-2xl font-display font-semibold mb-3">Subscribe to Our Newsletter</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Stay updated with the latest news and stories from across India. We deliver curated content straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-india-orange/30 focus:border-india-orange outline-none transition-all"
              />
              <button className="px-6 py-2.5 bg-india-blue text-white rounded-lg font-medium hover:bg-india-blue/90 transition-colors">
                Subscribe
              </button>
            </div>
          </motion.div>
        </section>
      </div>
    </Layout>
  );
};

const NewsCard = ({ title, excerpt, date, author, image, state, category, delay = 0 }) => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        ease: [0.19, 1, 0.22, 1], 
        delay 
      }}
      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-medium px-2.5 py-1 bg-india-orange/10 text-india-orange rounded-full">
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Flag className="w-3 h-3" /> {state}
          </span>
        </div>
        
        <h3 className="text-xl font-display font-semibold mb-2 line-clamp-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{excerpt}</p>
        
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {formattedDate}
          </span>
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" /> {author}
          </span>
        </div>
      </div>
    </motion.article>
  );
};

export default News;
