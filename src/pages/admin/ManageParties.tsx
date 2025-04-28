
import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/use-toast';
import {
  Users,
  Plus,
  Trash,
  Edit
} from 'lucide-react';
import { states } from '../../data/states';
import { Party } from '../../hooks/usePartyFilter';

const ManageParties = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [abbreviation, setAbbreviation] = useState('');
  const [founded, setFounded] = useState<number>(0);
  const [ideology, setIdeology] = useState('');
  const [leader, setLeader] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState('');
  const [color, setColor] = useState('#FF0000');
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  
  const [editPartyId, setEditPartyId] = useState<number | null>(null);
  
  const [parties, setParties] = useState<Party[]>([
    {
      id: 1,
      name: "Bharatiya Janata Party",
      abbreviation: "BJP",
      founded: 1980,
      ideology: "Conservatism, Nationalism",
      leader: "Narendra Modi",
      description: "The Bharatiya Janata Party is one of the two major political parties in India, along with the Indian National Congress.",
      logo: "/lovable-uploads/87e03e01-1cae-414e-8e9d-f0e1eb9b6b92.png",
      color: "#FF9933",
      states: ["gujarat", "uttar-pradesh", "madhya-pradesh"]
    },
    {
      id: 2,
      name: "Indian National Congress",
      abbreviation: "INC",
      founded: 1885,
      ideology: "Liberalism, Social democracy",
      leader: "Mallikarjun Kharge",
      description: "The Indian National Congress is a political party that was dominant in India from independence until the 1990s.",
      logo: "/lovable-uploads/87e03e01-1cae-414e-8e9d-f0e1eb9b6b92.png",
      color: "#0078D7",
      states: ["rajasthan", "punjab", "karnataka"]
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
    if (editPartyId !== null) {
      const partyToEdit = parties.find(party => party.id === editPartyId);
      if (partyToEdit) {
        setName(partyToEdit.name);
        setAbbreviation(partyToEdit.abbreviation);
        setFounded(partyToEdit.founded);
        setIdeology(partyToEdit.ideology);
        setLeader(partyToEdit.leader);
        setDescription(partyToEdit.description);
        setLogo(partyToEdit.logo);
        setColor(partyToEdit.color);
        setSelectedStates(partyToEdit.states);
      }
    }
  }, [editPartyId, parties]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedStates.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select at least one state",
        variant: "destructive",
      });
      return;
    }
    
    if (editPartyId !== null) {
      // Editing existing party
      setParties(prevParties => {
        return prevParties.map(party => {
          if (party.id === editPartyId) {
            return {
              ...party,
              name,
              abbreviation,
              founded,
              ideology,
              leader,
              description,
              logo,
              color,
              states: selectedStates
            };
          }
          return party;
        });
      });

      toast({
        title: "Party Updated",
        description: "Political party information has been updated successfully.",
      });
    } else {
      // Adding new party
      const newParty: Party = {
        id: parties.length > 0 ? Math.max(...parties.map(p => p.id)) + 1 : 1,
        name,
        abbreviation,
        founded,
        ideology,
        leader,
        description,
        logo,
        color,
        states: selectedStates
      };
      
      setParties([...parties, newParty]);
      
      toast({
        title: "Party Added",
        description: "New political party has been added successfully.",
      });
    }
    
    // Reset form fields and edit state
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setAbbreviation('');
    setFounded(0);
    setIdeology('');
    setLeader('');
    setDescription('');
    setLogo('');
    setColor('#FF0000');
    setSelectedStates([]);
    setEditPartyId(null);
  };

  const handleDelete = (id: number) => {
    setParties(parties.filter(party => party.id !== id));
    toast({
      title: "Party Deleted",
      description: "The political party has been removed.",
      variant: "destructive",
    });
  };

  const handleEditClick = (id: number) => {
    setEditPartyId(id);
  };
  
  const handleStateSelection = (stateId: string) => {
    setSelectedStates(prev => 
      prev.includes(stateId) 
        ? prev.filter(id => id !== stateId)
        : [...prev, stateId]
    );
  };

  if (!isAdmin) return null;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-display font-bold">Manage Political Parties</h1>
          <Button onClick={() => navigate('/admin')} variant="outline">
            Back to Admin
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
              <h2 className="text-xl font-display font-semibold mb-4 flex items-center gap-2">
                {editPartyId ? <Edit size={20} /> : <Plus size={20} />}
                {editPartyId ? 'Edit Political Party' : 'Add Political Party'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Party Name</label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter party name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Abbreviation</label>
                    <Input
                      value={abbreviation}
                      onChange={(e) => setAbbreviation(e.target.value)}
                      placeholder="e.g., BJP"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Founded Year</label>
                    <Input
                      type="number"
                      value={founded || ''}
                      onChange={(e) => setFounded(parseInt(e.target.value) || 0)}
                      placeholder="e.g., 1980"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Party Color</label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-12 h-9 p-1"
                      />
                      <Input
                        type="text"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        placeholder="#RRGGBB"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ideology</label>
                    <Input
                      value={ideology}
                      onChange={(e) => setIdeology(e.target.value)}
                      placeholder="e.g., Conservatism, Nationalism"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Party Leader</label>
                    <Input
                      value={leader}
                      onChange={(e) => setLeader(e.target.value)}
                      placeholder="Current party leader"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Logo URL</label>
                  <Input
                    value={logo}
                    onChange={(e) => setLogo(e.target.value)}
                    placeholder="Enter logo URL"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief party description"
                    className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">States Active In</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                    {states.map(state => (
                      <div key={state.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`state-${state.id}`}
                          checked={selectedStates.includes(state.id)}
                          onChange={() => handleStateSelection(state.id)}
                          className="mr-2"
                        />
                        <label htmlFor={`state-${state.id}`} className="text-sm">
                          {state.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editPartyId ? (
                      <>
                        <Edit className="mr-2" size={18} />
                        Update Party
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2" size={18} />
                        Add Party
                      </>
                    )}
                  </Button>
                  
                  {editPartyId && (
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
                <Users size={20} />
                Political Parties List
              </h2>
              
              {parties.length > 0 ? (
                <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
                  {parties.map((party) => (
                    <div 
                      key={party.id} 
                      className="p-4 border border-border rounded-lg"
                      style={{ borderLeftWidth: '4px', borderLeftColor: party.color }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          <div 
                            className="w-12 h-12 flex items-center justify-center rounded-full"
                            style={{ backgroundColor: `${party.color}20` }}
                          >
                            <img 
                              src={party.logo} 
                              alt={party.name} 
                              className="w-8 h-8 object-contain"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{party.name}</h3>
                              <span className="text-sm text-muted-foreground">({party.abbreviation})</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Founded: {party.founded} • Leader: {party.leader}
                            </p>
                            <p className="text-sm font-medium mt-1">
                              {party.ideology}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {party.description}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {party.states.slice(0, 3).map(stateId => (
                                <span 
                                  key={stateId} 
                                  className="px-2 py-0.5 bg-secondary text-xs rounded-full"
                                >
                                  {states.find(s => s.id === stateId)?.name || stateId}
                                </span>
                              ))}
                              {party.states.length > 3 && (
                                <span className="px-2 py-0.5 bg-secondary text-xs rounded-full">
                                  +{party.states.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditClick(party.id)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => handleDelete(party.id)}
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
                  No political parties added yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ManageParties;
