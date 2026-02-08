/**
 * UPLINE ENGINE - MLM Commission Distribution
 * Location: src/features/calculator/modules/upline-engine.ts
 * 
 * Regels (Madelijn):
 * - Niveaus: 1-7 met percentages: 10%, 5%, 5%, 3%, 2%, 1%, 1%
 * - Basis: ALLEEN retail (BC+SC), ZONDER portability bonus!
 * - Fidelity: Upline krijgt ook % van fidelity (maandelijks)
 * - Clawback: Pro-rata terugvordering voor hele upline
 */

export interface UplineMember {
  userId: string;
  level: number; // 1-7
  name?: string;
}

export interface CalculationInput {
  baseRetail: number; // BC + SC (zonder portability/convergence!)
  fidelityMonthly: number;
  portabilityBonus: number; // Alleen voor consultant zelf, niet upline
  convergenceBonus: number; // Alleen voor consultant zelf
  aspValue: number; // Alleen voor consultant zelf
}

export interface UplinePayout {
  userId: string;
  level: number;
  percentage: number;
  retailAmount: number;
  fidelityAmount: number;
  totalAmount: number;
  clawbackRisk: {
    atRisk: number;
    potentialLoss: number;
  };
}

// Percentages per niveau (1-7)
const UPLINE_PERCENTAGES: Record<number, number> = {
  1: 0.10, // 10%
  2: 0.05, // 5%
  3: 0.05, // 5%
  4: 0.03, // 3%
  5: 0.02, // 2%
  6: 0.01, // 1%
  7: 0.01, // 1%
};

/**
 * Bereken upline payouts
 * @param calculation - De retail berekening (zonder portability voor upline!)
 * @param upline - Array van upline members (max 7 niveaus)
 * @param monthsActive - Hoe lang klant al actief (voor clawback)
 */
export function calculateUpline(
  calculation: CalculationInput,
  upline: UplineMember[],
  monthsActive: number = 0
): {
  payouts: UplinePayout[];
  totalUplineCost: number;
  consultantNet: number;
} {
  // Filter alleen niveau 1-7 en sorteer op level
  const validUpline = upline
    .filter(m => m.level >= 1 && m.level <= 7)
    .sort((a, b) => a.level - b.level);

  const payouts: UplinePayout[] = [];
  let totalUplineCost = 0;

  // Bereken clawback status
  const clawbackPercentage = getClawbackPercentage(monthsActive);

  for (const member of validUpline) {
    const percentage = UPLINE_PERCENTAGES[member.level] || 0;
    
    // ALLEEN baseRetail (BC+SC), GEEN portability/convergence!
    const retailAmount = calculation.baseRetail * percentage;
    
    // Fidelity: ook percentage naar upline
    const fidelityAmount = calculation.fidelityMonthly * percentage;
    
    const totalAmount = retailAmount + fidelityAmount;
    totalUplineCost += totalAmount;

    // Clawback berekening (pro-rata)
    const atRisk = clawbackPercentage > 0 ? clawbackPercentage : 0;
    const potentialLoss = totalAmount * (atRisk / 100);

    payouts.push({
      userId: member.userId,
      level: member.level,
      percentage: percentage * 100,
      retailAmount: Math.round(retailAmount * 100) / 100,
      fidelityAmount: Math.round(fidelityAmount * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
      clawbackRisk: {
        atRisk,
        potentialLoss: Math.round(potentialLoss * 100) / 100,
      },
    });
  }

  // Consultant houdt: alles - upline kosten
  const totalEarnings = calculation.baseRetail + 
                       calculation.portabilityBonus + 
                       calculation.convergenceBonus +
                       calculation.fidelityMonthly;
  
  const consultantNet = totalEarnings - totalUplineCost;

  return {
    payouts,
    totalUplineCost: Math.round(totalUplineCost * 100) / 100,
    consultantNet: Math.round(consultantNet * 100) / 100,
  };
}

/**
 * Clawback logic: hoeveel procent is "at risk"
 * Gebaseerd op hoe lang klant al actief is
 */
function getClawbackPercentage(monthsActive: number): number {
  if (monthsActive >= 6) return 25;     // 25% terugvordering risico
  if (monthsActive >= 1) return 75;     // 75% terugvordering risico  
  return 100;                            // 100% terugvordering (nog geen uitbetaling!)
}

/**
 * Bepaal of uitbetaling veilig is
 */
export function isPayoutSafe(monthsActive: number): boolean {
  return monthsActive >= 6; // Pas na 6 maanden 100% veilig
}

/**
 * Bereken terugvordering bij annulering
 * Wordt gebruikt als klant binnen X maanden weggaat
 */
export function calculateClawback(
  originalPayout: number,
  monthsActive: number
): {
  amountToRecover: number;
  amountToKeep: number;
  reason: string;
} {
  if (monthsActive >= 6) {
    return {
      amountToRecover: originalPayout * 0.25, // 25% terug
      amountToKeep: originalPayout * 0.75,    // 75% behouden
      reason: 'Na 6 maanden: 25% terugvordering',
    };
  } else if (monthsActive >= 1) {
    return {
      amountToRecover: originalPayout * 0.75, // 75% terug
      amountToKeep: originalPayout * 0.25,    // 25% behouden
      reason: 'Na 1 maand: 75% terugvordering',
    };
  } else {
    return {
      amountToRecover: originalPayout,        // 100% terug
      amountToKeep: 0,
      reason: 'Binnen 1 maand: 100% terugvordering',
    };
  }
}

// Voorbeeld gebruik:
// const result = calculateUpline(
//   { baseRetail: 35, fidelityMonthly: 0.35, portabilityBonus: 12, convergenceBonus: 15, aspValue: 1 },
//   [{ userId: 'u1', level: 1 }, { userId: 'u2', level: 2 }],
//   3 // 3 maanden actief
// );
