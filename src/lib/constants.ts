/**
 * MLM Commission System Constants
 * All amounts stored in CENTS (integer math)
 * Source: Commissie Systeem, ASP Document, MLM Fidelity documents
 */

// Consultant Status Enum
export enum CONSULTANT_STATUS {
  ACTIVE = 'ACTIVE',
  NOT_QUALIFIED = 'NOT_QUALIFIED',
  CANCELLED = 'CANCELLED',
  NEW = 'NEW', // First 3 quarters - amnesty period
}

// Consultant Rank Enum
export enum CONSULTANT_RANK {
  BC = 'BC',           // Business Consultant
  SC = 'SC',           // Senior Consultant
  Y = 'Y',             // Young
  PC = 'PC',           // Premier Consultant
  LE = 'LE',           // Leader
  PMC = 'PMC',         // Premier Leader Consultant
  EC = 'EC',           // Elite Consultant
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
  DIAMOND = 'DIAMOND',
  AMBASSADOR = 'AMBASSADOR',
}

// Product Types
export enum PRODUCT_TYPE {
  MOBILE_CHILD = 'MOBILE_CHILD',
  MOBILE_SMALL = 'MOBILE_SMALL',
  MOBILE_MEDIUM = 'MOBILE_MEDIUM',
  MOBILE_LARGE = 'MOBILE_LARGE',
  MOBILE_UNLIMITED = 'MOBILE_UNLIMITED',
  INTERNET = 'INTERNET',
  ORANGE_TV = 'ORANGE_TV',
  ORANGE_TV_LITE = 'ORANGE_TV_LITE',
  ENERGIE_RESIDENTIEEL = 'ENERGIE_RESIDENTIEEL',
  ENERGIE_SOHO = 'ENERGIE_SOHO',
  KETELONDERHOUD = 'KETELONDERHOUD',
}

// Service Category for bonus eligibility
export enum SERVICE_CATEGORY {
  MOBILE = 'MOBILE',
  INTERNET = 'INTERNET',
  TV = 'TV',
  ENERGIE = 'ENERGIE',
  KETEL = 'KETEL',
}

// Retail Commission Rates (in cents)
// BC = Business Consultant, SC = Senior Consultant and above
export const RETAIL_RATES = {
  [PRODUCT_TYPE.MOBILE_CHILD]: {
    BC: 100,      // €1
    SC: 500,      // €5
  },
  [PRODUCT_TYPE.MOBILE_SMALL]: {
    BC: 1000,     // €10
    SC: 1500,     // €15
  },
  [PRODUCT_TYPE.MOBILE_MEDIUM]: {
    BC: 3500,     // €35
    SC: 4000,     // €40
  },
  [PRODUCT_TYPE.MOBILE_LARGE]: {
    BC: 5000,     // €50
    SC: 5500,     // €55
  },
  [PRODUCT_TYPE.MOBILE_UNLIMITED]: {
    BC: 6000,     // €60
    SC: 6500,     // €65
  },
  [PRODUCT_TYPE.INTERNET]: {
    BC: 1500,     // €15
    SC: 2000,     // €20
  },
  [PRODUCT_TYPE.ORANGE_TV]: {
    BC: 1000,     // €10
    SC: 1000,     // €10
  },
  [PRODUCT_TYPE.ORANGE_TV_LITE]: {
    BC: 1000,     // €10 (same as Orange TV)
    SC: 1000,     // €10
  },
  [PRODUCT_TYPE.ENERGIE_RESIDENTIEEL]: {
    BC: 2000,     // €20
    SC: 2500,     // €25
  },
  [PRODUCT_TYPE.ENERGIE_SOHO]: {
    BC: 4000,     // €40
    SC: 4500,     // €45
  },
  [PRODUCT_TYPE.KETELONDERHOUD]: {
    BC: 2000,     // €20
    SC: 2500,     // €25
  },
} as const;

// Bonus Amounts (in cents)
export const BONUS_AMOUNTS = {
  // Convergence bonus (when mobile + internet activated together)
  CONVERGENCE_MOBILE: 1200,     // €12 (applies to Medium+ mobile plans)
  CONVERGENCE_INTERNET: 1500,   // €15
  
  // Portability bonus (number transfer from external operator)
  PORTABILITY_MOBILE: 2000,     // €20 (applies to Medium+ mobile plans)
  PORTABILITY_INTERNET: 1200,   // €12
  
  // SoHo bonus (valid BTW number for Medium+ mobile plans)
  SOHO_MOBILE: 1500,            // €15
  
  // Energie add-ons
  ENERGIE_EBILLING: 500,        // €5
  ENERGIE_DOMICILIERING: 500,   // €5
} as const;

// ASP (Active Smart Points) per product
export const ASP_POINTS = {
  [PRODUCT_TYPE.MOBILE_CHILD]: 0,
  [PRODUCT_TYPE.MOBILE_SMALL]: 1,
  [PRODUCT_TYPE.MOBILE_MEDIUM]: 1,
  [PRODUCT_TYPE.MOBILE_LARGE]: 1,
  [PRODUCT_TYPE.MOBILE_UNLIMITED]: 1,
  [PRODUCT_TYPE.INTERNET]: 1,
  [PRODUCT_TYPE.ORANGE_TV]: 1,
  [PRODUCT_TYPE.ORANGE_TV_LITE]: 1,
  [PRODUCT_TYPE.ENERGIE_RESIDENTIEEL]: 0.5,
  [PRODUCT_TYPE.ENERGIE_SOHO]: 1,
  [PRODUCT_TYPE.KETELONDERHOUD]: 0, // No ASP for ketelonderhoud
} as const;

// Extra ASP points
export const EXTRA_ASP = {
  SOHO_MOBILE: 0.5,           // +0.5 ASP for SoHo on Medium/Large/Unlimited
  INTERNET_PORTABILITY: 0.5,  // +0.5 ASP for Easy Switch on Internet
} as const;

// Personal Fidelity Rates (monthly, in cents)
// Source: MLM Fidelity document
export const FIDELITY_RATES = {
  [PRODUCT_TYPE.MOBILE_CHILD]: {
    N0: 25,      // €0.25
    N1: 11,      // €0.11
    N2_6: 4,     // €0.04
    N7: 14,      // €0.14
  },
  [PRODUCT_TYPE.MOBILE_SMALL]: {
    N0: 50,      // €0.50
    N1: 21,      // €0.21
    N2_6: 7,     // €0.07
    N7: 29,      // €0.29
  },
  [PRODUCT_TYPE.MOBILE_MEDIUM]: {
    N0: 100,     // €1.00
    N1: 43,      // €0.43
    N2_6: 14,    // €0.14
    N7: 57,      // €0.57
  },
  [PRODUCT_TYPE.MOBILE_LARGE]: {
    N0: 125,     // €1.25
    N1: 53,      // €0.53
    N2_6: 17,    // €0.17
    N7: 73,      // €0.73
  },
  [PRODUCT_TYPE.MOBILE_UNLIMITED]: {
    N0: 150,     // €1.50
    N1: 64,      // €0.64
    N2_6: 21,    // €0.21
    N7: 89,      // €0.89
  },
  [PRODUCT_TYPE.INTERNET]: {
    N0: 35,      // €0.35
    N1: 10,      // €0.10
    N2_6: 4,     // €0.04
    N7: 5,       // €0.05
  },
  [PRODUCT_TYPE.ENERGIE_RESIDENTIEEL]: {
    N0: 35,      // €0.35
    N1: 10,      // €0.10
    N2_6: 4,     // €0.04
    N7: 5,       // €0.05
  },
  [PRODUCT_TYPE.ENERGIE_SOHO]: {
    N0: 35,      // €0.35 (same as residentieel)
    N1: 10,      // €0.10
    N2_6: 4,     // €0.04
    N7: 5,       // €0.05
  },
  // TV and Ketel generate NO fidelity
  [PRODUCT_TYPE.ORANGE_TV]: {
    N0: 0,
    N1: 0,
    N2_6: 0,
    N7: 0,
  },
  [PRODUCT_TYPE.ORANGE_TV_LITE]: {
    N0: 0,
    N1: 0,
    N2_6: 0,
    N7: 0,
  },
  [PRODUCT_TYPE.KETELONDERHOUD]: {
    N0: 0,
    N1: 0,
    N2_6: 0,
    N7: 0,
  },
} as const;

// Upline Fidelity Percentages (percentage of personal fidelity)
export const UPLINE_FIDELITY_PERCENTAGES = {
  N1: 10,   // 10%
  N2: 5,    // 5%
  N3: 5,    // 5%
  N4: 3,    // 3%
  N5: 2,    // 2%
  N6: 1,    // 1%
  N7: 1,    // 1%
} as const;

// PQS (Personal Quick Start) Points for QS levels
export const PQS_POINTS = {
  PQS: 50,   // Personal QS
  QS1: 20,   // Level 1
  QS2: 10,   // Level 2
  QS3: 5,    // Level 3
  QS4: 5,    // Level 4
  QS5: 5,    // Level 5
  QS6: 5,    // Level 6
  QS7: 10,   // Level 7
} as const;

// Clawback Rates (percentage to be reclaimed)
export const CLAWBACK_RATES = {
  LESS_THAN_1_MONTH: 100,      // 100% clawback (< 1 month active)
  ONE_TO_SIX_MONTHS: 75,       // 75% clawback (1-6 months active)
  SIX_MONTHS_PLUS: 25,         // 25% clawback (> 6 months active)
} as const;

// Retention Rates (percentage consultant keeps)
export const RETENTION_RATES = {
  LESS_THAN_1_MONTH: 0,        // 0% (< 1 month)
  ONE_TO_SIX_MONTHS: 25,       // 25% (1-6 months)
  SIX_MONTHS_PLUS: 75,         // 75% (> 6 months)
} as const;

// Rank Requirements
export const RANK_REQUIREMENTS = {
  [CONSULTANT_RANK.BC]: {
    minPersonalASP: 0,
    minTeamASP: 0,
    minActiveLegs: 0,
  },
  [CONSULTANT_RANK.SC]: {
    minPersonalASP: 10,
    minTeamASP: 0,
    minActiveLegs: 0,
  },
  [CONSULTANT_RANK.Y]: {
    minPersonalASP: 10,
    minTeamASP: 50,
    minActiveLegs: 1,
  },
  [CONSULTANT_RANK.PC]: {
    minPersonalASP: 10,
    minTeamASP: 100,
    minActiveLegs: 2,
  },
  [CONSULTANT_RANK.LE]: {
    minPersonalASP: 10,
    minTeamASP: 200,
    minActiveLegs: 3,
  },
  [CONSULTANT_RANK.PMC]: {
    minPersonalASP: 10,
    minTeamASP: 500,
    minActiveLegs: 4,
  },
  [CONSULTANT_RANK.EC]: {
    minPersonalASP: 10,
    minTeamASP: 1000,
    minActiveLegs: 5,
  },
  [CONSULTANT_RANK.SILVER]: {
    minPersonalASP: 10,
    minTeamASP: 2000,
    minActiveLegs: 6,
  },
  [CONSULTANT_RANK.GOLD]: {
    minPersonalASP: 10,
    minTeamASP: 5000,
    minActiveLegs: 7,
  },
  [CONSULTANT_RANK.PLATINUM]: {
    minPersonalASP: 10,
    minTeamASP: 10000,
    minActiveLegs: 8,
  },
  [CONSULTANT_RANK.DIAMOND]: {
    minPersonalASP: 10,
    minTeamASP: 20000,
    minActiveLegs: 10,
  },
  [CONSULTANT_RANK.AMBASSADOR]: {
    minPersonalASP: 10,
    minTeamASP: 50000,
    minActiveLegs: 12,
  },
} as const;

// Quarterly Qualification Requirements
export const QUARTERLY_REQUIREMENTS = {
  MIN_PERSONAL_ASP: 10,        // Option 1: 10 personal ASP per quarter
  MIN_PQS: 1,                  // Option 2: 1 PQS
  MIN_QS1: 1,                  // Option 3: 1 QS1
} as const;

// PQS Requirements (40-day window)
export const PQS_REQUIREMENTS = {
  TOTAL_ASP: 12,
  MIN_MOBILE_ASP: 7,
  MIN_ENERGIE_ASP: 3,
  MIN_INTERNET_ASP: 2,
  BONUS_AMOUNT: 15000,         // €150 bonus for consultant
  SPONSOR_BONUS: 15000,        // €150 bonus for sponsor (QS1)
} as const;

// Infinity Bonus per PQS (by rank, in cents)
export const INFINITY_BONUS_RATES = {
  [CONSULTANT_RANK.BC]: 0,         // €0 - BC doesn't qualify
  [CONSULTANT_RANK.SC]: 5000,      // €50
  [CONSULTANT_RANK.Y]: 7500,       // €75
  [CONSULTANT_RANK.PC]: 10000,     // €100
  [CONSULTANT_RANK.LE]: 15000,     // €150
  [CONSULTANT_RANK.PMC]: 30000,    // €300
  [CONSULTANT_RANK.EC]: 30000,     // €300
  [CONSULTANT_RANK.SILVER]: 30000, // €300
  [CONSULTANT_RANK.GOLD]: 30000,   // €300
  [CONSULTANT_RANK.PLATINUM]: 30000,// €300
  [CONSULTANT_RANK.DIAMOND]: 30000,// €300
  [CONSULTANT_RANK.AMBASSADOR]: 30000,// €300
} as const;

// Mobile plans that qualify for Medium+ bonuses
export const MEDIUM_PLUS_PLANS = [
  PRODUCT_TYPE.MOBILE_MEDIUM,
  PRODUCT_TYPE.MOBILE_LARGE,
  PRODUCT_TYPE.MOBILE_UNLIMITED,
] as const;

// Products that generate fidelity
export const FIDELITY_ELIGIBLE_PRODUCTS = [
  PRODUCT_TYPE.MOBILE_CHILD,
  PRODUCT_TYPE.MOBILE_SMALL,
  PRODUCT_TYPE.MOBILE_MEDIUM,
  PRODUCT_TYPE.MOBILE_LARGE,
  PRODUCT_TYPE.MOBILE_UNLIMITED,
  PRODUCT_TYPE.INTERNET,
  PRODUCT_TYPE.ENERGIE_RESIDENTIEEL,
  PRODUCT_TYPE.ENERGIE_SOHO,
] as const;

// Products excluded from new customer bonuses
export const EXCLUDED_FROM_BONUSES = [
  PRODUCT_TYPE.MOBILE_CHILD,
  PRODUCT_TYPE.MOBILE_SMALL,
] as const;

// Helper function to check if product is Medium+
export function isMediumPlus(productType: PRODUCT_TYPE): boolean {
  return MEDIUM_PLUS_PLANS.includes(productType as typeof MEDIUM_PLUS_PLANS[number]);
}

// Helper function to check if product generates fidelity
export function generatesFidelity(productType: PRODUCT_TYPE): boolean {
  return FIDELITY_ELIGIBLE_PRODUCTS.includes(productType as typeof FIDELITY_ELIGIBLE_PRODUCTS[number]);
}

// Helper function to check if product qualifies for bonuses (not Child/Small)
export function qualifiesForBonuses(productType: PRODUCT_TYPE): boolean {
  return !EXCLUDED_FROM_BONUSES.includes(productType as typeof EXCLUDED_FROM_BONUSES[number]);
}

// Helper to get service category from product type
export function getServiceCategory(productType: PRODUCT_TYPE): SERVICE_CATEGORY {
  switch (productType) {
    case PRODUCT_TYPE.MOBILE_CHILD:
    case PRODUCT_TYPE.MOBILE_SMALL:
    case PRODUCT_TYPE.MOBILE_MEDIUM:
    case PRODUCT_TYPE.MOBILE_LARGE:
    case PRODUCT_TYPE.MOBILE_UNLIMITED:
      return SERVICE_CATEGORY.MOBILE;
    case PRODUCT_TYPE.INTERNET:
      return SERVICE_CATEGORY.INTERNET;
    case PRODUCT_TYPE.ORANGE_TV:
    case PRODUCT_TYPE.ORANGE_TV_LITE:
      return SERVICE_CATEGORY.TV;
    case PRODUCT_TYPE.ENERGIE_RESIDENTIEEL:
    case PRODUCT_TYPE.ENERGIE_SOHO:
      return SERVICE_CATEGORY.ENERGIE;
    case PRODUCT_TYPE.KETELONDERHOUD:
      return SERVICE_CATEGORY.KETEL;
    default:
      throw new Error(`Unknown product type: ${productType}`);
  }
}

// Helper to check if rank is SC or higher
export function isSCOrHigher(rank: CONSULTANT_RANK): boolean {
  return rank !== CONSULTANT_RANK.BC;
}

// Euro to cents converter
export function eurosToCents(euros: number): number {
  return Math.round(euros * 100);
}

// Cents to euro string converter
export function centsToEuroString(cents: number): string {
  return `€${(cents / 100).toFixed(2)}`;
}
