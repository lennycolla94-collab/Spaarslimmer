'use client';

import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from './theme-provider';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1">
      <button
        onClick={() => setTheme('light')}
        className={`flex items-center justify-center w-8 h-8 rounded-md transition-all ${
          theme === 'light'
            ? 'bg-white dark:bg-gray-700 text-orange-500 shadow-sm'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
        }`}
        title="Light mode"
      >
        <Sun className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`flex items-center justify-center w-8 h-8 rounded-md transition-all ${
          theme === 'dark'
            ? 'bg-white dark:bg-gray-700 text-purple-500 shadow-sm'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
        }`}
        title="Dark mode"
      >
        <Moon className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`flex items-center justify-center w-8 h-8 rounded-md transition-all ${
          theme === 'system'
            ? 'bg-white dark:bg-gray-700 text-blue-500 shadow-sm'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
        }`}
        title="System"
      >
        <Monitor className="w-4 h-4" />
      </button>
    </div>
  );
}
