
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Search,
  MapPin,
  Calendar,
  User
} from 'lucide-react';
import BackToAdmin from '../../components/BackToAdmin';

interface PoliticalParty {
  id: string;
  name: string;
  founded: string;
  leader: string;
  headquarters: string;
  description: string;
  ideology: string;
  states: string[];
}

const ManagePolitical = () => {
  const { theme } = useTheme();
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingParty, setEditingParty] = useState<PoliticalParty | null>(null);

  // Mock data for political parties
  const [parties, setParties] = useState<PoliticalParty[]>([
    {
      id: '1',
      name: 'Bharatiya Janata Party (BJP)',
      founded: '1980',
      leader: 'Narendra Modi',
      headquarters: 'New Delhi',
      description: 'A major political party in India with a nationalist ideology.',
      ideology: 'Hindu Nationalism, Conservatism',
      states: ['Uttar Pradesh', 'Gujarat', 'Madhya Pradesh', 'Rajasthan']
    },
    {
      id: '2',
      name: 'Indian National Congress (INC)',
      founded: '1885',
      leader: 'Mallikarjun Kharge',
      headquarters: 'New Delhi',
      description: 'One of the oldest political parties in India.',
      ideology: 'Social Democracy, Secularism',
      states: ['Karnataka', 'Himachal Pradesh', 'Chhattisgarh']
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    founded: '',
    leader: '',
    headquarters: '',
    description: '',
    ideology: '',
    states: ''
  });

  const filteredParties = parties.filter(party =>
    party.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    party.leader.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (party: PoliticalParty) => {
    setEditingParty(party);
    setFormData({
      name: party.name,
      founded: party.founded,
      leader: party.leader,
      headquarters: party.headquarters,
      description: party.description,
      ideology: party.ideology,
      states: party.states.join(', ')
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.leader) {
      toast({
        title: "Validation Error",
        description: "Party name and leader are required fields",
        variant: "destructive"
      });
      return;
    }

    const partyData = {
      ...formData,
      states: formData.states.split(',').map(s => s.trim()).filter(s => s.length > 0),
      id: editingParty?.id || Date.now().toString()
    };

    if (editingParty) {
      setParties(parties.map(p => p.id === editingParty.id ? partyData as PoliticalParty : p));
      toast({
        title: "Party Updated",
        description: `${partyData.name} has been updated successfully`
      });
    } else {
      setParties([...parties, partyData as PoliticalParty]);
      toast({
        title: "Party Added",
        description: `${partyData.name} has been added successfully`
      });
    }

    resetForm();
  };

  const handleDelete = (id: string) => {
    const party = parties.find(p => p.id === id);
    setParties(parties.filter(p => p.id !== id));
    toast({
      title: "Party Deleted",
      description: `${party?.name} has been removed successfully`
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      founded: '',
      leader: '',
      headquarters: '',
      description: '',
      ideology: '',
      states: ''
    });
    setEditingParty(null);
    setIsEditing(false);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold mb-2">Political Parties Management</h1>
              <p className="text-muted-foreground">Manage political party information and details</p>
            </div>
            <Button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600"
            >
              <Plus size={18} />
              Add New Party
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search size={20} />
                    Search Political Parties
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    placeholder="Search by party name or leader..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </CardContent>
              </Card>

              <div className="space-y-4">
                {filteredParties.map((party) => (
                  <Card key={party.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2">{party.name}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <User size={16} />
                              <span>Leader: {party.leader}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar size={16} />
                              <span>Founded: {party.founded}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin size={16} />
                              <span>HQ: {party.headquarters}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Users size={16} />
                              <span>{party.states.length} states</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{party.description}</p>
                          <p className="text-sm"><strong>Ideology:</strong> {party.ideology}</p>
                          <div className="mt-2">
                            <p className="text-sm font-medium mb-1">Active States:</p>
                            <div className="flex flex-wrap gap-1">
                              {party.states.map((state, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded-full"
                                >
                                  {state}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(party)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(party.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {isEditing && (
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {editingParty ? 'Edit Political Party' : 'Add New Political Party'}
                    </CardTitle>
                    <CardDescription>
                      {editingParty ? 'Update party information' : 'Enter details for the new political party'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Party Name*</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Enter party name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="leader">Current Leader*</Label>
                      <Input
                        id="leader"
                        value={formData.leader}
                        onChange={(e) => setFormData({...formData, leader: e.target.value})}
                        placeholder="Enter current leader name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="founded">Founded Year</Label>
                      <Input
                        id="founded"
                        value={formData.founded}
                        onChange={(e) => setFormData({...formData, founded: e.target.value})}
                        placeholder="e.g., 1980"
                      />
                    </div>

                    <div>
                      <Label htmlFor="headquarters">Headquarters</Label>
                      <Input
                        id="headquarters"
                        value={formData.headquarters}
                        onChange={(e) => setFormData({...formData, headquarters: e.target.value})}
                        placeholder="Enter headquarters location"
                      />
                    </div>

                    <div>
                      <Label htmlFor="ideology">Ideology</Label>
                      <Input
                        id="ideology"
                        value={formData.ideology}
                        onChange={(e) => setFormData({...formData, ideology: e.target.value})}
                        placeholder="e.g., Social Democracy, Conservatism"
                      />
                    </div>

                    <div>
                      <Label htmlFor="states">Active States</Label>
                      <Input
                        id="states"
                        value={formData.states}
                        onChange={(e) => setFormData({...formData, states: e.target.value})}
                        placeholder="Enter states separated by commas"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Enter party description"
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleSave} className="flex-1">
                        {editingParty ? 'Update' : 'Add'} Party
                      </Button>
                      <Button variant="outline" onClick={resetForm}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </motion.div>
      </div>
      <BackToAdmin />
    </div>
  );
};

export default ManagePolitical;
