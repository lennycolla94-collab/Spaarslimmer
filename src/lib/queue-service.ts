import { PrismaClient, Lead, QueueItem } from '@prisma/client';

const prisma = new PrismaClient();

export interface QueueFilters {
  provinces?: string[];
  niches?: string[];
  providers?: string[];
  timeRestrictions?: boolean; // Respect horeca 18-20u restriction
}

export interface NextLeadResult {
  queueItem: QueueItem & { lead: Lead };
  callHistory: {
    lastCall: Date | null;
    totalCalls: number;
  };
}

/**
 * Get the next lead from the queue for a consultant
 */
export async function getNextLead(
  consultantId: string,
  filters: QueueFilters = {}
): Promise<NextLeadResult | null> {
  const now = new Date();
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  
  // Check time restrictions
  const hour = now.getHours();
  const isHorecaRestrictedTime = hour >= 18 && hour < 20;
  
  // Build where clause
  const where: any = {
    consultantId,
    status: 'pending',
    scheduledAt: { lte: now },
    lead: {
      doNotCall: false,
      consentPhone: true,
      callLogs: {
        none: {
          createdAt: { gte: twoHoursAgo },
        },
      },
    },
  };
  
  // Apply filters
  if (filters.provinces && filters.provinces.length > 0) {
    where.lead.province = { in: filters.provinces };
  }
  
  if (filters.niches && filters.niches.length > 0) {
    if (isHorecaRestrictedTime && filters.timeRestrictions !== false) {
      // Exclude horeca during restricted hours
      where.lead.niche = { in: filters.niches.filter(n => n !== 'horeca') };
    } else {
      where.lead.niche = { in: filters.niches };
    }
  } else if (isHorecaRestrictedTime && filters.timeRestrictions !== false) {
    // Exclude horeca during restricted hours
    where.lead.niche = { not: 'horeca' };
  }
  
  if (filters.providers && filters.providers.length > 0) {
    where.lead.currentProvider = { in: filters.providers };
  }
  
  // Get next queue item
  const queueItem = await prisma.queueItem.findFirst({
    where,
    include: {
      lead: true,
    },
    orderBy: [
      { priority: 'desc' },
      { scheduledAt: 'asc' },
    ],
  });
  
  if (!queueItem) {
    return null;
  }
  
  // Get call history for this lead
  const [lastCall, totalCalls] = await Promise.all([
    prisma.callLog.findFirst({
      where: { leadId: queueItem.leadId },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    }),
    prisma.callLog.count({
      where: { leadId: queueItem.leadId },
    }),
  ]);
  
  return {
    queueItem,
    callHistory: {
      lastCall: lastCall?.createdAt || null,
      totalCalls,
    },
  };
}

/**
 * Check if a lead can be called based on consent and doNotCall settings
 */
export function canCallLead(lead: Lead): { allowed: boolean; reason?: string } {
  if (lead.doNotCall) {
    return { allowed: false, reason: 'Lead has doNotCall flag set' };
  }
  
  if (!lead.consentPhone) {
    return { allowed: false, reason: 'Lead has not consented to phone calls' };
  }
  
  return { allowed: true };
}

/**
 * Check if lead was called recently (within 2 hours)
 */
export async function wasCalledRecently(leadId: string): Promise<boolean> {
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
  
  const recentCall = await prisma.callLog.findFirst({
    where: {
      leadId,
      createdAt: { gte: twoHoursAgo },
    },
  });
  
  return !!recentCall;
}

/**
 * Mark queue item as completed
 */
export async function completeQueueItem(queueItemId: string): Promise<void> {
  await prisma.queueItem.update({
    where: { id: queueItemId },
    data: { status: 'completed' },
  });
}

/**
 * Skip queue item and reschedule
 */
export async function skipQueueItem(
  queueItemId: string,
  rescheduleHours: number = 2
): Promise<void> {
  await prisma.queueItem.update({
    where: { id: queueItemId },
    data: {
      scheduledAt: new Date(Date.now() + rescheduleHours * 60 * 60 * 1000),
    },
  });
}
