// Commission calculation utilities
// Based on Spaarslimmer commission rules

export interface ProductCommission {
  type: string;
  plan: string;
  retailValue: number;
  aspValue: number;
}

export interface CommissionBreakdown {
  potentialCommission: number;
  effectiveCommission: number;
  breakdown: {
    baseCommission: number;
    newCustomerBonus: number;
    portabilityBonus: number;
    convergenceBonus: number;
    total: number;
  };
}

// Commission rates (per month for 24 months, paid upfront)
const COMMISSION_RATES: Record<string, number> = {
  'INTERNET_START': 1.0,
  'INTERNET_ZEN': 1.2,
  'INTERNET_GIGA': 1.5,
  'MOBILE_SMALL': 0.8,
  'MOBILE_MEDIUM': 1.0,
  'MOBILE_LARGE': 1.2,
  'MOBILE_UNLIMITED': 1.5,
  'TV': 0.5,
  'TV_PLUS': 0.7,
};

// Calculate commission for a product
function calculateProductCommission(
  product: ProductCommission,
  isNewCustomer: boolean,
  hasPortability: boolean,
  hasConvergence: boolean
): number {
  const rate = COMMISSION_RATES[product.plan.toUpperCase()] || 1.0;
  const baseCommission = product.retailValue * rate * 24; // 24 months upfront
  
  // Bonuses
  const newCustomerBonus = isNewCustomer ? baseCommission * 0.1 : 0;
  const portabilityBonus = hasPortability ? baseCommission * 0.05 : 0;
  const convergenceBonus = hasConvergence ? baseCommission * 0.08 : 0;
  
  return baseCommission + newCustomerBonus + portabilityBonus + convergenceBonus;
}

// Calculate total commission for an offer
export function calculateOfferCommission(
  products: ProductCommission[],
  options: {
    isNewCustomer: boolean;
    hasPortability: boolean;
    hasConvergence: boolean;
  }
): CommissionBreakdown {
  const { isNewCustomer, hasPortability, hasConvergence } = options;
  
  let totalBase = 0;
  let totalNewCustomer = 0;
  let totalPortability = 0;
  let totalConvergence = 0;
  
  for (const product of products) {
    const rate = COMMISSION_RATES[product.plan.toUpperCase()] || 1.0;
    const base = product.retailValue * rate * 24;
    
    totalBase += base;
    totalNewCustomer += isNewCustomer ? base * 0.1 : 0;
    totalPortability += hasPortability ? base * 0.05 : 0;
    totalConvergence += hasConvergence ? base * 0.08 : 0;
  }
  
  const total = totalBase + totalNewCustomer + totalPortability + totalConvergence;
  
  return {
    potentialCommission: total * 0.3, // 30% when sent
    effectiveCommission: total,       // 100% when signed
    breakdown: {
      baseCommission: totalBase,
      newCustomerBonus: totalNewCustomer,
      portabilityBonus: totalPortability,
      convergenceBonus: totalConvergence,
      total,
    },
  };
}

// Get commission status label
export function getCommissionStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    'DRAFT': 'Nog niet verstuurd',
    'SENT': 'Potentiële commissie',
    'ACCEPTED': 'Effectieve commissie',
    'REJECTED': 'Geen commissie',
    'EXPIRED': 'Verlopen',
  };
  return labels[status] || status;
}

// Format euro amount
export function formatEuro(amount: number): string {
  return '€' + amount.toFixed(2).replace('.', ',');
}
