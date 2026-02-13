'use client';

import { useState, useEffect } from 'react';
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
  Filter,
  AlertTriangle,
  Shield,
  Timer,
  Phone,
  UserCheck,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

// Helper to calculate days/months remaining
function getClawbackStatus(saleDate: string) {
  const sale = new Date(saleDate);
  const now = new Date();
  const daysSinceSale = Math.floor((now.getTime() - sale.getTime()) / (1000 * 60 * 60 * 24));
  const monthsSinceSale = daysSinceSale / 30;
  
  // Clawback rules:
  // < 1 month = 0% (full clawback risk)
  // ≥ 1 month = 25% risk
  // ≥ 6 months = 75% safe (25% risk)
  
  let clawbackRisk: 'HIGH' | 'MEDIUM' | 'LOW' | 'SAFE';
  let riskPercentage: number;
  let statusText: string;
  let progressPercent: number;
  
  if (monthsSinceSale < 1) {
    clawbackRisk = 'HIGH';
    riskPercentage = 100;
    statusText = `${30 - daysSinceSale} dagen tot veilig`;
    progressPercent = (daysSinceSale / 30) * 100;
  } else if (monthsSinceSale < 6) {
    clawbackRisk = 'MEDIUM';
    riskPercentage = 75; // 75% clawback = 25% keep
    const remainingDays = Math.ceil((6 - monthsSinceSale) * 30);
    statusText = `${remainingDays} dagen tot volledig veilig`;
    progressPercent = (monthsSinceSale / 6) * 100;
  } else {
    clawbackRisk = 'SAFE';
    riskPercentage = 0;
    statusText = 'Volledig veilig';
    progressPercent = 100;
  }
  
  return { clawbackRisk, riskPercentage, statusText, progressPercent, daysSinceSale, monthsSinceSale };
}

function getFollowUpStatus(saleDate: string) {
  const sale = new Date(saleDate);
  const now = new Date();
  const daysSinceSale = Math.floor((now.getTime() - sale.getTime()) / (1000 * 60 * 60 * 24));
  const followUpDue = daysSinceSale >= 30;
  const daysUntilFollowUp = Math.max(0, 30 - daysSinceSale);
  
  return { followUpDue, daysUntilFollowUp, daysSinceSale };
}

// Mock sales data with clawback tracking
const SALES_DATA = [
  { 
    id: '1', 
    client: 'Bakkerij De Lekkernij', 
    amount: 186, 
    status: 'PAID', 
    saleDate: '2025-02-10', // Recent - high clawback risk
    activationDate: '2025-02-10',
    followUpDone: false,
    followUpQueued: false,
    products: ['Internet Zen', '2x Medium', 'TV+']
  },
  { 
    id: '2', 
    client: 'Tech Solutions BV', 
    amount: 520, 
    status: 'PAID', 
    saleDate: '2025-01-15', // 1 month+ ago - medium risk
    activationDate: '2025-01-15',
    followUpDone: true,
    followUpQueued: false,
    products: ['Internet Giga', 'Unlimited', 'TV Life']
  },
  { 
    id: '3', 
    client: 'NecmiCuts', 
    amount: 240, 
    status: 'PAID', 
    saleDate: '2024-08-20', // 6+ months - safe
    activationDate: '2024-08-20',
    followUpDone: true,
    followUpQueued: false,
    products: ['Internet Start', 'Small']
  },
  { 
    id: '4', 
    client: 'Constructie Groep', 
    amount: 450, 
    status: 'PAID', 
    saleDate: '2025-01-05', // ~1.5 months
    activationDate: '2025-01-05',
    followUpDone: false,
    followUpQueued: true,
    products: ['Internet Zen', '2x Large']
  },
  { 
    id: '5', 
    client: 'Fashion Store', 
    amount: 320, 
    status: 'PAID', 
    saleDate: '2025-02-01', // ~12 days - high risk
    activationDate: '2025-02-01',
    followUpDone: false,
    followUpQueued: false,
    products: ['Internet Start', 'Medium']
  },
  { 
    id: '6', 
    client: 'Dental Care Plus', 
    amount: 680, 
    status: 'PAID', 
    saleDate: '2024-09-10', // 5+ months - almost safe
    activationDate: '2024-09-10',
    followUpDone: true,
    followUpQueued: false,
    products: ['Internet Giga', '3x Unlimited', 'TV+']
  },
];

const COMMISSION_STATS = {
  month: 2396,
  year: 28450,
  potential: 6840,
  pending: 926,
  atRisk: 446, // Sum of high risk commissions
  trend: '+12%'
};

const PIPELINE = [
  { stage: 'Offerte Verstuurd', count: 8, value: 8540, probability: 30 },
  { stage: 'In Onderhandeling', count: 4, value: 4200, probability: 60 },
  { stage: 'Bijna Gesloten', count: 2, value: 2100, probability: 80 },
];

export default function CommissionPage() {
  const [timeFilter, setTimeFilter] = useState('MONTH');
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [sales, setSales] = useState(SALES_DATA);
  const [showQueueModal, setShowQueueModal] = useState<string | null>(null);

  // Calculate clawback stats
  const clawbackStats = {
    highRisk: sales.filter(s => getClawbackStatus(s.saleDate).clawbackRisk === 'HIGH').length,
    mediumRisk: sales.filter(s => getClawbackStatus(s.saleDate).clawbackRisk === 'MEDIUM').length,
    safe: sales.filter(s => getClawbackStatus(s.saleDate).clawbackRisk === 'SAFE').length,
    pendingFollowUp: sales.filter(s => !s.followUpDone && getFollowUpStatus(s.saleDate).followUpDue).length,
  };

  const totalAtRisk = sales
    .filter(s => getClawbackStatus(s.saleDate).clawbackRisk === 'HIGH')
    .reduce((sum, s) => sum + s.amount, 0);

  // Add to queue function
  const addToQueue = (saleId: string) => {
    setSales(prev => prev.map(s => 
      s.id === saleId ? { ...s, followUpQueued: true } : s
    ));
    setShowQueueModal(null);
  };

  return (
    <PremiumLayout user={{ name: 'Lenny De K.' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Commissie & Clawback</h1>
          <p className="text-gray-500 mt-1">Volg je verdiensten en contract veiligheid</p>
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

      {/* Clawback Warning Banner */}
      {clawbackStats.highRisk > 0 && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-amber-900">Clawback Risico</h3>
            <p className="text-sm text-amber-700">
              {clawbackStats.highRisk} contracten zijn nog niet 1 maand oud. 
              Bij annulering wordt je commissie teruggevorderd (€{totalAtRisk} at risk).
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-amber-900">{clawbackStats.highRisk}</p>
            <p className="text-xs text-amber-600">in risico zone</p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-orange-50 rounded-xl border border-orange-200 p-4">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mb-3">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <p className="text-sm text-orange-600">Deze Maand</p>
          <p className="text-2xl font-bold text-orange-900">€{COMMISSION_STATS.month.toLocaleString()}</p>
          <p className="text-xs text-green-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {COMMISSION_STATS.trend}
          </p>
        </div>

        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mb-3">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <p className="text-sm text-blue-600">Dit Jaar</p>
          <p className="text-2xl font-bold text-blue-900">€{COMMISSION_STATS.year.toLocaleString()}</p>
        </div>

        <div className="bg-purple-50 rounded-xl border border-purple-200 p-4">
          <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mb-3">
            <Target className="w-5 h-5 text-white" />
          </div>
          <p className="text-sm text-purple-600">Potentieel</p>
          <p className="text-2xl font-bold text-purple-900">€{COMMISSION_STATS.potential.toLocaleString()}</p>
        </div>

        <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
          <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center mb-3">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <p className="text-sm text-amber-600">At Risk</p>
          <p className="text-2xl font-bold text-amber-900">€{totalAtRisk}</p>
          <p className="text-xs text-amber-600">{clawbackStats.highRisk} contracten</p>
        </div>

        <div className="bg-green-50 rounded-xl border border-green-200 p-4">
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mb-3">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <p className="text-sm text-green-600">Veilig</p>
          <p className="text-2xl font-bold text-green-900">{clawbackStats.safe}</p>
          <p className="text-xs text-green-600">contracten</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 p-1 mb-6 inline-flex">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'OVERVIEW' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Overzicht
        </button>
        <button
          onClick={() => setActiveTab('SALES')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'SALES' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Mijn Sales
        </button>
        <button
          onClick={() => setActiveTab('CLAWBACK')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'CLAWBACK' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Clawback Status
          {clawbackStats.highRisk > 0 && (
            <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
              {clawbackStats.highRisk}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('FOLLOWUP')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'FOLLOWUP' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Opvolgcalls
          {clawbackStats.pendingFollowUp > 0 && (
            <span className="px-1.5 py-0.5 bg-orange-500 text-white text-xs rounded-full">
              {clawbackStats.pendingFollowUp}
            </span>
          )}
        </button>
      </div>

      {/* Queue Modal */}
      {showQueueModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Opvolgcall Inplannen?</h2>
            <p className="text-gray-500 text-center mb-6">
              Deze klant is 1 maand geleden aangesloten. Een opvolgcall wordt aanbevolen voor klanttevredenheid.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowQueueModal(null)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200"
              >
                Annuleren
              </button>
              <button
                onClick={() => addToQueue(showQueueModal)}
                className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Toevoegen aan Queue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {activeTab === 'OVERVIEW' && (
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

          {/* Clawback Legend */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              Clawback Uitleg
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="font-semibold text-red-900">Hoog Risico (&lt; 1 maand)</span>
                </div>
                <p className="text-sm text-red-700">
                  Bij annulering binnen 30 dagen: 100% clawback. Je moet de volledige commissie terugbetalen.
                </p>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <span className="font-semibold text-amber-900">Medium Risico (1-6 maanden)</span>
                </div>
                <p className="text-sm text-amber-700">
                  Bij annulering tussen 1-6 maanden: 75% clawback. Je houdt 25% van je commissie.
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="font-semibold text-green-900">Veilig (&gt; 6 maanden)</span>
                </div>
                <p className="text-sm text-green-700">
                  Na 6 maanden is de commissie volledig van jou. Geen clawback risico meer.
                </p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-5 h-5 text-blue-500" />
                <span className="font-semibold text-blue-900">Opvolgcall na 1 maand</span>
              </div>
              <p className="text-sm text-blue-700">
                Elke nieuwe klant krijgt automatisch een opvolgcall in de queue na 1 maand. 
                Dit verhoogt klanttevredenheid en vermindert annuleringen.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'SALES' && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Mijn Sales</h2>
            <p className="text-gray-500 text-sm mt-1">Alle verkochte contracten</p>
          </div>
          <div className="divide-y divide-gray-100">
            {sales.map((sale) => {
              const clawback = getClawbackStatus(sale.saleDate);
              return (
                <div key={sale.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        clawback.clawbackRisk === 'HIGH' ? 'bg-red-100 text-red-600' :
                        clawback.clawbackRisk === 'MEDIUM' ? 'bg-amber-100 text-amber-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {clawback.clawbackRisk === 'HIGH' ? <AlertCircle className="w-6 h-6" /> :
                         clawback.clawbackRisk === 'MEDIUM' ? <Clock className="w-6 h-6" /> :
                         <CheckCircle2 className="w-6 h-6" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{sale.client}</h3>
                        <p className="text-sm text-gray-500">{sale.products.join(' • ')}</p>
                        <p className="text-xs text-gray-400">Verkocht: {new Date(sale.saleDate).toLocaleDateString('nl-BE')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">€{sale.amount}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        clawback.clawbackRisk === 'HIGH' ? 'bg-red-100 text-red-700' :
                        clawback.clawbackRisk === 'MEDIUM' ? 'bg-amber-100 text-amber-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {clawback.statusText}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'CLAWBACK' && (
        <div className="space-y-4">
          {sales.map((sale) => {
            const clawback = getClawbackStatus(sale.saleDate);
            return (
              <div key={sale.id} className={`bg-white rounded-xl border-2 p-6 ${
                clawback.clawbackRisk === 'HIGH' ? 'border-red-200' :
                clawback.clawbackRisk === 'MEDIUM' ? 'border-amber-200' :
                'border-green-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                      clawback.clawbackRisk === 'HIGH' ? 'bg-red-100' :
                      clawback.clawbackRisk === 'MEDIUM' ? 'bg-amber-100' :
                      'bg-green-100'
                    }`}>
                      <Timer className={`w-7 h-7 ${
                        clawback.clawbackRisk === 'HIGH' ? 'text-red-600' :
                        clawback.clawbackRisk === 'MEDIUM' ? 'text-amber-600' :
                        'text-green-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{sale.client}</h3>
                      <p className="text-sm text-gray-500">
                        {clawback.daysSinceSale} dagen geleden • €{sale.amount} commissie
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${
                      clawback.clawbackRisk === 'HIGH' ? 'text-red-600' :
                      clawback.clawbackRisk === 'MEDIUM' ? 'text-amber-600' :
                      'text-green-600'
                    }`}>
                      {clawback.riskPercentage}% risico
                    </p>
                    <p className="text-sm text-gray-500">{clawback.statusText}</p>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-500">Veiligheidsvoortgang</span>
                    <span className="font-medium text-gray-700">{Math.round(clawback.progressPercent)}%</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        clawback.clawbackRisk === 'HIGH' ? 'bg-red-500' :
                        clawback.clawbackRisk === 'MEDIUM' ? 'bg-amber-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${clawback.progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Verkoop</span>
                    <span>1 maand (25% veilig)</span>
                    <span>6 maanden (100% veilig)</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'FOLLOWUP' && (
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 mb-6">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-blue-700">
                <strong>Opvolgcalls:</strong> Elke klant krijgt automatisch een opvolgcall na 1 maand. 
                Dit helpt om klanttevredenheid te meten en churn te verminderen.
              </p>
            </div>
          </div>
          
          {sales.map((sale) => {
            const followUp = getFollowUpStatus(sale.saleDate);
            if (!followUp.followUpDue && !sale.followUpDone) {
              return (
                <div key={sale.id} className="bg-gray-50 rounded-xl border border-gray-200 p-6 opacity-75">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-700">{sale.client}</h3>
                        <p className="text-sm text-gray-500">
                          Opvolgcall over {followUp.daysUntilFollowUp} dagen
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-gray-200 text-gray-600 text-sm rounded-full">
                      Wachten
                    </span>
                  </div>
                </div>
              );
            }
            
            return (
              <div key={sale.id} className={`rounded-xl border-2 p-6 ${
                sale.followUpDone ? 'bg-green-50 border-green-200' : 
                sale.followUpQueued ? 'bg-blue-50 border-blue-200' :
                'bg-white border-orange-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      sale.followUpDone ? 'bg-green-100 text-green-600' :
                      sale.followUpQueued ? 'bg-blue-100 text-blue-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {sale.followUpDone ? <CheckCircle2 className="w-6 h-6" /> :
                       sale.followUpQueued ? <Calendar className="w-6 h-6" /> :
                       <Phone className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{sale.client}</h3>
                      <p className="text-sm text-gray-500">
                        {sale.followUpDone ? 'Opvolgcall voltooid' :
                         sale.followUpQueued ? 'In queue geplaatst' :
                         `Aangesloten: ${followUp.daysSinceSale} dagen geleden`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {!sale.followUpDone && !sale.followUpQueued && (
                      <button
                        onClick={() => setShowQueueModal(sale.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                      >
                        <Phone className="w-4 h-4" />
                        Plan Call
                      </button>
                    )}
                    {sale.followUpQueued && (
                      <span className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg">
                        <Calendar className="w-4 h-4" />
                        In Queue
                      </span>
                    )}
                    {sale.followUpDone && (
                      <span className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
                        <CheckCircle2 className="w-4 h-4" />
                        Voltooid
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PremiumLayout>
  );
}
