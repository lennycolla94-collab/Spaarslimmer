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
  Sparkles,
  Package,
  Wallet,
  Briefcase,
  Monitor,
  Phone,
  Tv,
  Rocket,
  Flag,
  Info,
  ChevronRight,
  Lock,
  Unlock,
  AlertCircle,
  X
} from 'lucide-react';

// ===== PQS PUNTEN SYSTEEM =====
const PQS_LEVELS = [
  { level: 'PQS', points: 50, label: 'PQS Behouden', description: 'Basis PQS niveau' },
  { level: 'QS1', points: 20, label: 'QS1', description: 'Eerste kwalificatie' },
  { level: 'QS2', points: 10, label: 'QS2', description: 'Tweede kwalificatie' },
  { level: 'QS3', points: 5, label: 'QS3', description: 'Derde kwalificatie' },
  { level: 'QS4', points: 5, label: 'QS4', description: 'Vierde kwalificatie' },
  { level: 'QS5', points: 5, label: 'QS5', description: 'Vijfde kwalificatie' },
  { level: 'QS6', points: 5, label: 'QS6', description: 'Zesde kwalificatie' },
  { level: 'QS7', points: 10, label: 'QS7', description: 'Zevende kwalificatie' },
];

const TEAM_PROMOTIONS = [
  { niveau: 'Niv1', titel: 10, bonus: 20, label: 'Niveau 1' },
  { niveau: 'Niv2', titel: 10, bonus: 25, label: 'Niveau 2' },
  { niveau: 'Niv3', titel: 10, bonus: 15, label: 'Niveau 3' },
  { niveau: 'Niv4', titel: 5, bonus: 10, label: 'Niveau 4' },
  { niveau: 'Niv5', titel: 5, bonus: 5, label: 'Niveau 5' },
  { niveau: 'Niv6', titel: 5, bonus: 5, label: 'Niveau 6' },
  { niveau: 'Niv7', titel: 5, bonus: 5, label: 'Niveau 7' },
];

// ===== KWARTAAL GIFT PUNten =====
const GIFT_TIERS = [
  {
    tier: 'IRON',
    points: 75,
    color: 'from-gray-400 to-gray-600',
    bgColor: 'bg-gray-500',
    gifts: {
      BC: ['Lenovo Tablet', 'JBL PartyBox', 'IKEA Cadeaubon €200'],
      SC: ['Tankkaart €200'],
      EC: []
    }
  },
  {
    tier: 'BRONZE',
    points: 100,
    color: 'from-orange-400 to-orange-600',
    bgColor: 'bg-orange-500',
    gifts: {
      BC: ['EUFY robotstofzuiger'],
      SC: ['Lenovo IdeaPad laptop', 'Bongo parachutesprong'],
      EC: ['Tankkaart €300']
    }
  },
  {
    tier: 'SILVER',
    points: 150,
    color: 'from-gray-300 to-gray-500',
    bgColor: 'bg-gray-400',
    gifts: {
      BC: ['Apple iPhone 17'],
      SC: ['Persoonlijk coaching', 'GOOD MORNING SALES €1000'],
      EC: ['ECOVACS robotmaaier', 'Kadonation voucher €1000']
    }
  },
  {
    tier: 'GOLD',
    points: 225,
    color: 'from-yellow-400 to-yellow-600',
    bgColor: 'bg-yellow-500',
    gifts: {
      PC: ['Cash bonus €1000'],
      MC: ['Cash bonus €1000'],
      NMC: ['Cash bonus €1000'],
      PMC: ['Cash bonus €1000']
    }
  },
  {
    tier: 'PLATINUM',
    points: 325,
    color: 'from-cyan-400 to-cyan-600',
    bgColor: 'bg-cyan-500',
    gifts: {
      PC: ['Cash bonus €1500'],
      MC: ['Cash bonus €1500'],
      NMC: ['Cash bonus €1500'],
      PMC: ['Cash bonus €1500']
    }
  },
  {
    tier: 'SAPPHIRE',
    points: 400,
    color: 'from-blue-400 to-blue-600',
    bgColor: 'bg-blue-500',
    gifts: {
      PC: ['Cash bonus €2100'],
      MC: ['Cash bonus €2100'],
      NMC: ['Cash bonus €2100'],
      PMC: ['Cash bonus €2100']
    }
  },
  {
    tier: 'DIAMOND',
    points: 500,
    color: 'from-purple-400 to-purple-600',
    bgColor: 'bg-purple-500',
    gifts: {
      PC: ['Cash bonus €2750'],
      MC: ['Cash bonus €2750'],
      NMC: ['Cash bonus €2750'],
      PMC: ['Cash bonus €3500']
    }
  }
];

// PQS Info
const PQS_INFO = {
  deadlineDays: 40,
  requiredASP: 12,
  minMobile: 7,
  minEnergy: 3,
  minInternet: 2,
  bonus: 150,
  points: 50,
  requirements: [
    'Minstens 7 ASP uit geactiveerde mobiele telefonie- en/of mobiele datadiensten',
    'Minstens 3 ASP uit gevalideerde energie- en onderhoudsdiensten',
    'Minstens 2 ASP uit geactiveerde internetdiensten'
  ]
};

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

// Mock user data
const USER_DATA = {
  pqsAchieved: true,
  pqsDate: '2024-01-15',
  pqsStatus: 'ACTIEF',
  totalPoints: 185,
  currentQuarter: 'Q1 2025',
  quarterProgress: 65,
  selectedGift: null as string | null,
  pqsProgress: {
    current: 12,
    required: 12,
    daysLeft: 5
  }
};

export default function IncentivesPage() {
  const [activeTab, setActiveTab] = useState('ACTIVE');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showPQSModal, setShowPQSModal] = useState(false);
  const [selectedGiftTier, setSelectedGiftTier] = useState<string | null>(null);
  const [selectedRank, setSelectedRank] = useState<'BC' | 'SC' | 'EC' | 'PC' | 'MC' | 'NMC' | 'PMC'>('BC');

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

  // Bereken totaal mogelijke PQS punten
  const totalPQSPossible = PQS_LEVELS.reduce((sum, level) => sum + level.points, 0);
  
  // Bereken totaal mogelijke Team Promotion punten
  const totalTeamPromoPossible = TEAM_PROMOTIONS.reduce((sum, promo) => sum + promo.titel + promo.bonus, 0);

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
            <p className="text-sm text-gray-500 dark:text-gray-400">ASP Punten Q1</p>
            <p className="text-2xl font-bold text-orange-600">{USER_DATA.totalPoints}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">PQS Status</p>
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-semibold ${
              USER_DATA.pqsStatus === 'ACTIEF' 
                ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' 
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
            }`}>
              {USER_DATA.pqsStatus === 'ACTIEF' ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
              {USER_DATA.pqsStatus}
            </div>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* ===== KWARTAAL INCENTIVES CARD ===== */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 mb-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <span className="text-sm font-medium text-blue-100">{USER_DATA.currentQuarter}</span>
              </div>
              <h2 className="text-2xl font-bold">Kwartaal Incentives</h2>
              <p className="text-blue-100 mt-1">Spaar punten en kies je gift! Van 01/01/2026 tot 31/03/2026</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100">Jouw Punten</p>
              <p className="text-4xl font-bold">{USER_DATA.totalPoints}</p>
              <p className="text-sm text-blue-200">punten verdiend</p>
            </div>
          </div>

          {/* Gift Tiers Progress */}
          <div className="grid grid-cols-7 gap-2 mb-6">
            {GIFT_TIERS.map((tier) => {
              const isUnlocked = USER_DATA.totalPoints >= tier.points;
              const isNext = !isUnlocked && USER_DATA.totalPoints >= (GIFT_TIERS[GIFT_TIERS.indexOf(tier) - 1]?.points || 0);
              
              return (
                <button
                  key={tier.tier}
                  onClick={() => {
                    if (isUnlocked) {
                      setSelectedGiftTier(tier.tier);
                      setShowGiftModal(true);
                    }
                  }}
                  className={`relative p-3 rounded-xl transition-all ${
                    isUnlocked 
                      ? `bg-gradient-to-br ${tier.color} hover:scale-105 cursor-pointer` 
                      : isNext
                        ? 'bg-white/20 border-2 border-dashed border-white/40'
                        : 'bg-white/10 opacity-50'
                  }`}
                >
                  <div className="text-center">
                    <p className="text-xs font-bold uppercase tracking-wider">{tier.tier}</p>
                    <p className="text-lg font-bold">{tier.points}</p>
                    <p className="text-xs opacity-80">pts</p>
                  </div>
                  {isUnlocked && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-green-900" />
                    </div>
                  )}
                  {isNext && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                      <Sparkles className="w-3 h-3 text-yellow-900" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Current Status */}
          <div className="flex items-center justify-between bg-white/10 rounded-xl p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold">
                  {USER_DATA.selectedGift 
                    ? `Geselecteerd: ${USER_DATA.selectedGift}` 
                    : USER_DATA.totalPoints >= 75 
                      ? 'Je kunt nu een gift kiezen!'
                      : `Nog ${75 - USER_DATA.totalPoints} punten tot je eerste gift (Iron)`
                  }
                </p>
                <p className="text-sm text-blue-100">
                  {USER_DATA.selectedGift 
                    ? 'Bedankt voor je prestaties dit kwartaal!'
                    : 'Verdien punten via PQS en Team Promotions'
                  }
                </p>
              </div>
            </div>
            {USER_DATA.totalPoints >= 75 && !USER_DATA.selectedGift && (
              <button 
                onClick={() => setShowGiftModal(true)}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Kies Gift
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ===== PQS SECTIE ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* PQS Status Card */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Personal Quick Start (PQS)</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Je eerste doel als nieuwe consultant</p>
              </div>
            </div>
            <button 
              onClick={() => setShowPQSModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Info className="w-4 h-4" />
              Meer info
            </button>
          </div>

          {/* PQS Status Badge */}
          <div className={`p-4 rounded-xl mb-6 ${
            USER_DATA.pqsAchieved 
              ? 'bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20' 
              : 'bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  USER_DATA.pqsAchieved ? 'bg-green-500' : 'bg-orange-500'
                }`}>
                  {USER_DATA.pqsAchieved ? <CheckCircle2 className="w-5 h-5 text-white" /> : <Clock className="w-5 h-5 text-white" />}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {USER_DATA.pqsAchieved ? 'PQS Behaald!' : 'PQS in Progress'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {USER_DATA.pqsAchieved 
                      ? `Behaald op ${USER_DATA.pqsDate} • Status: ${USER_DATA.pqsStatus}`
                      : `${USER_DATA.pqsProgress.current} / ${USER_DATA.pqsProgress.required} ASP • Nog ${USER_DATA.pqsProgress.daysLeft} dagen`
                    }
                  </p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                USER_DATA.pqsStatus === 'ACTIEF'
                  ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              }`}>
                {USER_DATA.pqsStatus === 'ACTIEF' ? '✓ Altijd Actief' : 'Non-Actief'}
              </div>
            </div>
          </div>

          {/* PQS Punten Tabel */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">PQS Punten Systeem</h3>
            <div className="grid grid-cols-8 gap-2">
              {PQS_LEVELS.map((level, idx) => (
                <div key={level.level} className="text-center">
                  <div className={`p-2 rounded-lg mb-1 ${
                    idx === 0 
                      ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400' 
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                  }`}>
                    <p className="text-xs font-bold">{level.level}</p>
                    <p className="text-lg font-bold">{level.points}</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">pts</p>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                <strong>Totaal mogelijk:</strong> {totalPQSPossible} punten via PQS
              </p>
            </div>
          </div>

          {/* Team Promotions */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Team Promotions</h3>
            <div className="grid grid-cols-7 gap-2">
              {TEAM_PROMOTIONS.map((promo) => (
                <div key={promo.niveau} className="text-center">
                  <div className="bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 p-2 rounded-lg mb-1">
                    <p className="text-xs font-bold">{promo.niveau}</p>
                    <p className="text-lg font-bold">+{promo.titel + promo.bonus}</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">pts</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Beloningen Card */}
        <div className="bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-6 h-6" />
            <h3 className="font-semibold">PQS Beloning</h3>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white/10 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <Wallet className="w-5 h-5 text-yellow-300" />
                <span className="font-semibold">Directe Bonus</span>
              </div>
              <p className="text-3xl font-bold">€{PQS_INFO.bonus}</p>
              <p className="text-sm text-white/80">cash bonus</p>
            </div>

            <div className="bg-white/10 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <Gift className="w-5 h-5 text-yellow-300" />
                <span className="font-semibold">Gift Punten</span>
              </div>
              <p className="text-3xl font-bold">+{PQS_INFO.points}</p>
              <p className="text-sm text-white/80">punten voor gift/cash</p>
            </div>

            <div className="bg-white/10 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-5 h-5 text-yellow-300" />
                <span className="font-semibold">Vereisten</span>
              </div>
              <ul className="text-sm space-y-1 text-white/90">
                <li>• {PQS_INFO.requiredASP} ASP in {PQS_INFO.deadlineDays} dagen</li>
                <li>• Min. {PQS_INFO.minMobile} mobiel</li>
                <li>• Min. {PQS_INFO.minEnergy} energie</li>
                <li>• Min. {PQS_INFO.minInternet} internet</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-sm text-white/80">
              <strong className="text-white">Belangrijk:</strong> PQS blijft altijd actief of non-actief, ook na behalen!
            </p>
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

          {/* Gift Selector Mini */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Beschikbare Gifts</h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">{USER_DATA.totalPoints} pts</span>
            </div>
            
            <div className="space-y-3">
              {GIFT_TIERS.slice(0, 4).map((tier) => {
                const isUnlocked = USER_DATA.totalPoints >= tier.points;
                return (
                  <button
                    key={tier.tier}
                    onClick={() => {
                      if (isUnlocked) {
                        setSelectedGiftTier(tier.tier);
                        setShowGiftModal(true);
                      }
                    }}
                    disabled={!isUnlocked}
                    className={`w-full p-3 rounded-xl text-left transition-all ${
                      isUnlocked 
                        ? 'bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600' 
                        : 'bg-gray-100 dark:bg-slate-800 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${tier.color} flex items-center justify-center`}>
                          <Gift className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">{tier.tier}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{tier.points} punten</p>
                        </div>
                      </div>
                      {isUnlocked ? (
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">Beschikbaar</span>
                      ) : (
                        <Lock className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            
            <button 
              onClick={() => setShowGiftModal(true)}
              className="w-full mt-4 py-2 text-sm text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-colors"
            >
              Bekijk alle gifts
            </button>
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

      {/* ===== GIFT SELECTOR MODAL ===== */}
      {showGiftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Kies Je Gift</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Je hebt {USER_DATA.totalPoints} punten. Kies 1 gift uit je behaalde tiers.
                  </p>
                </div>
                <button 
                  onClick={() => setShowGiftModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Rank Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Jouw Rank</label>
                <select 
                  value={selectedRank}
                  onChange={(e) => setSelectedRank(e.target.value as any)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white"
                >
                  <option value="BC">BC (Business Consultant)</option>
                  <option value="SC">SC (Senior Consultant)</option>
                  <option value="EC">EC (Executive Consultant)</option>
                  <option value="PC">PC (Presidential Consultant)</option>
                  <option value="MC">MC (Master Consultant)</option>
                  <option value="NMC">NMC (National Master Consultant)</option>
                  <option value="PMC">PMC (Platinum Master Consultant)</option>
                </select>
              </div>

              {/* Gift Tiers */}
              <div className="space-y-4">
                {GIFT_TIERS.map((tier) => {
                  const isUnlocked = USER_DATA.totalPoints >= tier.points;
                  const availableGifts = tier.gifts[selectedRank as keyof typeof tier.gifts] || [];
                  const hasGifts = availableGifts.length > 0;

                  if (!isUnlocked) return null;

                  return (
                    <div key={tier.tier} className={`p-4 rounded-xl border-2 ${
                      selectedGiftTier === tier.tier 
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10' 
                        : 'border-gray-200 dark:border-slate-700'
                    }`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center`}>
                          <Trophy className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white">{tier.tier} Tier</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{tier.points} punten vereist</p>
                        </div>
                        <CheckCircle2 className="w-6 h-6 text-green-500 ml-auto" />
                      </div>

                      {hasGifts ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {availableGifts.map((gift, idx) => (
                            <button
                              key={idx}
                              className="p-3 text-left bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg hover:border-orange-500 dark:hover:border-orange-500 transition-colors"
                            >
                              <p className="font-medium text-gray-900 dark:text-white text-sm">{gift}</p>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                          Geen gifts beschikbaar voor jouw rank in deze tier
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                Je kunt maar <strong>1 gift</strong> kiezen per kwartaal. Kies verstandig!
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowGiftModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Annuleren
                </button>
                <button 
                  onClick={() => {
                    setShowGiftModal(false);
                  }}
                  className="flex-1 px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Bevestig Keuze
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== PQS INFO MODAL ===== */}
      {showPQSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Personal Quick Start (PQS)</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Jouw eerste doel als nieuwe consultant</p>
                </div>
                <button 
                  onClick={() => setShowPQSModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-6">
                {/* Doelstelling */}
                <div className="bg-blue-50 dark:bg-blue-500/10 rounded-xl p-4">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">🎯 Doelstelling</h3>
                  <p className="text-blue-800 dark:text-blue-200">
                    Binnen de <strong>{PQS_INFO.deadlineDays} dagen</strong> na ondertekening minstens <strong>{PQS_INFO.requiredASP} ASP</strong> behalen.
                  </p>
                </div>

                {/* Vereisten */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">✓ Vereisten om PQS te valideren</h3>
                  <ul className="space-y-2">
                    {PQS_INFO.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Beloning */}
                <div className="bg-green-50 dark:bg-green-500/10 rounded-xl p-4">
                  <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2">💰 Beloning</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-2xl font-bold text-green-700 dark:text-green-400">€{PQS_INFO.bonus}</p>
                      <p className="text-sm text-green-600 dark:text-green-300">Cash bonus</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-700 dark:text-green-400">+{PQS_INFO.points}</p>
                      <p className="text-sm text-green-600 dark:text-green-300">Gift punten</p>
                    </div>
                  </div>
                </div>

                {/* Status Info */}
                <div className="bg-orange-50 dark:bg-orange-500/10 rounded-xl p-4">
                  <h3 className="font-semibold text-orange-900 dark:text-orange-300 mb-2">📌 PQS Status</h3>
                  <p className="text-orange-800 dark:text-orange-200 text-sm">
                    Eenmaal je PQS behaald hebt, blijft deze <strong>altijd actief of non-actief</strong>. 
                    Dit bepaalt of je blijft verdienen via het incentives systeem. Zorg dat je administratief in orde blijft!
                  </p>
                </div>

                {/* Uitgesloten diensten */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">⚠️ Uitgesloten diensten</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Deze diensten tellen niet mee voor PQS:</p>
                  <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1 list-disc list-inside">
                    <li>Orange Mobile Child</li>
                    <li>Connected Mobile Light, Small en Basic</li>
                    <li>Surf Extra Cards</li>
                    <li>TV (losse dienst)</li>
                    <li>Tariefplanwijzigingen bestaande klanten</li>
                    <li>Conversie Eneco-klanten</li>
                    <li>Orange-klanten die binnen 3 maanden terugkomen</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-slate-700">
              <button 
                onClick={() => setShowPQSModal(false)}
                className="w-full px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Begrepen
              </button>
            </div>
          </div>
        </div>
      )}
    </PremiumLayout>
  );
}
