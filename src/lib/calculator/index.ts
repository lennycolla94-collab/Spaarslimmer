// src/lib/calculator/index.ts
// Hoofd calculator module - combineert alle catalogi

// Re-export alles uit de mobile catalog
export {
  MOBILE_CATALOG,
  getMobileProduct,
  calculateMobileRetail,
  type MobileProduct,
} from './catalogs/mobile-catalog';

// Position bonuses (SmartSN structuur)
export const POSITION_BONUSES: Record<string, number> = {
  BC: 0,
  SC: 5,
  EC: 10,
  PC: 20,
  MC: 40,
  NMC: 60,
  PMC: 80,
};

// Types
export interface CommissionCalculation {
  // Product info
  productNaam: string;
  positie: string;
  
  // Retail breakdown
  basisRetail: number;
  convergentieBonus: number;
  portabilityBonus: number;
  sohoBonus: number;
  totaalRetail: number;
  
  // ASP
  aspTotaal: number;
  
  // Commission
  positieBonus: number;
  totaalCommissie: number;
  
  // Fidelity
  fidelityPerMaand: number;
  fidelity6Maanden: number;
  fidelity24Maanden: number;
}

export interface CalculationInput {
  productType: 'mobile' | 'internet' | 'energie' | 'tv' | 'boiler';
  tariefplan: string;
  positie: 'BC' | 'SC' | 'EC' | 'PC' | 'MC' | 'NMC' | 'PMC';
  isConvergentie: boolean;
  isPortabiliteit: boolean;
  isSoHo: boolean;
  komtVanOperator: string;
}

// Import hier om circular dependencies te voorkomen
import { 
  getMobileProduct, 
  calculateMobileRetail,
  type MobileProduct 
} from './catalogs/mobile-catalog';

// Hoofd calculate functie
export function calculateCommission(
  input: CalculationInput
): CommissionCalculation {
  const { 
    productType, 
    tariefplan, 
    positie, 
    isConvergentie, 
    isPortabiliteit, 
    isSoHo,
    komtVanOperator 
  } = input;

  let product: MobileProduct | undefined;
  let retailResult: any;

  // Haal product op basis van type
  switch (productType) {
    case 'mobile':
      product = getMobileProduct(tariefplan);
      if (!product) {
        throw new Error(`Onbekend mobile product: ${tariefplan}`);
      }
      retailResult = calculateMobileRetail(
        product, 
        positie, 
        isConvergentie, 
        isPortabiliteit, 
        isSoHo,
        komtVanOperator
      );
      break;
    
    // TODO: Voeg andere product types toe
    default:
      throw new Error(`Product type ${productType} nog niet geïmplementeerd`);
  }

  // Bereken totale commissie
  const positieBonus = POSITION_BONUSES[positie] || 0;
  const totaalCommissie = retailResult.totaalRetail + positieBonus;

  // Fidelity berekening
  const fidelity6Maanden = product.fidelityPerMaand * 6;
  const fidelity24Maanden = product.fidelityPerMaand * 24;

  return {
    productNaam: product.naam,
    positie,
    basisRetail: retailResult.basisRetail,
    convergentieBonus: retailResult.convergentieBonus,
    portabilityBonus: retailResult.portabilityBonus,
    sohoBonus: retailResult.sohoBonus,
    totaalRetail: retailResult.totaalRetail,
    aspTotaal: retailResult.aspTotaal,
    positieBonus,
    totaalCommissie,
    fidelityPerMaand: product.fidelityPerMaand,
    fidelity6Maanden,
    fidelity24Maanden,
  };
}

// Legacy support - oude calculateCommission interface
export function calculateCommissionLegacy(
  serviceType: string,
  plan: string,
  position: string,
  isPortability?: boolean,
  isConvergence?: boolean,
  isSoHo?: boolean
) {
  // Map oude interface naar nieuwe
  const input: CalculationInput = {
    productType: serviceType as any,
    tariefplan: plan,
    positie: position as any,
    isConvergentie: isConvergence || false,
    isPortabiliteit: isPortability || false,
    isSoHo: isSoHo || false,
    komtVanOperator: 'onbekend',
  };

  try {
    return calculateCommission(input);
  } catch (e) {
    // Fallback naar oude berekening
    return {
      totaalCommissie: 0,
      error: e instanceof Error ? e.message : 'Berekening mislukt'
    };
  }
}
