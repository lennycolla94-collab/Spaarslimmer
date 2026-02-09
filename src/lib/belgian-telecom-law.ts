/**
 * Belgische Telecomwet Compliance
 * Wet van 13 juni 2005 betreffende elektronische communicatie
 */

import { prisma } from './prisma';

// Beluren volgens Belgische wet
export const CALLING_HOURS = {
  // Maandag - Vrijdag
  weekday: {
    start: 9, // 09:00
    end: 20,  // 20:00
  },
  // Zaterdag
  saturday: {
    start: 10, // 10:00
    end: 16,   // 16:00
  },
  // Zondag en feestdagen: geen calls
};

// Feestdagen in België
export const BELGIAN_HOLIDAYS = [
  '01-01', // Nieuwjaar
  '04-27', // Koningsdag (variabel)
  '05-01', // Dag van de Arbeid
  '05-18', // Hemelvaart (variabel)
  '05-28', // Pinksteren (variabel)
  '07-21', // Nationale Feestdag
  '08-15', // Onze-Lieve-Vrouw-Hemelvaart
  '11-01', // Allerheiligen
  '11-11', // Wapenstilstand
  '12-25', // Kerstmis
];

/**
 * Check of het momenteel toegestaan is om te bellen
 */
export function isAllowedCallingTime(): { allowed: boolean; reason?: string } {
  const now = new Date();
  const day = now.getDay(); // 0 = zondag, 6 = zaterdag
  const hour = now.getHours();
  const monthDay = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  
  // Check feestdagen
  if (BELGIAN_HOLIDAYS.includes(monthDay)) {
    return {
      allowed: false,
      reason: 'Vandaag is een feestdag. Bellen is niet toegestaan.',
    };
  }
  
  // Zondag: geen calls
  if (day === 0) {
    return {
      allowed: false,
      reason: 'Op zondag is bellen niet toegestaan.',
    };
  }
  
  // Zaterdag: beperkte uren
  if (day === 6) {
    if (hour < CALLING_HOURS.saturday.start || hour >= CALLING_HOURS.saturday.end) {
      return {
        allowed: false,
        reason: `Op zaterdag mag je alleen bellen tussen ${CALLING_HOURS.saturday.start}:00 en ${CALLING_HOURS.saturday.end}:00.`,
      };
    }
    return { allowed: true };
  }
  
  // Weekdagen
  if (hour < CALLING_HOURS.weekday.start || hour >= CALLING_HOURS.weekday.end) {
    return {
      allowed: false,
      reason: `Op weekdagen mag je alleen bellen tussen ${CALLING_HOURS.weekday.start}:00 en ${CALLING_HOURS.weekday.end}:00.`,
    };
  }
  
  return { allowed: true };
}

/**
 * Check of een lead op het "Niet Bellen" register staat
 * In productie: koppel met officiële FOD Economie API
 */
export async function checkDoNotCallRegister(phone: string): Promise<boolean> {
  // TODO: Implementeer koppeling met FOD Economie "Niet Bellen" register
  // https://economie.fgov.be/nl/themas/telecommunicatie/niet-bellen
  
  // Voor nu: check onze eigen database
  const lead = await prisma.lead.findFirst({
    where: {
      phoneHash: Buffer.from(phone).toString('base64'), // Simplified hash
    },
    select: {
      doNotCall: true,
    },
  });
  
  return lead?.doNotCall ?? false;
}

/**
 * Check alle restricties voor het bellen van een lead
 */
export async function canCallLead(leadId: string): Promise<{ allowed: boolean; reason?: string }> {
  // 1. Check beluren
  const timeCheck = isAllowedCallingTime();
  if (!timeCheck.allowed) {
    return timeCheck;
  }
  
  // 2. Haal lead op
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    select: {
      phone: true,
      doNotCall: true,
      consentPhone: true,
      lawfulBasis: true,
    },
  });
  
  if (!lead) {
    return {
      allowed: false,
      reason: 'Lead niet gevonden.',
    };
  }
  
  // 3. Check doNotCall flag
  if (lead.doNotCall) {
    return {
      allowed: false,
      reason: 'Deze lead heeft aangegeven niet gebeld te willen worden.',
    };
  }
  
  // 4. Check consent
  if (lead.lawfulBasis === 'CONSENT' && !lead.consentPhone) {
    return {
      allowed: false,
      reason: 'Deze lead heeft geen toestemming gegeven voor telefonisch contact.',
    };
  }
  
  // 5. Check "Niet Bellen" register (FOD Economie)
  // const inRegister = await checkDoNotCallRegister(lead.phone);
  // if (inRegister) {
  //   return {
  //     allowed: false,
  //     reason: 'Dit nummer staat op het "Niet Bellen" register van de FOD Economie.',
  //   };
  // }
  
  return { allowed: true };
}

/**
 * Log een call poging (voor compliance auditing)
 */
export async function logCallAttempt(
  leadId: string,
  consultantId: string,
  allowed: boolean,
  reason?: string
): Promise<void> {
  await prisma.auditLog.create({
    data: {
      userId: consultantId,
      action: allowed ? 'CALL_INITIATED' : 'CALL_BLOCKED',
      entityType: 'Lead',
      entityId: leadId,
      newValues: JSON.stringify({
        allowed,
        reason,
        timestamp: new Date().toISOString(),
      }),
    },
  });
}

/**
 * Opt-out een lead (toevoegen aan doNotCall)
 */
export async function optOutLead(leadId: string, reason?: string): Promise<void> {
  await prisma.lead.update({
    where: { id: leadId },
    data: {
      doNotCall: true,
      consentPhone: false,
    },
  });
  
  // Log de opt-out
  await prisma.auditLog.create({
    data: {
      userId: 'SYSTEM',
      action: 'LEAD_OPT_OUT',
      entityType: 'Lead',
      entityId: leadId,
      newValues: JSON.stringify({
        reason,
        timestamp: new Date().toISOString(),
      }),
    },
  });
}

/**
 * Get next allowed calling time
 */
export function getNextAllowedCallingTime(): Date {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  
  // Als het nu mag, return now
  if (isAllowedCallingTime().allowed) {
    return now;
  }
  
  // Vind het volgende toegestane tijdstip
  const next = new Date(now);
  
  // Zondag -> Maandag 09:00
  if (day === 0) {
    next.setDate(next.getDate() + 1);
    next.setHours(9, 0, 0, 0);
    return next;
  }
  
  // Zaterdag na 16:00 -> Maandag 09:00
  if (day === 6 && hour >= 16) {
    next.setDate(next.getDate() + 2);
    next.setHours(9, 0, 0, 0);
    return next;
  }
  
  // Weekdag na 20:00 -> volgende dag 09:00
  if (hour >= 20) {
    next.setDate(next.getDate() + 1);
    next.setHours(9, 0, 0, 0);
    return next;
  }
  
  // Weekdag voor 09:00 -> vandaag 09:00
  if (hour < 9) {
    next.setHours(9, 0, 0, 0);
    return next;
  }
  
  return next;
}
