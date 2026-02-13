'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus,
  Eye,
  Send,
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Mail,
  MoreVertical,
  ArrowRight,
  ArrowLeft,
  Euro,
  Users,
  ChevronDown,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { formatEuro, getCommissionStatusLabel } from '@/lib/commission';

// Status configuration
const STATUS_CONFIG = {
  DRAFT: { 
    label: 'Concept', 
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: FileText,
    commission: null 
  },
  SENT: { 
    label: 'Verstuurd', 
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: Send,
    commission: 'potential'
  },
  ACCEPTED: { 
    label: 'Geaccepteerd', 
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: CheckCircle2,
    commission: 'effective'
  },
  REJECTED: { 
    label: 'Afgewezen', 
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: XCircle,
    commission: null
  },
  EXPIRED: { 
    label: 'Verlopen', 
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    icon: Clock,
    commission: null
  },
};

// Status options for dropdown
const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Concept' },
  { value: 'SENT', label: 'Verstuurd' },
  { value: 'ACCEPTED', label: 'Geaccepteerd' },
  { value: 'REJECTED', label: 'Afgewezen' },
  { value: 'EXPIRED', label: 'Verlopen' },
];

interface Offer {
  id: string;
  lead: {
    companyName: string;
    contactName: string;
    city: string;
  };
  products: string;
  totalRetail: number;
  totalASP: number;
  customerSavings: number;
  status: keyof typeof STATUS_CONFIG;
  potentialCommission: number | null;
  effectiveCommission: number | null;
  sentAt: string | null;
  acceptedAt: string | null;
  createdAt: string;
}

interface Totals {
  potentialCommission: number;
  effectiveCommission: number;
  totalOffers: number;
  sentCount: number;
  acceptedCount: number;
}

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [totals, setTotals] = useState<Totals | null>(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Fetch offers
  useEffect(() => {
    fetchOffers();
  }, [statusFilter]);

  async function fetchOffers() {
    try {
      setLoading(true);
      const url = `/api/offers${statusFilter !== 'ALL' ? `?status=${statusFilter}` : ''}`;
      const res = await fetch(url);
      const data = await res.json();
      setOffers(data.offers);
      setTotals(data.totals);
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  }

  // Update offer status with automatic commission calculation
  async function updateStatus(offerId: string, newStatus: string) {
    try {
      setUpdatingId(offerId);
      const res = await fetch(`/api/offers/${offerId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');

      const data = await res.json();
      
      // Update local state
      setOffers(prev => prev.map(o => 
        o.id === offerId ? { ...o, ...data.offer } : o
      ));
      
      // Refresh totals
      fetchOffers();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Kon status niet updaten');
    } finally {
      setUpdatingId(null);
    }
  }

  // Parse products JSON
  function getProducts(offer: Offer): string[] {
    try {
      const parsed = JSON.parse(offer.products);
      return parsed.map((p: any) => p.plan || p.type).filter(Boolean);
    } catch {
      return [];
    }
  }

  const filterOptions = [
    { value: 'ALL', label: 'Alle', count: totals?.totalOffers || 0 },
    { value: 'SENT', label: 'Verstuurd', count: totals?.sentCount || 0 },
    { value: 'ACCEPTED', label: 'Geaccepteerd', count: totals?.acceptedCount || 0 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Verkoop & Offertes</h1>
              <p className="text-gray-500 mt-1">Beheer je offertes en commissies</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                href="/leads"
                className="inline-flex items-center gap-2 px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nieuwe Offerte
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Open Offertes</p>
                  <p className="text-2xl font-bold text-blue-900">{totals?.sentCount || 0}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Geaccepteerd</p>
                  <p className="text-2xl font-bold text-green-900">{totals?.acceptedCount || 0}</p>
                  <p className="text-xs text-green-600 mt-1">+3 deze week</p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 font-medium">Potentiële Commissie</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {formatEuro(totals?.potentialCommission || 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Effectieve Commissie</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {formatEuro(totals?.effectiveCommission || 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <Euro className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setStatusFilter(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  statusFilter === option.value
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {option.label}
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  statusFilter === option.value ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  {option.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : offers.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Geen offertes gevonden</h3>
            <p className="text-gray-500 mb-6">Maak je eerste offerte om te beginnen met verkopen.</p>
            <Link
              href="/leads"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Nieuwe Offerte
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {offers.map((offer) => {
              const status = STATUS_CONFIG[offer.status];
              const StatusIcon = status.icon;
              const products = getProducts(offer);
              
              return (
                <div key={offer.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{offer.lead.companyName}</h3>
                        <p className="text-sm text-gray-500">{offer.lead.contactName}</p>
                      </div>
                      
                      {/* Status Dropdown */}
                      <div className="relative group">
                        <button
                          disabled={updatingId === offer.id}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border ${status.color} disabled:opacity-50`}
                        >
                          {updatingId === offer.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <StatusIcon className="w-3 h-3" />
                          )}
                          {status.label}
                          <ChevronDown className="w-3 h-3" />
                        </button>
                        
                        {/* Dropdown Menu */}
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                          {STATUS_OPTIONS.map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => updateStatus(offer.id, opt.value)}
                              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl ${
                                offer.status === opt.value ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Commission Badge */}
                    {(offer.potentialCommission || offer.effectiveCommission) && (
                      <div className={`mb-4 px-3 py-2 rounded-lg text-sm ${
                        offer.effectiveCommission 
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        <span className="font-medium">
                          {offer.effectiveCommission 
                            ? `Effectieve commissie: ${formatEuro(offer.effectiveCommission)}`
                            : `Potentiële commissie: ${formatEuro(offer.potentialCommission || 0)}`
                          }
                        </span>
                      </div>
                    )}

                    {/* Products */}
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 uppercase mb-2">Producten</p>
                      <div className="flex flex-wrap gap-2">
                        {products.map((product, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg">
                            {product}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="text-xs text-gray-500">Maandbedrag</p>
                        <p className="text-xl font-bold text-gray-900">{formatEuro(offer.totalRetail)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Besparing</p>
                        <p className="text-xl font-bold text-green-600">{formatEuro(offer.customerSavings)}</p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-500">
                        {new Date(offer.createdAt).toLocaleDateString('nl-BE')}
                      </span>
                      <div className="flex gap-2">
                        <button className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                          <Mail className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
