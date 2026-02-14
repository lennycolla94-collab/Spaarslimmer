'use client';

import { useEffect, useState } from 'react';
import { PremiumLayout } from '@/components/design-system/premium-layout';
import { 
  TrendingUp, 
  Users, 
  Phone, 
  FileText, 
  Wallet,
  ArrowUpRight,
  Calendar,
  Target,
  MoreHorizontal,
  Filter,
  Download,
  Calculator,
  Zap,
  CheckCircle2,
  ChevronDown,
  X
} from 'lucide-react';
import Link from 'next/link';

// Generate dates for filter
const getLast30Days = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);
  return { start, end };
};

const getLast7Days = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 7);
  return { start, end };
};

const getLast90Days = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 90);
  return { start, end };
};

// Mock data for demonstration
const allStats = {
  '7d': {
    leads: { total: 45, new: 5, trend: '+12%' },
    calls: { total: 18, today: 8, trend: '+8%' },
    offers: { total: 8, pending: 3, trend: '+20%' },
    commission: { month: 4250, year: 89450, trend: '+15%' }
  },
  '30d': {
    leads: { total: 156, new: 12, trend: '+8%' },
    calls: { total: 48, today: 15, trend: '+24%' },
    offers: { total: 23, pending: 8, trend: '+15%' },
    commission: { month: 18650, year: 89450, trend: '+12%' }
  },
  '90d': {
    leads: { total: 420, new: 35, trend: '+18%' },
    calls: { total: 145, today: 15, trend: '+32%' },
    offers: { total: 67, pending: 12, trend: '+28%' },
    commission: { month: 52400, year: 89450, trend: '+22%' }
  }
};

const allActivity = {
  '7d': [
    { type: 'offer', title: 'New offer sent', desc: 'Bakkerij De Lekkernij - €186 commissie', time: '5 min ago', icon: FileText, color: 'blue' },
    { type: 'call', title: 'Call completed', desc: 'Tech Solutions BV - Follow up scheduled', time: '12 min ago', icon: Phone, color: 'green' },
    { type: 'lead', title: 'Lead imported', desc: '8 new leads from CSV', time: '2 hours ago', icon: Users, color: 'purple' },
  ],
  '30d': [
    { type: 'offer', title: 'New offer sent', desc: 'Bakkerij De Lekkernij - €186 commissie', time: '5 min ago', icon: FileText, color: 'blue' },
    { type: 'call', title: 'Call completed', desc: 'Tech Solutions BV - Follow up scheduled', time: '12 min ago', icon: Phone, color: 'green' },
    { type: 'lead', title: 'Lead imported', desc: '15 new leads from CSV', time: '1 hour ago', icon: Users, color: 'purple' },
    { type: 'commission', title: 'Commission earned', desc: 'NecmiCuts - €520', time: '2 hours ago', icon: Wallet, color: 'orange' },
  ],
  '90d': [
    { type: 'offer', title: 'New offer sent', desc: 'Bakkerij De Lekkernij - €186 commissie', time: '5 min ago', icon: FileText, color: 'blue' },
    { type: 'call', title: 'Call completed', desc: 'Tech Solutions BV - Follow up scheduled', time: '12 min ago', icon: Phone, color: 'green' },
    { type: 'lead', title: 'Lead imported', desc: '42 new leads from CSV', time: '3 days ago', icon: Users, color: 'purple' },
    { type: 'commission', title: 'Commission earned', desc: 'NecmiCuts - €520', time: '1 week ago', icon: Wallet, color: 'orange' },
    { type: 'offer', title: 'Offer accepted', desc: 'Tech Solutions BV - €1,240 commissie', time: '2 weeks ago', icon: FileText, color: 'green' },
  ]
};

const allPipeline = {
  '7d': [
    { stage: 'Leads', count: 45, value: 0, color: 'gray' },
    { stage: 'Contacted', count: 28, value: 0, color: 'blue' },
    { stage: 'Offers Sent', count: 8, value: 2540, color: 'purple' },
    { stage: 'Negotiation', count: 3, value: 1200, color: 'pink' },
    { stage: 'Closing', count: 1, value: 520, color: 'green' },
  ],
  '30d': [
    { stage: 'Leads', count: 156, value: 0, color: 'gray' },
    { stage: 'Contacted', count: 89, value: 0, color: 'blue' },
    { stage: 'Offers Sent', count: 23, value: 8540, color: 'purple' },
    { stage: 'Negotiation', count: 8, value: 4200, color: 'pink' },
    { stage: 'Closing', count: 4, value: 2100, color: 'green' },
  ],
  '90d': [
    { stage: 'Leads', count: 420, value: 0, color: 'gray' },
    { stage: 'Contacted', count: 245, value: 0, color: 'blue' },
    { stage: 'Offers Sent', count: 67, value: 24500, color: 'purple' },
    { stage: 'Negotiation', count: 28, value: 12400, color: 'pink' },
    { stage: 'Closing', count: 15, value: 8900, color: 'green' },
  ]
};

const FILTER_OPTIONS = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
];

export default function PremiumDashboard() {
  const [mounted, setMounted] = useState(false);
  const [dateRange, setDateRange] = useState('30d');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const stats = allStats[dateRange as keyof typeof allStats];
  const recentActivity = allActivity[dateRange as keyof typeof allActivity];
  const pipeline = allPipeline[dateRange as keyof typeof allPipeline];

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const clearFilters = () => setActiveFilters([]);

  return (
    <PremiumLayout user={{ name: 'Lenny De K.', email: 'lenny@spaarslimmer.be' }}>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Date Range Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowDateDropdown(!showDateDropdown)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700"
            >
              <Calendar className="w-4 h-4" />
              {FILTER_OPTIONS.find(o => o.value === dateRange)?.label}
              <ChevronDown className="w-3 h-3" />
            </button>
            {showDateDropdown && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 z-10">
                {FILTER_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setDateRange(option.value);
                      setShowDateDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-slate-700 first:rounded-t-xl last:rounded-b-xl ${
                      dateRange === option.value ? 'text-orange-600 font-medium' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg transition-colors ${
                activeFilters.length > 0 
                  ? 'text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-500/20 dark:border-orange-500/30' 
                  : 'text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filter
              {activeFilters.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-orange-500 text-white text-xs rounded-full">
                  {activeFilters.length}
                </span>
              )}
            </button>
            {showFilterDropdown && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 z-10 p-2">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 py-2">
                  Filter by Type
                </div>
                {['Leads', 'Calls', 'Offers', 'Commission'].map((filter) => (
                  <label
                    key={filter}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={activeFilters.includes(filter)}
                      onChange={() => toggleFilter(filter)}
                      className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{filter}</span>
                  </label>
                ))}
                {activeFilters.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="w-full mt-2 pt-2 border-t border-gray-200 dark:border-slate-700 text-sm text-red-600 hover:text-red-700 py-2"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Active Filter Tags */}
          {activeFilters.length > 0 && (
            <div className="flex items-center gap-2">
              {activeFilters.map((filter) => (
                <span
                  key={filter}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 text-xs rounded-full"
                >
                  {filter}
                  <button onClick={() => toggleFilter(filter)} className="hover:text-orange-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Leads Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-green-600 bg-green-100 dark:bg-green-500/20 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3" />
              {stats.leads.trend}
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.leads.total}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Total Leads</p>
          <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white">+{stats.leads.new}</span> new this week
          </div>
        </div>

        {/* Calls Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
              <Phone className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-green-600 bg-green-100 dark:bg-green-500/20 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3" />
              {stats.calls.trend}
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.calls.total}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Calls Made</p>
          <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white">{stats.calls.today}</span> calls today
          </div>
        </div>

        {/* Offers Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-green-600 bg-green-100 dark:bg-green-500/20 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3" />
              {stats.offers.trend}
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.offers.total}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Offers Sent</p>
          <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white">{stats.offers.pending}</span> pending review
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

      {/* Calculator Card */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <Calculator className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Prijs Calculator</h2>
              <p className="text-orange-100">Bereken offertes en commissies</p>
            </div>
          </div>
          <Link
            href="/calculator"
            className="px-6 py-3 bg-white text-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition-colors"
          >
            Open Calculator
          </Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Pipeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pipeline Section */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Sales Pipeline</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Track your deals through the sales process</p>
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
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-sm font-semibold text-gray-600 dark:text-gray-400">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900 dark:text-white">{stage.stage}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{stage.count} deals</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
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
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
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
            <Link href="/leads" className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4 hover:border-orange-300 dark:hover:border-orange-500/50 hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center mb-3">
                <Target className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <p className="font-medium text-gray-900 dark:text-white">New Lead</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Add manually</p>
            </Link>
            <Link href="/leads/import" className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4 hover:border-orange-300 dark:hover:border-orange-500/50 hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center mb-3">
                <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <p className="font-medium text-gray-900 dark:text-white">Import</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Bulk upload</p>
            </Link>
            <Link 
              href="/calculator"
              className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4 hover:border-orange-300 dark:hover:border-orange-500/50 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center mb-3">
                <Calculator className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <p className="font-medium text-gray-900 dark:text-white">Calculator</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Price & savings</p>
            </Link>
            <Link href="/call-center" className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4 hover:border-orange-300 dark:hover:border-orange-500/50 hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center mb-3">
                <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <p className="font-medium text-gray-900 dark:text-white">Call Center</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Start calling</p>
            </Link>
          </div>
        </div>

        {/* Right Column - Activity */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-gray-100 dark:bg-slate-700">
                      <activity.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{activity.title}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm truncate">{activity.desc}</p>
                      <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">{activity.time}</p>
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
                <span className="font-semibold">€{pipeline[2].value.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">In Negotiation</span>
                <span className="font-semibold">€{pipeline[3].value.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Ready to Close</span>
                <span className="font-semibold">€{pipeline[4].value.toLocaleString()}</span>
              </div>
              <div className="pt-3 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-gray-200 font-medium">Total Potential</span>
                  <span className="text-2xl font-bold text-orange-400">
                    €{(pipeline[2].value + pipeline[3].value + pipeline[4].value).toLocaleString()}
                  </span>
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
