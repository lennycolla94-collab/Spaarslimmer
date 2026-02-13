'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { 
  Home, 
  Target, 
  Download, 
  Calendar, 
  FileText, 
  Phone, 
  Calculator, 
  Wallet,
  Bell,
  Search,
  Plus,
  ChevronDown,
  Settings,
  LogOut,
  Command,
  Gift,
  Users,
  Trophy,
  Sun,
  Moon
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useTheme } from '../theme-provider';
import { ThemeToggle } from '../theme-toggle';

interface PremiumLayoutProps {
  children: React.ReactNode;
  user?: {
    name?: string;
    email?: string;
    image?: string;
  };
}

const navSections = [
  {
    title: 'Overview',
    icon: '📊',
    items: [
      { icon: Home, label: 'Dashboard', href: '/dashboard/v2-premium', badge: 'Live' },
    ]
  },
  {
    title: 'Sales',
    icon: '👥',
    items: [
      { icon: Target, label: 'Leads', href: '/leads', count: 156 },
      { icon: Download, label: 'Import Leads', href: '/leads/import' },
      { icon: Calendar, label: 'Appointments', href: '/appointments', count: 8 },
      { icon: FileText, label: 'Offers', href: '/offers', badge: '3 New' },
    ]
  },
  {
    title: 'Finance',
    icon: '💰',
    items: [
      { icon: Wallet, label: 'Commission', href: '/commission', amount: '€18.6K', highlight: true },
      { icon: Calculator, label: 'Calculator', href: '/calculator' },
    ]
  },
  {
    title: 'Rewards',
    icon: '🏆',
    items: [
      { icon: Gift, label: 'Incentives', href: '/incentives', badge: '4 Active' },
      { icon: Trophy, label: 'PQS Ranking', href: '/incentives', count: 8 },
    ]
  },
  {
    title: 'Team',
    icon: '👨‍👩‍👧‍👦',
    items: [
      { icon: Users, label: 'Mijn Team', href: '/team', count: 3 },
      { icon: Target, label: 'Fidelity', href: '/team', amount: '€2.4K' },
    ]
  },
  {
    title: 'Operations',
    icon: '📞',
    items: [
      { icon: Phone, label: 'Call Center', href: '/call-center', status: 'active' },
    ]
  },
];

const quickActions = [
  { icon: Plus, label: 'New Lead', shortcut: '⌘N' },
  { icon: Phone, label: 'Call', shortcut: '⌘C' },
  { icon: FileText, label: 'Offer', shortcut: '⌘O' },
];

export function PremiumLayout({ children, user }: PremiumLayoutProps) {
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Top Navigation - Premium Glass */}
      <header className="fixed top-0 left-0 right-0 z-50 h-[72px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-slate-800">
        <div className="h-full px-6 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white text-lg">SmartSN CRM</span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {quickActions.map((action) => (
              <button
                key={action.label}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors border border-gray-200 dark:border-slate-700"
              >
                <action.icon className="w-4 h-4" />
                <span className="hidden lg:inline">{action.label}</span>
                <kbd className="hidden xl:inline-block px-1.5 py-0.5 text-xs bg-white dark:bg-slate-900 rounded border border-gray-300 dark:border-slate-600 text-gray-500 dark:text-gray-400 font-mono">
                  {action.shortcut}
                </kbd>
              </button>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Search */}
            <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* Command Palette */}
            <button className="hidden md:flex items-center gap-2 px-3 py-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors border border-gray-200 dark:border-slate-700">
              <Command className="w-4 h-4" />
              <span>Command</span>
              <kbd className="px-1.5 py-0.5 text-xs bg-white dark:bg-slate-900 rounded border border-gray-300 dark:border-slate-600">⌘K</kbd>
            </button>

            {/* Notifications */}
            <button className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.name?.[0] || 'U'}
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                </div>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name || 'User'}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Business Consultant</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-slate-800 py-2">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-800">
                    <p className="font-semibold text-gray-900 dark:text-white">{user?.name || 'User'}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email || 'user@example.com'}</p>
                  </div>
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Side Navigation */}
      <nav className="fixed left-0 top-[72px] w-[280px] h-[calc(100vh-72px)] bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 overflow-y-auto">
        <div className="p-4 space-y-6">
          {navSections.map((section) => (
            <div key={section.title}>
              <div className="flex items-center gap-2 px-3 mb-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                <span>{section.icon}</span>
                <span>{section.title}</span>
              </div>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                        ${isActive 
                          ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400' 
                          : item.highlight
                            ? 'bg-gradient-to-r from-orange-500/10 to-pink-500/10 dark:from-orange-500/5 dark:to-pink-500/5 text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-500/20'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                        }
                      `}
                    >
                      <item.icon className={`w-5 h-5 ${isActive ? 'text-orange-600 dark:text-orange-400' : 'text-gray-400 dark:text-gray-500'}`} />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs font-semibold bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {item.count && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 rounded-full">
                          {item.count}
                        </span>
                      )}
                      {item.amount && (
                        <span className="px-2 py-0.5 text-xs font-semibold bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 rounded-full">
                          {item.amount}
                        </span>
                      )}
                      {item.status === 'active' && (
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Upgrade Banner */}
          <div className="mt-auto pt-4">
            <button className="w-full flex items-center gap-3 p-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10 dark:from-purple-500/5 dark:to-blue-500/5 hover:from-purple-500/20 hover:to-blue-500/20 dark:hover:from-purple-500/10 dark:hover:to-blue-500/10 rounded-xl transition-colors border border-purple-200 dark:border-purple-500/20">
              <span className="text-2xl">⭐</span>
              <div className="text-left">
                <p className="font-semibold text-gray-900 dark:text-white text-sm">Upgrade to Pro</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Unlock AI features</p>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="ml-[280px] pt-[72px] min-h-screen">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
