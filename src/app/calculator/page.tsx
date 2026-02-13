'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PremiumLayout } from '@/components/design-system/premium-layout';
import { 
  Plus, 
  Minus, 
  Wifi, 
  Smartphone, 
  Tv, 
  Zap,
  TrendingUp,
  Euro,
  ArrowLeft,
  Save,
  User,
  Building2,
  MapPin,
  Phone,
  X,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

// Orange Producten met correcte prijzen
const INTERNET_PLANS = [
  { id: 'START', name: 'Start Fiber', price: 53, speed: '200 Mbps', commission: 15 },
  { id: 'ZEN', name: 'Zen Fiber', price: 62, speed: '500 Mbps', commission: 15 },
  { id: 'GIGA', name: 'Giga Fiber', price: 72, speed: '1000 Mbps', commission: 15 },
];

const MOBILE_PLANS = [
  { id: 'CHILD', name: 'Child', price: 0, data: '1 GB', commission: 1 },
  { id: 'SMALL', name: 'Small', price: 11.50, data: '5 GB', commission: 10 },
  { id: 'MEDIUM', name: 'Medium', price: 16.50, data: '20 GB', commission: 35 },
  { id: 'LARGE', name: 'Large', price: 21.50, data: '40 GB', commission: 50 },
  { id: 'UNLIMITED', name: 'Unlimited', price: 32, data: 'Unlimited', commission: 60 },
];

const TV_OPTIONS = [
  { id: 'TV', name: 'Orange TV', price: 0, commission: 10 },
  { id: 'TV_PLUS', name: 'Orange TV+', price: 20, commission: 10 },
];

interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  city: string;
}

const MOCK_LEADS: Record<string, Lead> = {
  'eba79e50-2f72-4cdf-8cca-6002af922a0f': {
    id: 'eba79e50-2f72-4cdf-8cca-6002af922a0f',
    companyName: 'Bakkerij De Lekkernij',
    contactName: 'Maria Peeters',
    phone: '0472 12 34 56',
    email: 'maria@bakkerij.be',
    city: 'Aalst'
  }
};

function CalculatorContent() {
  const searchParams = useSearchParams();
  const leadId = searchParams.get('lead');
  
  // States
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [currentMonthlyCost, setCurrentMonthlyCost] = useState<number>(0);
  
  // Product selections
  const [internet, setInternet] = useState<string | null>(null);
  const [mobileLines, setMobileLines] = useState<Array<{plan: string; portability: boolean}>>([]);
  const [tv, setTv] = useState<string | null>(null);
  
  // Calculations
  const [totals, setTotals] = useState({ 
    newMonthly: 0, 
    savings: 0, 
    commission: 0,
    yearlySavings: 0
  });

  // Load lead
  useEffect(() => {
    if (leadId && MOCK_LEADS[leadId]) {
      setSelectedLead(MOCK_LEADS[leadId]);
    }
  }, [leadId]);

  // Calculate
  useEffect(() => {
    let newMonthly = 0;
    let commission = 0;

    if (internet) {
      const plan = INTERNET_PLANS.find(p => p.id === internet)!;
      newMonthly += plan.price;
      commission += plan.commission;
    }

    mobileLines.forEach((line) => {
      if (line.plan) {
        const plan = MOBILE_PLANS.find(p => p.id === line.plan)!;
        newMonthly += plan.price;
        commission += plan.commission;
        if (line.portability && ['MEDIUM', 'LARGE', 'UNLIMITED'].includes(line.plan)) {
          commission += 20;
        }
      }
    });

    if (tv) {
      const plan = TV_OPTIONS.find(p => p.id === tv)!;
      newMonthly += plan.price;
      commission += plan.commission;
    }

    const savings = Math.max(0, currentMonthlyCost - newMonthly);
    const yearlySavings = savings * 12;

    setTotals({ newMonthly, savings, commission, yearlySavings });
  }, [internet, mobileLines, tv, currentMonthlyCost]);

  const addMobileLine = () => setMobileLines([...mobileLines, { plan: '', portability: false }]);
  const removeMobileLine = (idx: number) => setMobileLines(mobileLines.filter((_, i) => i !== idx));
  const updateMobileLine = (idx: number, field: string, value: any) => {
    const updated = [...mobileLines];
    updated[idx] = { ...updated[idx], [field]: value };
    setMobileLines(updated);
  };

  return (
    <PremiumLayout user={{ name: 'Lenny De K.' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/v2-premium" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Prijs Calculator</h1>
            <p className="text-gray-500">Bereken de perfecte prijs en commissie voor je klant</p>
          </div>
        </div>
      </div>

      {/* Lead Selection Card */}
      {!selectedLead ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-orange-300 p-8 mb-6 text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-orange-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Kies een lead</h3>
          <p className="text-gray-500 mb-4">Selecteer eerst voor welke klant je de offerte maakt</p>
          <Link 
            href="/leads" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Kies Lead
          </Link>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl border border-orange-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold">
                {selectedLead.companyName[0]}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{selectedLead.companyName}</h3>
                <p className="text-sm text-gray-600">{selectedLead.contactName} • {selectedLead.city}</p>
              </div>
            </div>
            <button 
              onClick={() => setSelectedLead(null)}
              className="p-2 text-gray-400 hover:text-red-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Current Monthly Cost */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
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
              value={currentMonthlyCost || ''}
              onChange={(e) => setCurrentMonthlyCost(Number(e.target.value))}
              placeholder="0"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <span className="text-gray-500">/maand</span>
        </div>
      </div>

      {/* Internet Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Wifi className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Internet</h2>
            <p className="text-sm text-gray-500">Kies het perfecte internet pakket</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {INTERNET_PLANS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setInternet(internet === plan.id ? null : plan.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                internet === plan.id 
                  ? 'border-orange-500 bg-orange-50' 
                  : 'border-gray-200 hover:border-orange-300'
              }`}
            >
              <h3 className="font-semibold text-gray-900">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-2xl font-bold text-gray-900">€{plan.price}</span>
                <span className="text-sm text-gray-500">/maand</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{plan.speed}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
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
          <div className="text-center py-8 text-gray-400">
            <Smartphone className="w-12 h-12 mx-auto mb-2" />
            <p>Voeg mobiele lijnen toe</p>
          </div>
        ) : (
          <div className="space-y-3">
            {mobileLines.map((line, idx) => (
              <div key={idx} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <select
                  value={line.plan}
                  onChange={(e) => updateMobileLine(idx, 'plan', e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg"
                >
                  <option value="">Kies abonnement</option>
                  {MOBILE_PLANS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} - {p.data} (€{p.price}/mnd) - €{p.commission} commissie
                    </option>
                  ))}
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
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">+€20</span>
                  </label>
                )}
                
                <button 
                  onClick={() => removeMobileLine(idx)}
                  className="p-3 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Minus className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TV Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
            <Tv className="w-5 h-5 text-pink-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">TV (optioneel)</h2>
            <p className="text-sm text-gray-500">Kies een TV pakket</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setTv(tv === 'TV' ? null : 'TV')}
            className={`p-4 rounded-xl border-2 text-left ${
              tv === 'TV' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-300'
            }`}
          >
            <h3 className="font-semibold text-gray-900">Orange TV</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">Gratis</p>
            <p className="text-sm text-gray-500">80+ zenders • Replay TV</p>
          </button>
          
          <button
            onClick={() => setTv(tv === 'TV_PLUS' ? null : 'TV_PLUS')}
            className={`p-4 rounded-xl border-2 text-left ${
              tv === 'TV_PLUS' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-300'
            }`}
          >
            <h3 className="font-semibold text-gray-900">Orange TV+</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">€20<span className="text-sm font-normal">/maand</span></p>
            <p className="text-sm text-gray-500">80+ zenders • Netflix • Disney+</p>
          </button>
        </div>
      </div>

      {/* Results Summary */}
      {(internet || mobileLines.some(l => l.plan) || tv) && (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Overzicht
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-400 text-sm">Nieuw maandbedrag</p>
              <p className="text-3xl font-bold">€{totals.newMonthly.toFixed(2)}</p>
            </div>
            
            <div>
              <p className="text-gray-400 text-sm">Klant bespaart / jaar</p>
              <p className={`text-3xl font-bold ${totals.yearlySavings > 0 ? 'text-green-400' : 'text-gray-400'}`}>
                €{totals.yearlySavings.toFixed(0)}
              </p>
              {totals.savings > 0 && (
                <p className="text-sm text-green-400">€{totals.savings.toFixed(2)} / maand</p>
              )}
            </div>
            
            <div>
              <p className="text-gray-400 text-sm">Jouw commissie</p>
              <p className="text-3xl font-bold text-orange-400">€{totals.commission}</p>
              <p className="text-sm text-gray-400">Bij verkoop (30% = €{(totals.commission * 0.3).toFixed(2)})</p>
            </div>
          </div>

          {selectedLead && (internet || mobileLines.some(l => l.plan)) && (
            <button 
              onClick={() => alert('Offerte opgeslagen!')}
              className="mt-6 w-full py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition-colors"
            >
              Offerte Opslaan
            </button>
          )}
        </div>
      )}
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
