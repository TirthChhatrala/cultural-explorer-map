
import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/use-toast';
import {
  Newspaper,
  Plus,
  Trash,
  Edit,
  Calendar,
  User,
  History
} from 'lucide-react';
import { states } from '../../data/states';
import { newsItems, NewsItem, NewsVersion } from '../../data/newsData';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '../../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

const ManageNews = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('culture');
  const [selectedState, setSelectedState] = useState('');
  const [newsList, setNewsList] = useState<NewsItem[]>(newsItems);
  const [editNewsId, setEditNewsId] = useState<number | null>(null);
  const [selectedNewsForHistory, setSelectedNewsForHistory] = useState<NewsItem | null>(null);
  
  const categories = ["Culture", "Tourism", "Business", "Agriculture", "Technology", "Education", "Healthcare"];
  
  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
      toast({
        title: "Admin Access Required",
        description: "You must be logged in as an admin to view this page",
        variant: "destructive"
      });
    }
  }, [isAdmin, navigate, toast]);

  useEffect(() => {
    if (editNewsId !== null) {
      const newsToEdit = newsList.find(news => news.id === editNewsId);
      if (newsToEdit) {
        setTitle(newsToEdit.title);
        setContent(newsToEdit.content);
        setCategory(newsToEdit.category);
        setSelectedState(newsToEdit.state);
      }
    }
  }, [editNewsId, newsList]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editNewsId !== null) {
      // Editing existing news
      setNewsList(prevNewsList => {
        return prevNewsList.map(news => {
          if (news.id === editNewsId) {
            // Create a new version record
            const newVersion: NewsVersion = {
              id: news.versions.length + 1,
              title: news.title,
              content: news.content,
              category: news.category,
              state: news.state,
              date: news.date,
              createdAt: new Date().toISOString()
            };

            // Update the news with new data and add version
            return {
              ...news,
              title,
              content,
              category: category.toLowerCase(),
              state: selectedState,
              date: new Date().toISOString().split('T')[0],
              versions: [...news.versions, newVersion]
            };
          }
          return news;
        });
      });

      toast({
        title: "News Updated Successfully",
        description: "Your news article has been updated with version history.",
      });
      
    } else {
      // Adding new news
      const newNewsItem: NewsItem = {
        id: newsList.length > 0 ? Math.max(...newsList.map(n => n.id)) + 1 : 1,
        title,
        content,
        category: category.toLowerCase(),
        state: selectedState,
        date: new Date().toISOString().split('T')[0],
        author: "Admin User",
        image: "/lovable-uploads/87e03e01-1cae-414e-8e9d-f0e1eb9b6b92.png",
        versions: [{
          id: 1,
          title,
          content,
          category: category.toLowerCase(),
          state: selectedState,
          date: new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString()
        }]
      };
      
      setNewsList([...newsList, newNewsItem]);
      
      toast({
        title: "News Published Successfully",
        description: "Your news article has been published.",
      });
    }
    
    // Reset form fields and edit state
    setTitle('');
    setContent('');
    setCategory('culture');
    setSelectedState('');
    setEditNewsId(null);
  };

  const handleDelete = (id: number) => {
    setNewsList(newsList.filter(news => news.id !== id));
    toast({
      title: "News Deleted",
      description: "The news article has been removed.",
      variant: "destructive",
    });
  };

  const handleRestoreVersion = (version: NewsVersion) => {
    if (!selectedNewsForHistory) return;
    
    setNewsList(prevNewsList => {
      return prevNewsList.map(news => {
        if (news.id === selectedNewsForHistory.id) {
          // Create a new version record of current state
          const newVersion: NewsVersion = {
            id: news.versions.length + 1,
            title: news.title,
            content: news.content,
            category: news.category,
            state: news.state,
            date: news.date,
            createdAt: new Date().toISOString()
          };

          // Update with restored version
          return {
            ...news,
            title: version.title,
            content: version.content,
            category: version.category,
            state: version.state,
            versions: [...news.versions, newVersion]
          };
        }
        return news;
      });
    });

    toast({
      title: "Version Restored",
      description: `Restored to version from ${new Date(version.createdAt).toLocaleDateString()}`,
    });
  };

  const handleEditClick = (id: number) => {
    setEditNewsId(id);
  };

  const handleCancelEdit = () => {
    setTitle('');
    setContent('');
    setCategory('culture');
    setSelectedState('');
    setEditNewsId(null);
  };

  const handleViewHistory = (news: NewsItem) => {
    setSelectedNewsForHistory(news);
  };

  if (!isAdmin) return null;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-display font-bold">Manage News</h1>
          <Button onClick={() => navigate('/admin')} variant="outline">
            Back to Admin
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
              <h2 className="text-xl font-display font-semibold mb-4 flex items-center gap-2">
                {editNewsId ? <Edit size={20} /> : <Plus size={20} />}
                {editNewsId ? 'Edit News Article' : 'Add News Article'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">News Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter news title"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                      required
                    >
                      {categories.map((cat) => (
                        <option key={cat.toLowerCase()} value={cat.toLowerCase()}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Related State</label>
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                      required
                    >
                      <option value="" disabled>Select a state</option>
                      {states.map((state) => (
                        <option key={state.id} value={state.id}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Content</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter news content"
                    className="w-full min-h-[200px] rounded-md border border-input bg-transparent px-3 py-2"
                    required
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editNewsId ? (
                      <>
                        <Edit className="mr-2" size={18} />
                        Update News
                      </>
                    ) : (
                      <>
                        <Newspaper className="mr-2" size={18} />
                        Publish News
                      </>
                    )}
                  </Button>
                  
                  {editNewsId && (
                    <Button type="button" variant="outline" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </div>
          
          <div>
            <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
              <h2 className="text-xl font-display font-semibold mb-4 flex items-center gap-2">
                <Newspaper size={20} />
                Published Articles
              </h2>
              
              {newsList.length > 0 ? (
                <div className="space-y-4">
                  {newsList.map((news) => (
                    <div key={news.id} className="p-4 border border-border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{news.title}</h3>
                          <div className="flex gap-4 mt-1">
                            <p className="text-xs flex items-center gap-1 text-muted-foreground">
                              <Calendar size={14} />
                              {news.date}
                            </p>
                            <p className="text-xs bg-india-orange/10 text-india-orange px-2 py-0.5 rounded-full">
                              {news.category}
                            </p>
                            <p className="text-xs flex items-center gap-1 text-muted-foreground">
                              <User size={14} />
                              {news.author}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{news.content}</p>
                        </div>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleViewHistory(news)}
                              >
                                <History size={16} />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Version History</DialogTitle>
                                <DialogDescription>
                                  View and restore previous versions of this article
                                </DialogDescription>
                              </DialogHeader>
                              <div className="mt-4">
                                <Tabs defaultValue="current">
                                  <TabsList className="mb-4">
                                    <TabsTrigger value="current">Current</TabsTrigger>
                                    <TabsTrigger value="history">History ({news.versions.length})</TabsTrigger>
                                  </TabsList>
                                  <TabsContent value="current">
                                    <div className="space-y-4">
                                      <h3 className="text-lg font-medium">{news.title}</h3>
                                      <p className="text-sm text-muted-foreground">{news.content}</p>
                                      <div className="flex gap-2 mt-4">
                                        <div className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
                                          {news.category}
                                        </div>
                                        <div className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
                                          {states.find(s => s.id === news.state)?.name}
                                        </div>
                                        <div className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
                                          {news.date}
                                        </div>
                                      </div>
                                    </div>
                                  </TabsContent>
                                  <TabsContent value="history">
                                    <div className="space-y-6">
                                      {news.versions.map((version, index) => (
                                        <div 
                                          key={version.id} 
                                          className="p-4 border border-border rounded-lg relative"
                                        >
                                          <div className="absolute -top-3 left-4 bg-background px-2 text-xs text-muted-foreground">
                                            Version {news.versions.length - index}
                                          </div>
                                          <h4 className="font-medium">{version.title}</h4>
                                          <p className="text-sm text-muted-foreground my-2">
                                            {version.content.substring(0, 100)}...
                                          </p>
                                          <div className="flex justify-between items-end">
                                            <div>
                                              <span className="text-xs text-muted-foreground">
                                                Created: {new Date(version.createdAt).toLocaleString()}
                                              </span>
                                            </div>
                                            <Button 
                                              size="sm" 
                                              variant="outline"
                                              onClick={() => handleRestoreVersion(version)}
                                            >
                                              Restore
                                            </Button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </TabsContent>
                                </Tabs>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditClick(news.id)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => handleDelete(news.id)}
                          >
                            <Trash size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No news articles published yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ManageNews;
