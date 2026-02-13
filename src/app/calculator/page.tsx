'use client';

import { useState, useEffect } from 'react';
import { PremiumLayout } from '@/components/design-system/premium-layout';
import { 
  Search, 
  Plus, 
  Minus, 
  Wifi, 
  Smartphone, 
  Tv, 
  Zap,
  ChevronDown,
  ArrowRight,
  Euro,
  TrendingUp,
  ShoppingCart,
  CheckCircle2,
  Loader2,
  FileText,
  User,
  Building2,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  CreditCard,
  X
} from 'lucide-react';
import Link from 'next/link';
import { calculateOfferCommission, formatEuro, type Product } from '@/lib/commission';

// ============================================
// ORANGE PRICES - What Customer Pays
// Source: Price List Document
// ============================================
const ORANGE_INTERNET = [
  { 
    id: 'START', 
    name: 'Internet Start', 
    standalonePrice: 53.00,  // Customer pays this (no mobile)
    packPrice: 49.00,        // Customer pays this (with mobile pack)
    speed: '100 Mbps',
    speedDown: 100,
    speedUp: 25,
    features: ['100 Mbps down / 25 Mbps up']
  },
  { 
    id: 'ZEN', 
    name: 'Internet Zen', 
    standalonePrice: 62.00,
    packPrice: 58.00,
    speed: '300 Mbps',
    speedDown: 300,
    speedUp: 50,
    features: ['300 Mbps down / 50 Mbps up']
  },
  { 
    id: 'GIGA', 
    name: 'Internet Giga', 
    standalonePrice: 72.00,
    packPrice: 68.00,
    speed: '1 Gbps',
    speedDown: 1000,
    speedUp: 100,
    features: ['1 Gbps down / 100 Mbps up']
  },
];

const ORANGE_MOBILE = [
  { id: 'CHILD', name: 'Child', standalonePrice: 0, packPrice: 0, data: '1 GB', unlimitedCalls: false, unlimitedSMS: false, features: ['1 GB data', '150 min bellen', '150 SMS'] },
  { id: 'SMALL', name: 'Small', standalonePrice: 16, packPrice: 11.50, data: '5 GB', unlimitedCalls: false, unlimitedSMS: false, features: ['5 GB data', '200 min bellen', '200 SMS'] },
  { id: 'MEDIUM', name: 'Medium', standalonePrice: 26, packPrice: 16.50, data: '20 GB', unlimitedCalls: true, unlimitedSMS: true, features: ['20 GB data', 'Onbeperkt bellen', 'Onbeperkt SMS'] },
  { id: 'LARGE', name: 'Large', standalonePrice: 32, packPrice: 21.50, data: '40 GB', unlimitedCalls: true, unlimitedSMS: true, features: ['40 GB data', 'Onbeperkt bellen', 'Onbeperkt SMS'] },
  { id: 'UNLIMITED', name: 'Unlimited', standalonePrice: 42, packPrice: 32.00, data: 'Unlimited', unlimitedCalls: true, unlimitedSMS: true, features: ['Onbeperkte data', 'Onbeperkt bellen', 'Onbeperkt SMS'] },
];

const TV_OPTIONS = [
  { id: 'TV', name: 'Orange TV', price: 0, features: ['Basis TV'] },
  { id: 'TV_PLUS', name: 'Orange TV+', price: 32, features: ['TV + Play', 'Netflix'] },
  { id: 'TV_LIFE', name: 'Orange TV Life', price: 42, features: ['TV + Extra', 'Netflix', 'Apple TV'] },
];

const ENERGY_OPTIONS = [
  { id: 'RESIDENTIEEL', name: 'Residentieel', features: ['Elektriciteit', 'Gas'] },
  { id: 'SOHO', name: 'SoHo', features: ['Zakelijke energie', 'BTW aftrekbaar'] },
];

interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  city: string;
  phone: string;
  email: string;
}

export default function CalculatorPage() {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Lead[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  
  // Selected lead
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  // Product selection
  const [internetPlan, setInternetPlan] = useState<string | null>(null);
  const [internetInstallType, setInternetInstallType] = useState<'NEW' | 'EASY_SWITCH' | null>(null);
  const [mobileLines, setMobileLines] = useState<Array<{ plan: string; portability: boolean }>>([]);
  const [tvPlan, setTvPlan] = useState<string | null>(null);
  const [energyPlan, setEnergyPlan] = useState<string | null>(null);
  
  // Price calculation state
  const [totalPrice, setTotalPrice] = useState(0);
  const [commission, setCommission] = useState({ potential: 0, effective: 0, breakdown: [] as any[] });
  
  // Add mobile line
  const addMobileLine = () => {
    setMobileLines([...mobileLines, { plan: '', portability: false }]);
  };
  
  const removeMobileLine = (index: number) => {
    setMobileLines(mobileLines.filter((_, i) => i !== index));
  };
  
  const updateMobileLine = (index: number, field: 'plan' | 'portability', value: string | boolean) => {
    const updated = [...mobileLines];
    updated[index] = { ...updated[index], [field]: value };
    setMobileLines(updated);
  };
  
  // Calculate prices and commission
  useEffect(() => {
    // Check for convergence (pack discount applies if at least 1 mobile + internet)
    const hasConvergence = internetPlan && mobileLines.length > 0 && mobileLines.some(m => m.plan);
    
    // Calculate customer price
    let price = 0;
    
    // Internet price (pack or standalone)
    if (internetPlan) {
      const internet = ORANGE_INTERNET.find(i => i.id === internetPlan);
      if (internet) {
        price += hasConvergence ? internet.packPrice : internet.standalonePrice;
      }
    }
    
    // Mobile prices (pack or standalone)
    mobileLines.forEach(line => {
      if (line.plan) {
        const mobile = ORANGE_MOBILE.find(m => m.id === line.plan);
        if (mobile) {
          price += hasConvergence ? mobile.packPrice : mobile.standalonePrice;
        }
      }
    });
    
    // TV price
    if (tvPlan) {
      const tv = TV_OPTIONS.find(t => t.id === tvPlan);
      if (tv) price += tv.price;
    }
    
    setTotalPrice(price);
    
    // Calculate commission
    const products: Product[] = [];
    
    if (internetPlan) {
      products.push({
        type: 'INTERNET',
        plan: internetPlan,
        retailValue: 0, // Commission uses fixed base, not retail
        options: {
          convergence: hasConvergence || false,
          portability: internetInstallType === 'EASY_SWITCH'
        }
      });
    }
    
    mobileLines.forEach(line => {
      if (line.plan) {
        products.push({
          type: 'MOBILE',
          plan: line.plan,
          retailValue: 0,
          options: {
            portability: line.portability,
            convergence: hasConvergence || false
          }
        });
      }
    });
    
    if (tvPlan) {
      products.push({
        type: 'TV',
        plan: tvPlan,
        retailValue: 0,
        options: {}
      });
    }
    
    const commissionResult = calculateOfferCommission(products, 'BC', { hasConvergence: hasConvergence || false });
    setCommission({
      potential: commissionResult.potentialCommission,
      effective: commissionResult.effectiveCommission,
      breakdown: commissionResult.breakdown
    });
    
  }, [internetPlan, mobileLines, tvPlan, internetInstallType]);
  
  // Search for leads
  const searchLeads = async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const res = await fetch(`/api/leads/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.leads || []);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => searchLeads(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <PremiumLayout user={{ name: 'Lenny De K.' }}>
      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Zoek Lead</h2>
              <button onClick={() => setShowSearchModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Zoek op naam of bedrijf..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                autoFocus
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-gray-400" />
              )}
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {searchResults.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Geen resultaten gevonden</p>
              ) : (
                searchResults.map((lead) => (
                  <button
                    key={lead.id}
                    onClick={() => {
                      setSelectedLead(lead);
                      setShowSearchModal(false);
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    className="w-full text-left p-3 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{lead.companyName}</p>
                        <p className="text-sm text-gray-500">{lead.contactName} • {lead.city}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nieuwe Offerte</h1>
          <p className="text-gray-500 mt-1">Configureer de offerte voor je klant</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/v2-premium"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Annuleren
          </Link>
          <button
            disabled={!selectedLead || !internetPlan}
            className="flex items-center gap-2 px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileText className="w-4 h-4" />
            Offerte Opslaan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Lead & Products */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Lead Selection */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-orange-500" />
              Lead
            </h2>
            
            {selectedLead ? (
              <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                      {selectedLead.companyName[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedLead.companyName}</h3>
                      <p className="text-gray-600">{selectedLead.contactName}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {selectedLead.city}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {selectedLead.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowSearchModal(true)}
                    className="px-3 py-1.5 text-sm text-orange-600 bg-white border border-orange-200 rounded-lg hover:bg-orange-50"
                  >
                    Wijzig
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowSearchModal(true)}
                className="w-full p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all flex flex-col items-center gap-3"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-6 h-6 text-gray-400" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-700">Selecteer een lead</p>
                  <p className="text-sm text-gray-500">Zoek op naam, bedrijf of stad</p>
                </div>
              </button>
            )}
          </div>

          {/* Internet */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Wifi className="w-5 h-5 text-blue-500" />
                Internet
              </h2>
              {internetPlan && (
                <button
                  onClick={() => { setInternetPlan(null); setInternetInstallType(null); }}
                  className="text-sm text-red-500 hover:text-red-600"
                >
                  Verwijderen
                </button>
              )}
            </div>
            
            {!internetPlan ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {ORANGE_INTERNET.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setInternetPlan(plan.id)}
                    className="p-4 border border-gray-200 rounded-xl hover:border-orange-500 hover:shadow-md transition-all text-left"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">{plan.name}</span>
                      <span className="text-orange-600 font-bold">{plan.speed}</span>
                    </div>
                    <p className="text-sm text-gray-500">{plan.features[0]}</p>
                    <p className="text-lg font-bold text-gray-900 mt-2">€{plan.standalonePrice}/mnd</p>
                    <p className="text-xs text-green-600">€{plan.packPrice} in pack</p>
                  </button>
                ))}
              </div>
            ) : (
              <div>
                {(() => {
                  const plan = ORANGE_INTERNET.find(p => p.id === internetPlan)!;
                  return (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                        <div>
                          <p className="font-semibold text-gray-900">{plan.name}</p>
                          <p className="text-sm text-blue-600">{plan.speed}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">€{mobileLines.length > 0 ? plan.packPrice : plan.standalonePrice}/mnd</p>
                          {mobileLines.length > 0 && (
                            <p className="text-xs text-green-600">-€4 packkorting</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Installation Type */}
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Installatie Type</p>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => setInternetInstallType('NEW')}
                            className={`p-3 rounded-lg border text-left transition-colors ${
                              internetInstallType === 'NEW'
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <p className="font-medium">Nieuwe Aansluiting</p>
                            <p className="text-xs text-gray-500">Geen Easy Switch</p>
                          </button>
                          <button
                            onClick={() => setInternetInstallType('EASY_SWITCH')}
                            className={`p-3 rounded-lg border text-left transition-colors ${
                              internetInstallType === 'EASY_SWITCH'
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <p className="font-medium flex items-center gap-1">
                              Easy Switch
                              <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded">+€12</span>
                            </p>
                            <p className="text-xs text-gray-500">+€12 commissie bonus</p>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Mobile */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-purple-500" />
                Mobiele Abonnementen
                <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
                  +{mobileLines.length}
                </span>
              </h2>
              <button
                onClick={addMobileLine}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100"
              >
                <Plus className="w-4 h-4" />
                Toevoegen
              </button>
            </div>
            
            <div className="space-y-3">
              {mobileLines.map((line, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Lijn {index + 1}</span>
                    <button
                      onClick={() => removeMobileLine(index)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <select
                      value={line.plan}
                      onChange={(e) => updateMobileLine(index, 'plan', e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Kies abonnement</option>
                      {ORANGE_MOBILE.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} - {m.data} ({mobileLines.length > 0 && internetPlan ? `€${m.packPrice}` : `€${m.standalonePrice}`})
                        </option>
                      ))}
                    </select>
                    
                    {line.plan && ['MEDIUM', 'LARGE', 'UNLIMITED'].includes(line.plan) && (
                      <label className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={line.portability}
                          onChange={(e) => updateMobileLine(index, 'portability', e.target.checked)}
                          className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-700">Nummer overzetten</span>
                        <span className="ml-auto px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded">+€20</span>
                      </label>
                    )}
                  </div>
                  
                  {line.plan && (
                    <div className="mt-3 text-sm text-gray-500">
                      {(() => {
                        const mobile = ORANGE_MOBILE.find(m => m.id === line.plan)!;
                        return mobile.features.join(' • ');
                      })()}
                    </div>
                  )}
                </div>
              ))}
              
              {mobileLines.length === 0 && (
                <p className="text-center text-gray-400 py-4">Geen mobiele lijnen toegevoegd</p>
              )}
            </div>
          </div>

          {/* TV */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Tv className="w-5 h-5 text-pink-500" />
                TV Optie
              </h2>
              {tvPlan && (
                <button
                  onClick={() => setTvPlan(null)}
                  className="text-sm text-red-500 hover:text-red-600"
                >
                  Verwijderen
                </button>
              )}
            </div>
            
            {!tvPlan ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {TV_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setTvPlan(option.id)}
                    className="p-4 border border-gray-200 rounded-xl hover:border-orange-500 hover:shadow-md transition-all text-left"
                  >
                    <span className="font-semibold text-gray-900">{option.name}</span>
                    <p className="text-xs text-gray-500 mt-1">{option.features.join(' • ')}</p>
                    <p className="text-lg font-bold text-gray-900 mt-2">
                      {option.price > 0 ? `€${option.price}/mnd` : 'Inbegrepen'}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-pink-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {TV_OPTIONS.find(t => t.id === tvPlan)?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {TV_OPTIONS.find(t => t.id === tvPlan)?.features.join(' • ')}
                    </p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {TV_OPTIONS.find(t => t.id === tvPlan)?.price === 0 
                      ? 'Inbegrepen' 
                      : `€${TV_OPTIONS.find(t => t.id === tvPlan)?.price}/mnd`}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          {/* Commission Preview */}
          <div className="bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl p-6 text-white">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Jouw Commissie
            </h2>
            
            {commission.effective > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-orange-100">Bij verzending (30%)</span>
                  <span className="text-xl font-bold">{formatEuro(commission.potential)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-orange-100">Bij sale (100%)</span>
                  <span className="text-3xl font-bold">{formatEuro(commission.effective)}</span>
                </div>
                
                {/* Commission Breakdown */}
                {commission.breakdown.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <p className="text-sm text-orange-100 mb-2">Opbouw:</p>
                    <div className="space-y-1 text-sm">
                      {commission.breakdown.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-orange-100">
                          <span>{idx + 1}. {item.baseCommission > 0 && 'Basis'} {item.bonuses.convergence > 0 && '+ Convergentie'} {item.bonuses.portability > 0 && '+ Portability'}</span>
                          <span>€{item.total}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-orange-100">Selecteer producten om je commissie te zien</p>
            )}
          </div>

          {/* Price Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-gray-500" />
              Prijs Overzicht
            </h2>
            
            <div className="space-y-3">
              {/* Internet */}
              {internetPlan && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {ORANGE_INTERNET.find(i => i.id === internetPlan)?.name}
                  </span>
                  <span className="font-medium text-gray-900">
                    €{mobileLines.length > 0 ? ORANGE_INTERNET.find(i => i.id === internetPlan)?.packPrice : ORANGE_INTERNET.find(i => i.id === internetPlan)?.standalonePrice}/mnd
                  </span>
                </div>
              )}
              
              {/* Mobile */}
              {mobileLines.map((line, idx) => line.plan && (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    GSM {idx + 1}: {ORANGE_MOBILE.find(m => m.id === line.plan)?.name}
                  </span>
                  <span className="font-medium text-gray-900">
                    €{internetPlan ? ORANGE_MOBILE.find(m => m.id === line.plan)?.packPrice : ORANGE_MOBILE.find(m => m.id === line.plan)?.standalonePrice}/mnd
                  </span>
                </div>
              ))}
              
              {/* TV */}
              {tvPlan && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{TV_OPTIONS.find(t => t.id === tvPlan)?.name}</span>
                  <span className="font-medium text-gray-900">
                    {TV_OPTIONS.find(t => t.id === tvPlan)?.price === 0 ? 'Inbegrepen' : `€${TV_OPTIONS.find(t => t.id === tvPlan)?.price}/mnd`}
                  </span>
                </div>
              )}
              
              <div className="pt-3 border-t border-gray-100">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Totaal per maand</span>
                  <span className="text-2xl font-bold text-gray-900">€{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {/* Pack Savings */}
            {mobileLines.length > 0 && internetPlan && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Pakket voordeel: €{mobileLines.length * 4} per maand
                </p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Snelle Acties</h3>
            <div className="space-y-2">
              <button
                onClick={() => { setInternetPlan('GIGA'); setInternetInstallType('EASY_SWITCH'); }}
                className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all"
              >
                <p className="font-medium text-gray-900">Giga + Easy Switch</p>
                <p className="text-xs text-gray-500">1 Gbps + €12 bonus</p>
              </button>
              <button
                onClick={() => { addMobileLine(); updateMobileLine(mobileLines.length, 'plan', 'MEDIUM'); }}
                className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all"
              >
                <p className="font-medium text-gray-900">Medium + Portability</p>
                <p className="text-xs text-gray-500">20 GB + €20 bonus</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </PremiumLayout>
  );
}
