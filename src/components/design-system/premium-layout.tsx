'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import { signOut } from 'next-auth/react';
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
  X,
  Clock,
  ArrowRight,
  TrendingUp,
  Building2,
  User
} from 'lucide-react';
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
      { icon: Home, label: 'Dashboard', href: '/dashboard', badge: 'Live' },
    ]
  },
  {
    title: 'Sales',
    icon: '👥',
    items: [
      { icon: Target, label: 'Leads', href: '/leads', count: 156 },
      { icon: Calendar, label: 'Appointments', href: '/appointments', count: 8 },
      { icon: FileText, label: 'Offers', href: '/offers', badge: '3 New' },
    ]
  },
  {
    title: 'Finance',
    icon: '💰',
    items: [
      { icon: Wallet, label: 'Commission', href: '/commission', amount: '€18.6K', highlight: true },
      { icon: Target, label: 'Fidelity', href: '/team', amount: '€2.4K' },
    ]
  },
  {
    title: 'Rewards',
    icon: '🏆',
    items: [
      { icon: Gift, label: 'Incentives', href: '/incentives', badge: '4 Active' },
    ]
  },
  {
    title: 'Team',
    icon: '👨‍👩‍👧‍👦',
    items: [
      { icon: Users, label: 'Mijn Team', href: '/team', count: 3 },
    ]
  },
  {
    title: 'Operations',
    icon: '📞',
    items: [
      { icon: Phone, label: 'Call Center', href: '/call-center', status: 'active' },
      { icon: Calculator, label: 'Calculator', href: '/calculator' },
    ]
  },
];

const quickActions = [
  { icon: Plus, label: 'Nieuwe Lead', shortcut: '⌘N', href: '/leads/new', color: 'orange' },
  { icon: Phone, label: 'Bel', shortcut: '⌘C', href: '/call-center', color: 'green' },
  { icon: FileText, label: 'Offerte', shortcut: '⌘O', href: '/offers/new', color: 'blue' },
];

// Mock search results
const mockSearchResults = [
  { type: 'lead', title: 'Willems Groep', subtitle: 'Contact: Sophie Willems', href: '/leads/1', icon: Building2 },
  { type: 'lead', title: 'Tech Solutions BV', subtitle: 'Contact: Jan Peeters', href: '/leads/2', icon: Building2 },
  { type: 'offer', title: 'Offerte #2024-001', subtitle: 'Willems Groep - €1,250', href: '/offers/1', icon: FileText },
  { type: 'offer', title: 'Offerte #2024-002', subtitle: 'Tech Solutions - €890', href: '/offers/2', icon: FileText },
  { type: 'page', title: 'Dashboard', subtitle: 'Hoofdoverzicht', href: '/dashboard', icon: Home },
  { type: 'page', title: 'Leads', subtitle: 'Alle leads beheren', href: '/leads', icon: Target },
  { type: 'page', title: 'Calculator', subtitle: 'Prijs berekenen', href: '/calculator', icon: Calculator },
];

export function PremiumLayout({ children, user }: PremiumLayoutProps) {
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof mockSearchResults>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const themeContext = useTheme();
  
  const resolvedTheme = themeContext?.resolvedTheme || 'light';
  const isDark = resolvedTheme === 'dark';

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
      // Escape to close
      if (e.key === 'Escape') {
        setShowSearch(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  // Search functionality
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = mockSearchResults.filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.subtitle.toLowerCase().includes(query)
    );
    setSearchResults(filtered);
    setSelectedIndex(0);
  }, [searchQuery]);

  // Handle keyboard navigation in search
  const handleSearchKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % searchResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + searchResults.length) % searchResults.length);
    } else if (e.key === 'Enter' && searchResults[selectedIndex]) {
      window.location.href = searchResults[selectedIndex].href;
    }
  }, [searchResults, selectedIndex]);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="skip-link">
        Ga naar hoofdinhoud
      </a>

      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 h-[72px] glass border-b border-white/5">
        <div className="h-full px-6 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="font-semibold text-[var(--text-primary)] text-lg">SmartSN CRM</span>
          </div>

          {/* Global Search */}
          <div className="flex-1 max-w-xl mx-8">
            <button
              onClick={() => setShowSearch(true)}
              className="w-full flex items-center gap-3 px-4 py-2.5 bg-[var(--bg-tertiary)] border border-white/10 rounded-lg text-left transition-colors hover:border-[var(--primary-orange)]/30"
            >
              <Search className="w-4 h-4 text-[var(--text-tertiary)]" />
              <span className="text-[var(--text-tertiary)] text-sm flex-1">Zoek leads, contacten, offertes...</span>
              <kbd className="hidden md:inline-flex px-2 py-0.5 text-xs bg-[var(--bg-primary)] border border-white/10 rounded text-[var(--text-tertiary)] font-mono">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Quick Actions */}
            <div className="hidden lg:flex items-center gap-2">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[var(--text-secondary)] bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)] rounded-lg transition-colors border border-white/5"
                  title={`${action.label} (${action.shortcut})`}
                >
                  <action.icon className="w-4 h-4" />
                  <span className="hidden xl:inline">{action.label}</span>
                </Link>
              ))}
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <button className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--error)] rounded-full"></span>
            </button>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 p-2 hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.name?.[0] || 'U'}
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-[var(--success)] border-2 border-[var(--bg-primary)] rounded-full"></span>
                </div>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-semibold text-[var(--text-primary)]">{user?.name || 'User'}</span>
                  <span className="text-xs text-[var(--text-tertiary)]">Business Consultant</span>
                </div>
                <ChevronDown className="w-4 h-4 text-[var(--text-tertiary)]" />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-[var(--bg-card)] rounded-xl shadow-xl border border-white/10 py-2 z-50">
                  <div className="px-4 py-3 border-b border-white/5">
                    <p className="font-semibold text-[var(--text-primary)]">{user?.name || 'User'}</p>
                    <p className="text-sm text-[var(--text-tertiary)]">{user?.email || 'user@example.com'}</p>
                  </div>
                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-2 text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Instellingen
                  </Link>
                  <Link
                    href="/leads/import"
                    className="flex items-center gap-3 px-4 py-2 text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Leads Importeren
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-3 px-4 py-2 text-[var(--error)] hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Uitloggen
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      {showSearch && (
        <div 
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
          onClick={() => setShowSearch(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div 
            className="relative w-full max-w-2xl mx-4 bg-[var(--bg-card)] rounded-xl shadow-2xl border border-white/10 overflow-hidden animate-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center gap-4 p-4 border-b border-white/5">
              <Search className="w-6 h-6 text-[var(--text-tertiary)]" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Zoek leads, contacten, offertes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="flex-1 bg-transparent text-[var(--text-primary)] text-lg placeholder-[var(--text-tertiary)] outline-none"
              />
              <button 
                onClick={() => setShowSearch(false)}
                className="p-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
              >
                <kbd className="px-2 py-1 text-xs bg-[var(--bg-tertiary)] border border-white/10 rounded font-mono">ESC</kbd>
              </button>
            </div>

            {/* Search Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {searchQuery.length < 2 ? (
                <div className="p-4">
                  <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-3">Snelle acties</p>
                  <div className="space-y-1">
                    {quickActions.map((action, idx) => (
                      <Link
                        key={action.label}
                        href={action.href}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors group"
                        onClick={() => setShowSearch(false)}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          action.color === 'orange' ? 'bg-orange-500/20 text-orange-400' :
                          action.color === 'green' ? 'bg-green-500/20 text-green-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          <action.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[var(--text-primary)] font-medium">{action.label}</p>
                        </div>
                        <kbd className="px-2 py-0.5 text-xs bg-[var(--bg-tertiary)] border border-white/10 rounded text-[var(--text-tertiary)] font-mono">
                          {action.shortcut}
                        </kbd>
                      </Link>
                    ))}
                  </div>

                  <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-3 mt-6">Recent bezocht</p>
                  <div className="space-y-1">
                    {[
                      { title: 'Dashboard', href: '/dashboard', icon: Home },
                      { title: 'Leads', href: '/leads', icon: Target },
                      { title: 'Calculator', href: '/calculator', icon: Calculator },
                    ].map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                        onClick={() => setShowSearch(false)}
                      >
                        <div className="w-8 h-8 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-secondary)]">
                          <item.icon className="w-4 h-4" />
                        </div>
                        <span className="text-[var(--text-primary)]">{item.title}</span>
                        <ArrowRight className="w-4 h-4 text-[var(--text-tertiary)] ml-auto" />
                      </Link>
                    ))}
                  </div>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center">
                    <Search className="w-8 h-8 text-[var(--text-tertiary)]" />
                  </div>
                  <p className="text-[var(--text-primary)] font-medium mb-1">Geen resultaten gevonden</p>
                  <p className="text-[var(--text-secondary)] text-sm">Probeer een andere zoekterm</p>
                </div>
              ) : (
                <div className="p-2">
                  {searchResults.map((result, idx) => (
                    <Link
                      key={idx}
                      href={result.href}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                        selectedIndex === idx ? 'bg-[var(--bg-tertiary)]' : 'hover:bg-[var(--bg-tertiary)]'
                      }`}
                      onClick={() => setShowSearch(false)}
                    >
                      <div className="w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-secondary)]">
                        <result.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[var(--text-primary)] font-medium truncate">{result.title}</p>
                        <p className="text-[var(--text-tertiary)] text-sm truncate">{result.subtitle}</p>
                      </div>
                      <ArrowRight className={`w-4 h-4 text-[var(--text-tertiary)] transition-opacity ${
                        selectedIndex === idx ? 'opacity-100' : 'opacity-0'
                      }`} />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-3 bg-[var(--bg-tertiary)] border-t border-white/5 text-xs text-[var(--text-tertiary)]">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-[var(--bg-card)] border border-white/10 rounded font-mono">↑↓</kbd>
                  om te navigeren
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-[var(--bg-card)] border border-white/10 rounded font-mono">↵</kbd>
                  om te selecteren
                </span>
              </div>
              <span>{searchResults.length} resultaten</span>
            </div>
          </div>
        </div>
      )}

      {/* Side Navigation */}
      <nav className="fixed left-0 top-[72px] w-[280px] h-[calc(100vh-72px)] bg-[var(--bg-secondary)] border-r border-white/5 overflow-y-auto">
        <div className="p-4 space-y-6">
          {navSections.map((section) => (
            <div key={section.title}>
              <div className="flex items-center gap-2 px-3 mb-2 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
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
                          ? 'bg-orange-500/10 text-[var(--primary-orange)]' 
                          : item.highlight
                            ? 'bg-gradient-to-r from-orange-500/10 to-pink-500/10 text-[var(--primary-orange)] hover:bg-orange-500/20'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                        }
                      `}
                    >
                      <item.icon className={`w-5 h-5 ${isActive ? 'text-[var(--primary-orange)]' : 'text-[var(--text-tertiary)]'}`} />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs font-semibold bg-[var(--error)]/20 text-[var(--error)] rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {item.count && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] rounded-full">
                          {item.count}
                        </span>
                      )}
                      {item.amount && (
                        <span className="px-2 py-0.5 text-xs font-semibold bg-[var(--success)]/20 text-[var(--success)] rounded-full">
                          {item.amount}
                        </span>
                      )}
                      {item.status === 'active' && (
                        <span className="w-2 h-2 bg-[var(--success)] rounded-full"></span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Upgrade Banner */}
          <div className="mt-auto pt-4">
            <button className="w-full flex items-center gap-3 p-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10 hover:from-purple-500/20 hover:to-blue-500/20 rounded-xl transition-colors border border-purple-500/20">
              <span className="text-2xl">⭐</span>
              <div className="text-left">
                <p className="font-semibold text-[var(--text-primary)] text-sm">Upgrade naar Pro</p>
                <p className="text-xs text-[var(--text-tertiary)]">Ontgrendel AI functies</p>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main id="main-content" className="ml-[280px] pt-[72px] min-h-screen">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
