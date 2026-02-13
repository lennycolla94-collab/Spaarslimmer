// Commission calculation utilities
// Based on Spaarslimmer/Smart SN commission rules

export interface Product {
  type: 'MOBILE' | 'INTERNET' | 'TV' | 'ENERGY';
  plan: string;
  retailValue: number;
  options?: {
    portability?: boolean;
    convergence?: boolean;
    soho?: boolean;
  };
}

export interface CommissionBreakdown {
  baseCommission: number;
  bonuses: {
    portability: number;
    convergence: number;
    soho: number;
  };
  total: number;
}

// User levels
export type UserLevel = 'BC' | 'SC' | 'SC+' | 'PC' | 'DM';

// Mobile commissions - Residentieel (BC / SC+)
const MOBILE_COMMISSIONS: Record<string, { BC: number; SCP: number }> = {
  'CHILD': { BC: 1, SCP: 5 },
  'SMALL': { BC: 10, SCP: 15 },
  'MEDIUM': { BC: 35, SCP: 40 },
  'LARGE': { BC: 50, SCP: 55 },
  'UNLIMITED': { BC: 60, SCP: 65 },
};

// Internet commissions (BC / SC+)
const INTERNET_COMMISSIONS: Record<string, { BC: number; SCP: number }> = {
  'START': { BC: 15, SCP: 20 },
  'ZEN': { BC: 15, SCP: 20 },
  'GIGA': { BC: 15, SCP: 20 },
};

// TV commissions (BC / SC+)
const TV_COMMISSIONS: Record<string, { BC: number; SCP: number }> = {
  'TV': { BC: 10, SCP: 10 },
  'TV_PLUS': { BC: 10, SCP: 10 },
  'TV_LIFE': { BC: 10, SCP: 10 },
};

// Energy commissions (BC / SC+)
const ENERGY_COMMISSIONS: Record<string, { BC: number; SCP: number }> = {
  'RESIDENTIEEL': { BC: 20, SCP: 25 },
  'SOHO': { BC: 40, SCP: 45 },
  'KETELONDERHOUD': { BC: 20, SCP: 25 },
};

// Bonuses (fixed amounts)
const BONUSES = {
  MOBILE_CONVERGENCE: 12,      // +€12 for Medium+ with convergence
  MOBILE_PORTABILITY: 20,      // +€20 for Medium+ with portability
  MOBILE_SOHO: 15,             // +€15 for Medium+ SoHo
  INTERNET_CONVERGENCE: 15,    // +€15 for internet convergence
  INTERNET_PORTABILITY: 12,    // +€12 for internet portability
};

// Check if mobile plan qualifies for bonuses (Medium+)
function qualifiesForBonuses(plan: string): boolean {
  const qualifyingPlans = ['MEDIUM', 'LARGE', 'UNLIMITED'];
  return qualifyingPlans.includes(plan.toUpperCase());
}

// Calculate commission for a single product
function calculateProductCommission(
  product: Product,
  userLevel: UserLevel
): CommissionBreakdown {
  const isSCP = userLevel === 'SC+' || userLevel === 'PC' || userLevel === 'DM';
  const level: 'BC' | 'SCP' = isSCP ? 'SCP' : 'BC';
  
  let baseCommission = 0;
  
  // Get base commission based on product type
  switch (product.type) {
    case 'MOBILE':
      baseCommission = MOBILE_COMMISSIONS[product.plan.toUpperCase()]?.[level] || 0;
      break;
    case 'INTERNET':
      baseCommission = INTERNET_COMMISSIONS[product.plan.toUpperCase()]?.[level] || 15;
      break;
    case 'TV':
      baseCommission = TV_COMMISSIONS[product.plan.toUpperCase()]?.[level] || 10;
      break;
    case 'ENERGY':
      baseCommission = ENERGY_COMMISSIONS[product.plan.toUpperCase()]?.[level] || 20;
      break;
  }
  
  // Calculate bonuses
  let portabilityBonus = 0;
  let convergenceBonus = 0;
  let sohoBonus = 0;
  
  if (product.type === 'MOBILE' && qualifiesForBonuses(product.plan)) {
    if (product.options?.portability) {
      portabilityBonus = BONUSES.MOBILE_PORTABILITY;
    }
    if (product.options?.convergence) {
      convergenceBonus = BONUSES.MOBILE_CONVERGENCE;
    }
    if (product.options?.soho) {
      sohoBonus = BONUSES.MOBILE_SOHO;
    }
  }
  
  if (product.type === 'INTERNET') {
    if (product.options?.portability) {
      portabilityBonus = BONUSES.INTERNET_PORTABILITY;
    }
    if (product.options?.convergence) {
      convergenceBonus = BONUSES.INTERNET_CONVERGENCE;
    }
  }
  
  return {
    baseCommission,
    bonuses: {
      portability: portabilityBonus,
      convergence: convergenceBonus,
      soho: sohoBonus,
    },
    total: baseCommission + portabilityBonus + convergenceBonus + sohoBonus,
  };
}

// Calculate total commission for an offer
export function calculateOfferCommission(
  products: Product[],
  userLevel: UserLevel = 'BC',
  options?: {
    hasConvergence?: boolean;  // At least 1 mobile + internet
  }
): { potentialCommission: number; effectiveCommission: number; breakdown: CommissionBreakdown[] } {
  const hasConvergence = options?.hasConvergence ?? 
    (products.some(p => p.type === 'MOBILE') && products.some(p => p.type === 'INTERNET'));
  
  const breakdown: CommissionBreakdown[] = [];
  let totalCommission = 0;
  
  for (const product of products) {
    // Add convergence flag to products if applicable
    const productWithConvergence = {
      ...product,
      options: {
        ...product.options,
        convergence: hasConvergence || product.options?.convergence,
      },
    };
    
    const commission = calculateProductCommission(productWithConvergence, userLevel);
    breakdown.push(commission);
    totalCommission += commission.total;
  }
  
  return {
    potentialCommission: totalCommission * 0.3,  // 30% when sent
    effectiveCommission: totalCommission,         // 100% when accepted
    breakdown,
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

// Get commission preview for calculator
export function getCommissionPreview(products: Product[], userLevel: UserLevel = 'BC') {
  const result = calculateOfferCommission(products, userLevel);
  
  return {
    potential: result.potentialCommission,
    effective: result.effectiveCommission,
    totalMonthly: products.reduce((sum, p) => sum + p.retailValue, 0),
    breakdown: result.breakdown,
  };
}
