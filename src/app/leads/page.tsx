'use client';

import { useState } from 'react';
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
import { 
  Users, 
  Plus, 
  Phone, 
  PhoneOff,
  Mail, 
  MapPin, 
  Building2,
  TrendingUp,
  MoreVertical,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Upload,
  User,
  Search,
  Filter,
  ArrowRight,
  ArrowLeft,
  X
} from 'lucide-react';

// Mock data
const mockLeads = [
  { id: '1', companyName: 'Tech Solutions BV', contactName: 'Jan Janssen', email: 'jan@tech.nl', phone: '+32 471 23 45 67', city: 'Antwerpen', status: 'NEW', niche: 'Technologie', lastContact: null, calls: 0, doNotCall: false },
  { id: '2', companyName: 'Bakkerij De Lekkernij', contactName: 'Maria Peeters', email: 'info@delekkernij.be', phone: '+32 485 67 89 01', city: 'Brussel', status: 'CONTACTED', niche: 'Horeca', lastContact: '2025-02-08', calls: 2, doNotCall: false },
  { id: '3', companyName: 'Constructie Groep', contactName: 'Peter Willems', email: 'peter@constructie.be', phone: '+32 496 12 34 56', city: 'Gent', status: 'QUOTED', niche: 'Bouw', lastContact: '2025-02-07', calls: 5, doNotCall: false },
  { id: '4', companyName: 'Fashion Store', contactName: 'Lisa Dubois', email: 'lisa@fashion.be', phone: '+32 477 88 99 00', city: 'Luik', status: 'SALE_MADE', niche: 'Retail', lastContact: '2025-02-06', calls: 8, doNotCall: false },
  { id: '5', companyName: 'Auto Garage Fast', contactName: 'Tom Vermeer', email: 'tom@fastgarage.be', phone: '+32 468 11 22 33', city: 'Hasselt', status: 'NEW', niche: 'Automotive', lastContact: null, calls: 0, doNotCall: false },
];

const statusConfig = {
  NEW: { label: 'Nieuw', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: AlertCircle },
  CONTACTED: { label: 'Gecontacteerd', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Phone },
  QUOTED: { label: 'Offerte', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: CheckCircle2 },
  SALE_MADE: { label: 'Verkocht', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle2 },
  NOT_INTERESTED: { label: 'Geen Interesse', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
};

export default function LeadsPage() {
  const [leads, setLeads] = useState(mockLeads);
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

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.niche.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Stats
  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'NEW').length,
    contacted: leads.filter(l => l.status === 'CONTACTED').length,
    quoted: leads.filter(l => l.status === 'QUOTED').length,
    sold: leads.filter(l => l.status === 'SALE_MADE').length,
  };

  const handleAddLead = () => {
    if (!newLead.contactName || !newLead.phone) return;
    
    const lead = {
      id: Date.now().toString(),
      companyName: newLead.companyName || 'Onbekend Bedrijf',
      contactName: newLead.contactName,
      email: newLead.email || '',
      phone: newLead.phone,
      city: newLead.city || '',
      status: 'NEW',
      niche: newLead.niche || '',
      lastContact: null,
      calls: 0,
      doNotCall: false,
    };
    
    setLeads([lead, ...leads]);
    setNewLead({ companyName: '', contactName: '', phone: '', email: '', city: '', niche: '' });
    setShowAddModal(false);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Mijn Leads"
        subtitle="Beheer en converteer je leads naar klanten"
        icon={<Users className="w-6 h-6 text-white" />}
        action={
          <div className="flex gap-2">
            <ActionButton href="/dashboard" variant="secondary" icon={<ArrowLeft className="w-4 h-4" />}>
              Dashboard
            </ActionButton>
            <ActionButton onClick={() => setShowAddModal(true)} variant="primary" icon={<Plus className="w-4 h-4" />}>
              Lead Toevoegen
            </ActionButton>
            <ActionButton href="/leads/import" variant="secondary" icon={<Upload className="w-4 h-4" />}>
              Importeren
            </ActionButton>
          </div>
        }
        stats={[
          { label: 'Totaal Leads', value: stats.total.toString() },
          { label: 'Nieuw Deze Week', value: `+${stats.new}`, trend: '+12%' },
          { label: 'Conversie Rate', value: '24%', trend: '+5%' },
          { label: 'Te Bellen', value: stats.new.toString() },
        ]}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard
            label="Totaal"
            value={stats.total}
            icon={<Users className="w-5 h-5" />}
            color="orange"
          />
          <StatCard
            label="Nieuw"
            value={stats.new}
            icon={<AlertCircle className="w-5 h-5" />}
            color="blue"
          />
          <StatCard
            label="Gecontacteerd"
            value={stats.contacted}
            icon={<Phone className="w-5 h-5" />}
            color="yellow"
          />
          <StatCard
            label="Offerte"
            value={stats.quoted}
            icon={<CheckCircle2 className="w-5 h-5" />}
            color="purple"
          />
          <StatCard
            label="Verkocht"
            value={stats.sold}
            icon={<CheckCircle2 className="w-5 h-5" />}
            color="green"
            trend="up"
            trendValue="+2"
          />
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchInput
              placeholder="Zoek op bedrijf, contact, stad of telefoon..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['ALL', 'NEW', 'CONTACTED', 'QUOTED', 'SALE_MADE'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  statusFilter === status
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'
                }`}
              >
                {status === 'ALL' ? 'Alle' : statusConfig[status as keyof typeof statusConfig]?.label || status}
                {status !== 'ALL' && (
                  <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                    statusFilter === status ? 'bg-white/20' : 'bg-gray-100'
                  }`}>
                    {status === 'NEW' ? stats.new : 
                     status === 'CONTACTED' ? stats.contacted :
                     status === 'QUOTED' ? stats.quoted :
                     status === 'SALE_MADE' ? stats.sold : stats.total}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Leads Grid */}
        {filteredLeads.length === 0 ? (
          <SmartCard>
            <EmptyState
              icon={<Users className="w-10 h-10" />}
              title="Geen leads gevonden"
              description={searchQuery ? "Pas je zoekopdracht aan." : "Voeg je eerste lead toe om te beginnen."}
              action={
                <ActionButton onClick={() => setShowAddModal(true)} variant="primary" icon={<Plus className="w-4 h-4" />}>
                  Lead Toevoegen
                </ActionButton>
              }
            />
          </SmartCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredLeads.map((lead) => {
              const status = statusConfig[lead.status as keyof typeof statusConfig];
              const StatusIcon = status.icon;
              
              return (
                <SmartCard key={lead.id} className={`group hover:border-orange-300 ${lead.doNotCall ? 'border-rose-300 bg-rose-50/30' : ''}`}>
                  <div className="p-5">
                    {/* DNCM Warning Banner */}
                    {lead.doNotCall && (
                      <div className="mb-4 p-3 bg-rose-100 border border-rose-200 rounded-xl">
                        <p className="text-rose-800 font-medium text-sm flex items-center gap-2">
                          <PhoneOff className="w-4 h-4" />
                          DNCM - Niet Bellen (GDPR)
                        </p>
                      </div>
                    )}
                    
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${lead.doNotCall ? 'bg-rose-100' : 'bg-gradient-to-br from-orange-100 to-orange-200'}`}>
                          <Building2 className={`w-6 h-6 ${lead.doNotCall ? 'text-rose-600' : 'text-orange-600'}`} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{lead.companyName}</h3>
                          <p className="text-sm text-gray-500">{lead.contactName}</p>
                        </div>
                      </div>
                      <Badge variant={
                        lead.status === 'NEW' ? 'info' :
                        lead.status === 'CONTACTED' ? 'warning' :
                        lead.status === 'QUOTED' ? 'default' :
                        lead.status === 'SALE_MADE' ? 'success' : 'error'
                      }>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {status.label}
                      </Badge>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <a href={`tel:${lead.phone}`} className="text-gray-700 hover:text-orange-600 truncate">
                          {lead.phone}
                        </a>
                      </div>
                      {lead.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-600 truncate">{lead.email}</span>
                        </div>
                      )}
                      {lead.city && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-600">{lead.city}</span>
                          {lead.niche && (
                            <span className="text-gray-400">• {lead.niche}</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        {lead.calls > 0 ? (
                          <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg">
                            <Phone className="w-3 h-3" />
                            {lead.calls}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">
                            <AlertCircle className="w-3 h-3" />
                            Nog niet gebeld
                          </span>
                        )}
                        {lead.lastContact && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(lead.lastContact).toLocaleDateString('nl-BE')}
                          </span>
                        )}
                      </div>
                      <a
                        href={`/call-center?lead=${lead.id}`}
                        className="flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        {lead.status === 'NEW' ? 'Bellen' : 'Openen'}
                        <ArrowRight className="w-4 h-4" />
                      </a>
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <SmartCard className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Plus className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Nieuwe Lead</h2>
                    <p className="text-sm text-gray-500">Voeg een lead handmatig toe</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Required Fields */}
                <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                  <p className="text-sm font-medium text-orange-800 mb-3">Verplichte velden *</p>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contactpersoon *
                      </label>
                      <input
                        type="text"
                        value={newLead.contactName}
                        onChange={(e) => setNewLead({ ...newLead, contactName: e.target.value })}
                        placeholder="bv. Jan Janssen"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefoonnummer *
                      </label>
                      <input
                        type="tel"
                        value={newLead.phone}
                        onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                        placeholder="bv. 0471 23 45 67"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Optional Fields */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm font-medium text-gray-600 mb-3">Optionele velden</p>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bedrijfsnaam
                      </label>
                      <input
                        type="text"
                        value={newLead.companyName}
                        onChange={(e) => setNewLead({ ...newLead, companyName: e.target.value })}
                        placeholder="bv. Tech Solutions BV"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={newLead.email}
                        onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                        placeholder="bv. jan@bedrijf.be"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Stad
                        </label>
                        <input
                          type="text"
                          value={newLead.city}
                          onChange={(e) => setNewLead({ ...newLead, city: e.target.value })}
                          placeholder="bv. Antwerpen"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Branche/Niche
                        </label>
                        <input
                          type="text"
                          value={newLead.niche}
                          onChange={(e) => setNewLead({ ...newLead, niche: e.target.value })}
                          placeholder="bv. Technologie"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Annuleren
                </button>
                <button
                  onClick={handleAddLead}
                  disabled={!newLead.contactName || !newLead.phone}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-lg rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Lead Opslaan
                </button>
              </div>
            </div>
          </SmartCard>
        </div>
      )}
    </PageContainer>
  );
}
