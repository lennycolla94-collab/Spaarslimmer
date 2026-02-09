/**
 * Call Queue Engine
 * Het hart van de dagelijkse workflow voor consultants
 * Filters, click-to-call, call logging, en callback scheduling
 */

// ============================================================================
// TYPES
// ============================================================================

export type CallResult = 'NO_ANSWER' | 'CONVERSATION' | 'VOICEMAIL' | 'WRONG_NUMBER' | 'CALLBACK_REQUESTED' | 'NOT_INTERESTED' | 'APPOINTMENT_MADE' | 'QUOTE_SENT';
export type LeadStatus = 'NEW' | 'IN_PROGRESS' | 'FOLLOW_UP' | 'CONVERTED' | 'LOST' | 'INVALID';
export type LeadSource = 'IMPORT' | 'REFERRAL' | 'WEBSITE' | 'COLD_CALL';

export interface Lead {
  id: string;
  consultantId: string;
  
  // Contact info
  companyName: string;
  contactName: string;
  phone: string;
  email?: string;
  
  // Adres (voor filtering)
  address: {
    street: string;
    city: string;
    postalCode: string;
    province: string; // Antwerpen, Limburg, etc.
  };
  
  // Segmentatie
  niche: string; // frituur, bakker, zelfstandige, residentieel
  currentProvider?: string; // telenet, orange, proximus
  currentEnergyProvider?: string; // engie, luminus
  
  // Status
  status: LeadStatus;
  source: LeadSource;
  priority: number; // 1-10, hoger = belangrijker
  
  // Call history
  calls: CallLog[];
  lastCallDate?: Date;
  nextCallDate?: Date;
  callCount: number;
  
  // Offerte
  quoteSent?: boolean;
  quoteDate?: Date;
  
  // Metadata
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CallLog {
  id: string;
  leadId: string;
  consultantId: string;
  
  // Call details
  startedAt: Date;
  endedAt?: Date;
  duration?: number; // in seconden
  
  // Resultaat
  result: CallResult;
  notes: string;
  
  // Follow-up
  followUpDate?: Date;
  followUpType?: 'CALL' | 'VISIT' | 'EMAIL';
}

export interface QueueFilter {
  // Geografisch
  provinces?: string[]; // ['Antwerpen', 'Limburg']
  cities?: string[];
  
  // Segmentatie
  niches?: string[]; // ['frituur', 'bakker']
  providers?: string[]; // ['telenet', 'orange']
  
  // Status
  status?: LeadStatus[];
  excludeRecentCalls?: number; // Aantal uren sinds laatste call
  
  // Tijdslimieten
  callBeforeHour?: number; // Niet bellen na dit uur
  callAfterHour?: number; // Niet bellen voor dit uur
  excludeWeekends?: boolean;
}

export interface QueueItem {
  lead: Lead;
  priority: number;
  reason: string; // Waarom deze lead nu?
}

// ============================================================================
// QUEUE FILTERS
// ============================================================================

/**
 * Filter leads op basis van queue filters
 */
export function filterLeads(
  leads: Lead[],
  filter: QueueFilter,
  now: Date = new Date()
): Lead[] {
  return leads.filter(lead => {
    // Alleen leads van huidige consultant
    // (wordt normaal al gefilterd in DB query)
    
    // Provincie filter
    if (filter.provinces?.length && !filter.provinces.includes(lead.address.province)) {
      return false;
    }
    
    // Stad filter
    if (filter.cities?.length && !filter.cities.includes(lead.address.city)) {
      return false;
    }
    
    // Niche filter
    if (filter.niches?.length && !filter.niches.includes(lead.niche)) {
      return false;
    }
    
    // Provider filter
    if (filter.providers?.length && !filter.providers.includes(lead.currentProvider || '')) {
      return false;
    }
    
    // Status filter
    if (filter.status?.length && !filter.status.includes(lead.status)) {
      return false;
    }
    
    // Niet recent gebeld
    if (filter.excludeRecentCalls && lead.lastCallDate) {
      const hoursSinceLastCall = (now.getTime() - lead.lastCallDate.getTime()) / (1000 * 60 * 60);
      if (hoursSinceLastCall < filter.excludeRecentCalls) {
        return false;
      }
    }
    
    // Tijdslimieten (bijv. geen horeca tussen 18-20u)
    const currentHour = now.getHours();
    if (filter.callAfterHour && currentHour < filter.callAfterHour) {
      return false;
    }
    if (filter.callBeforeHour && currentHour >= filter.callBeforeHour) {
      return false;
    }
    
    // Weekend uitsluiten
    if (filter.excludeWeekends) {
      const day = now.getDay();
      if (day === 0 || day === 6) {
        return false;
      }
    }
    
    return true;
  });
}

/**
 * Sorteer leads op prioriteit voor de queue
 */
export function sortQueue(leads: Lead[]): QueueItem[] {
  const items: QueueItem[] = leads.map(lead => {
    let priority = lead.priority;
    let reason = 'Standaard prioriteit';
    
    // Hogere prioriteit als:
    
    // 1. Nog nooit gebeld
    if (lead.callCount === 0) {
      priority += 5;
      reason = 'Nog nooit gebeld';
    }
    
    // 2. Offerte verstuurd maar geen reactie (> 2 dagen)
    if (lead.quoteSent && lead.quoteDate) {
      const daysSinceQuote = (Date.now() - lead.quoteDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceQuote > 2 && daysSinceQuote < 14) {
        priority += 10;
        reason = 'Offerte opvolging (+' + Math.floor(daysSinceQuote) + ' dagen)';
      }
    }
    
    // 3. Heeft follow-up datum die nu is
    if (lead.nextCallDate && lead.nextCallDate <= new Date()) {
      priority += 8;
      reason = 'Geplande callback';
    }
    
    // 4. Nieuwe lead (< 24u)
    const hoursSinceCreated = (Date.now() - lead.createdAt.getTime()) / (1000 * 60 * 60);
    if (hoursSinceCreated < 24) {
      priority += 3;
      reason = 'Nieuwe lead';
    }
    
    // 5. Meerdere gemiste calls (persistentie loont)
    if (lead.callCount >= 3 && lead.status === 'IN_PROGRESS') {
      priority += 2;
      reason = 'Meerdere calls geprobeerd';
    }
    
    return { lead, priority, reason };
  });
  
  // Sorteer op prioriteit (hoogste eerst)
  return items.sort((a, b) => b.priority - a.priority);
}

/**
 * Haal de volgende lead uit de queue
 */
export function getNextLead(
  leads: Lead[],
  filter: QueueFilter,
  now: Date = new Date()
): QueueItem | null {
  const filtered = filterLeads(leads, filter, now);
  const sorted = sortQueue(filtered);
  return sorted[0] || null;
}

// ============================================================================
// CALL HANDLING
// ============================================================================

export interface CallAction {
  result: CallResult;
  notes: string;
  followUpDate?: Date;
  followUpType?: 'CALL' | 'VISIT' | 'EMAIL';
}

/**
 * Verwerk een call resultaat
 */
export function processCall(
  lead: Lead,
  consultantId: string,
  action: CallAction,
  duration?: number
): { lead: Lead; callLog: CallLog } {
  const now = new Date();
  
  // Maak call log
  const callLog: CallLog = {
    id: `call-${Date.now()}`,
    leadId: lead.id,
    consultantId,
    startedAt: now,
    endedAt: duration ? new Date(now.getTime() + duration * 1000) : undefined,
    duration,
    result: action.result,
    notes: action.notes,
    followUpDate: action.followUpDate,
    followUpType: action.followUpType,
  };
  
  // Update lead
  const updatedLead: Lead = {
    ...lead,
    calls: [...lead.calls, callLog],
    lastCallDate: now,
    nextCallDate: action.followUpDate,
    callCount: lead.callCount + 1,
    notes: lead.notes + '\n' + now.toISOString() + ': ' + action.notes,
    updatedAt: now,
  };
  
  // Update status op basis van resultaat
  switch (action.result) {
    case 'APPOINTMENT_MADE':
    case 'QUOTE_SENT':
      updatedLead.status = 'FOLLOW_UP';
      break;
    case 'NOT_INTERESTED':
      updatedLead.status = 'LOST';
      break;
    case 'WRONG_NUMBER':
      updatedLead.status = 'INVALID';
      break;
    case 'CONVERSATION':
      if (updatedLead.status === 'NEW') {
        updatedLead.status = 'IN_PROGRESS';
      }
      break;
  }
  
  // Als er een offerte is verstuurd
  if (action.result === 'QUOTE_SENT') {
    updatedLead.quoteSent = true;
    updatedLead.quoteDate = now;
  }
  
  return { lead: updatedLead, callLog };
}

// ============================================================================
// CLICK-TO-CALL
// ============================================================================

/**
 * Genereer click-to-call link
 * Gebruik tel: protocol voor mobiel
 */
export function getClickToCallUrl(phone: string): string {
  // Verwijder spaties en speciale karakters
  const cleanPhone = phone.replace(/[\s\-\.]/g, '');
  return `tel:${cleanPhone}`;
}

/**
 * Formatteer telefoonnummer voor weergave
 */
export function formatPhoneNumber(phone: string): string {
  // Belgisch formaat: 0472 12 34 56 of 03 123 45 67
  const clean = phone.replace(/[\s\-\.]/g, '');
  
  if (clean.startsWith('0') && clean.length === 10) {
    // Mobiel: 0472 12 34 56
    if (clean.startsWith('04')) {
      return `${clean.slice(0, 4)} ${clean.slice(4, 6)} ${clean.slice(6, 8)} ${clean.slice(8)}`;
    }
    // Vast: 03 123 45 67
    return `${clean.slice(0, 2)} ${clean.slice(2, 5)} ${clean.slice(5, 7)} ${clean.slice(7)}`;
  }
  
  return phone;
}

// ============================================================================
// STANDAARD FILTERS
// ============================================================================

export const DEFAULT_QUEUE_FILTERS: Record<string, QueueFilter> = {
  // Alleen Antwerpen, geen horeca na 18u
  ANTWERPEN: {
    provinces: ['Antwerpen'],
    excludeRecentCalls: 24,
    callBeforeHour: 18,
    excludeWeekends: true,
  },
  
  // Frituren - alleen ochtend
  FRITUREN: {
    niches: ['frituur'],
    callAfterHour: 9,
    callBeforeHour: 15,
    excludeWeekends: true,
  },
  
  // Cold call sessie - alleen nieuwe leads
  NEW_LEADS: {
    status: ['NEW'],
    excludeRecentCalls: 168, // 1 week
    excludeWeekends: true,
  },
  
  // Opvolging offertes
  QUOTE_FOLLOW_UP: {
    status: ['FOLLOW_UP'],
    excludeRecentCalls: 48,
  },
  
  // Telenet klanten (switch target)
  TELENET_SWITCH: {
    providers: ['telenet'],
    excludeRecentCalls: 72,
    excludeWeekends: true,
  },
};

// ============================================================================
// STATS & RAPPORTAGE
// ============================================================================

export interface CallStats {
  totalCalls: number;
  totalDuration: number;
  averageDuration: number;
  results: Record<CallResult, number>;
  conversionRate: number; // % appointments/quotes
}

export function calculateCallStats(calls: CallLog[]): CallStats {
  const stats: CallStats = {
    totalCalls: calls.length,
    totalDuration: 0,
    averageDuration: 0,
    results: {
      NO_ANSWER: 0,
      CONVERSATION: 0,
      VOICEMAIL: 0,
      WRONG_NUMBER: 0,
      CALLBACK_REQUESTED: 0,
      NOT_INTERESTED: 0,
      APPOINTMENT_MADE: 0,
      QUOTE_SENT: 0,
    },
    conversionRate: 0,
  };
  
  let conversions = 0;
  
  for (const call of calls) {
    stats.results[call.result]++;
    if (call.duration) {
      stats.totalDuration += call.duration;
    }
    if (call.result === 'APPOINTMENT_MADE' || call.result === 'QUOTE_SENT') {
      conversions++;
    }
  }
  
  if (calls.length > 0) {
    stats.averageDuration = Math.round(stats.totalDuration / calls.length);
    stats.conversionRate = Math.round((conversions / calls.length) * 100);
  }
  
  return stats;
}
