'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  PageContainer, 
  PageHeader, 
  SmartCard, 
  ActionButton,
} from '@/components/design-system/page-container';
import { 
  calculateTariff, 
  formatEuro as formatPrice,
  type MobileLine,
  MOBILE_PRICES_STANDALONE,
  MOBILE_PRICES_STANDALONE_2PLUS,
  MOBILE_PRICES_PACK_1,
  MOBILE_PRICES_PACK_2PLUS,
} from '@/lib/tariff-engine';
import { 
  Calculator, 
  TrendingDown,
  Wifi,
  Smartphone,
  Tv,
  Plus,
  Trash2,
  Zap,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Euro,
  Gift,
  Loader2,
  Wallet,
  Search,
  X,
  Building2,
  MapPin,
  Phone,
  ZapIcon
} from 'lucide-react';
import { getCommissionPreview } from '@/lib/commission';

const internetPlans = [
  { value: '', label: 'Geen internet', price: 0, download: 0 },
  { value: 'START', label: 'Start Fiber', price: 5300, download: 200 },
  { value: 'ZEN', label: 'Zen Fiber', price: 6200, download: 500 },
  { value: 'GIGA', label: 'Giga Fiber', price: 7200, download: 1000 },
];

const tvPlans = [
  { value: '', label: 'Geen TV', price: 0 },
  { value: 'TV_LIFE', label: 'Orange TV Life (App)', price: 1000 },
  { value: 'TV', label: 'Orange TV (met decoder)', price: 2000 },
  { value: 'TV_PLUS', label: 'Orange TV Plus (Netflix)', price: 3200 },
];

interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  city: string;
  phone: string;
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default function CalculatorPage() {
  const router = useRouter();
  const [internetPlan, setInternetPlan] = useState('');
  const [isSecondAddress, setIsSecondAddress] = useState(false);
  const [mobileLines, setMobileLines] = useState<MobileLine[]>([]);
  const [tvPlan, setTvPlan] = useState('');
  const [currentMonthlyCost, setCurrentMonthlyCost] = useState('');
  const [creatingOffer, setCreatingOffer] = useState(false);
  
  // NEW: Internet installation type
  const [internetInstallType, setInternetInstallType] = useState<'NEW' | 'EASY_SWITCH' | null>(null);
  
  // Lead selection
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadSearch, setLeadSearch] = useState('');
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [searchResults, setSearchResults] = useState<Lead[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Extras
  const [hasVasteLijn, setHasVasteLijn] = useState(false);
  const [hasMyComfort, setHasMyComfort] = useState(false);
  const [wifiBoosters, setWifiBoosters] = useState(0);
  const [extraDecoders, setExtraDecoders] = useState(0);

  const hasInternet = !!internetPlan;
  const hasMobile = mobileLines.length > 0;

  // Debounced search
  const debouncedSearch = useDebounce(leadSearch, 300);

  // Live search API
  useEffect(() => {
    async function searchLeads() {
      if (!debouncedSearch || debouncedSearch.length < 2) {
        setSearchResults([]);
        return;
      }
      
      try {
        setIsSearching(true);
        const res = await fetch(`/api/leads/search?q=${encodeURIComponent(debouncedSearch)}&limit=10`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.leads || []);
        }
      } catch (error) {
        console.error('Error searching leads:', error);
      } finally {
        setIsSearching(false);
      }
    }
    searchLeads();
  }, [debouncedSearch]);

  // Fetch all leads on mount (fallback)
  useEffect(() => {
    async function fetchLeads() {
      try {
        setLoadingLeads(true);
        const res = await fetch('/api/leads?limit=100');
        if (res.ok) {
          const data = await res.json();
          setLeads(data.leads || []);
        }
      } catch (error) {
        console.error('Error fetching leads:', error);
      } finally {
        setLoadingLeads(false);
      }
    }
    fetchLeads();
  }, []);

  const result = useMemo(() => {
    if (!hasInternet && !hasMobile) return null;
    
    return calculateTariff({
      internetPlan: (internetPlan as any) || 'START',
      isSecondAddress,
      hasMobile,
      mobileLines,
      tvPlan: (tvPlan as any) || 'NONE',
      hasVasteLijn,
      hasMyComfort,
      wifiBoosters,
      extraDecoders,
      currentMonthlyCost: parseFloat(currentMonthlyCost) || 0,
    });
  }, [internetPlan, isSecondAddress, mobileLines, tvPlan, currentMonthlyCost, hasInternet, hasMobile, hasVasteLijn, hasMyComfort, wifiBoosters, extraDecoders]);

  // Calculate commission preview
  const commissionPreview = useMemo(() => {
    if (!result) return null;

    const products = [];
    
    if (internetPlan) {
      products.push({
        type: 'INTERNET' as const,
        plan: internetPlan,
        retailValue: result.internetPrice,
        options: { 
          convergence: hasMobile,
          portability: internetInstallType === 'EASY_SWITCH' // NEW: Internet portability
        },
      });
    }
    
    mobileLines.forEach((line) => {
      products.push({
        type: 'MOBILE' as const,
        plan: line.plan,
        retailValue: result.mobilePrice / mobileLines.length,
        options: {
          portability: line.isPortability,
          convergence: hasInternet,
        },
      });
    });
    
    if (tvPlan) {
      products.push({
        type: 'TV' as const,
        plan: tvPlan,
        retailValue: result.tvPrice,
      });
    }

    return getCommissionPreview(products, 'BC');
  }, [result, internetPlan, mobileLines, tvPlan, hasInternet, internetInstallType]);

  const addMobileLine = () => {
    setMobileLines([...mobileLines, { plan: 'MEDIUM', isPortability: false }]);
  };

  const removeMobileLine = (index: number) => {
    setMobileLines(mobileLines.filter((_, i) => i !== index));
  };

  const updateMobileLine = (index: number, updates: Partial<MobileLine>) => {
    const newLines = [...mobileLines];
    newLines[index] = { ...newLines[index], ...updates };
    setMobileLines(newLines);
  };

  // Create offer via API
  async function createOffer() {
    if (!result || !commissionPreview || !selectedLead) {
      setShowLeadModal(true);
      return;
    }
    
    // NEW: Check if internet installation type is selected
    if (hasInternet && !internetInstallType) {
      alert('Selecteer of het een nieuwe installatie of easy switch is voor het internet.');
      return;
    }
    
    try {
      setCreatingOffer(true);
      
      const products = [];
      
      if (internetPlan) {
        products.push({
          type: 'INTERNET',
          plan: internetPlan,
          retailValue: result.internetPrice,
          aspValue: 15,
          options: { 
            convergence: hasMobile,
            portability: internetInstallType === 'EASY_SWITCH'
          },
        });
      }
      
      mobileLines.forEach((line) => {
        const aspValues: Record<string, number> = {
          'CHILD': 1, 'SMALL': 5, 'MEDIUM': 10, 'LARGE': 15, 'UNLIMITED': 20,
        };
        
        products.push({
          type: 'MOBILE',
          plan: line.plan,
          retailValue: result.mobilePrice / mobileLines.length,
          aspValue: aspValues[line.plan] || 10,
          options: {
            portability: line.isPortability,
            convergence: hasInternet,
          },
        });
      });
      
      if (tvPlan) {
        products.push({
          type: 'TV',
          plan: tvPlan,
          retailValue: result.tvPrice,
          aspValue: 5,
        });
      }

      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: selectedLead.id,
          products,
          totalRetail: result.totalMonthly,
          totalASP: commissionPreview.breakdown.reduce((sum, b) => sum + (b.baseCommission > 0 ? 10 : 0), 0),
          customerSavings: result.savings6Months || 0,
        }),
      });

      if (!res.ok) throw new Error('Failed to create offer');
      
      router.push('/offers');
    } catch (error) {
      console.error('Error creating offer:', error);
      alert('Kon offerte niet aanmaken. Probeer opnieuw.');
    } finally {
      setCreatingOffer(false);
    }
  }

  const getMobilePlanOptions = (lineIndex: number, totalLines: number) => {
    const isMultiLine = totalLines >= 2;
    const isFirstLine = lineIndex === 0;
    
    const plans = [];
    
    if (!isFirstLine) {
      plans.push({ value: 'CHILD', label: 'Child (3GB)', price: 500 });
    }
    
    if (hasInternet) {
      if (isMultiLine) {
        plans.push(
          { value: 'SMALL', label: 'Small (12GB)', price: MOBILE_PRICES_PACK_2PLUS.SMALL },
          { value: 'MEDIUM', label: 'Medium (70GB)', price: MOBILE_PRICES_PACK_2PLUS.MEDIUM },
          { value: 'LARGE', label: 'Large (140GB)', price: MOBILE_PRICES_PACK_2PLUS.LARGE },
          { value: 'UNLIMITED', label: 'Unlimited', price: MOBILE_PRICES_PACK_2PLUS.UNLIMITED }
        );
      } else {
        plans.push(
          { value: 'SMALL', label: 'Small (12GB)', price: MOBILE_PRICES_PACK_1.SMALL },
          { value: 'MEDIUM', label: 'Medium (70GB)', price: MOBILE_PRICES_PACK_1.MEDIUM },
          { value: 'LARGE', label: 'Large (140GB)', price: MOBILE_PRICES_PACK_1.LARGE },
          { value: 'UNLIMITED', label: 'Unlimited', price: MOBILE_PRICES_PACK_1.UNLIMITED }
        );
      }
    } else {
      if (isMultiLine) {
        plans.push(
          { value: 'SMALL', label: 'Small (12GB)', price: MOBILE_PRICES_STANDALONE_2PLUS.SMALL },
          { value: 'MEDIUM', label: 'Medium (70GB)', price: MOBILE_PRICES_STANDALONE_2PLUS.MEDIUM },
          { value: 'LARGE', label: 'Large (140GB)', price: MOBILE_PRICES_STANDALONE_2PLUS.LARGE },
          { value: 'UNLIMITED', label: 'Unlimited', price: MOBILE_PRICES_STANDALONE_2PLUS.UNLIMITED }
        );
      } else {
        plans.push(
          { value: 'SMALL', label: 'Small (12GB)', price: MOBILE_PRICES_STANDALONE.SMALL },
          { value: 'MEDIUM', label: 'Medium (70GB)', price: MOBILE_PRICES_STANDALONE.MEDIUM },
          { value: 'LARGE', label: 'Large (140GB)', price: MOBILE_PRICES_STANDALONE.LARGE },
          { value: 'UNLIMITED', label: 'Unlimited', price: MOBILE_PRICES_STANDALONE.UNLIMITED }
        );
      }
    }
    
    return plans;
  };

  return (
    <PageContainer>
      <PageHeader
        title="Prijs Calculator"
        subtitle="Bereken de perfecte prijs en commissie voor je klant"
        icon={<Calculator className="w-6 h-6 text-white" />}
        action={
          <ActionButton href="/dashboard" variant="secondary" icon={<ArrowLeft className="w-4 h-4" />}>
            Dashboard
          </ActionButton>
        }
      />

      {/* Lead Selection Modal */}
      {showLeadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Kies een lead</h2>
                <p className="text-gray-500">Selecteer voor welke klant je de offerte maakt</p>
              </div>
              <button 
                onClick={() => setShowLeadModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Zoek op bedrijf, contact of stad..."
                  value={leadSearch}
                  onChange={(e) => setLeadSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  autoFocus
                />
                {isSearching && (
                  <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-orange-500" />
                )}
              </div>
              
              {/* Live Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
                  {searchResults.map((lead) => (
                    <button
                      key={lead.id}
                      onClick={() => {
                        setSelectedLead(lead);
                        setShowLeadModal(false);
                        setLeadSearch('');
                        setSearchResults([]);
                      }}
                      className="w-full p-3 text-left hover:bg-orange-50 border-b border-gray-100 last:border-0 flex items-center gap-3"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {lead.companyName[0]}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{lead.companyName}</p>
                        <p className="text-sm text-gray-500">{lead.contactName} • {lead.city}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </button>
                  ))}
                </div>
              )}
              
              {leadSearch.length >= 2 && !isSearching && searchResults.length === 0 && (
                <p className="mt-2 text-sm text-gray-500">Geen leads gevonden voor "{leadSearch}"</p>
              )}
            </div>

            <div className="flex-1 overflow-auto p-4">
              {loadingLeads ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                </div>
              ) : leads.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">Geen leads gevonden</p>
                  <Link 
                    href="/leads" 
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                  >
                    <Plus className="w-4 h-4" />
                    Nieuwe lead toevoegen
                  </Link>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-500 mb-3">Alle leads ({leads.length})</p>
                  <div className="space-y-2">
                    {leads.slice(0, 10).map((lead) => (
                      <button
                        key={lead.id}
                        onClick={() => {
                          setSelectedLead(lead);
                          setShowLeadModal(false);
                        }}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                          selectedLead?.id === lead.id
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold">
                            {lead.companyName[0]}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{lead.companyName}</h3>
                            <p className="text-sm text-gray-500">{lead.contactName}</p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                              <MapPin className="w-3 h-3" />
                              {lead.city || 'Onbekend'}
                            </div>
                          </div>
                          {selectedLead?.id === lead.id && (
                            <CheckCircle2 className="w-6 h-6 text-orange-500" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Input */}
          <div className="lg:col-span-2 space-y-6">
            {/* Selected Lead Card */}
            {selectedLead ? (
              <div className="bg-gradient-to-r from-orange-500 to-pink-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-2xl font-bold">
                      {selectedLead.companyName[0]}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{selectedLead.companyName}</h3>
                      <p className="text-orange-100">{selectedLead.contactName}</p>
                      <div className="flex items-center gap-3 mt-1 text-sm text-orange-200">
                        <MapPin className="w-4 h-4" />
                        {selectedLead.city || 'Onbekend'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowLeadModal(true)}
                    className="px-4 py-2 bg-white/20 rounded-lg text-sm hover:bg-white/30 transition-colors"
                  >
                    Wijzig
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowLeadModal(true)}
                className="w-full p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl text-center hover:border-orange-400 hover:bg-orange-50 transition-colors"
              >
                <Building2 className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                <h3 className="font-semibold text-gray-700">Kies een lead</h3>
                <p className="text-sm text-gray-500 mt-1">Selecteer eerst voor welke klant je de offerte maakt</p>
              </button>
            )}

            {/* Current Cost */}
            <SmartCard className="border-l-4 border-l-blue-500">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Euro className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Huidige Maandkosten</h3>
                    <p className="text-sm text-gray-500">Wat betaalt de klant nu per maand?</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 max-w-xs">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">€</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={currentMonthlyCost}
                      onChange={(e) => setCurrentMonthlyCost(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>
                  <span className="text-gray-500">/maand</span>
                </div>
              </div>
            </SmartCard>

            {/* Internet */}
            <SmartCard className="border-l-4 border-l-orange-500">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Wifi className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Internet</h3>
                    <p className="text-sm text-gray-500">Kies het perfecte internet pakket</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                  {internetPlans.filter(p => p.value).map((plan) => (
                    <button
                      key={plan.value}
                      onClick={() => {
                        setInternetPlan(plan.value);
                        setInternetInstallType(null); // Reset when changing plan
                      }}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        internetPlan === plan.value
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">{plan.label}</span>
                        {internetPlan === plan.value && <CheckCircle2 className="w-5 h-5 text-orange-500" />}
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        €{((plan.price - (hasMobile ? 400 : 0)) / 100).toFixed(0)}
                        <span className="text-sm font-normal text-gray-500">/maand</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{plan.download} Mbps</p>
                    </button>
                  ))}
                </div>

                {/* NEW: Internet Installation Type */}
                {hasInternet && (
                  <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <ZapIcon className="w-5 h-5 text-orange-600" />
                      <h4 className="font-semibold text-gray-900">Type installatie</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Is dit een nieuwe installatie of easy switch (nummerbehoud)?</p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setInternetInstallType('NEW')}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          internetInstallType === 'NEW'
                            ? 'border-orange-500 bg-white'
                            : 'border-gray-200 bg-white hover:border-orange-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">Nieuwe installatie</span>
                          {internetInstallType === 'NEW' && <CheckCircle2 className="w-5 h-5 text-orange-500" />}
                        </div>
                        <p className="text-sm text-gray-500">Nieuwe aansluiting</p>
                      </button>
                      <button
                        onClick={() => setInternetInstallType('EASY_SWITCH')}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          internetInstallType === 'EASY_SWITCH'
                            ? 'border-orange-500 bg-white'
                            : 'border-gray-200 bg-white hover:border-orange-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">Easy Switch</span>
                          {internetInstallType === 'EASY_SWITCH' && <CheckCircle2 className="w-5 h-5 text-orange-500" />}
                        </div>
                        <p className="text-sm text-gray-500">Nummerbehoud (+€12 commissie)</p>
                      </button>
                    </div>
                  </div>
                )}

                {hasInternet && (
                  <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors mt-4">
                    <input
                      type="checkbox"
                      checked={isSecondAddress}
                      onChange={(e) => setIsSecondAddress(e.target.checked)}
                      className="w-5 h-5 text-orange-600 rounded-lg"
                    />
                    <div>
                      <div className="font-medium text-gray-900">2de Adres</div>
                      <div className="text-sm text-gray-500">-€10 korting op je internetprijs</div>
                    </div>
                  </label>
                )}
              </div>
            </SmartCard>

            {/* Mobile */}
            <SmartCard className="border-l-4 border-l-blue-500">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Mobiel</h3>
                      <p className="text-sm text-gray-500">Voeg mobiele lijnen toe</p>
                    </div>
                  </div>
                  <ActionButton onClick={addMobileLine} size="sm" icon={<Plus className="w-4 h-4" />}>
                    GSM toevoegen
                  </ActionButton>
                </div>

                {mobileLines.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <Smartphone className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500">Voeg mobiele lijnen toe</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {mobileLines.map((line, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            <span className="font-medium text-gray-900">GSM #{index + 1}</span>
                          </div>
                          <button
                            onClick={() => removeMobileLine(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <select
                            className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                            value={line.plan}
                            onChange={(e) => updateMobileLine(index, { plan: e.target.value as any })}
                          >
                            {getMobilePlanOptions(index, mobileLines.length).map((plan) => (
                              <option key={plan.value} value={plan.value}>
                                {plan.label} - {formatPrice(plan.price)}
                              </option>
                            ))}
                          </select>

                          <label className="flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-200 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={line.isPortability}
                              onChange={(e) => updateMobileLine(index, { isPortability: e.target.checked })}
                              className="w-4 h-4 text-blue-600 rounded"
                            />
                            <span className="text-sm">Nummerbehoud (+€20)</span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {mobileLines.length >= 2 && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-3 text-green-800">
                      <Gift className="w-5 h-5" />
                      <div>
                        <strong>Multi-line korting toegepast!</strong>
                        <p className="text-sm">Alle {mobileLines.length} lijnen krijgen de 2+ prijs</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </SmartCard>

            {/* TV */}
            <SmartCard className="border-l-4 border-l-purple-500">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Tv className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">TV (optioneel)</h3>
                    <p className="text-sm text-gray-500">Voeg TV toe aan je pakket (+€10 commissie)</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {tvPlans.map((plan) => (
                    <button
                      key={plan.value}
                      onClick={() => setTvPlan(plan.value)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        tvPlan === plan.value
                          ? 'border-purple-500 bg-purple-50'
                          : plan.value === ''
                          ? 'border-gray-200 bg-gray-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{plan.label}</span>
                        {tvPlan === plan.value && <CheckCircle2 className="w-5 h-5 text-purple-500" />}
                      </div>
                      {plan.price > 0 && (
                        <p className="text-xl font-bold text-gray-900">
                          {formatPrice(plan.price)}
                          <span className="text-sm font-normal text-gray-500">/maand</span>
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </SmartCard>

            {/* Extras */}
            {hasInternet && (
              <SmartCard className="border-l-4 border-l-yellow-500">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                      <Zap className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Extras & Opties</h3>
                      <p className="text-sm text-gray-500">Voeg extra diensten toe</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Vaste Lijn */}
                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={hasVasteLijn}
                          onChange={(e) => setHasVasteLijn(e.target.checked)}
                          className="w-5 h-5 text-orange-600 rounded-lg"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Vaste Lijn</div>
                          <div className="text-sm text-gray-500">Onbeperkt bellen in België</div>
                        </div>
                      </div>
                      <span className="font-semibold text-gray-900">€12/maand</span>
                    </label>

                    {/* My Comfort */}
                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={hasMyComfort}
                          onChange={(e) => setHasMyComfort(e.target.checked)}
                          className="w-5 h-5 text-orange-600 rounded-lg"
                        />
                        <div>
                          <div className="font-medium text-gray-900">My Comfort</div>
                          <div className="text-sm text-gray-500">
                            {internetPlan === 'GIGA' ? '€5/maand (gratis bij Giga)' : '€10/maand'}
                          </div>
                        </div>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {internetPlan === 'GIGA' ? '€5/maand' : '€10/maand'}
                      </span>
                    </label>

                    {/* WiFi Boosters */}
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-medium text-gray-900">WiFi Boosters</div>
                          <div className="text-sm text-gray-500">€3 per booster</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setWifiBoosters(Math.max(0, wifiBoosters - 1))}
                            className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-semibold">{wifiBoosters}</span>
                          <button
                            onClick={() => setWifiBoosters(wifiBoosters + 1)}
                            className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Extra Decoders */}
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-medium text-gray-900">Extra TV Decoders</div>
                          <div className="text-sm text-gray-500">€9 per decoder</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setExtraDecoders(Math.max(0, extraDecoders - 1))}
                            className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-semibold">{extraDecoders}</span>
                          <button
                            onClick={() => setExtraDecoders(extraDecoders + 1)}
                            className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SmartCard>
            )}
          </div>

          {/* Right Column - Results */}
          <div>
            <div className="sticky top-24 space-y-4">
              {result ? (
                <>
                  {/* Customer Savings Card */}
                  <SmartCard className="bg-gradient-to-br from-green-600 to-emerald-700 text-white border-0">
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <TrendingDown className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">Klant Voordeel</h3>
                          <p className="text-green-100 text-sm">Wat de klant bespaart</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-4 bg-white/10 rounded-xl">
                          <p className="text-green-100 text-sm">Nu</p>
                          <p className="text-2xl font-bold">
                            {formatPrice((parseFloat(currentMonthlyCost) || 0) * 100)}
                          </p>
                        </div>
                        <div className="p-4 bg-white/20 rounded-xl">
                          <p className="text-green-100 text-sm">Met SmartSN</p>
                          <p className="text-2xl font-bold">{formatPrice(result.totalMonthly)}</p>
                        </div>
                      </div>

                      <div className="text-center p-6 bg-white/10 rounded-2xl">
                        <p className="text-green-100 mb-1">Nieuwe Maandprijs</p>
                        <p className="text-5xl font-bold">{formatPrice(result.totalMonthly)}</p>
                        <p className="text-green-200 text-sm mt-1">per maand</p>
                      </div>

                      {result.savings24Months && result.savings24Months > 0 && (
                        <div className="p-4 bg-white/10 rounded-xl mt-4">
                          <p className="text-green-100 text-sm mb-1">Besparing op 2 jaar</p>
                          <p className="text-3xl font-bold">{formatPrice(result.savings24Months)}</p>
                        </div>
                      )}
                    </div>
                  </SmartCard>

                  {/* Commission Preview Card */}
                  {commissionPreview && commissionPreview.effective > 0 && (
                    <SmartCard className="bg-gradient-to-br from-orange-500 to-pink-600 text-white border-0">
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <Wallet className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">Jouw Commissie</h3>
                            <p className="text-orange-100 text-sm">Bij verkoop van dit pakket</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {/* Potential Commission */}
                          <div className="p-4 bg-white/10 rounded-xl">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-orange-100 text-sm">Potentiële commissie</p>
                                <p className="text-xs text-orange-200">Bij versturen offerte</p>
                              </div>
                              <p className="text-2xl font-bold">
                                €{commissionPreview.potential.toFixed(0)}
                              </p>
                            </div>
                          </div>

                          {/* Effective Commission */}
                          <div className="p-4 bg-white/20 rounded-xl border-2 border-white/30">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-orange-100 text-sm">Effectieve commissie</p>
                                <p className="text-xs text-orange-200">Bij tekenen klant</p>
                              </div>
                              <p className="text-3xl font-bold">
                                €{commissionPreview.effective.toFixed(0)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Commission Breakdown */}
                        <div className="mt-4 pt-4 border-t border-white/20 text-sm">
                          <p className="text-orange-200 mb-2">Opbouw:</p>
                          {internetPlan && (
                            <div className="flex justify-between text-orange-100">
                              <span>Internet {internetInstallType === 'EASY_SWITCH' ? '(Easy Switch)' : '(Nieuw)'}</span>
                              <span>€15{internetInstallType === 'EASY_SWITCH' ? ' + €12' : ''}</span>
                            </div>
                          )}
                          {mobileLines.map((line, idx) => (
                            <div key={idx} className="flex justify-between text-orange-100">
                              <span>GSM #{idx + 1} ({line.plan})</span>
                              <span>
                                €{line.plan === 'CHILD' ? 1 : line.plan === 'SMALL' ? 10 : line.plan === 'MEDIUM' ? 35 : line.plan === 'LARGE' ? 50 : 60}
                                {line.isPortability ? ' + €20' : ''}
                              </span>
                            </div>
                          ))}
                          {tvPlan && (
                            <div className="flex justify-between text-orange-100">
                              <span>TV</span>
                              <span>€10</span>
                            </div>
                          )}
                          {hasInternet && hasMobile && mobileLines.some(l => ['MEDIUM', 'LARGE', 'UNLIMITED'].includes(l.plan)) && (
                            <div className="flex justify-between text-orange-100">
                              <span>Convergentie bonus</span>
                              <span>
                                €{(12 + 15) * mobileLines.filter(l => ['MEDIUM', 'LARGE', 'UNLIMITED'].includes(l.plan)).length}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </SmartCard>
                  )}

                  {/* Price Breakdown */}
                  <SmartCard className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-4">Prijsopbouw</h4>
                    <div className="space-y-3">
                      {result.internetPrice > 0 && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">Internet {internetInstallType === 'EASY_SWITCH' ? '(Easy Switch)' : ''}</span>
                          <span className="font-semibold">{formatPrice(result.internetPrice)}</span>
                        </div>
                      )}
                      {result.mobilePrice > 0 && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">Mobiel ({mobileLines.length} lijnen)</span>
                          <span className="font-semibold">{formatPrice(result.mobilePrice)}</span>
                        </div>
                      )}
                      {result.tvPrice > 0 && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">TV</span>
                          <span className="font-semibold">{formatPrice(result.tvPrice)}</span>
                        </div>
                      )}
                      {result.addonsPrice > 0 && (
                        <div className="py-2 border-b border-gray-100">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Extras</span>
                            <span className="font-semibold">{formatPrice(result.addonsPrice)}</span>
                          </div>
                        </div>
                      )}
                      <div className="flex justify-between items-center pt-2 text-lg font-bold">
                        <span>Totaal</span>
                        <span>{formatPrice(result.totalMonthly)}</span>
                      </div>
                    </div>
                  </SmartCard>

                  {/* CTA Button */}
                  <button
                    onClick={createOffer}
                    disabled={creatingOffer || !selectedLead || (hasInternet && !internetInstallType)}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creatingOffer ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Offerte aanmaken...
                      </>
                    ) : !selectedLead ? (
                      <>
                        <Building2 className="w-5 h-5" />
                        Kies eerst een lead
                      </>
                    ) : hasInternet && !internetInstallType ? (
                      <>
                        <ZapIcon className="w-5 h-5" />
                        Selecteer installatie type
                      </>
                    ) : (
                      <>
                        <ArrowRight className="w-5 h-5" />
                        Maak Offerte voor {selectedLead.companyName}
                      </>
                    )}
                  </button>
                </>
              ) : (
                <SmartCard className="bg-gray-100 border-2 border-dashed border-gray-300">
                  <div className="p-8 text-center">
                    <Calculator className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500 font-medium">Voeg producten toe</p>
                    <p className="text-sm text-gray-400 mt-1">De prijs wordt automatisch berekend</p>
                  </div>
                </SmartCard>
              )}
            </div>
          </div>
        </div>
      </main>
    </PageContainer>
  );
}
