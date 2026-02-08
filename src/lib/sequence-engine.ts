import { PrismaClient, QueueItem } from '@prisma/client';

const prisma = new PrismaClient();

export type SequenceType = 'quote' | 'activation';

interface SequenceConfig {
  type: SequenceType;
  items: {
    type: 'EMAIL' | 'WHATSAPP' | 'CALL' | 'VISIT';
    daysFromStart: number;
    priority: number;
    description: string;
    condition?: (leadData: any) => boolean;
  }[];
}

/**
 * Quote follow-up sequence
 * - Dag 0: Email versturen (als consentEmail)
 * - Dag 3: WhatsApp taak (geen auto-send, alleen taak in queue)
 * - Dag 7: Call taak in queue
 * - Dag 30: Check-in call (clawback preventie)
 */
const quoteSequence: SequenceConfig = {
  type: 'quote',
  items: [
    {
      type: 'EMAIL',
      daysFromStart: 0,
      priority: 2,
      description: 'Verstuur offerte email',
      condition: (lead) => lead.consentEmail,
    },
    {
      type: 'WHATSAPP',
      daysFromStart: 3,
      priority: 1,
      description: 'WhatsApp herinnering sturen',
      condition: (lead) => lead.consentWhatsApp,
    },
    {
      type: 'CALL',
      daysFromStart: 7,
      priority: 1,
      description: 'Opvolggesprek - interesse check',
      condition: (lead) => lead.consentPhone,
    },
    {
      type: 'CALL',
      daysFromStart: 30,
      priority: 0,
      description: 'Check-in call - Clawback preventie',
      condition: (lead) => lead.consentPhone,
    },
  ],
};

/**
 * Activation follow-up sequence
 * - Dag 0: Welkomstmail
 * - Dag 30: Eerste factuur check
 * - Dag 150: 5-maand check (vóór clawback moment)
 */
const activationSequence: SequenceConfig = {
  type: 'activation',
  items: [
    {
      type: 'EMAIL',
      daysFromStart: 0,
      priority: 2,
      description: 'Welkomstmail versturen',
      condition: (lead) => lead.consentEmail,
    },
    {
      type: 'CALL',
      daysFromStart: 30,
      priority: 1,
      description: 'Eerste factuur check',
      condition: (lead) => lead.consentPhone,
    },
    {
      type: 'CALL',
      daysFromStart: 150,
      priority: 2,
      description: '5-maand check - Clawback preventie',
      condition: (lead) => lead.consentPhone,
    },
  ],
};

/**
 * Calculate scheduled date from days offset
 */
function calculateScheduledDate(daysFromStart: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + daysFromStart);
  // Set to 9:00 AM business hours
  date.setHours(9, 0, 0, 0);
  return date;
}

/**
 * Create quote follow-up sequence
 */
export async function createQuoteSequence(
  leadId: string,
  consultantId: string
): Promise<QueueItem[]> {
  // Get lead data for condition checking
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

  const createdItems: QueueItem[] = [];

  for (const item of quoteSequence.items) {
    // Check condition if present
    if (item.condition && !item.condition(lead)) {
      continue; // Skip this item if condition not met
    }

    const queueItem = await prisma.queueItem.create({
      data: {
        leadId,
        consultantId,
        type: item.type,
        status: 'pending',
        scheduledAt: calculateScheduledDate(item.daysFromStart),
        priority: item.priority,
      },
    });

    createdItems.push(queueItem);
  }

  return createdItems;
}

/**
 * Create activation follow-up sequence
 */
export async function createActivationSequence(
  leadId: string,
  consultantId: string
): Promise<QueueItem[]> {
  // Get lead data for condition checking
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    select: {
      consentEmail: true,
      consentPhone: true,
    },
  });

  if (!lead) {
    throw new Error(`Lead not found: ${leadId}`);
  }

  const createdItems: QueueItem[] = [];

  for (const item of activationSequence.items) {
    // Check condition if present
    if (item.condition && !item.condition(lead)) {
      continue; // Skip this item if condition not met
    }

    const queueItem = await prisma.queueItem.create({
      data: {
        leadId,
        consultantId,
        type: item.type,
        status: 'pending',
        scheduledAt: calculateScheduledDate(item.daysFromStart),
        priority: item.priority,
      },
    });

    createdItems.push(queueItem);
  }

  return createdItems;
}

/**
 * Get sequence details for display
 */
export function getSequenceDetails(type: SequenceType): SequenceConfig {
  return type === 'quote' ? quoteSequence : activationSequence;
}

/**
 * Cancel pending sequence items for a lead
 */
export async function cancelSequence(
  leadId: string,
  consultantId: string
): Promise<number> {
  const result = await prisma.queueItem.updateMany({
    where: {
      leadId,
      consultantId,
      status: 'pending',
    },
    data: {
      status: 'cancelled',
    },
  });

  return result.count;
}

/**
 * Get active sequences for a consultant
 */
export async function getActiveSequences(
  consultantId: string
): Promise<{ leadId: string; items: QueueItem[] }[]> {
  const items = await prisma.queueItem.findMany({
    where: {
      consultantId,
      status: 'pending',
    },
    orderBy: {
      scheduledAt: 'asc',
    },
  });

  // Group by lead
  const grouped = items.reduce((acc, item) => {
    const existing = acc.find(g => g.leadId === item.leadId);
    if (existing) {
      existing.items.push(item);
    } else {
      acc.push({ leadId: item.leadId, items: [item] });
    }
    return acc;
  }, [] as { leadId: string; items: QueueItem[] }[]);

  return grouped;
}

/**
 * Create custom sequence for specific needs
 */
export async function createCustomSequence(
  leadId: string,
  consultantId: string,
  items: {
    type: 'EMAIL' | 'WHATSAPP' | 'CALL' | 'VISIT' | 'CALLBACK';
    daysFromStart: number;
    priority: number;
    description?: string;
  }[]
): Promise<QueueItem[]> {
  const createdItems: QueueItem[] = [];

  for (const item of items) {
    const queueItem = await prisma.queueItem.create({
      data: {
        leadId,
        consultantId,
        type: item.type,
        status: 'pending',
        scheduledAt: calculateScheduledDate(item.daysFromStart),
        priority: item.priority,
      },
    });

    createdItems.push(queueItem);
  }

  return createdItems;
}
