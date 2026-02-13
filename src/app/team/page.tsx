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

// Fidelity vergoedingen per product per niveau (van prijslijst)
const FIDELITY_RATES = {
  'Internet':        { l0: 0.35, l1: 0.10, l2: 0.04, l3: 0.04, l4: 0.04, l5: 0.04, l6: 0.04, l7: 0.05 },
  'Energy':          { l0: 0.35, l1: 0.10, l2: 0.04, l3: 0.04, l4: 0.04, l5: 0.04, l6: 0.04, l7: 0.05 },
  'Orange Mobile Child':   { l0: 0.25, l1: 0.11, l2: 0.04, l3: 0.04, l4: 0.04, l5: 0.04, l6: 0.04, l7: 0.14 },
  'Orange Mobile Small':   { l0: 0.50, l1: 0.21, l2: 0.07, l3: 0.07, l4: 0.07, l5: 0.07, l6: 0.07, l7: 0.29 },
  'Orange Mobile Medium':  { l0: 1.00, l1: 0.43, l2: 0.14, l3: 0.14, l4: 0.14, l5: 0.14, l6: 0.14, l7: 0.57 },
  'Orange Mobile Large':   { l0: 1.25, l1: 0.53, l2: 0.17, l3: 0.17, l4: 0.17, l5: 0.17, l6: 0.17, l7: 0.73 },
  'Orange Mobile Unlimited': { l0: 1.50, l1: 0.64, l2: 0.21, l3: 0.21, l4: 0.21, l5: 0.21, l6: 0.21, l7: 0.89 },
  'Go Light':        { l0: 0.40, l1: 0.17, l2: 0.06, l3: 0.06, l4: 0.06, l5: 0.06, l6: 0.06, l7: 0.23 },
  'Go Plus':         { l0: 0.80, l1: 0.34, l2: 0.11, l3: 0.11, l4: 0.11, l5: 0.11, l6: 0.11, l7: 0.46 },
  'Go Intense':      { l0: 1.00, l1: 0.43, l2: 0.14, l3: 0.14, l4: 0.14, l5: 0.14, l6: 0.14, l7: 0.57 },
  'Go Extreme':      { l0: 1.75, l1: 0.75, l2: 0.25, l3: 0.25, l4: 0.25, l5: 0.25, l6: 0.25, l7: 1.00 },
  'EasyInternet@Home': { l0: 0.50, l1: 0.21, l2: 0.07, l3: 0.07, l4: 0.07, l5: 0.07, l6: 0.07, l7: 0.29 },
  'Internet Everywhere': { l0: 0.05, l1: 0.02, l2: 0.01, l3: 0.01, l4: 0.01, l5: 0.01, l6: 0.01, l7: 0.03 },
};

// Upline niveau namen
const LEVEL_NAMES = [
  { level: 0, name: 'Jij (Level 0)', role: 'Business Consultant' },
  { level: 1, name: 'Level 1', role: 'Sponsor/Mentor' },
  { level: 2, name: 'Level 2', role: 'Senior Consultant' },
  { level: 3, name: 'Level 3', role: 'Premier Consultant' },
  { level: 4, name: 'Level 4', role: 'Premier Consultant' },
  { level: 5, name: 'Level 5', role: 'Leader' },
  { level: 6, name: 'Level 6', role: 'Leader' },
  { level: 7, name: 'Level 7', role: 'Premier Leader' },
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
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-auto border border-gray-200 dark:border-slate-700">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-800">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Fidelity Vergoedingen Per Niveau</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Maandelijkse fees per product per upline niveau</p>
              </div>
              <button 
                onClick={() => setShowRatesModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-500"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Rate Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-slate-700">
                      <th className="text-left py-3 px-2 font-semibold text-gray-900 dark:text-white">Product</th>
                      {LEVEL_NAMES.map((l) => (
                        <th key={l.level} className="text-center py-3 px-2 font-semibold text-gray-900 dark:text-white">
                          <div className="text-xs">{l.name}</div>
                          <div className="text-[10px] text-gray-500 font-normal">{l.role}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                    {Object.entries(FIDELITY_RATES).map(([product, rates]) => (
                      <tr key={product} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                        <td className="py-3 px-2 font-medium text-gray-900 dark:text-white">{product}</td>
                        <td className="py-3 px-2 text-center font-bold text-orange-600 dark:text-orange-400">€{rates.l0.toFixed(2)}</td>
                        <td className="py-3 px-2 text-center text-gray-600 dark:text-gray-400">€{rates.l1.toFixed(2)}</td>
                        <td className="py-3 px-2 text-center text-gray-600 dark:text-gray-400">€{rates.l2.toFixed(2)}</td>
                        <td className="py-3 px-2 text-center text-gray-600 dark:text-gray-400">€{rates.l3.toFixed(2)}</td>
                        <td className="py-3 px-2 text-center text-gray-600 dark:text-gray-400">€{rates.l4.toFixed(2)}</td>
                        <td className="py-3 px-2 text-center text-gray-600 dark:text-gray-400">€{rates.l5.toFixed(2)}</td>
                        <td className="py-3 px-2 text-center text-gray-600 dark:text-gray-400">€{rates.l6.toFixed(2)}</td>
                        <td className="py-3 px-2 text-center font-semibold text-purple-600 dark:text-purple-400">€{rates.l7.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Example */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-200 dark:border-blue-500/20">
                <h4 className="font-semibold text-blue-900 dark:text-blue-400 mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Voorbeeld: Internet abonnement
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Jij (Level 0) ontvangt €0.35/maand • Je sponsor (Level 1) ontvangt €0.10/maand • 
                  Level 2 ontvangt €0.04/maand • Level 3-6 ontvangen €0.04/maand • Level 7 ontvangt €0.05/maand
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

      {/* Upline Commission Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Handshake className="w-5 h-5" />
          Upline Fidelity Vergoedingen
        </h2>
        <p className="text-sm text-purple-100 mb-4">
          Voor elke actieve dienst in je team ontvang je maandelijkse fidelity fees tot het 7de niveau. 
          Klik op "Tarieven" voor de volledige tabel per product.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-purple-200 text-xs">Level 0 (Jij)</p>
            <p className="font-bold">Volledig bedrag</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-purple-200 text-xs">Level 1</p>
            <p className="font-bold">Bijv. €0.10-0.64</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-purple-200 text-xs">Level 2-6</p>
            <p className="font-bold">Bijv. €0.04-0.25</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-purple-200 text-xs">Level 7</p>
            <p className="font-bold">Bijv. €0.05-1.00</p>
          </div>
        </div>
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
        <div className="bg-orange-50 dark:bg-orange-500/10 rounded-xl border border-orange-200 dark:border-orange-500/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <span className="text-sm text-orange-600 dark:text-orange-400">Maandelijks</span>
          </div>
          <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">€{stats.totalMonthly.toFixed(2)}</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-500/10 rounded-xl border border-purple-200 dark:border-purple-500/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="text-sm text-purple-600 dark:text-purple-400">Totaal Verdiend</span>
          </div>
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">€{stats.totalEarned.toFixed(2)}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-500/10 rounded-xl border border-green-200 dark:border-green-500/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-sm text-green-600 dark:text-green-400">Jaarlijks</span>
          </div>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100">€{stats.yearlyProjection.toFixed(2)}</p>
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-orange-600 dark:text-orange-400">Maandfee</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Totaal Verdiend</th>
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
                      <p className="font-semibold text-orange-600 dark:text-orange-400">€{client.monthlyFee.toFixed(2)}/maand</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-green-600 dark:text-green-400">€{client.totalEarned.toFixed(2)}</p>
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
                    <span className="text-sm text-gray-500 dark:text-gray-400">Maandfee</span>
                    <span className="font-bold text-orange-600 dark:text-orange-400">€{client.monthlyFee.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Totaal verdiend</span>
                    <span className="font-bold text-green-600 dark:text-green-400">€{client.totalEarned.toFixed(2)}</span>
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
