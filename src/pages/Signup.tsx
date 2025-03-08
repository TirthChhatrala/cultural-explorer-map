
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { User, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';

const Signup = () => {
  const { theme } = useTheme();
  const { signup } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (!agreedToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      return;
    }
    
    const success = signup(name, email, password);
    if (success) {
      toast({
        title: "Account created successfully",
        description: "Welcome to Indian Cultural Explorer",
      });
      navigate('/dashboard');
    } else {
      setError('Email already exists. Please try another email or login.');
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
              <h1 className="text-3xl font-display font-bold mb-2">Create Account</h1>
              <p className="text-muted-foreground">Join Indian Cultural Explorer</p>
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
                <label htmlFor="name" className="block text-sm font-medium">Full Name</label>
                <div className={`flex items-center rounded-lg border ${
                  theme === 'dark' ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200'
                } px-3 py-2`}>
                  <User className="w-5 h-5 text-muted-foreground mr-2" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className={`w-full bg-transparent focus:outline-none ${
                      theme === 'dark' ? 'placeholder:text-gray-500' : 'placeholder:text-gray-400'
                    }`}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">Email</label>
                <div className={`flex items-center rounded-lg border ${
                  theme === 'dark' ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200'
                } px-3 py-2`}>
                  <Mail className="w-5 h-5 text-muted-foreground mr-2" />
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
                <label htmlFor="password" className="block text-sm font-medium">Password</label>
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
              
              <div className="flex items-start">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-india-orange focus:ring-india-orange mt-1"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-muted-foreground">
                  I agree to the{' '}
                  <Link to="#" className="text-india-orange hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="#" className="text-india-orange hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-lg bg-india-orange text-white font-medium hover:bg-india-orange/90 transition-colors flex items-center justify-center gap-2"
                type="submit"
              >
                Sign Up
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-india-orange hover:underline font-medium">
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Signup;
