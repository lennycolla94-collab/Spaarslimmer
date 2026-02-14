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
  Filter,
  Download,
  Calculator,
  ChevronDown,
  X,
  ChevronRight,
  Clock,
  Plus
} from 'lucide-react';
import Link from 'next/link';

// Generate dates for filter
const FILTER_OPTIONS = [
  { value: '7d', label: 'Laatste 7 dagen' },
  { value: '30d', label: 'Laatste 30 dagen' },
  { value: '90d', label: 'Laatste 90 dagen' },
];

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
    { type: 'offer', title: 'Nieuwe offerte verstuurd', desc: 'Bakkerij De Lekkernij - €186 commissie', time: '5 min geleden', icon: FileText, color: 'blue' },
    { type: 'call', title: 'Gesprek afgerond', desc: 'Tech Solutions BV - Follow-up gepland', time: '12 min geleden', icon: Phone, color: 'green' },
    { type: 'lead', title: 'Leads geïmporteerd', desc: '8 nieuwe leads van CSV', time: '2 uur geleden', icon: Users, color: 'purple' },
  ],
  '30d': [
    { type: 'offer', title: 'Nieuwe offerte verstuurd', desc: 'Bakkerij De Lekkernij - €186 commissie', time: '5 min geleden', icon: FileText, color: 'blue' },
    { type: 'call', title: 'Gesprek afgerond', desc: 'Tech Solutions BV - Follow-up gepland', time: '12 min geleden', icon: Phone, color: 'green' },
    { type: 'lead', title: 'Leads geïmporteerd', desc: '15 nieuwe leads van CSV', time: '1 uur geleden', icon: Users, color: 'purple' },
    { type: 'commission', title: 'Commissie verdiend', desc: 'NecmiCuts - €520', time: '2 uur geleden', icon: Wallet, color: 'orange' },
  ],
  '90d': [
    { type: 'offer', title: 'Nieuwe offerte verstuurd', desc: 'Bakkerij De Lekkernij - €186 commissie', time: '5 min geleden', icon: FileText, color: 'blue' },
    { type: 'call', title: 'Gesprek afgerond', desc: 'Tech Solutions BV - Follow-up gepland', time: '12 min geleden', icon: Phone, color: 'green' },
    { type: 'lead', title: 'Leads geïmporteerd', desc: '42 nieuwe leads van CSV', time: '3 dagen geleden', icon: Users, color: 'purple' },
    { type: 'commission', title: 'Commissie verdiend', desc: 'NecmiCuts - €520', time: '1 week geleden', icon: Wallet, color: 'orange' },
    { type: 'offer', title: 'Offerte geaccepteerd', desc: 'Tech Solutions BV - €1,240 commissie', time: '2 weken geleden', icon: FileText, color: 'green' },
  ]
};

const allPipeline = {
  '7d': [
    { stage: 'Leads', count: 45, value: 0, color: 'gray' },
    { stage: 'Gecontacteerd', count: 28, value: 0, color: 'blue' },
    { stage: 'Offertes Verstuurd', count: 8, value: 2540, color: 'purple' },
    { stage: 'Onderhandeling', count: 3, value: 1200, color: 'pink' },
    { stage: 'Afronding', count: 1, value: 520, color: 'green' },
  ],
  '30d': [
    { stage: 'Leads', count: 156, value: 0, color: 'gray' },
    { stage: 'Gecontacteerd', count: 89, value: 0, color: 'blue' },
    { stage: 'Offertes Verstuurd', count: 23, value: 8540, color: 'purple' },
    { stage: 'Onderhandeling', count: 8, value: 4200, color: 'pink' },
    { stage: 'Afronding', count: 4, value: 2100, color: 'green' },
  ],
  '90d': [
    { stage: 'Leads', count: 420, value: 0, color: 'gray' },
    { stage: 'Gecontacteerd', count: 245, value: 0, color: 'blue' },
    { stage: 'Offertes Verstuurd', count: 67, value: 24500, color: 'purple' },
    { stage: 'Onderhandeling', count: 28, value: 12400, color: 'pink' },
    { stage: 'Afronding', count: 15, value: 8900, color: 'green' },
  ]
};

// Color mapping for pipeline
const PIPELINE_COLORS: Record<string, string> = {
  gray: 'bg-gray-500',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  pink: 'bg-pink-500',
  green: 'bg-green-500',
};

export default function PremiumDashboard() {
  const [mounted, setMounted] = useState(false);
  const [dateRange, setDateRange] = useState('30d');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

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
      {/* Dashboard Container */}
      <div className="dashboard">
        {/* Header Section */}
        <header className="dashboard-header">
          <div>
            <h1 className="heading-2">Dashboard</h1>
            <p className="body-small">Welkom terug! Hier is wat er vandaag gebeurt.</p>
          </div>
          <div className="dashboard-header-actions">
            {/* Date Range Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowDateDropdown(!showDateDropdown)}
                className="btn btn--secondary"
              >
                <Calendar className="w-4 h-4" />
                {FILTER_OPTIONS.find(o => o.value === dateRange)?.label}
                <ChevronDown className="w-3 h-3" />
              </button>
              {showDateDropdown && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--bg-card)] rounded-lg shadow-xl border border-white/5 z-50 py-1">
                  {FILTER_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setDateRange(option.value);
                        setShowDateDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-[var(--bg-hover)] transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        dateRange === option.value ? 'text-[var(--primary-orange)] font-medium' : 'text-[var(--text-secondary)]'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filter Button */}
            <button 
              onClick={() => toggleFilter('test')}
              className={`btn ${activeFilters.length > 0 ? 'btn--primary' : 'btn--secondary'}`}
            >
              <Filter className="w-4 h-4" />
              Filter
              {activeFilters.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-white/20 text-white text-xs rounded-full">
                  {activeFilters.length}
                </span>
              )}
            </button>

            <button className="btn btn--primary">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="stats-grid">
          {/* Leads Card */}
          <div className="stat-card">
            <div className="stat-card-icon">
              <Users className="w-6 h-6" />
            </div>
            <div className="stat-card-content">
              <span className="stat-card-label">Total Leads</span>
              <span className="stat-card-value">{stats.leads.total}</span>
              <span className="stat-card-change stat-card-change--positive">
                <ArrowUpRight className="w-3 h-3" /> {stats.leads.trend} deze week
              </span>
            </div>
          </div>

          {/* Calls Card */}
          <div className="stat-card">
            <div className="stat-card-icon">
              <Phone className="w-6 h-6" />
            </div>
            <div className="stat-card-content">
              <span className="stat-card-label">Gesprekken</span>
              <span className="stat-card-value">{stats.calls.total}</span>
              <span className="stat-card-change stat-card-change--positive">
                <ArrowUpRight className="w-3 h-3" /> {stats.calls.trend} deze week
              </span>
            </div>
          </div>

          {/* Offers Card */}
          <div className="stat-card">
            <div className="stat-card-icon">
              <FileText className="w-6 h-6" />
            </div>
            <div className="stat-card-content">
              <span className="stat-card-label">Offertes</span>
              <span className="stat-card-value">{stats.offers.total}</span>
              <span className="stat-card-change stat-card-change--positive">
                <ArrowUpRight className="w-3 h-3" /> {stats.offers.trend} deze week
              </span>
            </div>
          </div>

          {/* Commission Card - Highlighted */}
          <div className="stat-card stat-card--highlight">
            <div className="stat-card-icon stat-card-icon--white">
              <Wallet className="w-6 h-6" />
            </div>
            <div className="stat-card-content">
              <span className="stat-card-label stat-card-label--white">Commissie Deze Maand</span>
              <span className="stat-card-value stat-card-value--white">€{stats.commission.month.toLocaleString()}</span>
              <span className="stat-card-change stat-card-change--white">
                <ArrowUpRight className="w-3 h-3" /> {stats.commission.trend} deze maand
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="dashboard-content">
          {/* Left Column (2/3 width) */}
          <div className="dashboard-main">
            {/* Sales Pipeline */}
            <section className="dashboard-section">
              <div className="section-header">
                <h2 className="heading-4">Sales Pipeline</h2>
                <Link href="/commission" className="link-with-icon">
                  Bekijk details <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="pipeline-chart">
                {pipeline.map((stage, idx) => (
                  <div key={stage.stage} className="pipeline-item">
                    <div className="pipeline-number">{idx + 1}</div>
                    <div className="pipeline-bar-container">
                      <div className="pipeline-header">
                        <span className="pipeline-stage">{stage.stage}</span>
                        <span className="pipeline-count">{stage.count} deals</span>
                      </div>
                      <div className="pipeline-progress-bg">
                        <div 
                          className={`pipeline-progress-fill ${PIPELINE_COLORS[stage.color]}`}
                          style={{ width: `${(stage.count / pipeline[0].count) * 100}%` }}
                        />
                      </div>
                    </div>
                    {stage.value > 0 && (
                      <span className="pipeline-value">
                        €{stage.value.toLocaleString()}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Quick Actions Grid */}
            <section className="dashboard-section">
              <div className="section-header">
                <h2 className="heading-4">Snelle Acties</h2>
              </div>
              <div className="quick-actions-grid">
                <Link href="/leads/new" className="quick-action-card">
                  <div className="quick-action-icon">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div className="quick-action-content">
                    <p className="quick-action-title">Nieuwe Lead</p>
                    <p className="quick-action-desc">Handmatig toevoegen</p>
                  </div>
                </Link>
                <Link href="/leads/import" className="quick-action-card">
                  <div className="quick-action-icon">
                    <Download className="w-5 h-5" />
                  </div>
                  <div className="quick-action-content">
                    <p className="quick-action-title">Importeren</p>
                    <p className="quick-action-desc">CSV upload</p>
                  </div>
                </Link>
                <Link href="/calculator" className="quick-action-card">
                  <div className="quick-action-icon">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div className="quick-action-content">
                    <p className="quick-action-title">Calculator</p>
                    <p className="quick-action-desc">Prijs & commissie</p>
                  </div>
                </Link>
                <Link href="/call-center" className="quick-action-card">
                  <div className="quick-action-icon">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="quick-action-content">
                    <p className="quick-action-title">Call Center</p>
                    <p className="quick-action-desc">Start bellen</p>
                  </div>
                </Link>
              </div>
            </section>
          </div>

          {/* Right Column (1/3 width) */}
          <aside className="dashboard-sidebar">
            {/* Commission Potential */}
            <section className="dashboard-section dashboard-section--highlight">
              <h3 className="heading-4">Commissie Potentieel</h3>
              <div className="commission-value">
                €{(pipeline[2].value + pipeline[3].value + pipeline[4].value).toLocaleString()}
              </div>
              <p className="commission-subtitle">Gebaseerd op huidige pipeline</p>
              
              <div className="commission-breakdown">
                <div className="commission-breakdown-item">
                  <span>Openstaande offertes</span>
                  <span>€{pipeline[2].value.toLocaleString()}</span>
                </div>
                <div className="commission-breakdown-item">
                  <span>In onderhandeling</span>
                  <span>€{pipeline[3].value.toLocaleString()}</span>
                </div>
                <div className="commission-breakdown-item">
                  <span>Klaar voor afronding</span>
                  <span>€{pipeline[4].value.toLocaleString()}</span>
                </div>
              </div>
              
              <Link href="/commission" className="btn btn--secondary btn--block mt-4">
                Bekijk details
              </Link>
            </section>

            {/* Recent Activity */}
            <section className="dashboard-section">
              <div className="section-header">
                <h2 className="heading-4">Recente Activiteit</h2>
              </div>
              <div className="activity-list">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="activity-item">
                    <div className={`activity-icon activity-icon--${activity.color}`}>
                      <activity.icon className="w-4 h-4" />
                    </div>
                    <div className="activity-content">
                      <p className="activity-title">{activity.title}</p>
                      <p className="activity-desc">{activity.desc}</p>
                      <p className="activity-time">
                        <Clock className="w-3 h-3" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="fixed bottom-6 left-[280px] right-6 bg-[var(--bg-card)] rounded-xl p-4 flex items-center justify-between shadow-xl border border-white/5 z-50">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--text-secondary)]">
              <strong className="text-[var(--text-primary)]">{activeFilters.length}</strong> filters actief
            </span>
            {activeFilters.map((filter) => (
              <span
                key={filter}
                className="active-filter-tag"
              >
                {filter}
                <button onClick={() => toggleFilter(filter)} className="active-filter-remove">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <button onClick={clearFilters} className="btn btn--secondary btn--sm">
            Wis alle filters
          </button>
        </div>
      )}

      {/* CSS for Dashboard */}
      <style jsx>{`
        .dashboard {
          padding: var(--space-2xl);
          max-width: 1440px;
          margin: 0 auto;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--space-xl);
        }

        .dashboard-header-actions {
          display: flex;
          gap: var(--space-md);
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: var(--space-lg);
          margin-bottom: var(--space-2xl);
        }

        .stat-card {
          background: var(--bg-card);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
          display: flex;
          gap: var(--space-md);
          transition: var(--transition-base);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .stat-card:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: var(--shadow-lg);
        }

        .stat-card--highlight {
          background: var(--primary-gradient);
          border-color: transparent;
        }

        .stat-card-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 107, 53, 0.15);
          color: var(--primary-orange);
          flex-shrink: 0;
        }

        .stat-card--highlight .stat-card-icon {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .stat-card-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .stat-card-label {
          font-size: var(--text-sm);
          color: var(--text-tertiary);
          margin-bottom: 4px;
        }

        .stat-card-label--white {
          color: rgba(255, 255, 255, 0.8);
        }

        .stat-card-value {
          font-size: var(--text-3xl);
          font-weight: var(--font-bold);
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .stat-card-value--white {
          color: white;
        }

        .stat-card-change {
          font-size: var(--text-xs);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .stat-card-change--positive {
          color: var(--success);
        }

        .stat-card-change--white {
          color: rgba(255, 255, 255, 0.9);
        }

        /* Dashboard Content Grid */
        .dashboard-content {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: var(--space-lg);
        }

        @media (max-width: 1200px) {
          .dashboard-content {
            grid-template-columns: 1fr;
          }
        }

        .dashboard-section {
          background: var(--bg-card);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
          margin-bottom: var(--space-lg);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-lg);
        }

        .link-with-icon {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: var(--text-sm);
          font-weight: var(--font-medium);
          color: var(--primary-orange);
          transition: var(--transition-fast);
        }

        .link-with-icon:hover {
          opacity: 0.8;
        }

        /* Pipeline */
        .pipeline-chart {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .pipeline-item {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }

        .pipeline-number {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          background: var(--bg-tertiary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--text-sm);
          font-weight: var(--font-semibold);
          color: var(--text-secondary);
          flex-shrink: 0;
        }

        .pipeline-bar-container {
          flex: 1;
        }

        .pipeline-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-sm);
        }

        .pipeline-stage {
          font-weight: var(--font-medium);
          color: var(--text-primary);
        }

        .pipeline-count {
          font-size: var(--text-sm);
          color: var(--text-tertiary);
        }

        .pipeline-progress-bg {
          height: 8px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .pipeline-progress-fill {
          height: 100%;
          border-radius: var(--radius-full);
          transition: width 0.5s ease-out;
        }

        .pipeline-value {
          font-size: var(--text-sm);
          font-weight: var(--font-semibold);
          color: var(--text-primary);
          min-width: 80px;
          text-align: right;
        }

        /* Quick Actions */
        .quick-actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--space-md);
        }

        .quick-action-card {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-md);
          background: var(--bg-tertiary);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-md);
          transition: var(--transition-base);
        }

        .quick-action-card:hover {
          background: var(--bg-hover);
          border-color: rgba(255, 107, 53, 0.3);
          transform: translateY(-2px);
        }

        .quick-action-icon {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          background: rgba(255, 107, 53, 0.15);
          color: var(--primary-orange);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .quick-action-content {
          flex: 1;
        }

        .quick-action-title {
          font-weight: var(--font-semibold);
          color: var(--text-primary);
          margin-bottom: 2px;
        }

        .quick-action-desc {
          font-size: var(--text-sm);
          color: var(--text-tertiary);
        }

        /* Commission Highlight Section */
        .dashboard-section--highlight {
          background: linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(255, 0, 107, 0.1) 100%);
          border: 1px solid rgba(255, 107, 53, 0.2);
        }

        .commission-value {
          font-size: var(--text-4xl);
          font-weight: var(--font-bold);
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: var(--space-md) 0 var(--space-sm);
        }

        .commission-subtitle {
          font-size: var(--text-sm);
          color: var(--text-tertiary);
          margin-bottom: var(--space-lg);
        }

        .commission-breakdown {
          padding-top: var(--space-md);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .commission-breakdown-item {
          display: flex;
          justify-content: space-between;
          padding: var(--space-sm) 0;
          font-size: var(--text-sm);
          color: var(--text-secondary);
        }

        /* Activity List */
        .activity-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .activity-item {
          display: flex;
          gap: var(--space-md);
          padding-bottom: var(--space-md);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .activity-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .activity-icon {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .activity-icon--blue {
          background: rgba(59, 130, 246, 0.15);
          color: #60A5FA;
        }

        .activity-icon--green {
          background: rgba(16, 185, 129, 0.15);
          color: #34D399;
        }

        .activity-icon--purple {
          background: rgba(139, 92, 246, 0.15);
          color: #A78BFA;
        }

        .activity-icon--orange {
          background: rgba(249, 115, 22, 0.15);
          color: #FB923C;
        }

        .activity-content {
          flex: 1;
          min-width: 0;
        }

        .activity-title {
          font-weight: var(--font-medium);
          color: var(--text-primary);
          font-size: var(--text-sm);
          margin-bottom: 2px;
        }

        .activity-desc {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .activity-time {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* Active Filter Tags */
        .active-filter-tag {
          display: inline-flex;
          align-items: center;
          gap: var(--space-sm);
          padding: 6px 12px;
          background: var(--primary-gradient);
          border-radius: var(--radius-full);
          font-size: var(--text-xs);
          font-weight: var(--font-semibold);
          color: white;
        }

        .active-filter-remove {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 50%;
          color: white;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .active-filter-remove:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </PremiumLayout>
  );
}
