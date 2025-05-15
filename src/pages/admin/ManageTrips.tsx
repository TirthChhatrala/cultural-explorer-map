
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';

const ManageTrips = () => {
  const { theme } = useTheme();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  if (!isAdmin) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-display font-bold mb-4">Access Denied</h2>
          <p className="text-muted-foreground mb-8">You don't have permission to access this page.</p>
          <Button onClick={() => navigate('/')}>Return Home</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4">
        <section className="mb-8">
          <span className="inline-block px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-sm font-medium mb-4">
            Admin Controls
          </span>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
            Trip Management
          </h1>
          <p className="text-muted-foreground">
            Manage trip packages and custom trip requests
          </p>
        </section>
        
        <div className="p-6 rounded-xl border mb-8 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
          <p>The trip management functionality is currently under development.</p>
        </div>
      </div>
    </Layout>
  );
};

export default ManageTrips;
