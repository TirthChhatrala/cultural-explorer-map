
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  name: string;
  email: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Load user data from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
      setIsAdmin(parsedUser.isAdmin || false);
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    // Check if it's the admin account
    if (email === 'admin@gmail.com' && password === 'admin@123') {
      const adminUser = { name: 'Admin', email: email, isAdmin: true };
      setUser(adminUser);
      setIsAuthenticated(true);
      setIsAdmin(true);
      localStorage.setItem('user', JSON.stringify(adminUser));
      return true;
    }
    
    // Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const userData = { name: foundUser.name, email: foundUser.email };
      setUser(userData);
      setIsAuthenticated(true);
      setIsAdmin(false);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const signup = (name: string, email: string, password: string): boolean => {
    // Prevent creating an account with admin email
    if (email === 'admin@gmail.com') {
      return false;
    }
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = users.some((u: any) => u.email === email);
    
    if (userExists) {
      return false;
    }
    
    // Add new user
    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login after signup
    const userData = { name, email };
    setUser(userData);
    setIsAuthenticated(true);
    setIsAdmin(false);
    localStorage.setItem('user', JSON.stringify(userData));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
