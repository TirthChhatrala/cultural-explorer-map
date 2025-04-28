
import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/use-toast';
import {
  Calendar,
  Plus,
  Trash,
  Edit,
  Image,
  MapPin
} from 'lucide-react';
import { states } from '../../data/states';

interface Festival {
  id: number;
  name: string;
  description: string;
  date: string;
  state: string;
  image: string;
}

const ManageFestivals = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [festivalName, setFestivalName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [image, setImage] = useState('/lovable-uploads/87e03e01-1cae-414e-8e9d-f0e1eb9b6b92.png');
  const [editFestivalId, setEditFestivalId] = useState<number | null>(null);
  const [festivals, setFestivals] = useState<Festival[]>([
    {
      id: 1,
      name: 'Diwali',
      description: 'Festival of lights celebrated across India with oil lamps, fireworks, and sweets.',
      date: '2024-10-31',
      state: 'all',
      image: '/lovable-uploads/87e03e01-1cae-414e-8e9d-f0e1eb9b6b92.png'
    },
    {
      id: 2,
      name: 'Onam',
      description: 'Harvest festival celebrated in Kerala with elaborate flower arrangements and boat races.',
      date: '2024-09-15',
      state: 'kerala',
      image: '/lovable-uploads/87e03e01-1cae-414e-8e9d-f0e1eb9b6b92.png'
    },
    {
      id: 3,
      name: 'Pongal',
      description: 'Four-day harvest festival celebrated in Tamil Nadu with traditional foods and cattle worship.',
      date: '2025-01-14',
      state: 'tamil-nadu',
      image: '/lovable-uploads/87e03e01-1cae-414e-8e9d-f0e1eb9b6b92.png'
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

  useEffect(() => {
    if (editFestivalId !== null) {
      const festivalToEdit = festivals.find(festival => festival.id === editFestivalId);
      if (festivalToEdit) {
        setFestivalName(festivalToEdit.name);
        setDescription(festivalToEdit.description);
        setDate(festivalToEdit.date);
        setSelectedState(festivalToEdit.state);
        setImage(festivalToEdit.image);
      }
    }
  }, [editFestivalId, festivals]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editFestivalId !== null) {
      // Editing existing festival
      setFestivals(prevFestivals => {
        return prevFestivals.map(festival => {
          if (festival.id === editFestivalId) {
            return {
              ...festival,
              name: festivalName,
              description,
              date,
              state: selectedState,
              image
            };
          }
          return festival;
        });
      });

      toast({
        title: "Festival Updated",
        description: "Festival information has been updated successfully.",
      });
    } else {
      // Adding new festival
      const newFestival: Festival = {
        id: festivals.length > 0 ? Math.max(...festivals.map(f => f.id)) + 1 : 1,
        name: festivalName,
        description,
        date,
        state: selectedState,
        image
      };
      
      setFestivals([...festivals, newFestival]);
      
      toast({
        title: "Festival Added",
        description: "New festival has been added successfully.",
      });
    }
    
    // Reset form fields and edit state
    resetForm();
  };

  const resetForm = () => {
    setFestivalName('');
    setDescription('');
    setDate('');
    setSelectedState('');
    setImage('/lovable-uploads/87e03e01-1cae-414e-8e9d-f0e1eb9b6b92.png');
    setEditFestivalId(null);
  };

  const handleDelete = (id: number) => {
    setFestivals(festivals.filter(festival => festival.id !== id));
    toast({
      title: "Festival Deleted",
      description: "The festival has been removed.",
      variant: "destructive",
    });
  };

  const handleEditClick = (id: number) => {
    setEditFestivalId(id);
  };

  if (!isAdmin) return null;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-display font-bold">Manage Festivals</h1>
          <Button onClick={() => navigate('/admin')} variant="outline">
            Back to Admin
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
              <h2 className="text-xl font-display font-semibold mb-4 flex items-center gap-2">
                {editFestivalId ? <Edit size={20} /> : <Plus size={20} />}
                {editFestivalId ? 'Edit Festival' : 'Add Festival'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Festival Name</label>
                  <Input
                    value={festivalName}
                    onChange={(e) => setFestivalName(e.target.value)}
                    placeholder="Enter festival name"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Festival Date</label>
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">State</label>
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                      required
                    >
                      <option value="" disabled>Select a state</option>
                      <option value="all">All India</option>
                      {states.map((state) => (
                        <option key={state.id} value={state.id}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter festival description"
                    className="w-full min-h-[150px] rounded-md border border-input bg-transparent px-3 py-2"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Image URL</label>
                  <Input
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="Enter image URL"
                    required
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editFestivalId ? (
                      <>
                        <Edit className="mr-2" size={18} />
                        Update Festival
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2" size={18} />
                        Add Festival
                      </>
                    )}
                  </Button>
                  
                  {editFestivalId && (
                    <Button type="button" variant="outline" onClick={resetForm}>
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
                <Calendar size={20} />
                Festival List
              </h2>
              
              {festivals.length > 0 ? (
                <div className="space-y-4">
                  {festivals.map((festival) => (
                    <div key={festival.id} className="p-4 border border-border rounded-lg">
                      <div className="flex justify-between">
                        <div className="flex gap-4">
                          <img 
                            src={festival.image} 
                            alt={festival.name} 
                            className="w-16 h-16 object-cover rounded-md"
                          />
                          <div>
                            <h3 className="font-medium">{festival.name}</h3>
                            <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                              <p className="flex items-center gap-1">
                                <Calendar size={14} />
                                {festival.date}
                              </p>
                              <p className="flex items-center gap-1">
                                <MapPin size={14} />
                                {festival.state === 'all' 
                                  ? 'All India' 
                                  : states.find(s => s.id === festival.state)?.name || festival.state}
                              </p>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {festival.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditClick(festival.id)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => handleDelete(festival.id)}
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
                  No festivals added yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ManageFestivals;
