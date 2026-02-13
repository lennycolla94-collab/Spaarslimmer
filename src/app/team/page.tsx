'use client';

import { useState } from 'react';
import { PremiumLayout } from '@/components/design-system/premium-layout';
import { 
  Users, 
  TrendingUp,
  Wallet,
  Target,
  Award,
  Crown,
  Star,
  ArrowUpRight,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

// Mock team/upline data
const MY_PERFORMANCE = {
  rank: 'Business Consultant',
  asp: 45,
  aspTarget: 100,
  personalCommission: 18650,
  fidelityCommission: 2450,
  totalCommission: 21100,
  downlineCount: 3
};

const UPLINE = {
  name: 'Sarah Johnson',
  rank: 'Premier Leader',
  email: 'sarah.j@smartsn.be',
  phone: '0471 23 45 67',
  city: 'Brussel',
  asp: 850,
  teamSize: 45
};

const DOWNLINE = [
  {
    id: '1',
    name: 'Mark De Vries',
    rank: 'Business Consultant',
    city: 'Antwerpen',
    asp: 35,
    commission: 12500,
    fidelity: 850,
    recruits: 2,
    status: 'ACTIVE'
  },
  {
    id: '2',
    name: 'Lisa Vermeer',
    rank: 'Business Consultant',
    city: 'Gent',
    asp: 28,
    commission: 9800,
    fidelity: 620,
    recruits: 1,
    status: 'ACTIVE'
  },
  {
    id: '3',
    name: 'Jef Peeters',
    rank: 'Junior Consultant',
    city: 'Leuven',
    asp: 15,
    commission: 4500,
    fidelity: 0,
    recruits: 0,
    status: 'ACTIVE'
  }
];

const FIDELITY_BREAKDOWN = [
  { level: 'Level 1 (Direct)', count: 3, commission: 1850, percentage: '5%' },
  { level: 'Level 2', count: 5, commission: 420, percentage: '3%' },
  { level: 'Level 3', count: 8, commission: 180, percentage: '2%' },
  { level: 'Level 4-7', count: 12, commission: 0, percentage: '1%' },
];

const RANK_REQUIREMENTS = [
  { rank: 'Business Consultant', minASP: 0, color: 'bg-gray-500', achieved: true },
  { rank: 'Senior Consultant', minASP: 10, color: 'bg-blue-500', achieved: true },
  { rank: 'Premier Consultant', minASP: 25, color: 'bg-purple-500', achieved: false },
  { rank: 'Leader', minASP: 50, color: 'bg-orange-500', achieved: false },
  { rank: 'Premier Leader', minASP: 100, color: 'bg-red-500', achieved: false },
];

export default function TeamPage() {
  const [expandedMember, setExpandedMember] = useState<string | null>(null);

  return (
    <PremiumLayout user={{ name: 'Lenny De K.' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mijn Team</h1>
          <p className="text-gray-500 mt-1">Upline, downline en fidelity overzicht</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-lg font-semibold">
            {MY_PERFORMANCE.rank}
          </span>
        </div>
      </div>

      {/* My Performance Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
            <Target className="w-6 h-6 text-orange-600" />
          </div>
          <p className="text-sm text-gray-500">ASP Deze Maand</p>
          <p className="text-2xl font-bold text-gray-900">{MY_PERFORMANCE.asp}</p>
          <p className="text-xs text-gray-500">doel: {MY_PERFORMANCE.aspTarget}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
            <Wallet className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-sm text-gray-500">Persoonlijke Commissie</p>
          <p className="text-2xl font-bold text-gray-900">€{MY_PERFORMANCE.personalCommission.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-sm text-gray-500">Fidelity Commissie</p>
          <p className="text-2xl font-bold text-gray-900">€{MY_PERFORMANCE.fidelityCommission.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-sm text-gray-500">Team Leden</p>
          <p className="text-2xl font-bold text-gray-900">{MY_PERFORMANCE.downlineCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Upline & Downline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upline */}
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-5 h-5" />
              <h2 className="font-semibold">Mijn Upline</h2>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center text-2xl font-bold">
                {UPLINE.name[0]}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold">{UPLINE.name}</h3>
                <p className="text-purple-100 mb-3">{UPLINE.rank}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-purple-100">
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {UPLINE.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {UPLINE.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {UPLINE.city}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-6">
                  <div>
                    <p className="text-2xl font-bold">{UPLINE.asp}</p>
                    <p className="text-xs text-purple-100">ASP Team</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{UPLINE.teamSize}</p>
                    <p className="text-xs text-purple-100">Team Grootte</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Downline */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Mijn Downline</h2>
                <p className="text-gray-500 text-sm">Directe teamleden</p>
              </div>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                {DOWNLINE.length} leden
              </span>
            </div>
            <div className="divide-y divide-gray-100">
              {DOWNLINE.map((member) => (
                <div key={member.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setExpandedMember(expandedMember === member.id ? null : member.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold">
                        {member.name[0]}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{member.name}</h3>
                        <p className="text-sm text-gray-500">{member.rank} • {member.city}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">€{member.commission.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Commissie</p>
                      </div>
                      {expandedMember === member.id ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                  
                  {expandedMember === member.id && (
                    <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">ASP</p>
                        <p className="font-semibold text-gray-900">{member.asp}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Fidelity</p>
                        <p className="font-semibold text-green-600">+€{member.fidelity}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Recruits</p>
                        <p className="font-semibold text-gray-900">{member.recruits}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Fidelity & Ranks */}
        <div className="space-y-6">
          {/* Fidelity Breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Fidelity Overzicht</h2>
            <div className="space-y-4">
              {FIDELITY_BREAKDOWN.map((level) => (
                <div key={level.level} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{level.level}</p>
                    <p className="text-sm text-gray-500">{level.count} personen • {level.percentage}</p>
                  </div>
                  <span className="font-semibold text-green-600">
                    +€{level.commission.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">Totaal Fidelity</span>
                <span className="text-xl font-bold text-green-600">
                  €{FIDELITY_BREAKDOWN.reduce((sum, l) => sum + l.commission, 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Rank Progress */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Rank Progressie</h2>
            <div className="space-y-3">
              {RANK_REQUIREMENTS.map((rank) => (
                <div 
                  key={rank.rank} 
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    rank.achieved ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${rank.color}`} />
                  <div className="flex-1">
                    <p className={`font-medium ${rank.achieved ? 'text-green-900' : 'text-gray-900'}`}>
                      {rank.rank}
                    </p>
                    <p className="text-xs text-gray-500">Min. {rank.minASP} ASP</p>
                  </div>
                  {rank.achieved && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-gradient-to-r from-orange-500 to-pink-600 rounded-lg text-white">
              <p className="text-sm text-orange-100">Volgende rank</p>
              <p className="font-semibold">Premier Consultant</p>
              <p className="text-xs text-orange-100 mt-1">Nog 25 ASP punten nodig</p>
            </div>
          </div>
        </div>
      </div>
    </PremiumLayout>
  );
}
