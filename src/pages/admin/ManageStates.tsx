
import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/use-toast';
import {
  MapPin,
  Plus,
  Trash,
  Edit,
  Check
} from 'lucide-react';

const ManageStates = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stateName, setStateName] = useState('');
  const [capital, setCapital] = useState('');
  const [description, setDescription] = useState('');
  const [states, setStates] = useState([
    { id: 1, name: 'Kerala', capital: 'Thiruvananthapuram', description: 'Kerala is known for its backwaters and beautiful beaches.' },
    { id: 2, name: 'Tamil Nadu', capital: 'Chennai', description: 'Tamil Nadu is famous for its temples and rich cultural heritage.' },
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
    
    // Form submission logic will be implemented with Supabase integration
    const newState = {
      id: states.length + 1,
      name: stateName,
      capital,
      description
    };
    
    setStates([...states, newState]);
    
    toast({
      title: "State Added Successfully",
      description: `${stateName} has been added to the database.`,
    });
    
    // Reset form fields
    setStateName('');
    setCapital('');
    setDescription('');
  };

  const handleDelete = (id: number) => {
    setStates(states.filter(state => state.id !== id));
    toast({
      title: "State Deleted",
      description: "The state has been removed from the database.",
      variant: "destructive",
    });
  };

  if (!isAdmin) return null;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-display font-bold">Manage States</h1>
          <Button onClick={() => navigate('/admin')} variant="outline">
            Back to Admin
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
              <h2 className="text-xl font-display font-semibold mb-4 flex items-center gap-2">
                <Plus size={20} />
                Add New State
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">State Name</label>
                  <Input
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="Enter state name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Capital</label>
                  <Input
                    value={capital}
                    onChange={(e) => setCapital(e.target.value)}
                    placeholder="Enter state capital"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter state description"
                    className="w-full min-h-[150px] rounded-md border border-input bg-transparent px-3 py-2"
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  <Plus className="mr-2" size={18} />
                  Save State Information
                </Button>
              </form>
            </div>
          </div>
          
          <div>
            <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
              <h2 className="text-xl font-display font-semibold mb-4 flex items-center gap-2">
                <MapPin size={20} />
                Existing States
              </h2>
              
              {states.length > 0 ? (
                <div className="space-y-4">
                  {states.map((state) => (
                    <div key={state.id} className="p-4 border border-border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{state.name}</h3>
                          <p className="text-sm text-muted-foreground">Capital: {state.capital}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit size={16} />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => handleDelete(state.id)}
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
                  No states added yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ManageStates;
