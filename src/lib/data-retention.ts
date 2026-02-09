/**
 * Data Retention Policy
 * Automatische verwijdering van oude data volgens GDPR
 */

import { prisma } from './prisma';

// Retentie periodes (in dagen)
export const RETENTION_PERIODS = {
  // Consultant data
  INACTIVE_ACCOUNT: 365 * 7, // 7 jaar na laatste login
  DELETED_ACCOUNT: 30, // 30 dagen grace period
  
  // Lead data
  LEAD_NO_CONTACT: 365 * 2, // 2 jaar na laatste contact
  LEAD_CONVERTED: 365 * 7, // 7 jaar voor klanten (wettelijk)
  LEAD_REJECTED: 90, // 90 dagen voor afgewezen leads
  
  // Call data
  CALL_RECORDING: 30, // 30 dagen voor gespreksopnames
  CALL_NOTES: 365, // 1 jaar voor gespreksnotities
  
  // Financial data
  COMMISSION_RECORDS: 365 * 10, // 10 jaar (wettelijk verplicht)
  INVOICE_DATA: 365 * 10, // 10 jaar (wettelijk verplicht)
  
  // Logs
  AUDIT_LOGS: 365 * 2, // 2 jaar voor audit logs
  ACCESS_LOGS: 90, // 90 dagen voor toegangslogs
  ERROR_LOGS: 30, // 30 dagen voor error logs
};

interface CleanupResult {
  entity: string;
  deleted: number;
  errors: number;
}

/**
 * Verwijder inactieve accounts (niet ingelogd voor X dagen)
 */
export async function cleanupInactiveAccounts(): Promise<CleanupResult> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - RETENTION_PERIODS.INACTIVE_ACCOUNT);
  
  try {
    // Markeer voor verwijdering (soft delete)
    const result = await prisma.user.updateMany({
      where: {
        lastLoginAt: {
          lt: cutoffDate,
        },
        status: 'ACTIVE',
      },
      data: {
        status: 'INACTIVE',
      },
    });
    
    return {
      entity: 'Inactive Accounts',
      deleted: result.count,
      errors: 0,
    };
  } catch (error) {
    console.error('Error cleaning up inactive accounts:', error);
    return {
      entity: 'Inactive Accounts',
      deleted: 0,
      errors: 1,
    };
  }
}

/**
 * Verwijder oude leads zonder contact
 */
export async function cleanupOldLeads(): Promise<CleanupResult> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - RETENTION_PERIODS.LEAD_NO_CONTACT);
  
  try {
    // Eerst verwijder gerelateerde records
    await prisma.callLog.deleteMany({
      where: {
        lead: {
          updatedAt: {
            lt: cutoffDate,
          },
          status: 'NOT_INTERESTED',
        },
      },
    });
    
    await prisma.queueItem.deleteMany({
      where: {
        lead: {
          updatedAt: {
            lt: cutoffDate,
          },
          status: 'NOT_INTERESTED',
        },
      },
    });
    
    // Dan verwijder de leads
    const result = await prisma.lead.deleteMany({
      where: {
        updatedAt: {
          lt: cutoffDate,
        },
        status: 'NOT_INTERESTED',
      },
    });
    
    return {
      entity: 'Old Leads',
      deleted: result.count,
      errors: 0,
    };
  } catch (error) {
    console.error('Error cleaning up old leads:', error);
    return {
      entity: 'Old Leads',
      deleted: 0,
      errors: 1,
    };
  }
}

/**
 * Verwijder oude audit logs
 */
export async function cleanupAuditLogs(): Promise<CleanupResult> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - RETENTION_PERIODS.AUDIT_LOGS);
  
  try {
    const result = await prisma.auditLog.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });
    
    return {
      entity: 'Audit Logs',
      deleted: result.count,
      errors: 0,
    };
  } catch (error) {
    console.error('Error cleaning up audit logs:', error);
    return {
      entity: 'Audit Logs',
      deleted: 0,
      errors: 1,
    };
  }
}

/**
 * Anonimiseer oude leads (in plaats van verwijderen voor wettelijke compliance)
 */
export async function anonymizeOldLeads(): Promise<CleanupResult> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - RETENTION_PERIODS.LEAD_CONVERTED);
  
  try {
    // Anonimiseer in plaats van verwijderen voor wettelijke compliance
    const result = await prisma.lead.updateMany({
      where: {
        updatedAt: {
          lt: cutoffDate,
        },
        status: 'SALE_MADE',
      },
      data: {
        phone: 'ANONYMIZED',
        email: 'anonymized@deleted.com',
        contactName: 'Anonymized',
        // Behoud bedrijfsnaam en adres voor wettelijke documentatie
      },
    });
    
    return {
      entity: 'Anonymized Leads',
      deleted: result.count,
      errors: 0,
    };
  } catch (error) {
    console.error('Error anonymizing old leads:', error);
    return {
      entity: 'Anonymized Leads',
      deleted: 0,
      errors: 1,
    };
  }
}

/**
 * Voer alle cleanup taken uit
 */
export async function runDataRetentionCleanup(): Promise<CleanupResult[]> {
  console.log('Starting data retention cleanup...', new Date().toISOString());
  
  const results = await Promise.all([
    cleanupInactiveAccounts(),
    cleanupOldLeads(),
    cleanupAuditLogs(),
    anonymizeOldLeads(),
  ]);
  
  console.log('Data retention cleanup completed:', results);
  
  return results;
}

/**
 * Export user data (GDPR Article 20 - Right to data portability)
 */
export async function exportUserData(userId: string): Promise<Record<string, any>> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      leads: true,
      sales: {
        include: {
          lead: true,
        },
      },
      calls: true,
      commissions: true,
    },
  });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Verwijder gevoelige velden
  const { password, ...safeUser } = user;
  
  return {
    exportDate: new Date().toISOString(),
    user: safeUser,
    format: 'JSON',
    version: '1.0',
  };
}

/**
 * Delete user account (GDPR Article 17 - Right to erasure)
 */
export async function deleteUserAccount(userId: string): Promise<void> {
  // Verwijder of anonimiseer alle gerelateerde data
  await prisma.$transaction([
    // Verwijder calls
    prisma.callLog.deleteMany({
      where: { consultantId: userId },
    }),
    
    // Anonimiseer leads (niet verwijderen voor wettelijke compliance)
    prisma.lead.updateMany({
      where: { ownerId: userId },
      data: {
        phone: 'ANONYMIZED',
        email: 'anonymized@deleted.com',
        contactName: 'Anonymized',
        ownerId: 'DELETED_USER',
      },
    }),
    
    // Verwijder queue items
    prisma.queueItem.deleteMany({
      where: { assignedTo: userId },
    }),
    
    // Markeer user als verwijderd
    prisma.user.update({
      where: { id: userId },
      data: {
        status: 'DELETED',
        email: `deleted_${userId}@deleted.com`,
        name: 'Deleted User',
        password: 'DELETED',
      },
    }),
  ]);
}
