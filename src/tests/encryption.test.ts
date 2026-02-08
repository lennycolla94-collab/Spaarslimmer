import { encryption, gdprHash } from '../lib/encryption';

describe('Encryption Service', () => {
  const testPhone = '+32471234567';
  const testEmail = 'test@example.com';

  describe('encrypt/decrypt', () => {
    it('should encrypt and decrypt phone number', () => {
      const encrypted = encryption.encrypt(testPhone);
      expect(encrypted).not.toBe(testPhone);
      expect(encrypted).toContain(':'); // Format: iv:tag:ciphertext
      
      const decrypted = encryption.decrypt(encrypted);
      expect(decrypted).toBe(testPhone);
    });

    it('should encrypt and decrypt email', () => {
      const encrypted = encryption.encrypt(testEmail);
      const decrypted = encryption.decrypt(encrypted);
      expect(decrypted).toBe(testEmail);
    });

    it('should handle empty strings', () => {
      expect(encryption.encrypt('')).toBe('');
      expect(encryption.decrypt('')).toBe('');
    });

    it('should produce different ciphertexts for same input (IV randomization)', () => {
      const encrypted1 = encryption.encrypt(testPhone);
      const encrypted2 = encryption.encrypt(testPhone);
      expect(encrypted1).not.toBe(encrypted2);
      
      // But both should decrypt to same value
      expect(encryption.decrypt(encrypted1)).toBe(testPhone);
      expect(encryption.decrypt(encrypted2)).toBe(testPhone);
    });

    it('should handle non-encrypted data gracefully', () => {
      const plainText = 'not-encrypted-data';
      expect(encryption.decrypt(plainText)).toBe(plainText);
    });
  });

  describe('decryptFields', () => {
    it('should decrypt multiple fields in object', () => {
      const data = {
        id: '123',
        encryptedPhone: encryption.encrypt(testPhone),
        encryptedEmail: encryption.encrypt(testEmail),
        name: 'Test Company',
      };

      const decrypted = encryption.decryptFields(data, ['encryptedPhone', 'encryptedEmail']);
      
      expect(decrypted.encryptedPhone).toBe(testPhone);
      expect(decrypted.encryptedEmail).toBe(testEmail);
      expect(decrypted.id).toBe('123');
      expect(decrypted.name).toBe('Test Company');
    });

    it('should handle undefined fields', () => {
      const data = {
        id: '123',
        encryptedPhone: encryption.encrypt(testPhone),
        encryptedEmail: undefined as any,
      };

      const decrypted = encryption.decryptFields(data, ['encryptedPhone', 'encryptedEmail']);
      
      expect(decrypted.encryptedPhone).toBe(testPhone);
      expect(decrypted.encryptedEmail).toBeUndefined();
    });
  });

  describe('gdprHash', () => {
    it('should produce consistent hashes', () => {
      const hash1 = gdprHash(testPhone);
      const hash2 = gdprHash(testPhone);
      expect(hash1).toBe(hash2);
    });

    it('should be case insensitive', () => {
      const hash1 = gdprHash('Test@Example.com');
      const hash2 = gdprHash('test@example.com');
      expect(hash1).toBe(hash2);
    });

    it('should trim whitespace', () => {
      const hash1 = gdprHash('  +32471234567  ');
      const hash2 = gdprHash('+32471234567');
      expect(hash1).toBe(hash2);
    });

    it('should produce different hashes for different inputs', () => {
      const hash1 = gdprHash('+32471234567');
      const hash2 = gdprHash('+32471234568');
      expect(hash1).not.toBe(hash2);
    });

    it('should produce 64 character hex string', () => {
      const hash = gdprHash(testPhone);
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });
  });

  describe('Security', () => {
    it('encrypted data should not contain original text', () => {
      const encrypted = encryption.encrypt(testPhone);
      expect(encrypted).not.toContain(testPhone);
      expect(encrypted).not.toContain('32471234567');
    });

    it('should have correct format', () => {
      const encrypted = encryption.encrypt(testPhone);
      const parts = encrypted.split(':');
      expect(parts).toHaveLength(3);
      
      // IV: 16 bytes = 32 hex chars
      expect(parts[0]).toHaveLength(32);
      // Tag: 16 bytes = 32 hex chars  
      expect(parts[1]).toHaveLength(32);
      // Ciphertext: variable length
      expect(parts[2].length).toBeGreaterThan(0);
    });
  });
});
