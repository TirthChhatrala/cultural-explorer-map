
import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/use-toast';
import {
  Image as ImageIcon,
  Plus,
  Trash,
  Upload,
  Copy
} from 'lucide-react';
import { states } from '../../data/states';

interface ImageAsset {
  id: number;
  url: string;
  name: string;
  category: string;
  relatedState?: string;
  uploadDate: string;
}

const ManageImages = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('states');
  const [selectedState, setSelectedState] = useState('');
  const [filter, setFilter] = useState('all');
  const [imageAssets, setImageAssets] = useState<ImageAsset[]>([
    {
      id: 1,
      url: '/lovable-uploads/87e03e01-1cae-414e-8e9d-f0e1eb9b6b92.png',
      name: 'India Map',
      category: 'maps',
      uploadDate: '2024-04-27'
    },
    {
      id: 2,
      url: '/lovable-uploads/87e03e01-1cae-414e-8e9d-f0e1eb9b6b92.png',
      name: 'Kerala Backwaters',
      category: 'states',
      relatedState: 'kerala',
      uploadDate: '2024-04-27'
    },
    {
      id: 3,
      url: '/lovable-uploads/87e03e01-1cae-414e-8e9d-f0e1eb9b6b92.png',
      name: 'Diwali Festival',
      category: 'festivals',
      uploadDate: '2024-04-27'
    }
  ]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newImage: ImageAsset = {
      id: imageAssets.length > 0 ? Math.max(...imageAssets.map(img => img.id)) + 1 : 1,
      url,
      name,
      category,
      ...(category === 'states' && { relatedState: selectedState }),
      uploadDate: new Date().toISOString().split('T')[0]
    };
    
    setImageAssets([...imageAssets, newImage]);
    
    toast({
      title: "Image Added",
      description: "New image has been added to the library.",
    });
    
    // Reset form fields
    setName('');
    setUrl('');
    setCategory('states');
    setSelectedState('');
  };

  const handleDelete = (id: number) => {
    setImageAssets(imageAssets.filter(img => img.id !== id));
    toast({
      title: "Image Deleted",
      description: "The image has been removed from the library.",
      variant: "destructive",
    });
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL Copied",
      description: "Image URL has been copied to clipboard.",
    });
  };

  const filteredImages = filter === 'all' 
    ? imageAssets 
    : imageAssets.filter(img => img.category === filter);

  if (!isAdmin) return null;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-display font-bold">Image Gallery</h1>
          <Button onClick={() => navigate('/admin')} variant="outline">
            Back to Admin
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
              <h2 className="text-xl font-display font-semibold mb-4 flex items-center gap-2">
                <Upload size={20} />
                Add New Image
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Image Name</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter descriptive name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Image URL</label>
                  <Input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter image URL"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                    required
                  >
                    <option value="states">States</option>
                    <option value="festivals">Festivals</option>
                    <option value="freedom-fighters">Freedom Fighters</option>
                    <option value="political-parties">Political Parties</option>
                    <option value="maps">Maps</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                {category === 'states' && (
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
                )}
                
                <Button type="submit" className="w-full">
                  <Plus className="mr-2" size={18} />
                  Add Image
                </Button>
              </form>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-display font-semibold flex items-center gap-2">
                  <ImageIcon size={20} />
                  Image Library
                </h2>
                
                <div>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  >
                    <option value="all">All Categories</option>
                    <option value="states">States</option>
                    <option value="festivals">Festivals</option>
                    <option value="freedom-fighters">Freedom Fighters</option>
                    <option value="political-parties">Political Parties</option>
                    <option value="maps">Maps</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              {filteredImages.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredImages.map((image) => (
                    <div key={image.id} className="border border-border rounded-lg overflow-hidden">
                      <div className="relative h-36 bg-gray-100 dark:bg-gray-800">
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-sm truncate" title={image.name}>
                          {image.name}
                        </h3>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                            {image.category}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {image.uploadDate}
                          </span>
                        </div>
                        <div className="flex justify-between mt-3 gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleCopyUrl(image.url)}
                          >
                            <Copy size={14} className="mr-1" />
                            Copy URL
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(image.id)}
                          >
                            <Trash size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No images found in the selected category.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ManageImages;
