'use client';

import { useState } from 'react';
import { MobileDesignA } from '@/components/dashboard/mobile-design-a';
import { MobileDesignB } from '@/components/dashboard/mobile-design-b';
import { Smartphone, Monitor, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function MobilePreviewPage() {
  const [activeDesign, setActiveDesign] = useState<'A' | 'B'>('A');
  const [showFrame, setShowFrame] = useState(true);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              📱 Mobile Design Preview
            </h1>
            <p className="text-gray-400">
              Vergelijk beide mobile designs. Klik op de pijlen om te wisselen.
            </p>
          </div>
          <div className="flex gap-4">
            <Link 
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
            >
              <Monitor className="w-5 h-5" />
              Desktop View
            </Link>
          </div>
        </div>

        {/* Design Switcher */}
        <div className="flex justify-center mt-6">
          <div className="bg-gray-800 rounded-2xl p-2 flex gap-2">
            <button
              onClick={() => setActiveDesign('A')}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeDesign === 'A'
                  ? 'bg-slate-700 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              Design A: Spaarslimmer Pro
            </button>
            <button
              onClick={() => setActiveDesign('B')}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeDesign === 'B'
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              Design B: Smart Energy
            </button>
          </div>
        </div>
      </div>

      {/* Phone Preview */}
      <div className="flex justify-center items-center gap-8">
        {/* Previous Button */}
        <button
          onClick={() => setActiveDesign(activeDesign === 'A' ? 'B' : 'A')}
          className="p-4 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition-colors"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        {/* Phone Frame */}
        <div className={`relative transition-all duration-500 ${showFrame ? 'scale-100' : 'scale-95'}`}>
          {/* Phone Bezel */}
          <div className="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[3rem] h-[800px] w-[375px] shadow-2xl">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-7 bg-gray-800 rounded-b-3xl z-50" />
            
            {/* Screen */}
            <div className="h-full w-full bg-gray-50 rounded-[2.3rem] overflow-hidden overflow-y-auto scrollbar-hide">
              {activeDesign === 'A' ? <MobileDesignA /> : <MobileDesignB />}
            </div>

            {/* Side Buttons */}
            <div className="absolute right-[-16px] top-24 w-[3px] h-10 bg-gray-700 rounded-r" />
            <div className="absolute right-[-16px] top-40 w-[3px] h-16 bg-gray-700 rounded-r" />
            <div className="absolute left-[-16px] top-24 w-[3px] h-16 bg-gray-700 rounded-l" />
          </div>

          {/* Reflection */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-[400px] bg-gradient-to-b from-white/10 to-transparent rounded-t-[3rem] pointer-events-none" />
        </div>

        {/* Next Button */}
        <button
          onClick={() => setActiveDesign(activeDesign === 'A' ? 'B' : 'A')}
          className="p-4 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition-colors"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      {/* Design Info */}
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            {activeDesign === 'A' ? 'Design A: Spaarslimmer Pro' : 'Design B: Smart Energy'}
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400 mb-2">Focus:</p>
              <p className="text-white">
                {activeDesign === 'A' 
                  ? 'Gamification, XP systeem, team competitie' 
                  : 'Productiviteit, doelen, snelle acties'}
              </p>
            </div>
            <div>
              <p className="text-gray-400 mb-2">Best voor:</p>
              <p className="text-white">
                {activeDesign === 'A' 
                  ? 'Competitieve consultants die van challenges houden' 
                  : 'Consultants die gefocust willen werken'}
              </p>
            </div>
            <div>
              <p className="text-gray-400 mb-2">Key Features:</p>
              <ul className="text-white space-y-1">
                {activeDesign === 'A' ? (
                  <>
                    <li>• XP & Level systeem</li>
                    <li>• Daily challenges</li>
                    <li>• Team pulse feed</li>
                    <li>• Achievement badges</li>
                  </>
                ) : (
                  <>
                    <li>• Quick action buttons</li>
                    <li>• Dagelijkse doelen</li>
                    <li>• Pro tips</li>
                    <li>• Team stand</li>
                  </>
                )}
              </ul>
            </div>
            <div>
              <p className="text-gray-400 mb-2">Navigatie:</p>
              <p className="text-white">
                {activeDesign === 'A' 
                  ? 'Bottom tab bar + hamburger menu' 
                  : 'Bottom tab bar + floating action button'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="max-w-2xl mx-auto mt-6 text-center">
        <p className="text-gray-500 text-sm">
          💡 Tip: Scroll in de telefoon om alle content te zien. 
          De telefoon simuleert een echte iPhone 14/15 formaat (375x800px).
        </p>
      </div>
    </div>
  );
}
