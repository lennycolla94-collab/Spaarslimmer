// Design A: "Spaarslimmer Pro" - Met Dark/Light mode support

'use client';

import { useState } from 'react';
import { 
  Phone, 
  MessageSquare, 
  TrendingUp, 
  Target,
  Award,
  Zap,
  Users,
  Calendar,
  LogOut,
  Crown,
  Moon,
  Sun,
  Palette
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { 
  LayoutDashboard, 
  Users as UsersIcon, 
  ShoppingCart, 
  FileText, 
  Gift, 
  Euro, 
  Users2, 
  BarChart3,
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: UsersIcon, label: 'Lead Management', href: '/leads' },
  { icon: Phone, label: 'Call Logging', href: '/call-center' },
  { icon: ShoppingCart, label: 'Verkoop', href: '/offers' },
  { icon: FileText, label: 'Order Invoer', href: '/orders/new' },
  { icon: Gift, label: 'Incentives', href: '/incentives', badge: 'NEW' },
  { icon: Euro, label: 'Commissies', href: '/commissions' },
  { icon: Users2, label: 'Team Management', href: '/team' },
  { icon: BarChart3, label: 'Rapporten', href: '/reports' },
];

const callsData = [
  { date: '11 jan', calls: 0 },
  { date: '13 jan', calls: 0 },
  { date: '15 jan', calls: 0 },
  { date: '17 jan', calls: 0 },
  { date: '19 jan', calls: 0 },
  { date: '21 jan', calls: 0 },
  { date: '23 jan', calls: 0 },
  { date: '25 jan', calls: 0 },
  { date: '27 jan', calls: 0 },
  { date: '29 jan', calls: 0 },
  { date: '31 jan', calls: 0 },
  { date: '02 feb', calls: 0 },
  { date: '04 feb', calls: 0 },
  { date: '06 feb', calls: 0 },
  { date: '08 feb', calls: 0 },
];

const leadStatusData = [
  { name: 'Nieuw', value: 1, color: '#3b82f6' },
  { name: 'Gecontacteerd', value: 0, color: '#f59e0b' },
  { name: 'Offerte', value: 0, color: '#8b5cf6' },
  { name: 'Verkocht', value: 0, color: '#10b981' },
];

const topNichesData = [
  { name: 'Bouwbedrijf', value: 1 },
  { name: 'Energie', value: 0 },
  { name: 'Retail', value: 0 },
];

const challenges = [
  { name: 'Call Master', progress: 64, icon: Phone },
  { name: 'Gesprekken Pro', progress: 70, icon: MessageSquare },
  { name: 'Afspraak Maker', progress: 67, icon: Calendar },
];

const teamPulse = [
  { user: 'Sarah', action: 'nieuwe sale!', time: '2m geleden', icon: Award, color: 'text-green-500' },
  { user: 'Mark', action: '25 calls vandaag', time: '15m geleden', icon: Phone, color: 'text-blue-500' },
  { user: 'Lisa', action: 'PQS behaald!', time: '45m geleden', icon: Target, color: 'text-purple-500' },
];

interface DesignADashboardProps {
  themeMode: 'dark' | 'light';
  onThemeChange: (mode: 'dark' | 'light') => void;
}

function Sidebar({ themeMode, onThemeChange }: { themeMode: 'dark' | 'light', onThemeChange: (mode: 'dark' | 'light') => void }) {
  const pathname = usePathname();
  const isDark = themeMode === 'dark';

  if (isDark) {
    return (
      <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">SmartSN</h1>
              <p className="text-xs text-slate-400">PRO CRM</p>
            </div>
          </div>
        </div>

        <div className="p-4 mx-4 mt-4 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Crown className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <p className="text-xs text-purple-200">Level 1</p>
              <p className="font-bold text-sm">Beginner</p>
            </div>
          </div>
          <div className="mt-3">
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full w-0 bg-yellow-400 rounded-full" />
            </div>
            <p className="text-xs text-purple-200 mt-1">0 / 100 XP</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive ? 'bg-orange-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">{item.badge}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => onThemeChange('light')} 
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white w-full mb-2"
          >
            <Sun className="w-5 h-5" />
            <span className="text-sm">Light Mode</span>
          </button>
          <button onClick={() => signOut()} className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white w-full">
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Uitloggen</span>
          </button>
        </div>
      </aside>
    );
  }

  // Light Sidebar
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-900">SmartSN</h1>
            <p className="text-xs text-gray-500">PRO CRM</p>
          </div>
        </div>
      </div>

      <div className="p-4 mx-4 mt-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Crown className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-blue-600">Level 1</p>
            <p className="font-bold text-sm text-gray-900">Beginner</p>
          </div>
        </div>
        <div className="mt-3">
          <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
            <div className="h-full w-0 bg-blue-500 rounded-full" />
          </div>
          <p className="text-xs text-blue-600 mt-1">0 / 100 XP</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
              {item.badge && (
                <span className="ml-auto px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">{item.badge}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={() => onThemeChange('dark')} 
          className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-gray-900 w-full mb-2"
        >
          <Moon className="w-5 h-5" />
          <span className="text-sm">Dark Mode</span>
        </button>
        <button onClick={() => signOut()} className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-gray-900 w-full">
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Uitloggen</span>
        </button>
      </div>
    </aside>
  );
}

export function DesignADashboard({ themeMode, onThemeChange }: DesignADashboardProps) {
  const isDark = themeMode === 'dark';

  return (
    <div className={`flex min-h-screen ${isDark ? 'bg-gray-50' : 'bg-gray-100'}`}>
      <Sidebar themeMode={themeMode} onThemeChange={onThemeChange} />
      
      <main className="flex-1 p-6 overflow-auto">
        {/* Welcome Header */}
        <div className={`rounded-3xl p-6 mb-6 text-white relative overflow-hidden ${
          isDark 
            ? 'bg-gradient-to-r from-orange-500 to-amber-400' 
            : 'bg-gradient-to-r from-blue-500 to-cyan-400'
        }`}>
          <div className="relative z-10">
            <p className={`text-sm mb-1 ${isDark ? 'text-orange-100' : 'text-blue-100'}`}>Welkom terug!</p>
            <h1 className="text-3xl font-bold mb-4">Goedemorgen, Consultant! 👋</h1>
            
            <div className="grid grid-cols-4 gap-4 mt-4">
              {['Jouw Rank', 'Persoonlijk ASP', 'Commissie', 'Team Positie'].map((label, i) => (
                <div key={label} className={`rounded-xl p-3 ${isDark ? 'bg-white/20' : 'bg-white/20'}`}>
                  <p className={`text-xs ${isDark ? 'text-orange-100' : 'text-blue-100'}`}>{label}</p>
                  <div className="flex items-center gap-2">
                    {i === 0 && <Crown className="w-5 h-5 text-yellow-300" />}
                    <span className="font-bold">{i === 0 ? 'BC' : i === 3 ? '-' : '0'}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-4">
              <Button className="bg-white text-orange-600 hover:bg-orange-50 rounded-full px-6">
                <Phone className="w-4 h-4 mr-2" />
                Nieuwe Call
              </Button>
            </div>
          </div>
          
          <div className="absolute right-6 top-6 opacity-20">
            <Award className="w-24 h-24" />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Jouw Prestaties</h2>
          <div className="grid grid-cols-4 gap-4">
            {[
              { icon: Phone, label: 'Totaal Calls', value: 0, color: 'blue', target: 250 },
              { icon: MessageSquare, label: 'Gesprekken', value: 0, color: 'green', target: 75 },
              { icon: Calendar, label: 'Afspraken', value: 0, color: 'orange', target: 15 },
              { icon: TrendingUp, label: 'Conversie %', value: '0%', color: 'purple', target: 30 },
            ].map((stat) => (
              <Card key={stat.label} className={`${
                stat.color === 'blue' ? 'bg-blue-50 border-blue-100' :
                stat.color === 'green' ? 'bg-green-50 border-green-100' :
                stat.color === 'orange' ? 'bg-orange-50 border-orange-100' :
                'bg-purple-50 border-purple-100'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-3 rounded-full ${
                      stat.color === 'blue' ? 'bg-blue-100' :
                      stat.color === 'green' ? 'bg-green-100' :
                      stat.color === 'orange' ? 'bg-orange-100' :
                      'bg-purple-100'
                    }`}>
                      <stat.icon className={`w-6 h-6 ${
                        stat.color === 'blue' ? 'text-blue-600' :
                        stat.color === 'green' ? 'text-green-600' :
                        stat.color === 'orange' ? 'text-orange-600' :
                        'text-purple-600'
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-xs text-gray-500 mt-1">Doel: {stat.target}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Phone className="w-5 h-5 text-orange-500" />
                  Calls per Dag
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={callsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                      <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                      <Tooltip />
                      <Line type="monotone" dataKey="calls" stroke={isDark ? '#f97316' : '#3b82f6'} strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Lead Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={leadStatusData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value">
                          {leadStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Top Niches</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topNichesData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} />
                        <Bar dataKey="value" fill={isDark ? '#f97316' : '#3b82f6'} radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-orange-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-orange-800">
                  <Zap className="w-5 h-5" />
                  Dagelijkse Challenges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {challenges.map((challenge) => {
                    const Icon = challenge.icon;
                    return (
                      <div key={challenge.name}>
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">{challenge.name}</span>
                          </div>
                          <span className="text-xs text-gray-500">{challenge.progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full" style={{ width: `${challenge.progress}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  Team Pulse
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamPulse.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} className="flex items-start gap-3">
                        <div className={`p-2 bg-gray-100 rounded-full ${item.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm"><span className="font-medium">{item.user}</span> <span className="text-gray-600">{item.action}</span></p>
                          <p className="text-xs text-gray-400">{item.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
