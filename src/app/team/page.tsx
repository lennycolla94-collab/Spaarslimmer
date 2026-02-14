'use client';

import { useState, useEffect } from 'react';
import { PremiumLayout } from '@/components/design-system/premium-layout';
import { 
  Users,
  Network,
  Trophy,
  Star,
  Crown,
  Award,
  Medal,
  Diamond,
  Zap,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  PhoneCall,
  Mail,
  TrendingUp,
  BarChart3,
  Target,
  ArrowRight,
  Info,
  X,
  User,
  UserPlus,
  Layers,
  Building2,
  Sparkles,
  Lock,
  Unlock,
  AlertCircle
} from 'lucide-react';

// ===== MLM RANKS & CRITERIA =====
const MLM_RANKS = [
  { 
    rank: 'BC', 
    name: 'Business Consultant', 
    color: 'gray',
    directRequired: 0, 
    teamRequired: 0, 
    aspRequired: 0,
    infinityBonus: [0, 0, 0, 0, 0, 0, 0],
    paidToLevel: 0,
    icon: User
  },
  { 
    rank: 'SC', 
    name: 'Senior Consultant', 
    color: 'blue',
    directRequired: 3, 
    teamRequired: 5, 
    aspRequired: 70,
    infinityBonus: [50, 0, 0, 0, 0, 0, 0],
    paidToLevel: 2,
    icon: Award
  },
  { 
    rank: 'EC', 
    name: 'Executive Consultant', 
    color: 'purple',
    directRequired: 6, 
    teamRequired: 15, 
    aspRequired: 200,
    infinityBonus: [50, 50, 0, 0, 0, 0, 0],
    paidToLevel: 3,
    icon: Crown
  },
  { 
    rank: 'PC', 
    name: 'Presidential Consultant', 
    color: 'orange',
    directRequired: 8, 
    teamRequired: 30, 
    aspRequired: 600,
    infinityBonus: [100, 50, 50, 0, 0, 0, 0],
    paidToLevel: 4,
    icon: Star
  },
  { 
    rank: 'MC', 
    name: 'Master Consultant', 
    color: 'pink',
    directRequired: 10, 
    teamRequired: 60, 
    aspRequired: 2500,
    infinityBonus: [150, 100, 50, 50, 0, 0, 0],
    paidToLevel: 5,
    icon: Trophy
  },
  { 
    rank: 'NMC', 
    name: 'National Master Consultant', 
    color: 'indigo',
    directRequired: 11, 
    teamRequired: 100, 
    aspRequired: 10000,
    infinityBonus: [200, 150, 100, 50, 50, 0, 0],
    paidToLevel: 6,
    icon: Medal
  },
  { 
    rank: 'PMC', 
    name: 'Platinum Master Consultant', 
    color: 'yellow',
    directRequired: 12, 
    teamRequired: 200, 
    aspRequired: 25000,
    infinityBonus: [300, 200, 150, 100, 50, 50, 0],
    paidToLevel: 7,
    icon: Diamond
  },
];

// Mock Team Data
const MY_TEAM = [
  { 
    id: 1, 
    name: 'Sarah Janssens', 
    rank: 'SC', 
    asp: 85, 
    status: 'active', 
    phone: '+32 477 12 34 56', 
    email: 'sarah@example.com', 
    level: 1, 
    hasPQS: true,
    recruits: 3,
    teamASP: 245
  },
  { 
    id: 2, 
    name: 'Mark De Vries', 
    rank: 'BC', 
    asp: 42, 
    status: 'active', 
    phone: '+32 478 23 45 67', 
    email: 'mark@example.com', 
    level: 1, 
    hasPQS: false,
    recruits: 1,
    teamASP: 18
  },
  { 
    id: 3, 
    name: 'Lisa Van den Berg', 
    rank: 'EC', 
    asp: 156, 
    status: 'active', 
    phone: '+32 479 34 56 78', 
    email: 'lisa@example.com', 
    level: 1, 
    hasPQS: true,
    recruits: 5,
    teamASP: 420
  },
  { 
    id: 4, 
    name: 'Jef Peeters', 
    rank: 'BC', 
    asp: 28, 
    status: 'inactive', 
    phone: '+32 480 45 67 89', 
    email: 'jef@example.com', 
    level: 2, 
    parentId: 1, 
    hasPQS: false,
    recruits: 1,
    teamASP: 12
  },
  { 
    id: 5, 
    name: 'Emma Wouters', 
    rank: 'BC', 
    asp: 35, 
    status: 'active', 
    phone: '+32 481 56 78 90', 
    email: 'emma@example.com', 
    level: 2, 
    parentId: 1, 
    hasPQS: false,
    recruits: 0,
    teamASP: 0
  },
  { 
    id: 6, 
    name: 'Tom Jacobs', 
    rank: 'SC', 
    asp: 92, 
    status: 'active', 
    phone: '+32 482 67 89 01', 
    email: 'tom@example.com', 
    level: 2, 
    parentId: 2, 
    hasPQS: true,
    recruits: 2,
    teamASP: 98
  },
  { 
    id: 7, 
    name: 'Anna Smits', 
    rank: 'BC', 
    asp: 18, 
    status: 'active', 
    phone: '+32 483 78 90 12', 
    email: 'anna@example.com', 
    level: 3, 
    parentId: 4, 
    hasPQS: false,
    recruits: 0,
    teamASP: 0
  },
  { 
    id: 8, 
    name: 'Peter Vermeulen', 
    rank: 'BC', 
    asp: 22, 
    status: 'active', 
    phone: '+32 484 89 01 23', 
    email: 'peter@example.com', 
    level: 3, 
    parentId: 4, 
    hasPQS: false,
    recruits: 0,
    teamASP: 0
  },
  { 
    id: 9, 
    name: 'Sofie De Smet', 
    rank: 'BC', 
    asp: 31, 
    status: 'active', 
    phone: '+32 485 90 12 34', 
    email: 'sofie@example.com', 
    level: 3, 
    parentId: 6, 
    hasPQS: false,
    recruits: 1,
    teamASP: 15
  },
  { 
    id: 10, 
    name: 'Koen Maes', 
    rank: 'BC', 
    asp: 15, 
    status: 'inactive', 
    phone: '+32 486 01 23 45', 
    email: 'koen@example.com', 
    level: 4, 
    parentId: 9, 
    hasPQS: false,
    recruits: 0,
    teamASP: 0
  },
];

// Recent PQS in team
const RECENT_TEAM_PQS = [
  { name: 'Sarah Janssens', date: '2 dagen geleden', bonus: '€50', level: 1 },
  { name: 'Tom Jacobs', date: '1 week geleden', bonus: '€50', level: 2 },
  { name: 'Lisa Van den Berg', date: '2 weken geleden', bonus: '€50', level: 1 },
];

// Mock user data
const USER_DATA = {
  currentRank: 'EC',
  mlmEligible: true,
  teamStats: {
    totalConsultants: 24,
    activeConsultants: 18,
    totalLevels: 4,
    totalASP: 2847,
    directConsultants: 6,
    ecInTeam: 3
  },
  infinityBonus: {
    thisMonth: 450,
    potential: 600,
    totalEarned: 3200
  }
};

// Custom Infinity Icon component
function InfinityIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z"/>
    </svg>
  );
}

export default function TeamPage() {
  const [activeTab, setActiveTab] = useState('structure');
  const [expandedLevels, setExpandedLevels] = useState<number[]>([1]);
  const [showMLMDetails, setShowMLMDetails] = useState(false);
  const [liveIBAmount, setLiveIBAmount] = useState(USER_DATA.infinityBonus.thisMonth);
  const [selectedConsultant, setSelectedConsultant] = useState<typeof MY_TEAM[0] | null>(null);

  // Simulate real-time IB updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveIBAmount(prev => {
        const variation = (Math.random() - 0.5) * 10;
        return Math.max(0, Math.round((prev + variation) * 100) / 100);
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentRankData = MLM_RANKS.find(r => r.rank === USER_DATA.currentRank) || MLM_RANKS[0];
  const nextRankData = MLM_RANKS[MLM_RANKS.findIndex(r => r.rank === USER_DATA.currentRank) + 1];

  const toggleLevel = (level: number) => {
    setExpandedLevels(prev => 
      prev.includes(level) 
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  const getTeamByLevel = (level: number) => MY_TEAM.filter(m => m.level === level);

  const getProgressPercentage = () => {
    if (!nextRankData) return 100;
    return Math.min(100, (USER_DATA.teamStats.directConsultants / nextRankData.directRequired) * 100);
  };

  return (
    <PremiumLayout user={{ name: 'Lenny De K.' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mijn Team</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">MLM netwerk, Infinity Bonus & Team groei</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Nieuwe Recruit</span>
          </button>
        </div>
      </div>

      {/* ===== MLM STATUS CARD ===== */}
      <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 rounded-2xl p-6 mb-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
        
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Network className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                    {currentRankData.rank}
                  </span>
                  <span className="text-purple-200 text-sm">{currentRankData.name}</span>
                </div>
                <h2 className="text-2xl font-bold">MLM Dashboard</h2>
                <p className="text-purple-200 text-sm">Netwerk prestaties & beloningen</p>
              </div>
            </div>
            
            {/* MLM Eligibility Badge */}
            <div className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
              USER_DATA.mlmEligible 
                ? 'bg-green-500/30 border border-green-400/50' 
                : 'bg-red-500/30 border border-red-400/50'
            }`}>
              {USER_DATA.mlmEligible ? (
                <>
                  <Unlock className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-sm font-semibold text-green-100">MLM Eligible</p>
                    <p className="text-xs text-green-200">Alle bonussen actief</p>
                  </div>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5 text-red-400" />
                  <div>
                    <p className="text-sm font-semibold text-red-100">Niet Eligible</p>
                    <p className="text-xs text-red-200">Criteria niet gehaald</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* MLM Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-purple-300" />
                <span className="text-sm text-purple-200">Team</span>
              </div>
              <p className="text-2xl font-bold">{USER_DATA.teamStats.totalConsultants}</p>
              <p className="text-xs text-purple-300">{USER_DATA.teamStats.activeConsultants} actief</p>
            </div>
            
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-4 h-4 text-pink-300" />
                <span className="text-sm text-pink-200">Niveaus</span>
              </div>
              <p className="text-2xl font-bold">{USER_DATA.teamStats.totalLevels}</p>
              <p className="text-xs text-pink-300">diep</p>
            </div>
            
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-blue-300" />
                <span className="text-sm text-blue-200">Team ASP</span>
              </div>
              <p className="text-2xl font-bold">{USER_DATA.teamStats.totalASP.toLocaleString()}</p>
              <p className="text-xs text-blue-300">totaal</p>
            </div>
            
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm relative overflow-hidden">
              <div className="flex items-center gap-2 mb-2">
                <InfinityIcon className="w-4 h-4 text-yellow-300" />
                <span className="text-sm text-yellow-200">Infinity Bonus</span>
              </div>
              <p className="text-2xl font-bold">€{liveIBAmount.toFixed(0)}</p>
              <p className="text-xs text-yellow-300">deze maand • live</p>
              <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Rank Progress */}
          {nextRankData && (
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progress naar {nextRankData.rank} ({nextRankData.name})</span>
                <span className="text-sm text-purple-200">
                  {USER_DATA.teamStats.directConsultants}/{nextRankData.directRequired} direct • {USER_DATA.teamStats.totalASP.toLocaleString()}/{nextRankData.aspRequired.toLocaleString()} ASP
                </span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-500"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-1 mb-6 inline-flex">
        {[
          { id: 'structure', label: 'Team Structuur', icon: Network },
          { id: 'infinity', label: 'Infinity Bonus', icon: InfinityIcon },
          { id: 'criteria', label: 'MLM Criteria', icon: Award },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === tab.id 
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===== TAB: TEAM STRUCTUUR ===== */}
      {activeTab === 'structure' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Team Tree */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Network className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Team Overzicht</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{USER_DATA.teamStats.totalConsultants} consultants • {USER_DATA.teamStats.ecInTeam} EC+</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {/* Level 1 - Direct */}
              <div className="border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
                <button 
                  onClick={() => toggleLevel(1)}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-500/10 dark:to-orange-500/5 hover:from-orange-100 hover:to-orange-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      1
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900 dark:text-white">Directe Consultants</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{getTeamByLevel(1).length} personen</p>
                    </div>
                  </div>
                  {expandedLevels.includes(1) ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                
                {expandedLevels.includes(1) && (
                  <div className="p-4 space-y-3">
                    {getTeamByLevel(1).map(member => (
                      <div 
                        key={member.id} 
                        onClick={() => setSelectedConsultant(member)}
                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {member.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900 dark:text-white">{member.name}</p>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              member.rank === 'EC' ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400' :
                              member.rank === 'SC' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
                              'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
                            }`}>
                              {member.rank}
                            </span>
                            {member.hasPQS && (
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 text-xs rounded-full font-medium">
                                ✓ PQS
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {member.asp} ASP • {member.recruits} recruits • {member.teamASP} team ASP
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <a href={`tel:${member.phone}`} onClick={(e) => e.stopPropagation()} className="p-2 text-gray-400 hover:text-green-500 transition-colors">
                            <PhoneCall className="w-4 h-4" />
                          </a>
                          <a href={`mailto:${member.email}`} onClick={(e) => e.stopPropagation()} className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                            <Mail className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Level 2 */}
              <div className="border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
                <button 
                  onClick={() => toggleLevel(2)}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-500/10 dark:to-blue-500/5 hover:from-blue-100 hover:to-blue-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      2
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900 dark:text-white">Niveau 2</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{getTeamByLevel(2).length} personen</p>
                    </div>
                  </div>
                  {expandedLevels.includes(2) ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                
                {expandedLevels.includes(2) && (
                  <div className="p-4 space-y-2">
                    {getTeamByLevel(2).map(member => (
                      <div 
                        key={member.id}
                        onClick={() => setSelectedConsultant(member)}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-lg cursor-pointer"
                      >
                        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {member.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900 dark:text-white text-sm">{member.name}</p>
                            <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-slate-600 text-gray-600 dark:text-gray-400 text-xs rounded">{member.rank}</span>
                            {member.hasPQS && <span className="text-green-500 text-xs">✓ PQS</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Levels 3 & 4 */}
              <div className="grid grid-cols-2 gap-3">
                {[3, 4].map(level => (
                  <div key={level} className="border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
                    <button 
                      onClick={() => toggleLevel(level)}
                      className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-500/10 dark:to-purple-500/5 hover:from-purple-100 hover:to-purple-200 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm ${
                          level === 3 ? 'bg-purple-500' : 'bg-pink-500'
                        }`}>
                          {level}
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">Niveau {level}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{getTeamByLevel(level).length} personen</p>
                        </div>
                      </div>
                      {expandedLevels.includes(level) ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </button>
                    
                    {expandedLevels.includes(level) && (
                      <div className="p-3 space-y-2">
                        {getTeamByLevel(level).map(member => (
                          <div 
                            key={member.id}
                            onClick={() => setSelectedConsultant(member)}
                            className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-lg cursor-pointer"
                          >
                            <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-white text-xs">
                              {member.name.charAt(0)}
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{member.name}</p>
                            {member.hasPQS && <span className="text-green-500 text-xs ml-auto">✓</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            {/* Live IB Card */}
            <div className="bg-gradient-to-br from-pink-500 via-rose-500 to-red-600 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <InfinityIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Infinity Bonus</h3>
                    <p className="text-sm text-pink-100">Real-time verdiensten</p>
                  </div>
                </div>
                
                <div className="text-center mb-4">
                  <p className="text-5xl font-bold">€{liveIBAmount.toFixed(2)}</p>
                  <p className="text-sm text-pink-200 mt-1">Deze maand verdiend</p>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-pink-200">Potentieel: €{USER_DATA.infinityBonus.potential}</span>
                  <span className="text-pink-200">Totaal: €{USER_DATA.infinityBonus.totalEarned.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Recent Team PQS */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Recente PQS in Team
              </h3>
              <div className="space-y-3">
                {RECENT_TEAM_PQS.map((pqs, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-500/10 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{pqs.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{pqs.date} • Niv {pqs.level}</p>
                    </div>
                    <span className="font-semibold text-green-600 dark:text-green-400">{pqs.bonus}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Team Stats</h3>
              <div className="space-y-3">
                {[
                  { label: 'Totaal Consultants', value: USER_DATA.teamStats.totalConsultants },
                  { label: 'Actief', value: USER_DATA.teamStats.activeConsultants },
                  { label: 'PQS Behaald', value: '4' },
                  { label: 'Nieuwe Deze Maand', value: '2' },
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
      )}

      {/* ===== TAB: INFINITY BONUS ===== */}
      {activeTab === 'infinity' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* IB Per Level */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <InfinityIcon className="w-6 h-6 text-purple-500" />
              Infinity Bonus Per Niveau
            </h3>
            
            <div className="space-y-4">
              {currentRankData.infinityBonus.map((bonus, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold ${
                    idx === 0 ? 'bg-orange-500' :
                    idx === 1 ? 'bg-blue-500' :
                    idx === 2 ? 'bg-purple-500' :
                    idx === 3 ? 'bg-pink-500' :
                    idx === 4 ? 'bg-indigo-500' :
                    idx === 5 ? 'bg-cyan-500' :
                    'bg-gray-400'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">Niveau {idx + 1}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {idx < USER_DATA.teamStats.totalLevels ? `${getTeamByLevel(idx + 1).length} consultants` : 'Geen team'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${bonus > 0 ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}>
                      {bonus > 0 ? `€${bonus}` : '-'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {bonus > 0 ? 'per PQS' : 'N/A'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-500/10 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900 dark:text-white">Jij betaalt IB tot niveau</span>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 rounded-full font-bold">
                  {currentRankData.paidToLevel}
                </span>
              </div>
            </div>
          </div>

          {/* IB Explanation */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Hoe Werkt Infinity Bonus?</h3>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>
                  De <strong>Infinity Bonus (IB)</strong> wordt toegekend wanneer een consultant in jouw team zijn/haar PQS behaalt.
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>IB wordt berekend op de dag van de actie</li>
                  <li>Maximaal €300 per consultant per PQS</li>
                  <li>Oneindig betaald tot boven niveau 7</li>
                  <li>Hangt af van je eigen rank</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Deze Maand
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-3xl font-bold">€{liveIBAmount.toFixed(2)}</p>
                  <p className="text-sm text-white/80">Verdiend</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-3xl font-bold">3</p>
                  <p className="text-sm text-white/80">PQS behaald</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">IB Historie</h3>
              <div className="space-y-2">
                {[
                  { month: 'Januari 2025', amount: 450 },
                  { month: 'December 2024', amount: 380 },
                  { month: 'November 2024', amount: 520 },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2">
                    <span className="text-gray-600 dark:text-gray-400">{item.month}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">€{item.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== TAB: MLM CRITERIA ===== */}
      {activeTab === 'criteria' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">MLM Eligibility Criteria</h3>
            <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 rounded-full text-sm">
              <Info className="w-4 h-4" />
              Jouw rank: {currentRankData.rank}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Rank</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">Direct</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">Team</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">ASP</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">IB Niv 1</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">Betaald tot</th>
                </tr>
              </thead>
              <tbody>
                {MLM_RANKS.map((rank) => {
                  const isCurrent = rank.rank === USER_DATA.currentRank;
                  return (
                    <tr key={rank.rank} className={`border-b border-gray-100 dark:border-slate-700 ${isCurrent ? 'bg-orange-50 dark:bg-orange-500/10' : ''}`}>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <rank.icon className={`w-4 h-4 ${isCurrent ? 'text-orange-500' : 'text-gray-400'}`} />
                          <div>
                            <p className={`font-semibold ${isCurrent ? 'text-orange-700 dark:text-orange-400' : 'text-gray-900 dark:text-white'}`}>
                              {rank.rank}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{rank.name}</p>
                          </div>
                          {isCurrent && (
                            <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 text-xs rounded-full">
                              JIJ
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="text-center py-3 px-4 text-gray-600 dark:text-gray-400">{rank.directRequired}</td>
                      <td className="text-center py-3 px-4 text-gray-600 dark:text-gray-400">{rank.teamRequired}</td>
                      <td className="text-center py-3 px-4 text-gray-600 dark:text-gray-400">{rank.aspRequired.toLocaleString()}</td>
                      <td className="text-center py-3 px-4">
                        <span className={rank.infinityBonus[0] > 0 ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-gray-400'}>
                          {rank.infinityBonus[0] > 0 ? `€${rank.infinityBonus[0]}` : '-'}
                        </span>
                      </td>
                      <td className="text-center py-3 px-4">
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 rounded-full text-sm">
                          Niv {rank.paidToLevel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">ℹ️ Belangrijke Info</h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Vanaf PC ben je verplicht om het netwerkcriterium te behalen (minstens 3 EC+ in 3 verschillende benen)</li>
              <li>• Infinity Bonus wordt berekend op de dag van de actie, niet op de dag van betaling</li>
              <li>• Maximale IB is €300 per consultant per PQS</li>
              <li>• IB wordt oneindig betaald tot boven niveau 7</li>
            </ul>
          </div>
        </div>
      )}

      {/* Consultant Detail Modal */}
      {selectedConsultant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Consultant Details</h3>
                <button 
                  onClick={() => setSelectedConsultant(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {selectedConsultant.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white">{selectedConsultant.name}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    selectedConsultant.rank === 'EC' ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400' :
                    selectedConsultant.rank === 'SC' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
                    'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
                  }`}>
                    {selectedConsultant.rank}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                    <p className="text-sm text-gray-500 dark:text-gray-400">ASP</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{selectedConsultant.asp}</p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Recruits</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{selectedConsultant.recruits}</p>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Team ASP</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{selectedConsultant.teamASP}</p>
                </div>

                {selectedConsultant.hasPQS && (
                  <div className="p-3 bg-green-50 dark:bg-green-500/10 rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="font-medium text-green-700 dark:text-green-400">PQS Behaald!</span>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <a href={`tel:${selectedConsultant.phone}`} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                    <PhoneCall className="w-4 h-4" />
                    Bel
                  </a>
                  <a href={`mailto:${selectedConsultant.email}`} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    <Mail className="w-4 h-4" />
                    Mail
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PremiumLayout>
  );
}
