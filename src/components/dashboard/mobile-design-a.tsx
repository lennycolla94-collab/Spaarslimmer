// Mobile Design A: "Spaarslimmer Pro" - Gamification Focus

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
  Menu,
  X,
  Home,
  LogOut,
  Crown,
  ChevronRight,
  Flame,
  Star
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
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

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: UsersIcon, label: 'Leads', href: '/leads' },
  { icon: Phone, label: 'Calls', href: '/call-center' },
  { icon: ShoppingCart, label: 'Verkoop', href: '/offers' },
  { icon: FileText, label: 'Orders', href: '/orders/new' },
  { icon: Gift, label: 'Incentives', href: '/incentives' },
  { icon: Euro, label: 'Commissies', href: '/commissions' },
  { icon: Users2, label: 'Team', href: '/team' },
];

const challenges = [
  { name: 'Call Master', progress: 64, target: '50 calls', reward: '+100 XP' },
  { name: 'Gesprekken Pro', progress: 70, target: '30 gesprekken', reward: '+150 XP' },
  { name: 'Afspraak Maker', progress: 67, target: '10 afspraken', reward: '+200 XP' },
];

const achievements = [
  { icon: Flame, label: '7 dagen streak', color: 'text-orange-500', bg: 'bg-orange-100' },
  { icon: Star, label: 'Top 10%', color: 'text-yellow-500', bg: 'bg-yellow-100' },
  { icon: Target, label: 'PQS Behaald', color: 'text-purple-500', bg: 'bg-purple-100' },
];

export function MobileDesignA() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Mobile Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h1 className="font-bold">SmartSN</h1>
              <p className="text-xs text-slate-400">Level 1 Beginner</p>
            </div>
          </div>
          <button 
            onClick={() => setMenuOpen(true)}
            className="p-2 bg-slate-800 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* XP Progress */}
        <div className="px-4 pb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">0 / 100 XP</span>
            <span className="text-yellow-400">Level 2</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full w-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 space-y-4">
        {/* Welcome Card */}
        <Card className="bg-gradient-to-r from-orange-500 to-amber-400 text-white border-0">
          <CardContent className="p-4">
            <p className="text-orange-100 text-sm">Welkom terug!</p>
            <h2 className="text-xl font-bold mt-1">Goedemorgen! 👋</h2>
            <div className="flex gap-2 mt-4">
              <Button size="sm" className="bg-white text-orange-600 hover:bg-orange-50 rounded-full">
                <Phone className="w-4 h-4 mr-1" />
                Bel Nu
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-blue-50 border-blue-100">
            <CardContent className="p-3">
              <Phone className="w-5 h-5 text-blue-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-xs text-gray-600">Calls</p>
            </CardContent>
          </Card>
          <Card className="bg-green-50 border-green-100">
            <CardContent className="p-3">
              <MessageSquare className="w-5 h-5 text-green-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-xs text-gray-600">Gesprekken</p>
            </CardContent>
          </Card>
          <Card className="bg-orange-50 border-orange-100">
            <CardContent className="p-3">
              <Calendar className="w-5 h-5 text-orange-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-xs text-gray-600">Afspraken</p>
            </CardContent>
          </Card>
          <Card className="bg-purple-50 border-purple-100">
            <CardContent className="p-3">
              <TrendingUp className="w-5 h-5 text-purple-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900">0%</p>
              <p className="text-xs text-gray-600">Conversie</p>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">🏆 Jouw Badges</h3>
            <div className="flex gap-3">
              {achievements.map((ach, idx) => {
                const Icon = ach.icon;
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <div className={`w-12 h-12 ${ach.bg} rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${ach.color}`} />
                    </div>
                    <span className="text-xs text-gray-600 mt-1 text-center">{ach.label}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Daily Challenges */}
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold text-gray-900">Dagelijkse Challenges</h3>
              <span className="ml-auto text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">0/3</span>
            </div>
            
            <div className="space-y-3">
              {challenges.map((challenge) => (
                <div key={challenge.name} className="bg-white rounded-xl p-3 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{challenge.name}</p>
                      <p className="text-xs text-gray-500">{challenge.target}</p>
                    </div>
                    <span className="text-xs text-orange-600 font-medium">{challenge.reward}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                      style={{ width: `${challenge.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{challenge.progress}% voltooid</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Pulse */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">👥 Team Pulse</h3>
            <div className="space-y-3">
              {[
                { user: 'Sarah', action: 'nieuwe sale!', time: '2m', color: 'text-green-500' },
                { user: 'Mark', action: '25 calls vandaag', time: '15m', color: 'text-blue-500' },
                { user: 'Lisa', action: 'PQS behaald!', time: '45m', color: 'text-purple-500' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center ${item.color}`}>
                    <span className="text-xs font-bold">{item.user[0]}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{item.user}</span>{' '}
                      <span className="text-gray-600">{item.action}</span>
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          {[
            { icon: Home, label: 'Home', active: true },
            { icon: Phone, label: 'Bel', active: false },
            { icon: UsersIcon, label: 'Leads', active: false },
            { icon: Award, label: 'Rewards', active: false },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <button 
                key={idx} 
                className={`flex flex-col items-center gap-1 p-2 ${item.active ? 'text-orange-600' : 'text-gray-400'}`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 w-72 bg-slate-900 text-white z-50 p-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-lg">Menu</h2>
              <button onClick={() => setMenuOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Link>
                );
              })}
            </nav>

            <div className="absolute bottom-4 left-4 right-4">
              <button 
                onClick={() => signOut()}
                className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white w-full"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm">Uitloggen</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
