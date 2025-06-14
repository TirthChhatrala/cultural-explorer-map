
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BackToAdmin = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <Button
        onClick={() => navigate('/admin')}
        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white shadow-lg"
        size="sm"
      >
        <Shield className="h-4 w-4" />
        Back to Admin
      </Button>
    </div>
  );
};

export default BackToAdmin;
