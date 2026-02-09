/**
 * Follow-up Engine
 * Automatische opvolgtrajecten na offerte verzending
 * Volgens masterprompt: X dagen mail, Y dagen WhatsApp, Z dagen call-task
 */

// ============================================================================
// TYPES
// ============================================================================

export type FollowUpType = 'EMAIL' | 'WHATSAPP' | 'CALL' | 'VISIT';
export type FollowUpStatus = 'PENDING' | 'SENT' | 'COMPLETED' | 'CANCELLED';
export type SequenceType = 'QUOTE_SENT' | 'NEW_CUSTOMER' | 'EXISTING_CUSTOMER' | 'CLAWBACK_PREVENTION';

export interface FollowUpStep {
  id: string;
  type: FollowUpType;
  daysAfterTrigger: number;
  title: string;
  description: string;
  template?: string;
  status: FollowUpStatus;
  scheduledAt: Date;
  completedAt?: Date;
  notes?: string;
}

export interface FollowUpSequence {
  id: string;
  type: SequenceType;
  name: string;
  description: string;
  triggerEvent: string;
  steps: FollowUpStep[];
  createdAt: Date;
  consultantId: string;
  leadId: string;
  isActive: boolean;
}

// ============================================================================
// STANDAARD SEQUENCES
// ============================================================================

/**
 * Sequence 1: Na offerte versturen (Quote Chasing)
 * X=1: Herinneringsmail
 * Y=3: WhatsApp
 * Z=7: Call task
 */
export const QUOTE_FOLLOW_UP_SEQUENCE: Omit<FollowUpSequence, 'id' | 'createdAt' | 'consultantId' | 'leadId'> = {
  type: 'QUOTE_SENT',
  name: 'Offerte Opvolging',
  description: 'Standaard opvolgtraject na versturen offerte',
  triggerEvent: 'QUOTE_SENT',
  isActive: true,
  steps: [
    {
      id: 'step-1',
      type: 'EMAIL',
      daysAfterTrigger: 1,
      title: 'Herinneringsmail offerte',
      description: 'Automatische mail met samenvatting van besparingen',
      template: 'QUOTE_REMINDER',
      status: 'PENDING',
      scheduledAt: new Date(), // Wordt overschreven bij creatie
    },
    {
      id: 'step-2',
      type: 'WHATSAPP',
      daysAfterTrigger: 3,
      title: 'WhatsApp bericht',
      description: 'Kort, menselijk bericht ter herinnering',
      template: 'QUOTE_WHATSAPP',
      status: 'PENDING',
      scheduledAt: new Date(),
    },
    {
      id: 'step-3',
      type: 'CALL',
      daysAfterTrigger: 7,
      title: 'Opvolgbellen offerte',
      description: 'Bel om te polsen naar beslissing',
      status: 'PENDING',
      scheduledAt: new Date(),
    },
    {
      id: 'step-4',
      type: 'EMAIL',
      daysAfterTrigger: 14,
      title: 'Laatste herinnering',
      description: 'Laatste mail voor deze offerte vervalt',
      template: 'QUOTE_FINAL',
      status: 'PENDING',
      scheduledAt: new Date(),
    },
  ],
};

/**
 * Sequence 2: Nieuwe klant (Retention)
 * Touchpoints rond activatie en eerste factuur
 */
export const NEW_CUSTOMER_SEQUENCE: Omit<FollowUpSequence, 'id' | 'createdAt' | 'consultantId' | 'leadId'> = {
  type: 'NEW_CUSTOMER',
  name: 'Nieuwe Klant Begeleiding',
  description: 'Opvolging na activatie nieuwe klant',
  triggerEvent: 'SERVICE_ACTIVATED',
  isActive: true,
  steps: [
    {
      id: 'step-1',
      type: 'CALL',
      daysAfterTrigger: 3,
      title: 'Welkomstcall',
      description: 'Check of alles goed werkt na activatie',
      status: 'PENDING',
      scheduledAt: new Date(),
    },
    {
      id: 'step-2',
      type: 'EMAIL',
      daysAfterTrigger: 7,
      title: 'Eerste factuur info',
      description: 'Uitleg over eerste factuur en wat te verwachten',
      template: 'FIRST_INVOICE',
      status: 'PENDING',
      scheduledAt: new Date(),
    },
    {
      id: 'step-3',
      type: 'CALL',
      daysAfterTrigger: 21,
      title: '3-weken check',
      description: 'Check tevredenheid en eventuele problemen',
      status: 'PENDING',
      scheduledAt: new Date(),
    },
    {
      id: 'step-4',
      type: 'CALL',
      daysAfterTrigger: 150, // ~5 maanden
      title: 'Clawback preventie call',
      description: 'Belangrijke call voor 6-maanden clawback moment!',
      status: 'PENDING',
      scheduledAt: new Date(),
    },
  ],
};

/**
 * Sequence 3: Bestaande klant (Periodic checkup)
 */
export const EXISTING_CUSTOMER_SEQUENCE: Omit<FollowUpSequence, 'id' | 'createdAt' | 'consultantId' | 'leadId'> = {
  type: 'EXISTING_CUSTOMER',
  name: 'Periodieke Check-up',
  description: 'Jaarlijkse check-up bestaande klant',
  triggerEvent: 'MANUAL_START',
  isActive: true,
  steps: [
    {
      id: 'step-1',
      type: 'EMAIL',
      daysAfterTrigger: 0,
      title: 'Jaarlijkse check-up uitnodiging',
      description: 'Mail om check-up call in te plannen',
      template: 'CHECKUP_INVITE',
      status: 'PENDING',
      scheduledAt: new Date(),
    },
    {
      id: 'step-2',
      type: 'CALL',
      daysAfterTrigger: 7,
      title: 'Check-up call',
      description: 'Tevredenheid check en upsell mogelijkheden',
      status: 'PENDING',
      scheduledAt: new Date(),
    },
  ],
};

/**
 * Sequence 4: Clawback Prevention (specifiek voor risico-cases)
 */
export const CLAWBACK_PREVENTION_SEQUENCE: Omit<FollowUpSequence, 'id' | 'createdAt' | 'consultantId' | 'leadId'> = {
  type: 'CLAWBACK_PREVENTION',
  name: 'Clawback Preventie',
  description: 'Intensieve opvolging voor klanten die dreigen op te zeggen',
  triggerEvent: 'CANCELLATION_RISK',
  isActive: true,
  steps: [
    {
      id: 'step-1',
      type: 'CALL',
      daysAfterTrigger: 0,
      title: 'Direct contact',
      description: 'Bel onmiddellijk om reden te achterhalen',
      status: 'PENDING',
      scheduledAt: new Date(),
    },
    {
      id: 'step-2',
      type: 'EMAIL',
      daysAfterTrigger: 1,
      title: 'Oplossingsmail',
      description: 'Mail met oplossingen voor hun probleem',
      template: 'RETENTION_OFFER',
      status: 'PENDING',
      scheduledAt: new Date(),
    },
    {
      id: 'step-3',
      type: 'CALL',
      daysAfterTrigger: 3,
      title: 'Vervolgcall',
      description: 'Check of oplossing geholpen heeft',
      status: 'PENDING',
      scheduledAt: new Date(),
    },
  ],
};

// ============================================================================
// SEQUENCE FACTORY
// ============================================================================

export function createSequence(
  type: SequenceType,
  consultantId: string,
  leadId: string,
  triggerDate: Date = new Date()
): FollowUpSequence {
  const template = getSequenceTemplate(type);
  
  // Bereken datums voor alle steps
  const steps: FollowUpStep[] = template.steps.map(step => ({
    ...step,
    id: `step-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    scheduledAt: addDays(triggerDate, step.daysAfterTrigger),
    status: 'PENDING' as FollowUpStatus,
  }));
  
  return {
    ...template,
    id: `seq-${Date.now()}`,
    createdAt: new Date(),
    consultantId,
    leadId,
    steps,
  };
}

function getSequenceTemplate(type: SequenceType): typeof QUOTE_FOLLOW_UP_SEQUENCE {
  switch (type) {
    case 'QUOTE_SENT':
      return QUOTE_FOLLOW_UP_SEQUENCE;
    case 'NEW_CUSTOMER':
      return NEW_CUSTOMER_SEQUENCE;
    case 'EXISTING_CUSTOMER':
      return EXISTING_CUSTOMER_SEQUENCE;
    case 'CLAWBACK_PREVENTION':
      return CLAWBACK_PREVENTION_SEQUENCE;
    default:
      return QUOTE_FOLLOW_UP_SEQUENCE;
  }
}

// ============================================================================
// HELPER FUNCTIES
// ============================================================================

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Haal alle pending taken op voor een consultant
 */
export function getPendingTasks(
  sequences: FollowUpSequence[],
  consultantId: string,
  date: Date = new Date()
): Array<{
  sequenceId: string;
  sequenceName: string;
  leadId: string;
  step: FollowUpStep;
}> {
  const tasks: Array<{
    sequenceId: string;
    sequenceName: string;
    leadId: string;
    step: FollowUpStep;
  }> = [];
  
  for (const sequence of sequences) {
    if (sequence.consultantId !== consultantId || !sequence.isActive) continue;
    
    for (const step of sequence.steps) {
      if (step.status === 'PENDING' && step.scheduledAt <= date) {
        tasks.push({
          sequenceId: sequence.id,
          sequenceName: sequence.name,
          leadId: sequence.leadId,
          step,
        });
      }
    }
  }
  
  // Sorteer op scheduled datum
  return tasks.sort((a, b) => 
    a.step.scheduledAt.getTime() - b.step.scheduledAt.getTime()
  );
}

/**
 * Markeer een step als completed
 */
export function completeStep(
  sequence: FollowUpSequence,
  stepId: string,
  notes?: string
): FollowUpSequence {
  return {
    ...sequence,
    steps: sequence.steps.map(step => 
      step.id === stepId
        ? { ...step, status: 'COMPLETED' as FollowUpStatus, completedAt: new Date(), notes }
        : step
    ),
  };
}

/**
 * Annuleer een sequence
 */
export function cancelSequence(sequence: FollowUpSequence): FollowUpSequence {
  return {
    ...sequence,
    isActive: false,
    steps: sequence.steps.map(step => 
      step.status === 'PENDING' 
        ? { ...step, status: 'CANCELLED' as FollowUpStatus }
        : step
    ),
  };
}

// ============================================================================
// EMAIL & WHATSAPP TEMPLATES
// ============================================================================

export const FOLLOW_UP_TEMPLATES: Record<string, { subject?: string; body: string }> = {
  QUOTE_REMINDER: {
    subject: 'Herinnering: uw offerte wacht op uw goedkeuring',
    body: `Beste klant,

Ik wilde even bij u polsen naar de offerte die ik u heb toegestuurd.

💰 U bespaart [BESPARING] per maand
📊 Dat is [6_MAANDEN] op 6 maanden
📊 En [24_MAANDEN] op 2 jaar

Heeft u nog vragen? Bel me gerust op [TELEFOON].

Met vriendelijke groeten,
[CONSULTANT_NAAM]`,
  },
  
  QUOTE_WHATSAPP: {
    body: `Hallo! 👋 Ik wilde even checken of u de offerte heeft ontvangen? U bespaart [BESPARING]/maand! Interesse om verder te praten? 📞`,
  },
  
  QUOTE_FINAL: {
    subject: 'Laatste herinnering: uw offerte vervalt binnenkort',
    body: `Beste klant,

Dit is een vriendelijke herinnering dat uw offerte binnenkort vervalt.

Bespaar nu [BESPARING] per maand!

Laat het me weten als u nog vragen heeft.

Met vriendelijke groeten,
[CONSULTANT_NAAM]`,
  },
  
  FIRST_INVOICE: {
    subject: 'Uw eerste factuur - wat kunt u verwachten',
    body: `Beste klant,

Gefeliciteerd met uw nieuwe diensten! 🎉

Uw eerste factuur komt eraan. Hier wat u moet weten:
- Eerste factuur kan iets hoger zijn ivm aansluitkosten
- Vanaf maand 2 betaalt u het normale bedrag van [MAANDBEDRAG]

Vragen? Bel me gerust!

[CONSULTANT_NAAM]`,
  },
  
  RETENTION_OFFER: {
    subject: 'Laten we samen naar een oplossing zoeken',
    body: `Beste klant,

Ik begrijp dat u overweegt op te zeggen. Dat vind ik jammer om te horen.

Kunnen we even bellen? Misschien kan ik:
- Een beter passend aanbod maken
- Uw vragen beantwoorden
- Een oplossing vinden voor het probleem

Bel me op [TELEFOON].

[CONSULTANT_NAAM]`,
  },
};
