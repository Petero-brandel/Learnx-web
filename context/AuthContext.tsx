'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

interface User {
  id: number;
  email: string;
  full_name: string;
  profile_photo: string;
  is_staff: boolean;
  is_superuser: boolean;
  date_joined: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (access: string, refresh: string, userData?: User) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/me/');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = Cookies.get('access_token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (access: string, refresh: string, userData?: User) => {
    Cookies.set('access_token', access, { secure: true, sameSite: 'strict' });
    Cookies.set('refresh_token', refresh, { secure: true, sameSite: 'strict' });
    
    if (userData) {
      setUser(userData);
      redirectBasedOnRole(userData);
    } else {
      await fetchUser();
      // Need to rely on updated state, but state update is async, so we'll fetch explicitly and redirect
      try {
        const response = await api.get('/auth/me/');
        const fetchedUser = response.data;
        redirectBasedOnRole(fetchedUser);
      } catch (err) {
        // Fallback
        router.push('/dashboard');
      }
    }
  };

  const redirectBasedOnRole = (userData: User) => {
    if (userData.is_staff || userData.is_superuser) {
      router.push('/admin/dashboard');
    } else {
      router.push('/dashboard');
    }
  };

  const logout = () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
