'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PageContainer, 
  PageHeader, 
  SmartCard, 
  StatCard, 
  ActionButton,
  EmptyState,
  Badge,
  SearchInput
} from '@/components/design-system/page-container';
import { useTranslation } from '@/components/language-provider';
import { 
  Users, 
  Plus, 
  Phone, 
  PhoneOff,
  Mail, 
  MapPin, 
  Building2,
  AlertCircle,
  Upload,
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  X
} from 'lucide-react';

const statusConfig: Record<string, { labelKey: 'statusNew' | 'statusContacted' | 'statusQuoted' | 'statusSold' | 'statusNotInterested'; color: string; icon: any }> = {
  NEW: { labelKey: 'statusNew', color: 'info', icon: AlertCircle },
  CONTACTED: { labelKey: 'statusContacted', color: 'warning', icon: Phone },
  QUOTED: { labelKey: 'statusQuoted', color: 'default', icon: CheckCircle2 },
  SALE_MADE: { labelKey: 'statusSold', color: 'success', icon: CheckCircle2 },
  NOT_INTERESTED: { labelKey: 'statusNotInterested', color: 'error', icon: PhoneOff },
};

export default function LeadsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLead, setNewLead] = useState({
    companyName: '',
    contactName: '',
    phone: '',
    email: '',
    city: '',
    niche: '',
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/leads');
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.contactName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.niche?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone?.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'NEW').length,
    contacted: leads.filter(l => l.status === 'CONTACTED').length,
    quoted: leads.filter(l => l.status === 'QUOTED').length,
    sold: leads.filter(l => l.status === 'SALE_MADE').length,
  };

  const handleAddLead = async () => {
    if (!newLead.companyName || !newLead.phone) return;
    
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead),
      });

      if (response.ok) {
        const savedLead = await response.json();
        setLeads([savedLead, ...leads]);
        setNewLead({ companyName: '', contactName: '', phone: '', email: '', city: '', niche: '' });
        setShowAddModal(false);
      }
    } catch (error) {
      console.error('Failed to add lead:', error);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title={t('leads')}
        subtitle={t('dashboard')}
        icon={<Users className="w-6 h-6 text-white" />}
        action={
          <div className="flex gap-2">
            <ActionButton href="/dashboard" variant="secondary" icon={<ArrowLeft className="w-4 h-4" />}>
              {t('dashboard')}
            </ActionButton>
            <ActionButton onClick={() => setShowAddModal(true)} variant="primary" icon={<Plus className="w-4 h-4" />}>
              {t('addLead')}
            </ActionButton>
            <ActionButton href="/leads/import" variant="secondary" icon={<Upload className="w-4 h-4" />}>
              {t('importLeads')}
            </ActionButton>
          </div>
        }
        stats={[
          { label: t('totalLeads'), value: stats.total.toString() },
          { label: t('newThisWeek'), value: `+${stats.new}`, trend: '+12%' },
          { label: t('conversionRate'), value: '24%', trend: '+5%' },
          { label: t('toCall'), value: stats.new.toString() },
        ]}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard label={t('total')} value={stats.total} icon={<Users className="w-5 h-5" />} color="orange" />
          <StatCard label={t('new')} value={stats.new} icon={<AlertCircle className="w-5 h-5" />} color="blue" />
          <StatCard label={t('contacted')} value={stats.contacted} icon={<Phone className="w-5 h-5" />} color="yellow" />
          <StatCard label={t('quoted')} value={stats.quoted} icon={<CheckCircle2 className="w-5 h-5" />} color="purple" />
          <StatCard label={t('sold')} value={stats.sold} icon={<CheckCircle2 className="w-5 h-5" />} color="green" trend="up" trendValue="+2" />
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchInput
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['ALL', 'NEW', 'CONTACTED', 'QUOTED', 'SALE_MADE'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  statusFilter === status
                    ? 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white shadow-lg shadow-orange-500/30'
                    : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-orange-300'
                }`}
              >
                {status === 'ALL' ? t('statusAll') : t(statusConfig[status]?.labelKey || 'statusNew')}
                {status !== 'ALL' && (
                  <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${statusFilter === status ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-700'}`}>
                    {status === 'NEW' ? stats.new : status === 'CONTACTED' ? stats.contacted : status === 'QUOTED' ? stats.quoted : stats.sold}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Leads Grid */}
        {loading ? (
          <SmartCard className="p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">{t('loading')}</p>
            </div>
          </SmartCard>
        ) : filteredLeads.length === 0 ? (
          <SmartCard>
            <EmptyState
              icon={<Users className="w-10 h-10" />}
              title={t('noLeadsFound')}
              description={searchQuery ? t('search') + "..." : t('noLeadsDescription')}
              action={
                <ActionButton onClick={() => setShowAddModal(true)} variant="primary" icon={<Plus className="w-4 h-4" />}>
                  {t('addFirstLead')}
                </ActionButton>
              }
            />
          </SmartCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredLeads.map((lead) => {
              const status = statusConfig[lead.status];
              const StatusIcon = status?.icon || AlertCircle;
              
              return (
                <SmartCard 
                  key={lead.id} 
                  className={`group cursor-pointer ${lead.doNotCall ? 'border-rose-200 dark:border-rose-500/30 bg-rose-50/50 dark:bg-rose-500/5' : ''}`}
                  onClick={() => router.push(`/leads/${lead.id}`)}
                >
                  <div className="p-5">
                    {/* DNCM Warning */}
                    {lead.doNotCall && (
                      <div className="mb-4 p-3 bg-rose-100 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl">
                        <p className="text-rose-700 dark:text-rose-400 font-semibold text-sm flex items-center gap-2">
                          <PhoneOff className="w-4 h-4" />
                          DNCM - {t('dncm')}
                        </p>
                      </div>
                    )}
                    
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${lead.doNotCall ? 'bg-rose-100 dark:bg-rose-500/20' : 'bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-500/20 dark:to-orange-600/20'}`}>
                          <Building2 className={`w-6 h-6 ${lead.doNotCall ? 'text-rose-600 dark:text-rose-400' : 'text-orange-600 dark:text-orange-400'}`} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-slate-900 dark:text-white truncate">{lead.companyName}</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{lead.contactName || '-'}</p>
                        </div>
                      </div>
                      <Badge variant={status?.color as any || 'default'}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {t(status?.labelKey || 'statusNew')}
                      </Badge>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <a href={`tel:${lead.phone}`} onClick={(e) => e.stopPropagation()} className="text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 truncate">
                          {lead.phone}
                        </a>
                      </div>
                      {lead.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600 dark:text-slate-400 truncate">{lead.email}</span>
                        </div>
                      )}
                      {lead.city && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600 dark:text-slate-400">{lead.city}</span>
                          {lead.niche && (
                            <span className="text-slate-400 dark:text-slate-500">• {lead.niche}</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                          <Calendar className="w-3 h-3" />
                          {new Date(lead.createdAt).toLocaleDateString('nl-BE')}
                        </span>
                      </div>
                      <span className="flex items-center gap-1 text-sm font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 px-3 py-1.5 rounded-lg">
                        {t('view')}
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </SmartCard>
              );
            })}
          </div>
        )}
      </main>

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <SmartCard className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('addLead')}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t('addFirstLead')}</p>
                  </div>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{t('companyName')} *</label>
                  <input type="text" value={newLead.companyName} onChange={(e) => setNewLead({...newLead, companyName: e.target.value})} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{t('contactName')}</label>
                  <input type="text" value={newLead.contactName} onChange={(e) => setNewLead({...newLead, contactName: e.target.value})} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{t('phone')} *</label>
                  <input type="text" value={newLead.phone} onChange={(e) => setNewLead({...newLead, phone: e.target.value})} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{t('email')}</label>
                  <input type="email" value={newLead.email} onChange={(e) => setNewLead({...newLead, email: e.target.value})} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{t('city')}</label>
                  <input type="text" value={newLead.city} onChange={(e) => setNewLead({...newLead, city: e.target.value})} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{t('niche')}</label>
                  <input type="text" value={newLead.niche} onChange={(e) => setNewLead({...newLead, niche: e.target.value})} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30" />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors">
                  {t('cancel')}
                </button>
                <button onClick={handleAddLead} disabled={!newLead.companyName || !newLead.phone} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-xl hover:shadow-lg disabled:opacity-50 transition-all">
                  {t('save')}
                </button>
              </div>
            </div>
          </SmartCard>
        </div>
      )}
    </PageContainer>
  );
}
