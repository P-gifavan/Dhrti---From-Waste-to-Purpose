/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthContextType, LoginCredentials, SignupCredentials } from '../types/auth';
import { authService } from '../services/authService';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await authService.getProfile();
        if (response.success) {
          setUser(response.data);
        } else {
          logout();
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to fetch profile', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProfile();
  }, [fetchProfile]);

  const login = async (data: LoginCredentials): Promise<User> => {
    try {
      setLoading(true);
      const response = await authService.login(data);
      if (response.success) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data);
        return response.data;
      }
      throw new Error('Login failed');
    } catch (error) {
      console.error('Login error', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: SignupCredentials): Promise<User> => {
    try {
      setLoading(true);
      const response = await authService.signup(data);
      if (response.success) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data);
        return response.data;
      }
      throw new Error('Signup failed');
    } catch (error) {
      console.error('Signup error', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (data: { credential: string; role?: string }): Promise<User> => {
    try {
      setLoading(true);
      const response = await authService.googleLogin(data);
      if (response.success) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data);
        return response.data;
      }
      throw new Error('Google login failed');
    } catch (error) {
      console.error('Google login error', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, signup, googleLogin, logout, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
