'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PremiumLayout } from '@/components/design-system/premium-layout';
import { 
  Search, 
  Plus, 
  Minus, 
  Wifi, 
  Smartphone, 
  Tv, 
  Zap,
  ArrowRight,
  TrendingUp,
  FileText,
  User,
  Building2,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  X,
  CheckCircle2,
  ChevronRight,
  Save,
  ArrowLeft,
  Loader2,
  ShoppingCart,
  Calendar,
  Clock,
  Info
} from 'lucide-react';
import Link from 'next/link';
import { formatEuro } from '@/lib/commission';

// Orange Products
const INTERNET_PLANS = [
  { 
    id: 'START', 
    name: 'Internet Start', 
    packPrice: 49, 
    standalonePrice: 53,
    speed: '100 Mbps',
    commission: 15,
    features: ['100 Mbps download', '25 Mbps upload', 'Unlimited data']
  },
  { 
    id: 'ZEN', 
    name: 'Internet Zen', 
    packPrice: 58, 
    standalonePrice: 62,
    speed: '300 Mbps',
    commission: 15,
    features: ['300 Mbps download', '50 Mbps upload', 'Unlimited data']
  },
  { 
    id: 'GIGA', 
    name: 'Internet Giga', 
    packPrice: 68, 
    standalonePrice: 72,
    speed: '1 Gbps',
    commission: 15,
    features: ['1 Gbps download', '100 Mbps upload', 'Unlimited data']
  },
];

const MOBILE_PLANS = [
  { id: 'CHILD', name: 'Child', price: 0, data: '1 GB', commission: 1, minutes: '150 min', sms: '150 SMS' },
  { id: 'SMALL', name: 'Small', price: 11.50, data: '5 GB', commission: 10, minutes: '200 min', sms: '200 SMS' },
  { id: 'MEDIUM', name: 'Medium', price: 16.50, data: '20 GB', commission: 35, minutes: 'Onbeperkt', sms: 'Onbeperkt', bonus: '+€12 convergentie' },
  { id: 'LARGE', name: 'Large', price: 21.50, data: '40 GB', commission: 50, minutes: 'Onbeperkt', sms: 'Onbeperkt', bonus: '+€12 convergentie' },
  { id: 'UNLIMITED', name: 'Unlimited', price: 32, data: 'Unlimited', commission: 60, minutes: 'Onbeperkt', sms: 'Onbeperkt', bonus: '+€12 convergentie' },
];

const TV_OPTIONS = [
  { id: 'TV', name: 'Orange TV', price: 0, commission: 10, features: ['80+ zenders', 'Replay TV'] },
  { id: 'TV_PLUS', name: 'Orange TV+', price: 20, commission: 10, features: ['80+ zenders', 'Netflix', 'Disney+'] },
];

interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  city: string;
  address?: string;
}

// Mock leads data (replace with API call)
const MOCK_LEADS: Record<string, Lead> = {
  'eba79e50-2f72-4cdf-8cca-6002af922a0f': {
    id: 'eba79e50-2f72-4cdf-8cca-6002af922a0f',
    companyName: 'Bakkerij De Lekkernij',
    contactName: 'Maria Peeters',
    phone: '0472 12 34 56',
    email: 'maria@bakkerij.be',
    city: 'Aalst',
    address: 'Hoogstraat 45'
  },
  '1': { id: '1', companyName: 'Bakkerij De Lekkernij', contactName: 'Maria Peeters', phone: '0472 12 34 56', email: 'maria@bakkerij.be', city: 'Aalst' },
  '2': { id: '2', companyName: 'Tech Solutions BV', contactName: 'Jan Janssen', phone: '0473 56 78 90', email: 'jan@tech.be', city: 'Brussel' },
  '3': { id: '3', companyName: 'NecmiCuts', contactName: 'Necmi Yildiz', phone: '0472 98 76 54', email: 'necmi@cuts.be', city: 'Aalst' },
};

function CalculatorContent() {
  const searchParams = useSearchParams();
  const leadId = searchParams.get('lead');
  
  // States
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Product selections
  const [internet, setInternet] = useState<string | null>(null);
  const [internetInstall, setInternetInstall] = useState<'NEW' | 'EASY_SWITCH'>('NEW');
  const [mobileLines, setMobileLines] = useState<Array<{plan: string; portability: boolean}>>([]);
  const [tv, setTv] = useState<string | null>(null);
  
  // Calculations
  const [totals, setTotals] = useState({ monthly: 0, commission: 0, breakdown: [] as any[] });

  // Load lead from URL or default
  useEffect(() => {
    if (leadId && MOCK_LEADS[leadId]) {
      setSelectedLead(MOCK_LEADS[leadId]);
    }
    setLoading(false);
  }, [leadId]);

  // Calculate totals
  useEffect(() => {
    const hasPack = internet && mobileLines.some(l => l.plan);
    let monthly = 0;
    let commission = 0;
    const breakdown: any[] = [];

    // Internet
    if (internet) {
      const plan = INTERNET_PLANS.find(p => p.id === internet)!;
      monthly += hasPack ? plan.packPrice : plan.standalonePrice;
      commission += plan.commission;
      if (internetInstall === 'EASY_SWITCH') commission += 12;
      breakdown.push({ name: plan.name, type: 'Internet', commission: plan.commission + (internetInstall === 'EASY_SWITCH' ? 12 : 0) });
    }

    // Mobile
    mobileLines.forEach((line, idx) => {
      if (line.plan) {
        const plan = MOBILE_PLANS.find(p => p.id === line.plan)!;
        monthly += hasPack ? plan.price : plan.price + 4; // Add pack discount difference
        let comm = plan.commission;
        if (hasPack && ['MEDIUM', 'LARGE', 'UNLIMITED'].includes(line.plan)) comm += 12;
        if (line.portability && ['MEDIUM', 'LARGE', 'UNLIMITED'].includes(line.plan)) comm += 20;
        commission += comm;
        breakdown.push({ name: plan.name, type: `GSM ${idx + 1}`, commission: comm });
      }
    });

    // TV
    if (tv) {
      const plan = TV_OPTIONS.find(p => p.id === tv)!;
      monthly += plan.price;
      commission += plan.commission;
      breakdown.push({ name: plan.name, type: 'TV', commission: plan.commission });
    }

    setTotals({ monthly, commission, breakdown });
  }, [internet, internetInstall, mobileLines, tv]);

  const addMobileLine = () => setMobileLines([...mobileLines, { plan: '', portability: false }]);
  const removeMobileLine = (idx: number) => setMobileLines(mobileLines.filter((_, i) => i !== idx));
  const updateMobileLine = (idx: number, field: string, value: any) => {
    const updated = [...mobileLines];
    updated[idx] = { ...updated[idx], [field]: value };
    setMobileLines(updated);
  };

  const saveOffer = () => {
    alert('Offerte opgeslagen! (Demo mode)');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <PremiumLayout user={{ name: 'Lenny De K.' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/v2-premium" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nieuwe Offerte</h1>
            <p className="text-gray-500">Configureer het pakket voor je klant</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/offers" className="px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            Annuleren
          </Link>
          <button 
            onClick={saveOffer}
            disabled={!selectedLead || !internet}
            className="flex items-center gap-2 px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            Offerte Opslaan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Products */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Lead Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Klantgegevens</h2>
            </div>
            
            {selectedLead ? (
              <div className="flex items-start justify-between p-4 bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl border border-orange-100">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                    {selectedLead.companyName[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{selectedLead.companyName}</h3>
                    <p className="text-gray-600">{selectedLead.contactName}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {selectedLead.city}</span>
                      <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {selectedLead.phone}</span>
                      {selectedLead.email && <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {selectedLead.email}</span>}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedLead(null)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500 mb-2">Selecteer een klant om verder te gaan</p>
                <Link href="/leads" className="text-orange-600 hover:text-orange-700 font-medium">
                  Ga naar leads →
                </Link>
              </div>
            )}
          </div>

          {/* Internet Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Wifi className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900">Internet</h2>
                <p className="text-sm text-gray-500">Kies een internet plan</p>
              </div>
              {internet && (
                <button onClick={() => setInternet(null)} className="text-sm text-red-500 hover:text-red-600">
                  Verwijderen
                </button>
              )}
            </div>

            {!internet ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {INTERNET_PLANS.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setInternet(plan.id)}
                    className="p-4 border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:shadow-md transition-all text-left group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900 group-hover:text-orange-600">{plan.name}</span>
                      <span className="text-sm text-blue-600 font-medium">{plan.speed}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{plan.features[0]}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-900">€{plan.packPrice}</span>
                      <span className="text-sm text-gray-500">/mnd</span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">Commissie: €{plan.commission}</p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {(() => {
                  const plan = INTERNET_PLANS.find(p => p.id === internet)!;
                  return (
                    <>
                      <div className="p-4 bg-blue-50 rounded-xl flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                          <p className="text-sm text-blue-600">{plan.speed} • {plan.features.join(' • ')}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">€{plan.packPrice}/mnd</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setInternetInstall('NEW')}
                          className={`p-3 rounded-lg border-2 text-left ${internetInstall === 'NEW' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                        >
                          <p className="font-medium text-gray-900">Nieuwe Aansluiting</p>
                          <p className="text-xs text-gray-500">Standaard installatie</p>
                        </button>
                        <button
                          onClick={() => setInternetInstall('EASY_SWITCH')}
                          className={`p-3 rounded-lg border-2 text-left ${internetInstall === 'EASY_SWITCH' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                        >
                          <p className="font-medium text-gray-900 flex items-center gap-2">
                            Easy Switch
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">+€12</span>
                          </p>
                          <p className="text-xs text-gray-500">Nummerbehoud + extra commissie</p>
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Mobile Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Mobiele Abonnementen</h2>
                  <p className="text-sm text-gray-500">
                    {mobileLines.length === 0 ? 'Geen lijnen toegevoegd' : `${mobileLines.length} lijn${mobileLines.length > 1 ? 'en' : ''}`}
                  </p>
                </div>
              </div>
              <button
                onClick={addMobileLine}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                <Plus className="w-4 h-4" />
                Lijn Toevoegen
              </button>
            </div>

            <div className="space-y-3">
              {mobileLines.map((line, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-700">Mobiele lijn #{idx + 1}</span>
                    <button onClick={() => removeMobileLine(idx)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <select
                      value={line.plan}
                      onChange={(e) => updateMobileLine(idx, 'plan', e.target.value)}
                      className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Kies abonnement</option>
                      {MOBILE_PLANS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} - {p.data} (€{p.price}/mnd)
                        </option>
                      ))}
                    </select>
                    
                    {line.plan && ['MEDIUM', 'LARGE', 'UNLIMITED'].includes(line.plan) && (
                      <label className="flex items-center gap-3 px-3 py-2.5 bg-white border border-gray-300 rounded-lg cursor-pointer">
                        <input
                          type="checkbox"
                          checked={line.portability}
                          onChange={(e) => updateMobileLine(idx, 'portability', e.target.checked)}
                          className="w-4 h-4 text-orange-500"
                        />
                        <span className="text-sm text-gray-700">Nummer overzetten</span>
                        <span className="ml-auto px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">+€20</span>
                      </label>
                    )}
                  </div>
                  
                  {line.plan && (
                    <div className="mt-3 p-3 bg-white rounded-lg text-sm text-gray-600">
                      {(() => {
                        const p = MOBILE_PLANS.find(m => m.id === line.plan)!;
                        return (
                          <div className="flex flex-wrap gap-3">
                            <span>📱 {p.data}</span>
                            <span>📞 {p.minutes}</span>
                            <span>💬 {p.sms}</span>
                            <span className="text-orange-600 font-medium">€{p.commission} commissie</span>
                            {p.bonus && <span className="text-green-600">{p.bonus}</span>}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* TV Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Tv className="w-5 h-5 text-pink-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">TV</h2>
              </div>
              {tv && (
                <button onClick={() => setTv(null)} className="text-sm text-red-500 hover:text-red-600">
                  Verwijderen
                </button>
              )}
            </div>

            {!tv ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {TV_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setTv(option.id)}
                    className="p-4 border-2 border-gray-200 rounded-xl hover:border-pink-500 hover:shadow-md transition-all text-left"
                  >
                    <h3 className="font-semibold text-gray-900">{option.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{option.features.join(' • ')}</p>
                    <p className="text-xl font-bold text-gray-900 mt-2">
                      {option.price === 0 ? 'Inbegrepen' : `€${option.price}/mnd`}
                    </p>
                    <p className="text-xs text-green-600 mt-1">€{option.commission} commissie</p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-pink-50 rounded-xl">
                {(() => {
                  const plan = TV_OPTIONS.find(p => p.id === tv)!;
                  return (
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                        <p className="text-sm text-gray-600">{plan.features.join(' • ')}</p>
                      </div>
                      <p className="text-xl font-bold text-gray-900">
                        {plan.price === 0 ? 'Inbegrepen' : `€${plan.price}/mnd`}
                      </p>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Summary */}
        <div className="lg:col-span-4">
          <div className="sticky top-6 space-y-4">
            
            {/* Commission Card */}
            <div className="bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl p-6 text-white">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Jouw Commissie
              </h3>
              
              {totals.commission > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">€{totals.commission}</span>
                    <span className="text-orange-100">bij verkoop</span>
                  </div>
                  
                  <div className="pt-3 border-t border-white/20 space-y-2">
                    {totals.breakdown.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-orange-100">{item.type}: {item.name}</span>
                        <span className="font-medium">€{item.commission}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-3 border-t border-white/20">
                    <div className="flex items-center justify-between">
                      <span className="text-orange-100">Bij verzending (30%)</span>
                      <span className="font-semibold">€{(totals.commission * 0.3).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-orange-100">Selecteer producten om je commissie te zien</p>
              )}
            </div>

            {/* Price Summary */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gray-500" />
                Prijs voor klant
              </h3>
              
              <div className="space-y-2 mb-4">
                {internet && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{INTERNET_PLANS.find(p => p.id === internet)?.name}</span>
                    <span className="font-medium">€{INTERNET_PLANS.find(p => p.id === internet)?.packPrice}/mnd</span>
                  </div>
                )}
                {mobileLines.map((line, idx) => line.plan && (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-600">GSM {idx + 1}</span>
                    <span className="font-medium">€{MOBILE_PLANS.find(p => p.id === line.plan)?.price}/mnd</span>
                  </div>
                ))}
                {tv && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{TV_OPTIONS.find(p => p.id === tv)?.name}</span>
                    <span className="font-medium">
                      {TV_OPTIONS.find(p => p.id === tv)?.price === 0 ? 'Inbegrepen' : `€${TV_OPTIONS.find(p => p.id === tv)?.price}/mnd`}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-baseline justify-between">
                  <span className="text-gray-700">Totaal / maand</span>
                  <span className="text-3xl font-bold text-gray-900">€{totals.monthly.toFixed(2)}</span>
                </div>
              </div>

              {internet && mobileLines.some(l => l.plan) && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-700">Pakketkorting toegepast!</span>
                </div>
              )}
            </div>

            {/* Quick Templates */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Snelle Pakketten</h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setInternet('GIGA');
                    setInternetInstall('EASY_SWITCH');
                    setMobileLines([{ plan: 'UNLIMITED', portability: true }]);
                    setTv('TV_PLUS');
                  }}
                  className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all"
                >
                  <p className="font-medium text-gray-900">Premium Pakket</p>
                  <p className="text-xs text-gray-500">Giga + Unlimited + TV+</p>
                </button>
                <button
                  onClick={() => {
                    setInternet('ZEN');
                    setInternetInstall('NEW');
                    setMobileLines([{ plan: 'MEDIUM', portability: false }]);
                    setTv(null);
                  }}
                  className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all"
                >
                  <p className="font-medium text-gray-900">Standaard Pakket</p>
                  <p className="text-xs text-gray-500">Zen + Medium</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PremiumLayout>
  );
}

// Wrap with Suspense for useSearchParams
export default function CalculatorPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    }>
      <CalculatorContent />
    </Suspense>
  );
}
