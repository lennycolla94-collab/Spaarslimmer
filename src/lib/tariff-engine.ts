/**
 * Orange Tariff Engine
 * Berekent klantprijzen, packkortingen, convergentie en besparingen
 * Bron: Orange prijsdocument (zonder promoties)
 */

// ============================================================================
// TARIEVEN (in eurocenten per maand)
// ============================================================================

// INTERNET - ZONDER MOBIEL (geen convergentie)
export const INTERNET_PRICES_STANDALONE = {
  START: 5300,  // €53 - Start Fiber
  ZEN: 6200,    // €62 - Zen Fiber
  GIGA: 7200,   // €72 - Giga Fiber
} as const;

// INTERNET - MET MOBIEL (convergentie vanaf 1 mobiel)
export const INTERNET_PRICES_PACK = {
  START: 4900,  // €49 - Start Fiber
  ZEN: 5800,    // €58 - Zen Fiber
  GIGA: 6800,   // €68 - Giga Fiber
} as const;

// MOBIEL - ZONDER INTERNET (1 lijn - geen CHILD mogelijk als eerste lijn)
export const MOBILE_PRICES_STANDALONE: Record<Exclude<MobilePlan, 'CHILD'>, number> = {
  SMALL: 1500,     // €15 - 12GB
  MEDIUM: 2300,    // €23 - 70GB
  LARGE: 2900,     // €29 - 140GB
  UNLIMITED: 4000, // €40 - Onbeperkt
} as const;

// MOBIEL - ZONDER INTERNET (2+ lijnen - multi-line korting, ALLE lijnen krijgen deze prijs)
export const MOBILE_PRICES_STANDALONE_2PLUS: Record<MobilePlan, number> = {
  SMALL: 1400,     // €14 - 12GB
  MEDIUM: 2100,    // €21 - 70GB
  LARGE: 2650,     // €26,50 - 140GB
  UNLIMITED: 3700, // €37 - Onbeperkt
  CHILD: 500,      // €5 - alleen als 2e/3e nummer
} as const;

// MOBIEL - IN PACK MET INTERNET (1 mobiel nummer - geen CHILD mogelijk als eerste lijn)
export const MOBILE_PRICES_PACK_1: Record<Exclude<MobilePlan, 'CHILD'>, number> = {
  SMALL: 1200,     // €12
  MEDIUM: 1700,    // €17
  LARGE: 2250,     // €22,50
  UNLIMITED: 3300, // €33
} as const;

// MOBIEL - IN PACK MET INTERNET (2+ lijnen - ALLE lijnen krijgen deze prijs, incl. eerste)
export const MOBILE_PRICES_PACK_2PLUS: Record<MobilePlan, number> = {
  SMALL: 1100,     // €11
  MEDIUM: 1500,    // €15
  LARGE: 2000,     // €20
  UNLIMITED: 3000, // €30
  CHILD: 500,      // €5 - alleen als 2e/3e nummer
} as const;

// TV
export const TV_PRICES = {
  TV_LIFE: 1000,   // €10 - App only
  TV: 2000,        // €20 - Met decoder
  TV_PLUS: 3200,   // €32 - Netflix inbegrepen
} as const;

// ADDONS
export const ADDON_PRICES = {
  VASTE_LIJN: 1200,     // €12
  MY_COMFORT: 1000,     // €10 (€5 bij Giga)
  MY_COMFORT_GIGA: 500, // €5 bij Giga
  WIFI_BOOSTER: 300,    // €3 per booster
  EXTRA_DECODER: 900,   // €9
} as const;

// KORTINGEN
export const DISCOUNTS = {
  SECOND_ADDRESS: 1000,  // €10 levenslange korting op 2de adres
} as const;

// ============================================================================
// TYPES
// ============================================================================

export type InternetPlan = 'START' | 'ZEN' | 'GIGA';
export type MobilePlan = 'CHILD' | 'SMALL' | 'MEDIUM' | 'LARGE' | 'UNLIMITED';
export type TVPlan = 'NONE' | 'TV_LIFE' | 'TV' | 'TV_PLUS';

export interface MobileLine {
  plan: MobilePlan;
  isPortability: boolean;
  isNewNumber?: boolean;
}

export interface TariffInput {
  internetPlan: InternetPlan;
  isSecondAddress: boolean;
  hasMobile: boolean;
  mobileLines: MobileLine[];
  tvPlan: TVPlan;
  hasVasteLijn: boolean;
  hasMyComfort: boolean;
  wifiBoosters: number;
  extraDecoders: number;
  currentMonthlyCost: number;
}

export interface TariffResult {
  internetPrice: number;
  mobilePrice: number;
  tvPrice: number;
  addonsPrice: number;
  secondAddressDiscount: number;
  totalMonthly: number;
  savings6Months?: number;
  savings24Months?: number;
  savingsPercentage?: number;
  formatted: {
    totalMonthly: string;
    savings6Months?: string;
    savings24Months?: string;
  };
}

// ============================================================================
// HELPERS
// ============================================================================

export function formatEuro(cents: number): string {
  return '€' + (cents / 100).toFixed(2).replace('.', ',');
}

// ============================================================================
// BEREKENINGEN
// ============================================================================

function calculateInternetPrice(plan: InternetPlan, hasMobile: boolean, isSecondAddress: boolean): number {
  // Kies basis prijs (met of zonder convergentie)
  let price = hasMobile 
    ? INTERNET_PRICES_PACK[plan] 
    : INTERNET_PRICES_STANDALONE[plan];
  
  // 2de adres korting
  if (isSecondAddress) {
    price -= DISCOUNTS.SECOND_ADDRESS;
  }
  
  return price;
}

function calculateMobilePrice(lines: MobileLine[], hasInternet: boolean): number {
  if (lines.length === 0) return 0;
  
  // Zonder internet = standalone prijzen
  if (!hasInternet) {
    // 2+ lijnen = alle lijnen krijgen de 2+ prijs (max 1 child)
    const priceTable = lines.length === 1 
      ? MOBILE_PRICES_STANDALONE 
      : MOBILE_PRICES_STANDALONE_2PLUS;
    
    return lines.reduce((total, line) => {
      // CHILD kan alleen in 2+ lijnen (en zit alleen in _2PLUS tables)
      if (line.plan === 'CHILD') {
        return total + MOBILE_PRICES_STANDALONE_2PLUS.CHILD;
      }
      return total + priceTable[line.plan as Exclude<MobilePlan, 'CHILD'>];
    }, 0);
  }
  
  // Met internet = pack prijzen
  // 2+ lijnen = ALLE lijnen (inclusief de eerste) krijgen de 2+ pack prijs
  const priceTable = lines.length === 1 
    ? MOBILE_PRICES_PACK_1 
    : MOBILE_PRICES_PACK_2PLUS;
  
  return lines.reduce((total, line) => {
    // CHILD kan alleen in 2+ lijnen (en zit alleen in PACK_2PLUS)
    if (line.plan === 'CHILD') {
      return total + MOBILE_PRICES_PACK_2PLUS.CHILD;
    }
    return total + priceTable[line.plan as Exclude<MobilePlan, 'CHILD'>];
  }, 0);
}

export function calculateTariff(input: TariffInput): TariffResult {
  const hasMobile = input.mobileLines.length > 0;
  
  // 1. Internet prijs
  const internetPrice = calculateInternetPrice(
    input.internetPlan,
    hasMobile,
    input.isSecondAddress
  );
  
  // 2. Mobile prijs
  const mobilePrice = calculateMobilePrice(input.mobileLines, hasMobile);
  
  // 3. TV prijs
  let tvPrice = 0;
  if (input.tvPlan && input.tvPlan !== 'NONE') {
    tvPrice = TV_PRICES[input.tvPlan];
  }
  
  // 4. Add-ons
  let addonsPrice = 0;
  
  // Vaste lijn
  if (input.hasVasteLijn) {
    addonsPrice += ADDON_PRICES.VASTE_LIJN;
  }
  
  // My Comfort (€5 bij Giga, anders €10)
  if (input.hasMyComfort) {
    if (input.internetPlan === 'GIGA') {
      addonsPrice += ADDON_PRICES.MY_COMFORT_GIGA;
    } else {
      addonsPrice += ADDON_PRICES.MY_COMFORT;
    }
  }
  
  // WiFi boosters (max 3)
  const boosters = Math.min(3, input.wifiBoosters);
  addonsPrice += boosters * ADDON_PRICES.WIFI_BOOSTER;
  
  // Extra decoders
  if (input.extraDecoders) {
    addonsPrice += input.extraDecoders * ADDON_PRICES.EXTRA_DECODER;
  }
  
  // 5. Kortingen
  const secondAddressDiscount = input.isSecondAddress ? DISCOUNTS.SECOND_ADDRESS : 0;
  
  // 6. Totaal
  const totalMonthly = internetPrice + mobilePrice + tvPrice + addonsPrice;
  
  // 7. Besparingen berekenen
  let savings6Months: number | undefined;
  let savings24Months: number | undefined;
  let savingsPercentage: number | undefined;
  
  if (input.currentMonthlyCost && input.currentMonthlyCost > 0) {
    const currentCents = input.currentMonthlyCost * 100;
    const monthlySavings = currentCents - totalMonthly;
    savings6Months = Math.round(monthlySavings * 6);
    savings24Months = Math.round(monthlySavings * 24);
    savingsPercentage = Math.round((monthlySavings / currentCents) * 100);
  }
  
  return {
    internetPrice,
    mobilePrice,
    tvPrice,
    addonsPrice,
    secondAddressDiscount,
    totalMonthly,
    savings6Months,
    savings24Months,
    savingsPercentage,
    formatted: {
      totalMonthly: formatEuro(totalMonthly),
      savings6Months: savings6Months ? formatEuro(savings6Months) : undefined,
      savings24Months: savings24Months ? formatEuro(savings24Months) : undefined,
    },
  };
}

export function recommendPlan(currentCost: number): {
  recommended: InternetPlan;
  reason: string;
} {
  if (currentCost < 50) {
    return { recommended: 'START', reason: 'Start Fiber is perfect voor basisgebruik' };
  } else if (currentCost < 70) {
    return { recommended: 'ZEN', reason: 'Zen Fiber biedt de beste prijs/kwaliteit' };
  } else {
    return { recommended: 'GIGA', reason: 'Giga Fiber voor maximale snelheid' };
  }
}
