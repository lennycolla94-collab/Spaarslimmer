'use client';

import { useEffect, useState } from 'react';
import { PremiumLayout } from '@/components/design-system/premium-layout';
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  Phone, 
  FileText, 
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Target,
  MoreHorizontal,
  Filter,
  Download,
  Wifi,
  Smartphone,
  Tv,
  Plus,
  Minus,
  ChevronDown,
  Calculator,
  Zap,
  Euro,
  Search,
  Building2,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

// Orange Prices
const ORANGE_INTERNET = [
  { id: 'START', name: 'Internet Start', packPrice: 49, standalonePrice: 53, speed: '100 Mbps' },
  { id: 'ZEN', name: 'Internet Zen', packPrice: 58, standalonePrice: 62, speed: '300 Mbps' },
  { id: 'GIGA', name: 'Internet Giga', packPrice: 68, standalonePrice: 72, speed: '1 Gbps' },
];

const ORANGE_MOBILE = [
  { id: 'CHILD', name: 'Child', packPrice: 0, standalonePrice: 0, data: '1 GB' },
  { id: 'SMALL', name: 'Small', packPrice: 11.50, standalonePrice: 16, data: '5 GB' },
  { id: 'MEDIUM', name: 'Medium', packPrice: 16.50, standalonePrice: 26, data: '20 GB' },
  { id: 'LARGE', name: 'Large', packPrice: 21.50, standalonePrice: 32, data: '40 GB' },
  { id: 'UNLIMITED', name: 'Unlimited', packPrice: 32, standalonePrice: 42, data: 'Unlimited' },
];

// Mock data for demonstration
const stats = {
  leads: { total: 156, new: 12, trend: '+8%' },
  calls: { total: 48, today: 15, trend: '+24%' },
  offers: { total: 23, pending: 8, trend: '+15%' },
  commission: { month: 18650, year: 89450, trend: '+12%' }
};

const recentActivity = [
  { type: 'offer', title: 'New offer sent', desc: 'Bakkerij De Lekkernij - €186 commissie', time: '5 min ago', icon: FileText, color: 'blue' },
  { type: 'call', title: 'Call completed', desc: 'Tech Solutions BV - Follow up scheduled', time: '12 min ago', icon: Phone, color: 'green' },
  { type: 'lead', title: 'Lead imported', desc: '15 new leads from CSV', time: '1 hour ago', icon: Users, color: 'purple' },
  { type: 'commission', title: 'Commission earned', desc: 'NecmiCuts - €520', time: '2 hours ago', icon: Wallet, color: 'orange' },
];

const pipeline = [
  { stage: 'Leads', count: 156, value: 0, color: 'gray' },
  { stage: 'Contacted', count: 89, value: 0, color: 'blue' },
  { stage: 'Offers Sent', count: 23, value: 8540, color: 'purple' },
  { stage: 'Negotiation', count: 8, value: 4200, color: 'pink' },
  { stage: 'Closing', count: 4, value: 2100, color: 'green' },
];

export default function PremiumDashboard() {
  const [mounted, setMounted] = useState(false);
  
  // Calculator state
  const [showCalculator, setShowCalculator] = useState(false);
  const [internetPlan, setInternetPlan] = useState<string | null>(null);
  const [mobileLines, setMobileLines] = useState<Array<{ plan: string; portability: boolean }>>([]);
  const [tvPlan, setTvPlan] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [commission, setCommission] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate prices
  useEffect(() => {
    const hasConvergence = internetPlan && mobileLines.length > 0;
    let price = 0;
    
    if (internetPlan) {
      const internet = ORANGE_INTERNET.find(i => i.id === internetPlan);
      if (internet) price += hasConvergence ? internet.packPrice : internet.standalonePrice;
    }
    
    mobileLines.forEach(line => {
      if (line.plan) {
        const mobile = ORANGE_MOBILE.find(m => m.id === line.plan);
        if (mobile) price += hasConvergence ? mobile.packPrice : mobile.standalonePrice;
      }
    });
    
    setTotalPrice(price);
    // Simple commission calc
    let comm = 0;
    if (internetPlan) comm += 15;
    mobileLines.forEach(line => {
      if (line.plan === 'MEDIUM') comm += 35;
      if (line.plan === 'LARGE') comm += 50;
      if (line.plan === 'UNLIMITED') comm += 60;
    });
    setCommission(comm);
  }, [internetPlan, mobileLines]);

  const addMobileLine = () => setMobileLines([...mobileLines, { plan: '', portability: false }]);
  const removeMobileLine = (idx: number) => setMobileLines(mobileLines.filter((_, i) => i !== idx));
  const updateMobileLine = (idx: number, field: 'plan' | 'portability', value: any) => {
    const updated = [...mobileLines];
    updated[idx] = { ...updated[idx], [field]: value };
    setMobileLines(updated);
  };

  if (!mounted) return null;

  return (
    <PremiumLayout user={{ name: 'Lenny De K.', email: 'lenny@spaarslimmer.be' }}>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <Calendar className="w-4 h-4" />
            Last 30 days
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Leads Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3" />
              {stats.leads.trend}
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.leads.total}</p>
          <p className="text-gray-500 text-sm mt-1">Total Leads</p>
          <div className="mt-3 text-sm text-gray-600">
            <span className="font-semibold text-gray-900">+{stats.leads.new}</span> new this week
          </div>
        </div>

        {/* Calls Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <Phone className="w-6 h-6 text-green-600" />
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3" />
              {stats.calls.trend}
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.calls.total}</p>
          <p className="text-gray-500 text-sm mt-1">Calls Made</p>
          <div className="mt-3 text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{stats.calls.today}</span> calls today
          </div>
        </div>

        {/* Offers Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3" />
              {stats.offers.trend}
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.offers.total}</p>
          <p className="text-gray-500 text-sm mt-1">Offers Sent</p>
          <div className="mt-3 text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{stats.offers.pending}</span> pending review
          </div>
        </div>

        {/* Commission Card - Highlighted */}
        <div className="bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl p-6 text-white hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-white/90 bg-white/20 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3" />
              {stats.commission.trend}
            </span>
          </div>
          <p className="text-3xl font-bold">€{stats.commission.month.toLocaleString()}</p>
          <p className="text-white/80 text-sm mt-1">Commission This Month</p>
          <div className="mt-3 text-sm text-white/80">
            <span className="font-semibold text-white">€{stats.commission.year.toLocaleString()}</span> this year
          </div>
        </div>
      </div>

      {/* Quick Calculator Widget */}
      <div className="bg-white rounded-xl border border-gray-200 mb-8 overflow-hidden">
        <div 
          className="p-4 border-b border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50"
          onClick={() => setShowCalculator(!showCalculator)}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Quick Calculator</h2>
              <p className="text-sm text-gray-500">Bereken prijzen en commissie direct</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {totalPrice > 0 && (
              <div className="text-right mr-4">
                <p className="text-sm text-gray-500">Klant prijs</p>
                <p className="text-xl font-bold text-gray-900">€{totalPrice}/mnd</p>
              </div>
            )}
            {commission > 0 && (
              <div className="text-right mr-4">
                <p className="text-sm text-green-600">Jouw commissie</p>
                <p className="text-xl font-bold text-green-600">€{commission}</p>
              </div>
            )}
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showCalculator ? 'rotate-180' : ''}`} />
          </div>
        </div>
        
        {showCalculator && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Internet */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-blue-500" />
                  Internet
                </h3>
                <div className="space-y-2">
                  {ORANGE_INTERNET.map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => setInternetPlan(internetPlan === plan.id ? null : plan.id)}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        internetPlan === plan.id 
                          ? 'border-orange-500 bg-orange-50' 
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{plan.name}</span>
                        <span className="text-sm font-bold">€{plan.packPrice}</span>
                      </div>
                      <p className="text-xs text-gray-500">{plan.speed}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-purple-500" />
                  Mobile
                  <button 
                    onClick={addMobileLine}
                    className="ml-auto p-1 bg-orange-100 text-orange-600 rounded hover:bg-orange-200"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </h3>
                <div className="space-y-2">
                  {mobileLines.map((line, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <select
                        value={line.plan}
                        onChange={(e) => updateMobileLine(idx, 'plan', e.target.value)}
                        className="flex-1 p-2 border border-gray-200 rounded-lg text-sm"
                      >
                        <option value="">Kies abonnement</option>
                        {ORANGE_MOBILE.map((m) => (
                          <option key={m.id} value={m.id}>{m.name} - {m.data} (€{m.packPrice})</option>
                        ))}
                      </select>
                      <button 
                        onClick={() => removeMobileLine(idx)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {mobileLines.length === 0 && (
                    <p className="text-sm text-gray-400 italic">Geen mobiele lijnen</p>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  Samenvatting
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Maandbedrag</span>
                    <span className="text-xl font-bold text-gray-900">€{totalPrice}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-600">Jouw commissie</span>
                    <span className="text-xl font-bold text-green-600">€{commission}</span>
                  </div>
                  {internetPlan && mobileLines.length > 0 && (
                    <div className="p-2 bg-green-100 rounded-lg text-center">
                      <span className="text-sm text-green-700">✓ Pakketkorting toegepast</span>
                    </div>
                  )}
                  <Link
                    href="/calculator"
                    className="w-full block text-center py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Ga naar volledige calculator →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Pipeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pipeline Section */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Sales Pipeline</h2>
                <p className="text-gray-500 text-sm mt-1">Track your deals through the sales process</p>
              </div>
              <Link 
                href="/commission"
                className="text-sm font-medium text-orange-600 hover:text-orange-700"
              >
                View Commission →
              </Link>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {pipeline.map((stage, idx) => (
                  <div key={stage.stage} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{stage.stage}</span>
                        <span className="text-sm text-gray-500">{stage.count} deals</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            stage.color === 'gray' ? 'bg-gray-400' :
                            stage.color === 'blue' ? 'bg-blue-500' :
                            stage.color === 'purple' ? 'bg-purple-500' :
                            stage.color === 'pink' ? 'bg-pink-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${(stage.count / pipeline[0].count) * 100}%` }}
                        />
                      </div>
                    </div>
                    {stage.value > 0 && (
                      <span className="text-sm font-medium text-gray-900">
                        €{stage.value.toLocaleString()}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/leads" className="bg-white rounded-xl border border-gray-200 p-4 hover:border-orange-300 hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <p className="font-medium text-gray-900">New Lead</p>
              <p className="text-sm text-gray-500">Add manually</p>
            </Link>
            <Link href="/leads/import" className="bg-white rounded-xl border border-gray-200 p-4 hover:border-orange-300 hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mb-3">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <p className="font-medium text-gray-900">Import</p>
              <p className="text-sm text-gray-500">Bulk upload</p>
            </Link>
            <button 
              onClick={() => setShowCalculator(true)}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:border-orange-300 hover:shadow-md transition-all text-left"
            >
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-3">
                <Calculator className="w-5 h-5 text-green-600" />
              </div>
              <p className="font-medium text-gray-900">Calculator</p>
              <p className="text-sm text-gray-500">Price & savings</p>
            </button>
            <Link href="/call-center" className="bg-white rounded-xl border border-gray-200 p-4 hover:border-orange-300 hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center mb-3">
                <Phone className="w-5 h-5 text-orange-600" />
              </div>
              <p className="font-medium text-gray-900">Call Center</p>
              <p className="text-sm text-gray-500">Start calling</p>
            </Link>
          </div>
        </div>

        {/* Right Column - Activity */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      activity.color === 'blue' ? 'bg-blue-50' :
                      activity.color === 'green' ? 'bg-green-50' :
                      activity.color === 'purple' ? 'bg-purple-50' :
                      'bg-orange-50'
                    }`}>
                      <activity.icon className={`w-5 h-5 ${
                        activity.color === 'blue' ? 'text-blue-600' :
                        activity.color === 'green' ? 'text-green-600' :
                        activity.color === 'purple' ? 'text-purple-600' :
                        'text-orange-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">{activity.title}</p>
                      <p className="text-gray-500 text-sm truncate">{activity.desc}</p>
                      <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Commission Preview */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white">
            <h3 className="font-semibold text-lg mb-2">Commission Potential</h3>
            <p className="text-gray-400 text-sm mb-4">Based on current pipeline</p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Pending Offers</span>
                <span className="font-semibold">€8,540</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">In Negotiation</span>
                <span className="font-semibold">€4,200</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Ready to Close</span>
                <span className="font-semibold">€2,100</span>
              </div>
              <div className="pt-3 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-gray-200 font-medium">Total Potential</span>
                  <span className="text-2xl font-bold text-orange-400">€14,840</span>
                </div>
              </div>
            </div>
            
            <Link 
              href="/commission"
              className="mt-4 w-full block text-center py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
            >
              View Commission Details
            </Link>
          </div>
        </div>
      </div>
    </PremiumLayout>
  );
}
