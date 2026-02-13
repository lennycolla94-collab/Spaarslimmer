'use client';

import { useState } from 'react';
import { PremiumLayout } from '@/components/design-system/premium-layout';
import { 
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  ArrowUpDown,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  PauseCircle,
  Edit3,
  Trash2,
  Wallet,
  ArrowRight,
  ChevronDown,
  LayoutGrid,
  List,
  FileText,
  BarChart3
} from 'lucide-react';

// Mock data voor maandelijkse fidelity fees
const FIDELITY_CLIENTS = [
  {
    id: '1',
    companyName: 'Bakkerij De Lekkernij',
    contactName: 'Maria Peeters',
    monthlyFee: 45,
    startDate: '2024-01-15',
    status: 'ACTIVE',
    totalEarned: 540,
    lastPayment: '2025-02-01',
    contractDuration: 14,
    products: ['Internet', 'TV', '2x Mobiel'],
    notes: 'TeVreden klant, altijd op tijd'
  },
  {
    id: '2',
    companyName: 'Tech Solutions BV',
    contactName: 'Jan Janssen',
    monthlyFee: 89,
    startDate: '2024-03-20',
    status: 'ACTIVE',
    totalEarned: 801,
    lastPayment: '2025-02-01',
    contractDuration: 12,
    products: ['Giga Internet', 'TV Plus', '4x Mobiel'],
    notes: 'Groot account, upsell mogelijk'
  },
  {
    id: '3',
    companyName: 'NecmiCuts',
    contactName: 'Necmi Yildiz',
    monthlyFee: 32,
    startDate: '2024-06-10',
    status: 'ACTIVE',
    totalEarned: 224,
    lastPayment: '2025-02-01',
    contractDuration: 7,
    products: ['Internet', 'Mobiel'],
    notes: ''
  },
  {
    id: '4',
    companyName: 'Fashion Store',
    contactName: 'Lisa Dubois',
    monthlyFee: 28,
    startDate: '2024-08-05',
    status: 'PAUSED',
    totalEarned: 168,
    lastPayment: '2024-12-01',
    contractDuration: 4,
    products: ['Internet', 'Mobiel'],
    notes: 'Tijdelijk gepauzeerd - seizoenswerk'
  },
  {
    id: '5',
    companyName: 'Constructie Groep',
    contactName: 'Peter Willems',
    monthlyFee: 67,
    startDate: '2024-02-28',
    status: 'ACTIVE',
    totalEarned: 804,
    lastPayment: '2025-02-01',
    contractDuration: 12,
    products: ['Zen Internet', 'TV', '3x Mobiel'],
    notes: 'Langlopend contract'
  },
  {
    id: '6',
    companyName: 'Dental Care Plus',
    contactName: 'Dr. Sarah Vans',
    monthlyFee: 54,
    startDate: '2024-09-15',
    status: 'ACTIVE',
    totalEarned: 270,
    lastPayment: '2025-02-01',
    contractDuration: 5,
    products: ['Internet', 'TV Life', '2x Mobiel'],
    notes: ''
  },
  {
    id: '7',
    companyName: 'AutoService Quick',
    contactName: 'Tom Vermeer',
    monthlyFee: 41,
    startDate: '2024-04-12',
    status: 'CANCELLED',
    totalEarned: 328,
    lastPayment: '2024-10-01',
    contractDuration: 6,
    products: ['Internet', 'Mobiel'],
    notes: 'Gestopt - te duur'
  },
  {
    id: '8',
    companyName: 'Beauty Lounge',
    contactName: 'Emma Claes',
    monthlyFee: 38,
    startDate: '2024-11-20',
    status: 'ACTIVE',
    totalEarned: 76,
    lastPayment: '2025-02-01',
    contractDuration: 2,
    products: ['Internet', 'Mobiel'],
    notes: 'Nieuwe klant'
  },
];

const STATUS_CONFIG = {
  ACTIVE: { label: 'Actief', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle2 },
  PAUSED: { label: 'Gepauzeerd', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: PauseCircle },
  CANCELLED: { label: 'Gestopt', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
};

export default function FidelityPage() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'monthlyFee' | 'totalEarned' | 'startDate'>('monthlyFee');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedClients, setSelectedClients] = useState<string[]>([]);

  // Stats
  const stats = {
    totalClients: FIDELITY_CLIENTS.filter(c => c.status === 'ACTIVE').length,
    totalMonthly: FIDELITY_CLIENTS.filter(c => c.status === 'ACTIVE').reduce((sum, c) => sum + c.monthlyFee, 0),
    totalEarned: FIDELITY_CLIENTS.reduce((sum, c) => sum + c.totalEarned, 0),
    yearlyProjection: FIDELITY_CLIENTS.filter(c => c.status === 'ACTIVE').reduce((sum, c) => sum + c.monthlyFee, 0) * 12,
  };

  // Filter & sort
  const filteredClients = FIDELITY_CLIENTS.filter(client => {
    const matchesSearch = 
      client.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.contactName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    const multiplier = sortOrder === 'asc' ? 1 : -1;
    if (sortBy === 'monthlyFee') return (a.monthlyFee - b.monthlyFee) * multiplier;
    if (sortBy === 'totalEarned') return (a.totalEarned - b.totalEarned) * multiplier;
    return (new Date(a.startDate).getTime() - new Date(b.startDate).getTime()) * multiplier;
  });

  const toggleSelection = (id: string) => {
    setSelectedClients(prev => 
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedClients.length === filteredClients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(filteredClients.map(c => c.id));
    }
  };

  return (
    <PremiumLayout user={{ name: 'Lenny De K.' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fidelity - Passief Inkomen</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Maandelijkse terugkerende fees van je klanten</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all">
          <Plus className="w-4 h-4" />
          Nieuwe Klant
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-200 dark:border-blue-500/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-blue-600 dark:text-blue-400">Actieve Klanten</span>
          </div>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.totalClients}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-500/10 rounded-xl border border-green-200 dark:border-green-500/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-sm text-green-600 dark:text-green-400">Maandelijks</span>
          </div>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100">€{stats.totalMonthly}</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-500/10 rounded-xl border border-purple-200 dark:border-purple-500/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="text-sm text-purple-600 dark:text-purple-400">Totaal Verdiend</span>
          </div>
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">€{stats.totalEarned.toLocaleString()}</p>
        </div>
        <div className="bg-orange-50 dark:bg-orange-500/10 rounded-xl border border-orange-200 dark:border-orange-500/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <span className="text-sm text-orange-600 dark:text-orange-400">Jaarlijks</span>
          </div>
          <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">€{stats.yearlyProjection.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Zoek op bedrijf of contact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:text-white"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:text-white"
          >
            <option value="ALL">Alle statussen</option>
            <option value="ACTIVE">Actief</option>
            <option value="PAUSED">Gepauzeerd</option>
            <option value="CANCELLED">Gestopt</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:text-white"
          >
            <option value="monthlyFee">Maandfee</option>
            <option value="totalEarned">Totaal verdiend</option>
            <option value="startDate">Startdatum</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          >
            <ArrowUpDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div className="flex items-center bg-gray-100 dark:bg-slate-900 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        {filteredClients.length} klanten gevonden
        {selectedClients.length > 0 && ` • ${selectedClients.length} geselecteerd`}
      </div>

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left w-10">
                  <input
                    type="checkbox"
                    checked={selectedClients.length === filteredClients.length && filteredClients.length > 0}
                    onChange={selectAll}
                    className="w-4 h-4 text-orange-600 rounded border-gray-300 dark:border-slate-600 dark:bg-slate-800"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Klant</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Maandfee</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Totaal Verdiend</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Contract</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Laatste Betaling</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {filteredClients.map((client) => {
                const status = STATUS_CONFIG[client.status as keyof typeof STATUS_CONFIG];
                const StatusIcon = status.icon;
                return (
                  <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedClients.includes(client.id)}
                        onChange={() => toggleSelection(client.id)}
                        className="w-4 h-4 text-orange-600 rounded border-gray-300 dark:border-slate-600 dark:bg-slate-800"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold">
                          {client.companyName[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{client.companyName}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{client.contactName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900 dark:text-white">€{client.monthlyFee}/maand</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{client.products.join(', ')}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-green-600">€{client.totalEarned.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{client.contractDuration} maanden</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(client.startDate).toLocaleDateString('nl-BE')}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(client.lastPayment).toLocaleDateString('nl-BE')}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/20 rounded-lg transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredClients.map((client) => {
            const status = STATUS_CONFIG[client.status as keyof typeof STATUS_CONFIG];
            const StatusIcon = status.icon;
            return (
              <div key={client.id} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {client.companyName[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{client.companyName}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{client.contactName}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                    <StatusIcon className="w-3 h-3" />
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Maandfee</span>
                    <span className="font-bold text-gray-900 dark:text-white">€{client.monthlyFee}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Totaal verdiend</span>
                    <span className="font-bold text-green-600">€{client.totalEarned}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Contract</span>
                    <span className="text-sm text-gray-900 dark:text-white">{client.contractDuration} maanden</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Laatste betaling</span>
                    <span className="text-sm text-gray-900 dark:text-white">{new Date(client.lastPayment).toLocaleDateString('nl-BE')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-slate-700">
                  <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                    <Edit3 className="w-4 h-4" />
                    Bewerk
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors text-sm">
                    <FileText className="w-4 h-4" />
                    Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Geen klanten gevonden</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Voeg je eerste fidelity klant toe</p>
          <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">
            Nieuwe Klant Toevoegen
          </button>
        </div>
      )}

      {/* Bulk actions */}
      {selectedClients.length > 0 && (
        <div className="fixed bottom-6 left-[280px] right-6 bg-gray-900 dark:bg-slate-800 text-white rounded-xl p-4 flex items-center justify-between shadow-lg border border-gray-700 dark:border-slate-700">
          <p className="text-sm"><span className="font-semibold">{selectedClients.length}</span> klanten geselecteerd</p>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm font-medium bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
              Exporteren
            </button>
            <button className="px-4 py-2 text-sm font-medium bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
              Status wijzigen
            </button>
          </div>
        </div>
      )}
    </PremiumLayout>
  );
}
