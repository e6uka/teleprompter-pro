import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, updateTheme } = useTheme();

  const toggleTheme = () => {
    const modes = ['light', 'dark', 'system'] as const;
    const currentIndex = modes.indexOf(theme.mode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    updateTheme({ mode: nextMode });
  };

  const getIcon = () => {
    switch (theme.mode) {
      case 'light':
        return Sun;
      case 'dark':
        return Moon;
      case 'system':
        return Monitor;
    }
  };

  const Icon = getIcon();

  return (
    <motion.button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={`Current: ${theme.mode} mode`}
    >
      <Icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
    </motion.button>
  );
};