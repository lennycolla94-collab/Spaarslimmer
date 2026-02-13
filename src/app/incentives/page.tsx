'use client';

import { useState } from 'react';
import { PremiumLayout } from '@/components/design-system/premium-layout';
import { 
  Gift, 
  Plane, 
  Target,
  Trophy,
  Star,
  Crown,
  Zap,
  CheckCircle2,
  Clock,
  TrendingUp,
  Users,
  Calendar,
  Medal,
  Diamond,
  Car,
  Smartphone,
  Award,
  ArrowRight,
  Sparkles
} from 'lucide-react';

// Extended incentives data
const ACTIVE_INCENTIVES = [
  {
    id: '1',
    name: 'Portugal Seminar 2025',
    description: '5 dagen luxe verblijf in Algarve met team',
    type: 'TRIP',
    progress: 80,
    target: 100,
    deadline: '2025-03-31',
    reward: 'All-inclusive trip',
    icon: Plane,
    color: 'from-blue-500 to-cyan-500',
    status: 'ACTIVE',
    participants: 24,
    myPoints: 80,
    requiredRank: 'BC+'
  },
  {
    id: '2',
    name: 'Winter Gift Box',
    description: 'Exclusief geschenkpakket voor top performers',
    type: 'GIFT',
    progress: 45,
    target: 60,
    deadline: '2025-12-15',
    reward: 'Premium cadeau waarde €200',
    icon: Gift,
    color: 'from-red-500 to-pink-500',
    status: 'ACTIVE',
    participants: 156,
    myPoints: 45,
    requiredRank: 'BC'
  },
  {
    id: '3',
    name: 'PQS Q1 Bonus',
    description: 'Quarterly performance bonus',
    type: 'BONUS',
    progress: 12,
    target: 17,
    deadline: '2025-03-31',
    reward: '€500 cash bonus',
    icon: Target,
    color: 'from-green-500 to-emerald-500',
    status: 'ACTIVE',
    participants: 89,
    myPoints: 12,
    requiredRank: 'BC'
  },
  {
    id: '4',
    name: 'Diamond Club Status',
    description: 'Exclusieve Diamond Consultant status',
    type: 'RANK',
    progress: 65,
    target: 100,
    deadline: '2025-06-30',
    reward: 'Diamond Badge + €1000 bonus',
    icon: Crown,
    color: 'from-purple-500 to-violet-500',
    status: 'ACTIVE',
    participants: 12,
    myPoints: 65,
    requiredRank: 'SC+'
  },
  {
    id: '5',
    name: 'Auto Bonus Programma',
    description: 'Maandelijkse auto vergoeding',
    type: 'BONUS',
    progress: 8,
    target: 12,
    deadline: '2025-12-31',
    reward: '€400/maand auto lease',
    icon: Car,
    color: 'from-orange-500 to-red-500',
    status: 'ACTIVE',
    participants: 45,
    myPoints: 8,
    requiredRank: 'SC'
  },
  {
    id: '6',
    name: 'iPhone 16 Pro Challenge',
    description: 'Win de nieuwste iPhone',
    type: 'GIFT',
    progress: 3,
    target: 10,
    deadline: '2025-04-30',
    reward: 'iPhone 16 Pro Max',
    icon: Smartphone,
    color: 'from-indigo-500 to-purple-500',
    status: 'ACTIVE',
    participants: 234,
    myPoints: 3,
    requiredRank: 'BC'
  },
];

const COMPLETED_INCENTIVES = [
  {
    id: '7',
    name: 'Summer Blast 2024',
    completedDate: '2024-08-15',
    reward: 'iPad Pro + Apple Pencil',
    icon: Trophy,
    color: 'from-orange-500 to-yellow-500',
    achieved: true
  },
  {
    id: '8',
    name: 'Q4 Top Performer',
    completedDate: '2024-12-20',
    reward: '€1,000 cash bonus',
    icon: Star,
    color: 'from-yellow-500 to-amber-500',
    achieved: true
  },
  {
    id: '9',
    name: 'Fast Start Bonus',
    completedDate: '2024-06-10',
    reward: '€250 onboarding bonus',
    icon: Zap,
    color: 'from-green-500 to-emerald-500',
    achieved: true
  },
];

const LEADERBOARD = [
  { rank: 1, name: 'Sarah J.', points: 2450, trend: 'up', avatar: 'S' },
  { rank: 2, name: 'Mark D.', points: 2380, trend: 'same', avatar: 'M' },
  { rank: 3, name: 'Lisa V.', points: 2150, trend: 'up', avatar: 'L' },
  { rank: 4, name: 'Jef K.', points: 1890, trend: 'down', avatar: 'J' },
  { rank: 5, name: 'Emma W.', points: 1750, trend: 'up', avatar: 'E' },
  { rank: 8, name: 'Jij', points: 1850, trend: 'up', avatar: 'Y', isMe: true },
];

const UPCOMING_INCENTIVES = [
  { name: 'Dubai Leadership', date: '2025-09-01', type: 'TRIP', reward: 'Luxury 7-day trip' },
  { name: 'Christmas Bonus', date: '2025-12-20', type: 'BONUS', reward: '€750 cash' },
  { name: 'Elite Club 2026', date: '2026-01-01', type: 'RANK', reward: 'Exclusive benefits' },
];

export default function IncentivesPage() {
  const [activeTab, setActiveTab] = useState('ACTIVE');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = [
    { id: 'ALL', label: 'Alles', count: ACTIVE_INCENTIVES.length },
    { id: 'TRIP', label: 'Reizen', count: ACTIVE_INCENTIVES.filter(i => i.type === 'TRIP').length },
    { id: 'BONUS', label: 'Bonussen', count: ACTIVE_INCENTIVES.filter(i => i.type === 'BONUS').length },
    { id: 'GIFT', label: 'Geschenken', count: ACTIVE_INCENTIVES.filter(i => i.type === 'GIFT').length },
    { id: 'RANK', label: 'Ranks', count: ACTIVE_INCENTIVES.filter(i => i.type === 'RANK').length },
  ];

  const filteredIncentives = selectedCategory === 'ALL' 
    ? ACTIVE_INCENTIVES 
    : ACTIVE_INCENTIVES.filter(i => i.type === selectedCategory);

  return (
    <PremiumLayout user={{ name: 'Lenny De K.' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Incentives & Beloningen</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Prestatiebeloningen, trips en bonussen</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">Jouw PQS Punten</p>
            <p className="text-2xl font-bold text-orange-600">1,850</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">Rank</p>
            <p className="text-2xl font-bold text-purple-600">#8</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { icon: Target, label: 'Actieve Doelen', value: '6', color: 'blue' },
          { icon: CheckCircle2, label: 'Behaald', value: '3', color: 'green' },
          { icon: Trophy, label: 'Huidige Rank', value: '#8', color: 'purple' },
          { icon: Zap, label: 'Streak', value: '15 dagen', color: 'orange' },
          { icon: Award, label: 'Volgende Bonus', value: '€500', color: 'pink' },
        ].map((stat, i) => (
          <div key={i} className={`bg-${stat.color}-50 dark:bg-${stat.color}-500/10 rounded-xl border border-${stat.color}-200 dark:border-${stat.color}-500/20 p-4 hover:shadow-md transition-shadow`}>
            <div className={`w-10 h-10 bg-${stat.color}-500 rounded-lg flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <p className={`text-sm text-${stat.color}-600 dark:text-${stat.color}-400`}>{stat.label}</p>
            <p className={`text-2xl font-bold text-${stat.color}-900 dark:text-${stat.color}-100`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Category Filter */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-2 mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
            >
              {cat.label}
              <span className={`px-1.5 py-0.5 rounded text-xs ${
                selectedCategory === cat.id ? 'bg-gray-700 dark:bg-gray-200' : 'bg-gray-200 dark:bg-slate-600'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Incentives */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-1 mb-6 inline-flex">
            {['ACTIVE', 'COMPLETED', 'UPCOMING'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab 
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                }`}
              >
                {tab === 'ACTIVE' ? 'Actief' : tab === 'COMPLETED' ? 'Behaald' : 'Aankomend'}
              </button>
            ))}
          </div>

          {/* Incentives List */}
          <div className="space-y-4">
            {activeTab === 'ACTIVE' ? (
              filteredIncentives.map((incentive) => {
                const Icon = incentive.icon;
                const percentage = (incentive.progress / incentive.target) * 100;
                return (
                  <div key={incentive.id} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${incentive.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{incentive.name}</h3>
                              <span className="px-2 py-0.5 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                                {incentive.requiredRank}
                              </span>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400">{incentive.description}</p>
                          </div>
                          <span className="text-2xl font-bold text-orange-600">{Math.round(percentage)}%</span>
                        </div>
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-500 dark:text-gray-400">{incentive.progress} / {incentive.target} punten</span>
                            <span className="text-gray-500 dark:text-gray-400">Deadline: {incentive.deadline}</span>
                          </div>
                          <div className="h-3 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className={`h-full bg-gradient-to-r ${incentive.color} rounded-full transition-all`} style={{ width: `${percentage}%` }} />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-semibold">Beloning:</span> {incentive.reward}
                          </span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">{incentive.participants} deelnemers</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : activeTab === 'COMPLETED' ? (
              COMPLETED_INCENTIVES.map((incentive) => {
                const Icon = incentive.icon;
                return (
                  <div key={incentive.id} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 opacity-90">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${incentive.color} rounded-2xl flex items-center justify-center`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{incentive.name}</h3>
                            <p className="text-gray-500 dark:text-gray-400">Behaald op {incentive.completedDate}</p>
                          </div>
                          <CheckCircle2 className="w-6 h-6 text-green-500" />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <span className="font-semibold">Beloning:</span> {incentive.reward}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              UPCOMING_INCENTIVES.map((incentive, idx) => (
                <div key={idx} className="bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700 p-6 opacity-75">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{incentive.name}</h3>
                          <p className="text-gray-500 dark:text-gray-400">Start: {incentive.date}</p>
                        </div>
                        <span className="px-3 py-1 bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-sm rounded-full">Binnenkort</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <span className="font-semibold">Beloning:</span> {incentive.reward}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Leaderboard */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Leaderboard</h2>
            <div className="space-y-3">
              {LEADERBOARD.map((user) => (
                <div key={user.rank} className={`flex items-center gap-3 p-3 rounded-xl ${
                  user.isMe ? 'bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20' : 'bg-gray-50 dark:bg-slate-700/50'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    user.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                    user.rank === 2 ? 'bg-gray-300 text-gray-900' :
                    user.rank === 3 ? 'bg-orange-400 text-orange-900' :
                    'bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300'
                  }`}>
                    {user.rank}
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user.avatar}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${user.isMe ? 'text-orange-900 dark:text-orange-300' : 'text-gray-900 dark:text-white'}`}>
                      {user.name}
                    </p>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">{user.points.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-sm text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-colors flex items-center justify-center gap-2">
              Bekijk volledig leaderboard
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Next Milestone */}
          <div className="bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <Medal className="w-6 h-6" />
                <h3 className="font-semibold">Volgende Milestone</h3>
              </div>
              <p className="text-3xl font-bold mb-2">Portugal Seminar</p>
              <p className="text-orange-100 mb-4">Nog 20 PQS punten te gaan!</p>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-white rounded-full" style={{ width: '80%' }} />
              </div>
              <div className="flex items-center justify-between text-sm text-orange-100">
                <span>80 / 100 punten</span>
                <span>Deadline: 31 maart</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Deze Maand</h3>
            <div className="space-y-3">
              {[
                { label: 'Nieuwe Sales', value: '12' },
                { label: 'ASP Punten', value: '+45' },
                { label: 'Team Recruits', value: '2' },
                { label: 'Opvolgcalls', value: '28' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{stat.label}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PremiumLayout>
  );
}
