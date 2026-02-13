'use client';

export const dynamic = 'force-dynamic';

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
  ChevronRight,
  Percent,
  Gift,
  UserPlus,
  BarChart3,
  DollarSign,
  Handshake,
  CheckCircle2
} from 'lucide-react';

// Upline commission structure
const UPLINE_STRUCTURE = [
  { 
    level: 'Level 0 (Jij)', 
    role: 'Business Consultant',
    commission: '100%',
    personalRate: '100%',
    fromDownline: 'N/A',
    example: '€186 sale = €186'
  },
  { 
    level: 'Level 1 (Direct)', 
    role: 'Sponsor/Mentor',
    commission: '+5% Fidelity',
    personalRate: '100%',
    fromDownline: '5% van elke sale',
    example: '€186 sale = +€9.30'
  },
  { 
    level: 'Level 2', 
    role: 'Senior Consultant',
    commission: '+3% Override',
    personalRate: '100% + team bonus',
    fromDownline: '3% van niveau 2',
    example: '€186 sale = +€5.58'
  },
  { 
    level: 'Level 3', 
    role: 'Premier Consultant',
    commission: '+2% Override',
    personalRate: '100% + team bonus',
    fromDownline: '2% van niveau 3',
    example: '€186 sale = +€3.72'
  },
  { 
    level: 'Level 4-7', 
    role: 'Leader/Premier Leader',
    commission: '+1% Infinity',
    personalRate: '100% + infinity bonus',
    fromDownline: '1% van niveau 4-7',
    example: '€186 sale = +€1.86'
  },
];

const MY_PERFORMANCE = {
  rank: 'Business Consultant',
  asp: 45,
  aspTarget: 100,
  personalCommission: 18650,
  fidelityCommission: 2450,
  overrideCommission: 890,
  infinityCommission: 0,
  totalCommission: 21990,
  downlineCount: 3,
  indirectCount: 8,
  teamSize: 12
};

const UPLINE = {
  name: 'Sarah Johnson',
  rank: 'Premier Leader',
  email: 'sarah.j@smartsn.be',
  phone: '0471 23 45 67',
  city: 'Brussel',
  asp: 850,
  teamSize: 45,
  commissionFromMe: 186.50, // 5% fidelity example
  level: 'Level 1 (Direct Sponsor)'
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
    indirect: 3,
    status: 'ACTIVE',
    myCommissionFromThem: 62.50 // 5% of their sales
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
    indirect: 0,
    status: 'ACTIVE',
    myCommissionFromThem: 49.00
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
    indirect: 0,
    status: 'ACTIVE',
    myCommissionFromThem: 22.50
  }
];

const FIDELITY_BREAKDOWN = [
  { level: 'Level 1 (Direct)', count: 3, commission: 1850, percentage: '5%', monthlyAvg: '€617' },
  { level: 'Level 2', count: 5, commission: 420, percentage: '3%', monthlyAvg: '€84' },
  { level: 'Level 3', count: 8, commission: 180, percentage: '2%', monthlyAvg: '€23' },
  { level: 'Level 4-7', count: 12, commission: 0, percentage: '1%', monthlyAvg: '€0' },
];

const RANK_REQUIREMENTS = [
  { rank: 'Business Consultant', minASP: 0, teamSize: 0, color: 'bg-gray-500', achieved: true, fidelityRate: 'N/A' },
  { rank: 'Senior Consultant', minASP: 10, teamSize: 2, color: 'bg-blue-500', achieved: true, fidelityRate: '+5% L1' },
  { rank: 'Premier Consultant', minASP: 25, teamSize: 5, color: 'bg-purple-500', achieved: false, fidelityRate: '+5% L1, +3% L2' },
  { rank: 'Leader', minASP: 50, teamSize: 10, color: 'bg-orange-500', achieved: false, fidelityRate: '+5% L1, +3% L2, +2% L3' },
  { rank: 'Premier Leader', minASP: 100, teamSize: 25, color: 'bg-red-500', achieved: false, fidelityRate: '+5% L1, +3% L2, +2% L3, +1% L4-7' },
];

export default function TeamPage() {
  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('OVERVIEW');

  const totalFidelity = FIDELITY_BREAKDOWN.reduce((sum, l) => sum + l.commission, 0);
  const totalFromDownline = DOWNLINE.reduce((sum, m) => sum + m.myCommissionFromThem, 0);

  return (
    <PremiumLayout user={{ name: 'Lenny De K.' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mijn Team & Upline</h1>
          <p className="text-gray-500 mt-1">Fidelity, overrides en team structuur</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-lg font-semibold">
            {MY_PERFORMANCE.rank}
          </span>
        </div>
      </div>

      {/* Commission Structure Explainer */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Handshake className="w-5 h-5" />
          Upline Vergoedingen (Fidelity & Overrides)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {UPLINE_STRUCTURE.map((level, idx) => (
            <div key={idx} className={`p-4 rounded-lg ${idx === 0 ? 'bg-white/20 border-2 border-white' : 'bg-white/10'}`}>
              <p className="text-xs text-purple-200 mb-1">{level.level}</p>
              <p className="font-semibold text-sm">{level.role}</p>
              <p className="text-lg font-bold text-yellow-300 mt-1">{level.commission}</p>
              <p className="text-xs text-purple-100 mt-2">{level.example}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-purple-100">
          💡 Jij verdient 5% fidelity van je directe downline, 3% van niveau 2, 2% van niveau 3, en 1% van niveau 4-7 (infinity bonus)
        </p>
      </div>

      {/* My Performance Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
            <Target className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-sm text-gray-500">ASP Deze Maand</p>
          <p className="text-2xl font-bold text-gray-900">{MY_PERFORMANCE.asp}</p>
          <p className="text-xs text-gray-400">doel: {MY_PERFORMANCE.aspTarget}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
            <Wallet className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-sm text-gray-500">Persoonlijke Commissie</p>
          <p className="text-2xl font-bold text-gray-900">€{MY_PERFORMANCE.personalCommission.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-sm text-gray-500">Fidelity + Overrides</p>
          <p className="text-2xl font-bold text-green-600">€{(MY_PERFORMANCE.fidelityCommission + MY_PERFORMANCE.overrideCommission).toLocaleString()}</p>
          <p className="text-xs text-green-600">+{((MY_PERFORMANCE.fidelityCommission + MY_PERFORMANCE.overrideCommission) / MY_PERFORMANCE.totalCommission * 100).toFixed(0)}% extra</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-sm text-gray-500">Team Grootte</p>
          <p className="text-2xl font-bold text-gray-900">{MY_PERFORMANCE.teamSize}</p>
          <p className="text-xs text-gray-400">{MY_PERFORMANCE.downlineCount} direct • {MY_PERFORMANCE.indirectCount} indirect</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Upline & Downline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upline - Who earns from me */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-5 h-5" />
              <h2 className="font-semibold">Mijn Upline (Verdient van mij)</h2>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center text-2xl font-bold">
                {UPLINE.name[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{UPLINE.name}</h3>
                    <p className="text-indigo-100">{UPLINE.rank} • {UPLINE.level}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-yellow-300">€{UPLINE.commissionFromMe.toFixed(2)}</p>
                    <p className="text-xs text-indigo-100">Deze maand van jou</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-indigo-100 mt-3">
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
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-sm text-indigo-100">
                    💡 Sarah verdient 5% fidelity van al jouw sales. Bij een sale van €186 krijgt zij €9.30
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Downline - Who I earn from */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Mijn Downline (Jij verdient van hen)</h2>
                <p className="text-gray-500 text-sm">Fidelity commissie van je team</p>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  €{totalFromDownline.toFixed(2)} deze maand
                </span>
              </div>
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
                        <p className="font-semibold text-green-600">+€{member.myCommissionFromThem.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">5% fidelity</p>
                      </div>
                      {expandedMember === member.id ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                  
                  {expandedMember === member.id && (
                    <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">ASP</p>
                        <p className="font-semibold text-gray-900">{member.asp}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Totale Commissie</p>
                        <p className="font-semibold text-gray-900">€{member.commission.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Hun Fidelity</p>
                        <p className="font-semibold text-green-600">+€{member.fidelity}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Team</p>
                        <p className="font-semibold text-gray-900">{member.recruits} direct • {member.indirect} indirect</p>
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
            <div className="flex items-center gap-2 mb-4">
              <Percent className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-semibold text-gray-900">Fidelity Overzicht</h2>
            </div>
            <div className="space-y-3">
              {FIDELITY_BREAKDOWN.map((level) => (
                <div key={level.level} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900">{level.level}</p>
                    <span className="text-sm font-semibold text-orange-600">{level.percentage}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{level.count} personen</span>
                    <span className="font-semibold text-green-600">+€{level.commission.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Gemiddeld {level.monthlyAvg}/maand</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">Totaal Fidelity</span>
                <span className="text-xl font-bold text-green-600">
                  €{totalFidelity.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Dit is {((totalFidelity / MY_PERFORMANCE.totalCommission) * 100).toFixed(1)}% van je totale inkomen
              </p>
            </div>
          </div>

          {/* Rank Progress */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-purple-500" />
              <h2 className="text-lg font-semibold text-gray-900">Rank Progressie</h2>
            </div>
            <div className="space-y-2">
              {RANK_REQUIREMENTS.map((rank) => (
                <div 
                  key={rank.rank} 
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    rank.achieved ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${rank.color}`} />
                  <div className="flex-1">
                    <p className={`font-medium text-sm ${rank.achieved ? 'text-green-900' : 'text-gray-900'}`}>
                      {rank.rank}
                    </p>
                    <p className="text-xs text-gray-500">
                      Min. {rank.minASP} ASP • {rank.teamSize} team
                    </p>
                    <p className="text-xs text-orange-600 font-medium">
                      {rank.fidelityRate}
                    </p>
                  </div>
                  {rank.achieved && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-gradient-to-r from-orange-500 to-pink-600 rounded-lg text-white">
              <p className="text-sm text-orange-100">Volgende rank</p>
              <p className="font-semibold">Premier Consultant</p>
              <p className="text-xs text-orange-100 mt-1">Nog 25 ASP + 2 teamleden nodig</p>
              <div className="mt-2 h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: '65%' }} />
              </div>
            </div>
          </div>

          {/* Commission Calculator */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5" />
              <h3 className="font-semibold">Commissie Calculator</h3>
            </div>
            <p className="text-sm text-green-100 mb-3">
              Bij een gemiddelde sale van €186:
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Jij verdient:</span>
                <span className="font-bold">€186.00 (100%)</span>
              </div>
              <div className="flex justify-between text-green-100">
                <span>Je sponsor (5%):</span>
                <span>+€9.30</span>
              </div>
              <div className="flex justify-between text-green-100">
                <span>Level 2 (3%):</span>
                <span>+€5.58</span>
              </div>
              <div className="flex justify-between text-green-100">
                <span>Level 3 (2%):</span>
                <span>+€3.72</span>
              </div>
              <div className="pt-2 border-t border-white/20 flex justify-between font-bold">
                <span>Totaal uitbetaald:</span>
                <span>€204.60</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PremiumLayout>
  );
}
