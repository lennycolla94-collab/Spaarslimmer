/**
 * INTERNET CATALOG - Madelijn Compliant
 * Location: src/features/calculator/catalogs/internet-catalog.ts
 * 
 * Rules:
 * - BC/SC waarden: Internet BC=15/SC=20
 * - Convergentie: 15 (Mobiel + Internet bundel)
 * - Portability: 12 (van andere provider)
 * - ASP: 1.0 + 0.5 bij SoHo/Internet portability = 1.5
 * - Fidelity: €0.35/maand (alleen Internet, niet TV)
 * - TV: Geen fidelity, geen portabiliteit (TV is add-on)
 */

export interface InternetProduct {
  id: string;
  name: string;
  type: 'INTERNET' | 'TV' | 'TV_LITE';
  bcValue: number; // Base Commission
  scValue: number; // Service Commission  
  portabilityBonus: number;
  convergenceBonus: number;
  aspValue: number; // Advanced Service Points
  aspPortabilityBonus?: number; // Extra ASP bij portability
  fidelityMonthly: number;
  hasFidelity: boolean;
  hasPortability: boolean;
  category: 'RESIDENTIAL' | 'SOHO';
}

export const internetCatalog: Record<string, InternetProduct> = {
  // INTERNET PRODUCTS
  // GECORRIGEERD: ASP structuur
  EASY_INTERNET_HOME: {
    id: 'EASY_INTERNET_HOME',
    name: 'Easy Internet Home',
    type: 'INTERNET',
    category: 'RESIDENTIAL',
    bcValue: 15,
    scValue: 20,
    portabilityBonus: 12,
    convergenceBonus: 15,
    aspValue: 1,           // Basis ASP
    aspPortabilityBonus: 0.5,  // TOEVOEGEN: Extra bij portability
    fidelityMonthly: 0.35,
    hasFidelity: true,
    hasPortability: true,
  },
  
  // GECORRIGEERD: TV heeft WEL commissie!
  ORANGE_TV: {
    id: 'ORANGE_TV',
    name: 'Orange TV',
    type: 'TV',
    category: 'RESIDENTIAL',
    bcValue: 10,  // WAS: 0, CORRECT: 10
    scValue: 10,  // WAS: 0, CORRECT: 10
    portabilityBonus: 0,
    convergenceBonus: 0,
    aspValue: 1,  // WAS: 0.5, CORRECT: 1
    fidelityMonthly: 0,
    hasFidelity: false,
    hasPortability: false,
  },
  
  ORANGE_TV_LITE: {
    id: 'ORANGE_TV_LITE',
    name: 'Orange TV Lite',
    type: 'TV_LITE',
    category: 'RESIDENTIAL',
    bcValue: 0,
    scValue: 0,
    portabilityBonus: 0,
    convergenceBonus: 0,
    aspValue: 0.3,
    fidelityMonthly: 0,
    hasFidelity: false,
    hasPortability: false,
  },
  
  // SOHO VARIANT (higher values)
  EASY_INTERNET_SOHO: {
    id: 'EASY_INTERNET_SOHO',
    name: 'Easy Internet Home SoHo',
    type: 'INTERNET',
    category: 'SOHO',
    bcValue: 15,
    scValue: 20,
    portabilityBonus: 12,
    convergenceBonus: 15,
    aspValue: 1.5, // +0.5 voor SoHo
    aspPortabilityBonus: 0.5,
    fidelityMonthly: 0.35,
    hasFidelity: true,
    hasPortability: true,
  },
} as const;

// Helper functies (pure functions, geen side effects)
export function getInternetProduct(id: string): InternetProduct | undefined {
  return internetCatalog[id];
}

export function calculateInternetRetail(
  productId: string,
  options: {
    isPortable: boolean; // Van andere provider?
    hasConvergence: boolean; // Mobiel + Internet?
    isSoHo: boolean;
  }
): {
  bc: number;
  sc: number;
  portabilityBonus: number;
  convergenceBonus: number;
  totalRetail: number;
  asp: number;
  fidelityMonthly: number;
} {
  const product = getInternetProduct(productId);
  if (!product) throw new Error(`Product ${productId} niet gevonden`);
  
  // Validatie: TV producten hebben geen portabiliteit/fidelity
  if (product.type !== 'INTERNET' && (options.isPortable || options.hasConvergence)) {
    throw new Error(`${product.type} ondersteunt geen portabiliteit/convergentie`);
  }
  
  const portabilityBonus = options.isPortable && product.hasPortability 
    ? product.portabilityBonus 
    : 0;
    
  const convergenceBonus = options.hasConvergence && product.type === 'INTERNET'
    ? product.convergenceBonus
    : 0;
    
  const asp = options.isSoHo && product.category === 'SOHO' 
    ? product.aspValue // Al 1.5 in catalog
    : product.aspValue;

  return {
    bc: product.bcValue,
    sc: product.scValue,
    portabilityBonus,
    convergenceBonus,
    totalRetail: product.bcValue + product.scValue + portabilityBonus + convergenceBonus,
    asp: asp,
    fidelityMonthly: product.hasFidelity ? product.fidelityMonthly : 0,
  };
}

// Export types voor andere modules
export type InternetCatalog = typeof internetCatalog;
