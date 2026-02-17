import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';
type Language = 'ar' | 'en';

interface UIState {
  theme: Theme;
  language: Language;
  direction: 'rtl' | 'ltr';
  isSidebarCollapsed: boolean;
  
  // Actions
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'system',
      language: 'ar',
      direction: 'rtl',
      isSidebarCollapsed: false,
      
      setTheme: (theme) => set({ theme }),
      
      setLanguage: (language) => set({
        language,
        direction: language === 'ar' ? 'rtl' : 'ltr',
      }),
      
      toggleSidebar: () => set((prev) => ({
        isSidebarCollapsed: !prev.isSidebarCollapsed,
      })),
      
      setSidebarCollapsed: (collapsed) => set({
        isSidebarCollapsed: collapsed,
      }),
    }),
    {
      name: 'ui-storage',
    }
  )
);

// Helper to apply theme
export const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  
  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }
};

// Helper to apply direction
export const applyDirection = (direction: 'rtl' | 'ltr') => {
  const root = document.documentElement;
  root.setAttribute('dir', direction);
  root.style.direction = direction;
};
