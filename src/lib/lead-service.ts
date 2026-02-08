import { PrismaClient, Lead, Prisma } from '@prisma/client';
import { encryption, gdprHash } from './encryption';

const prisma = new PrismaClient();

// Velden die geëncrypt moeten worden
const ENCRYPTED_FIELDS = ['encryptedPhone', 'encryptedEmail', 'encryptedEan'] as const;
type EncryptedField = typeof ENCRYPTED_FIELDS[number];

export interface LeadInput {
  phone: string;
  email?: string;
  ean?: string;
  companyName: string;
  niche?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  currentProvider?: string;
  currentSupplier?: string;
  consentEmail: boolean;
  consentPhone: boolean;
  consentWhatsapp: boolean;
  lawfulBasis: 'CONSENT' | 'CONTRACT' | 'LEGITIMATE_INTEREST' | 'LEGAL_OBLIGATION';
  ownerId: string;
  source?: string;
}

export interface DecryptedLead extends Omit<Lead, 'encryptedPhone' | 'encryptedEmail' | 'encryptedEan'> {
  phone: string;
  email?: string;
  ean?: string;
}

/**
 * Encrypt lead input data
 */
function encryptLeadInput(input: LeadInput): Prisma.LeadCreateInput {
  return {
    encryptedPhone: encryption.encrypt(input.phone),
    encryptedEmail: input.email ? encryption.encrypt(input.email) : null,
    encryptedEan: input.ean ? encryption.encrypt(input.ean) : null,
    companyName: input.companyName,
    niche: input.niche || null,
    address: input.address || null,
    city: input.city || null,
    province: input.province || null,
    postalCode: input.postalCode || null,
    currentProvider: input.currentProvider || null,
    currentSupplier: input.currentSupplier || null,
    consentEmail: input.consentEmail,
    consentPhone: input.consentPhone,
    consentWhatsapp: input.consentWhatsapp,
    lawfulBasis: input.lawfulBasis,
    ownerId: input.ownerId,
    source: input.source || 'manual',
    status: 'NEW',
  };
}

/**
 * Decrypt lead data
 */
function decryptLead(lead: Lead): DecryptedLead {
  const { encryptedPhone, encryptedEmail, encryptedEan, ...rest } = lead;
  
  return {
    ...rest,
    phone: encryption.decrypt(encryptedPhone),
    email: encryptedEmail ? encryption.decrypt(encryptedEmail) : undefined,
    ean: encryptedEan ? encryption.decrypt(encryptedEan) : undefined,
  };
}

/**
 * Create a new lead with encrypted fields
 */
export async function createLead(input: LeadInput): Promise<DecryptedLead> {
  // Check for duplicates using hash (GDPR compliant)
  const phoneHash = gdprHash(input.phone);
  const existingLead = await prisma.lead.findFirst({
    where: {
      // We can't check encrypted phone directly, so we check via a hash field
      // For now, we check all leads and compare decrypted
    },
  });

  // In productie: gebruik een aparte hash kolom voor deduplicatie
  // await prisma.lead.findFirst({ where: { phoneHash } });

  // Check alle leads (niet optimaal voor grote datasets)
  const allLeads = await prisma.lead.findMany({
    select: { id: true, encryptedPhone: true },
  });
  
  for (const l of allLeads) {
    const decryptedPhone = encryption.decrypt(l.encryptedPhone);
    if (gdprHash(decryptedPhone) === phoneHash) {
      throw new Error(`Lead with phone ${input.phone} already exists`);
    }
  }

  const encryptedData = encryptLeadInput(input);
  
  const lead = await prisma.lead.create({
    data: encryptedData,
  });

  return decryptLead(lead);
}

/**
 * Get lead by ID with decrypted fields
 */
export async function getLeadById(id: string): Promise<DecryptedLead | null> {
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      owner: {
        select: { id: true, name: true, email: true },
      },
      _count: {
        select: { calls: true, sales: true },
      },
    },
  });

  if (!lead) return null;
  return decryptLead(lead);
}

/**
 * Get all leads for a user with decrypted fields
 */
export async function getLeadsByOwner(ownerId: string): Promise<DecryptedLead[]> {
  const leads = await prisma.lead.findMany({
    where: { ownerId },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { calls: true },
      },
    },
  });

  return leads.map(decryptLead);
}

/**
 * Search leads by phone (encrypted search)
 */
export async function searchLeadByPhone(phone: string): Promise<DecryptedLead | null> {
  // We must decrypt all leads to search (niet optimaal)
  // In productie: gebruik searchable encryption of hash index
  const leads = await prisma.lead.findMany({
    select: { id: true, encryptedPhone: true },
  });

  const targetHash = gdprHash(phone);
  
  for (const lead of leads) {
    const decryptedPhone = encryption.decrypt(lead.encryptedPhone);
    if (gdprHash(decryptedPhone) === targetHash) {
      return getLeadById(lead.id);
    }
  }

  return null;
}

/**
 * Update lead with encryption
 */
export async function updateLead(
  id: string, 
  updates: Partial<LeadInput>
): Promise<DecryptedLead> {
  const updateData: Prisma.LeadUpdateInput = {};

  if (updates.phone) updateData.encryptedPhone = encryption.encrypt(updates.phone);
  if (updates.email !== undefined) {
    updateData.encryptedEmail = updates.email ? encryption.encrypt(updates.email) : null;
  }
  if (updates.ean !== undefined) {
    updateData.encryptedEan = updates.ean ? encryption.encrypt(updates.ean) : null;
  }
  if (updates.companyName) updateData.companyName = updates.companyName;
  if (updates.niche) updateData.niche = updates.niche;
  if (updates.address) updateData.address = updates.address;
  if (updates.city) updateData.city = updates.city;
  if (updates.province) updateData.province = updates.province;
  if (updates.postalCode) updateData.postalCode = updates.postalCode;
  if (updates.currentProvider) updateData.currentProvider = updates.currentProvider;
  if (updates.currentSupplier) updateData.currentSupplier = updates.currentSupplier;
  if (updates.consentEmail !== undefined) updateData.consentEmail = updates.consentEmail;
  if (updates.consentPhone !== undefined) updateData.consentPhone = updates.consentPhone;
  if (updates.consentWhatsapp !== undefined) updateData.consentWhatsapp = updates.consentWhatsapp;
  if (updates.lawfulBasis) updateData.lawfulBasis = updates.lawfulBasis;

  const lead = await prisma.lead.update({
    where: { id },
    data: updateData,
  });

  return decryptLead(lead);
}

/**
 * Update consent (GDPR compliance)
 */
export async function updateConsent(
  id: string,
  consents: {
    email?: boolean;
    phone?: boolean;
    whatsapp?: boolean;
  },
  changedBy: string
): Promise<DecryptedLead> {
  const lead = await prisma.lead.update({
    where: { id },
    data: {
      consentEmail: consents.email,
      consentPhone: consents.phone,
      consentWhatsapp: consents.whatsapp,
      gdprAcceptanceDate: new Date(),
    },
  });

  // Log consent change for audit
  await prisma.auditLog.create({
    data: {
      userId: changedBy,
      action: 'CONSENT_UPDATED',
      entityType: 'Lead',
      entityId: id,
      newValues: consents as any,
    },
  });

  return decryptLead(lead);
}

/**
 * Delete lead (soft delete via status)
 */
export async function deleteLead(id: string, deletedBy: string): Promise<void> {
  await prisma.lead.update({
    where: { id },
    data: { status: 'DO_NOT_CONTACT' },
  });

  // Log deletion for audit
  await prisma.auditLog.create({
    data: {
      userId: deletedBy,
      action: 'LEAD_DELETED',
      entityType: 'Lead',
      entityId: id,
    },
  });
}

/**
 * Get lead statistics for dashboard
 */
export async function getLeadStats(ownerId: string) {
  const [
    total,
    newLeads,
    contacted,
    quoted,
    sales,
    lost
  ] = await Promise.all([
    prisma.lead.count({ where: { ownerId } }),
    prisma.lead.count({ where: { ownerId, status: 'NEW' } }),
    prisma.lead.count({ where: { ownerId, status: 'CONTACTED' } }),
    prisma.lead.count({ where: { ownerId, status: 'QUOTED' } }),
    prisma.lead.count({ where: { ownerId, status: 'SALE_MADE' } }),
    prisma.lead.count({ where: { ownerId, status: 'LOST' } }),
  ]);

  return {
    total,
    new: newLeads,
    contacted,
    quoted,
    sales,
    lost,
    conversionRate: total > 0 ? ((sales / total) * 100).toFixed(1) : '0',
  };
}
