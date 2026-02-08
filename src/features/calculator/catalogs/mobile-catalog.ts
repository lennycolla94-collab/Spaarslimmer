// src/lib/calculator/catalogs/mobile-catalog.ts
// GEBASEERD OP MADELIJN SPECIFICATIES - Alleen Orange Mobile producten

export interface MobileProduct {
  naam: string;
  bcRetail: number;
  scRetail: number;
  aspBasis: number;
  convergentieBonus: number;
  portabilityBonus: number;
  sohoBonus: number;
  sohoAspExtra: number;
  fidelityPerMaand: number;
  // Regels
  heeftPortabiliteit: boolean;
  heeftSoHo: boolean;
}

export const MOBILE_CATALOG: Record<string, MobileProduct> = {
  'Orange Mobile Child': {
    naam: 'Orange Mobile Child',
    bcRetail: 1,
    scRetail: 5,
    aspBasis: 0,
    convergentieBonus: 0,
    portabilityBonus: 0,
    sohoBonus: 0,
    sohoAspExtra: 0,
    fidelityPerMaand: 0.25,
    heeftPortabiliteit: false, // NOOIT, zelfs bij nummeroverdracht
    heeftSoHo: false,          // NOOIT, zelfs niet met btw
  },
  
  'Orange Mobile Small': {
    naam: 'Orange Mobile Small',
    bcRetail: 10,
    scRetail: 15,
    aspBasis: 1,
    convergentieBonus: 0,
    portabilityBonus: 0,
    sohoBonus: 0,
    sohoAspExtra: 0,
    fidelityPerMaand: 0.50,
    heeftPortabiliteit: false, // NOOIT
    heeftSoHo: false,          // NOOIT
  },
  
  'Orange Mobile Medium': {
    naam: 'Orange Mobile Medium',
    bcRetail: 35,
    scRetail: 40,
    aspBasis: 1,
    convergentieBonus: 12,
    portabilityBonus: 20,
    sohoBonus: 15,
    sohoAspExtra: 0.5,
    fidelityPerMaand: 1.00,
    heeftPortabiliteit: true,  // ALLEEN bij externe operator + nummeroverdracht
    heeftSoHo: true,           // ALLEEN met btw-nummer
  },
  
  'Orange Mobile Large': {
    naam: 'Orange Mobile Large',
    bcRetail: 50,
    scRetail: 55,
    aspBasis: 1,
    convergentieBonus: 12,
    portabilityBonus: 20,
    sohoBonus: 15,
    sohoAspExtra: 0.5,
    fidelityPerMaand: 1.25,
    heeftPortabiliteit: true,
    heeftSoHo: true,
  },
  
  'Orange Mobile Unlimited': {
    naam: 'Orange Mobile Unlimited',
    bcRetail: 60,
    scRetail: 65,
    aspBasis: 1,
    convergentieBonus: 12,
    portabilityBonus: 20,
    sohoBonus: 15,
    sohoAspExtra: 0.5,
    fidelityPerMaand: 1.50,
    heeftPortabiliteit: true,
    heeftSoHo: true,
  },
};

// Helper functies voor Mobile Module
export function getMobileProduct(tariefplan: string): MobileProduct | undefined {
  // Normaliseer input (case insensitive, spaties)
  const normalized = tariefplan.toLowerCase().replace(/\s+/g, '');
  const key = Object.keys(MOBILE_CATALOG).find(k => 
    k.toLowerCase().replace(/\s+/g, '') === normalized
  );
  return key ? MOBILE_CATALOG[key] : undefined;
}

// Legacy signature for backward compatibility
export function calculateMobileRetail(
  product: MobileProduct,
  positie: 'BC' | 'SC' | 'EC' | 'PC' | 'MC' | 'NMC' | 'PMC',
  isConvergentie: boolean,
  isPortabiliteit: boolean,
  isSoHo: boolean,
  komtVanOperator: string
): { 
  basisRetail: number; 
  convergentieBonus: number; 
  portabilityBonus: number; 
  sohoBonus: number;
  totaalRetail: number;
  aspTotaal: number;
}

// New object-based signature
export function calculateMobileRetail(
  productId: string,
  options: {
    isPortable: boolean;
    isConvergence: boolean;
    isSoHo: boolean;
    komtVanOperator?: string;
    positie?: 'BC' | 'SC' | 'EC' | 'PC' | 'MC' | 'NMC' | 'PMC';
  }
): {
  bc: number;
  sc: number;
  baseRetail: number;
  portabilityBonus: number;
  convergenceBonus: number;
  totalRetail: number;
  asp: number;
  fidelityMonthly: number;
}

// Implementation
export function calculateMobileRetail(
  productOrId: MobileProduct | string,
  positieOrOptions: 'BC' | 'SC' | 'EC' | 'PC' | 'MC' | 'NMC' | 'PMC' | {
    isPortable: boolean;
    isConvergence: boolean;
    isSoHo: boolean;
    komtVanOperator?: string;
    positie?: 'BC' | 'SC' | 'EC' | 'PC' | 'MC' | 'NMC' | 'PMC';
  },
  isConvergentie?: boolean,
  isPortabiliteit?: boolean,
  isSoHo?: boolean,
  komtVanOperator?: string
): any {
  // Check which signature is being used
  if (typeof productOrId === 'string') {
    // New object-based API
    const productId = productOrId;
    const options = positieOrOptions as {
      isPortable: boolean;
      isConvergence: boolean;
      isSoHo: boolean;
      komtVanOperator?: string;
      positie?: 'BC' | 'SC' | 'EC' | 'PC' | 'MC' | 'NMC' | 'PMC';
    };
    
    const product = getMobileProduct(productId);
    if (!product) throw new Error(`Mobile product ${productId} niet gevonden`);
    
    const positie = options.positie || 'BC';
    const operator = options.komtVanOperator || '';
    
    // Start met basis retail (BC of SC)
    let basisRetail = positie === 'BC' ? product.bcRetail : product.scRetail;
    let totaalAsp = product.aspBasis;
    
    let convBonus = 0;
    let portBonus = 0;
    let sohBonus = 0;
    
    // Convergentie
    if (options.isConvergence && product.convergentieBonus > 0) {
      convBonus = product.convergentieBonus;
    }
    
    // Portabiliteit
    if (options.isPortable && product.heeftPortabiliteit) {
      const interneOperators = ['orange', 'hey', 'zuny', 'voo'];
      if (!interneOperators.includes(operator.toLowerCase())) {
        portBonus = product.portabilityBonus;
      }
    }
    
    // SoHo
    if (options.isSoHo && product.heeftSoHo) {
      sohBonus = product.sohoBonus;
      totaalAsp += product.sohoAspExtra;
    }
    
    const totaalRetail = basisRetail + convBonus + portBonus + sohBonus;
    
    return {
      bc: product.bcRetail,
      sc: product.scRetail,
      baseRetail: basisRetail,
      portabilityBonus: portBonus,
      convergenceBonus: convBonus,
      totalRetail: totaalRetail,
      asp: totaalAsp,
      fidelityMonthly: product.fidelityPerMaand,
    };
  } else {
    // Legacy API
    const product = productOrId;
    const positie = positieOrOptions as 'BC' | 'SC' | 'EC' | 'PC' | 'MC' | 'NMC' | 'PMC';
    
    let basisRetail = positie === 'BC' ? product.bcRetail : product.scRetail;
    let totaalAsp = product.aspBasis;
    
    let convBonus = 0;
    let portBonus = 0;
    let sohBonus = 0;
    
    if (isConvergentie && product.convergentieBonus > 0) {
      convBonus = product.convergentieBonus;
    }
    
    if (isPortabiliteit && product.heeftPortabiliteit) {
      const interneOperators = ['orange', 'hey', 'zuny', 'voo'];
      if (komtVanOperator && !interneOperators.includes(komtVanOperator.toLowerCase())) {
        portBonus = product.portabilityBonus;
      }
    }
    
    if (isSoHo && product.heeftSoHo) {
      sohBonus = product.sohoBonus;
      totaalAsp += product.sohoAspExtra;
    }
    
    const totaalRetail = basisRetail + convBonus + portBonus + sohBonus;
    
    return {
      basisRetail,
      convergentieBonus: convBonus,
      portabilityBonus: portBonus,
      sohoBonus: sohBonus,
      totaalRetail,
      aspTotaal: totaalAsp,
    };
  }
}
