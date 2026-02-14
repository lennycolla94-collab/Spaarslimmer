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
  CheckCircle2,
  Settings,
  Router,
  BadgeCheck,
  PiggyBank,
  Building2,
  ChevronRight,
  Sparkles,
  Phone,
  FileText,
  Package,
  Calculator
} from 'lucide-react';
import Link from 'next/link';

// ============================================
// ORANGE BELGIË PRIJZEN - ZONDER PROMOTIES
// ============================================

const INTERNET_STANDALONE = { START: 53, ZEN: 62, GIGA: 72 };
const INTERNET_PACK = { START: 49, ZEN: 58, GIGA: 68 };

const MOBILE_STANDALONE = {
  SMALL: { price: 15, data: '12 GB', commission: 10 },
  MEDIUM: { price: 23, data: '70 GB', commission: 35 },
  LARGE: { price: 30, data: '140 GB', commission: 50 },
  UNLIMITED: { price: 40, data: 'Onbeperkt', commission: 60 }
};

const MOBILE_STANDALONE_2PLUS = {
  SMALL: { price: 14, data: '12 GB', commission: 10 },
  MEDIUM: { price: 21, data: '70 GB', commission: 35 },
  LARGE: { price: 26.50, data: '140 GB', commission: 50 },
  UNLIMITED: { price: 37, data: 'Onbeperkt', commission: 60 }
};

const MOBILE_PACK_1 = {
  SMALL: { price: 12, data: '12 GB', commission: 10 },
  MEDIUM: { price: 17, data: '70 GB', commission: 35 },
  LARGE: { price: 22.50, data: '140 GB', commission: 50 },
  UNLIMITED: { price: 33, data: 'Onbeperkt', commission: 60 }
};

const MOBILE_PACK_2PLUS = {
  SMALL: { price: 11, data: '12 GB', commission: 10 },
  MEDIUM: { price: 15, data: '70 GB', commission: 35 },
  LARGE: { price: 20, data: '140 GB', commission: 50 },
  UNLIMITED: { price: 30, data: 'Onbeperkt', commission: 60 }
};

const TV_OPTIONS = {
  NONE: { name: 'Geen TV', price: 0, commission: 0 },
  LIFE: { name: 'Orange TV Life', price: 10, commission: 10 },
  TV: { name: 'Orange TV', price: 20, commission: 10 },
  PLUS: { name: 'Orange TV Plus', price: 32, commission: 10 }
};

const INTERNET_COMMISSION = 15;

interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  city: string;
}

const MOCK_LEADS: Lead[] = [
  { id: '1', companyName: 'Willems Groep', contactName: 'Sophie Willems', city: 'Mechelen' },
  { id: '2', companyName: 'Tech Solutions BV', contactName: 'Jan Peeters', city: 'Brussel' },
  { id: '3', companyName: 'Bakkerij De Lekkernij', contactName: 'Maria Peeters', city: 'Aalst' },
  { id: '4', companyName: 'Mars NV', contactName: 'Luc Martens', city: 'Antwerpen' },
];

// Mock products for selection
const INTERNET_PRODUCTS = [
  { key: 'START', name: 'Start Fiber', speed: '200 Mbps', icon: '📡' },
  { key: 'ZEN', name: 'Zen Fiber', speed: '500 Mbps', icon: '🚀', popular: true },
  { key: 'GIGA', name: 'Giga Fiber', speed: '1000 Mbps', icon: '⚡' },
];

const MOBILE_PRODUCTS = [
  { key: 'SMALL', name: 'Small', data: '12 GB', icon: '📱' },
  { key: 'MEDIUM', name: 'Medium', data: '70 GB', icon: '📲' },
  { key: 'LARGE', name: 'Large', data: '140 GB', icon: '📳' },
  { key: 'UNLIMITED', name: 'Unlimited', data: '∞', icon: '🌐' },
];

function CalculatorContent() {
  const searchParams = useSearchParams();
  const leadId = searchParams.get('lead');
  
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showLeadSelect, setShowLeadSelect] = useState(false);
  const [currentCost, setCurrentCost] = useState<number>(0);
  const [internet, setInternet] = useState<string | null>(null);
  const [isSecondAddress, setIsSecondAddress] = useState(false);
  const [secondAddressInternet, setSecondAddressInternet] = useState<string | null>(null);
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
    if (leadId) {
      const lead = MOCK_LEADS.find(l => l.id === leadId);
      if (lead) setSelectedLead(lead);
    }
  }, [leadId]);

  useEffect(() => {
    let total = 0;
    let commission = 0;

    if (internet) {
      const hasMobile = mobileLines.length > 0;
      let price = hasMobile ? INTERNET_PACK[internet as keyof typeof INTERNET_PACK] : INTERNET_STANDALONE[internet as keyof typeof INTERNET_STANDALONE];
      total += price;
      commission += INTERNET_COMMISSION;
      if (comfort && internet === 'GIGA') total += 5;
      else if (comfort) total += 10;
    }
    
    if (isSecondAddress && secondAddressInternet) {
      let secondPrice = INTERNET_STANDALONE[secondAddressInternet as keyof typeof INTERNET_STANDALONE] - 10;
      total += secondPrice;
      commission += INTERNET_COMMISSION;
    }

    if (mobileLines.length > 0) {
      const hasInternet = !!internet;
      mobileLines.forEach((line) => {
        if (!line.plan) return;
        let planData;
        if (hasInternet) {
          planData = mobileLines.length === 1 
            ? MOBILE_PACK_1[line.plan as keyof typeof MOBILE_PACK_1]
            : MOBILE_PACK_2PLUS[line.plan as keyof typeof MOBILE_PACK_2PLUS];
        } else {
          planData = mobileLines.length === 1
            ? MOBILE_STANDALONE[line.plan as keyof typeof MOBILE_STANDALONE]
            : MOBILE_STANDALONE_2PLUS[line.plan as keyof typeof MOBILE_STANDALONE_2PLUS];
        }
        if (planData) {
          total += planData.price;
          commission += planData.commission;
          if (line.portability && ['MEDIUM', 'LARGE', 'UNLIMITED'].includes(line.plan)) commission += 20;
        }
      });
    }

    if (internet && tv && tv !== 'NONE') {
      const tvData = TV_OPTIONS[tv as keyof typeof TV_OPTIONS];
      if (tvData) {
        total += tvData.price;
        commission += tvData.commission;
      }
      total += extraDecoders * 9;
    }

    if (internet && landline) total += 12;
    total += wifiBoosters * 3;

    const savings = Math.max(0, currentCost - total);
    
    setResults({
      newMonthly: total,
      currentMonthly: currentCost,
      savings,
      yearlySavings: savings * 12,
      commission
    });
  }, [internet, isSecondAddress, secondAddressInternet, mobileLines, tv, extraDecoders, landline, comfort, wifiBoosters, currentCost]);

  useEffect(() => {
    if (!internet) {
      setTv('NONE');
      setExtraDecoders(0);
      setLandline(false);
      setComfort(false);
      setWifiBoosters(0);
    }
  }, [internet]);
  
  useEffect(() => {
    if (!isSecondAddress) {
      setSecondAddressInternet(null);
    }
  }, [isSecondAddress]);

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
      <div className="calculator-container">
        {/* Left Column: Calculator Form */}
        <div className="calculator-form">
          {/* Header */}
          <div className="calculator-header">
            <Link href="/dashboard" className="btn btn--secondary btn--icon">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1">
              <h1 className="heading-3">Prijs Calculator</h1>
              <p className="body-small">Bereken de prijs en commissie voor je klant</p>
            </div>
          </div>

          {/* Step 1: Lead Selection */}
          <div className="calculator-section">
            <label className="form-label">
              <Building2 className="w-5 h-5" />
              Selecteer Bedrijf
            </label>
            
            {!selectedLead ? (
              <button 
                className="lead-select-trigger"
                onClick={() => setShowLeadSelect(true)}
              >
                <User className="w-5 h-5 text-[var(--text-tertiary)]" />
                <span className="flex-1 text-left text-[var(--text-tertiary)]">Kies een lead...</span>
                <ChevronRight className="w-5 h-5 text-[var(--text-tertiary)]" />
              </button>
            ) : (
              <div className="lead-card-selected">
                <div className="lead-card-avatar">
                  {selectedLead.companyName[0]}
                </div>
                <div className="flex-1">
                  <div className="lead-card-company">{selectedLead.companyName}</div>
                  <div className="lead-card-contact">{selectedLead.contactName} • {selectedLead.city}</div>
                </div>
                <button 
                  className="btn btn--ghost btn--icon"
                  onClick={() => setSelectedLead(null)}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Lead Select Dropdown */}
            {showLeadSelect && (
              <div className="lead-select-dropdown">
                {MOCK_LEADS.map((lead) => (
                  <button
                    key={lead.id}
                    className="lead-select-option"
                    onClick={() => {
                      setSelectedLead(lead);
                      setShowLeadSelect(false);
                    }}
                  >
                    <div className="lead-select-avatar">{lead.companyName[0]}</div>
                    <div className="text-left">
                      <div className="font-medium text-[var(--text-primary)]">{lead.companyName}</div>
                      <div className="text-sm text-[var(--text-tertiary)]">{lead.contactName} • {lead.city}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Step 2: Current Cost */}
          <div className="calculator-section">
            <label className="form-label">
              <PiggyBank className="w-5 h-5" />
              Huidige Maandkosten
            </label>
            <div className="current-cost-input">
              <Euro className="w-5 h-5 text-[var(--text-tertiary)]" />
              <input
                type="number"
                value={currentCost || ''}
                onChange={(e) => setCurrentCost(Number(e.target.value))}
                placeholder="0"
                className="flex-1 bg-transparent text-2xl font-bold text-[var(--text-primary)] outline-none"
              />
              <span className="text-[var(--text-tertiary)]">/maand</span>
            </div>
          </div>

          {/* Step 3: Internet */}
          <div className="calculator-section">
            <label className="form-label">
              <Wifi className="w-5 h-5" />
              Selecteer Internet
            </label>
            
            <div className="product-grid">
              {INTERNET_PRODUCTS.map((product) => {
                const price = hasConvergence 
                  ? INTERNET_PACK[product.key as keyof typeof INTERNET_PACK]
                  : INTERNET_STANDALONE[product.key as keyof typeof INTERNET_STANDALONE];
                const isSelected = internet === product.key;
                
                return (
                  <label 
                    key={product.key}
                    className={`product-card ${isSelected ? 'product-card--selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="internet"
                      value={product.key}
                      checked={isSelected}
                      onChange={() => setInternet(isSelected ? null : product.key)}
                      className="sr-only"
                    />
                    <div className="product-card-content">
                      <div className="product-card-icon">{product.icon}</div>
                      <div className="flex-1">
                        <div className="product-card-title">
                          {product.name}
                          {product.popular && <span className="product-card-badge">Populair</span>}
                        </div>
                        <div className="product-card-price">€{price}/maand</div>
                        <div className="product-card-subtitle">{product.speed}</div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-[var(--primary-orange)]" />}
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Second Address Toggle */}
            <label className="second-address-toggle">
              <input
                type="checkbox"
                checked={isSecondAddress}
                onChange={(e) => setIsSecondAddress(e.target.checked)}
              />
              <div className="toggle-switch"></div>
              <span>2de Adres (€10 korting)</span>
            </label>

            {/* Second Address Selection */}
            {isSecondAddress && (
              <div className="second-address-section">
                <p className="text-sm text-[var(--text-secondary)] mb-3">Internet voor tweede adres</p>
                <div className="product-grid product-grid--compact">
                  {INTERNET_PRODUCTS.map((product) => {
                    const price = INTERNET_STANDALONE[product.key as keyof typeof INTERNET_STANDALONE] - 10;
                    const isSelected = secondAddressInternet === product.key;
                    
                    return (
                      <label 
                        key={product.key}
                        className={`product-card product-card--compact ${isSelected ? 'product-card--selected' : ''}`}
                      >
                        <input
                          type="radio"
                          name="secondInternet"
                          value={product.key}
                          checked={isSelected}
                          onChange={() => setSecondAddressInternet(isSelected ? null : product.key)}
                          className="sr-only"
                        />
                        <div className="product-card-content">
                          <div className="product-card-title">{product.name}</div>
                          <div className="product-card-price">€{price}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Step 4: Mobile */}
          <div className="calculator-section">
            <div className="flex items-center justify-between mb-4">
              <label className="form-label !mb-0">
                <Smartphone className="w-5 h-5" />
                Mobiele Lijnen
              </label>
              <button onClick={addMobileLine} className="btn btn--secondary btn--sm">
                <Plus className="w-4 h-4" />
                Toevoegen
              </button>
            </div>

            {mobileLines.length === 0 ? (
              <div className="empty-section">
                <Smartphone className="w-8 h-8" />
                <p>Nog geen mobiele lijnen toegevoegd</p>
              </div>
            ) : (
              <div className="mobile-lines-list">
                {mobileLines.map((line, idx) => (
                  <div key={idx} className="mobile-line-card">
                    <div className="mobile-line-header">
                      <span className="mobile-line-number">GSM {idx + 1}</span>
                      <button 
                        className="btn btn--ghost btn--icon btn--sm"
                        onClick={() => removeMobileLine(idx)}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <select
                      value={line.plan}
                      onChange={(e) => updateMobileLine(idx, 'plan', e.target.value)}
                      className="form-select mb-3"
                    >
                      <option value="">Kies abonnement</option>
                      {MOBILE_PRODUCTS.map((plan) => {
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
                        return (
                          <option key={plan.key} value={plan.key}>
                            {plan.name} ({plan.data}) — €{planData?.price}/maand
                          </option>
                        );
                      })}
                    </select>

                    {line.plan && ['MEDIUM', 'LARGE', 'UNLIMITED'].includes(line.plan) && (
                      <label className="portability-option">
                        <input
                          type="checkbox"
                          checked={line.portability}
                          onChange={(e) => updateMobileLine(idx, 'portability', e.target.checked)}
                        />
                        <span>Nummerbehoud (+€20 bonus)</span>
                      </label>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Step 5: TV */}
          <div className={`calculator-section ${!internet ? 'calculator-section--disabled' : ''}`}>
            <label className="form-label">
              <Tv className="w-5 h-5" />
              TV (optioneel)
            </label>
            
            <div className="tv-options">
              {Object.entries(TV_OPTIONS).map(([key, opt]) => (
                <label 
                  key={key}
                  className={`tv-option ${tv === key ? 'tv-option--selected' : ''} ${!internet ? 'tv-option--disabled' : ''}`}
                >
                  <input
                    type="radio"
                    name="tv"
                    value={key}
                    checked={tv === key}
                    onChange={() => setTv(key)}
                    disabled={!internet}
                    className="sr-only"
                  />
                  <div className="tv-option-content">
                    <div className="tv-option-name">{opt.name}</div>
                    <div className="tv-option-price">€{opt.price}</div>
                  </div>
                </label>
              ))}
            </div>

            {tv !== 'NONE' && (
              <div className="extra-decoders">
                <span>Extra decoders</span>
                <div className="quantity-control">
                  <button onClick={() => setExtraDecoders(Math.max(0, extraDecoders - 1))}>
                    <Minus className="w-4 h-4" />
                  </button>
                  <span>{extraDecoders}</span>
                  <button onClick={() => setExtraDecoders(extraDecoders + 1)}>
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-[var(--text-tertiary)]">€{extraDecoders * 9}</span>
              </div>
            )}
          </div>

          {/* Step 6: Extras */}
          <div className={`calculator-section ${!internet ? 'calculator-section--disabled' : ''}`}>
            <label className="form-label">
              <Package className="w-5 h-5" />
              Extra Opties
            </label>

            <div className="extras-list">
              <label className={`extra-option ${landline ? 'extra-option--selected' : ''}`}>
                <input
                  type="checkbox"
                  checked={landline}
                  onChange={(e) => setLandline(e.target.checked)}
                  disabled={!internet}
                />
                <div className="extra-option-content">
                  <Phone className="w-4 h-4" />
                  <div className="flex-1">
                    <div className="extra-option-name">Vaste Lijn</div>
                    <div className="extra-option-desc">Onbeperkt bellen</div>
                  </div>
                  <span className="extra-option-price">€12</span>
                </div>
              </label>

              <label className={`extra-option ${comfort ? 'extra-option--selected' : ''}`}>
                <input
                  type="checkbox"
                  checked={comfort}
                  onChange={(e) => setComfort(e.target.checked)}
                  disabled={!internet}
                />
                <div className="extra-option-content">
                  <Settings className="w-4 h-4" />
                  <div className="flex-1">
                    <div className="extra-option-name">My Comfort</div>
                    {internet === 'GIGA' && <span className="extra-option-discount">-50%</span>}
                  </div>
                  <span className="extra-option-price">€{internet === 'GIGA' ? 5 : 10}</span>
                </div>
              </label>

              <div className="extra-option">
                <div className="extra-option-content">
                  <Router className="w-4 h-4" />
                  <div className="flex-1">
                    <div className="extra-option-name">WiFi Boosters</div>
                    <div className="extra-option-desc">Max. 3</div>
                  </div>
                  <div className="quantity-control">
                    <button 
                      onClick={() => setWifiBoosters(Math.max(0, wifiBoosters - 1))}
                      disabled={!internet}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span>{wifiBoosters}</span>
                    <button 
                      onClick={() => setWifiBoosters(Math.min(3, wifiBoosters + 1))}
                      disabled={!internet}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Summary */}
        <div className="calculator-summary">
          {/* Client Summary */}
          <div className="summary-card">
            <div className="summary-card-header">
              <User className="w-4 h-4" />
              <span>Voor de Klant</span>
            </div>
            <div className="summary-card-body">
              <div className="summary-comparison">
                <div className="summary-comparison-item">
                  <span className="summary-comparison-label">Nu</span>
                  <span className="summary-comparison-value">€{results.currentMonthly.toFixed(0)}</span>
                </div>
                <div className="summary-comparison-arrow">
                  <ChevronRight className="w-5 h-5" />
                </div>
                <div className="summary-comparison-item summary-comparison-item--new">
                  <span className="summary-comparison-label">Met SmartSN</span>
                  <span className="summary-comparison-value">€{results.newMonthly.toFixed(0)}</span>
                </div>
              </div>
              
              <div className="summary-total">
                €{results.newMonthly.toFixed(2)}
                <span className="summary-total-period">/maand</span>
              </div>
              
              {results.savings > 0 && (
                <div className="summary-savings">
                  <Sparkles className="w-4 h-4" />
                  <span>Jaarlijkse besparing: €{results.yearlySavings.toFixed(0)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Commission Summary */}
          <div className="summary-card summary-card--commission">
            <div className="summary-card-header">
              <TrendingUp className="w-4 h-4" />
              <span>Jouw Commissie</span>
            </div>
            <div className="summary-card-body">
              <div className="commission-total">
                €{results.commission}
              </div>
              <p className="commission-subtitle">Verwachte commissie bij verkoop</p>
              
              <div className="commission-breakdown">
                {internet && (
                  <div className="commission-breakdown-item">
                    <span>Internet</span>
                    <span>€{INTERNET_COMMISSION}</span>
                  </div>
                )}
                {isSecondAddress && secondAddressInternet && (
                  <div className="commission-breakdown-item">
                    <span>Internet (2de)</span>
                    <span>€{INTERNET_COMMISSION}</span>
                  </div>
                )}
                {mobileLines.filter(l => l.plan).map((line, idx) => {
                  const hasInternet = !!internet;
                  let planData;
                  if (hasInternet) {
                    planData = mobileLines.length === 1 
                      ? MOBILE_PACK_1[line.plan as keyof typeof MOBILE_PACK_1]
                      : MOBILE_PACK_2PLUS[line.plan as keyof typeof MOBILE_PACK_2PLUS];
                  } else {
                    planData = mobileLines.length === 1
                      ? MOBILE_STANDALONE[line.plan as keyof typeof MOBILE_STANDALONE]
                      : MOBILE_STANDALONE_2PLUS[line.plan as keyof typeof MOBILE_STANDALONE_2PLUS];
                  }
                  const portabilityBonus = line.portability && ['MEDIUM', 'LARGE', 'UNLIMITED'].includes(line.plan) ? 20 : 0;
                  return (
                    <div key={idx} className="commission-breakdown-item">
                      <span>GSM {idx + 1}{portabilityBonus > 0 && ' (+nummerbehoud)'}</span>
                      <span>€{(planData?.commission || 0) + portabilityBonus}</span>
                    </div>
                  );
                })}
                {internet && tv && tv !== 'NONE' && (
                  <div className="commission-breakdown-item">
                    <span>TV</span>
                    <span>€10</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="summary-card">
            <div className="summary-card-header">
              <Calculator className="w-4 h-4" />
              <span>Prijsopbouw</span>
            </div>
            <div className="summary-card-body">
              <div className="price-breakdown">
                {internet && (
                  <div className="price-breakdown-item">
                    <span>Internet</span>
                    <span>€{(hasConvergence ? INTERNET_PACK : INTERNET_STANDALONE)[internet as keyof typeof INTERNET_STANDALONE]}</span>
                  </div>
                )}
                {isSecondAddress && secondAddressInternet && (
                  <div className="price-breakdown-item">
                    <span>Internet (2de)</span>
                    <span>€{INTERNET_STANDALONE[secondAddressInternet as keyof typeof INTERNET_STANDALONE] - 10}</span>
                  </div>
                )}
                {mobileLines.filter(l => l.plan).map((line, idx) => {
                  const hasInternet = !!internet;
                  let planData;
                  if (hasInternet) {
                    planData = mobileLines.length === 1 
                      ? MOBILE_PACK_1[line.plan as keyof typeof MOBILE_PACK_1]
                      : MOBILE_PACK_2PLUS[line.plan as keyof typeof MOBILE_PACK_2PLUS];
                  } else {
                    planData = mobileLines.length === 1
                      ? MOBILE_STANDALONE[line.plan as keyof typeof MOBILE_STANDALONE]
                      : MOBILE_STANDALONE_2PLUS[line.plan as keyof typeof MOBILE_STANDALONE_2PLUS];
                  }
                  return (
                    <div key={idx} className="price-breakdown-item">
                      <span>GSM {idx + 1}</span>
                      <span>€{planData?.price.toFixed(2)}</span>
                    </div>
                  );
                })}
                {internet && tv && tv !== 'NONE' && (
                  <div className="price-breakdown-item">
                    <span>{TV_OPTIONS[tv as keyof typeof TV_OPTIONS].name}</span>
                    <span>€{TV_OPTIONS[tv as keyof typeof TV_OPTIONS].price}</span>
                  </div>
                )}
                {extraDecoders > 0 && (
                  <div className="price-breakdown-item">
                    <span>Extra decoders ({extraDecoders}x)</span>
                    <span>€{extraDecoders * 9}</span>
                  </div>
                )}
                {landline && (
                  <div className="price-breakdown-item">
                    <span>Vaste lijn</span>
                    <span>€12</span>
                  </div>
                )}
                {comfort && (
                  <div className="price-breakdown-item">
                    <span>My Comfort</span>
                    <span>€{internet === 'GIGA' ? 5 : 10}</span>
                  </div>
                )}
                {wifiBoosters > 0 && (
                  <div className="price-breakdown-item">
                    <span>WiFi Boosters ({wifiBoosters}x)</span>
                    <span>€{wifiBoosters * 3}</span>
                  </div>
                )}
              </div>
              
              <div className="price-breakdown-total">
                <span>Totaal per maand</span>
                <span>€{results.newMonthly.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="calculator-actions">
            <button 
              className="btn btn--primary btn--block btn--lg"
              disabled={!selectedLead || !internet}
            >
              <FileText className="w-5 h-5" />
              Genereer Offerte
            </button>
            <button 
              className="btn btn--secondary btn--block"
              disabled={!selectedLead || !internet}
            >
              <Save className="w-5 h-5" />
              Opslaan als Concept
            </button>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        .calculator-container {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: var(--space-2xl);
          padding: var(--space-lg);
          max-width: 1400px;
          margin: 0 auto;
        }

        @media (max-width: 1200px) {
          .calculator-container {
            grid-template-columns: 1fr;
          }
          .calculator-summary {
            position: static;
          }
        }

        .calculator-form {
          max-width: 800px;
        }

        .calculator-header {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          margin-bottom: var(--space-2xl);
        }

        .calculator-section {
          background: var(--bg-card);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
          margin-bottom: var(--space-lg);
          transition: var(--transition-base);
        }

        .calculator-section--disabled {
          opacity: 0.6;
          pointer-events: none;
        }

        /* Lead Selection */
        .lead-select-trigger {
          width: 100%;
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-md);
          background: var(--bg-tertiary);
          border: 1px dashed rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-md);
          transition: var(--transition-base);
        }

        .lead-select-trigger:hover {
          border-color: var(--primary-orange);
          background: var(--bg-hover);
        }

        .lead-card-selected {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-md);
          background: var(--bg-tertiary);
          border: 1px solid rgba(255, 107, 53, 0.3);
          border-radius: var(--radius-md);
        }

        .lead-card-avatar {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          background: var(--primary-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: var(--font-bold);
          font-size: var(--text-lg);
        }

        .lead-card-company {
          font-weight: var(--font-semibold);
          color: var(--text-primary);
        }

        .lead-card-contact {
          font-size: var(--text-sm);
          color: var(--text-tertiary);
        }

        .lead-select-dropdown {
          margin-top: var(--space-sm);
          background: var(--bg-card);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .lead-select-option {
          width: 100%;
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-md);
          transition: var(--transition-fast);
        }

        .lead-select-option:hover {
          background: var(--bg-hover);
        }

        .lead-select-avatar {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          background: var(--primary-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: var(--font-semibold);
        }

        /* Current Cost Input */
        .current-cost-input {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-md);
          background: var(--bg-tertiary);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-md);
        }

        /* Product Grid */
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: var(--space-md);
        }

        .product-grid--compact {
          grid-template-columns: repeat(3, 1fr);
        }

        .product-card {
          position: relative;
          cursor: pointer;
        }

        .product-card input {
          position: absolute;
          opacity: 0;
        }

        .product-card-content {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-md);
          background: var(--bg-tertiary);
          border: 2px solid rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-md);
          transition: var(--transition-base);
        }

        .product-card:hover .product-card-content {
          border-color: rgba(255, 255, 255, 0.1);
        }

        .product-card--selected .product-card-content {
          border-color: var(--primary-orange);
          background: rgba(255, 107, 53, 0.1);
        }

        .product-card-icon {
          font-size: 28px;
          flex-shrink: 0;
        }

        .product-card-title {
          font-weight: var(--font-semibold);
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }

        .product-card-badge {
          font-size: var(--text-xs);
          padding: 2px 8px;
          background: var(--primary-gradient);
          color: white;
          border-radius: var(--radius-full);
        }

        .product-card-price {
          font-size: var(--text-sm);
          color: var(--primary-orange);
          font-weight: var(--font-medium);
        }

        .product-card-subtitle {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
        }

        /* Second Address */
        .second-address-toggle {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          margin-top: var(--space-md);
          padding: var(--space-md);
          background: var(--bg-tertiary);
          border-radius: var(--radius-md);
          cursor: pointer;
        }

        .second-address-toggle input {
          display: none;
        }

        .toggle-switch {
          width: 44px;
          height: 24px;
          background: var(--bg-hover);
          border-radius: var(--radius-full);
          position: relative;
          transition: var(--transition-base);
        }

        .toggle-switch::after {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          top: 2px;
          left: 2px;
          transition: var(--transition-base);
        }

        .second-address-toggle input:checked + .toggle-switch {
          background: var(--primary-orange);
        }

        .second-address-toggle input:checked + .toggle-switch::after {
          left: 22px;
        }

        .second-address-section {
          margin-top: var(--space-lg);
          padding-top: var(--space-lg);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        /* Mobile Lines */
        .mobile-lines-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .mobile-line-card {
          background: var(--bg-tertiary);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .mobile-line-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-sm) var(--space-md);
          background: var(--bg-hover);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .mobile-line-number {
          font-weight: var(--font-semibold);
          color: var(--text-primary);
          font-size: var(--text-sm);
        }

        .mobile-line-card .form-select {
          margin: var(--space-md);
          width: calc(100% - var(--space-lg));
        }

        .portability-option {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          margin: 0 var(--space-md) var(--space-md);
          padding: var(--space-sm);
          background: rgba(16, 185, 129, 0.1);
          border-radius: var(--radius-sm);
          cursor: pointer;
          font-size: var(--text-sm);
        }

        /* TV Options */
        .tv-options {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-sm);
        }

        .tv-option {
          cursor: pointer;
        }

        .tv-option--disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .tv-option-content {
          padding: var(--space-md);
          background: var(--bg-tertiary);
          border: 2px solid rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-md);
          text-align: center;
          transition: var(--transition-base);
        }

        .tv-option:hover .tv-option-content {
          border-color: rgba(255, 255, 255, 0.1);
        }

        .tv-option--selected .tv-option-content {
          border-color: var(--primary-orange);
          background: rgba(255, 107, 53, 0.1);
        }

        .tv-option-name {
          font-weight: var(--font-medium);
          color: var(--text-primary);
          font-size: var(--text-sm);
        }

        .tv-option-price {
          font-size: var(--text-lg);
          font-weight: var(--font-bold);
          color: var(--text-primary);
        }

        .extra-decoders {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: var(--space-md);
          padding-top: var(--space-md);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        /* Extras */
        .extras-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .extra-option {
          cursor: pointer;
        }

        .extra-option input {
          display: none;
        }

        .extra-option-content {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-md);
          background: var(--bg-tertiary);
          border: 2px solid rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-md);
          transition: var(--transition-base);
        }

        .extra-option:hover .extra-option-content {
          border-color: rgba(255, 255, 255, 0.1);
        }

        .extra-option--selected .extra-option-content {
          border-color: var(--primary-orange);
          background: rgba(255, 107, 53, 0.1);
        }

        .extra-option-name {
          font-weight: var(--font-medium);
          color: var(--text-primary);
        }

        .extra-option-desc {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
        }

        .extra-option-price {
          font-weight: var(--font-semibold);
          color: var(--text-primary);
        }

        .extra-option-discount {
          font-size: var(--text-xs);
          padding: 2px 6px;
          background: var(--success);
          color: white;
          border-radius: var(--radius-sm);
        }

        /* Quantity Control */
        .quantity-control {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }

        .quantity-control button {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-hover);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .quantity-control button:hover {
          background: var(--bg-card);
          color: var(--text-primary);
        }

        .quantity-control button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .quantity-control span {
          min-width: 24px;
          text-align: center;
          font-weight: var(--font-semibold);
          color: var(--text-primary);
        }

        /* Empty Section */
        .empty-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-2xl);
          color: var(--text-tertiary);
          text-align: center;
        }

        /* Summary Sidebar */
        .calculator-summary {
          position: sticky;
          top: 88px;
          height: fit-content;
        }

        .summary-card {
          background: var(--bg-card);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-lg);
          margin-bottom: var(--space-lg);
          overflow: hidden;
        }

        .summary-card--commission {
          background: linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(255, 0, 107, 0.1) 100%);
          border-color: rgba(255, 107, 53, 0.2);
        }

        .summary-card-header {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-md) var(--space-lg);
          font-size: var(--text-xs);
          font-weight: var(--font-semibold);
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .summary-card-body {
          padding: var(--space-lg);
        }

        .summary-comparison {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          margin-bottom: var(--space-lg);
        }

        .summary-comparison-item {
          flex: 1;
          text-align: center;
          padding: var(--space-md);
          background: var(--bg-tertiary);
          border-radius: var(--radius-md);
        }

        .summary-comparison-item--new {
          background: rgba(16, 185, 129, 0.1);
        }

        .summary-comparison-label {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
          display: block;
          margin-bottom: 4px;
        }

        .summary-comparison-value {
          font-size: var(--text-xl);
          font-weight: var(--font-bold);
          color: var(--text-primary);
        }

        .summary-comparison-arrow {
          color: var(--text-tertiary);
        }

        .summary-total {
          font-size: var(--text-4xl);
          font-weight: var(--font-bold);
          color: var(--text-primary);
          text-align: center;
          margin-bottom: var(--space-sm);
        }

        .summary-total-period {
          font-size: var(--text-base);
          font-weight: var(--font-regular);
          color: var(--text-tertiary);
        }

        .summary-savings {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-sm);
          padding: var(--space-md);
          background: rgba(245, 158, 11, 0.1);
          border-radius: var(--radius-md);
          color: var(--warning);
          font-size: var(--text-sm);
          font-weight: var(--font-medium);
        }

        .commission-total {
          font-size: var(--text-4xl);
          font-weight: var(--font-bold);
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-align: center;
          margin-bottom: var(--space-sm);
        }

        .commission-subtitle {
          text-align: center;
          font-size: var(--text-sm);
          color: var(--text-tertiary);
          margin-bottom: var(--space-lg);
        }

        .commission-breakdown {
          padding-top: var(--space-md);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .commission-breakdown-item,
        .price-breakdown-item {
          display: flex;
          justify-content: space-between;
          padding: var(--space-sm) 0;
          font-size: var(--text-sm);
          color: var(--text-secondary);
        }

        .price-breakdown {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .price-breakdown-total {
          display: flex;
          justify-content: space-between;
          padding-top: var(--space-md);
          margin-top: var(--space-md);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          font-weight: var(--font-bold);
          color: var(--text-primary);
          font-size: var(--text-lg);
        }

        .calculator-actions {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }
      `}</style>
    </PremiumLayout>
  );
}

export default function CalculatorPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <div className="spinner spinner--lg"></div>
      </div>
    }>
      <CalculatorContent />
    </Suspense>
  );
}
