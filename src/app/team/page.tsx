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
  BarChart3,
  Handshake,
  Crown,
  Target,
  Award,
  Info
} from 'lucide-react';

// Persoonlijke fidelity vergoedingen (Level 0 - Jij)
const PERSONAL_RATES = [
  { product: 'Internet', rate: 0.35 },
  { product: 'Energy', rate: 0.35 },
  { product: 'Orange Mobile Child', rate: 0.25 },
  { product: 'Orange Mobile Small', rate: 0.50 },
  { product: 'Orange Mobile Medium', rate: 1.00 },
  { product: 'Orange Mobile Large', rate: 1.25 },
  { product: 'Orange Mobile Unlimited', rate: 1.50 },
  { product: 'Go Light', rate: 0.40 },
  { product: 'Go Plus', rate: 0.80 },
  { product: 'Go Intense', rate: 1.00 },
  { product: 'Go Extreme', rate: 1.75 },
  { product: 'EasyInternet@Home', rate: 0.50 },
  { product: 'Internet Everywhere', rate: 0.05 },
];

// Mock data voor maandelijkse fidelity fees
const FIDELITY_CLIENTS = [
  {
    id: '1',
    companyName: 'Bakkerij De Lekkernij',
    contactName: 'Maria Peeters',
    monthlyFee: 2.10,
    products: ['Internet', 'TV', '2x Orange Mobile Small'],
    startDate: '2024-01-15',
    status: 'ACTIVE',
    totalEarned: 29.40,
    lastPayment: '2025-02-01',
    contractDuration: 14,
    notes: 'Tevreden klant, altijd op tijd'
  },
  {
    id: '2',
    companyName: 'Tech Solutions BV',
    contactName: 'Jan Janssen',
    monthlyFee: 4.10,
    products: ['Internet', 'TV Plus', '4x Orange Mobile Medium'],
    startDate: '2024-03-20',
    status: 'ACTIVE',
    totalEarned: 36.90,
    lastPayment: '2025-02-01',
    contractDuration: 9,
    notes: 'Groot account, upsell mogelijk'
  },
  {
    id: '3',
    companyName: 'NecmiCuts',
    contactName: 'Necmi Yildiz',
    monthlyFee: 1.35,
    products: ['Internet', 'Orange Mobile Small'],
    startDate: '2024-06-10',
    status: 'ACTIVE',
    totalEarned: 9.45,
    lastPayment: '2025-02-01',
    contractDuration: 7,
    notes: ''
  },
  {
    id: '4',
    companyName: 'Fashion Store',
    contactName: 'Lisa Dubois',
    monthlyFee: 1.20,
    products: ['Internet', 'Orange Mobile Small'],
    startDate: '2024-08-05',
    status: 'PAUSED',
    totalEarned: 7.20,
    lastPayment: '2024-12-01',
    contractDuration: 6,
    notes: 'Tijdelijk gepauzeerd - seizoenswerk'
  },
  {
    id: '5',
    companyName: 'Constructie Groep',
    contactName: 'Peter Willems',
    monthlyFee: 3.60,
    products: ['Internet', 'TV', '3x Orange Mobile Medium'],
    startDate: '2024-02-28',
    status: 'ACTIVE',
    totalEarned: 43.20,
    lastPayment: '2025-02-01',
    contractDuration: 12,
    notes: 'Langlopend contract'
  },
  {
    id: '6',
    companyName: 'Dental Care Plus',
    contactName: 'Dr. Sarah Vans',
    monthlyFee: 2.70,
    products: ['Internet', 'TV Life', '2x Orange Mobile Medium'],
    startDate: '2024-09-15',
    status: 'ACTIVE',
    totalEarned: 13.50,
    lastPayment: '2025-02-01',
    contractDuration: 5,
    notes: ''
  },
];

const STATUS_CONFIG = {
  ACTIVE: { label: 'Actief', color: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30', icon: CheckCircle2 },
  PAUSED: { label: 'Gepauzeerd', color: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30', icon: PauseCircle },
  CANCELLED: { label: 'Gestopt', color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30', icon: XCircle },
};

export default function FidelityPage() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [showRatesModal, setShowRatesModal] = useState(false);

  // Stats
  const activeClients = FIDELITY_CLIENTS.filter(c => c.status === 'ACTIVE');
  const stats = {
    totalClients: activeClients.length,
    totalMonthly: activeClients.reduce((sum, c) => sum + c.monthlyFee, 0),
    totalEarned: FIDELITY_CLIENTS.reduce((sum, c) => sum + c.totalEarned, 0),
    yearlyProjection: activeClients.reduce((sum, c) => sum + c.monthlyFee, 0) * 12,
  };

  // Filter
  const filteredClients = FIDELITY_CLIENTS.filter(client => {
    const matchesSearch = 
      client.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.contactName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleSelection = (id: string) => {
    setSelectedClients(prev => 
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  return (
    <PremiumLayout user={{ name: 'Lenny De K.' }}>
      {/* Rates Modal */}
      {showRatesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full border border-gray-200 dark:border-slate-700">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Jouw Maandfee Tarieven</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Wat jij verdient per actieve klant per maand</p>
              </div>
              <button 
                onClick={() => setShowRatesModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-500"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-2">
                {PERSONAL_RATES.map((item) => (
                  <div key={item.product} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-700 last:border-0">
                    <span className="text-gray-700 dark:text-gray-300">{item.product}</span>
                    <span className="font-bold text-gray-500 dark:text-gray-400">€{item.rate.toFixed(2)}/maand</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-gray-50 dark:bg-slate-900 rounded-lg">
                <p className="text-xs text-gray-700 dark:text-gray-300 text-center">
                  💡 Dit verdien jij elke maand voor elke klant die actief blijft
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fidelity - Passief Inkomen</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Maandelijkse terugkerende fees van je klanten</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowRatesModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            <Info className="w-4 h-4" />
            Tarieven
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all">
            <Plus className="w-4 h-4" />
            Nieuwe Klant
          </button>
        </div>
      </div>

      {/* Personal Commission Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-600 rounded-2xl p-6 text-white mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Handshake className="w-5 h-5" />
          Jouw Maandelijkse Vergoedingen
        </h2>
        <p className="text-sm text-orange-100 mb-4">
          Dit is wat JIJ elke maand verdient voor elke actieve klant. 
          Passief inkomen zolang de klant actief blijft.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-orange-200 text-xs">Per Internet klant</p>
            <p className="font-bold">€0.35/maand</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-orange-200 text-xs">Per Mobile Medium</p>
            <p className="font-bold">€1.00/maand</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-orange-200 text-xs">Per Go Extreme</p>
            <p className="font-bold">€1.75/maand</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-orange-200 text-xs">Alle producten</p>
            <p className="font-bold">13 tarieven</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Actieve Klanten</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalClients}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Maandelijks</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">€{stats.totalMonthly.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Totaal Verdiend</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">€{stats.totalEarned.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Jaarlijks</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">€{stats.yearlyProjection.toFixed(2)}</p>
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
      </div>

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Klant</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500 dark:text-gray-400">Jouw Maandfee</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Totaal Ontvangen</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Contract</th>
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
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold">
                          {client.companyName[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{client.companyName}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{client.contactName}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">{client.products.join(', ')}</p>
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
                      <p className="font-semibold text-gray-500 dark:text-gray-400">€{client.monthlyFee.toFixed(2)}/maand</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-500 dark:text-gray-400">€{client.totalEarned.toFixed(2)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{client.contractDuration} maanden</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(client.startDate).toLocaleDateString('nl-BE')}</p>
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
                    <span className="text-sm text-gray-500 dark:text-gray-400">Jouw maandfee</span>
                    <span className="font-bold text-gray-500 dark:text-gray-400">€{client.monthlyFee.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Totaal ontvangen</span>
                    <span className="font-bold text-gray-500 dark:text-gray-400">€{client.totalEarned.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Contract</span>
                    <span className="text-sm text-gray-900 dark:text-white">{client.contractDuration} maanden</span>
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
    </PremiumLayout>
  );
}
