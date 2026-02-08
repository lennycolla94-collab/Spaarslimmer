import { calculateCommission, BONUSES, RETAIL_RATES } from '../lib/calculator';

describe('Commission Calculator', () => {
  describe('BONUSES', () => {
    it('should have correct bonus amounts for each position', () => {
      expect(BONUSES.BC).toBe(0);
      expect(BONUSES.SC).toBe(5);
      expect(BONUSES.EC).toBe(10);
      expect(BONUSES.PC).toBe(20);
      expect(BONUSES.MC).toBe(40);
      expect(BONUSES.NMC).toBe(60);
      expect(BONUSES.PMC).toBe(80);
    });
  });

  describe('RETAIL_RATES', () => {
    it('should have mobile rates defined', () => {
      expect(RETAIL_RATES.mobile.child).toEqual({ bc: 15, sc: 12 });
      expect(RETAIL_RATES.mobile.unlimited).toEqual({ bc: 55, sc: 44 });
    });
  });

  describe('calculateCommission', () => {
    it('should calculate basic commission correctly', () => {
      const result = calculateCommission({
        serviceType: 'mobile',
        plan: 'medium',
        position: 'BC',
      });
      
      // mobile medium: bc=35, sc=28, bonus BC=0
      expect(result.bcRetail).toBe(35);
      expect(result.scRetail).toBe(28);
      expect(result.bonus).toBe(0);
      expect(result.totalCommission).toBe(63);
    });

    it('should calculate commission with position bonus', () => {
      const result = calculateCommission({
        serviceType: 'mobile',
        plan: 'medium',
        position: 'SC',
      });
      
      // mobile medium: bc=35, sc=28, bonus SC=5
      expect(result.bonus).toBe(5);
      expect(result.totalCommission).toBe(68);
    });

    it('should add portability bonus (+€10)', () => {
      const result = calculateCommission({
        serviceType: 'mobile',
        plan: 'small',
        position: 'BC',
        isPortability: true,
      });
      
      // mobile small: bc=25 + 10 = 35, sc=20
      expect(result.bcRetail).toBe(35);
      expect(result.totalCommission).toBe(55);
    });

    it('should add convergence bonus (+€5)', () => {
      const result = calculateCommission({
        serviceType: 'mobile',
        plan: 'small',
        position: 'BC',
        isConvergence: true,
      });
      
      // mobile small: bc=25 + 5 = 30, sc=20
      expect(result.bcRetail).toBe(30);
      expect(result.totalCommission).toBe(50);
    });

    it('should apply SoHo multiplier (1.5x)', () => {
      const result = calculateCommission({
        serviceType: 'mobile',
        plan: 'small',
        position: 'BC',
        isSoHo: true,
      });
      
      // mobile small: bc=25 * 1.5 = 37.5, sc=20 * 1.5 = 30
      expect(result.bcRetail).toBe(37.5);
      expect(result.scRetail).toBe(30);
      expect(result.totalCommission).toBe(67.5);
    });

    // THE €134 TEST
    it('should calculate €134 for PC with mobile unlimited + portability + convergence', () => {
      const result = calculateCommission({
        serviceType: 'mobile',
        plan: 'unlimited',
        position: 'PC',
        isPortability: true,
        isConvergence: true,
      });
      
      // mobile unlimited: bc=55 + 10 (portability) + 5 (convergence) = 70
      // sc=44
      // bonus PC=20
      // Total: 70 + 44 + 20 = 134 ✓
      expect(result.bcRetail).toBe(70);
      expect(result.scRetail).toBe(44);
      expect(result.bonus).toBe(20);
      expect(result.totalCommission).toBe(134);
    });
  });
});
