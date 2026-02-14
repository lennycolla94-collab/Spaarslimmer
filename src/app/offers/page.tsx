'use client';

import { useState, useEffect } from 'react';
import { PremiumLayout } from '@/components/design-system/premium-layout';
import { 
  FileText, 
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Euro,
  ChevronDown,
  Loader2,
  AlertCircle,
  RefreshCw,
  Building2,
  MapPin,
  Calendar,
  Phone,
  ShoppingCart,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { formatEuro, getCommissionStatusLabel } from '@/lib/commission';

// Status configuration - with dark mode support
const STATUS_CONFIG = {
  DRAFT: { 
    label: 'Concept', 
    color: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:border-slate-600',
    bgColor: 'bg-gray-50 dark:bg-slate-900'
  },
  SENT: { 
    label: 'Verstuurd', 
    color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30',
    bgColor: 'bg-blue-50 dark:bg-blue-500/10'
  },
  ACCEPTED: { 
    label: 'Geaccepteerd', 
    color: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/30',
    bgColor: 'bg-purple-50 dark:bg-purple-500/10'
  },
  SOLD: { 
    label: '✓ Verkocht', 
    color: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30',
    bgColor: 'bg-green-50 dark:bg-green-500/10'
  },
  REJECTED: { 
    label: 'Afgewezen', 
    color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30',
    bgColor: 'bg-red-50 dark:bg-red-500/10'
  },
  EXPIRED: { 
    label: 'Verlopen', 
    color: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/30',
    bgColor: 'bg-orange-50 dark:bg-orange-500/10'
  },
};

const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Concept' },
  { value: 'SENT', label: 'Verstuurd' },
  { value: 'ACCEPTED', label: 'Geaccepteerd' },
  { value: 'REJECTED', label: 'Afgewezen' },
  { value: 'EXPIRED', label: 'Verlopen' },
];

// Mock data with commission breakdown
const MOCK_OFFERS = [
  {
    id: '1',
    lead: {
      companyName: 'Bakkerij De Lekkernij',
      contactName: 'Maria Peeters',
      city: 'Aalst',
      phone: '0472 12 34 56'
    },
    products: JSON.stringify([
      { type: 'INTERNET', plan: 'ZEN', retailValue: 5800, options: { convergence: true, portability: true } },
      { type: 'MOBILE', plan: 'MEDIUM', retailValue: 1500, options: { portability: true, convergence: true } },
      { type: 'MOBILE', plan: 'MEDIUM', retailValue: 1500, options: { portability: true, convergence: true } },
      { type: 'TV', plan: 'TV_PLUS', retailValue: 3200, options: {} }
    ]),
    totalRetail: 12000,
    totalASP: 45,
    customerSavings: 1200,
    status: 'SENT',
    potentialCommission: 55.80,
    effectiveCommission: null,
    commissionBreakdown: {
      items: [
        { name: 'Internet Zen', base: 15, portability: 12, convergence: 15, total: 42 },
        { name: 'GSM 1 - Medium', base: 35, portability: 20, convergence: 12, total: 67 },
        { name: 'GSM 2 - Medium', base: 35, portability: 20, convergence: 12, total: 67 },
        { name: 'TV+', base: 10, portability: 0, convergence: 0, total: 10 },
      ],
      baseTotal: 95,
      portabilityTotal: 52,
      convergenceTotal: 39,
      grandTotal: 186
    },
    sentAt: '2025-02-13T10:00:00Z',
    acceptedAt: null,
    createdAt: '2025-02-13T10:00:00Z'
  },
  {
    id: '2',
    lead: {
      companyName: 'Tech Solutions BV',
      contactName: 'Jan Janssen',
      city: 'Brussel',
      phone: '0473 56 78 90'
    },
    products: JSON.stringify([
      { type: 'INTERNET', plan: 'GIGA', retailValue: 6800, options: { convergence: true } },
      { type: 'MOBILE', plan: 'UNLIMITED', retailValue: 3000, options: { convergence: true } }
    ]),
    totalRetail: 9800,
    totalASP: 35,
    customerSavings: 800,
    status: 'SOLD',
    potentialCommission: null,
    effectiveCommission: 102,
    commissionBreakdown: {
      items: [
        { name: 'Internet Giga', base: 15, portability: 0, convergence: 15, total: 30 },
        { name: 'GSM - Unlimited', base: 60, portability: 0, convergence: 12, total: 72 },
      ],
      baseTotal: 75,
      portabilityTotal: 0,
      convergenceTotal: 27,
      grandTotal: 102
    },
    sentAt: '2025-02-12T14:00:00Z',
    acceptedAt: '2025-02-13T09:00:00Z',
    createdAt: '2025-02-12T14:00:00Z'
  },
  {
    id: '3',
    lead: {
      companyName: 'NecmiCuts',
      contactName: 'Necmi Yildiz',
      city: 'Aalst',
      phone: '0472 98 76 54'
    },
    products: JSON.stringify([
      { type: 'INTERNET', plan: 'START', retailValue: 4900, options: { convergence: true } },
      { type: 'MOBILE', plan: 'SMALL', retailValue: 1100, options: { convergence: true } }
    ]),
    totalRetail: 6000,
    totalASP: 20,
    customerSavings: 450,
    status: 'DRAFT',
    potentialCommission: null,
    effectiveCommission: null,
    commissionBreakdown: {
      items: [
        { name: 'Internet Start', base: 15, portability: 0, convergence: 15, total: 30 },
        { name: 'GSM - Small', base: 10, portability: 0, convergence: 0, total: 10 },
      ],
      baseTotal: 25,
      portabilityTotal: 0,
      convergenceTotal: 15,
      grandTotal: 40
    },
    sentAt: null,
    acceptedAt: null,
    createdAt: '2025-02-13T08:00:00Z'
  }
];

interface Offer {
  id: string;
  lead: {
    companyName: string;
    contactName: string;
    city: string;
    phone: string;
  };
  products: string;
  totalRetail: number;
  totalASP: number;
  customerSavings: number;
  status: keyof typeof STATUS_CONFIG;
  potentialCommission: number | null;
  effectiveCommission: number | null;
  commissionBreakdown?: {
    items: Array<{ name: string; base: number; portability: number; convergence: number; total: number }>;
    baseTotal: number;
    portabilityTotal: number;
    convergenceTotal: number;
    grandTotal: number;
  };
  sentAt: string | null;
  acceptedAt: string | null;
  createdAt: string;
}

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(true);
  const [showSaleModal, setShowSaleModal] = useState<string | null>(null);
  const [expandedBreakdown, setExpandedBreakdown] = useState<string | null>(null);

  useEffect(() => {
    fetchOffers();
  }, [statusFilter, useMockData]);

  async function fetchOffers() {
    try {
      setLoading(true);
      setError(null);

      if (useMockData) {
        const filtered = statusFilter === 'ALL' 
          ? MOCK_OFFERS 
          : MOCK_OFFERS.filter(o => o.status === statusFilter);
        setOffers(filtered);
        setLoading(false);
        return;
      }

      const url = `/api/offers${statusFilter !== 'ALL' ? `?status=${statusFilter}` : ''}`;
      const res = await fetch(url);
      
      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      const data = await res.json();
      setOffers(data.offers || []);
    } catch (err: any) {
      console.error('Error fetching offers:', err);
      setError(err.message || 'Failed to fetch offers');
      setUseMockData(true);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(offerId: string, newStatus: string) {
    try {
      setUpdatingId(offerId);
      
      if (useMockData) {
        setOffers(prev => prev.map(o => {
          if (o.id === offerId) {
            const updated = { ...o, status: newStatus as any };
            if (newStatus === 'SENT') {
              updated.potentialCommission = o.commissionBreakdown?.grandTotal ? o.commissionBreakdown.grandTotal * 0.3 : 0;
              updated.sentAt = new Date().toISOString();
            } else if (newStatus === 'ACCEPTED') {
              updated.acceptedAt = new Date().toISOString();
            }
            return updated;
          }
          return o;
        }));
        return;
      }

      const res = await fetch(`/api/offers/${offerId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');
      const data = await res.json();
      
      setOffers(prev => prev.map(o => o.id === offerId ? { ...o, ...data.offer } : o));
      fetchOffers();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Kon status niet updaten');
    } finally {
      setUpdatingId(null);
    }
  }

  async function convertToSale(offerId: string) {
    try {
      setUpdatingId(offerId);
      
      if (useMockData) {
        setOffers(prev => prev.map(o => {
          if (o.id === offerId) {
            return {
              ...o,
              status: 'SOLD',
              potentialCommission: null,
              effectiveCommission: o.commissionBreakdown?.grandTotal || 0,
              acceptedAt: new Date().toISOString()
            };
          }
          return o;
        }));
        setShowSaleModal(null);
        return;
      }

      const res = await fetch(`/api/offers/${offerId}/convert-to-sale`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Failed to convert to sale');
      
      fetchOffers();
      setShowSaleModal(null);
    } catch (error) {
      console.error('Error converting to sale:', error);
      alert('Kon niet converteren naar sale');
    } finally {
      setUpdatingId(null);
    }
  }

  function getProducts(offer: Offer): string[] {
    try {
      const parsed = JSON.parse(offer.products);
      return parsed.map((p: any) => p.plan || p.type).filter(Boolean);
    } catch {
      return [];
    }
  }

  const totals = {
    totalOffers: offers.length,
    sentCount: offers.filter(o => o.status === 'SENT').length,
    acceptedCount: offers.filter(o => o.status === 'ACCEPTED').length,
    soldCount: offers.filter(o => o.status === 'SOLD').length,
    potentialCommission: offers
      .filter(o => o.status === 'SENT')
      .reduce((sum, o) => sum + (o.potentialCommission || 0), 0),
    effectiveCommission: offers
      .filter(o => o.status === 'SOLD')
      .reduce((sum, o) => sum + (o.effectiveCommission || 0), 0),
  };

  const filterOptions = [
    { value: 'ALL', label: 'Alle', count: totals.totalOffers },
    { value: 'SENT', label: 'Verstuurd', count: totals.sentCount },
    { value: 'ACCEPTED', label: 'Geaccepteerd', count: totals.acceptedCount },
    { value: 'SOLD', label: 'Verkocht', count: totals.soldCount },
  ];

  const filteredOffers = statusFilter === 'ALL' 
    ? offers 
    : offers.filter(o => o.status === statusFilter);

  return (
    <PremiumLayout user={{ name: 'Lenny De K.' }}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Verkoop & Offertes</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Beheer je offertes en converteer naar sales</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700"
          >
            Dashboard
          </Link>
          <Link
            href="/calculator"
            className="flex items-center gap-2 px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600"
          >
            <Plus className="w-4 h-4" />
            Nieuwe Offerte
          </Link>
        </div>
      </div>

      {/* Demo Badge */}
      {useMockData && (
        <div className="mb-6 p-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl flex items-center gap-3">
          <span className="px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded">DEMO</span>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Commissies worden automatisch berekend volgens SmartSN regels</p>
        </div>
      )}

      {/* Stats Grid - FIXED DARK MODE */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Open Offertes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totals.sentCount}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Geaccepteerd</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totals.acceptedCount}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Potentiële Commissie</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatEuro(totals.potentialCommission)}</p>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Effectieve Commissie</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatEuro(totals.effectiveCommission)}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <Euro className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs - FIXED DARK MODE */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700 mb-6">
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setStatusFilter(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                statusFilter === option.value
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
            >
              {option.label}
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                statusFilter === option.value ? 'bg-gray-700 dark:bg-gray-200 text-white dark:text-gray-700' : 'bg-gray-200 dark:bg-slate-600 text-gray-600 dark:text-gray-300'
              }`}>
                {option.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Sale Confirmation Modal - FIXED DARK MODE */}
      {showSaleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 border border-gray-200 dark:border-slate-700">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">Converteer naar Sale?</h2>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
              Deze offerte wordt gemarkeerd als verkocht. De effectieve commissie wordt berekend.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSaleModal(null)}
                className="flex-1 py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-slate-600"
              >
                Annuleren
              </button>
              <button
                onClick={() => convertToSale(showSaleModal)}
                disabled={updatingId === showSaleModal}
                className="flex-1 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 flex items-center justify-center gap-2"
              >
                {updatingId === showSaleModal ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Bevestig Sale
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offers Grid - FIXED DARK MODE */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      ) : filteredOffers.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-gray-200 dark:border-slate-700">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Geen offertes gevonden</h3>
          <Link href="/calculator" className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl">
            <Plus className="w-5 h-5" />
            Nieuwe Offerte
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filteredOffers.map((offer) => {
            const status = STATUS_CONFIG[offer.status];
            const products = getProducts(offer);
            const canConvertToSale = offer.status === 'ACCEPTED';
            const isBreakdownExpanded = expandedBreakdown === offer.id;
            
            return (
              <div key={offer.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        {offer.lead.companyName[0]}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{offer.lead.companyName}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{offer.lead.contactName}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-400 dark:text-gray-500">
                          <MapPin className="w-3 h-3" />
                          {offer.lead.city}
                        </div>
                      </div>
                    </div>
                    
                    {/* Status Dropdown */}
                    <div className="relative group">
                      <button className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border ${status.color}`}>
                        {status.label}
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                        {STATUS_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => updateStatus(offer.id, opt.value)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 first:rounded-t-xl last:rounded-b-xl"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Commission Badge - FIXED DARK MODE */}
                  {(offer.potentialCommission || offer.effectiveCommission || offer.commissionBreakdown) && (
                    <div className={`mb-4 px-4 py-3 rounded-xl border ${
                      offer.effectiveCommission 
                        ? 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700'
                        : offer.potentialCommission
                        ? 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700'
                        : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className={`font-semibold ${
                          offer.effectiveCommission ? 'text-gray-500 dark:text-gray-400' : offer.potentialCommission ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {offer.effectiveCommission 
                            ? `✓ Verkocht - Effectieve commissie: ${formatEuro(offer.effectiveCommission)}`
                            : offer.potentialCommission
                            ? `⏳ Potentiële commissie: ${formatEuro(offer.potentialCommission)}`
                            : `💰 Totaal commissie: ${formatEuro(offer.commissionBreakdown?.grandTotal || 0)}`
                          }
                        </span>
                        {offer.commissionBreakdown && (
                          <button
                            onClick={() => setExpandedBreakdown(isBreakdownExpanded ? null : offer.id)}
                            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-400 flex items-center gap-1"
                          >
                            {isBreakdownExpanded ? 'Verberg' : 'Toon breakdown'}
                            <ChevronDown className={`w-3 h-3 transition-transform ${isBreakdownExpanded ? 'rotate-180' : ''}`} />
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Commission Breakdown - FIXED DARK MODE */}
                  {offer.commissionBreakdown && (
                    <div className={`mb-4 overflow-hidden transition-all ${isBreakdownExpanded ? '' : 'max-h-24'}`}>
                      <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">Commissie Opbouw</p>
                        
                        {/* Table Header */}
                        <div className="grid grid-cols-5 gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2 px-2">
                          <span>Product</span>
                          <span className="text-center">Basis</span>
                          <span className="text-center">Portability</span>
                          <span className="text-center">Convergentie</span>
                          <span className="text-right">Totaal</span>
                        </div>
                        
                        {/* Items */}
                        <div className="space-y-1">
                          {offer.commissionBreakdown.items.map((item, idx) => (
                            <div key={idx} className="grid grid-cols-5 gap-2 text-sm py-1.5 px-2 rounded hover:bg-white dark:hover:bg-slate-800">
                              <span className="font-medium text-gray-700 dark:text-gray-300 truncate">{item.name}</span>
                              <span className="text-center text-gray-600 dark:text-gray-400">€{item.base}</span>
                              <span className={`text-center ${item.portability > 0 ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-400 dark:text-gray-600'}`}>
                                {item.portability > 0 ? `+€${item.portability}` : '-'}
                              </span>
                              <span className={`text-center ${item.convergence > 0 ? 'text-purple-600 dark:text-purple-400 font-medium' : 'text-gray-400 dark:text-gray-600'}`}>
                                {item.convergence > 0 ? `+€${item.convergence}` : '-'}
                              </span>
                              <span className="text-right font-semibold text-gray-900 dark:text-white">€{item.total}</span>
                            </div>
                          ))}
                        </div>
                        
                        {/* Total Row */}
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-700 grid grid-cols-5 gap-2 text-sm px-2">
                          <span className="font-semibold text-gray-700 dark:text-gray-300">TOTAAL</span>
                          <span className="text-center font-semibold text-gray-700 dark:text-gray-300">€{offer.commissionBreakdown.baseTotal}</span>
                          <span className="text-center font-semibold text-green-600 dark:text-green-400">+€{offer.commissionBreakdown.portabilityTotal}</span>
                          <span className="text-center font-semibold text-purple-600 dark:text-purple-400">+€{offer.commissionBreakdown.convergenceTotal}</span>
                          <span className="text-right font-bold text-lg text-orange-600 dark:text-orange-400">€{offer.commissionBreakdown.grandTotal}</span>
                        </div>
                        
                        {/* 30% / 100% indicator */}
                        <div className="mt-2 flex items-center justify-between text-xs px-2">
                          <span className="text-gray-500 dark:text-gray-400">
                            {offer.status === 'SENT' && `30% nu: ${formatEuro((offer.commissionBreakdown.grandTotal || 0) * 0.3)}`}
                            {offer.status === 'SOLD' && `100% uitbetaald: ${formatEuro(offer.commissionBreakdown.grandTotal || 0)}`}
                            {(offer.status === 'DRAFT' || offer.status === 'ACCEPTED') && `Bij verzending: ${formatEuro((offer.commissionBreakdown.grandTotal || 0) * 0.3)} • Bij sale: ${formatEuro(offer.commissionBreakdown.grandTotal || 0)}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Products & Pricing - FIXED DARK MODE */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {products.map((product, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-xs rounded font-medium">
                        {product}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Maandbedrag klant</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">€{(offer.totalRetail / 100).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Klant bespaart</p>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">€{(offer.customerSavings / 100).toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Footer with Actions - FIXED DARK MODE */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-700">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(offer.createdAt).toLocaleDateString('nl-BE')}
                    </span>
                    
                    <div className="flex gap-2">
                      {canConvertToSale && (
                        <button
                          onClick={() => setShowSaleModal(offer.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Markeer als Sale
                        </button>
                      )}
                      
                      {offer.status === 'SOLD' && (
                        <span className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 rounded-lg font-medium">
                          <CheckCircle2 className="w-4 h-4" />
                          Verkocht
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PremiumLayout>
  );
}
