
import React from 'react';
import Layout from '../../components/Layout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const ManageStates = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stateName, setStateName] = useState('');
  const [capital, setCapital] = useState('');
  const [description, setDescription] = useState('');
  
  if (!isAdmin) {
    navigate('/login');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic will be implemented with Supabase integration
    console.log('State details submitted:', { stateName, capital, description });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-display font-bold mb-6">Manage States</h1>
        
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
          
          <Button type="submit" className="w-full">Save State Information</Button>
        </form>
      </div>
    </Layout>
  );
};

export default ManageStates;
