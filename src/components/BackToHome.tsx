
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BackToHome = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <Button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 bg-india-orange hover:bg-india-orange/90 text-white shadow-lg"
        size="sm"
      >
        <Home className="h-4 w-4" />
        Back to Home
      </Button>
    </div>
  );
};

export default BackToHome;
