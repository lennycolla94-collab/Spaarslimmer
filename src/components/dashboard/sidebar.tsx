'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { 
  LayoutDashboard, 
  Users, 
  Phone, 
  Calculator, 
  FileText, 
  Gift, 
  Euro, 
  Users2, 
  BarChart3,
  Calendar,
  LogOut,
  Crown
} from 'lucide-react';

interface SidebarProps {
  variant?: 'dark' | 'light' | 'gradient';
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Users, label: 'Lead Management', href: '/leads' },
  { icon: Phone, label: 'Call Logging', href: '/call-center' },
  { icon: Calendar, label: 'Afspraken', href: '/appointments' },
  { icon: Calculator, label: 'Prijs Calculator', href: '/calculator' },
  { icon: FileText, label: 'Order Invoer', href: '/orders/new' },
  { icon: Gift, label: 'Incentives', href: '/incentives', badge: 'NEW' },
  { icon: Euro, label: 'Mijn Commissie', href: '/commission' },
  { icon: Users2, label: 'Team Management', href: '/team' },
  { icon: BarChart3, label: 'Rapporten', href: '/reports' },
];

// Design A: Dark Sidebar (zoals inspiratie)
export function DarkSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <div>
            <h1 className="font-bold text-lg">SmartSN</h1>
            <p className="text-xs text-slate-400">PRO CRM</p>
          </div>
        </div>
      </div>

      {/* User Card */}
      <div className="p-4 mx-4 mt-4 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Crown className="w-5 h-5 text-yellow-300" />
          </div>
          <div>
            <p className="text-xs text-purple-200">Level 1</p>
            <p className="font-bold text-sm">Beginner</p>
          </div>
        </div>
        <div className="mt-3">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full w-0 bg-yellow-400 rounded-full" />
          </div>
          <p className="text-xs text-purple-200 mt-1">0 / 100 XP</p>
        </div>
        <div className="flex justify-between mt-3 text-xs">
          <span className="text-purple-200">0 ASP</span>
          <span className="text-purple-200">0/17</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-orange-600 text-white' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
              {item.badge && (
                <span className="ml-auto px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={() => signOut()}
          className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Uitloggen</span>
        </button>
        <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
          <span>Versie v4.1 - f8n</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            Live
          </span>
        </div>
      </div>
    </aside>
  );
}

// Design B: Gradient Sidebar (Smart Energy - mijn visie)
export function GradientSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen flex flex-col bg-white">
      {/* Gradient Header */}
      <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center border border-white/30">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <div>
            <h1 className="font-bold text-xl">SmartSN</h1>
            <p className="text-xs text-orange-100">Consultant Portal</p>
          </div>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="px-4 -mt-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              BC
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Business Consultant</p>
              <p className="text-xs text-gray-500">Rank: BC</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">ASP Doel</span>
              <span className="font-medium">0 / 100</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full w-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-orange-50 text-orange-600 border border-orange-200' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className={`p-2 rounded-lg ${isActive ? 'bg-orange-100' : 'bg-gray-100'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">{item.label}</span>
              {item.badge && (
                <span className="ml-auto px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Quick Stats */}
      <div className="p-4 mx-4 mb-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl text-white">
        <p className="text-xs text-gray-400 mb-2">Deze Maand</p>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-2xl font-bold">€0</p>
            <p className="text-xs text-gray-400">Commissie</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">0</p>
            <p className="text-xs text-gray-400">Sales</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={() => signOut()}
          className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-gray-900 transition-colors w-full rounded-xl hover:bg-gray-50"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Uitloggen</span>
        </button>
      </div>
    </aside>
  );
}
