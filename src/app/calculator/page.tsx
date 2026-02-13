'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PremiumLayout } from '@/components/design-system/premium-layout';
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
  TrendingDown,
  Wifi,
  Smartphone,
  Tv,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Wallet,
  Building2,
  Zap,
  Calculator
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
  { value: 'TV_LIFE', label: 'Orange TV Life', price: 1000 },
  { value: 'TV', label: 'Orange TV', price: 2000 },
  { value: 'TV_PLUS', label: 'Orange TV Plus', price: 3200 },
];

// Mock leads for demo
const MOCK_LEADS = [
  { id: '1', companyName: 'Bakkerij De Lekkernij', contactName: 'Maria Peeters', city: 'Aalst' },
  { id: '2', companyName: 'Tech Solutions BV', contactName: 'Jan Janssen', city: 'Brussel' },
  { id: '3', companyName: 'NecmiCuts', contactName: 'Necmi Yildiz', city: 'Aalst' },
];

export default function CalculatorPage() {
  const router = useRouter();
  const [internetPlan, setInternetPlan] = useState('');
  const [isSecondAddress, setIsSecondAddress] = useState(false);
  const [mobileLines, setMobileLines] = useState<MobileLine[]>([]);
  const [tvPlan, setTvPlan] = useState('');
  const [currentMonthlyCost, setCurrentMonthlyCost] = useState('');
  const [internetInstallType, setInternetInstallType] = useState<'NEW' | 'EASY_SWITCH' | null>(null);
  const [selectedLead, setSelectedLead] = useState(MOCK_LEADS[0]);
  const [creatingOffer, setCreatingOffer] = useState(false);

  const hasInternet = !!internetPlan;
  const hasMobile = mobileLines.length > 0;

  const result = useMemo(() => {
    if (!hasInternet && !hasMobile) return null;
    return calculateTariff({
      internetPlan: (internetPlan as any) || 'START',
      isSecondAddress,
      hasMobile,
      mobileLines,
      tvPlan: (tvPlan as any) || 'NONE',
      hasVasteLijn: false,
      hasMyComfort: false,
      wifiBoosters: 0,
      extraDecoders: 0,
      currentMonthlyCost: parseFloat(currentMonthlyCost) || 0,
    });
  }, [internetPlan, isSecondAddress, mobileLines, tvPlan, currentMonthlyCost, hasInternet, hasMobile]);

  const commissionPreview = useMemo(() => {
    if (!result) return null;
    const products = [];
    if (internetPlan) {
      products.push({
        type: 'INTERNET' as const,
        plan: internetPlan,
        retailValue: result.internetPrice,
        options: { convergence: hasMobile, portability: internetInstallType === 'EASY_SWITCH' },
      });
    }
    mobileLines.forEach((line) => {
      products.push({
        type: 'MOBILE' as const,
        plan: line.plan,
        retailValue: result.mobilePrice / mobileLines.length,
        options: { portability: line.isPortability, convergence: hasInternet },
      });
    });
    if (tvPlan) {
      products.push({ type: 'TV' as const, plan: tvPlan, retailValue: result.tvPrice });
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

  const getMobilePlanOptions = (lineIndex: number, totalLines: number) => {
    const isMultiLine = totalLines >= 2;
    const isFirstLine = lineIndex === 0;
    const plans = [];
    if (!isFirstLine) plans.push({ value: 'CHILD', label: 'Child (3GB)', price: 500 });
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
      const basePrices = isMultiLine ? MOBILE_PRICES_STANDALONE_2PLUS : MOBILE_PRICES_STANDALONE;
      plans.push(
        { value: 'SMALL', label: 'Small (12GB)', price: basePrices.SMALL },
        { value: 'MEDIUM', label: 'Medium (70GB)', price: basePrices.MEDIUM },
        { value: 'LARGE', label: 'Large (140GB)', price: basePrices.LARGE },
        { value: 'UNLIMITED', label: 'Unlimited', price: basePrices.UNLIMITED }
      );
    }
    return plans;
  };

  async function createOffer() {
    if (!result || !commissionPreview) return;
    setCreatingOffer(true);
    await new Promise(r => setTimeout(r, 1000));
    router.push('/offers');
  }

  return (
    <PremiumLayout user={{ name: 'Lenny De K.' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prijs Calculator</h1>
          <p className="text-gray-500 mt-1">Bereken de perfecte prijs en commissie</p>
        </div>
        <Link
          href="/leads"
          className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          Terug naar leads
        </Link>
      </div>

      {/* Selected Lead */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-600 rounded-2xl p-6 text-white mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-2xl font-bold">
              {selectedLead.companyName[0]}
            </div>
            <div>
              <h3 className="text-xl font-bold">{selectedLead.companyName}</h3>
              <p className="text-orange-100">{selectedLead.contactName}</p>
              <p className="text-sm text-orange-200">{selectedLead.city}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-orange-100">Voor klant</p>
            <Link href="/leads" className="text-white underline text-sm">Wijzig lead</Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Products */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Cost */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calculator className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Huidige Maandkosten</h3>
                <p className="text-sm text-gray-500">Wat betaalt de klant nu?</p>
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

          {/* Internet */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Wifi className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Internet</h3>
                <p className="text-sm text-gray-500">Kies het internet pakket</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              {internetPlans.filter(p => p.value).map((plan) => (
                <button
                  key={plan.value}
                  onClick={() => { setInternetPlan(plan.value); setInternetInstallType(null); }}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    internetPlan === plan.value ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'
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
            {hasInternet && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-orange-600" />
                  <h4 className="font-semibold text-gray-900">Type installatie</h4>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setInternetInstallType('NEW')}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      internetInstallType === 'NEW' ? 'border-orange-500 bg-white' : 'border-gray-200 bg-white'
                    }`}
                  >
                    <span className="font-semibold">Nieuwe installatie</span>
                  </button>
                  <button
                    onClick={() => setInternetInstallType('EASY_SWITCH')}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      internetInstallType === 'EASY_SWITCH' ? 'border-orange-500 bg-white' : 'border-gray-200 bg-white'
                    }`}
                  >
                    <span className="font-semibold">Easy Switch</span>
                    <p className="text-sm text-gray-500">+€12 commissie</p>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
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
              <button
                onClick={addMobileLine}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
              >
                <Plus className="w-4 h-4" />
                GSM toevoegen
              </button>
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
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center font-bold">{index + 1}</div>
                        <span className="font-medium">GSM #{index + 1}</span>
                      </div>
                      <button onClick={() => removeMobileLine(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <select
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl"
                        value={line.plan}
                        onChange={(e) => updateMobileLine(index, { plan: e.target.value as any })}
                      >
                        {getMobilePlanOptions(index, mobileLines.length).map((plan) => (
                          <option key={plan.value} value={plan.value}>{plan.label} - {formatPrice(plan.price)}</option>
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
          </div>

          {/* TV */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Tv className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">TV (optioneel)</h3>
                <p className="text-sm text-gray-500">Voeg TV toe aan je pakket</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {tvPlans.map((plan) => (
                <button
                  key={plan.value}
                  onClick={() => setTvPlan(plan.value)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    tvPlan === plan.value ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <span className="font-medium text-gray-900">{plan.label}</span>
                  {plan.price > 0 && (
                    <p className="text-xl font-bold text-gray-900 mt-1">{formatPrice(plan.price)}</p>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Results */}
        <div>
          <div className="sticky top-24 space-y-4">
            {result ? (
              <>
                {/* Customer Savings */}
                <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingDown className="w-6 h-6" />
                    <h3 className="text-lg font-semibold">Klant Voordeel</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 bg-white/10 rounded-lg">
                      <p className="text-green-100 text-sm">Nu</p>
                      <p className="text-xl font-bold">{formatPrice((parseFloat(currentMonthlyCost) || 0) * 100)}</p>
                    </div>
                    <div className="p-3 bg-white/20 rounded-lg">
                      <p className="text-green-100 text-sm">Met SmartSN</p>
                      <p className="text-xl font-bold">{formatPrice(result.totalMonthly)}</p>
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white/10 rounded-xl">
                    <p className="text-green-100 text-sm mb-1">Nieuwe prijs</p>
                    <p className="text-4xl font-bold">{formatPrice(result.totalMonthly)}</p>
                    <p className="text-green-200 text-xs mt-1">per maand</p>
                  </div>
                </div>

                {/* Commission */}
                {commissionPreview && commissionPreview.effective > 0 && (
                  <div className="bg-gradient-to-br from-orange-500 to-pink-600 text-white rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Wallet className="w-6 h-6" />
                      <h3 className="text-lg font-semibold">Jouw Commissie</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 bg-white/10 rounded-lg">
                        <p className="text-orange-100 text-sm">Potentiële (bij versturen)</p>
                        <p className="text-xl font-bold">€{commissionPreview.potential.toFixed(0)}</p>
                      </div>
                      <div className="p-3 bg-white/20 rounded-lg border border-white/30">
                        <p className="text-orange-100 text-sm">Effectieve (bij tekenen)</p>
                        <p className="text-2xl font-bold">€{commissionPreview.effective.toFixed(0)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* CTA */}
                <button
                  onClick={createOffer}
                  disabled={creatingOffer || !internetInstallType}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {creatingOffer ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Aanmaken...
                    </span>
                  ) : !internetInstallType ? (
                    'Selecteer installatie type'
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Maak Offerte
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </button>
              </>
            ) : (
              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                <Calculator className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">Voeg producten toe om prijs te berekenen</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PremiumLayout>
  );
}
