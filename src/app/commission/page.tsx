'use client';

import { useState } from 'react';
import { 
  PageContainer, 
  PageHeader, 
  SmartCard, 
  StatCard, 
  ActionButton,
} from '@/components/design-system/page-container';
import { 
  Calculator, 
  Wallet, 
  Target, 
  Award, 
  TrendingUp,
  Gift,
  Plane,
  Star,
  Crown,
  Gem,
  Trophy,
  CheckCircle2,
  Lock,
  Zap,
  Users,
  ArrowRight,
  Euro,
  Calendar,
  ArrowLeft,
  Smartphone,
  Wifi,
  Tv
} from 'lucide-react';
import { 
  calculateTotalCommission,
  formatEuro as formatEuroCents,
  type TotalCommissionResult,
  type ServiceItem
} from '@/lib/SMARTV1';
import { PRODUCT_TYPE, CONSULTANT_RANK } from '@/lib/constants';

const RANKS = [
  { rank: CONSULTANT_RANK.BC, name: 'Business Consultant', minASP: 0, color: 'bg-gray-500', textColor: 'text-gray-600' },
  { rank: CONSULTANT_RANK.SC, name: 'Senior Consultant', minASP: 10, color: 'bg-blue-500', textColor: 'text-blue-600' },
  { rank: CONSULTANT_RANK.Y, name: 'Young', minASP: 10, color: 'bg-indigo-500', textColor: 'text-indigo-600' },
  { rank: CONSULTANT_RANK.PC, name: 'Premier Consultant', minASP: 10, color: 'bg-purple-500', textColor: 'text-purple-600' },
  { rank: CONSULTANT_RANK.LE, name: 'Leader', minASP: 10, color: 'bg-orange-500', textColor: 'text-orange-600' },
  { rank: CONSULTANT_RANK.PMC, name: 'Premier Leader', minASP: 10, color: 'bg-red-500', textColor: 'text-red-600' },
];

const PRODUCTS = [
  { type: PRODUCT_TYPE.MOBILE_SMALL, name: 'Mobile Small', icon: Smartphone, color: 'bg-green-100 text-green-600' },
  { type: PRODUCT_TYPE.MOBILE_MEDIUM, name: 'Mobile Medium', icon: Smartphone, color: 'bg-blue-100 text-blue-600' },
  { type: PRODUCT_TYPE.MOBILE_LARGE, name: 'Mobile Large', icon: Smartphone, color: 'bg-purple-100 text-purple-600' },
  { type: PRODUCT_TYPE.MOBILE_UNLIMITED, name: 'Mobile Unlimited', icon: Smartphone, color: 'bg-orange-100 text-orange-600' },
  { type: PRODUCT_TYPE.INTERNET, name: 'Internet', icon: Wifi, color: 'bg-cyan-100 text-cyan-600' },
  { type: PRODUCT_TYPE.ORANGE_TV, name: 'Orange TV', icon: Tv, color: 'bg-pink-100 text-pink-600' },
  { type: PRODUCT_TYPE.ORANGE_TV_LITE, name: 'Orange TV Lite', icon: Tv, color: 'bg-rose-100 text-rose-600' },
];

export default function CommissionPage() {
  const [rank, setRank] = useState<CONSULTANT_RANK>(CONSULTANT_RANK.BC);
  const [selectedProducts, setSelectedProducts] = useState<PRODUCT_TYPE[]>([]);
  const [hasConvergence, setHasConvergence] = useState(false);
  const [hasPortability, setHasPortability] = useState(false);

  const toggleProduct = (product: PRODUCT_TYPE) => {
    if (selectedProducts.includes(product)) {
      setSelectedProducts(selectedProducts.filter(p => p !== product));
    } else {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const services: ServiceItem[] = selectedProducts.map(product => ({
    productType: product,
    options: {
      hasConvergence,
      hasPortability,
    }
  }));

  const commissionResult = selectedProducts.length > 0 
    ? calculateTotalCommission(services, rank)
    : null;

  const totalMonthly = selectedProducts.reduce((sum, p) => {
    const prices: Record<string, number> = {
      [PRODUCT_TYPE.MOBILE_SMALL]: 1500,
      [PRODUCT_TYPE.MOBILE_MEDIUM]: 2300,
      [PRODUCT_TYPE.MOBILE_LARGE]: 2900,
      [PRODUCT_TYPE.MOBILE_UNLIMITED]: 4000,
      [PRODUCT_TYPE.INTERNET]: 6200,
      [PRODUCT_TYPE.ORANGE_TV]: 2000,
      [PRODUCT_TYPE.ORANGE_TV_LITE]: 1000,
    };
    return sum + (prices[p] || 0);
  }, 0);

  return (
    <PageContainer>
      <PageHeader
        title="Mijn Commissie"
        subtitle="Bereken je verdiensten per verkoop"
        icon={<Wallet className="w-6 h-6 text-white" />}
        action={
          <ActionButton href="/dashboard" variant="secondary" icon={<ArrowLeft className="w-4 h-4" />}>
            Dashboard
          </ActionButton>
        }
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Calculator */}
          <div className="lg:col-span-2 space-y-6">
            {/* Rank Selector */}
            <SmartCard className="border-l-4 border-l-orange-500">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Crown className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Jouw Rank</h3>
                    <p className="text-sm text-gray-500">Selecteer je huidige consultant rank</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {RANKS.map((r) => (
                    <button
                      key={r.rank}
                      onClick={() => setRank(r.rank)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        rank === r.rank
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <div className={`w-8 h-8 ${r.color} rounded-lg flex items-center justify-center text-white text-xs font-bold mb-2`}>
                        {r.rank}
                      </div>
                      <p className="font-medium text-sm text-gray-900">{r.name}</p>
                      <p className="text-xs text-gray-500">Min {r.minASP} ASP</p>
                    </button>
                  ))}
                </div>
              </div>
            </SmartCard>

            {/* Products */}
            <SmartCard className="border-l-4 border-l-blue-500">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Producten</h3>
                    <p className="text-sm text-gray-500">Selecteer de verkochte producten</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {PRODUCTS.map((product) => {
                    const Icon = product.icon;
                    const isSelected = selectedProducts.includes(product.type);
                    return (
                      <button
                        key={product.type}
                        onClick={() => toggleProduct(product.type)}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className={`w-10 h-10 ${product.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <p className="font-medium text-sm text-gray-900">{product.name}</p>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-500 mx-auto mt-1" />}
                      </button>
                    );
                  })}
                </div>

                {/* Options */}
                <div className="mt-4 space-y-3">
                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
                    <input
                      type="checkbox"
                      checked={hasConvergence}
                      onChange={(e) => setHasConvergence(e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded-lg"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Convergentie</div>
                      <div className="text-sm text-gray-500">Mobiel + Internet samen geactiveerd</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
                    <input
                      type="checkbox"
                      checked={hasPortability}
                      onChange={(e) => setHasPortability(e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded-lg"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Nummerbehoud</div>
                      <div className="text-sm text-gray-500">Klant houdt bestaand nummer</div>
                    </div>
                  </label>
                </div>
              </div>
            </SmartCard>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                icon={<Target className="w-5 h-5 text-blue-600" />}
                label="Geselecteerd"
                value={selectedProducts.length.toString()}
                color="blue"
              />
              <StatCard
                icon={<Euro className="w-5 h-5 text-green-600" />}
                label="Maandbedrag"
                value={formatEuroCents(totalMonthly)}
                color="green"
              />
              <StatCard
                icon={<Award className="w-5 h-5 text-orange-600" />}
                label="Commissie"
                value={commissionResult ? formatEuroCents(commissionResult.grandTotal) : '€0,00'}
                color="orange"
              />
              <StatCard
                icon={<TrendingUp className="w-5 h-5 text-purple-600" />}
                label="Percentage"
                value={commissionResult && totalMonthly > 0 
                  ? Math.round((commissionResult.grandTotal / totalMonthly) * 100) + '%'
                  : '0%'}
                color="purple"
              />
            </div>
          </div>

          {/* Right Column - Results */}
          <div>
            <div className="sticky top-24 space-y-4">
              {commissionResult ? (
                <>
                  <SmartCard className="bg-gradient-to-br from-green-600 to-emerald-700 text-white border-0">
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <Wallet className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">Jouw Verdienste</h3>
                          <p className="text-green-100 text-sm">Voor deze verkoop</p>
                        </div>
                      </div>

                      <div className="text-center p-6 bg-white/10 rounded-2xl mb-6">
                        <p className="text-green-100 mb-1">Totale Commissie</p>
                        <p className="text-5xl font-bold">{formatEuroCents(commissionResult.grandTotal)}</p>
                      </div>

                      <div className="space-y-3">
                        {commissionResult.services.map((service, idx) => (
                          <div key={idx} className="flex justify-between items-center py-2 border-b border-white/20">
                            <span className="text-green-100">
                              {PRODUCTS.find(p => p.type === service.productType)?.name || service.productType}
                            </span>
                            <span className="font-semibold">{formatEuroCents(service.breakdown.total)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </SmartCard>

                  {/* ASP Points */}
                  <SmartCard className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">ASP Punten</h4>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 bg-gray-100 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all"
                          style={{ width: `${Math.min(100, (commissionResult.totalASP.total / 12) * 100)}%` }}
                        />
                      </div>
                      <span className="font-bold text-gray-900">{commissionResult.totalASP.total}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {commissionResult.totalASP.baseASP} basis + {commissionResult.totalASP.extraASP} extra
                    </p>
                  </SmartCard>
                </>
              ) : (
                <SmartCard className="p-6 text-center">
                  <Calculator className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="font-semibold text-gray-900 mb-2">Selecteer producten</h3>
                  <p className="text-gray-500">Kies je rank en producten om je commissie te berekenen</p>
                </SmartCard>
              )}

              {/* Rank Info */}
              <SmartCard className="p-4 bg-orange-50 border-orange-200">
                <div className="flex items-start gap-3">
                  <Crown className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-orange-900">{RANKS.find(r => r.rank === rank)?.name}</p>
                    <p className="text-sm text-orange-700 mt-1">
                      Als {RANKS.find(r => r.rank === rank)?.name} verdien je meer commissie en bonussen op elke verkoop.
                    </p>
                  </div>
                </div>
              </SmartCard>
            </div>
          </div>
        </div>
      </main>
    </PageContainer>
  );
}
