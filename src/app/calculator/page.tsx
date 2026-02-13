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
  CheckCircle2,
  Settings,
  Zap,
  Signal,
  MonitorPlay,
  Phone,
  Router,
  BadgeCheck,
  PiggyBank,
  Building2,
  ChevronRight,
  Sparkles
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

// TV opties
const TV_OPTIONS = {
  NONE: { name: 'Geen TV', price: 0, commission: 0 },
  LIFE: { name: 'Orange TV Life', price: 10, commission: 10 },
  TV: { name: 'Orange TV', price: 20, commission: 10 },
  PLUS: { name: 'Orange TV Plus', price: 32, commission: 10 }
};

// Extra opties
const EXTRAS = {
  DECODER: { name: 'Extra decoder', price: 9 },
  WIFI_BOOSTER: { name: 'WiFi Booster', price: 3 },
  LANDLINE: { name: 'Vaste Lijn', price: 12 },
  COMFORT: { name: 'My Comfort', price: 10 }
};

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

function SectionCard({ 
  children, 
  icon: Icon, 
  title, 
  subtitle, 
  color = 'orange',
  disabled = false
}: { 
  children: React.ReactNode; 
  icon: any; 
  title: string; 
  subtitle?: string;
  color?: 'orange' | 'blue' | 'purple' | 'pink' | 'yellow' | 'gray';
  disabled?: boolean;
}) {
  const colors = {
    orange: 'bg-orange-50 border-orange-200',
    blue: 'bg-blue-50 border-blue-200',
    purple: 'bg-purple-50 border-purple-200',
    pink: 'bg-pink-50 border-pink-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    gray: 'bg-gray-50 border-gray-200'
  };
  
  const iconColors = {
    orange: 'text-orange-600 bg-orange-100',
    blue: 'text-blue-600 bg-blue-100',
    purple: 'text-purple-600 bg-purple-100',
    pink: 'text-pink-600 bg-pink-100',
    yellow: 'text-yellow-600 bg-yellow-100',
    gray: 'text-gray-600 bg-gray-100'
  };

  return (
    <div className={`bg-white rounded-2xl border-2 ${disabled ? 'border-gray-200 opacity-60' : 'border-gray-100'} shadow-sm hover:shadow-md transition-shadow overflow-hidden`}>
      <div className={`p-5 ${disabled ? 'bg-gray-50' : colors[color]} border-b ${disabled ? 'border-gray-200' : colors[color].replace('bg-', 'border-')}`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconColors[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-lg">{title}</h2>
            {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
          </div>
        </div>
      </div>
      <div className="p-5">
        {children}
      </div>
    </div>
  );
}

function PriceCard({ 
  selected, 
  onClick, 
  name, 
  price, 
  speed,
  badge,
  discount
}: { 
  selected: boolean; 
  onClick: () => void; 
  name: string; 
  price: number; 
  speed?: string;
  badge?: string;
  discount?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative p-5 rounded-xl border-2 text-left transition-all duration-200 group ${
        selected 
          ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg shadow-orange-100' 
          : 'border-gray-200 hover:border-orange-300 hover:shadow-md bg-white'
      }`}
    >
      {badge && (
        <span className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
          {badge}
        </span>
      )}
      {discount && (
        <span className="absolute -top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
          {discount}
        </span>
      )}
      <h3 className="font-bold text-gray-900 text-lg">{name}</h3>
      <div className="flex items-baseline gap-1 mt-2">
        <span className="text-3xl font-black text-gray-900">€{price}</span>
        <span className="text-sm text-gray-500">/maand</span>
      </div>
      {speed && <p className="text-sm text-gray-500 mt-1 font-medium">{speed}</p>}
      {selected && (
        <div className="absolute bottom-3 right-3">
          <BadgeCheck className="w-6 h-6 text-orange-500" />
        </div>
      )}
    </button>
  );
}

function CalculatorContent() {
  const searchParams = useSearchParams();
  const leadId = searchParams.get('lead');
  
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [currentCost, setCurrentCost] = useState<number>(0);
  
  const [internet, setInternet] = useState<string | null>(null);
  const [isSecondAddress, setIsSecondAddress] = useState(false);
  
  const [mobileLines, setMobileLines] = useState<Array<{plan: string; portability: boolean}>>([]);
  
  const [tv, setTv] = useState<string>('NONE');
  const [extraDecoders, setExtraDecoders] = useState(0);
  
  const [landline, setLandline] = useState(false);
  const [comfort, setComfort] = useState(false);
  const [wifiBoosters, setWifiBoosters] = useState(0);
  
  const [results, setResults] = useState({
    newMonthly: 0,
    currentMonthly: 0,
    savings: 0,
    yearlySavings: 0,
    commission: 0
  });

  useEffect(() => {
    if (leadId && MOCK_LEADS[leadId]) {
      setSelectedLead(MOCK_LEADS[leadId]);
    }
  }, [leadId]);

  useEffect(() => {
    let total = 0;
    let commission = 0;

    if (internet) {
      const hasMobile = mobileLines.length > 0;
      let price = hasMobile ? INTERNET_PACK[internet as keyof typeof INTERNET_PACK] : INTERNET_STANDALONE[internet as keyof typeof INTERNET_STANDALONE];
      
      if (isSecondAddress) {
        price -= 10;
      }
      
      total += price;
      commission += INTERNET_COMMISSION;
      
      if (comfort && internet === 'GIGA') {
        total += 5;
      } else if (comfort) {
        total += 10;
      }
    }

    if (mobileLines.length > 0) {
      const hasInternet = !!internet;
      
      mobileLines.forEach((line) => {
        if (!line.plan) return;
        
        let planData;
        
        if (hasInternet) {
          if (mobileLines.length === 1) {
            planData = MOBILE_PACK_1[line.plan as keyof typeof MOBILE_PACK_1];
          } else {
            planData = MOBILE_PACK_2PLUS[line.plan as keyof typeof MOBILE_PACK_2PLUS];
          }
        } else {
          if (mobileLines.length === 1) {
            planData = MOBILE_STANDALONE[line.plan as keyof typeof MOBILE_STANDALONE];
          } else {
            planData = MOBILE_STANDALONE_2PLUS[line.plan as keyof typeof MOBILE_STANDALONE_2PLUS];
          }
        }
        
        if (planData) {
          total += planData.price;
          commission += planData.commission;
          
          if (line.portability && ['MEDIUM', 'LARGE', 'UNLIMITED'].includes(line.plan)) {
            commission += 20;
          }
        }
      });
    }

    if (internet && tv && tv !== 'NONE') {
      const tvData = TV_OPTIONS[tv as keyof typeof TV_OPTIONS];
      if (tvData) {
        total += tvData.price;
        commission += tvData.commission;
      }
      total += extraDecoders * EXTRAS.DECODER.price;
    }

    if (internet && landline) {
      total += EXTRAS.LANDLINE.price;
    }

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

  useEffect(() => {
    if (!internet) {
      setTv('NONE');
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
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/dashboard/v2-premium" 
            className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-gray-900">Prijs Calculator</h1>
            <p className="text-gray-500">Bereken de perfecte prijs en commissie voor je klant</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* Lead Card */}
            {!selectedLead ? (
              <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl border-2 border-dashed border-orange-300 p-10 text-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
                  <User className="w-10 h-10 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Kies een lead</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">Selecteer eerst voor welke klant je de offerte maakt om alle gegevens correct in te vullen.</p>
                <Link 
                  href="/leads" 
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
                >
                  Kies Lead
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-orange-500 to-pink-600 rounded-2xl p-1 shadow-lg">
                <div className="bg-white rounded-xl p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                        {selectedLead.companyName[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900 text-lg">{selectedLead.companyName}</h3>
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">ACTIEF</span>
                        </div>
                        <p className="text-gray-600 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {selectedLead.contactName}
                          <span className="text-gray-300">|</span>
                          <Building2 className="w-4 h-4" />
                          {selectedLead.city}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedLead(null)} 
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Current Cost */}
            <SectionCard icon={PiggyBank} title="Huidige Maandkosten" subtitle="Wat betaalt de klant nu per maand?" color="blue">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Euro className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={currentCost || ''}
                    onChange={(e) => setCurrentCost(Number(e.target.value))}
                    placeholder="0"
                    className="w-full pl-12 pr-4 py-4 text-xl font-bold border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                  />
                </div>
                <span className="text-gray-500 font-medium">/maand</span>
              </div>
            </SectionCard>

            {/* Internet */}
            <SectionCard icon={Wifi} title="Internet" subtitle="Kies het perfecte internet pakket" color="orange">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                {[
                  { key: 'START', name: 'Start Fiber', speed: '200 Mbps', standalone: 53, pack: 49 },
                  { key: 'ZEN', name: 'Zen Fiber', speed: '500 Mbps', standalone: 62, pack: 58, popular: true },
                  { key: 'GIGA', name: 'Giga Fiber', speed: '1000 Mbps', standalone: 72, pack: 68 }
                ].map((opt) => {
                  const price = hasConvergence ? opt.pack : opt.standalone;
                  return (
                    <PriceCard
                      key={opt.key}
                      selected={internet === opt.key}
                      onClick={() => setInternet(internet === opt.key ? null : opt.key)}
                      name={opt.name}
                      price={price}
                      speed={opt.speed}
                      badge={opt.popular ? 'POPULAIR' : undefined}
                    />
                  );
                })}
              </div>

              <label className="flex items-center gap-4 p-4 bg-green-50 border-2 border-green-200 rounded-xl cursor-pointer hover:bg-green-100 transition-colors">
                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${isSecondAddress ? 'bg-green-500 border-green-500' : 'border-gray-300 bg-white'}`}>
                  {isSecondAddress && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
                <input
                  type="checkbox"
                  checked={isSecondAddress}
                  onChange={(e) => setIsSecondAddress(e.target.checked)}
                  className="hidden"
                />
                <div className="flex-1">
                  <span className="font-bold text-gray-900">2de Adres</span>
                  <span className="text-green-700 font-bold ml-2">-€10 levenslang</span>
                </div>
                <Building2 className="w-5 h-5 text-green-600" />
              </label>
            </SectionCard>

            {/* Mobile */}
            <SectionCard icon={Smartphone} title="Mobiel" subtitle="Voeg mobiele lijnen toe" color="purple">
              <div className="flex justify-end mb-4">
                <button
                  onClick={addMobileLine}
                  className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 hover:shadow-lg transition-all"
                >
                  <Plus className="w-5 h-5" />
                  GSM toevoegen
                </button>
              </div>

              {mobileLines.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Smartphone className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">Nog geen mobiele lijnen toegevoegd</p>
                  <p className="text-sm text-gray-400 mt-1">Klik op "GSM toevoegen" om te starten</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {mobileLines.map((line, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                      <div className="flex items-center gap-3 p-4 bg-white border-b border-gray-200">
                        <div className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                          {idx + 1}
                        </div>
                        <span className="font-semibold text-gray-900">GSM {idx + 1}</span>
                        <button 
                          onClick={() => removeMobileLine(idx)} 
                          className="ml-auto p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="p-4 space-y-3">
                        <select
                          value={line.plan}
                          onChange={(e) => updateMobileLine(idx, 'plan', e.target.value)}
                          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all"
                        >
                          <option value="">Kies abonnement</option>
                          {[
                            { key: 'SMALL', name: 'Small', data: '12 GB' },
                            { key: 'MEDIUM', name: 'Medium', data: '70 GB' },
                            { key: 'LARGE', name: 'Large', data: '140 GB' },
                            { key: 'UNLIMITED', name: 'Unlimited', data: 'Onbeperkt' }
                          ].map((plan) => {
                            let planData;
                            if (internet) {
                              planData = mobileLines.length === 1 
                                ? MOBILE_PACK_1[plan.key as keyof typeof MOBILE_PACK_1]
                                : MOBILE_PACK_2PLUS[plan.key as keyof typeof MOBILE_PACK_2PLUS];
                            } else {
                              planData = mobileLines.length === 1
                                ? MOBILE_STANDALONE[plan.key as keyof typeof MOBILE_STANDALONE]
                                : MOBILE_STANDALONE_2PLUS[plan.key as keyof typeof MOBILE_STANDALONE_2PLUS];
                            }
                            if (!planData) return null;
                            return (
                              <option key={plan.key} value={plan.key}>
                                {plan.name} ({plan.data}) — €{planData.price}/maand — €{planData.commission} commissie
                              </option>
                            );
                          })}
                        </select>
                        
                        {line.plan && ['MEDIUM', 'LARGE', 'UNLIMITED'].includes(line.plan) && (
                          <label className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-green-50 transition-colors">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${line.portability ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                              {line.portability && <CheckCircle2 className="w-3 h-3 text-white" />}
                            </div>
                            <input
                              type="checkbox"
                              checked={line.portability}
                              onChange={(e) => updateMobileLine(idx, 'portability', e.target.checked)}
                              className="hidden"
                            />
                            <span className="font-medium text-gray-700">Nummerbehoud</span>
                            <span className="ml-auto px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">+€20 bonus</span>
                          </label>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {mobileLines.length >= 2 && (
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <Sparkles className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-800">Multi-line korting toegepast! Je bespaart €{mobileLines.length >= 2 ? '4-10' : '0'} per lijn.</span>
                    </div>
                  )}
                </div>
              )}
            </SectionCard>

            {/* TV */}
            <SectionCard 
              icon={Tv} 
              title="TV (optioneel)" 
              subtitle="Kies een TV pakket (+€10 commissie)" 
              color="pink"
              disabled={!internet}
            >
              {!internet ? (
                <div className="text-center py-8 text-gray-400">
                  <Tv className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>TV is alleen beschikbaar met internet</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {Object.entries(TV_OPTIONS).map(([key, opt]) => (
                      <button
                        key={key}
                        onClick={() => setTv(key)}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${
                          tv === key 
                            ? 'border-pink-500 bg-pink-50 shadow-lg' 
                            : 'border-gray-200 hover:border-pink-300 bg-white'
                        }`}
                      >
                        <h4 className="font-bold text-gray-900 text-sm">{opt.name}</h4>
                        <p className="text-xl font-black text-gray-900 mt-1">€{opt.price}</p>
                        {key === 'PLUS' && <span className="text-xs text-pink-600 font-medium">Netflix</span>}
                      </button>
                    ))}
                  </div>

                  {tv !== 'NONE' && (
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <span className="font-medium text-gray-700">Extra decoders</span>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setExtraDecoders(Math.max(0, extraDecoders - 1))}
                          className="w-10 h-10 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center hover:border-gray-300 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-bold text-lg">{extraDecoders}</span>
                        <button 
                          onClick={() => setExtraDecoders(extraDecoders + 1)}
                          className="w-10 h-10 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center hover:border-gray-300 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <span className="text-sm text-gray-500 w-20 text-right">€{extraDecoders * 9}/maand</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </SectionCard>

            {/* Extras */}
            <SectionCard 
              icon={Settings} 
              title="Extra & Opties" 
              subtitle="WiFi, vaste lijn en services" 
              color="yellow"
              disabled={!internet}
            >
              {!internet ? (
                <div className="text-center py-8 text-gray-400">
                  <Settings className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>Extra opties zijn alleen beschikbaar met internet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${landline ? 'bg-yellow-500 border-yellow-500' : 'border-gray-300 bg-white'}`}>
                        {landline && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                      <input type="checkbox" checked={landline} onChange={(e) => setLandline(e.target.checked)} className="hidden" />
                      <div>
                        <span className="font-bold text-gray-900">Vaste Lijn</span>
                        <p className="text-sm text-gray-500">Onbeperkt bellen in België</p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900">€12/maand</span>
                  </label>

                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${comfort ? 'bg-yellow-500 border-yellow-500' : 'border-gray-300 bg-white'}`}>
                        {comfort && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                      <input type="checkbox" checked={comfort} onChange={(e) => setComfort(e.target.checked)} className="hidden" />
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">My Comfort</span>
                        {internet === 'GIGA' && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">-50%</span>}
                      </div>
                    </div>
                    <span className="font-bold text-gray-900">€{internet === 'GIGA' ? 5 : 10}/maand</span>
                  </label>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Router className="w-5 h-5 text-gray-400" />
                      <span className="font-bold text-gray-900">WiFi Boosters</span>
                      <span className="text-sm text-gray-500">Max. 3</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setWifiBoosters(Math.max(0, wifiBoosters - 1))}
                        className="w-10 h-10 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center hover:border-gray-300"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-bold text-lg">{wifiBoosters}</span>
                      <button 
                        onClick={() => setWifiBoosters(Math.min(3, wifiBoosters + 1))}
                        className="w-10 h-10 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center hover:border-gray-300"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <span className="text-sm text-gray-500 w-20 text-right">€{wifiBoosters * 3}/maand</span>
                    </div>
                  </div>
                </div>
              )}
            </SectionCard>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            
            {/* Klant Voordeel */}
            <div className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-2xl p-1 shadow-xl">
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-xl p-6 text-white">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
                    <PiggyBank className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">Klant Voordeel</h3>
                    <p className="text-green-100 text-sm">Wat de klant bespaart</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-white/15 backdrop-blur rounded-xl p-4">
                    <p className="text-green-100 text-sm mb-1">Nu</p>
                    <p className="text-2xl font-black">€{results.currentMonthly.toFixed(0)}</p>
                  </div>
                  <div className="bg-white/15 backdrop-blur rounded-xl p-4">
                    <p className="text-green-100 text-sm mb-1">Met SmartSN</p>
                    <p className="text-2xl font-black">€{results.newMonthly.toFixed(0)}</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 text-center text-gray-900">
                  <p className="text-gray-500 text-sm font-medium mb-1">Nieuwe Maandprijs</p>
                  <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                    €{results.newMonthly.toFixed(2)}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">per maand</p>
                </div>

                {results.savings > 0 && (
                  <div className="mt-5 p-4 bg-yellow-400 rounded-xl text-yellow-900 text-center">
                    <p className="text-sm font-medium">Jaarlijkse besparing</p>
                    <p className="text-3xl font-black">€{results.yearlySavings.toFixed(0)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Jouw Commissie */}
            <div className="bg-gradient-to-br from-orange-500 via-pink-500 to-rose-600 rounded-2xl p-1 shadow-xl">
              <div className="bg-gradient-to-br from-orange-500/10 to-pink-600/10 rounded-xl p-6 text-white">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">Jouw Commissie</h3>
                    <p className="text-orange-100 text-sm">Bij verkoop van dit pakket</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-white/10 backdrop-blur rounded-xl">
                    <span className="text-orange-100">Potentiële commissie</span>
                    <span className="text-2xl font-bold">€{results.commission}</span>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-5 text-center text-gray-900">
                    <p className="text-gray-500 text-sm font-medium mb-1">Totale Commissie</p>
                    <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600">
                      €{results.commission}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Prijsopbouw */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Prijsopbouw
                </h3>
              </div>
              
              <div className="p-5 space-y-3 text-sm">
                {internet && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Wifi className="w-4 h-4 text-orange-500" />
                      <span className="font-medium text-gray-700">Internet</span>
                      {isSecondAddress && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">-€10</span>}
                    </div>
                    <span className="font-bold text-gray-900">
                      €{((hasConvergence ? INTERNET_PACK : INTERNET_STANDALONE)[internet as keyof typeof INTERNET_STANDALONE] - (isSecondAddress ? 10 : 0)).toFixed(0)}
                    </span>
                  </div>
                )}
                
                {mobileLines.filter(l => l.plan).map((line, idx) => {
                  let price = 0;
                  let name = '';
                  if (internet) {
                    const data = mobileLines.length === 1 
                      ? MOBILE_PACK_1[line.plan as keyof typeof MOBILE_PACK_1]
                      : MOBILE_PACK_2PLUS[line.plan as keyof typeof MOBILE_PACK_2PLUS];
                    price = data?.price || 0;
                    name = line.plan;
                  } else {
                    const data = mobileLines.length === 1
                      ? MOBILE_STANDALONE[line.plan as keyof typeof MOBILE_STANDALONE]
                      : MOBILE_STANDALONE_2PLUS[line.plan as keyof typeof MOBILE_STANDALONE_2PLUS];
                    price = data?.price || 0;
                    name = line.plan;
                  }
                  return (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-purple-500" />
                        <span className="font-medium text-gray-700">{name} GSM {idx + 1}</span>
                        {line.portability && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">+€20</span>}
                      </div>
                      <span className="font-bold text-gray-900">€{price.toFixed(2)}</span>
                    </div>
                  );
                })}
                
                {internet && tv && tv !== 'NONE' && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Tv className="w-4 h-4 text-pink-500" />
                      <span className="font-medium text-gray-700">{TV_OPTIONS[tv as keyof typeof TV_OPTIONS].name}</span>
                    </div>
                    <span className="font-bold text-gray-900">€{TV_OPTIONS[tv as keyof typeof TV_OPTIONS].price}</span>
                  </div>
                )}
                
                {extraDecoders > 0 && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Extra decoders ({extraDecoders}x)</span>
                    <span className="font-bold text-gray-900">€{extraDecoders * 9}</span>
                  </div>
                )}
                
                {landline && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium text-gray-700">Vaste Lijn</span>
                    </div>
                    <span className="font-bold text-gray-900">€12</span>
                  </div>
                )}
                
                {comfort && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium text-gray-700">My Comfort</span>
                      {internet === 'GIGA' && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">-50%</span>}
                    </div>
                    <span className="font-bold text-gray-900">€{internet === 'GIGA' ? 5 : 10}</span>
                  </div>
                )}
                
                {wifiBoosters > 0 && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Router className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium text-gray-700">WiFi Boosters ({wifiBoosters}x)</span>
                    </div>
                    <span className="font-bold text-gray-900">€{wifiBoosters * 3}</span>
                  </div>
                )}
                
                <div className="pt-3 border-t-2 border-gray-200">
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl">
                    <span className="font-bold text-gray-900 text-lg">Totaal per maand</span>
                    <span className="font-black text-2xl text-gray-900">€{results.newMonthly.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            {selectedLead && internet && (
              <button 
                onClick={() => alert('Offerte opgeslagen!')}
                className="w-full py-5 bg-gradient-to-r from-orange-500 via-pink-500 to-rose-600 text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 shadow-lg"
              >
                <Save className="w-6 h-6" />
                Offerte Opslaan
              </button>
            )}
          </div>
        </div>
      </div>
    </PremiumLayout>
  );
}

export default function CalculatorPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
      </div>
    }>
      <CalculatorContent />
    </Suspense>
  );
}
