/**
 * RETAIL ORCHESTRATOR - Main Calculator Entry Point
 * Location: src/features/calculator/index.ts
 * 
 * Flow: Validators → Catalog Selector → Calculator → Upline → Clawback Check
 * Output: Totaal per consultant (retail, fidelity, ASP, upline netto)
 */

import { calculateUpline, UplineMember, CalculationInput } from './modules/upline-engine';
import { getMobileProduct, calculateMobileRetail } from './catalogs/mobile-catalog';
import { getInternetProduct, calculateInternetRetail } from './catalogs/internet-catalog';
import { getEnergieProduct, calculateEnergieRetail } from './catalogs/energie-catalog';

// ===== TYPES =====

export type ProductType = 'MOBILE' | 'INTERNET' | 'ENERGIE';

export interface CalculatorInput {
  productType: ProductType;
  productId: string;
  consultantId: string;
  upline: UplineMember[];
  options: {
    // Mobile options
    isNewCustomer?: boolean;
    isPortability?: boolean;
    isConvergence?: boolean;
    isSoHo?: boolean;
    
    // Internet options
    hasConvergence?: boolean;
    
    // Energie options
    hasEBilling?: boolean;
    hasDomiciliering?: boolean;
    
    // Universal
    monthsActive?: number; // Voor clawback check
  };
  validation: {
    isInternalMigration: boolean; // HEY!/VOO/Zuny/Orange intern
    isWithin3Months: boolean;     // Klant terug binnen 3 maanden
    hasActiveService: boolean;    // Alactieve dienst check
  };
}

export interface CalculatorResult {
  success: boolean;
  error?: string;
  consultant: {
    id: string;
    baseRetail: number;
    portabilityBonus: number;
    convergenceBonus: number;
    bonusesTotal: number;
    aspValue: number;
    fidelityMonthly: number;
    grossTotal: number;      // Voor upline aftrek
    uplineCost: number;      // Wat naar upline gaat
    netTotal: number;        // Consultant houdt dit
  };
  upline: {
    payouts: Array<{
      userId: string;
      level: number;
      percentage: number;
      amount: number;
    }>;
    totalCost: number;
  };
  clawback: {
    status: 'SAFE' | 'MEDIUM_RISK' | 'HIGH_RISK';
    atRiskPercentage: number;
    potentialLoss: number;
  };
  breakdown: {
    bc: number;
    sc: number;
    productName: string;
    exclusions: string[];    // Waarom geen retail (indien van toepassing)
  };
}

// ===== VALIDATORS =====

function validateSale(input: CalculatorInput): { valid: boolean; reason?: string } {
  const { validation, productType, options } = input;
  
  // Regel 1: Geen retail bij interne migraties
  if (validation.isInternalMigration) {
    return { 
      valid: false, 
      reason: 'Interne migratie: GEEN retail (HEY!/VOO/Zuny/Orange intern)' 
    };
  }
  
  // Regel 2: Geen retail als klant terug binnen 3 maanden
  if (validation.isWithin3Months) {
    return { 
      valid: false, 
      reason: 'Klant terug binnen 3 maanden: GEEN retail' 
    };
  }
  
  // Regel 3: Geen retail bij tariefwijziging bestaande klant (alleen Mobile)
  if (productType === 'MOBILE' && !options.isNewCustomer && !validation.hasActiveService) {
    return { 
      valid: false, 
      reason: 'Tariefwijziging bestaande klant: GEEN retail' 
    };
  }
  
  return { valid: true };
}

// ===== MAIN ORCHESTRATOR =====

export function calculateRetail(input: CalculatorInput): CalculatorResult {
  // Stap 1: Validatie
  const validation = validateSale(input);
  
  if (!validation.valid) {
    return {
      success: false,
      error: validation.reason,
      consultant: {
        id: input.consultantId,
        baseRetail: 0,
        portabilityBonus: 0,
        convergenceBonus: 0,
        bonusesTotal: 0,
        aspValue: 0,
        fidelityMonthly: 0,
        grossTotal: 0,
        uplineCost: 0,
        netTotal: 0,
      },
      upline: { payouts: [], totalCost: 0 },
      clawback: { status: 'HIGH_RISK', atRiskPercentage: 100, potentialLoss: 0 },
      breakdown: { bc: 0, sc: 0, productName: '', exclusions: [validation.reason!] },
    };
  }
  
  // Stap 2: Product ophalen en berekenen
  let calcResult: {
    bc: number;
    sc: number;
    baseRetail: number;
    portabilityBonus: number;
    convergenceBonus: number;
    totalWithBonuses: number;
    asp: number;
    fidelityMonthly: number;
    productName: string;
  };
  
  switch (input.productType) {
    case 'MOBILE': {
      const product = getMobileProduct(input.productId);
      if (!product) throw new Error(`Mobile product ${input.productId} niet gevonden`);
      
      const result = calculateMobileRetail(input.productId, {
        isPortable: input.options.isPortability || false,
        isConvergence: input.options.isConvergence || false,
        isSoHo: input.options.isSoHo || false,
      });
      
      calcResult = {
        bc: result.bc,
        sc: result.sc,
        baseRetail: result.baseRetail,
        portabilityBonus: result.portabilityBonus,
        convergenceBonus: result.convergenceBonus,
        totalWithBonuses: result.totalRetail,
        asp: result.asp,
        fidelityMonthly: result.fidelityMonthly,
        productName: product.naam,
      };
      break;
    }
      
    case 'INTERNET': {
      const product = getInternetProduct(input.productId);
      if (!product) throw new Error(`Internet product ${input.productId} niet gevonden`);
      
      const result = calculateInternetRetail(input.productId, {
        isPortable: input.options.isPortability || false,
        hasConvergence: input.options.hasConvergence || false,
        isSoHo: input.options.isSoHo || false,
      });
      
      calcResult = {
        bc: result.bc,
        sc: result.sc,
        baseRetail: result.baseRetail,
        portabilityBonus: result.portabilityBonus,
        convergenceBonus: result.convergenceBonus,
        totalWithBonuses: result.totalRetail,
        asp: result.asp,
        fidelityMonthly: result.fidelityMonthly,
        productName: product.name,
      };
      break;
    }
      
    case 'ENERGIE': {
      const product = getEnergieProduct(input.productId);
      if (!product) throw new Error(`Energie product ${input.productId} niet gevonden`);
      
      const result = calculateEnergieRetail(input.productId, {
        hasEBilling: input.options.hasEBilling || false,
        hasDomiciliering: input.options.hasDomiciliering || false,
      });
      
      calcResult = {
        bc: result.bc,
        sc: result.sc,
        baseRetail: result.baseRetail,
        portabilityBonus: 0, // Energie heeft geen portability
        convergenceBonus: 0, // Energie heeft geen convergence
        totalWithBonuses: result.totalFirstPayout,
        asp: result.asp,
        fidelityMonthly: result.fidelityMonthly,
        productName: product.name,
      };
      break;
    }
      
    default:
      throw new Error(`Onbekend product type: ${input.productType}`);
  }
  
  // Stap 3: Upline berekenen (alleen op baseRetail, zonder portability/convergence!)
  const monthsActive = input.options.monthsActive || 0;
  const uplineInput: CalculationInput = {
    baseRetail: calcResult.baseRetail,
    fidelityMonthly: calcResult.fidelityMonthly,
    portabilityBonus: calcResult.portabilityBonus,
    convergenceBonus: calcResult.convergenceBonus,
    aspValue: calcResult.asp,
  };
  
  const uplineResult = calculateUpline(uplineInput, input.upline, monthsActive);
  
  // Stap 4: Clawback bepalen
  const isSafe = monthsActive >= 6;
  const isMedium = monthsActive >= 1 && monthsActive < 6;
  const clawbackStatus = isSafe ? 'SAFE' : isMedium ? 'MEDIUM_RISK' : 'HIGH_RISK';
  const atRiskPercentage = isSafe ? 0 : isMedium ? 75 : 100;
  const potentialLoss = uplineResult.consultantNet * (atRiskPercentage / 100);
  
  // Stap 5: Resultaat samenstellen
  return {
    success: true,
    consultant: {
      id: input.consultantId,
      baseRetail: calcResult.baseRetail,
      portabilityBonus: calcResult.portabilityBonus,
      convergenceBonus: calcResult.convergenceBonus,
      bonusesTotal: calcResult.portabilityBonus + calcResult.convergenceBonus,
      aspValue: calcResult.asp,
      fidelityMonthly: calcResult.fidelityMonthly,
      grossTotal: uplineResult.consultantNet + uplineResult.totalUplineCost,
      uplineCost: uplineResult.totalUplineCost,
      netTotal: uplineResult.consultantNet,
    },
    upline: {
      payouts: uplineResult.payouts.map(p => ({
        userId: p.userId,
        level: p.level,
        percentage: p.percentage,
        amount: p.totalAmount,
      })),
      totalCost: uplineResult.totalUplineCost,
    },
    clawback: {
      status: clawbackStatus,
      atRiskPercentage,
      potentialLoss: Math.round(potentialLoss * 100) / 100,
    },
    breakdown: {
      bc: calcResult.bc,
      sc: calcResult.sc,
      productName: calcResult.productName,
      exclusions: [],
    },
  };
}

// ===== EXPORTS =====
export * from './catalogs/mobile-catalog';
export * from './catalogs/internet-catalog';
export * from './catalogs/energie-catalog';
export * from './modules/upline-engine';
