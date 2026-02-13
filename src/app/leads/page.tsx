'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PremiumLayout } from '@/components/design-system/premium-layout';
import { 
  Plus, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  MapPin, 
  Building2,
  Edit,
  Trash2,
  CheckCircle2,
  X,
  Download,
  ChevronDown,
  Loader2,
  AlertCircle,
  Target,
  LayoutGrid,
  List,
  Calendar,
  MoreHorizontal,
  XCircle,
  FileText,
  Eye
} from 'lucide-react';

interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  city: string;
  status: string;
  lastContact: string;
  niche?: string;
}

// Generate 156 realistic leads
const CITIES = ['Antwerpen', 'Gent', 'Brussel', 'Leuven', 'Brugge', 'Hasselt', 'Mechelen', 'Aalst', 'Sint-Niklaas', 'Kortrijk', 'Oostende', 'Genk', 'Roeselare', 'Turnhout', 'Mechelen', 'Lier', 'Heist-op-den-Berg', 'Herentals', 'Geel', 'Lokeren'];
const FIRST_NAMES = ['Jan', 'Maria', 'Peter', 'Anna', 'Luc', 'Sarah', 'Marc', 'Emma', 'Bart', 'Lisa', 'Tom', 'Sophie', 'Koen', 'Laura', 'Wim', 'Eline', 'Dries', 'Nina', 'Jef', 'Sofie'];
const LAST_NAMES = ['Peeters', 'Janssens', 'Maes', 'Jacobs', 'Mertens', 'Willems', 'Claes', 'Goossens', 'Wouters', 'De Smet', 'Van den Berg', 'Dubois', 'Lambert', 'Martens', 'Vermeulen', 'Bosch', 'Vandenberghe', 'Desmet', 'Lemmens', 'De Vos'];
const NICHES = ['Retail', 'Horeca', 'IT', 'Healthcare', 'Construction', 'Finance', 'Food', 'Beauty', 'Automotive', 'Services', 'Legal', 'Education', 'Manufacturing', 'Transport'];
const STATUSES = ['NEW', 'NEW', 'NEW', 'CONTACTED', 'CONTACTED', 'OFFER_SENT', 'FOLLOW_UP', 'CONVERTED'];

function generateLeads(count: number): Lead[] {
  const leads: Lead[] = [];
  for (let i = 1; i <= count; i++) {
    const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const city = CITIES[Math.floor(Math.random() * CITIES.length)];
    const niche = NICHES[Math.floor(Math.random() * NICHES.length)];
    const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
    const companyName = `${lastName} ${['BV', 'NV', 'Solutions', 'Group', 'Services'][Math.floor(Math.random() * 5)]}`;
    const phone = `04${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)} ${Math.floor(Math.random() * 100).toString().padStart(2, '0')} ${Math.floor(Math.random() * 100).toString().padStart(2, '0')} ${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`;
    const daysAgo = Math.floor(Math.random() * 30);
    const lastContact = daysAgo === 0 ? 'Vandaag' : daysAgo === 1 ? 'Gisteren' : daysAgo < 7 ? `${daysAgo} dagen geleden` : daysAgo < 14 ? '1 week geleden' : '2+ weken geleden';
    
    leads.push({
      id: i.toString(),
      companyName,
      contactName: `${firstName} ${lastName}`,
      phone,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${companyName.toLowerCase().replace(/[^a-z]/g, '')}.be`,
      city,
      status,
      lastContact,
      niche
    });
  }
  return leads;
}

const MOCK_LEADS: Lead[] = generateLeads(156);

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string; borderColor: string }> = {
  NEW: { label: 'Nieuw', color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  CONTACTED: { label: 'Gecontacteerd', color: 'text-yellow-700', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
  OFFER_SENT: { label: 'Offerte Verstuurd', color: 'text-purple-700', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
  FOLLOW_UP: { label: 'Follow-up', color: 'text-orange-700', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
  CONVERTED: { label: 'Omgezet', color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
  LOST: { label: 'Verloren', color: 'text-red-700', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
};

const NicheIcons: Record<string, string> = {
  'Retail': '🏪',
  'Horeca': '🍽️',
  'IT': '💻',
  'Healthcare': '🏥',
  'Construction': '🏗️',
  'Finance': '💰',
  'Food': '🍕',
  'Beauty': '💅',
  'Automotive': '🚗',
  'Services': '🛠️',
  'Legal': '⚖️',
  'Education': '🎓',
  'Manufacturing': '🏭',
  'Transport': '🚚',
};

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  // Modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);

  // Stats
  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'NEW').length,
    contacted: leads.filter(l => l.status === 'CONTACTED').length,
    offers: leads.filter(l => l.status === 'OFFER_SENT').length,
    converted: leads.filter(l => l.status === 'CONVERTED').length,
  };

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.contactName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone?.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Toggle lead selection
  const toggleSelection = (id: string) => {
    setSelectedLeads(prev => 
      prev.includes(id) 
        ? prev.filter(lid => lid !== id)
        : [...prev, id]
    );
  };

  // Select all
  const selectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(l => l.id));
    }
  };

  // Edit lead
  const openEditModal = (lead: Lead) => {
    setEditingLead({ ...lead });
    setShowEditModal(true);
  };

  const saveEdit = () => {
    if (!editingLead) return;
    setLeads(prev => prev.map(l => l.id === editingLead.id ? editingLead : l));
    setShowEditModal(false);
    setEditingLead(null);
  };

  // Delete lead
  const openDeleteModal = (lead: Lead) => {
    setDeletingLead(lead);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!deletingLead) return;
    setLeads(prev => prev.filter(l => l.id !== deletingLead.id));
    setShowDeleteModal(false);
    setDeletingLead(null);
  };

  // Make offer - open in new tab
  const makeOffer = (leadId: string) => {
    window.open(`/calculator?lead=${leadId}`, '_blank');
  };

  if (loading) {
    return (
      <PremiumLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      </PremiumLayout>
    );
  }

  return (
    <PremiumLayout user={{ name: 'Lenny De K.' }}>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-500 mt-1">Beheer en volg al je leads ({stats.total} totaal)</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/leads/import"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Importeren
          </Link>
          <Link
            href="/calculator"
            className="flex items-center gap-2 px-4 py-2 text-white bg-gradient-to-r from-orange-500 to-pink-600 rounded-lg hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Nieuwe Lead
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <p className="text-sm text-gray-500">Totaal</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 hover:shadow-md transition-shadow">
          <p className="text-sm text-blue-600 font-medium">Nieuw</p>
          <p className="text-2xl font-bold text-blue-900">{stats.new}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4 hover:shadow-md transition-shadow">
          <p className="text-sm text-yellow-600 font-medium">Gecontacteerd</p>
          <p className="text-2xl font-bold text-yellow-900">{stats.contacted}</p>
        </div>
        <div className="bg-purple-50 rounded-xl border border-purple-200 p-4 hover:shadow-md transition-shadow">
          <p className="text-sm text-purple-600 font-medium">Offerte</p>
          <p className="text-2xl font-bold text-purple-900">{stats.offers}</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4 hover:shadow-md transition-shadow">
          <p className="text-sm text-green-600 font-medium">Omgezet</p>
          <p className="text-2xl font-bold text-green-900">{stats.converted}</p>
        </div>
      </div>

      {/* Filters & Search & View Toggle */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Zoek op bedrijf, contact, stad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            >
              <option value="ALL">Alle statussen</option>
              <option value="NEW">Nieuw</option>
              <option value="CONTACTED">Gecontacteerd</option>
              <option value="OFFER_SENT">Offerte Verstuurd</option>
              <option value="FOLLOW_UP">Follow-up</option>
              <option value="CONVERTED">Omgezet</option>
              <option value="LOST">Verloren</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                viewMode === 'list' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="text-sm font-medium">Lijst</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                viewMode === 'grid' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="text-sm font-medium">Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-500">
        Toont {filteredLeads.length} van {stats.total} leads
      </div>

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                    onChange={selectAll}
                    className="w-4 h-4 text-orange-600 rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Bedrijf</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Locatie</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Laatste Contact</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLeads.map((lead) => {
                const status = STATUS_CONFIG[lead.status] || STATUS_CONFIG.NEW;
                return (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedLeads.includes(lead.id)}
                        onChange={() => toggleSelection(lead.id)}
                        className="w-4 h-4 text-orange-600 rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold">
                          {lead.companyName[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{lead.companyName}</p>
                          {lead.niche && (
                            <span className="text-xs text-gray-500">{lead.niche}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900">{lead.contactName}</p>
                        <p className="text-xs text-gray-500">{lead.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {lead.city}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {lead.lastContact}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <a
                          href={`tel:${lead.phone}`}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Bellen"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => makeOffer(lead.id)}
                          className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Offerte maken"
                        >
                          <Target className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openEditModal(lead)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Bewerken"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(lead)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Verwijderen"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredLeads.length === 0 && (
            <div className="p-12 text-center">
              <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Geen leads gevonden</h3>
              <Link
                href="/calculator"
                className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Nieuwe Lead
              </Link>
            </div>
          )}
        </div>
      )}

      {/* GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredLeads.map((lead) => {
            const status = STATUS_CONFIG[lead.status] || STATUS_CONFIG.NEW;
            const icon = NicheIcons[lead.niche || ''] || '🏢';
            return (
              <div key={lead.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all group">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center text-2xl">
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 truncate">{lead.companyName}</h3>
                      <p className="text-xs text-gray-500">{lead.niche}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color} border ${status.borderColor}`}>
                    {status.label}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{lead.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{lead.city}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{lead.lastContact}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-3 gap-2">
                  <a
                    href={`tel:${lead.phone}`}
                    className="flex items-center justify-center gap-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                  >
                    <Phone className="w-4 h-4" />
                    Bellen
                  </a>
                  <button
                    onClick={() => makeOffer(lead.id)}
                    className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                  >
                    <Calendar className="w-4 h-4" />
                    Afspraak
                  </button>
                  <button
                    onClick={() => makeOffer(lead.id)}
                    className="flex items-center justify-center gap-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                  >
                    <Phone className="w-4 h-4" />
                    Bel nu
                  </button>
                </div>

                {/* Secondary Actions */}
                <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-gray-100">
                  <button 
                    onClick={() => openEditModal(lead)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Bewerken
                  </button>
                  <button 
                    onClick={() => openDeleteModal(lead)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Verwijder
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State for Grid */}
      {viewMode === 'grid' && filteredLeads.length === 0 && (
        <div className="p-12 text-center">
          <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Geen leads gevonden</h3>
          <Link
            href="/calculator"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nieuwe Lead
          </Link>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedLeads.length > 0 && (
        <div className="fixed bottom-6 left-[280px] right-6 bg-gray-900 text-white rounded-xl p-4 flex items-center justify-between shadow-lg">
          <p className="text-sm">
            <span className="font-semibold">{selectedLeads.length}</span> leads geselecteerd
          </p>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm font-medium bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
              Exporteren
            </button>
            <button className="px-4 py-2 text-sm font-medium bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
              Status wijzigen
            </button>
            <button className="px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 rounded-lg transition-colors">
              Verwijderen
            </button>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && editingLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Lead Bewerken</h2>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bedrijfsnaam</label>
                <input
                  type="text"
                  value={editingLead.companyName}
                  onChange={(e) => setEditingLead({...editingLead, companyName: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contactpersoon</label>
                <input
                  type="text"
                  value={editingLead.contactName}
                  onChange={(e) => setEditingLead({...editingLead, contactName: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefoon</label>
                <input
                  type="text"
                  value={editingLead.phone}
                  onChange={(e) => setEditingLead({...editingLead, phone: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editingLead.email}
                  onChange={(e) => setEditingLead({...editingLead, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stad</label>
                <input
                  type="text"
                  value={editingLead.city}
                  onChange={(e) => setEditingLead({...editingLead, city: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editingLead.status}
                  onChange={(e) => setEditingLead({...editingLead, status: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="NEW">Nieuw</option>
                  <option value="CONTACTED">Gecontacteerd</option>
                  <option value="OFFER_SENT">Offerte Verstuurd</option>
                  <option value="FOLLOW_UP">Follow-up</option>
                  <option value="CONVERTED">Omgezet</option>
                  <option value="LOST">Verloren</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button 
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Annuleren
              </button>
              <button 
                onClick={saveEdit}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Opslaan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && deletingLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Lead Verwijderen</h2>
              <p className="text-gray-600 mb-6">
                Weet je zeker dat je <strong>{deletingLead.companyName}</strong> wilt verwijderen? 
                Deze actie kan niet ongedaan worden gemaakt.
              </p>
              <div className="flex justify-center gap-3">
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Annuleren
                </button>
                <button 
                  onClick={confirmDelete}
                  className="px-6 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg transition-colors"
                >
                  Verwijderen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PremiumLayout>
  );
}
