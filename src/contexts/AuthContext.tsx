// ALPHA TRECKER - Auth Context

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AuthState } from '@/types';
import { createUser, getUserByUsername, getCurrentUser, setCurrentUser } from '@/services/database';
import { verifyPassword } from '@/services/crypto';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const user = getCurrentUser();
    setState({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    });
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const user = getUserByUsername(username);
    
    if (!user) {
      return { success: false, error: 'Invalid username or password' };
    }
    
    const isValid = await verifyPassword(password, user.passwordHash);
    
    if (!isValid) {
      return { success: false, error: 'Invalid username or password' };
    }
    
    setCurrentUser(user);
    setState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
    
    return { success: true };
  };

  const register = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (username.length < 3) {
      return { success: false, error: 'Username must be at least 3 characters' };
    }
    
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }
    
    const user = await createUser(username, password);
    
    if (!user) {
      return { success: false, error: 'Username already exists' };
    }
    
    setCurrentUser(user);
    setState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
    
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
