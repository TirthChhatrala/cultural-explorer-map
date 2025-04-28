
import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/use-toast';
import {
  User,
  Plus,
  Trash,
  Edit,
  MapPin,
  Calendar
} from 'lucide-react';
import { states } from '../../data/states';
import { freedomFighters, FreedomFighter } from '../../data/states';

const ManageFreedomFighters = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [years, setYears] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [contribution, setContribution] = useState('');
  const [biography, setBiography] = useState('');
  const [editFighterId, setEditFighterId] = useState<string | null>(null);
  const [fighters, setFighters] = useState<FreedomFighter[]>(freedomFighters);

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
    if (editFighterId !== null) {
      const fighterToEdit = fighters.find(fighter => fighter.id === editFighterId);
      if (fighterToEdit) {
        setName(fighterToEdit.name);
        setImage(fighterToEdit.image);
        setYears(fighterToEdit.years);
        setSelectedState(fighterToEdit.state);
        setContribution(fighterToEdit.contribution);
        setBiography(fighterToEdit.biography);
      }
    }
  }, [editFighterId, fighters]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editFighterId !== null) {
      // Editing existing freedom fighter
      setFighters(prevFighters => {
        return prevFighters.map(fighter => {
          if (fighter.id === editFighterId) {
            return {
              ...fighter,
              name,
              image,
              years,
              state: selectedState,
              contribution,
              biography
            };
          }
          return fighter;
        });
      });

      toast({
        title: "Freedom Fighter Updated",
        description: "Freedom fighter information has been updated successfully.",
      });
    } else {
      // Adding new freedom fighter
      const nameSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const newFighter: FreedomFighter = {
        id: nameSlug,
        name,
        image,
        years,
        state: selectedState,
        contribution,
        biography
      };
      
      setFighters([...fighters, newFighter]);
      
      toast({
        title: "Freedom Fighter Added",
        description: "New freedom fighter has been added successfully.",
      });
    }
    
    // Reset form fields and edit state
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setImage('');
    setYears('');
    setSelectedState('');
    setContribution('');
    setBiography('');
    setEditFighterId(null);
  };

  const handleDelete = (id: string) => {
    setFighters(fighters.filter(fighter => fighter.id !== id));
    toast({
      title: "Freedom Fighter Deleted",
      description: "The freedom fighter has been removed.",
      variant: "destructive",
    });
  };

  const handleEditClick = (id: string) => {
    setEditFighterId(id);
  };

  if (!isAdmin) return null;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-display font-bold">Manage Freedom Fighters</h1>
          <Button onClick={() => navigate('/admin')} variant="outline">
            Back to Admin
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
              <h2 className="text-xl font-display font-semibold mb-4 flex items-center gap-2">
                {editFighterId ? <Edit size={20} /> : <Plus size={20} />}
                {editFighterId ? 'Edit Freedom Fighter' : 'Add Freedom Fighter'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Years (Birth-Death)</label>
                    <Input
                      value={years}
                      onChange={(e) => setYears(e.target.value)}
                      placeholder="e.g., 1869-1948"
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
                      {states.map((state) => (
                        <option key={state.id} value={state.name}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>
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
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Key Contribution</label>
                  <Input
                    value={contribution}
                    onChange={(e) => setContribution(e.target.value)}
                    placeholder="Brief description of key contribution"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Biography</label>
                  <textarea
                    value={biography}
                    onChange={(e) => setBiography(e.target.value)}
                    placeholder="Enter detailed biography"
                    className="w-full min-h-[200px] rounded-md border border-input bg-transparent px-3 py-2"
                    required
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editFighterId ? (
                      <>
                        <Edit className="mr-2" size={18} />
                        Update Fighter
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2" size={18} />
                        Add Fighter
                      </>
                    )}
                  </Button>
                  
                  {editFighterId && (
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
                <User size={20} />
                Freedom Fighters List
              </h2>
              
              {fighters.length > 0 ? (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {fighters.map((fighter) => (
                    <div key={fighter.id} className="p-4 border border-border rounded-lg">
                      <div className="flex gap-4">
                        <img 
                          src={fighter.image} 
                          alt={fighter.name} 
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{fighter.name}</h3>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleEditClick(fighter.id)}
                              >
                                <Edit size={16} />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                onClick={() => handleDelete(fighter.id)}
                              >
                                <Trash size={16} />
                              </Button>
                            </div>
                          </div>
                          <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                            <p className="flex items-center gap-1">
                              <Calendar size={14} />
                              {fighter.years}
                            </p>
                            <p className="flex items-center gap-1">
                              <MapPin size={14} />
                              {fighter.state}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {fighter.contribution}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No freedom fighters added yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ManageFreedomFighters;
