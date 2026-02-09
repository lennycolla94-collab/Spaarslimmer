'use client';

import { useState } from 'react';
import { 
  PageContainer, 
  PageHeader, 
  SmartCard, 
  StatCard, 
  ActionButton,
  Badge,
} from '@/components/design-system/page-container';
import { 
  Calculator, 
  Wallet, 
  Target, 
  Award, 
  TrendingUp,
  Gift,
  Plane,
  Star,
  Crown,
  Gem,
  Trophy,
  CheckCircle2,
  Lock,
  Zap,
  Users,
  ArrowRight,
  Euro,
  Calendar
} from 'lucide-react';

// Mock calculator imports
const calculateCompleteDeal = (services: any[], rank: string) => ({
  commission: { grandTotal: 12500 },
  personalFidelity: { N0: 4500 },
  asp: { total: 8, baseASP: 5, extraASP: 3 },
  pqs: { achieved: false },
});

const CONSULTANT_RANK = {
  BC: 'BC',
  SC: 'SC', 
  TD: 'TD',
  CD: 'CD',
  RD: 'RD',
};

const formatEuro = (cents: number) => '€' + (cents / 100).toFixed(2).replace('.', ',');

// Data
const PQS_DATA = { target: 12, bonus: 150, sponsorBonus: 150 };

const QUARTERLY_GIFTS = [
  { quarter: 'Q1', name: 'Smart Gadget Box', aspRequired: 15, icon: Gift, unlocked: true },
  { quarter: 'Q2', name: 'Premium Headphones', aspRequired: 25, icon: Star, unlocked: false },
  { quarter: 'Q3', name: 'Luxury Watch', aspRequired: 35, icon: Gem, unlocked: false },
  { quarter: 'Q4', name: 'Exclusive Gift', aspRequired: 50, icon: Trophy, unlocked: false },
];

const PORTUGAL_SEMINAR = {
  location: 'Algarve, Portugal',
  date: 'September 2025',
  aspRequired: 100,
  benefits: ['5-sterren hotel', 'Alle maaltijden', 'Netwerk events', 'Training', 'Gala dinner'],
};

const RANKS = [
  { rank: 'BC', name: 'Business Consultant', minASP: 0, bonus: 0, color: 'bg-gray-500' },
  { rank: 'SC', name: 'Senior Consultant', minASP: 50, bonus: 500, color: 'bg-blue-500' },
  { rank: 'TD', name: 'Team Director', minASP: 100, bonus: 1000, color: 'bg-purple-500' },
  { rank: 'CD', name: 'Country Director', minASP: 200, bonus: 2500, color: 'bg-orange-500' },
  { rank: 'RD', name: 'Regional Director', minASP: 500, bonus: 5000, color: 'bg-red-500' },
];

export default function CommissionPage() {
  const [rank, setRank] = useState('BC');
  const [currentASP, setCurrentASP] = useState(8);

  const result = calculateCompleteDeal([], rank);
  
  const pqsProgress = Math.min(100, (currentASP / PQS_DATA.target) * 100);
  const pqsAchieved = currentASP >= PQS_DATA.target;
  
  const currentRankIndex = RANKS.findIndex(r => r.rank === rank);
  const nextRank = RANKS[currentRankIndex + 1];
  const rankProgress = nextRank 
    ? Math.min(100, ((currentASP - RANKS[currentRankIndex].minASP) / (nextRank.minASP - RANKS[currentRankIndex].minASP)) * 100)
    : 100;

  return (
    <PageContainer>
      <PageHeader
        title="Mijn Commissie"
        subtitle="Al je verdiensten en targets op één plek"
        icon={<Wallet className="w-6 h-6 text-white" />}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Directe Commissie"
            value={formatEuro(result.commission.grandTotal)}
            icon={<Wallet className="w-6 h-6" />}
            color="green"
          />
          <StatCard
            label="Maandelijkse Fidelity"
            value={formatEuro(result.personalFidelity.N0)}
            icon={<TrendingUp className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            label="Totaal ASP"
            value={currentASP}
            icon={<Target className="w-6 h-6" />}
            color="purple"
          />
          <StatCard
            label="Huidige Rank"
            value={rank}
            icon={<Crown className="w-6 h-6" />}
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* PQS Section */}
            <SmartCard className="border-l-4 border-l-yellow-500">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">PQS - Personal Quick Start</h3>
                    <p className="text-sm text-gray-500">Behaal binnen je eerste 30 dagen</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{PQS_DATA.target} ASP</p>
                    <p className="text-sm text-gray-500">nodig voor PQS</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-yellow-600">€{PQS_DATA.bonus}</p>
                    <p className="text-sm text-gray-500">bonus voor jou</p>
                  </div>
                </div>

                <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden mb-4">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all"
                    style={{ width: `${pqsProgress}%` }}
                  />
                </div>

                <div className="flex justify-between text-sm mb-4">
                  <span className="text-gray-600">{currentASP} ASP behaald</span>
                  <span className="text-gray-600">{PQS_DATA.target} ASP nodig</span>
                </div>

                {pqsAchieved ? (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-green-700 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      <strong>Gefeliciteerd!</strong> Je hebt PQS behaald! 🎉
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Nog <strong>{PQS_DATA.target - currentASP} ASP</strong> nodig om PQS te behalen
                  </p>
                )}
              </div>
            </SmartCard>

            {/* Quarterly Gifts */}
            <SmartCard className="border-l-4 border-l-pink-500">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                    <Gift className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Quarterly Gifts</h3>
                    <p className="text-sm text-gray-500">Beloningen per kwartaal</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {QUARTERLY_GIFTS.map((gift) => {
                    const Icon = gift.icon;
                    const isUnlocked = currentASP >= gift.aspRequired;
                    return (
                      <div 
                        key={gift.quarter}
                        className={`p-4 rounded-xl text-center border-2 transition-all ${
                          isUnlocked 
                            ? 'bg-pink-50 border-pink-300' 
                            : 'bg-gray-50 border-gray-200 opacity-60'
                        }`}
                      >
                        <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                          isUnlocked ? 'bg-pink-500 text-white' : 'bg-gray-300 text-gray-500'
                        }`}>
                          {isUnlocked ? <Icon className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
                        </div>
                        <p className="font-bold text-gray-900">{gift.quarter}</p>
                        <p className="text-xs text-gray-600 mt-1">{gift.name}</p>
                        <p className="text-xs text-pink-600 mt-2 font-medium">{gift.aspRequired} ASP</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </SmartCard>

            {/* Portugal Seminar */}
            <SmartCard className="border-l-4 border-l-blue-500">
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Plane className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Portugal Seminarie</h3>
                        <p className="text-sm text-gray-500">{PORTUGAL_SEMINAR.location} • {PORTUGAL_SEMINAR.date}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                      {PORTUGAL_SEMINAR.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="md:w-56 p-5 bg-blue-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Vereist</p>
                    <p className="text-3xl font-bold text-blue-600">{PORTUGAL_SEMINAR.aspRequired} ASP</p>
                    
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Jouw ASP</span>
                        <span className="font-medium">{currentASP}</span>
                      </div>
                      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                          style={{ width: `${Math.min(100, (currentASP / PORTUGAL_SEMINAR.aspRequired) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {currentASP >= PORTUGAL_SEMINAR.aspRequired ? (
                      <p className="text-sm text-green-600 mt-3 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Je bent ingedeeld!
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500 mt-3">
                        Nog {PORTUGAL_SEMINAR.aspRequired - currentASP} ASP te gaan
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </SmartCard>
          </div>

          {/* Right Column - Rank & Summary */}
          <div className="space-y-6">
            {/* Rank Progression */}
            <SmartCard className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border-0">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Rank Progressie</h3>
                    <p className="text-sm text-gray-400">Climb the ladder</p>
                  </div>
                </div>

                <div className="text-center p-5 bg-white/10 rounded-xl mb-6">
                  <p className="text-gray-400 text-sm">Huidige Rank</p>
                  <p className="text-4xl font-bold text-orange-400">{rank}</p>
                  <p className="text-sm text-gray-400">{RANKS[currentRankIndex]?.name}</p>
                </div>

                {nextRank && (
                  <>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Naar {nextRank.rank}</span>
                        <span>{currentASP} / {nextRank.minASP} ASP</span>
                      </div>
                      <div className="relative h-2 bg-white/20 rounded-full overflow-hidden">
                        <div 
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
                          style={{ width: `${rankProgress}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-orange-500/20 border border-orange-500/30 rounded-xl mb-6">
                      <p className="text-orange-300 text-sm">
                        Bij promotie: <strong className="text-lg">+€{nextRank.bonus}</strong> bonus
                      </p>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  {RANKS.map((r, idx) => {
                    const isCurrent = r.rank === rank;
                    const isPast = idx < currentRankIndex;
                    return (
                      <div 
                        key={r.rank}
                        className={`flex items-center gap-3 p-3 rounded-xl ${isCurrent ? 'bg-white/10' : ''}`}
                      >
                        <div className={`w-3 h-3 rounded-full ${r.color}`} />
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${isCurrent ? 'text-white' : isPast ? 'text-gray-500 line-through' : 'text-gray-400'}`}>
                            {r.rank} - {r.name}
                          </p>
                        </div>
                        {isCurrent && <Star className="w-4 h-4 text-yellow-400" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </SmartCard>

            {/* Quick Calculator */}
            <SmartCard className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-orange-500" />
                Snelle Berekening
              </h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Directe commissie</span>
                  <span className="font-semibold">{formatEuro(result.commission.grandTotal)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Maandelijkse fidelity</span>
                  <span className="font-semibold">{formatEuro(result.personalFidelity.N0)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Op 1 jaar</span>
                  <span className="font-semibold">{formatEuro(result.personalFidelity.N0 * 12)}</span>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-green-700 font-medium">Totaal op 2 jaar</span>
                  <span className="text-xl font-bold text-green-700">
                    {formatEuro(result.commission.grandTotal + (result.personalFidelity.N0 * 24))}
                  </span>
                </div>
              </div>
            </SmartCard>

            {/* ASP Breakdown */}
            <SmartCard className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                ASP Breakdown
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Base ASP</span>
                  <span className="font-semibold">{result.asp.baseASP}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Extra ASP</span>
                  <span className="font-semibold">{result.asp.extraASP}</span>
                </div>
                <div className="flex justify-between py-2 bg-blue-50 p-3 rounded-xl">
                  <span className="text-blue-700 font-medium">Totaal ASP</span>
                  <span className="text-2xl font-bold text-blue-700">{result.asp.total}</span>
                </div>
              </div>
            </SmartCard>
          </div>
        </div>
      </main>
    </PageContainer>
  );
}
