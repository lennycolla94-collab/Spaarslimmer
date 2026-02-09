// Design B: "Smart Energy" - Mijn eigen visie
// Clean, modern, energie/Orange thema met focus op productiviteit

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
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Flame
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { GradientSidebar } from './sidebar';
import { 
  AreaChart, 
  Area, 
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

// Mock data
const weeklyData = [
  { day: 'Ma', calls: 12, conversations: 8 },
  { day: 'Di', calls: 18, conversations: 12 },
  { day: 'Wo', calls: 15, conversations: 10 },
  { day: 'Do', calls: 22, conversations: 15 },
  { day: 'Vr', calls: 28, conversations: 20 },
  { day: 'Za', calls: 8, conversations: 5 },
  { day: 'Zo', calls: 5, conversations: 3 },
];

const conversionData = [
  { name: 'Nieuw', value: 45, color: '#3b82f6' },
  { name: 'Contact', value: 30, color: '#f59e0b' },
  { name: 'Offerte', value: 15, color: '#8b5cf6' },
  { name: 'Verkocht', value: 10, color: '#10b981' },
];

const recentActivity = [
  { type: 'call', message: 'Gesprek gehad met Jansen Bouw BV', time: '5 min geleden', status: 'success' },
  { type: 'quote', message: 'Offerte verstuurd naar Peeters IT', time: '12 min geleden', status: 'pending' },
  { type: 'sale', message: 'Nieuwe sale! Dubois Consulting', time: '1 uur geleden', status: 'success' },
  { type: 'lead', message: '15 nieuwe leads geïmporteerd', time: '2 uur geleden', status: 'info' },
];

const goals = [
  { name: 'Calls deze week', current: 108, target: 150, unit: 'calls' },
  { name: 'Gesprekken', current: 73, target: 100, unit: 'gesprekken' },
  { name: 'Conversie', current: 67, target: 80, unit: '%' },
  { name: 'Commissie', current: 450, target: 1000, unit: '€' },
];

export function DesignBDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<'dag' | 'week' | 'maand'>('week');

  return (
    <div className="flex min-h-screen bg-gray-50">
      <GradientSidebar />
      
      <main className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Welkom terug! Hier is je overzicht voor vandaag.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Calendar className="w-4 h-4" />
              {new Date().toLocaleDateString('nl-BE', { day: 'numeric', month: 'long', year: 'numeric' })}
            </Button>
            <Button className="bg-gradient-to-r from-orange-500 to-red-500 text-white gap-2 hover:opacity-90">
              <Phone className="w-4 h-4" />
              Start Call Center
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Call Center</p>
                <p className="text-sm text-gray-500">Start met bellen</p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-gray-400 ml-auto group-hover:text-blue-600" />
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Leads</p>
                <p className="text-sm text-gray-500">Bekijk alle leads</p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-gray-400 ml-auto group-hover:text-green-600" />
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Offertes</p>
                <p className="text-sm text-gray-500">Maak nieuwe offerte</p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-gray-400 ml-auto group-hover:text-purple-600" />
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Incentives</p>
                <p className="text-sm text-gray-500">Bekijk beloningen</p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-gray-400 ml-auto group-hover:text-orange-600" />
            </CardContent>
          </Card>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Totaal Calls</p>
                  <p className="text-3xl font-bold text-gray-900">108</p>
                  <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                    <ArrowUpRight className="w-4 h-4" />
                    +12% vs vorige week
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Gesprekken</p>
                  <p className="text-3xl font-bold text-gray-900">73</p>
                  <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                    <ArrowUpRight className="w-4 h-4" />
                    +8% vs vorige week
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-xl">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Conversie</p>
                  <p className="text-3xl font-bold text-gray-900">67%</p>
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 rotate-180" />
                    -3% vs vorige week
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Commissie</p>
                  <p className="text-3xl font-bold text-gray-900">€450</p>
                  <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                    <ArrowUpRight className="w-4 h-4" />
                    Doel: €1.000
                  </p>
                </div>
                <div className="p-3 bg-orange-50 rounded-xl">
                  <Award className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Charts */}
          <div className="col-span-2 space-y-6">
            {/* Activity Chart */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">Activiteit deze week</CardTitle>
                <div className="flex gap-2">
                  {(['dag', 'week', 'maand'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setSelectedPeriod(p)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        selectedPeriod === p 
                          ? 'bg-gray-900 text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyData}>
                      <defs>
                        <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                      <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="calls" 
                        stroke="#f97316" 
                        fillOpacity={1} 
                        fill="url(#colorCalls)" 
                        strokeWidth={2}
                        name="Calls"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="conversations" 
                        stroke="#3b82f6" 
                        fillOpacity={1} 
                        fill="url(#colorConv)" 
                        strokeWidth={2}
                        name="Gesprekken"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-orange-500" />
                    <span className="text-sm text-gray-600">Calls</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-sm text-gray-600">Gesprekken</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Goals Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Target className="w-5 h-5 text-orange-500" />
                  Doelen deze maand
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {goals.map((goal) => (
                    <div key={goal.name}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-700">{goal.name}</span>
                        <span className="text-sm text-gray-500">
                          {goal.current} / {goal.target} {goal.unit}
                        </span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all"
                          style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Conversion Funnel */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Conversie Trechter</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={conversionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {conversionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-4">
                  {conversionData.map((item) => (
                    <div key={item.name} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-gray-600">{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  Recente Activiteit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${
                        activity.status === 'success' ? 'bg-green-100 text-green-600' :
                        activity.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {activity.status === 'success' ? <CheckCircle2 className="w-4 h-4" /> :
                         activity.status === 'pending' ? <Clock className="w-4 h-4" /> :
                         <Flame className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">{activity.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Tip */}
            <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Pro Tip</p>
                    <p className="text-sm text-orange-100 mt-1">
                      Bel tussen 10:00 en 11:30 voor het beste bereik. 
                      Je conversie is dan 23% hoger!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
