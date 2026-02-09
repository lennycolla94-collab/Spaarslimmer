/**
 * MLM Commission Calculator
 * Main calculation functions for retail commissions, bonuses, ASP, and fidelity
 */

import {
  PRODUCT_TYPE,
  CONSULTANT_RANK,
  SERVICE_CATEGORY,
  RETAIL_RATES,
  BONUS_AMOUNTS,
  ASP_POINTS,
  EXTRA_ASP,
  FIDELITY_RATES,
  PQS_POINTS,
  CLAWBACK_RATES,
  RETENTION_RATES,
  INFINITY_BONUS_RATES,
  isMediumPlus,
  generatesFidelity,
  qualifiesForBonuses,
  getServiceCategory,
  isSCOrHigher,
} from './constants';

// Types
export interface CommissionOptions {
  hasConvergence?: boolean;      // Mobile + Internet activated together
  hasPortability?: boolean;      // Number transfer from external operator
  isSoHo?: boolean;              // Valid BTW number present
  hasEasySwitch?: boolean;       // Internet Easy Switch
  hasEbilling?: boolean;         // Energie eBilling add-on
  hasDomiciliering?: boolean;    // Energie domiciliering add-on
}

export interface ServiceItem {
  productType: PRODUCT_TYPE;
  options?: CommissionOptions;
}

export interface CommissionBreakdown {
  baseCommission: number;
  convergenceBonus: number;
  portabilityBonus: number;
  soHoBonus: number;
  addOnBonus: number;
  total: number;
}

export interface ASPBreakdown {
  baseASP: number;
  extraASP: number;
  total: number;
}

export interface FidelityBreakdown {
  N0: number;
  N1: number;
  N2_6: number;
  N7: number;
}

export interface TotalCommissionResult {
  services: Array<{
    productType: PRODUCT_TYPE;
    breakdown: CommissionBreakdown;
  }>;
  grandTotal: number;
  totalASP: ASPBreakdown;
}

/**
 * Calculate base retail commission for a single product
 * @param productType - The type of product
 * @param rank - Consultant rank (BC or SC+)
 * @returns Commission amount in cents
 */
export function calculateRetailCommission(
  productType: PRODUCT_TYPE,
  rank: CONSULTANT_RANK
): number {
  const rates = RETAIL_RATES[productType];
  if (!rates) {
    throw new Error(`Unknown product type: ${productType}`);
  }

  // BC gets BC rate, all others (SC+) get SC rate
  return isSCOrHigher(rank) ? rates.SC : rates.BC;
}

/**
 * Calculate bonuses for a single product
 * @param productType - The type of product
 * @param rank - Consultant rank
 * @param options - Bonus eligibility flags
 * @returns Total bonus amount in cents
 */
export function calculateBonuses(
  productType: PRODUCT_TYPE,
  rank: CONSULTANT_RANK,
  options: CommissionOptions = {}
): number {
  const { hasConvergence, hasPortability, isSoHo, hasEasySwitch, hasEbilling, hasDomiciliering } = options;
  const serviceCategory = getServiceCategory(productType);
  let totalBonus = 0;

  // Convergence bonus: +€12 for Medium+ mobile, +€15 for Internet
  // Only applies when mobile and internet are activated together
  if (hasConvergence) {
    if (serviceCategory === SERVICE_CATEGORY.MOBILE && isMediumPlus(productType)) {
      totalBonus += BONUS_AMOUNTS.CONVERGENCE_MOBILE; // €12
    }
    if (serviceCategory === SERVICE_CATEGORY.INTERNET) {
      totalBonus += BONUS_AMOUNTS.CONVERGENCE_INTERNET; // €15
    }
  }

  // Portability bonus: +€20 for Medium+ mobile, +€12 for Internet
  // Does NOT apply to Child/Small plans
  if (hasPortability && qualifiesForBonuses(productType)) {
    if (serviceCategory === SERVICE_CATEGORY.MOBILE && isMediumPlus(productType)) {
      totalBonus += BONUS_AMOUNTS.PORTABILITY_MOBILE; // €20
    }
    if (serviceCategory === SERVICE_CATEGORY.INTERNET) {
      totalBonus += BONUS_AMOUNTS.PORTABILITY_INTERNET; // €12
    }
  }

  // SoHo bonus: +€15 for Medium+ mobile plans with valid BTW
  if (isSoHo && serviceCategory === SERVICE_CATEGORY.MOBILE && isMediumPlus(productType)) {
    totalBonus += BONUS_AMOUNTS.SOHO_MOBILE; // €15
  }

  // Internet Easy Switch bonus (portability for internet)
  if (hasEasySwitch && serviceCategory === SERVICE_CATEGORY.INTERNET) {
    totalBonus += BONUS_AMOUNTS.PORTABILITY_INTERNET; // €12
  }

  // Energie add-ons
  if (serviceCategory === SERVICE_CATEGORY.ENERGIE) {
    if (hasEbilling) {
      totalBonus += BONUS_AMOUNTS.ENERGIE_EBILLING; // €5
    }
    if (hasDomiciliering) {
      totalBonus += BONUS_AMOUNTS.ENERGIE_DOMICILIERING; // €5
    }
  }

  return totalBonus;
}

/**
 * Calculate full commission breakdown for a single product
 * @param productType - The type of product
 * @param rank - Consultant rank
 * @param options - Bonus eligibility flags
 * @returns Full commission breakdown
 */
export function calculateProductCommission(
  productType: PRODUCT_TYPE,
  rank: CONSULTANT_RANK,
  options: CommissionOptions = {}
): CommissionBreakdown {
  const baseCommission = calculateRetailCommission(productType, rank);
  
  // Calculate individual bonus components
  const serviceCategory = getServiceCategory(productType);
  const { hasConvergence, hasPortability, isSoHo, hasEasySwitch, hasEbilling, hasDomiciliering } = options;
  
  let convergenceBonus = 0;
  let portabilityBonus = 0;
  let soHoBonus = 0;
  let addOnBonus = 0;

  // Convergence bonus breakdown
  if (hasConvergence) {
    if (serviceCategory === SERVICE_CATEGORY.MOBILE && isMediumPlus(productType)) {
      convergenceBonus += BONUS_AMOUNTS.CONVERGENCE_MOBILE;
    }
    if (serviceCategory === SERVICE_CATEGORY.INTERNET) {
      convergenceBonus += BONUS_AMOUNTS.CONVERGENCE_INTERNET;
    }
  }

  // Portability bonus breakdown
  if (hasPortability && qualifiesForBonuses(productType)) {
    if (serviceCategory === SERVICE_CATEGORY.MOBILE && isMediumPlus(productType)) {
      portabilityBonus += BONUS_AMOUNTS.PORTABILITY_MOBILE;
    }
    if (serviceCategory === SERVICE_CATEGORY.INTERNET) {
      portabilityBonus += BONUS_AMOUNTS.PORTABILITY_INTERNET;
    }
  }

  // SoHo bonus
  if (isSoHo && serviceCategory === SERVICE_CATEGORY.MOBILE && isMediumPlus(productType)) {
    soHoBonus += BONUS_AMOUNTS.SOHO_MOBILE;
  }

  // Easy Switch (counts as portability for internet)
  if (hasEasySwitch && serviceCategory === SERVICE_CATEGORY.INTERNET) {
    portabilityBonus += BONUS_AMOUNTS.PORTABILITY_INTERNET;
  }

  // Energie add-ons
  if (serviceCategory === SERVICE_CATEGORY.ENERGIE) {
    if (hasEbilling) {
      addOnBonus += BONUS_AMOUNTS.ENERGIE_EBILLING;
    }
    if (hasDomiciliering) {
      addOnBonus += BONUS_AMOUNTS.ENERGIE_DOMICILIERING;
    }
  }

  const total = baseCommission + convergenceBonus + portabilityBonus + soHoBonus + addOnBonus;

  return {
    baseCommission,
    convergenceBonus,
    portabilityBonus,
    soHoBonus,
    addOnBonus,
    total,
  };
}

/**
 * Calculate ASP (Active Smart Points) for a product
 * @param productType - The type of product
 * @param options - Bonus flags that may add extra ASP
 * @returns ASP breakdown
 */
export function calculateASP(
  productType: PRODUCT_TYPE,
  options: CommissionOptions = {}
): ASPBreakdown {
  const { isSoHo, hasEasySwitch } = options;
  const serviceCategory = getServiceCategory(productType);
  
  const baseASP = ASP_POINTS[productType] || 0;
  let extraASP = 0;

  // SoHo extra ASP (+0.5 for Medium+ mobile plans)
  if (isSoHo && serviceCategory === SERVICE_CATEGORY.MOBILE && isMediumPlus(productType)) {
    extraASP += EXTRA_ASP.SOHO_MOBILE;
  }

  // Easy Switch extra ASP (+0.5 for Internet)
  if (hasEasySwitch && serviceCategory === SERVICE_CATEGORY.INTERNET) {
    extraASP += EXTRA_ASP.INTERNET_PORTABILITY;
  }

  return {
    baseASP,
    extraASP,
    total: baseASP + extraASP,
  };
}

/**
 * Calculate personal monthly fidelity for a product
 * @param productType - The type of product
 * @returns Fidelity amounts per upline level in cents
 */
export function calculatePersonalFidelity(productType: PRODUCT_TYPE): FidelityBreakdown {
  const rates = FIDELITY_RATES[productType];
  if (!rates) {
    throw new Error(`Unknown product type: ${productType}`);
  }

  return {
    N0: rates.N0,
    N1: rates.N1,
    N2_6: rates.N2_6,
    N7: rates.N7,
  };
}

/**
 * Calculate clawback amount based on service duration
 * @param originalCommission - Original commission amount in cents
 * @param monthsActive - Number of months the service was active
 * @returns Clawback amount in cents (positive = reclaim, 0 = no clawback)
 */
export function calculateClawback(
  originalCommission: number,
  monthsActive: number
): number {
  if (monthsActive < 1) {
    // < 1 month: 100% clawback
    return Math.round((originalCommission * CLAWBACK_RATES.LESS_THAN_1_MONTH) / 100);
  } else if (monthsActive < 6) {
    // 1-6 months: 75% clawback
    return Math.round((originalCommission * CLAWBACK_RATES.ONE_TO_SIX_MONTHS) / 100);
  } else {
    // > 6 months: 25% clawback
    return Math.round((originalCommission * CLAWBACK_RATES.SIX_MONTHS_PLUS) / 100);
  }
}

/**
 * Calculate retention amount (what consultant keeps after clawback)
 * @param originalCommission - Original commission amount in cents
 * @param monthsActive - Number of months the service was active
 * @returns Retention amount in cents
 */
export function calculateRetention(
  originalCommission: number,
  monthsActive: number
): number {
  if (monthsActive < 1) {
    return Math.round((originalCommission * RETENTION_RATES.LESS_THAN_1_MONTH) / 100);
  } else if (monthsActive < 6) {
    return Math.round((originalCommission * RETENTION_RATES.ONE_TO_SIX_MONTHS) / 100);
  } else {
    return Math.round((originalCommission * RETENTION_RATES.SIX_MONTHS_PLUS) / 100);
  }
}

/**
 * Calculate total commission for multiple services
 * @param services - Array of service items
 * @param rank - Consultant rank
 * @returns Grand total commission and breakdown
 */
export function calculateTotalCommission(
  services: ServiceItem[],
  rank: CONSULTANT_RANK
): TotalCommissionResult {
  let grandTotal = 0;
  let totalBaseASP = 0;
  let totalExtraASP = 0;

  const serviceBreakdowns = services.map((service) => {
    const breakdown = calculateProductCommission(
      service.productType,
      rank,
      service.options
    );
    
    const aspBreakdown = calculateASP(service.productType, service.options);
    
    grandTotal += breakdown.total;
    totalBaseASP += aspBreakdown.baseASP;
    totalExtraASP += aspBreakdown.extraASP;

    return {
      productType: service.productType,
      breakdown,
    };
  });

  return {
    services: serviceBreakdowns,
    grandTotal,
    totalASP: {
      baseASP: totalBaseASP,
      extraASP: totalExtraASP,
      total: totalBaseASP + totalExtraASP,
    },
  };
}

/**
 * Calculate Infinity Bonus for a PQS
 * @param rank - Consultant rank (must be SC or higher)
 * @param pqsCount - Number of PQS in the team
 * @returns Infinity bonus amount in cents
 */
export function calculateInfinityBonus(
  rank: CONSULTANT_RANK,
  pqsCount: number
): number {
  const bonusRate = INFINITY_BONUS_RATES[rank];
  if (!bonusRate) {
    return 0; // Rank doesn't qualify for infinity bonus
  }
  return bonusRate * pqsCount;
}

/**
 * Calculate PQS bonus for consultant and sponsor
 * @param achievedPQS - Whether consultant achieved PQS
 * @returns Bonus amounts for consultant and sponsor
 */
export function calculatePQSBonus(
  achievedPQS: boolean
): { consultantBonus: number; sponsorBonus: number } {
  if (!achievedPQS) {
    return { consultantBonus: 0, sponsorBonus: 0 };
  }
  
  // From PQS_REQUIREMENTS in constants
  return {
    consultantBonus: 15000, // €150
    sponsorBonus: 15000,    // €150 (QS1)
  };
}

// ============================================================================
// PQS CALCULATION ENGINE
// ============================================================================

export interface PQSCheckResult {
  achieved: boolean;
  totalASP: number;
  mobileASP: number;
  energieASP: number;
  internetASP: number;
  missing: string[];
}

/**
 * Check if consultant achieves PQS (Personal Quick Start)
 * Requirements within 40-day window:
 * - Total 12 ASP
 * - Min 7 Mobile ASP
 * - Min 3 Energie ASP
 * - Min 2 Internet ASP
 */
export function checkPQS(
  services: ServiceItem[]
): PQSCheckResult {
  let totalASP = 0;
  let mobileASP = 0;
  let energieASP = 0;
  let internetASP = 0;
  const missing: string[] = [];

  for (const service of services) {
    const asp = calculateASP(service.productType, service.options);
    const category = getServiceCategory(service.productType);
    
    totalASP += asp.total;
    
    switch (category) {
      case SERVICE_CATEGORY.MOBILE:
        mobileASP += asp.total;
        break;
      case SERVICE_CATEGORY.ENERGIE:
        energieASP += asp.total;
        break;
      case SERVICE_CATEGORY.INTERNET:
        internetASP += asp.total;
        break;
    }
  }

  if (totalASP < 12) missing.push(`Totaal ASP: ${totalASP}/12`);
  if (mobileASP < 7) missing.push(`Mobile ASP: ${mobileASP}/7`);
  if (energieASP < 3) missing.push(`Energie ASP: ${energieASP}/3`);
  if (internetASP < 2) missing.push(`Internet ASP: ${internetASP}/2`);

  return {
    achieved: missing.length === 0,
    totalASP,
    mobileASP,
    energieASP,
    internetASP,
    missing,
  };
}

// ============================================================================
// QUALIFICATION ENGINE
// ============================================================================

export interface QualificationResult {
  qualified: boolean;
  personalASP: number;
  pqsAchieved: boolean;
  qs1Count: number;
  method: 'ASP' | 'PQS' | 'QS1' | 'NONE';
}

/**
 * Check quarterly qualification
 * Consultant is qualified if they meet ONE of:
 * 1. 10+ personal ASP per quarter
 * 2. 1+ PQS achieved
 * 3. 1+ QS1 in team
 */
export function checkQuarterlyQualification(
  personalASP: number,
  pqsAchieved: boolean,
  qs1Count: number
): QualificationResult {
  if (personalASP >= 10) {
    return { qualified: true, personalASP, pqsAchieved, qs1Count, method: 'ASP' };
  }
  if (pqsAchieved) {
    return { qualified: true, personalASP, pqsAchieved, qs1Count, method: 'PQS' };
  }
  if (qs1Count >= 1) {
    return { qualified: true, personalASP, pqsAchieved, qs1Count, method: 'QS1' };
  }
  
  return { qualified: false, personalASP, pqsAchieved, qs1Count, method: 'NONE' };
}

// ============================================================================
// INCENTIVE ENGINE (Winter Gift & Portugal Seminar)
// ============================================================================

export interface IncentivePeriod {
  name: string;
  startDate: Date;
  endDate: Date;
  targetPoints: number;
}

export interface IncentiveProgress {
  period: string;
  currentPoints: number;
  targetPoints: number;
  remainingPoints: number;
  onTrack: boolean;
  percentageComplete: number;
}

// Incentive points per product type
export const INCENTIVE_POINTS: Record<PRODUCT_TYPE, number> = {
  [PRODUCT_TYPE.MOBILE_CHILD]: 1,
  [PRODUCT_TYPE.MOBILE_SMALL]: 2,
  [PRODUCT_TYPE.MOBILE_MEDIUM]: 3,
  [PRODUCT_TYPE.MOBILE_LARGE]: 4,
  [PRODUCT_TYPE.MOBILE_UNLIMITED]: 5,
  [PRODUCT_TYPE.INTERNET]: 3,
  [PRODUCT_TYPE.ORANGE_TV]: 2,
  [PRODUCT_TYPE.ORANGE_TV_LITE]: 1,
  [PRODUCT_TYPE.ENERGIE_RESIDENTIEEL]: 3,
  [PRODUCT_TYPE.ENERGIE_SOHO]: 5,
  [PRODUCT_TYPE.KETELONDERHOUD]: 2,
};

/**
 * Calculate incentive points for a service
 */
export function calculateIncentivePoints(
  productType: PRODUCT_TYPE,
  options?: CommissionOptions
): number {
  let points = INCENTIVE_POINTS[productType] || 0;
  
  // Bonus points for portability/convergence
  if (options?.hasPortability || options?.hasEasySwitch) {
    points += 1;
  }
  if (options?.hasConvergence) {
    points += 1;
  }
  
  return points;
}

/**
 * Calculate total incentive points for multiple services
 */
export function calculateTotalIncentivePoints(
  services: ServiceItem[]
): number {
  return services.reduce((total, service) => {
    return total + calculateIncentivePoints(service.productType, service.options);
  }, 0);
}

/**
 * Check incentive progress
 */
export function checkIncentiveProgress(
  services: ServiceItem[],
  period: IncentivePeriod
): IncentiveProgress {
  const currentPoints = calculateTotalIncentivePoints(services);
  const targetPoints = period.targetPoints;
  const remainingPoints = Math.max(0, targetPoints - currentPoints);
  const percentageComplete = Math.min(100, Math.round((currentPoints / targetPoints) * 100));
  
  // Calculate if on track based on time remaining
  const now = new Date();
  const totalDays = (period.endDate.getTime() - period.startDate.getTime()) / (1000 * 60 * 60 * 24);
  const daysElapsed = (now.getTime() - period.startDate.getTime()) / (1000 * 60 * 60 * 24);
  const expectedProgress = daysElapsed / totalDays;
  const actualProgress = currentPoints / targetPoints;
  
  return {
    period: period.name,
    currentPoints,
    targetPoints,
    remainingPoints,
    onTrack: actualProgress >= expectedProgress,
    percentageComplete,
  };
}

// ============================================================================
// UPLINE FIDELITY ENGINE
// ============================================================================

export interface UplineFidelityBreakdown {
  N0: number;  // Personal
  N1: number;
  N2: number;
  N3: number;
  N4: number;
  N5: number;
  N6: number;
  N7: number;
  total: number;
}

/**
 * Calculate upline fidelity distribution
 * Based on percentages of personal fidelity N0
 */
export function calculateUplineFidelity(
  productType: PRODUCT_TYPE
): UplineFidelityBreakdown {
  const personal = calculatePersonalFidelity(productType);
  const n0 = personal.N0;
  
  // Upline percentages from constants
  const n1 = Math.round(n0 * 0.10);  // 10%
  const n2 = Math.round(n0 * 0.05);  // 5%
  const n3 = Math.round(n0 * 0.05);  // 5%
  const n4 = Math.round(n0 * 0.03);  // 3%
  const n5 = Math.round(n0 * 0.02);  // 2%
  const n6 = Math.round(n0 * 0.01);  // 1%
  const n7 = Math.round(n0 * 0.01);  // 1%
  
  return {
    N0: n0,
    N1: n1,
    N2: n2,
    N3: n3,
    N4: n4,
    N5: n5,
    N6: n6,
    N7: n7,
    total: n0 + n1 + n2 + n3 + n4 + n5 + n6 + n7,
  };
}

// ============================================================================
// COMPLETE DEAL CALCULATION
// ============================================================================

export interface CompleteDealResult {
  // Commissie breakdown
  commission: TotalCommissionResult;
  
  // ASP
  asp: ASPBreakdown;
  
  // PQS
  pqs: PQSCheckResult;
  
  // Fidelity
  personalFidelity: FidelityBreakdown;
  uplineFidelity: UplineFidelityBreakdown;
  
  // Incentive points
  incentivePoints: number;
  
  // Summary voor UI
  summary: {
    totalCommissionEuro: string;
    totalASP: number;
    monthlyFidelityEuro: string;
    pqsAchieved: boolean;
  };
}

/**
 * Calculate everything for a complete deal
 * This is the main function for the offerte wizard
 */
export function calculateCompleteDeal(
  services: ServiceItem[],
  rank: CONSULTANT_RANK
): CompleteDealResult {
  // 1. Commissie
  const commission = calculateTotalCommission(services, rank);
  
  // 2. ASP (re-use from commission calculation)
  const asp = commission.totalASP;
  
  // 3. PQS check
  const pqs = checkPQS(services);
  
  // 4. Fidelity (sum all services)
  const personalFidelity: FidelityBreakdown = { N0: 0, N1: 0, N2_6: 0, N7: 0 };
  for (const service of services) {
    const fid = calculatePersonalFidelity(service.productType);
    personalFidelity.N0 += fid.N0;
    personalFidelity.N1 += fid.N1;
    personalFidelity.N2_6 += fid.N2_6;
    personalFidelity.N7 += fid.N7;
  }
  
  // 5. Upline fidelity (use first service as representative)
  const firstProduct = services[0]?.productType || PRODUCT_TYPE.MOBILE_MEDIUM;
  const uplineFidelity = calculateUplineFidelity(firstProduct);
  
  // 6. Incentive punten
  const incentivePoints = calculateTotalIncentivePoints(services);
  
  return {
    commission,
    asp,
    pqs,
    personalFidelity,
    uplineFidelity,
    incentivePoints,
    summary: {
      totalCommissionEuro: formatEuro(commission.grandTotal),
      totalASP: asp.total,
      monthlyFidelityEuro: formatEuro(personalFidelity.N0),
      pqsAchieved: pqs.achieved,
    },
  };
}

/**
 * Check if a product qualifies for convergence bonus
 * @param productType - The type of product
 * @returns Whether product qualifies for convergence bonus
 */
export function qualifiesForConvergence(productType: PRODUCT_TYPE): boolean {
  const serviceCategory = getServiceCategory(productType);
  return serviceCategory === SERVICE_CATEGORY.MOBILE || 
         serviceCategory === SERVICE_CATEGORY.INTERNET;
}

/**
 * Check if a product qualifies for portability bonus
 * @param productType - The type of product
 * @returns Whether product qualifies for portability bonus
 */
export function qualifiesForPortability(productType: PRODUCT_TYPE): boolean {
  return qualifiesForBonuses(productType);
}

/**
 * Format cents to euro string for display
 * @param cents - Amount in cents
 * @returns Formatted euro string
 */
export function formatEuro(cents: number): string {
  return `€${(cents / 100).toFixed(2)}`;
}

/**
 * Generate detailed commission report
 * @param services - Array of service items
 * @param rank - Consultant rank
 * @returns Human-readable commission report
 */
export function generateCommissionReport(
  services: ServiceItem[],
  rank: CONSULTANT_RANK
): string {
  const result = calculateTotalCommission(services, rank);
  
  let report = `Commission Report for ${rank}\n`;
  report += `========================\n\n`;
  
  result.services.forEach((service, index) => {
    const b = service.breakdown;
    report += `Service ${index + 1}: ${service.productType}\n`;
    report += `  Base Commission: ${formatEuro(b.baseCommission)}\n`;
    if (b.convergenceBonus > 0) {
      report += `  Convergence Bonus: ${formatEuro(b.convergenceBonus)}\n`;
    }
    if (b.portabilityBonus > 0) {
      report += `  Portability Bonus: ${formatEuro(b.portabilityBonus)}\n`;
    }
    if (b.soHoBonus > 0) {
      report += `  SoHo Bonus: ${formatEuro(b.soHoBonus)}\n`;
    }
    if (b.addOnBonus > 0) {
      report += `  Add-on Bonus: ${formatEuro(b.addOnBonus)}\n`;
    }
    report += `  Subtotal: ${formatEuro(b.total)}\n\n`;
  });
  
  report += `========================\n`;
  report += `GRAND TOTAL: ${formatEuro(result.grandTotal)}\n`;
  report += `Total ASP: ${result.totalASP.total} (Base: ${result.totalASP.baseASP}, Extra: ${result.totalASP.extraASP})\n`;
  
  return report;
}
