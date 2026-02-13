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
  Calendar
} from 'lucide-react';

// Mock incentives data
const INCENTIVES = [
  {
    id: '1',
    name: 'Portugal Seminar',
    description: '5 dagen luxe verblijf in Algarve',
    type: 'TRIP',
    progress: 80,
    target: 100,
    deadline: '2025-03-31',
    reward: 'All-inclusive trip',
    icon: Plane,
    color: 'from-blue-500 to-cyan-500',
    status: 'ACTIVE'
  },
  {
    id: '2',
    name: 'Winter Gift',
    description: 'Exclusief geschenkpakket',
    type: 'GIFT',
    progress: 45,
    target: 60,
    deadline: '2025-12-15',
    reward: 'Premium cadeau',
    icon: Gift,
    color: 'from-red-500 to-pink-500',
    status: 'ACTIVE'
  },
  {
    id: '3',
    name: 'PQS Q1',
    description: 'Quarterly performance bonus',
    type: 'BONUS',
    progress: 12,
    target: 17,
    deadline: '2025-03-31',
    reward: '€500 bonus',
    icon: Target,
    color: 'from-green-500 to-emerald-500',
    status: 'ACTIVE'
  },
  {
    id: '4',
    name: 'Diamond Club',
    description: 'Exclusieve Diamond Consultant status',
    type: 'RANK',
    progress: 65,
    target: 100,
    deadline: '2025-06-30',
    reward: 'Diamond Badge + Benefits',
    icon: Crown,
    color: 'from-purple-500 to-violet-500',
    status: 'ACTIVE'
  }
];

const COMPLETED_INCENTIVES = [
  {
    id: '5',
    name: 'Summer Blast 2024',
    completedDate: '2024-08-15',
    reward: 'iPad Pro',
    icon: Trophy,
    color: 'from-orange-500 to-yellow-500'
  },
  {
    id: '6',
    name: 'Q4 Top Performer',
    completedDate: '2024-12-20',
    reward: '€1,000 bonus',
    icon: Star,
    color: 'from-yellow-500 to-amber-500'
  }
];

const LEADERBOARD = [
  { rank: 1, name: 'Sarah J.', points: 2450, trend: 'up' },
  { rank: 2, name: 'Mark D.', points: 2380, trend: 'same' },
  { rank: 3, name: 'Lisa V.', points: 2150, trend: 'up' },
  { rank: 4, name: 'Jef K.', points: 1890, trend: 'down' },
  { rank: 5, name: 'Emma W.', points: 1750, trend: 'up' },
];

export default function IncentivesPage() {
  const [activeTab, setActiveTab] = useState('ACTIVE');

  return (
    <PremiumLayout user={{ name: 'Lenny De K.' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Incentives</h1>
          <p className="text-gray-500 mt-1">Beloningen en prestatiebonussen</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Jouw Punten</p>
            <p className="text-2xl font-bold text-orange-600">1,850 PQS</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
            <Target className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-sm text-gray-500">Actieve Doelen</p>
          <p className="text-2xl font-bold text-gray-900">4</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-sm text-gray-500">Behaald</p>
          <p className="text-2xl font-bold text-gray-900">12</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
            <Trophy className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-sm text-gray-500">Rank</p>
          <p className="text-2xl font-bold text-gray-900">#8</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
            <Zap className="w-6 h-6 text-orange-600" />
          </div>
          <p className="text-sm text-gray-500">Streak</p>
          <p className="text-2xl font-bold text-gray-900">15 dagen</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Incentives */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="bg-white rounded-xl border border-gray-200 p-1 mb-6 inline-flex">
            <button
              onClick={() => setActiveTab('ACTIVE')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'ACTIVE' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Actief
            </button>
            <button
              onClick={() => setActiveTab('COMPLETED')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'COMPLETED' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Behaald
            </button>
          </div>

          {/* Incentives List */}
          <div className="space-y-4">
            {activeTab === 'ACTIVE' ? (
              INCENTIVES.map((incentive) => {
                const Icon = incentive.icon;
                const percentage = (incentive.progress / incentive.target) * 100;
                return (
                  <div key={incentive.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${incentive.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{incentive.name}</h3>
                            <p className="text-gray-500">{incentive.description}</p>
                          </div>
                          <span className="text-2xl font-bold text-orange-600">
                            {Math.round(percentage)}%
                          </span>
                        </div>
                        
                        {/* Progress */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-500">{incentive.progress} / {incentive.target} punten</span>
                            <span className="text-gray-500">Deadline: {incentive.deadline}</span>
                          </div>
                          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full bg-gradient-to-r ${incentive.color} rounded-full transition-all`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-600">
                            <span className="font-semibold">Reward:</span> {incentive.reward}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              COMPLETED_INCENTIVES.map((incentive) => {
                const Icon = incentive.icon;
                return (
                  <div key={incentive.id} className="bg-white rounded-xl border border-gray-200 p-6 opacity-75">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${incentive.color} rounded-2xl flex items-center justify-center`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{incentive.name}</h3>
                            <p className="text-gray-500">Behaald op {incentive.completedDate}</p>
                          </div>
                          <CheckCircle2 className="w-6 h-6 text-green-500" />
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-semibold">Reward:</span> {incentive.reward}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Leaderboard */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Leaderboard</h2>
            <div className="space-y-3">
              {LEADERBOARD.map((user, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center gap-3 p-3 rounded-xl ${
                    user.rank === 8 ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    user.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                    user.rank === 2 ? 'bg-gray-300 text-gray-900' :
                    user.rank === 3 ? 'bg-orange-400 text-orange-900' :
                    'bg-gray-200 text-gray-700'
                  }`}>
                    {user.rank}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{user.name}</p>
                  </div>
                  <span className="font-semibold text-gray-900">{user.points.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-gray-500 mt-4">Jij staat op #8 met 1,850 punten</p>
          </div>

          {/* Next Milestone */}
          <div className="bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6" />
              <h3 className="font-semibold">Volgende Milestone</h3>
            </div>
            <p className="text-3xl font-bold mb-2">Portugal Seminar</p>
            <p className="text-orange-100 mb-4">Nog 20 punten te gaan!</p>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: '80%' }} />
            </div>
          </div>
        </div>
      </div>
    </PremiumLayout>
  );
}
