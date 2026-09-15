import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginAsPreset: (presetKey: 'citizen_1' | 'citizen_2' | 'admin_1' | 'admin_2') => Promise<User>;
  loginCitizen: (phone: string, otp: string) => Promise<User>;
  loginAdmin: (empId: string, pin: string) => Promise<User>;
  switchRole: (targetRole: UserRole) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const current = await authService.getCurrentUser();
        setUser(current);
      } catch (err) {
        console.error('Session restore error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const loginAsPreset = async (presetKey: 'citizen_1' | 'citizen_2' | 'admin_1' | 'admin_2') => {
    setIsLoading(true);
    try {
      const u = await authService.loginAsPreset(presetKey);
      setUser(u);
      return u;
    } finally {
      setIsLoading(false);
    }
  };

  const loginCitizen = async (phone: string, otp: string) => {
    setIsLoading(true);
    try {
      const u = await authService.loginCitizen(phone, otp);
      setUser(u);
      return u;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAdmin = async (empId: string, pin: string) => {
    setIsLoading(true);
    try {
      const u = await authService.loginAdmin(empId, pin);
      setUser(u);
      return u;
    } finally {
      setIsLoading(false);
    }
  };

  const switchRole = async (targetRole: UserRole) => {
    setIsLoading(true);
    try {
      const u = await authService.switchRole(targetRole);
      setUser(u);
      return u;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'CITIZEN',
        isAuthenticated: !!user,
        isLoading,
        loginAsPreset,
        loginCitizen,
        loginAdmin,
        switchRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
