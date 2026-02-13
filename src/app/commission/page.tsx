'use client';

import { useState } from 'react';
import { PremiumLayout } from '@/components/design-system/premium-layout';
import { 
  Wallet, 
  TrendingUp,
  TrendingDown,
  Target,
  Calendar,
  FileText,
  CheckCircle2,
  Clock,
  ArrowRight,
  Download,
  Filter
} from 'lucide-react';
import Link from 'next/link';

// Mock commission data
const COMMISSION_STATS = {
  month: 18650,
  year: 89450,
  potential: 14840,
  pending: 8540,
  trend: '+12%'
};

const PIPELINE = [
  { stage: 'Offerte Verstuurd', count: 8, value: 8540, probability: 30 },
  { stage: 'In Onderhandeling', count: 4, value: 4200, probability: 60 },
  { stage: 'Bijna Gesloten', count: 2, value: 2100, probability: 80 },
];

const RECENT_COMMISSIONS = [
  { id: '1', client: 'Bakkerij De Lekkernij', amount: 186, status: 'PAID', date: '2025-02-10', type: 'SALE' },
  { id: '2', client: 'Tech Solutions BV', amount: 520, status: 'PENDING', date: '2025-02-08', type: 'SALE' },
  { id: '3', client: 'NecmiCuts', amount: 240, status: 'PENDING', date: '2025-02-05', type: 'SALE' },
  { id: '4', client: 'Constructie Groep', amount: 450, status: 'EXPECTED', date: '2025-02-01', type: 'OFFER' },
];

export default function CommissionPage() {
  const [timeFilter, setTimeFilter] = useState('MONTH');

  return (
    <PremiumLayout user={{ name: 'Lenny De K.' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Commissie</h1>
          <p className="text-gray-500 mt-1">Volg je verdiensten en pipeline</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          >
            <option value="MONTH">Deze Maand</option>
            <option value="QUARTER">Dit Kwartaal</option>
            <option value="YEAR">Dit Jaar</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-orange-600" />
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" />
              {COMMISSION_STATS.trend}
            </span>
          </div>
          <p className="text-sm text-gray-500">Deze Maand</p>
          <p className="text-3xl font-bold text-gray-900">€{COMMISSION_STATS.month.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-sm text-gray-500">Dit Jaar</p>
          <p className="text-3xl font-bold text-gray-900">€{COMMISSION_STATS.year.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
            <Target className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-sm text-gray-500">Potentieel</p>
          <p className="text-3xl font-bold text-gray-900">€{COMMISSION_STATS.potential.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
          <p className="text-sm text-gray-500">In Afwachting</p>
          <p className="text-3xl font-bold text-gray-900">€{COMMISSION_STATS.pending.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pipeline */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Pipeline</h2>
            <p className="text-gray-500 text-sm mt-1">Verwachte commissie per fase</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {PIPELINE.map((stage) => (
                <div key={stage.stage} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-900">{stage.stage}</span>
                      <span className="text-xs text-gray-500">({stage.count} deals)</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">€{stage.value.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{stage.probability}% kans</p>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-500 to-pink-600 rounded-full"
                      style={{ width: `${stage.probability}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Verwacht: €{Math.round(stage.value * stage.probability / 100).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">Totaal Potentieel</span>
                <span className="text-2xl font-bold text-orange-600">
                  €{PIPELINE.reduce((sum, s) => sum + Math.round(s.value * s.probability / 100), 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Recente Commissies</h2>
              <p className="text-gray-500 text-sm mt-1">Laatste transacties</p>
            </div>
            <Link href="/offers" className="text-sm font-medium text-orange-600 hover:text-orange-700">
              Bekijk Alles →
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {RECENT_COMMISSIONS.map((commission) => (
              <div key={commission.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    commission.status === 'PAID' ? 'bg-green-100 text-green-600' :
                    commission.status === 'PENDING' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {commission.status === 'PAID' ? <CheckCircle2 className="w-5 h-5" /> :
                     commission.status === 'PENDING' ? <Clock className="w-5 h-5" /> :
                     <FileText className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{commission.client}</p>
                    <p className="text-sm text-gray-500">{commission.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">€{commission.amount}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    commission.status === 'PAID' ? 'bg-green-100 text-green-700' :
                    commission.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {commission.status === 'PAID' ? 'Betaald' :
                     commission.status === 'PENDING' ? 'In behandeling' :
                     'Verwacht'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PremiumLayout>
  );
}
