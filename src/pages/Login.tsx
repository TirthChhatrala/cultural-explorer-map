
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';

const Login = () => {
  const { theme } = useTheme();
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    const success = login(email, password);
    if (success) {
      toast({
        title: "Login successful",
        description: "Welcome back to Indian Cultural Explorer",
      });
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };
  
  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
          className={`rounded-xl shadow-lg overflow-hidden ${
            theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}
        >
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-display font-bold mb-2">Welcome Back</h1>
              <p className="text-muted-foreground">Sign in to continue to Indian Cultural Explorer</p>
            </div>
            
            {error && (
              <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
                theme === 'dark' ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-500'
              }`}>
                <AlertCircle size={18} />
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">Email</label>
                <div className={`flex items-center rounded-lg border ${
                  theme === 'dark' ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200'
                } px-3 py-2`}>
                  <User className="w-5 h-5 text-muted-foreground mr-2" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="youremail@example.com"
                    className={`w-full bg-transparent focus:outline-none ${
                      theme === 'dark' ? 'placeholder:text-gray-500' : 'placeholder:text-gray-400'
                    }`}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium">Password</label>
                  <Link to="#" className="text-xs text-india-orange hover:underline">Forgot Password?</Link>
                </div>
                <div className={`flex items-center rounded-lg border ${
                  theme === 'dark' ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200'
                } px-3 py-2`}>
                  <Lock className="w-5 h-5 text-muted-foreground mr-2" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full bg-transparent focus:outline-none ${
                      theme === 'dark' ? 'placeholder:text-gray-500' : 'placeholder:text-gray-400'
                    }`}
                  />
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-lg bg-india-orange text-white font-medium hover:bg-india-orange/90 transition-colors flex items-center justify-center gap-2"
                type="submit"
              >
                Log In
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/signup" className="text-india-orange hover:underline font-medium">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Login;
