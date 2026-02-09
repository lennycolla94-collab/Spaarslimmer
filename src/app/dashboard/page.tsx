'use client';

import { useState, useEffect } from 'react';
import { DesignADashboard } from '@/components/dashboard/design-a';
import { DesignBDashboard } from '@/components/dashboard/design-b';
import { Button } from '@/components/ui/button';
import { Palette, Sparkles, Check, Moon, Sun } from 'lucide-react';

type Design = 'A' | 'B';
type ThemeMode = 'dark' | 'light';

export default function DashboardPage() {
  const [design, setDesign] = useState<Design>('A');
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [showSelector, setShowSelector] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedDesign = localStorage.getItem('dashboard-design') as Design;
    const savedTheme = localStorage.getItem('dashboard-theme') as ThemeMode;
    
    if (savedDesign && (savedDesign === 'A' || savedDesign === 'B')) {
      setDesign(savedDesign);
    }
    if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
      setThemeMode(savedTheme);
    }
    setMounted(true);
  }, []);

  // Save to localStorage when changed
  const handleSetDesign = (newDesign: Design) => {
    setDesign(newDesign);
    localStorage.setItem('dashboard-design', newDesign);
    setShowSelector(false);
  };

  const handleSetThemeMode = (newMode: ThemeMode) => {
    setThemeMode(newMode);
    localStorage.setItem('dashboard-theme', newMode);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return <div className="min-h-screen bg-gray-100" />;
  }

  // Show dashboard
  if (!showSelector) {
    return (
      <>
        {design === 'A' ? (
          <DesignADashboard themeMode={themeMode} onThemeChange={handleSetThemeMode} />
        ) : (
          <DesignBDashboard />
        )}
        <button
          onClick={() => setShowSelector(true)}
          className="fixed bottom-6 right-6 z-50 p-4 bg-white rounded-full shadow-xl border border-gray-200 hover:shadow-2xl transition-all"
          title="Wissel design/thema"
        >
          <Palette className="w-6 h-6 text-orange-500" />
        </button>
      </>
    );
  }

  // Show design selector
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Kies je Dashboard Design
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Twee unieke designs, elk met hun eigen karakter. 
            Kies je favoriete layout én thema (Dark/Light).
          </p>
        </div>

        {/* Theme Mode Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-2 flex gap-2">
            <button
              onClick={() => handleSetThemeMode('light')}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                themeMode === 'light'
                  ? 'bg-amber-100 text-amber-700 border-2 border-amber-300'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Sun className="w-5 h-5" />
              Light Mode
            </button>
            <button
              onClick={() => handleSetThemeMode('dark')}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                themeMode === 'dark'
                  ? 'bg-slate-800 text-white border-2 border-slate-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Moon className="w-5 h-5" />
              Dark Mode
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Design A Card */}
          <div 
            onClick={() => handleSetDesign('A')}
            className={`bg-white rounded-3xl shadow-xl overflow-hidden cursor-pointer hover:shadow-2xl transition-all hover:scale-105 group ${
              design === 'A' ? 'ring-4 ring-orange-500' : ''
            }`}
          >
            <div className={`h-56 relative ${
              themeMode === 'dark' 
                ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
                : 'bg-gradient-to-br from-blue-500 to-cyan-400'
            }`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <Palette className="w-16 h-16 mx-auto mb-4 opacity-80" />
                  <p className="text-2xl font-bold">Spaarslimmer Pro</p>
                  <p className="text-sm opacity-80 mt-2">Gamification Focus</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Design A</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  {themeMode === 'dark' ? 'Donkere sidebar' : 'Lichte sidebar met blauw accent'}
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Gamification: XP, levels, challenges
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Team Pulse activiteiten feed
                </li>
              </ul>
              <Button 
                className={`w-full mt-6 ${
                  themeMode === 'dark' ? 'bg-slate-900 hover:bg-slate-800' : 'bg-blue-600 hover:bg-blue-700'
                }`}
                onClick={() => handleSetDesign('A')}
              >
                Kies Design A
              </Button>
            </div>
          </div>

          {/* Design B Card */}
          <div 
            onClick={() => handleSetDesign('B')}
            className={`bg-white rounded-3xl shadow-xl overflow-hidden cursor-pointer hover:shadow-2xl transition-all hover:scale-105 group ${
              design === 'B' ? 'ring-4 ring-orange-500' : ''
            }`}
          >
            <div className="h-56 bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-80" />
                  <p className="text-2xl font-bold">Smart Energy</p>
                  <p className="text-sm text-orange-100 mt-2">Productiviteit Focus</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Design B</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Moderne lichte sidebar met gradient
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Focus op doelen en voortgang
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Quick actions voor snelle toegang
                </li>
              </ul>
              <Button 
                className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90"
                onClick={() => handleSetDesign('B')}
              >
                Kies Design B
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
