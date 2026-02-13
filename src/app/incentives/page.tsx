'use client';

import { PageContainer, PageHeader, SmartCard, ActionButton } from '@/components/design-system/page-container';
import { Gift, ArrowLeft, Target, Plane, Star, Trophy, Lock, CheckCircle2 } from 'lucide-react';

export default function IncentivesPage() {
  const currentASP = 8;
  
  return (
    <PageContainer>
      <PageHeader
        title="Incentives"
        subtitle="Jouw beloningen en targets"
        icon={<Gift className="w-6 h-6 text-white" />}
        action={
          <ActionButton href="/dashboard" variant="secondary" icon={<ArrowLeft className="w-4 h-4" />}>
            Dashboard
          </ActionButton>
        }
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* PQS */}
        <SmartCard className="p-6 mb-6 border-l-4 border-yellow-500">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold">PQS - Personal Quick Start</h3>
              <p className="text-gray-500">Behaal 12 ASP binnen 30 dagen</p>
            </div>
          </div>
          <div className="flex justify-between mb-2">
            <span>{currentASP} / 12 ASP</span>
            <span className="font-bold text-yellow-600">€150 bonus</span>
          </div>
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full" style={{ width: `${(currentASP/12)*100}%` }} />
          </div>
        </SmartCard>

        {/* Quarterly Gifts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {['Q1 Gadget Box', 'Q2 Headphones', 'Q3 Watch', 'Q4 Exclusive'].map((gift, i) => (
            <SmartCard key={gift} className={`p-4 text-center ${i === 0 ? 'bg-pink-50 border-pink-300' : 'opacity-60'}`}>
              <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${i === 0 ? 'bg-pink-500 text-white' : 'bg-gray-300'}`}>
                {i === 0 ? <CheckCircle2 className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
              </div>
              <p className="font-medium text-sm">{gift}</p>
              <p className="text-xs text-pink-600">{(i+1)*15} ASP</p>
            </SmartCard>
          ))}
        </div>

        {/* Portugal */}
        <SmartCard className="p-6 border-l-4 border-blue-500">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
              <Plane className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">Portugal Seminarie</h3>
              <p className="text-gray-500">Algarve, September 2025 • 100 ASP nodig</p>
              <div className="mt-2 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '80%' }} />
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-600">80</p>
              <p className="text-sm text-gray-500">/ 100 ASP</p>
            </div>
          </div>
        </SmartCard>
      </main>
    </PageContainer>
  );
}
