'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PremiumLayout } from '@/components/design-system/premium-layout';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Phone, 
  Mail, 
  MapPin, 
  Building2,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Calendar,
  Target,
  Download,
  ChevronDown,
  Loader2,
  AlertCircle,
  RefreshCw,
  ArrowRight
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

// Mock data
const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    companyName: 'Bakkerij De Lekkernij',
    contactName: 'Maria Peeters',
    phone: '0472 12 34 56',
    email: 'maria@bakkerij.be',
    city: 'Aalst',
    status: 'NEW',
    lastContact: '2 dagen geleden',
    niche: 'Food'
  },
  {
    id: '2',
    companyName: 'Tech Solutions BV',
    contactName: 'Jan Janssen',
    phone: '0473 56 78 90',
    email: 'jan@techsolutions.be',
    city: 'Brussel',
    status: 'CONTACTED',
    lastContact: '1 week geleden',
    niche: 'IT'
  },
  {
    id: '3',
    companyName: 'NecmiCuts',
    contactName: 'Necmi Yildiz',
    phone: '0472 98 76 54',
    email: 'necmi@necmicuts.be',
    city: 'Aalst',
    status: 'OFFER_SENT',
    lastContact: '3 dagen geleden',
    niche: 'Beauty'
  },
  {
    id: '4',
    companyName: 'Constructie Groep',
    contactName: 'Peter Willems',
    phone: '0475 11 22 33',
    email: 'peter@constructie.be',
    city: 'Gent',
    status: 'FOLLOW_UP',
    lastContact: '5 dagen geleden',
    niche: 'Construction'
  },
  {
    id: '5',
    companyName: 'Fashion Store',
    contactName: 'Lisa Dubois',
    phone: '0476 44 55 66',
    email: 'lisa@fashion.be',
    city: 'Antwerpen',
    status: 'CONVERTED',
    lastContact: '1 dag geleden',
    niche: 'Retail'
  }
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  NEW: { label: 'Nieuw', color: 'text-blue-700', bgColor: 'bg-blue-50' },
  CONTACTED: { label: 'Gecontacteerd', color: 'text-yellow-700', bgColor: 'bg-yellow-50' },
  OFFER_SENT: { label: 'Offerte Verstuurd', color: 'text-purple-700', bgColor: 'bg-purple-50' },
  FOLLOW_UP: { label: 'Follow-up', color: 'text-orange-700', bgColor: 'bg-orange-50' },
  CONVERTED: { label: 'Omgezet', color: 'text-green-700', bgColor: 'bg-green-50' },
  LOST: { label: 'Verloren', color: 'text-red-700', bgColor: 'bg-red-50' },
};

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [useMockData, setUseMockData] = useState(false);

  // Fetch leads
  useEffect(() => {
    fetchLeads();
  }, [useMockData]);

  async function fetchLeads() {
    try {
      setLoading(true);
      setError(null);

      if (useMockData) {
        setLeads(MOCK_LEADS);
        setLoading(false);
        return;
      }

      const res = await fetch('/api/leads?limit=100');
      
      if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setLeads(data.leads || []);
    } catch (err: any) {
      console.error('Error fetching leads:', err);
      setError(err.message || 'Failed to fetch leads');
      setUseMockData(true);
      setLeads(MOCK_LEADS);
    } finally {
      setLoading(false);
    }
  }

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

  // Stats
  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'NEW').length,
    contacted: leads.filter(l => l.status === 'CONTACTED').length,
    offers: leads.filter(l => l.status === 'OFFER_SENT').length,
    converted: leads.filter(l => l.status === 'CONVERTED').length,
  };

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
          <p className="text-gray-500 mt-1">Beheer en volg al je leads</p>
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
            className="flex items-center gap-2 px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nieuwe Lead
          </Link>
        </div>
      </div>

      {/* Demo Mode Badge */}
      {useMockData && (
        <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3">
          <span className="px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded">DEMO</span>
          <p className="text-blue-700 text-sm">Je bekijkt demo data. Wijzigingen worden niet opgeslagen.</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Totaal</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
          <p className="text-sm text-blue-600">Nieuw</p>
          <p className="text-2xl font-bold text-blue-900">{stats.new}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4">
          <p className="text-sm text-yellow-600">Gecontacteerd</p>
          <p className="text-2xl font-bold text-yellow-900">{stats.contacted}</p>
        </div>
        <div className="bg-purple-50 rounded-xl border border-purple-200 p-4">
          <p className="text-sm text-purple-600">Offerte</p>
          <p className="text-2xl font-bold text-purple-900">{stats.offers}</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4">
          <p className="text-sm text-green-600">Omgezet</p>
          <p className="text-2xl font-bold text-green-900">{stats.converted}</p>
        </div>
      </div>

      {/* Filters & Search */}
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
        </div>
      </div>

      {/* Leads Table */}
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
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`tel:${lead.phone}`}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Bellen"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => router.push(`/calculator?leadId=${lead.id}`)}
                        className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Offerte maken"
                      >
                        <Target className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
            <p className="text-gray-500 mb-6">Voeg je eerste lead toe om te beginnen.</p>
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
    </PremiumLayout>
  );
}
