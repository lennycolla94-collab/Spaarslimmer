// Mobile Design B: "Smart Energy" - Productiviteit Focus

'use client';

import { useState } from 'react';
import { 
  Phone, 
  MessageSquare, 
  TrendingUp, 
  Target,
  Award,
  Calendar,
  Plus,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Zap,
  Users,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const quickActions = [
  { icon: Phone, label: 'Nieuwe Call', color: 'bg-blue-500', href: '/call-center' },
  { icon: Plus, label: 'Lead Toevoegen', color: 'bg-green-500', href: '/leads/import' },
  { icon: Award, label: 'Offerte Maken', color: 'bg-purple-500', href: '/offers' },
  { icon: Calendar, label: 'Afspraak', color: 'bg-orange-500', href: '/appointments/new' },
];

const todayGoals = [
  { label: 'Calls maken', current: 12, target: 25, unit: '' },
  { label: 'Gesprekken', current: 8, target: 15, unit: '' },
  { label: 'Offertes', current: 3, target: 5, unit: '' },
];

const recentActivity = [
  { type: 'success', message: 'Gesprek gehad met Jansen Bouw', time: '5 min' },
  { type: 'pending', message: 'Offerte verstuurd naar Peeters IT', time: '12 min' },
  { type: 'success', message: 'Nieuwe sale! Dubois Consulting', time: '1 uur' },
];

export function MobileDesignB() {
  const [selectedDate, setSelectedDate] = useState<'vandaag' | 'week' | 'maand'>('vandaag');

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white sticky top-0 z-40 border-b border-gray-100">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-500">Goedemorgen,</p>
              <h1 className="text-xl font-bold text-gray-900">Consultant! 👋</h1>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              BC
            </div>
          </div>

          {/* Date Selector */}
          <div className="flex gap-2">
            {(['vandaag', 'week', 'maand'] as const).map((date) => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  selectedDate === date 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {date.charAt(0).toUpperCase() + date.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 space-y-4">
        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <Link key={idx} href={action.href}>
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-14 h-14 ${action.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs text-gray-600 text-center font-medium">{action.label}</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Main Stats Card */}
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border-0">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-400 text-sm">Commissie deze maand</p>
                <p className="text-3xl font-bold">€450</p>
              </div>
              <div className="flex items-center gap-1 text-green-400 text-sm">
                <ArrowUpRight className="w-4 h-4" />
                <span>+12%</span>
              </div>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full w-[45%] bg-gradient-to-r from-orange-500 to-red-500 rounded-full" />
            </div>
            <p className="text-sm text-gray-400 mt-2">Doel: €1.000 (45% behaald)</p>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-3">
              <Phone className="w-5 h-5 text-blue-500 mb-2" />
              <p className="text-xl font-bold text-gray-900">108</p>
              <p className="text-xs text-gray-500">Calls</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-3">
              <MessageSquare className="w-5 h-5 text-green-500 mb-2" />
              <p className="text-xl font-bold text-gray-900">73</p>
              <p className="text-xs text-gray-500">Gesprekken</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-3">
              <Target className="w-5 h-5 text-purple-500 mb-2" />
              <p className="text-xl font-bold text-gray-900">67%</p>
              <p className="text-xs text-gray-500">Conversie</p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Goals */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">🎯 Doelen Vandaag</h3>
              <span className="text-xs text-gray-500">{new Date().toLocaleDateString('nl-BE')}</span>
            </div>
            <div className="space-y-4">
              {todayGoals.map((goal) => (
                <div key={goal.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{goal.label}</span>
                    <span className="font-medium">{goal.current} / {goal.target}</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                      style={{ width: `${(goal.current / goal.target) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">🕐 Recente Activiteit</h3>
              <button className="text-sm text-orange-600">Alles</button>
            </div>
            <div className="space-y-3">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className={`mt-0.5 w-2 h-2 rounded-full ${
                    activity.type === 'success' ? 'bg-green-500' : 'bg-yellow-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{activity.message}</p>
                    <p className="text-xs text-gray-400">{activity.time} geleden</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pro Tip */}
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">💡 Pro Tip</p>
                <p className="text-sm text-blue-100 mt-1">
                  Bel tussen 10:00-11:30 voor 23% hogere conversie!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Preview */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">👥 Team Stand</h3>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {['S', 'M', 'L', 'J'].map((letter, idx) => (
                  <div 
                    key={idx}
                    className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white"
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">+12 anderen actief</span>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Floating Action Button */}
      <button className="fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-xl flex items-center justify-center text-white hover:scale-110 transition-transform">
        <Phone className="w-6 h-6" />
      </button>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex justify-between items-center">
          {[
            { icon: Target, label: 'Dashboard', active: true },
            { icon: Phone, label: 'Calls', active: false },
            { icon: Users, label: 'Leads', active: false },
            { icon: Award, label: 'Rewards', active: false },
            { icon: MoreHorizontal, label: 'Meer', active: false },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <button 
                key={idx} 
                className={`flex flex-col items-center gap-1 ${item.active ? 'text-orange-600' : 'text-gray-400'}`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
