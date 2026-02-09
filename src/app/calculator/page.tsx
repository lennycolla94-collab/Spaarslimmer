'use client';

import { useState, useMemo } from 'react';
import { 
  PageContainer, 
  PageHeader, 
  SmartCard, 
  StatCard, 
  ActionButton,
} from '@/components/design-system/page-container';
import { 
  calculateTariff, 
  formatEuro,
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
  Euro,
  Users,
  Gift
} from 'lucide-react';

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

export default function CalculatorPage() {
  const [internetPlan, setInternetPlan] = useState('');
  const [isSecondAddress, setIsSecondAddress] = useState(false);
  const [mobileLines, setMobileLines] = useState<MobileLine[]>([]);
  const [tvPlan, setTvPlan] = useState('');
  const [currentMonthlyCost, setCurrentMonthlyCost] = useState('');

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

  const currentPlan = internetPlans.find(p => p.value === internetPlan);

  return (
    <PageContainer>
      <PageHeader
        title="Prijs Calculator"
        subtitle="Bereken de perfecte prijs voor je klant"
        icon={<Calculator className="w-6 h-6 text-white" />}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Input */}
          <div className="lg:col-span-2 space-y-6">
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
                      onClick={() => setInternetPlan(plan.value)}
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

                {hasInternet && (
                  <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
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
                                {plan.label} - {formatEuro(plan.price)}
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
                            <span className="text-sm">Nummerbehoud</span>
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
                    <p className="text-sm text-gray-500">Voeg TV toe aan je pakket</p>
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
                          {formatEuro(plan.price)}
                          <span className="text-sm font-normal text-gray-500">/maand</span>
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </SmartCard>
          </div>

          {/* Right Column - Results */}
          <div>
            <div className="sticky top-24 space-y-4">
              {result ? (
                <>
                  <SmartCard className="bg-gradient-to-br from-green-600 to-emerald-700 text-white border-0">
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <TrendingDown className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">Jouw Voordeel</h3>
                          <p className="text-green-100 text-sm">Berekening voor deze klant</p>
                        </div>
                      </div>

                      {/* Price Comparison */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-4 bg-white/10 rounded-xl">
                          <p className="text-green-100 text-sm">Nu</p>
                          <p className="text-2xl font-bold">
                            {formatEuro((parseFloat(currentMonthlyCost) || 0) * 100)}
                          </p>
                        </div>
                        <div className="p-4 bg-white/20 rounded-xl">
                          <p className="text-green-100 text-sm">Met SmartSN</p>
                          <p className="text-2xl font-bold">{formatEuro(result.totalMonthly)}</p>
                        </div>
                      </div>

                      {/* New Price */}
                      <div className="text-center p-6 bg-white/10 rounded-2xl mb-6">
                        <p className="text-green-100 mb-1">Nieuwe Maandprijs</p>
                        <p className="text-5xl font-bold">{formatEuro(result.totalMonthly)}</p>
                        <p className="text-green-200 text-sm mt-1">per maand</p>
                      </div>

                      {/* Savings */}
                      {result.savings6Months && result.savings6Months > 0 && (
                        <div className="p-4 bg-white/20 rounded-xl mb-4">
                          <div className="flex items-center justify-between">
                            <span className="text-green-100">Besparing 6 maanden</span>
                            <span className="text-2xl font-bold">{formatEuro(result.savings6Months)}</span>
                          </div>
                        </div>
                      )}

                      {result.savings24Months && result.savings24Months > 0 && (
                        <div className="p-4 bg-white/10 rounded-xl">
                          <p className="text-green-100 text-sm mb-1">Besparing op 2 jaar</p>
                          <p className="text-3xl font-bold">{formatEuro(result.savings24Months)}</p>
                        </div>
                      )}
                    </div>
                  </SmartCard>

                  {/* Price Breakdown */}
                  <SmartCard className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-4">Prijsopbouw</h4>
                    <div className="space-y-3">
                      {result.internetPrice > 0 && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">Internet</span>
                          <span className="font-semibold">{formatEuro(result.internetPrice)}</span>
                        </div>
                      )}
                      {result.mobilePrice > 0 && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">Mobiel ({mobileLines.length} lijnen)</span>
                          <span className="font-semibold">{formatEuro(result.mobilePrice)}</span>
                        </div>
                      )}
                      {result.tvPrice > 0 && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">TV</span>
                          <span className="font-semibold">{formatEuro(result.tvPrice)}</span>
                        </div>
                      )}
                      {result.secondAddressDiscount > 0 && (
                        <div className="flex justify-between items-center py-2 text-green-600">
                          <span>2de adres korting</span>
                          <span className="font-semibold">-{formatEuro(result.secondAddressDiscount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center pt-2 text-lg font-bold">
                        <span>Totaal</span>
                        <span>{formatEuro(result.totalMonthly)}</span>
                      </div>
                    </div>
                  </SmartCard>

                  {/* CTA */}
                  <ActionButton 
                    href="/leads" 
                    variant="primary" 
                    size="lg" 
                    className="w-full justify-center"
                    icon={<ArrowRight className="w-5 h-5" />}
                  >
                    Maak Offerte
                  </ActionButton>
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
