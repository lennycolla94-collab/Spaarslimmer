import { 
  MOBILE_CATALOG, 
  getMobileProduct, 
  calculateMobileRetail,
  type MobileProduct 
} from '../lib/calculator/catalogs/mobile-catalog';

// Position bonuses (kopie voor tests)
const POSITION_BONUSES: Record<string, number> = {
  BC: 0,
  SC: 5,
  EC: 10,
  PC: 20,
  MC: 40,
  NMC: 60,
  PMC: 80,
};

describe('Orange Mobile Calculator (Madelijn Specs)', () => {
  
  describe('Product Catalog', () => {
    it('should have all 5 Orange Mobile products', () => {
      expect(Object.keys(MOBILE_CATALOG)).toHaveLength(5);
      expect(MOBILE_CATALOG['Orange Mobile Child']).toBeDefined();
      expect(MOBILE_CATALOG['Orange Mobile Small']).toBeDefined();
      expect(MOBILE_CATALOG['Orange Mobile Medium']).toBeDefined();
      expect(MOBILE_CATALOG['Orange Mobile Large']).toBeDefined();
      expect(MOBILE_CATALOG['Orange Mobile Unlimited']).toBeDefined();
    });

    it('should find product by name (case insensitive)', () => {
      expect(getMobileProduct('orange mobile medium')).toBeDefined();
      expect(getMobileProduct('ORANGE MOBILE MEDIUM')).toBeDefined();
      expect(getMobileProduct('OrangeMobileMedium')).toBeDefined();
    });

    it('Child should NEVER have portability or SoHo', () => {
      const child = MOBILE_CATALOG['Orange Mobile Child'];
      expect(child.heeftPortabiliteit).toBe(false);
      expect(child.heeftSoHo).toBe(false);
      expect(child.portabilityBonus).toBe(0);
      expect(child.sohoBonus).toBe(0);
    });

    it('Small should NEVER have portability or SoHo', () => {
      const small = MOBILE_CATALOG['Orange Mobile Small'];
      expect(small.heeftPortabiliteit).toBe(false);
      expect(small.heeftSoHo).toBe(false);
    });

    it('Medium/Large/Unlimited SHOULD have portability and SoHo options', () => {
      const medium = MOBILE_CATALOG['Orange Mobile Medium'];
      expect(medium.heeftPortabiliteit).toBe(true);
      expect(medium.heeftSoHo).toBe(true);
      expect(medium.portabilityBonus).toBe(20);
      expect(medium.sohoBonus).toBe(15);
    });
  });

  describe('BC vs SC Retail', () => {
    it('BC should get lower retail than SC', () => {
      const medium = MOBILE_CATALOG['Orange Mobile Medium'];
      expect(medium.bcRetail).toBe(35);
      expect(medium.scRetail).toBe(40);
    });

    it('Unlimited BC=60, SC=65', () => {
      const unlimited = MOBILE_CATALOG['Orange Mobile Unlimited'];
      expect(unlimited.bcRetail).toBe(60);
      expect(unlimited.scRetail).toBe(65);
    });
  });

  describe('Mobile Retail Calculation', () => {
    it('Medium + BC + geen bonuses = 35', () => {
      const product = MOBILE_CATALOG['Orange Mobile Medium'];
      const result = calculateMobileRetail(
        product, 'BC', false, false, false, 'proximus'
      );
      expect(result.basisRetail).toBe(35);
      expect(result.totaalRetail).toBe(35);
    });

    it('Medium + BC + convergentie = 35 + 12 = 47', () => {
      const product = MOBILE_CATALOG['Orange Mobile Medium'];
      const result = calculateMobileRetail(
        product, 'BC', true, false, false, 'proximus'
      );
      expect(result.basisRetail).toBe(35);
      expect(result.convergentieBonus).toBe(12);
      expect(result.totaalRetail).toBe(47);
    });

    it('Medium + BC + convergentie + portability (externe operator) = 35 + 12 + 20 = 67', () => {
      const product = MOBILE_CATALOG['Orange Mobile Medium'];
      const result = calculateMobileRetail(
        product, 'BC', true, true, false, 'proximus'
      );
      expect(result.totaalRetail).toBe(67);
    });

    it('Medium + BC + portability van ORANGE (intern) = geen portability bonus', () => {
      const product = MOBILE_CATALOG['Orange Mobile Medium'];
      const result = calculateMobileRetail(
        product, 'BC', false, true, false, 'orange'
      );
      expect(result.portabilityBonus).toBe(0);
      expect(result.totaalRetail).toBe(35);
    });

    it('Medium + BC + portability van HEY (intern) = geen portability bonus', () => {
      const product = MOBILE_CATALOG['Orange Mobile Medium'];
      const result = calculateMobileRetail(
        product, 'BC', false, true, false, 'hey'
      );
      expect(result.portabilityBonus).toBe(0);
    });

    it('Medium + BC + SoHo = 35 + 15 = 50', () => {
      const product = MOBILE_CATALOG['Orange Mobile Medium'];
      const result = calculateMobileRetail(
        product, 'BC', false, false, true, 'proximus'
      );
      expect(result.sohoBonus).toBe(15);
      expect(result.totaalRetail).toBe(50);
    });

    it('Medium + BC + alle bonuses (externe operator) = 35 + 12 + 20 + 15 = 82', () => {
      const product = MOBILE_CATALOG['Orange Mobile Medium'];
      const result = calculateMobileRetail(
        product, 'BC', true, true, true, 'telenet'
      );
      expect(result.totaalRetail).toBe(82);
    });

    it('Child + BC + alle flags = geen bonuses (35? nee, Child is 1)', () => {
      const product = MOBILE_CATALOG['Orange Mobile Child'];
      const result = calculateMobileRetail(
        product, 'BC', true, true, true, 'proximus'
      );
      expect(result.basisRetail).toBe(1);
      expect(result.convergentieBonus).toBe(0);
      expect(result.portabilityBonus).toBe(0);
      expect(result.sohoBonus).toBe(0);
      expect(result.totaalRetail).toBe(1);
    });
  });

  describe('Full Commission Calculation', () => {
    it('Medium + BC + alle bonuses + PC positie = 82 + 20 = 102', () => {
      const product = MOBILE_CATALOG['Orange Mobile Medium'];
      const retailResult = calculateMobileRetail(
        product, 'BC', true, true, true, 'telenet'
      );
      
      const positieBonus = POSITION_BONUSES['PC'];
      const totaalCommissie = retailResult.totaalRetail + positieBonus;
      
      expect(retailResult.basisRetail).toBe(35);
      expect(retailResult.convergentieBonus).toBe(12);
      expect(retailResult.portabilityBonus).toBe(20);
      expect(retailResult.sohoBonus).toBe(15);
      expect(retailResult.totaalRetail).toBe(82);
      expect(positieBonus).toBe(20);
      expect(totaalCommissie).toBe(102);
    });

    it('Unlimited + SC + alle bonuses + PMC positie', () => {
      const product = MOBILE_CATALOG['Orange Mobile Unlimited'];
      const retailResult = calculateMobileRetail(
        product, 'SC', true, true, true, 'proximus'
      );
      
      // SC retail = 65
      // + convergentie 12 = 77
      // + portability 20 = 97
      // + SoHo 15 = 112
      // + PMC bonus 80 = 192
      expect(retailResult.basisRetail).toBe(65);
      expect(retailResult.totaalRetail).toBe(112);
      
      const positieBonus = POSITION_BONUSES['PMC'];
      expect(positieBonus).toBe(80);
      
      const totaalCommissie = retailResult.totaalRetail + positieBonus;
      expect(totaalCommissie).toBe(192);
    });

    it('Child + BC + geen bonuses = 1 + 0 = 1', () => {
      const product = MOBILE_CATALOG['Orange Mobile Child'];
      const retailResult = calculateMobileRetail(
        product, 'BC', true, true, true, 'proximus'
      );
      
      expect(retailResult.totaalRetail).toBe(1);
      
      const positieBonus = POSITION_BONUSES['BC'];
      expect(positieBonus).toBe(0);
      
      const totaalCommissie = retailResult.totaalRetail + positieBonus;
      expect(totaalCommissie).toBe(1);
    });

    it('Fidelity berekening', () => {
      const product = MOBILE_CATALOG['Orange Mobile Medium'];
      
      expect(product.fidelityPerMaand).toBe(1.00);
      expect(product.fidelityPerMaand * 6).toBe(6.00);
      expect(product.fidelityPerMaand * 24).toBe(24.00);
    });
  });

  describe('Position Bonuses', () => {
    it('should have correct bonuses for all positions', () => {
      expect(POSITION_BONUSES.BC).toBe(0);
      expect(POSITION_BONUSES.SC).toBe(5);
      expect(POSITION_BONUSES.EC).toBe(10);
      expect(POSITION_BONUSES.PC).toBe(20);
      expect(POSITION_BONUSES.MC).toBe(40);
      expect(POSITION_BONUSES.NMC).toBe(60);
      expect(POSITION_BONUSES.PMC).toBe(80);
    });
  });
});
