'use client';

import { useTheme } from './theme-provider';
import { Moon, Sun, Monitor, Check } from 'lucide-react';

export function ThemeSwitcher() {
  const { design, themeMode, setDesign, setThemeMode } = useTheme();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 space-y-4">
        {/* Design Selector */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Design</p>
          <div className="flex gap-2">
            <button
              onClick={() => setDesign('A')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                design === 'A'
                  ? 'bg-slate-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="flex items-center gap-2">
                {design === 'A' && <Check className="w-4 h-4" />}
                Design A
              </span>
            </button>
            <button
              onClick={() => setDesign('B')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                design === 'B'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="flex items-center gap-2">
                {design === 'B' && <Check className="w-4 h-4" />}
                Design B
              </span>
            </button>
          </div>
        </div>

        {/* Theme Mode Selector */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Thema</p>
          <div className="flex gap-2">
            <button
              onClick={() => setThemeMode('light')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                themeMode === 'light'
                  ? 'bg-amber-100 text-amber-700 border-2 border-amber-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Sun className="w-4 h-4" />
              Light
            </button>
            <button
              onClick={() => setThemeMode('dark')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                themeMode === 'dark'
                  ? 'bg-slate-800 text-white border-2 border-slate-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Moon className="w-4 h-4" />
              Dark
            </button>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            Huidig: {design === 'A' ? 'Spaarslimmer Pro' : 'Smart Energy'} • {themeMode === 'dark' ? 'Dark' : 'Light'}
          </p>
        </div>
      </div>
    </div>
  );
}

// Compact version for navbar
export function ThemeToggle() {
  const { themeMode, toggleTheme, design, setDesign } = useTheme();

  return (
    <div className="flex items-center gap-2">
      {/* Design Toggle */}
      <button
        onClick={() => setDesign(design === 'A' ? 'B' : 'A')}
        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        title={`Switch to Design ${design === 'A' ? 'B' : 'A'}`}
      >
        <Monitor className="w-4 h-4 text-gray-600" />
      </button>
      
      {/* Dark/Light Toggle */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        title={themeMode === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
      >
        {themeMode === 'dark' ? (
          <Sun className="w-4 h-4 text-amber-500" />
        ) : (
          <Moon className="w-4 h-4 text-slate-700" />
        )}
      </button>
    </div>
  );
}
