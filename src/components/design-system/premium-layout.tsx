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
  Command
} from 'lucide-react';
import { signOut } from 'next-auth/react';

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
      { icon: Target, label: 'Leads', href: '/leads', count: 24 },
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation - Premium Glass */}
      <header className="fixed top-0 left-0 right-0 z-50 h-[72px] bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="h-full px-6 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="font-semibold text-gray-900 text-lg">SmartSN CRM</span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {quickActions.map((action) => (
              <button
                key={action.label}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
              >
                <action.icon className="w-4 h-4" />
                <span className="hidden lg:inline">{action.label}</span>
                <kbd className="hidden xl:inline-block px-1.5 py-0.5 text-xs bg-white rounded border border-gray-300 text-gray-500 font-mono">
                  {action.shortcut}
                </kbd>
              </button>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* Command Palette */}
            <button className="hidden md:flex items-center gap-2 px-3 py-2 text-sm text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
              <Command className="w-4 h-4" />
              <span>Command</span>
              <kbd className="px-1.5 py-0.5 text-xs bg-white rounded border border-gray-300">⌘K</kbd>
            </button>

            {/* Notifications */}
            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.name?.[0] || 'U'}
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</span>
                  <span className="text-xs text-gray-500">Business Consultant</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-gray-900">{user?.name || 'User'}</p>
                    <p className="text-sm text-gray-500">{user?.email || 'user@example.com'}</p>
                  </div>
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50"
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
      <nav className="fixed left-0 top-[72px] w-[280px] h-[calc(100vh-72px)] bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4 space-y-6">
          {navSections.map((section) => (
            <div key={section.title}>
              <div className="flex items-center gap-2 px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
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
                          ? 'bg-orange-50 text-orange-700' 
                          : item.highlight
                            ? 'bg-gradient-to-r from-orange-500/10 to-pink-500/10 text-orange-700 hover:bg-orange-100'
                            : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <item.icon className={`w-5 h-5 ${isActive ? 'text-orange-600' : 'text-gray-400'}`} />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-700 rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {item.count && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                          {item.count}
                        </span>
                      )}
                      {item.amount && (
                        <span className="px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
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
            <button className="w-full flex items-center gap-3 p-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10 hover:from-purple-500/20 hover:to-blue-500/20 rounded-xl transition-colors border border-purple-200">
              <span className="text-2xl">⭐</span>
              <div className="text-left">
                <p className="font-semibold text-gray-900 text-sm">Upgrade to Pro</p>
                <p className="text-xs text-gray-500">Unlock AI features</p>
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
