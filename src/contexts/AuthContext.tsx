import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  lastLogin: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session
    const storedUser = localStorage.getItem('studentconnect_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('studentconnect_user');
      }
    }
    setIsLoading(false);
  }, []);

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('studentconnect_users') || '[]');
      if (existingUsers.find((u: any) => u.email === email)) {
        toast({
          title: "Account exists",
          description: "An account with this email already exists.",
          variant: "destructive",
        });
        return false;
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      // Store user credentials and data
      const users = [...existingUsers, { ...newUser, password }];
      localStorage.setItem('studentconnect_users', JSON.stringify(users));
      localStorage.setItem('studentconnect_user', JSON.stringify(newUser));
      
      setUser(newUser);
      
      toast({
        title: "Welcome to StudentConnect! 🎉",
        description: "Your account has been created successfully.",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const users = JSON.parse(localStorage.getItem('studentconnect_users') || '[]');
      const foundUser = users.find((u: any) => u.email === email && u.password === password);
      
      if (!foundUser) {
        toast({
          title: "Invalid credentials",
          description: "Please check your email and password.",
          variant: "destructive",
        });
        return false;
      }

      // Update last login
      const updatedUser = {
        ...foundUser,
        lastLogin: new Date().toISOString(),
      };
      delete updatedUser.password; // Don't store password in user session
      
      localStorage.setItem('studentconnect_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast({
        title: `Welcome back, ${updatedUser.name}! 👋`,
        description: "You've been signed in successfully.",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('studentconnect_user');
    setUser(null);
    toast({
      title: "Goodbye! 👋",
      description: "You've been signed out successfully.",
    });
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    localStorage.setItem('studentconnect_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    // Also update in users array
    const users = JSON.parse(localStorage.getItem('studentconnect_users') || '[]');
    const updatedUsers = users.map((u: any) => 
      u.id === user.id ? { ...u, ...updates } : u
    );
    localStorage.setItem('studentconnect_users', JSON.stringify(updatedUsers));
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateUser,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};