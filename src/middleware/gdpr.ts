import { Lead } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type ContactChannel = 'email' | 'whatsapp' | 'phone';

/**
 * Check if contact is allowed for a specific channel
 */
export function checkConsent(lead: Lead, channel: ContactChannel): boolean {
  switch (channel) {
    case 'email':
      return lead.consentEmail;
    case 'whatsapp':
      return lead.consentWhatsApp;
    case 'phone':
      return lead.consentPhone;
    default:
      return false;
  }
}

/**
 * Check if lead can be called
 */
export function checkDoNotCall(lead: Lead): boolean {
  return lead.doNotCall;
}

/**
 * Check if lead can be contacted via specific channel
 * Returns true if contact is allowed
 */
export function canContact(lead: Lead, channel: ContactChannel): { allowed: boolean; reason?: string } {
  // Check doNotCall for phone calls
  if (channel === 'phone' && lead.doNotCall) {
    return { allowed: false, reason: 'Lead has opted out of phone calls (doNotCall)' };
  }
  
  // Check consent for channel
  const hasConsent = checkConsent(lead, channel);
  if (!hasConsent) {
    return { allowed: false, reason: `Lead has not consented to ${channel} contact` };
  }
  
  // Check lawful basis
  if (lead.lawfulBasis === 'CONSENT' && !hasConsent) {
    return { allowed: false, reason: 'Lawful basis is CONSENT but no consent given' };
  }
  
  return { allowed: true };
}

export interface ConsentChange {
  leadId: string;
  channel: ContactChannel;
  oldValue: boolean;
  newValue: boolean;
  reason: string;
  changedBy: string;
  timestamp: Date;
}

/**
 * Log consent change for audit trail
 */
export async function logConsentChange(
  leadId: string,
  channel: ContactChannel,
  newValue: boolean,
  reason: string,
  changedBy: string
): Promise<void> {
  // Get current lead to determine old value
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    select: {
      consentEmail: true,
      consentWhatsApp: true,
      consentPhone: true,
    },
  });
  
  if (!lead) {
    throw new Error(`Lead not found: ${leadId}`);
  }
  
  const oldValue = getConsentValue(lead, channel);
  
  // Update lead consent
  const updateData: any = {};
  switch (channel) {
    case 'email':
      updateData.consentEmail = newValue;
      break;
    case 'whatsapp':
      updateData.consentWhatsApp = newValue;
      break;
    case 'phone':
      updateData.consentPhone = newValue;
      break;
  }
  
  await prisma.lead.update({
    where: { id: leadId },
    data: updateData,
  });
  
  // In a real application, you would store this in an audit log table
  // For now, we log to console (replace with actual audit logging)
  const auditEntry: ConsentChange = {
    leadId,
    channel,
    oldValue,
    newValue,
    reason,
    changedBy,
    timestamp: new Date(),
  };
  
  console.log('GDPR Consent Change:', auditEntry);
  
  // TODO: Store in audit log table
  // await prisma.consentAuditLog.create({ data: auditEntry });
}

function getConsentValue(
  lead: Pick<Lead, 'consentEmail' | 'consentWhatsApp' | 'consentPhone'>,
  channel: ContactChannel
): boolean {
  switch (channel) {
    case 'email':
      return lead.consentEmail;
    case 'whatsapp':
      return lead.consentWhatsApp;
    case 'phone':
      return lead.consentPhone;
    default:
      return false;
  }
}

/**
 * Validate lawful basis for processing
 */
export function validateLawfulBasis(basis: string): { valid: boolean; error?: string } {
  const validBases = ['CONSENT', 'LEGITIMATE_INTEREST', 'CONTRACT', 'LEGAL_OBLIGATION', 'VITAL_INTEREST', 'PUBLIC_TASK'];
  
  if (!validBases.includes(basis)) {
    return {
      valid: false,
      error: `Invalid lawful basis: ${basis}. Must be one of: ${validBases.join(', ')}`,
    };
  }
  
  return { valid: true };
}

/**
 * GDPR middleware for API routes
 * Checks consent before allowing contact operations
 */
export async function gdprMiddleware(
  lead: Lead,
  operation: 'call' | 'email' | 'whatsapp' | 'visit'
): Promise<{ allowed: boolean; error?: string }> {
  switch (operation) {
    case 'call':
      if (lead.doNotCall) {
        return { allowed: false, error: 'Lead has opted out of phone calls' };
      }
      if (!lead.consentPhone) {
        return { allowed: false, error: 'Lead has not consented to phone calls' };
      }
      break;
      
    case 'email':
      if (!lead.consentEmail) {
        return { allowed: false, error: 'Lead has not consented to email contact' };
      }
      break;
      
    case 'whatsapp':
      if (!lead.consentWhatsApp) {
        return { allowed: false, error: 'Lead has not consented to WhatsApp contact' };
      }
      break;
      
    case 'visit':
      // Physical visits typically don't require explicit consent
      // but should respect doNotCall as a general 'no contact' flag
      if (lead.doNotCall) {
        return { allowed: false, error: 'Lead has opted out of all contact' };
      }
      break;
  }
  
  return { allowed: true };
}
