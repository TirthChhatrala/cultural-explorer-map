
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { states } from '../data/states';
import { motion } from 'framer-motion';
import { newsItems } from '../data/newsData';
import NewsCard from '../components/news/NewsCard';
import NewsFilter from '../components/news/NewsFilter';
import NewsletterSubscription from '../components/news/NewsletterSubscription';
import { useTheme } from '../context/ThemeContext';
import { LayoutGrid, List, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
import Map from '../components/Map';
import { useNavigate } from 'react-router-dom';

const News = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);

  // Extract unique categories from news items
  const categories = ['all', ...new Set(newsItems.map(news => news.category))];

  // Filter news based on search term, category, and state
  const filteredNews = newsItems.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        news.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || news.category === selectedCategory;
    const matchesState = selectedState === 'all' || news.state === selectedState;
    
    return matchesSearch && matchesCategory && matchesState;
  });

  const handleStateHover = (stateId: string | null) => {
    setHoveredState(stateId);
  };

  const handleStateClick = (stateId: string) => {
    setSelectedState(stateId);
    setShowMap(false);
  };

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

        <div className="mb-12">
          <NewsFilter
            searchQuery={searchTerm}
            setSearchQuery={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            categories={categories}
            theme={theme}
          />
        </div>

        <div className="flex gap-4 mb-8">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setShowMap(!showMap)}
          >
            <MapPin size={16} />
            {showMap ? "Hide Map" : "Show Map"}
          </Button>
        </div>

        {showMap && (
          <div className="mb-10">
            <div className="border rounded-xl overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md">
              <div className="p-4 font-medium border-b bg-secondary/30">
                <h3>Select a state to filter news</h3>
              </div>
              <div className="p-4">
                <div className="h-[400px] md:h-[500px]">
                  <Map 
                    onStateHover={handleStateHover}
                    onStateClick={handleStateClick}
                    hoveredState={hoveredState}
                    activeState={selectedState !== 'all' ? selectedState : null}
                  />
                </div>
                {hoveredState && (
                  <div className="mt-4 p-3 rounded-md bg-muted">
                    <p className="font-medium">
                      {states.find(s => s.id === hoveredState)?.name || hoveredState}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Click to filter news from this state
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-display font-semibold">News Articles</h2>
          <div className="flex items-center gap-2">
            <Button 
              variant={viewMode === 'grid' ? "default" : "outline"} 
              size="sm" 
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid size={18} />
            </Button>
            <Button 
              variant={viewMode === 'list' ? "default" : "outline"} 
              size="sm" 
              onClick={() => setViewMode('list')}
            >
              <List size={18} />
            </Button>
          </div>
        </div>

        {filteredNews.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
            {filteredNews.map((news, index) => (
              <NewsCard
                key={news.id}
                title={news.title}
                excerpt={news.content.slice(0, 150) + '...'}
                date={news.date}
                author={news.author}
                image={news.image}
                state={states.find(s => s.id === news.state)?.name || news.state}
                category={news.category}
                delay={index * 0.1}
                theme={theme}
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No news articles match your search criteria.</p>
          </div>
        )}

        <div className="mt-20">
          <NewsletterSubscription theme={theme} />
        </div>
      </motion.div>
    </Layout>
  );
};

export default News;
