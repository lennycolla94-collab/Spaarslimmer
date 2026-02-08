// Position bonuses (in euros)
export const BONUSES = {
  BC: 0,
  SC: 5,
  EC: 10,
  PC: 20,
  MC: 40,
  NMC: 60,
  PMC: 80,
} as const;

// Retail rates per service type
export const RETAIL_RATES = {
  mobile: {
    child: { bc: 15, sc: 12 },
    small: { bc: 25, sc: 20 },
    medium: { bc: 35, sc: 28 },
    large: { bc: 45, sc: 36 },
    unlimited: { bc: 55, sc: 44 },
  },
  internet: {
    small: { bc: 30, sc: 24 },
    medium: { bc: 45, sc: 36 },
    large: { bc: 60, sc: 48 },
  },
  energie: {
    small: { bc: 20, sc: 16 },
    medium: { bc: 35, sc: 28 },
    large: { bc: 50, sc: 40 },
  },
  tv: {
    small: { bc: 25, sc: 20 },
    medium: { bc: 40, sc: 32 },
    large: { bc: 55, sc: 44 },
  },
  ketel: {
    small: { bc: 40, sc: 32 },
    medium: { bc: 65, sc: 52 },
    large: { bc: 90, sc: 72 },
  },
} as const;

export type Position = keyof typeof BONUSES;
export type ServiceType = keyof typeof RETAIL_RATES;
export type Plan = 'child' | 'small' | 'medium' | 'large' | 'unlimited';

export interface CommissionInput {
  serviceType: ServiceType;
  plan: Plan;
  position: Position;
  isPortability?: boolean;
  isConvergence?: boolean;
  isSoHo?: boolean;
}

export interface CommissionResult {
  bcRetail: number;
  scRetail: number;
  bonus: number;
  totalCommission: number;
}

export function calculateCommission(input: CommissionInput): CommissionResult {
  const { serviceType, plan, position, isPortability, isConvergence, isSoHo } = input;
  
  // Get base retail rates
  const rates = RETAIL_RATES[serviceType];
  if (!rates || !rates[plan as keyof typeof rates]) {
    throw new Error(`Invalid service type or plan: ${serviceType} / ${plan}`);
  }
  
  const planRates = rates[plan as keyof typeof rates] as { bc: number; sc: number };
  
  let bcRetail = planRates.bc;
  let scRetail = planRates.sc;
  
  // Apply portability bonus (+€10 on BC retail)
  if (isPortability) {
    bcRetail += 10;
  }
  
  // Apply convergence bonus (+€5 on BC retail)
  if (isConvergence) {
    bcRetail += 5;
  }
  
  // Apply SoHo multiplier (1.5x for business customers)
  if (isSoHo) {
    bcRetail *= 1.5;
    scRetail *= 1.5;
  }
  
  // Get position bonus
  const bonus = BONUSES[position] || 0;
  
  // Calculate total commission
  const totalCommission = bcRetail + scRetail + bonus;
  
  return {
    bcRetail: Math.round(bcRetail * 100) / 100,
    scRetail: Math.round(scRetail * 100) / 100,
    bonus,
    totalCommission: Math.round(totalCommission * 100) / 100,
  };
}
