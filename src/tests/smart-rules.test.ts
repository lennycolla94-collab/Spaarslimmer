/**
 * Smart Rules Validation Tests
 * Alle berekeningen getest tegen Smartplan/Madelijn documenten
 */

import {
  calculateRetailCommission,
  calculateProductCommission,
  calculateASP,
  calculatePersonalFidelity,
  calculateClawback,
  calculateRetention,
  calculateTotalCommission,
  calculateCompleteDeal,
  checkPQS,
  checkQuarterlyQualification,
  calculateIncentivePoints,
  calculateInfinityBonus,
  calculatePQSBonus,
  formatEuro,
  type ServiceItem,
} from '../lib/calculator';
import {
  CONSULTANT_RANK,
  PRODUCT_TYPE,
  PQS_REQUIREMENTS,
  CLAWBACK_RATES,
  RETENTION_RATES,
} from '../lib/constants';
import { calculateTariff, type TariffInput } from '../lib/tariff-engine';

describe('🏆 SMART RULES VALIDATION', () => {
  
  // ============================================================================
  // 1. RETAIL COMMISSION TESTS (Smartplan Basis)
  // ============================================================================
  describe('💰 Retail Commissions', () => {
    it('Internet: BC = €15, SC+ = €20', () => {
      expect(calculateRetailCommission(PRODUCT_TYPE.INTERNET, CONSULTANT_RANK.BC)).toBe(1500);
      expect(calculateRetailCommission(PRODUCT_TYPE.INTERNET, CONSULTANT_RANK.SC)).toBe(2000);
      expect(calculateRetailCommission(PRODUCT_TYPE.INTERNET, CONSULTANT_RANK.Y)).toBe(2000);
      expect(calculateRetailCommission(PRODUCT_TYPE.INTERNET, CONSULTANT_RANK.PMC)).toBe(2000);
    });

    it('Mobile Medium: BC = €35, SC+ = €40', () => {
      expect(calculateRetailCommission(PRODUCT_TYPE.MOBILE_MEDIUM, CONSULTANT_RANK.BC)).toBe(3500);
      expect(calculateRetailCommission(PRODUCT_TYPE.MOBILE_MEDIUM, CONSULTANT_RANK.SC)).toBe(4000);
    });

    it('Mobile Large: BC = €50, SC+ = €55', () => {
      expect(calculateRetailCommission(PRODUCT_TYPE.MOBILE_LARGE, CONSULTANT_RANK.BC)).toBe(5000);
      expect(calculateRetailCommission(PRODUCT_TYPE.MOBILE_LARGE, CONSULTANT_RANK.SC)).toBe(5500);
    });

    it('Mobile Unlimited: BC = €60, SC+ = €65', () => {
      expect(calculateRetailCommission(PRODUCT_TYPE.MOBILE_UNLIMITED, CONSULTANT_RANK.BC)).toBe(6000);
      expect(calculateRetailCommission(PRODUCT_TYPE.MOBILE_UNLIMITED, CONSULTANT_RANK.SC)).toBe(6500);
    });

    it('Energie Residentieel: BC = €20, SC+ = €25', () => {
      expect(calculateRetailCommission(PRODUCT_TYPE.ENERGIE_RESIDENTIEEL, CONSULTANT_RANK.BC)).toBe(2000);
      expect(calculateRetailCommission(PRODUCT_TYPE.ENERGIE_RESIDENTIEEL, CONSULTANT_RANK.SC)).toBe(2500);
    });

    it('Energie SoHo: BC = €40, SC+ = €45', () => {
      expect(calculateRetailCommission(PRODUCT_TYPE.ENERGIE_SOHO, CONSULTANT_RANK.BC)).toBe(4000);
      expect(calculateRetailCommission(PRODUCT_TYPE.ENERGIE_SOHO, CONSULTANT_RANK.SC)).toBe(4500);
    });
  });

  // ============================================================================
  // 2. BONUS TESTS (Smartplan Bonussen)
  // ============================================================================
  describe('🎁 Bonussen', () => {
    it('Convergence: +€12 voor Medium+ Mobile, +€15 voor Internet', () => {
      const mobile = calculateProductCommission(
        PRODUCT_TYPE.MOBILE_MEDIUM,
        CONSULTANT_RANK.BC,
        { hasConvergence: true }
      );
      expect(mobile.convergenceBonus).toBe(1200);

      const internet = calculateProductCommission(
        PRODUCT_TYPE.INTERNET,
        CONSULTANT_RANK.BC,
        { hasConvergence: true }
      );
      expect(internet.convergenceBonus).toBe(1500);
    });

    it('Portability: +€20 voor Medium+ Mobile, +€12 voor Internet', () => {
      const mobile = calculateProductCommission(
        PRODUCT_TYPE.MOBILE_MEDIUM,
        CONSULTANT_RANK.BC,
        { hasPortability: true }
      );
      expect(mobile.portabilityBonus).toBe(2000);

      const internet = calculateProductCommission(
        PRODUCT_TYPE.INTERNET,
        CONSULTANT_RANK.BC,
        { hasPortability: true }
      );
      expect(internet.portabilityBonus).toBe(1200);
    });

    it('SoHo: +€15 voor Medium+ Mobile met BTW nummer', () => {
      const mobile = calculateProductCommission(
        PRODUCT_TYPE.MOBILE_MEDIUM,
        CONSULTANT_RANK.BC,
        { isSoHo: true }
      );
      expect(mobile.soHoBonus).toBe(1500);
    });

    it('Easy Switch: +€12 voor Internet (telt als portability)', () => {
      const internet = calculateProductCommission(
        PRODUCT_TYPE.INTERNET,
        CONSULTANT_RANK.BC,
        { hasEasySwitch: true }
      );
      expect(internet.portabilityBonus).toBe(1200);
    });

    it('Child/Small plans: GEEN portability/convergence bonus', () => {
      const small = calculateProductCommission(
        PRODUCT_TYPE.MOBILE_SMALL,
        CONSULTANT_RANK.BC,
        { hasPortability: true, hasConvergence: true }
      );
      expect(small.portabilityBonus).toBe(0);
      expect(small.convergenceBonus).toBe(0);
    });

    it('Energie add-ons: +€5 eBilling, +€5 domiciliering', () => {
      const energie = calculateProductCommission(
        PRODUCT_TYPE.ENERGIE_RESIDENTIEEL,
        CONSULTANT_RANK.BC,
        { hasEbilling: true, hasDomiciliering: true }
      );
      expect(energie.addOnBonus).toBe(1000);
    });
  });

  // ============================================================================
  // 3. ASP TESTS (Active Smart Points)
  // ============================================================================
  describe('📊 ASP (Active Smart Points)', () => {
    it('Mobile Child = 0 ASP', () => {
      const asp = calculateASP(PRODUCT_TYPE.MOBILE_CHILD);
      expect(asp.baseASP).toBe(0);
    });

    it('Mobile Small/Medium/Large/Unlimited = 1 ASP', () => {
      expect(calculateASP(PRODUCT_TYPE.MOBILE_SMALL).baseASP).toBe(1);
      expect(calculateASP(PRODUCT_TYPE.MOBILE_MEDIUM).baseASP).toBe(1);
      expect(calculateASP(PRODUCT_TYPE.MOBILE_LARGE).baseASP).toBe(1);
      expect(calculateASP(PRODUCT_TYPE.MOBILE_UNLIMITED).baseASP).toBe(1);
    });

    it('Internet, TV = 1 ASP', () => {
      expect(calculateASP(PRODUCT_TYPE.INTERNET).baseASP).toBe(1);
      expect(calculateASP(PRODUCT_TYPE.ORANGE_TV).baseASP).toBe(1);
    });

    it('Energie Residentieel = 0.5 ASP, SoHo = 1 ASP', () => {
      expect(calculateASP(PRODUCT_TYPE.ENERGIE_RESIDENTIEEL).baseASP).toBe(0.5);
      expect(calculateASP(PRODUCT_TYPE.ENERGIE_SOHO).baseASP).toBe(1);
    });

    it('Extra ASP: +0.5 voor SoHo Medium+', () => {
      const asp = calculateASP(PRODUCT_TYPE.MOBILE_MEDIUM, { isSoHo: true });
      expect(asp.extraASP).toBe(0.5);
      expect(asp.total).toBe(1.5);
    });

    it('Extra ASP: +0.5 voor Internet Easy Switch', () => {
      const asp = calculateASP(PRODUCT_TYPE.INTERNET, { hasEasySwitch: true });
      expect(asp.extraASP).toBe(0.5);
      expect(asp.total).toBe(1.5);
    });
  });

  // ============================================================================
  // 4. PQS TESTS (Personal Quick Start)
  // ============================================================================
  describe('🚀 PQS (Personal Quick Start)', () => {
    it('Vereisten: 12 ASP total, 7 Mobile, 3 Energie, 2 Internet', () => {
      const services: ServiceItem[] = [
        { productType: PRODUCT_TYPE.MOBILE_MEDIUM, options: {} }, // 1 ASP
        { productType: PRODUCT_TYPE.MOBILE_LARGE, options: {} },  // 1 ASP
        { productType: PRODUCT_TYPE.MOBILE_UNLIMITED, options: {} }, // 1 ASP
        { productType: PRODUCT_TYPE.MOBILE_MEDIUM, options: {} }, // 1 ASP
        { productType: PRODUCT_TYPE.MOBILE_MEDIUM, options: {} }, // 1 ASP
        { productType: PRODUCT_TYPE.MOBILE_MEDIUM, options: {} }, // 1 ASP
        { productType: PRODUCT_TYPE.MOBILE_MEDIUM, options: {} }, // 1 ASP = 7 Mobile
        { productType: PRODUCT_TYPE.ENERGIE_SOHO, options: {} },  // 1 ASP
        { productType: PRODUCT_TYPE.ENERGIE_SOHO, options: {} },  // 1 ASP
        { productType: PRODUCT_TYPE.ENERGIE_SOHO, options: {} },  // 1 ASP = 3 Energie
        { productType: PRODUCT_TYPE.INTERNET, options: {} },      // 1 ASP
        { productType: PRODUCT_TYPE.INTERNET, options: {} },      // 1 ASP = 2 Internet
      ];
      
      const pqs = checkPQS(services);
      expect(pqs.achieved).toBe(true);
      expect(pqs.totalASP).toBe(12);
      expect(pqs.mobileASP).toBe(7);
      expect(pqs.energieASP).toBe(3);
      expect(pqs.internetASP).toBe(2);
    });

    it('PQS NIET behaald als niet alle requirements', () => {
      const services: ServiceItem[] = [
        { productType: PRODUCT_TYPE.MOBILE_MEDIUM, options: {} },
        { productType: PRODUCT_TYPE.INTERNET, options: {} },
      ];
      
      const pqs = checkPQS(services);
      expect(pqs.achieved).toBe(false);
      expect(pqs.missing.length).toBeGreaterThan(0);
    });

    it('PQS Bonus: €150 voor consultant, €150 voor sponsor (QS1)', () => {
      const bonus = calculatePQSBonus(true);
      expect(bonus.consultantBonus).toBe(15000); // €150
      expect(bonus.sponsorBonus).toBe(15000);    // €150
    });
  });

  // ============================================================================
  // 5. FIDELITY TESTS
  // ============================================================================
  describe('💎 Fidelity (Maandelijkse doorbetaling)', () => {
    it('Mobile Medium: N0 = €1.00/maand', () => {
      const fidelity = calculatePersonalFidelity(PRODUCT_TYPE.MOBILE_MEDIUM);
      expect(fidelity.N0).toBe(100); // €1.00 in cents
    });

    it('Mobile Unlimited: N0 = €1.50/maand', () => {
      const fidelity = calculatePersonalFidelity(PRODUCT_TYPE.MOBILE_UNLIMITED);
      expect(fidelity.N0).toBe(150); // €1.50 in cents
    });

    it('Internet: N0 = €0.35/maand', () => {
      const fidelity = calculatePersonalFidelity(PRODUCT_TYPE.INTERNET);
      expect(fidelity.N0).toBe(35); // €0.35 in cents
    });

    it('TV en Ketel: GEEN fidelity (€0)', () => {
      const tv = calculatePersonalFidelity(PRODUCT_TYPE.ORANGE_TV);
      const ketel = calculatePersonalFidelity(PRODUCT_TYPE.KETELONDERHOUD);
      expect(tv.N0).toBe(0);
      expect(ketel.N0).toBe(0);
    });
  });

  // ============================================================================
  // 6. CLAWBACK TESTS (Belangrijk voor retention!)
  // ============================================================================
  describe('⚠️ Clawback (Terugvordering)', () => {
    const originalCommission = 10000; // €100

    it('< 1 maand: 100% clawback', () => {
      const clawback = calculateClawback(originalCommission, 0);
      expect(clawback).toBe(10000); // 100%
      
      const retention = calculateRetention(originalCommission, 0);
      expect(retention).toBe(0); // 0% behouden
    });

    it('1-6 maanden: 75% clawback', () => {
      const clawback = calculateClawback(originalCommission, 3);
      expect(clawback).toBe(7500); // 75%
      
      const retention = calculateRetention(originalCommission, 3);
      expect(retention).toBe(2500); // 25% behouden
    });

    it('> 6 maanden: 25% clawback', () => {
      const clawback = calculateClawback(originalCommission, 7);
      expect(clawback).toBe(2500); // 25%
      
      const retention = calculateRetention(originalCommission, 7);
      expect(retention).toBe(7500); // 75% behouden
    });
  });

  // ============================================================================
  // 7. INFINITY BONUS TESTS
  // ============================================================================
  describe('♾️ Infinity Bonus (Per PQS in team)', () => {
    it('SC: €50 per PQS', () => {
      expect(calculateInfinityBonus(CONSULTANT_RANK.SC, 2)).toBe(10000); // €100
    });

    it('Y: €75 per PQS', () => {
      expect(calculateInfinityBonus(CONSULTANT_RANK.Y, 2)).toBe(15000); // €150
    });

    it('PC: €100 per PQS', () => {
      expect(calculateInfinityBonus(CONSULTANT_RANK.PC, 2)).toBe(20000); // €200
    });

    it('LE: €150 per PQS', () => {
      expect(calculateInfinityBonus(CONSULTANT_RANK.LE, 2)).toBe(30000); // €300
    });

    it('PMC: €300 per PQS', () => {
      expect(calculateInfinityBonus(CONSULTANT_RANK.PMC, 2)).toBe(60000); // €600
    });

    it('BC krijgt GEEN infinity bonus', () => {
      expect(calculateInfinityBonus(CONSULTANT_RANK.BC, 5)).toBe(0);
    });
  });

  // ============================================================================
  // 8. COMPLETE DEAL SCENARIOS
  // ============================================================================
  describe('🎯 Complete Deal Scenarios', () => {
    it('Scenario: Mobile Large + Internet (BC, met convergence & portability)', () => {
      const services: ServiceItem[] = [
        {
          productType: PRODUCT_TYPE.MOBILE_LARGE,
          options: { hasConvergence: true, hasPortability: true }
        },
        {
          productType: PRODUCT_TYPE.INTERNET,
          options: { hasConvergence: true }
        },
      ];

      const deal = calculateCompleteDeal(services, CONSULTANT_RANK.BC);
      
      // Commissie check
      // Mobile Large BC: €50 + €12 (conv) + €20 (port) = €82
      // Internet BC: €15 + €15 (conv) = €30
      // Totaal: €112 = 11200 cents
      expect(deal.commission.grandTotal).toBe(11200);
      
      // ASP check
      // Mobile: 1 ASP, Internet: 1 ASP = 2 ASP
      expect(deal.asp.total).toBe(2);
      
      // Fidelity check
      // Mobile Large: €1.25/maand, Internet: €0.35/maand = €1.60/maand
      expect(deal.personalFidelity.N0).toBe(160); // €1.60
    });

    it('Scenario: SoHo deal (Mobile Medium + Internet, SoHo)', () => {
      const services: ServiceItem[] = [
        {
          productType: PRODUCT_TYPE.MOBILE_MEDIUM,
          options: { hasConvergence: true, isSoHo: true }
        },
        { productType: PRODUCT_TYPE.INTERNET, options: { hasConvergence: true } },
      ];

      const deal = calculateCompleteDeal(services, CONSULTANT_RANK.BC);
      
      // Mobile Medium BC: €35 + €12 (conv) + €15 (SoHo) = €62
      // Internet BC: €15 + €15 (conv) = €30
      // Totaal: €92 = 9200 cents
      expect(deal.commission.grandTotal).toBe(9200);
      
      // ASP: 1 + 0.5 (SoHo extra) + 1 = 2.5 ASP
      expect(deal.asp.total).toBe(2.5);
    });
  });

  // ============================================================================
  // 9. TARIFF ENGINE TESTS (Klantprijzen)
  // ============================================================================
  describe('💶 Orange Tarieven (Klantprijzen)', () => {
    it('Internet Zen: €49,95/maand', () => {
      const input: TariffInput = {
        internetPlan: 'ZEN',
        isSecondAddress: false,
        mobileLines: [],
        tvPlan: 'NONE',
        hasVasteLijn: false,
        hasMyComfort: false,
        wifiBoosters: 0,
      };
      const result = calculateTariff(input);
      expect(result.internetPrice).toBe(4995);
    });

    it('Convergentie korting: €10 op Internet', () => {
      const input: TariffInput = {
        internetPlan: 'ZEN',
        isSecondAddress: false,
        mobileLines: [{ plan: 'MEDIUM', isPortability: true, isNewNumber: false }],
        tvPlan: 'NONE',
        hasVasteLijn: false,
        hasMyComfort: false,
        wifiBoosters: 0,
      };
      const result = calculateTariff(input);
      expect(result.convergenceDiscount).toBe(1000);
      expect(result.internetPrice).toBe(3995); // €49,95 - €10
    });

    it('Pack 2 Medium: €49,95 (i.p.v. €59,90 individueel)', () => {
      const input: TariffInput = {
        internetPlan: 'START',
        isSecondAddress: false,
        mobileLines: [
          { plan: 'MEDIUM', isPortability: true, isNewNumber: false },
          { plan: 'MEDIUM', isPortability: true, isNewNumber: false },
        ],
        tvPlan: 'NONE',
        hasVasteLijn: false,
        hasMyComfort: false,
        wifiBoosters: 0,
      };
      const result = calculateTariff(input);
      // Pack 2 Medium = €49,95
      // Individueel = €29,95 + €29,95 = €59,90
      // Korting = €9,95
      expect(result.packDiscount).toBeGreaterThan(0);
    });

    it('2de adres korting: €10 levenslang', () => {
      const input: TariffInput = {
        internetPlan: 'ZEN',
        isSecondAddress: true,
        mobileLines: [],
        tvPlan: 'NONE',
        hasVasteLijn: false,
        hasMyComfort: false,
        wifiBoosters: 0,
      };
      const result = calculateTariff(input);
      expect(result.secondAddressDiscount).toBe(1000);
      expect(result.internetPrice).toBe(3995); // €49,95 - €10
    });

    it('Bereken besparing: huidig vs nieuw', () => {
      const input: TariffInput = {
        internetPlan: 'ZEN',
        isSecondAddress: false,
        mobileLines: [
          { plan: 'MEDIUM', isPortability: true, isNewNumber: false },
        ],
        tvPlan: 'NONE',
        hasVasteLijn: false,
        hasMyComfort: false,
        wifiBoosters: 0,
        currentMonthlyCost: 75.00, // €75/maand nu
      };
      const result = calculateTariff(input);
      expect(result.savings6Months).toBeDefined();
      expect(result.savings24Months).toBeDefined();
      
      // Nu: €75, Nieuw: ~€60 (Internet €40 + Mobile €30 - convergentie €10)
      // Besparing: ~€15/maand
      // 6 maanden: ~€90
      expect(result.savings6Months).toBeGreaterThan(0);
    });
  });

  // ============================================================================
  // 10. FORMAT HELPERS
  // ============================================================================
  describe('🔧 Format Helpers', () => {
    it('formatEuro: 1500 cents = €15.00', () => {
      expect(formatEuro(1500)).toBe('€15.00');
    });

    it('formatEuro: 0 cents = €0.00', () => {
      expect(formatEuro(0)).toBe('€0.00');
    });

    it('formatEuro: 35 cents = €0.35', () => {
      expect(formatEuro(35)).toBe('€0.35');
    });
  });
});
