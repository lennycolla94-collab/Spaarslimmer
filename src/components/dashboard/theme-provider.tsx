'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Design = 'A' | 'B';
type ThemeMode = 'dark' | 'light';

interface ThemeContextType {
  design: Design;
  themeMode: ThemeMode;
  setDesign: (design: Design) => void;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [design, setDesignState] = useState<Design>('A');
  const [themeMode, setThemeModeState] = useState<ThemeMode>('dark');
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedDesign = localStorage.getItem('dashboard-design') as Design;
    const savedTheme = localStorage.getItem('dashboard-theme') as ThemeMode;
    
    if (savedDesign && (savedDesign === 'A' || savedDesign === 'B')) {
      setDesignState(savedDesign);
    }
    if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
      setThemeModeState(savedTheme);
    }
    setMounted(true);
  }, []);

  // Save to localStorage when changed
  const setDesign = (newDesign: Design) => {
    setDesignState(newDesign);
    localStorage.setItem('dashboard-design', newDesign);
  };

  const setThemeMode = (newMode: ThemeMode) => {
    setThemeModeState(newMode);
    localStorage.setItem('dashboard-theme', newMode);
  };

  const toggleTheme = () => {
    const newMode = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(newMode);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ 
      design, 
      themeMode, 
      setDesign, 
      setThemeMode,
      toggleTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
