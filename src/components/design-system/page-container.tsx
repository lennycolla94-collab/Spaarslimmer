'use client';

import { ReactNode } from 'react';
import { useTheme } from 'next-themes';
import { useTranslation } from '@/components/language-provider';
import { Moon, Sun, Globe } from 'lucide-react';

// ============== THEME TOGGLE ==============
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all duration-200 shadow-sm hover:shadow-md"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-amber-400" />
      ) : (
        <Moon className="w-5 h-5 text-indigo-500" />
      )}
    </button>
  );
}

// ============== LANGUAGE TOGGLE ==============
export function LanguageToggle() {
  const { language, setLanguage } = useTranslation();
  
  return (
    <button
      onClick={() => setLanguage(language === 'nl' ? 'fr' : 'nl')}
      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all duration-200 shadow-sm hover:shadow-md font-semibold text-sm"
      aria-label="Toggle language"
    >
      <Globe className="w-4 h-4" />
      <span className="uppercase min-w-[24px]">{language}</span>
    </button>
  );
}

// ============== PAGE CONTAINER ==============
interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className={`min-h-screen transition-colors duration-300 ${className}`}>
      {/* LIGHT MODE: Soft warm gradient background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-orange-50 via-white to-blue-50 dark:opacity-0 transition-opacity duration-300" />
      
      {/* DARK MODE: Deep professional dark gradient */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 opacity-0 dark:opacity-100 transition-opacity duration-300" />
      
      {children}
    </div>
  );
}

// ============== PAGE HEADER ==============
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
  stats?: { label: string; value: string; trend?: string }[];
  showThemeToggle?: boolean;
}

export function PageHeader({ title, subtitle, icon, action, stats, showThemeToggle = true }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/50 dark:border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Title Section */}
          <div className="flex items-center gap-4">
            {icon && (
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center shadow-lg shadow-orange-500/30 dark:shadow-orange-500/20">
                {icon}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                {title}
              </h1>
              {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            <LanguageToggle />
            {showThemeToggle && <ThemeToggle />}
            {action && <div className="flex-shrink-0">{action}</div>}
          </div>
        </div>
        
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center md:text-left">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">{stat.label}</p>
                <div className="flex items-baseline gap-2 justify-center md:justify-start">
                  <p className="text-xl font-bold text-slate-800 dark:text-white">{stat.value}</p>
                  {stat.trend && (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{stat.trend}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

// ============== SMART CARD ==============
interface CardProps {
  children: ReactNode;
  className?: string;
  gradient?: boolean;
  hover?: boolean;
}

export function SmartCard({ children, className = '', gradient = false, hover = true }: CardProps) {
  return (
    <div className={`rounded-2xl border backdrop-blur-sm transition-all duration-300 ${
      gradient 
        ? 'bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 border-orange-200/50 dark:border-orange-500/20' 
        : 'bg-white/80 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50'
    } ${
      hover ? 'shadow-sm hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/20 hover:-translate-y-0.5' : 'shadow-sm'
    } ${className}`}>
      {children}
    </div>
  );
}

// ============== STAT CARD ==============
interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'orange' | 'blue' | 'green' | 'purple' | 'red' | 'yellow' | 'pink' | 'indigo';
}

const colorSchemes = {
  orange: { bg: 'from-orange-500 to-red-500', light: 'bg-orange-50 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-500/30' },
  blue: { bg: 'from-blue-500 to-cyan-500', light: 'bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-500/30' },
  green: { bg: 'from-emerald-500 to-green-500', light: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-500/30' },
  purple: { bg: 'from-purple-500 to-violet-500', light: 'bg-purple-50 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-500/30' },
  red: { bg: 'from-red-500 to-rose-500', light: 'bg-red-50 text-red-600 dark:bg-red-500/20 dark:text-red-400', border: 'border-red-200 dark:border-red-500/30' },
  yellow: { bg: 'from-yellow-500 to-amber-500', light: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400', border: 'border-yellow-200 dark:border-yellow-500/30' },
  pink: { bg: 'from-pink-500 to-rose-500', light: 'bg-pink-50 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400', border: 'border-pink-200 dark:border-pink-500/30' },
  indigo: { bg: 'from-indigo-500 to-blue-500', light: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-500/30' },
};

export function StatCard({ label, value, subtext, icon, trend, trendValue, color = 'orange' }: StatCardProps) {
  const scheme = colorSchemes[color];
  
  return (
    <SmartCard className="p-6 relative overflow-hidden">
      {/* Background glow effect */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${scheme.bg} opacity-10 dark:opacity-20 rounded-full blur-3xl`} />
      
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1 font-medium">{label}</p>
          <p className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">{value}</p>
          {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
          {trend && trendValue && (
            <div className={`flex items-center gap-1 mt-2 text-sm font-semibold ${
              trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 
              trend === 'down' ? 'text-rose-600 dark:text-rose-400' : 
              'text-slate-500 dark:text-slate-400'
            }`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${scheme.bg} flex items-center justify-center text-white shadow-lg shadow-${color}-500/30`}>
          {icon}
        </div>
      </div>
    </SmartCard>
  );
}

// ============== ACTION BUTTON ==============
interface ActionButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function ActionButton({ children, onClick, href, variant = 'primary', icon, size = 'md' }: ActionButtonProps) {
  const baseClasses = 'inline-flex items-center gap-2 font-semibold transition-all duration-200 rounded-xl';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white hover:shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98]',
    secondary: 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:border-orange-300 dark:hover:border-orange-500/50 hover:text-orange-600 dark:hover:text-orange-400 shadow-sm',
    ghost: 'text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/10',
    danger: 'bg-gradient-to-r from-rose-500 to-red-500 text-white hover:shadow-lg hover:shadow-rose-500/30 hover:scale-[1.02] active:scale-[0.98]',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`;
  
  if (href) {
    return (
      <a href={href} className={classes}>
        {icon}
        {children}
      </a>
    );
  }
  
  return (
    <button onClick={onClick} className={classes}>
      {icon}
      {children}
    </button>
  );
}

// ============== EMPTY STATE ==============
interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-4">
      <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 shadow-inner">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">{description}</p>
      {action}
    </div>
  );
}

// ============== BADGE ==============
interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  className?: string;
}

const badgeStyles = {
  default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  success: 'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30',
  warning: 'bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30',
  error: 'bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/30',
  info: 'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30',
  neutral: 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
};

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${badgeStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}

// ============== SEARCH INPUT ==============
interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export function SearchInput({ placeholder = 'Zoeken...', value, onChange }: SearchInputProps) {
  return (
    <div className="relative group">
      <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-11 pr-4 py-2.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition-all"
      />
    </div>
  );
}

// ============== FILTER TABS ==============
interface FilterTabsProps {
  options: { value: string; label: string; count?: number }[];
  value: string;
  onChange: (value: string) => void;
}

export function FilterTabs({ options, value, onChange }: FilterTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
            value === option.value
              ? 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white shadow-lg shadow-orange-500/30'
              : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-500/50 hover:text-orange-600 dark:hover:text-orange-400 backdrop-blur-sm'
          }`}
        >
          {option.label}
          {option.count !== undefined && (
            <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
              value === option.value ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-700'
            }`}>
              {option.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
