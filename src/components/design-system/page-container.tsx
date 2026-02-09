'use client';

import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/30 ${className}`}>
      {children}
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
  stats?: { label: string; value: string; trend?: string }[];
}

export function PageHeader({ title, subtitle, icon, action, stats }: PageHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200/80 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            {icon && (
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                {icon}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
          </div>
          
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
        
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-gray-100">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center md:text-left">
                <p className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</p>
                <div className="flex items-baseline gap-2 justify-center md:justify-start">
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                  {stat.trend && (
                    <span className="text-xs text-green-600 font-medium">{stat.trend}</span>
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

interface CardProps {
  children: ReactNode;
  className?: string;
  gradient?: boolean;
}

export function SmartCard({ children, className = '', gradient = false }: CardProps) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-200/60 overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200 ${
      gradient ? 'bg-gradient-to-br from-orange-50/50 to-white' : ''
    } ${className}`}>
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'orange' | 'blue' | 'green' | 'purple' | 'red' | 'yellow';
}

const colorClasses = {
  orange: 'from-orange-500 to-red-600',
  blue: 'from-blue-500 to-blue-600',
  green: 'from-emerald-500 to-green-600',
  purple: 'from-purple-500 to-purple-600',
  red: 'from-red-500 to-rose-600',
  yellow: 'from-yellow-500 to-amber-600',
};

export function StatCard({ label, value, subtext, icon, trend, trendValue, color = 'orange' }: StatCardProps) {
  return (
    <SmartCard className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
          {trend && trendValue && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'
            }`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-white shadow-lg`}>
          {icon}
        </div>
      </div>
    </SmartCard>
  );
}

interface ActionButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function ActionButton({ children, onClick, href, variant = 'primary', icon, size = 'md' }: ActionButtonProps) {
  const baseClasses = 'inline-flex items-center gap-2 font-medium transition-all duration-200 rounded-xl';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:shadow-lg hover:shadow-orange-500/25 hover:scale-105',
    secondary: 'bg-white text-gray-700 border border-gray-200 hover:border-orange-300 hover:text-orange-600',
    ghost: 'text-gray-600 hover:text-orange-600 hover:bg-orange-50',
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

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-4">
      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center text-gray-400">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-sm mx-auto mb-6">{description}</p>
      {action}
    </div>
  );
}

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700 border border-green-200',
    warning: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    error: 'bg-red-100 text-red-700 border border-red-200',
    info: 'bg-blue-100 text-blue-700 border border-blue-200',
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export function SearchInput({ placeholder = 'Zoeken...', value, onChange }: SearchInputProps) {
  return (
    <div className="relative">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
      />
    </div>
  );
}

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
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            value === option.value
              ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/25'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300 hover:text-orange-600'
          }`}
        >
          {option.label}
          {option.count !== undefined && (
            <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
              value === option.value ? 'bg-white/20' : 'bg-gray-100'
            }`}>
              {option.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
