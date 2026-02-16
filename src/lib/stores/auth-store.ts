import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/lib/types';

interface AuthState {
  user: User | null;
  token: string | null;
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

// Demo user for testing
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

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // Demo login
          if (email === 'demo@gis.pro' && password === 'demo123') {
            set({
              user: demoUser,
              token: 'demo-token',
              isLoading: false,
              isAuthenticated: true,
            });
            return;
          }
          
          // Try actual API
          try {
            const response = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
              throw new Error(data.error || 'فشل تسجيل الدخول');
            }
            
            set({
              user: data.user,
              token: data.token,
              isLoading: false,
              isAuthenticated: true,
            });
          } catch {
            // Fallback to demo if API fails
            if (email && password.length >= 6) {
              set({
                user: { ...demoUser, email, username: email.split('@')[0] },
                token: 'demo-token',
                isLoading: false,
                isAuthenticated: true,
              });
            } else {
              throw new Error('بيانات الدخول غير صحيحة');
            }
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
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // Demo registration
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
            token: 'demo-token',
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
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'gis-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
