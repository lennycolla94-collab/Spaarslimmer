import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;
const ENCODING = 'hex';

// In productie: gebruik AWS KMS of HashiCorp Vault
const getKey = () => {
  const key = process.env.ENCRYPTION_KEY;
  if (!key || key.length !== 64) {
    throw new Error('ENCRYPTION_KEY must be 64 hex characters (256 bits)');
  }
  return Buffer.from(key, 'hex');
};

export const encryption = {
  encrypt(text: string): string {
    if (!text) return text;
    
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
    
    let encrypted = cipher.update(text, 'utf8', ENCODING);
    encrypted += cipher.final(ENCODING);
    
    const tag = cipher.getAuthTag();
    
    // Format: iv:tag:encrypted
    return `${iv.toString(ENCODING)}:${tag.toString(ENCODING)}:${encrypted}`;
  },

  decrypt(encryptedData: string): string {
    if (!encryptedData || !encryptedData.includes(':')) return encryptedData;
    
    const [ivHex, tagHex, encrypted] = encryptedData.split(':');
    
    const iv = Buffer.from(ivHex, ENCODING);
    const tag = Buffer.from(tagHex, ENCODING);
    
    const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encrypted, ENCODING, 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  },

  // Helper voor batch decryptie (voor lists)
  decryptFields<T extends Record<string, any>>(
    data: T, 
    fields: (keyof T)[]
  ): T {
    const decrypted = { ...data };
    for (const field of fields) {
      if (typeof decrypted[field] === 'string') {
        decrypted[field] = encryption.decrypt(decrypted[field] as string) as any;
      }
    }
    return decrypted;
  }
};

// GDPR Helper: hash voor deduplicatie (zonder encryptie te breken)
export const gdprHash = (value: string): string => {
  return crypto.createHash('sha256').update(value.toLowerCase().trim()).digest('hex');
};
