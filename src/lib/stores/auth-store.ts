import { create } from 'zustand';
import type { User } from '@/lib/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
    organization?: string;
  }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const demoUser: User = {
  id: 'demo-user',
  email: 'demo@gis.pro',
  username: 'demo',
  firstName: 'مستخدم',
  lastName: 'تجريبي',
  role: 'ADMIN',
  organization: 'GIS Maps Pro',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Demo login
      if (email === 'demo@gis.pro' && password === 'demo123') {
        set({
          user: demoUser,
          isLoading: false,
          isAuthenticated: true,
        });
        return;
      }
      
      // Any other login
      if (email && password.length >= 4) {
        set({
          user: { ...demoUser, email, username: email.split('@')[0] },
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        throw new Error('بيانات الدخول غير صحيحة');
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'حدث خطأ غير متوقع',
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: data.email,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        organization: data.organization,
        role: 'USER',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      set({
        user: newUser,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'حدث خطأ أثناء إنشاء الحساب',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));
