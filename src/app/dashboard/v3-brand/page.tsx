'use client';

import { useState, useEffect } from 'react';
import { 
  Phone, 
  Target, 
  Euro, 
  Users, 
  Zap,
  TrendingUp,
  Calendar,
  MapPin,
  Building2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plane,
  Crown,
  Gift,
  ArrowRight,
  Plus,
  Home,
  ClipboardList,
  LogOut,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

// Brand colors from guide
const COLORS = {
  bg: '#0F172A',
  surface: '#1E293B',
  surfaceHover: '#334155',
  primary: '#F97316',
  primaryLight: '#FB923C',
  primaryDark: '#EA580C',
  secondary: '#06B6D4',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textTertiary: '#64748B',
};

// Mock data
const nextAction = {
  type: 'call',
  company: 'NecmiCuts',
  contact: 'Necmi Yildiz',
  phone: '0472 12 34 56',
  city: 'Aalst',
  lastContact: '2 dagen geleden',
  priority: 'high'
};

const stats = {
  callsToday: 8,
  callsTarget: 15,
  aspThisMonth: 45,
  aspTarget: 100,
  commission: 1250,
  pqsProgress: 60,
  pqsTarget: 100
};

const incentives = [
  { name: 'Portugal Seminar', progress: 80, target: 100, icon: Plane, color: COLORS.primary },
  { name: 'Winter Gift', progress: 45, target: 60, icon: Gift, color: COLORS.secondary },
  { name: 'PQS Q1', progress: 12, target: 17, icon: Target, color: COLORS.success },
];

const teamPulse = [
  { user: 'Sarah', action: 'nieuwe sale!', time: '2m', city: 'Brussel' },
  { user: 'Mark', action: '25 calls vandaag', time: '15m', city: 'Antwerpen' },
  { user: 'Lisa', action: 'PQS behaald!', time: '45m', city: 'Gent' },
];

export default function BrandV3Dashboard() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div 
      className="min-h-screen flex"
      style={{ 
        backgroundColor: COLORS.bg, 
        color: COLORS.textPrimary, 
        fontFamily: 'Inter, system-ui, sans-serif' 
      }}
    >
      {/* Sidebar */}
      <aside 
        className="w-64 flex-shrink-0 flex flex-col"
        style={{ backgroundColor: COLORS.surface }}
      >
        {/* Logo */}
        <div className="p-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-lg"
              style={{ backgroundColor: COLORS.primary }}
            >
              S
            </div>
            <div>
              <h1 className="font-bold text-lg" style={{ color: COLORS.textPrimary }}>
                Spaarslimmer
              </h1>
              <p className="text-xs" style={{ color: COLORS.textTertiary }}>
                Consultant Cockpit
              </p>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div 
          className="p-4 mx-4 mt-4 rounded-2xl"
          style={{ background: `linear-gradient(135deg, ${COLORS.primary}20, ${COLORS.primary}10)` }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
              style={{ backgroundColor: COLORS.primary, color: 'white' }}
            >
              BC
            </div>
            <div>
              <p className="text-xs" style={{ color: COLORS.textSecondary }}>Level 2</p>
              <p className="font-bold text-sm" style={{ color: COLORS.textPrimary }}>
                Business Consultant
              </p>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1" style={{ color: COLORS.textSecondary }}>
              <span>ASP Doel</span>
              <span>{stats.aspThisMonth} / {stats.aspTarget}</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
              <div 
                className="h-full rounded-full transition-all"
                style={{ 
                  width: `${(stats.aspThisMonth / stats.aspTarget) * 100}%`,
                  backgroundColor: COLORS.primary 
                }}
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {[
            { icon: Home, label: 'Dashboard', href: '/dashboard/v3-brand', active: true },
            { icon: Building2, label: 'Lead Management', href: '/leads' },
            { icon: Phone, label: 'Call Cockpit', href: '/call-center' },
            { icon: Calendar, label: 'Afspraken', href: '/appointments' },
            { icon: Euro, label: 'Commissies', href: '/commission' },
            { icon: Target, label: 'Incentives', href: '/incentives', badge: '3' },
            { icon: Users, label: 'Team', href: '/team' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                style={{ 
                  backgroundColor: item.active ? COLORS.primary : 'transparent',
                  color: item.active ? 'white' : COLORS.textSecondary
                }}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
                {item.badge && (
                  <span 
                    className="ml-auto px-2 py-0.5 text-xs rounded-full"
                    style={{ backgroundColor: COLORS.danger, color: 'white' }}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <button 
            onClick={() => signOut()}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-colors hover:bg-white/5"
            style={{ color: COLORS.textSecondary }}
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Uitloggen</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.textPrimary }}>
              Welkom terug! 👋
            </h1>
            <p style={{ color: COLORS.textSecondary }}>
              Hier is je overzicht voor vandaag.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm" style={{ color: COLORS.textSecondary }}>
              {new Date().toLocaleDateString('nl-BE', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>

        {/* NEXT ACTION - Hero Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5" style={{ color: COLORS.primary }} />
            <h2 className="text-lg font-bold" style={{ color: COLORS.textPrimary }}>
              Jouw volgende actie
            </h2>
          </div>
          
          <div 
            className="rounded-2xl p-6 relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})` }}
          >
            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{nextAction.company}</h3>
                      <p className="text-white/80">{nextAction.contact}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 mb-4 text-white/90">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{nextAction.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{nextAction.lastContact}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <a 
                      href={`tel:${nextAction.phone}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                      Bel {nextAction.phone}
                    </a>
                    <Link
                      href="/leads"
                      className="inline-flex items-center gap-2 px-4 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-colors"
                    >
                      Alle leads
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Quick Stats Mini */}
                <div className="hidden lg:block text-right text-white">
                  <p className="text-5xl font-bold">{stats.callsToday}</p>
                  <p className="text-white/80">calls vandaag</p>
                  <p className="text-sm text-white/60 mt-1">doel: {stats.callsTarget}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { 
              label: 'Calls vandaag', 
              value: `${stats.callsToday}/${stats.callsTarget}`,
              subtext: `${Math.round((stats.callsToday/stats.callsTarget)*100)}% van doel`,
              icon: Phone,
              color: COLORS.primary 
            },
            { 
              label: 'ASP deze maand', 
              value: stats.aspThisMonth,
              subtext: `doel: ${stats.aspTarget}`,
              icon: Target,
              color: COLORS.secondary 
            },
            { 
              label: 'Commissie', 
              value: `€${stats.commission}`,
              subtext: 'geschat deze maand',
              icon: Euro,
              color: COLORS.success 
            },
            { 
              label: 'PQS Score', 
              value: `${stats.pqsProgress}/${stats.pqsTarget}`,
              subtext: 'punten behaald',
              icon: Crown,
              color: COLORS.warning 
            },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div 
                key={stat.label}
                className="rounded-2xl p-5"
                style={{ backgroundColor: COLORS.surface }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                  <span className="text-sm" style={{ color: COLORS.textSecondary }}>
                    {stat.label}
                  </span>
                </div>
                <p className="text-2xl font-bold mb-1" style={{ color: COLORS.textPrimary }}>
                  {stat.value}
                </p>
                <p className="text-xs" style={{ color: COLORS.textTertiary }}>
                  {stat.subtext}
                </p>
              </div>
            );
          })}
        </div>

        {/* Incentives Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5" style={{ color: COLORS.primary }} />
                <h2 className="text-lg font-bold" style={{ color: COLORS.textPrimary }}>
                  Jouw incentives
                </h2>
              </div>
              <Link 
                href="/incentives" 
                className="text-sm flex items-center gap-1 hover:underline"
                style={{ color: COLORS.primary }}
              >
                Bekijk alle
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-3">
              {incentives.map((incentive) => {
                const Icon = incentive.icon;
                const percentage = (incentive.progress / incentive.target) * 100;
                return (
                  <div 
                    key={incentive.name}
                    className="rounded-2xl p-5"
                    style={{ backgroundColor: COLORS.surface }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${incentive.color}20` }}
                        >
                          <Icon className="w-5 h-5" style={{ color: incentive.color }} />
                        </div>
                        <div>
                          <h3 className="font-semibold" style={{ color: COLORS.textPrimary }}>
                            {incentive.name}
                          </h3>
                          <p className="text-xs" style={{ color: COLORS.textSecondary }}>
                            {incentive.progress} / {incentive.target} punten
                          </p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold" style={{ color: incentive.color }}>
                        {Math.round(percentage)}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ width: `${percentage}%`, backgroundColor: incentive.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Team Pulse */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5" style={{ color: COLORS.primary }} />
              <h2 className="text-lg font-bold" style={{ color: COLORS.textPrimary }}>
                Team Pulse
              </h2>
            </div>

            <div 
              className="rounded-2xl p-5 space-y-4"
              style={{ backgroundColor: COLORS.surface }}
            >
              {teamPulse.map((pulse, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: COLORS.primary, color: 'white' }}
                  >
                    {pulse.user[0]}
                  </div>
                  <div className="flex-1">
                    <p style={{ color: COLORS.textPrimary }}>
                      <span className="font-semibold">{pulse.user}</span>{' '}
                      <span style={{ color: COLORS.textSecondary }}>{pulse.action}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-3 h-3" style={{ color: COLORS.textTertiary }} />
                      <span className="text-xs" style={{ color: COLORS.textTertiary }}>{pulse.city}</span>
                      <span className="text-xs" style={{ color: COLORS.textTertiary }}>• {pulse.time}</span>
                    </div>
                  </div>
                </div>
              ))}

              <Link 
                href="/team"
                className="flex items-center justify-center gap-2 pt-4 border-t text-sm hover:underline"
                style={{ borderColor: 'rgba(255,255,255,0.1)', color: COLORS.primary }}
              >
                Bekijk volledig team
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Add Lead */}
        <div 
          className="rounded-2xl p-6 flex items-center justify-between"
          style={{ backgroundColor: COLORS.surface }}
        >
          <div>
            <h3 className="font-semibold mb-1" style={{ color: COLORS.textPrimary }}>
              Nieuwe lead toe te voegen?
            </h3>
            <p className="text-sm" style={{ color: COLORS.textSecondary }}>
              Importeer je CSV of voeg handmatig toe.
            </p>
          </div>
          <div className="flex gap-3">
            <Link 
              href="/leads/import"
              className="px-4 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-white/15"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: COLORS.textPrimary }}
            >
              Importeer CSV
            </Link>
            <Link 
              href="/leads"
              className="px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
              style={{ backgroundColor: COLORS.primary, color: 'white' }}
            >
              <Plus className="w-4 h-4" />
              Nieuwe lead
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
