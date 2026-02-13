'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PremiumLayout } from '@/components/design-system/premium-layout';
import { 
  Wifi, 
  Smartphone, 
  Tv, 
  Plus, 
  Minus,
  Euro,
  ArrowLeft,
  Save,
  User,
  X,
  Loader2,
  TrendingUp,
  Home,
  Building2,
  CheckCircle2,
  Router,
  Settings,
  Monitor
} from 'lucide-react';
import Link from 'next/link';

// ============================================
// ORANGE BELGIË PRIJZEN - ZONDER PROMOTIES
// ============================================

// Internet zonder mobiel
const INTERNET_STANDALONE = {
  START: 53,
  ZEN: 62,
  GIGA: 72
};

// Internet met mobiel (convergentie)
const INTERNET_PACK = {
  START: 49,
  ZEN: 58,
  GIGA: 68
};

// Mobiel zonder internet
const MOBILE_STANDALONE = {
  CHILD: { price: 5, data: '3 GB', commission: 1 },
  SMALL: { price: 15, data: '12 GB', commission: 10 },
  MEDIUM: { price: 23, data: '70 GB', commission: 35 },
  LARGE: { price: 30, data: '140 GB', commission: 50 },
  UNLIMITED: { price: 40, data: 'Onbeperkt', commission: 60 }
};

// Mobiel 2+ zonder internet
const MOBILE_STANDALONE_2PLUS = {
  CHILD: { price: 5, data: '3 GB', commission: 1 },
  SMALL: { price: 14, data: '12 GB', commission: 10 },
  MEDIUM: { price: 21, data: '70 GB', commission: 35 },
  LARGE: { price: 26.50, data: '140 GB', commission: 50 },
  UNLIMITED: { price: 37, data: 'Onbeperkt', commission: 60 }
};

// Mobiel met internet (1 gsm)
const MOBILE_PACK_1 = {
  SMALL: { price: 12, data: '12 GB', commission: 10 },
  MEDIUM: { price: 17, data: '70 GB', commission: 35 },
  LARGE: { price: 22.50, data: '140 GB', commission: 50 },
  UNLIMITED: { price: 33, data: 'Onbeperkt', commission: 60 }
};

// Mobiel met internet (2+ gsm)
const MOBILE_PACK_2PLUS = {
  SMALL: { price: 11, data: '12 GB', commission: 10 },
  MEDIUM: { price: 15, data: '70 GB', commission: 35 },
  LARGE: { price: 20, data: '140 GB', commission: 50 },
  UNLIMITED: { price: 30, data: 'Onbeperkt', commission: 60 }
};

// TV opties (alleen met internet!)
const TV_OPTIONS = {
  LIFE: { name: 'Orange TV Life (App)', price: 10, commission: 10 },
  TV: { name: 'Orange TV (met decoder)', price: 20, commission: 10 },
  PLUS: { name: 'Orange TV Plus (Netflix)', price: 32, commission: 10 }
};

// Extra opties
const EXTRAS = {
  DECODER: { name: 'Extra decoder', price: 9 },
  WIFI_BOOSTER: { name: 'WiFi Booster', price: 3 },
  LANDLINE: { name: 'Vaste Lijn', price: 12 },
  COMFORT: { name: 'My Comfort', price: 10 }
};

// Commissie internet
const INTERNET_COMMISSION = 15;

interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  city: string;
}

const MOCK_LEADS: Record<string, Lead> = {
  'eba79e50-2f72-4cdf-8cca-6002af922a0f': {
    id: 'eba79e50-2f72-4cdf-8cca-6002af922a0f',
    companyName: 'Bakkerij De Lekkernij',
    contactName: 'Maria Peeters',
    city: 'Aalst'
  }
};

function CalculatorContent() {
  const searchParams = useSearchParams();
  const leadId = searchParams.get('lead');
  
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [currentCost, setCurrentCost] = useState<number>(0);
  
  // Internet
  const [internet, setInternet] = useState<string | null>(null);
  const [isSecondAddress, setIsSecondAddress] = useState(false);
  
  // Mobile
  const [mobileLines, setMobileLines] = useState<Array<{plan: string; portability: boolean}>>([]);
  
  // TV (alleen als internet geselecteerd!)
  const [tv, setTv] = useState<string | null>(null);
  const [extraDecoders, setExtraDecoders] = useState(0);
  
  // Extra opties (alleen als internet geselecteerd!)
  const [landline, setLandline] = useState(false);
  const [comfort, setComfort] = useState(false);
  const [wifiBoosters, setWifiBoosters] = useState(0);
  
  // Results
  const [results, setResults] = useState({
    newMonthly: 0,
    currentMonthly: 0,
    savings: 0,
    yearlySavings: 0,
    commission: 0
  });

  // Load lead
  useEffect(() => {
    if (leadId && MOCK_LEADS[leadId]) {
      setSelectedLead(MOCK_LEADS[leadId]);
    }
  }, [leadId]);

  // Calculate
  useEffect(() => {
    let total = 0;
    let commission = 0;

    // Internet
    if (internet) {
      const hasMobile = mobileLines.length > 0;
      let price = hasMobile ? INTERNET_PACK[internet as keyof typeof INTERNET_PACK] : INTERNET_STANDALONE[internet as keyof typeof INTERNET_STANDALONE];
      
      // 2de adres korting
      if (isSecondAddress) {
        price -= 10;
      }
      
      total += price;
      commission += INTERNET_COMMISSION;
      
      // Comfort korting bij Giga
      if (comfort && internet === 'GIGA') {
        total += 5; // €5 in plaats van €10
      } else if (comfort) {
        total += 10;
      }
    }

    // Mobile
    if (mobileLines.length > 0) {
      const hasInternet = !!internet;
      
      mobileLines.forEach((line, idx) => {
        if (!line.plan) return;
        
        let planData;
        
        if (hasInternet) {
          // Met internet
          if (mobileLines.length === 1) {
            planData = MOBILE_PACK_1[line.plan as keyof typeof MOBILE_PACK_1];
          } else {
            planData = MOBILE_PACK_2PLUS[line.plan as keyof typeof MOBILE_PACK_2PLUS];
          }
        } else {
          // Zonder internet
          if (mobileLines.length === 1) {
            planData = MOBILE_STANDALONE[line.plan as keyof typeof MOBILE_STANDALONE];
          } else {
            planData = MOBILE_STANDALONE_2PLUS[line.plan as keyof typeof MOBILE_STANDALONE_2PLUS];
          }
        }
        
        if (planData) {
          total += planData.price;
          commission += planData.commission;
          
          // Portability bonus
          if (line.portability && ['MEDIUM', 'LARGE', 'UNLIMITED'].includes(line.plan)) {
            commission += 20;
          }
        }
      });
    }

    // TV (alleen met internet)
    if (internet && tv) {
      const tvData = TV_OPTIONS[tv as keyof typeof TV_OPTIONS];
      if (tvData) {
        total += tvData.price;
        commission += tvData.commission;
      }
      // Extra decoders
      total += extraDecoders * EXTRAS.DECODER.price;
    }

    // Vaste lijn (alleen met internet)
    if (internet && landline) {
      total += EXTRAS.LANDLINE.price;
    }

    // WiFi boosters
    total += wifiBoosters * EXTRAS.WIFI_BOOSTER.price;

    const savings = Math.max(0, currentCost - total);
    
    setResults({
      newMonthly: total,
      currentMonthly: currentCost,
      savings,
      yearlySavings: savings * 12,
      commission
    });
  }, [internet, isSecondAddress, mobileLines, tv, extraDecoders, landline, comfort, wifiBoosters, currentCost]);

  // Reset TV en extras als internet wordt verwijderd
  useEffect(() => {
    if (!internet) {
      setTv(null);
      setExtraDecoders(0);
      setLandline(false);
      setComfort(false);
      setWifiBoosters(0);
    }
  }, [internet]);

  const addMobileLine = () => setMobileLines([...mobileLines, { plan: '', portability: false }]);
  const removeMobileLine = (idx: number) => setMobileLines(mobileLines.filter((_, i) => i !== idx));
  const updateMobileLine = (idx: number, field: string, value: any) => {
    const updated = [...mobileLines];
    updated[idx] = { ...updated[idx], [field]: value };
    setMobileLines(updated);
  };

  const hasConvergence = internet && mobileLines.length > 0;

  return (
    <PremiumLayout user={{ name: 'Lenny De K.' }}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard/v2-premium" className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Prijs Calculator</h1>
              <p className="text-gray-500 text-sm">Bereken de perfecte prijs en commissie voor je klant</p>
            </div>
          </div>

          {/* Lead Selection */}
          {!selectedLead ? (
            <div className="bg-white rounded-2xl border-2 border-dashed border-orange-300 p-10 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Kies een lead</h3>
              <p className="text-gray-500 mb-4">Selecteer eerst voor welke klant je de offerte maakt</p>
              <Link href="/leads" className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600">
                Kies Lead
              </Link>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl border border-orange-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {selectedLead.companyName[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedLead.companyName}</h3>
                    <p className="text-sm text-gray-600">{selectedLead.contactName} • {selectedLead.city}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedLead(null)} className="p-2 text-gray-400 hover:text-red-500">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Current Cost */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Euro className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Huidige Maandkosten</h2>
                <p className="text-sm text-gray-500">Wat betaalt de klant nu per maand?</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-xs">
                <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={currentCost || ''}
                  onChange={(e) => setCurrentCost(Number(e.target.value))}
                  placeholder="0"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <span className="text-gray-500">/maand</span>
            </div>
          </div>

          {/* Internet */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Wifi className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Internet</h2>
                <p className="text-sm text-gray-500">Kies het perfecte internet pakket</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              {['START', 'ZEN', 'GIGA'].map((key) => {
                const price = hasConvergence ? INTERNET_PACK[key as keyof typeof INTERNET_PACK] : INTERNET_STANDALONE[key as keyof typeof INTERNET_STANDALONE];
                const name = key === 'START' ? 'Start Fiber' : key === 'ZEN' ? 'Zen Fiber' : 'Giga Fiber';
                const speed = key === 'START' ? '200 Mbps' : key === 'ZEN' ? '500 Mbps' : '1000 Mbps';
                
                return (
                  <button
                    key={key}
                    onClick={() => setInternet(internet === key ? null : key)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      internet === key 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900">{name}</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-2">€{price}<span className="text-sm font-normal">/maand</span></p>
                    <p className="text-sm text-gray-500">{speed}</p>
                  </button>
                );
              })}
            </div>

            {/* 2de adres optie */}
            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={isSecondAddress}
                onChange={(e) => setIsSecondAddress(e.target.checked)}
                className="w-4 h-4 text-orange-500"
              />
              <span className="text-sm text-gray-700">2de Adres</span>
              <span className="text-xs text-green-600">-€10 levenslange korting op internetprijs</span>
            </label>
          </div>

          {/* Mobile */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Mobiel</h2>
                  <p className="text-sm text-gray-500">Voeg mobiele lijnen toe</p>
                </div>
              </div>
              <button
                onClick={addMobileLine}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                <Plus className="w-4 h-4" />
                GSM toevoegen
              </button>
            </div>

            {mobileLines.length === 0 ? (
              <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                <Smartphone className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Voeg mobiele lijnen toe</p>
              </div>
            ) : (
              <div className="space-y-3">
                {mobileLines.map((line, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </div>
                      <span className="font-medium text-gray-700">GSM {idx + 1}</span>
                      <button onClick={() => removeMobileLine(idx)} className="ml-auto p-2 text-red-500 hover:bg-red-50 rounded-lg">
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <select
                        value={line.plan}
                        onChange={(e) => updateMobileLine(idx, 'plan', e.target.value)}
                        className="p-3 border border-gray-300 rounded-lg"
                      >
                        <option value="">Kies abonnement</option>
                        {['SMALL', 'MEDIUM', 'LARGE', 'UNLIMITED'].map((planKey) => {
                          let planData;
                          if (internet) {
                            planData = mobileLines.length === 1 
                              ? MOBILE_PACK_1[planKey as keyof typeof MOBILE_PACK_1]
                              : MOBILE_PACK_2PLUS[planKey as keyof typeof MOBILE_PACK_2PLUS];
                          } else {
                            planData = mobileLines.length === 1
                              ? MOBILE_STANDALONE[planKey as keyof typeof MOBILE_STANDALONE]
                              : MOBILE_STANDALONE_2PLUS[planKey as keyof typeof MOBILE_STANDALONE_2PLUS];
                          }
                          if (!planData) return null;
                          return (
                            <option key={planKey} value={planKey}>
                              {planKey} - {planData.data} (€{planData.price}) - €{planData.commission} commissie
                            </option>
                          );
                        })}
                      </select>
                      
                      {line.plan && ['MEDIUM', 'LARGE', 'UNLIMITED'].includes(line.plan) && (
                        <label className="flex items-center gap-2 px-3 py-3 bg-white border border-gray-300 rounded-lg cursor-pointer">
                          <input
                            type="checkbox"
                            checked={line.portability}
                            onChange={(e) => updateMobileLine(idx, 'portability', e.target.checked)}
                            className="w-4 h-4 text-orange-500"
                          />
                          <span className="text-sm">Nummerbehoud</span>
                          <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">+€20</span>
                        </label>
                      )}
                    </div>
                  </div>
                ))}
                
                {mobileLines.length >= 2 && (
                  <div className="p-3 bg-green-50 rounded-lg text-sm text-green-700 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Multi-line korting toegepast!
                  </div>
                )}
              </div>
            )}
          </div>

          {/* TV - Alleen als internet geselecteerd */}
          {internet && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Tv className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">TV (optioneel)</h2>
                  <p className="text-sm text-gray-500">Kies een TV pakket (+€10 commissie)</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <button
                  onClick={() => setTv(tv === 'LIFE' ? null : 'LIFE')}
                  className={`p-4 rounded-xl border-2 text-left ${tv === 'LIFE' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-300'}`}
                >
                  <h3 className="font-semibold text-gray-900">Geen TV</h3>
                  <p className="text-2xl font-bold text-gray-900 mt-2">€0</p>
                </button>
                
                <button
                  onClick={() => setTv(tv === 'TV' ? null : 'TV')}
                  className={`p-4 rounded-xl border-2 text-left ${tv === 'TV' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-300'}`}
                >
                  <h3 className="font-semibold text-gray-900">Orange TV</h3>
                  <p className="text-2xl font-bold text-gray-900 mt-2">€20<span className="text-sm font-normal">/maand</span></p>
                  <p className="text-xs text-gray-500">met decoder</p>
                </button>
                
                <button
                  onClick={() => setTv(tv === 'PLUS' ? null : 'PLUS')}
                  className={`p-4 rounded-xl border-2 text-left ${tv === 'PLUS' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-300'}`}
                >
                  <h3 className="font-semibold text-gray-900">Orange TV Plus</h3>
                  <p className="text-2xl font-bold text-gray-900 mt-2">€32<span className="text-sm font-normal">/maand</span></p>
                  <p className="text-xs text-gray-500">Netflix inbegrepen</p>
                </button>
              </div>

              {/* Extra decoders */}
              {tv && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Extra decoders</span>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setExtraDecoders(Math.max(0, extraDecoders - 1))}
                      className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center">{extraDecoders}</span>
                    <button 
                      onClick={() => setExtraDecoders(extraDecoders + 1)}
                      className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Extra Opties - Alleen als internet geselecteerd */}
          {internet && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Extra & Opties</h2>
                  <p className="text-sm text-gray-500">WiFi, vaste lijn en services</p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={landline}
                      onChange={(e) => setLandline(e.target.checked)}
                      className="w-4 h-4 text-orange-500"
                    />
                    <span className="text-gray-700">Vaste Lijn</span>
                    <span className="text-xs text-gray-500">Onbeperkt bellen in België</span>
                  </div>
                  <span className="font-medium">€{EXTRAS.LANDLINE.price}/maand</span>
                </label>

                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={comfort}
                      onChange={(e) => setComfort(e.target.checked)}
                      className="w-4 h-4 text-orange-500"
                    />
                    <span className="text-gray-700">My Comfort</span>
                    {internet === 'GIGA' && <span className="text-xs text-green-600">-50% bij Giga</span>}
                  </div>
                  <span className="font-medium">€{internet === 'GIGA' ? 5 : 10}/maand</span>
                </label>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">WiFi Boosters</span>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setWifiBoosters(Math.max(0, wifiBoosters - 1))}
                      className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center">{wifiBoosters}</span>
                    <button 
                      onClick={() => setWifiBoosters(Math.min(3, wifiBoosters + 1))}
                      className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-gray-500 w-24 text-right">€{wifiBoosters * 3}/maand</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Results */}
        <div className="space-y-4">
          {/* Klant Voordeel */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Home className="w-5 h-5" />
              Klant Voordeel
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white/20 rounded-lg p-3">
                <p className="text-sm text-green-100">Nu</p>
                <p className="text-xl font-bold">€{results.currentMonthly.toFixed(2)}</p>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <p className="text-sm text-green-100">Met SmartSN</p>
                <p className="text-xl font-bold">€{results.newMonthly.toFixed(2)}</p>
              </div>
            </div>

            <div className="bg-white/20 rounded-lg p-4 text-center">
              <p className="text-sm text-green-100">Nieuwe Maandprijs</p>
              <p className="text-4xl font-bold">€{results.newMonthly.toFixed(2)}</p>
              <p className="text-sm">per maand</p>
            </div>

            {results.savings > 0 && (
              <div className="mt-4 p-3 bg-white/20 rounded-lg">
                <p className="text-sm text-green-100">Besparing per jaar</p>
                <p className="text-2xl font-bold text-yellow-300">€{results.yearlySavings.toFixed(0)}</p>
              </div>
            )}
          </div>

          {/* Jouw Commissie */}
          <div className="bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl p-6 text-white">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Jouw Commissie
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-orange-100">Potentiële commissie</span>
                <span className="text-xl font-bold">€{results.commission}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-white/20 rounded-lg">
                <span className="text-orange-100">Effectieve commissie</span>
                <span className="text-2xl font-bold">€{results.commission}</span>
              </div>

              <p className="text-xs text-orange-100">Bij verkoop van dit pakket</p>
            </div>
          </div>

          {/* Prijsopbouw */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Prijsopbouw</h3>
            
            <div className="space-y-2 text-sm">
              {internet && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Internet</span>
                  <span className="font-medium">€{(hasConvergence ? INTERNET_PACK : INTERNET_STANDALONE)[internet as keyof typeof INTERNET_STANDALONE] - (isSecondAddress ? 10 : 0)}</span>
                </div>
              )}
              
              {mobileLines.map((line, idx) => {
                if (!line.plan) return null;
                let price = 0;
                if (internet) {
                  price = mobileLines.length === 1 
                    ? MOBILE_PACK_1[line.plan as keyof typeof MOBILE_PACK_1]?.price || 0
                    : MOBILE_PACK_2PLUS[line.plan as keyof typeof MOBILE_PACK_2PLUS]?.price || 0;
                } else {
                  price = mobileLines.length === 1
                    ? MOBILE_STANDALONE[line.plan as keyof typeof MOBILE_STANDALONE]?.price || 0
                    : MOBILE_STANDALONE_2PLUS[line.plan as keyof typeof MOBILE_STANDALONE_2PLUS]?.price || 0;
                }
                return (
                  <div key={idx} className="flex justify-between">
                    <span className="text-gray-600">Mobiel ({idx + 1} lijn{mobileLines.length > 1 ? 'en' : ''})</span>
                    <span className="font-medium">€{price.toFixed(2)}</span>
                  </div>
                );
              })}
              
              {tv && (
                <div className="flex justify-between">
                  <span className="text-gray-600">TV</span>
                  <span className="font-medium">€{TV_OPTIONS[tv as keyof typeof TV_OPTIONS].price}</span>
                </div>
              )}
              
              {extraDecoders > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Extra decoders ({extraDecoders}x)</span>
                  <span className="font-medium">€{extraDecoders * 9}</span>
                </div>
              )}
              
              {landline && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Vaste Lijn</span>
                  <span className="font-medium">€12</span>
                </div>
              )}
              
              {comfort && (
                <div className="flex justify-between">
                  <span className="text-gray-600">My Comfort</span>
                  <span className="font-medium">€{internet === 'GIGA' ? 5 : 10}</span>
                </div>
              )}
              
              {wifiBoosters > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">WiFi Boosters ({wifiBoosters}x)</span>
                  <span className="font-medium">€{wifiBoosters * 3}</span>
                </div>
              )}
              
              <div className="pt-2 border-t border-gray-200 flex justify-between font-bold">
                <span>Totaal</span>
                <span>€{results.newMonthly.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Save Button */}
          {selectedLead && internet && (
            <button 
              onClick={() => alert('Offerte opgeslagen!')}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Offerte Opslaan
            </button>
          )}
        </div>
      </div>
    </PremiumLayout>
  );
}

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
