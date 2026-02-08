/**
 * ENERGIE CATALOG - Madelijn Compliant (Eneco)
 * Location: src/features/calculator/catalogs/energie-catalog.ts
 * 
 * Uitbetaling structuur (wat jullie krijgen):
 * - Residentieel Home+: BC €20, SC €25, ASP 0.5, Fidelity €0.35/maand
 * - SoHo Home+: BC €40, SC €45, ASP 1, Fidelity €0.35/maand  
 * - Ketelonderhoud: BC €20, SC €25, ASP 0.5, GEEN fidelity
 * 
 * Bonussen (eenmalig, per klant):
 * - eBilling: +€5 BC (eenmalig)
 * - Domiciliëring: +€5 BC (eenmalig)
 */

export interface EnergieProduct {
  id: string;
  name: string;
  type: 'RESIDENTIAL' | 'SOHO' | 'KETEL';
  bcValue: number; // Base Commission
  scValue: number; // Service Commission
  aspValue: number;
  fidelityMonthly: number;
  hasFidelity: boolean;
  bonuses: {
    eBilling: number; // Eenmalig
    domiciliering: number; // Eenmalig
  };
}

export const energieCatalog: Record<string, EnergieProduct> = {
  // RESIDENTIEEL
  ENECO_RESIDENTIEEL_HOME: {
    id: 'ENECO_RESIDENTIEEL_HOME',
    name: 'Residentiële energiedienst Home+',
    type: 'RESIDENTIAL',
    bcValue: 20,
    scValue: 25,
    aspValue: 0.5,
    fidelityMonthly: 0.35,
    hasFidelity: true,
    bonuses: {
      eBilling: 5,
      domiciliering: 5,
    },
  },
  
  // SOHO (higher values)
  ENECO_SOHO_HOME: {
    id: 'ENECO_SOHO_HOME',
    name: 'SoHo energiedienst Home+',
    type: 'SOHO',
    bcValue: 40,
    scValue: 45,
    aspValue: 1,
    fidelityMonthly: 0.35,
    hasFidelity: true,
    bonuses: {
      eBilling: 5,
      domiciliering: 5,
    },
  },
  
  // KETELONDERHOUD (geen fidelity!)
  KETELONDERHOUD: {
    id: 'KETELONDERHOUD',
    name: 'Ketelonderhoud',
    type: 'KETEL',
    bcValue: 20,
    scValue: 25,
    aspValue: 0.5,
    fidelityMonthly: 0,
    hasFidelity: false,
    bonuses: {
      eBilling: 0, // Niet van toepassing?
      domiciliering: 0, // Niet van toepassing?
    },
  },
} as const;

// Helper functies
export function getEnergieProduct(id: string): EnergieProduct | undefined {
  return energieCatalog[id];
}

export function calculateEnergieRetail(
  productId: string,
  options: {
    hasEBilling: boolean; // Klant kiest voor eBilling?
    hasDomiciliering: boolean; // Klant kiest voor domiciliëring?
  }
): {
  bc: number;
  sc: number;
  baseRetail: number; // BC + SC
  bonusTotal: number; // eBilling + Domiciliëring
  totalFirstPayout: number; // Alles bij elkaar (eenmalig)
  asp: number;
  fidelityMonthly: number;
} {
  const product = getEnergieProduct(productId);
  if (!product) throw new Error(`Product ${productId} niet gevonden`);
  
  const eBillingBonus = options.hasEBilling ? product.bonuses.eBilling : 0;
  const domicilieringBonus = options.hasDomiciliering ? product.bonuses.domiciliering : 0;
  const bonusTotal = eBillingBonus + domicilieringBonus;
  
  const baseRetail = product.bcValue + product.scValue;

  return {
    bc: product.bcValue,
    sc: product.scValue,
    baseRetail, // 45 (20+25) of 85 (40+45)
    bonusTotal, // 0, 5, of 10
    totalFirstPayout: baseRetail + bonusTotal,
    asp: product.aspValue,
    fidelityMonthly: product.hasFidelity ? product.fidelityMonthly : 0,
  };
}

// Clawback check (voor upline engine)
export function getClawbackRisk(
  productId: string,
  monthsActive: number
): {
  percentageAtRisk: number; // Hoeveel moet terugbetaald?
  status: 'HIGH' | 'MEDIUM' | 'LOW';
} {
  // Na 1 maand: 25% behouden (dus 75% terug?)
  // Na 6 maanden: 75% behouden (dus 25% terug?)
  // Anders: alles terug?
  
  if (monthsActive >= 6) {
    return { percentageAtRisk: 25, status: 'LOW' }; // 75% veilig, 25% clawback
  } else if (monthsActive >= 1) {
    return { percentageAtRisk: 75, status: 'MEDIUM' }; // 25% veilig, 75% clawback
  } else {
    return { percentageAtRisk: 100, status: 'HIGH' }; // Alles terug
  }
}

// Export types
export type EnergieCatalog = typeof energieCatalog;
