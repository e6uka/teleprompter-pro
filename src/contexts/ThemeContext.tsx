import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Theme } from '../types';

interface ThemeContextType {
  theme: Theme;
  updateTheme: (updates: Partial<Theme>) => void;
  isDark: boolean;
}

const defaultTheme: Theme = {
  mode: 'system',
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  fontSize: 24,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('teleprompter-theme');
    return saved ? JSON.parse(saved) : defaultTheme;
  });

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const determineIsDark = () => {
      if (theme.mode === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      return theme.mode === 'dark';
    };

    setIsDark(determineIsDark());

    if (theme.mode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => setIsDark(mediaQuery.matches);
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [theme.mode]);

  const updateTheme = (updates: Partial<Theme>) => {
    const newTheme = { ...theme, ...updates };
    setTheme(newTheme);
    localStorage.setItem('teleprompter-theme', JSON.stringify(newTheme));
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};