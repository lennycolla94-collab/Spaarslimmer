import { PrismaClient } from '@prisma/client';
import { encryption } from './encryption';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Prisma middleware voor automatische decryptie
prisma.$use(async (params, next) => {
  const result = await next(params);
  
  // Decrypt leads na ophalen
  if (params.model === 'Lead' && result) {
    const decryptLead = (lead: any) => {
      if (!lead) return lead;
      
      // Single lead
      if (lead.encryptedPhone) {
        return {
          ...lead,
          phone: encryption.decrypt(lead.encryptedPhone),
          email: lead.encryptedEmail ? encryption.decrypt(lead.encryptedEmail) : null,
          ean: lead.encryptedEan ? encryption.decrypt(lead.encryptedEan) : null,
          // Remove encrypted fields
          encryptedPhone: undefined,
          encryptedEmail: undefined,
          encryptedEan: undefined,
        };
      }
      return lead;
    };
    
    // Array of leads
    if (Array.isArray(result)) {
      return result.map(decryptLead);
    }
    
    // Single lead
    return decryptLead(result);
  }
  
  return result;
});
