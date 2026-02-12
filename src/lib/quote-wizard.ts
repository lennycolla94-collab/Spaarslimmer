/**
 * Quote Wizard
 * Combineert commissie-berekening met klant-tarieven voor de offerte flow
 */

import { 
  calculateCompleteDeal, 
  calculateRetailCommission,
  formatEuro,
  type ServiceItem,
  type CommissionOptions,
  type CompleteDealResult,
} from './calculator';
import { SERVICE_CATEGORY, getServiceCategory, CONSULTANT_RANK, PRODUCT_TYPE } from './constants';
import {
  calculateTariff,
  recommendPlan,
  type TariffInput,
  type TariffResult,
  type InternetPlan,
  type MobilePlan,
  type MobileLine,
} from './tariff-engine';

// ============================================================================
// TYPES
// ============================================================================

export interface QuoteWizardInput {
  // Consultant info
  consultantRank: CONSULTANT_RANK;
  
  // Klant info
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  
  // Huidige situatie
  currentMonthlyCost: number;
  currentProvider?: string;
  
  // Product selectie
  products: {
    internet?: {
      plan: InternetPlan;
      isSecondAddress: boolean;
      hasEasySwitch: boolean;
    };
    mobile: Array<{
      plan: MobilePlan;
      isPortability: boolean;
      isSoHo: boolean;
    }>;
    tv?: 'NONE' | 'TV_LIFE' | 'TV' | 'TV_PLUS' | null;
    energie?: {
      type: 'RESIDENTIEEL' | 'SOHO';
      hasEbilling: boolean;
      hasDomiciliering: boolean;
    };
  };
  
  // Opties
  hasMyComfort: boolean;
  wifiBoosters: number;
  hasVasteLijn?: boolean;
  extraDecoders?: number;
}

export interface QuoteLineItem {
  product: string;
  description: string;
  customerPrice: string;    // Wat klant betaalt
  consultantCommission: string;  // Wat consultant verdient
  asp: number;
  fidelityPerMonth: string;
}

export interface QuoteResult {
  // Meta
  quoteId: string;
  createdAt: Date;
  
  // Klant prijzen
  customer: {
    monthlyTotal: string;
    currentCost: string;
    monthlySavings: string;
    savings6Months: string;
    savings24Months: string;
  };
  
  // Consultant vergoedingen
  consultant: {
    immediateCommission: string;
    monthlyFidelity: string;
    fidelity6Months: string;
    fidelity24Months: string;
    totalASP: number;
    pqsAchieved: boolean;
    incentivePoints: number;
  };
  
  // Line items voor detail weergave
  lineItems: QuoteLineItem[];
  
  // PDF/Email data
  pdfData: {
    title: string;
    customerName: string;
    date: string;
    validUntil: string;
  };
}

// ============================================================================
// MAPPING FUNCTIES
// ============================================================================

function mapInternetToProductType(plan: InternetPlan): PRODUCT_TYPE {
  return PRODUCT_TYPE.INTERNET;
}

function mapMobileToProductType(plan: MobilePlan): PRODUCT_TYPE {
  switch (plan) {
    case 'CHILD': return PRODUCT_TYPE.MOBILE_CHILD;
    case 'SMALL': return PRODUCT_TYPE.MOBILE_SMALL;
    case 'MEDIUM': return PRODUCT_TYPE.MOBILE_MEDIUM;
    case 'LARGE': return PRODUCT_TYPE.MOBILE_LARGE;
    case 'UNLIMITED': return PRODUCT_TYPE.MOBILE_UNLIMITED;
  }
}

function mapTVToProductType(tv: 'TV_LIFE' | 'TV' | 'TV_PLUS'): PRODUCT_TYPE {
  switch (tv) {
    case 'TV_LIFE':
      return PRODUCT_TYPE.ORANGE_TV_LITE;
    case 'TV':
    case 'TV_PLUS':
      return PRODUCT_TYPE.ORANGE_TV;
    default:
      return PRODUCT_TYPE.ORANGE_TV;
  }
}

function mapEnergieToProductType(type: 'RESIDENTIEEL' | 'SOHO'): PRODUCT_TYPE {
  return type === 'RESIDENTIEEL' 
    ? PRODUCT_TYPE.ENERGIE_RESIDENTIEEL 
    : PRODUCT_TYPE.ENERGIE_SOHO;
}

// ============================================================================
// HOOFDFUNCTIE
// ============================================================================

export function generateQuote(input: QuoteWizardInput): QuoteResult {
  const services: ServiceItem[] = [];
  const lineItems: QuoteLineItem[] = [];
  
  // 1. Internet toevoegen
  if (input.products.internet) {
    const options: CommissionOptions = {
      hasEasySwitch: input.products.internet.hasEasySwitch,
      // Convergence wordt automatisch gedetecteerd als mobile ook aanwezig is
      hasConvergence: input.products.mobile.length > 0,
    };
    
    services.push({
      productType: PRODUCT_TYPE.INTERNET,
      options,
    });
  }
  
  // 2. Mobile toevoegen
  for (const mobile of input.products.mobile) {
    const options: CommissionOptions = {
      hasPortability: mobile.isPortability,
      isSoHo: mobile.isSoHo,
      // Convergence als internet ook aanwezig is
      hasConvergence: !!input.products.internet,
    };
    
    services.push({
      productType: mapMobileToProductType(mobile.plan),
      options,
    });
  }
  
  // 3. TV toevoegen
  if (input.products.tv) {
    services.push({
      productType: mapTVToProductType(input.products.tv),
      options: {},
    });
  }
  
  // 4. Energie toevoegen
  if (input.products.energie) {
    const options: CommissionOptions = {
      hasEbilling: input.products.energie.hasEbilling,
      hasDomiciliering: input.products.energie.hasDomiciliering,
    };
    
    services.push({
      productType: mapEnergieToProductType(input.products.energie.type),
      options,
    });
  }
  
  // 5. Commissie berekening
  const dealResult = calculateCompleteDeal(services, input.consultantRank);
  
  // 6. Tarief berekening voor klant
  const tariffInput: TariffInput = {
    internetPlan: input.products.internet?.plan || 'START',
    isSecondAddress: input.products.internet?.isSecondAddress || false,
    mobileLines: input.products.mobile.map(m => ({
      plan: m.plan,
      isPortability: m.isPortability,
      isNewNumber: !m.isPortability,
    })),
    tvPlan: input.products.tv || 'NONE',
    hasVasteLijn: input.hasVasteLijn || false,
    hasMyComfort: input.hasMyComfort,
    wifiBoosters: input.wifiBoosters,
    extraDecoders: input.extraDecoders || 0,
    currentMonthlyCost: input.currentMonthlyCost,
  };
  
  const tariffResult = calculateTariff(tariffInput);
  
  // 7. Line items maken
  for (const service of services) {
    const productType = service.productType;
    const category = getServiceCategory(productType);
    
    // Vind de juiste prijs voor dit product
    let customerPrice = 0;
    if (category === SERVICE_CATEGORY.MOBILE) {
      // Mobile prijs is al berekend in pack
      const mobileCount = services.filter(s => 
        getServiceCategory(s.productType) === SERVICE_CATEGORY.MOBILE
      ).length;
      if (mobileCount > 0) {
        customerPrice = Math.round(tariffResult.mobilePrice / mobileCount);
      }
    } else if (category === SERVICE_CATEGORY.INTERNET) {
      customerPrice = tariffResult.internetPrice;
    } else if (category === SERVICE_CATEGORY.TV) {
      customerPrice = tariffResult.tvPrice;
    }
    
    const commission = dealResult.commission.services.find(
      s => s.productType === productType
    )?.breakdown.total || 0;
    
    const fidelity = dealResult.personalFidelity;
    
    lineItems.push({
      product: productType,
      description: getProductDescription(productType),
      customerPrice: formatEuro(customerPrice),
      consultantCommission: formatEuro(commission),
      asp: dealResult.asp.total / services.length, // Gemiddelde ASP per service
      fidelityPerMonth: formatEuro(fidelity.N0 / services.length),
    });
  }
  
  // 8. Resultaat samenstellen
  return {
    quoteId: generateQuoteId(),
    createdAt: new Date(),
    
    customer: {
      monthlyTotal: tariffResult.formatted.totalMonthly,
      currentCost: formatEuro(input.currentMonthlyCost * 100),
      monthlySavings: tariffResult.savings6Months 
        ? formatEuro(Math.round((input.currentMonthlyCost * 100 - tariffResult.totalMonthly) / 100 * 100))
        : '€0.00',
      savings6Months: tariffResult.formatted.savings6Months || '€0.00',
      savings24Months: tariffResult.formatted.savings24Months || '€0.00',
    },
    
    consultant: {
      immediateCommission: formatEuro(dealResult.commission.grandTotal),
      monthlyFidelity: formatEuro(dealResult.personalFidelity.N0),
      fidelity6Months: formatEuro(dealResult.personalFidelity.N0 * 6),
      fidelity24Months: formatEuro(dealResult.personalFidelity.N0 * 24),
      totalASP: dealResult.asp.total,
      pqsAchieved: dealResult.pqs.achieved,
      incentivePoints: dealResult.incentivePoints,
    },
    
    lineItems,
    
    pdfData: {
      title: 'Offerte Orange/Eneco',
      customerName: input.customerName,
      date: new Date().toLocaleDateString('nl-BE'),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('nl-BE'),
    },
  };
}

// ============================================================================
// HELPERS
// ============================================================================

function getProductDescription(productType: PRODUCT_TYPE): string {
  const descriptions: Record<PRODUCT_TYPE, string> = {
    [PRODUCT_TYPE.MOBILE_CHILD]: 'Mobile Child',
    [PRODUCT_TYPE.MOBILE_SMALL]: 'Mobile Small',
    [PRODUCT_TYPE.MOBILE_MEDIUM]: 'Mobile Medium',
    [PRODUCT_TYPE.MOBILE_LARGE]: 'Mobile Large',
    [PRODUCT_TYPE.MOBILE_UNLIMITED]: 'Mobile Unlimited',
    [PRODUCT_TYPE.INTERNET]: 'Internet',
    [PRODUCT_TYPE.ORANGE_TV]: 'Orange TV',
    [PRODUCT_TYPE.ORANGE_TV_LITE]: 'Orange TV Lite',
    [PRODUCT_TYPE.ENERGIE_RESIDENTIEEL]: 'Eneco Residentieel',
    [PRODUCT_TYPE.ENERGIE_SOHO]: 'Eneco SoHo',
    [PRODUCT_TYPE.KETELONDERHOUD]: 'Ketelonderhoud',
  };
  return descriptions[productType] || productType;
}

function generateQuoteId(): string {
  return 'OFF-' + Date.now().toString(36).toUpperCase();
}

// ============================================================================
// OFFERTE VERSTUREN
// ============================================================================

export interface SendQuoteOptions {
  method: 'EMAIL' | 'WHATSAPP';
  to: string;
  message?: string;
}

export function prepareQuoteEmail(quote: QuoteResult): {
  subject: string;
  body: string;
} {
  return {
    subject: `Uw offerte ${quote.quoteId}`,
    body: `Beste ${quote.pdfData.customerName},

Hierbij uw persoonlijke offerte:

Nieuw maandbedrag: ${quote.customer.monthlyTotal}
Huidig maandbedrag: ${quote.customer.currentCost}
Maandelijkse besparing: ${quote.customer.monthlySavings}

Besparing over 6 maanden: ${quote.customer.savings6Months}
Besparing over 24 maanden: ${quote.customer.savings24Months}

Deze offerte is geldig tot ${quote.pdfData.validUntil}.

Met vriendelijke groeten,
Uw SmartSN Consultant`,
  };
}

export function prepareQuoteWhatsApp(quote: QuoteResult): string {
  return `Hallo! Hier is uw offerte ${quote.quoteId}

💰 Nieuw: ${quote.customer.monthlyTotal}/maand
💰 Bespaart: ${quote.customer.monthlySavings}/maand
📊 6 maanden: ${quote.customer.savings6Months} bespaard

Geldig tot ${quote.pdfData.validUntil}

Interesse? Bel me gerust! 📞`;
}
