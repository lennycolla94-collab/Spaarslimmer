# SmartV1 MLM Calculator Integratie - Samenvatting

## ✅ Voltooid

De volledige SmartSN Cockpit is nu geïntegreerd in `smartsn-crm` volgens de masterprompt.

---

## 📁 Nieuwe/Geüpdatete Bestanden

### 1. Commission Engine (`src/lib/calculator.ts`)
**Uitgebreid met:**
- `checkPQS()` - Checkt PQS behaald (12 ASP: 7 mobile, 3 energie, 2 internet)
- `checkQuarterlyQualification()` - Quarterly qualification check
- `calculateIncentivePoints()` - Winter Gift & Portugal Seminar punten
- `calculateInfinityBonus()` - Infinity bonus per PQS
- `calculateUplineFidelity()` - Upline fidelity verdeling
- `calculateCompleteDeal()` - **Hoofdfunctie voor offerte wizard**

### 2. Constants (`src/lib/constants.ts`)
**Bevat alle Smart regels:**
- `PRODUCT_TYPE` - Alle producten (Mobile, Internet, TV, Energie, Ketel)
- `CONSULTANT_RANK` - BC t/m Ambassador
- `RETAIL_RATES` - BC vs SC+ tarieven in cents
- `BONUS_AMOUNTS` - Convergentie, portability, SoHo bonussen
- `ASP_POINTS` - Active Smart Points per product
- `FIDELITY_RATES` - Maandelijkse fidelity per upline niveau
- `CLAWBACK_RATES` - <1mnd 100%, 1-6mnd 75%, >6mnd 25%
- `PQS_REQUIREMENTS` - 12 ASP, 7 mobile, 3 energie, 2 internet
- `INFINITY_BONUS_RATES` - €50-€300 per PQS

### 3. Tariff Engine (`src/lib/tariff-engine.ts`) - **NIEUW**
**Orange klantprijzen:**
- `INTERNET_PRICES` - Start €34,95, Zen €49,95, Giga €64,95
- `MOBILE_PRICES` - Child €12,95 t/m Unlimited €39,95
- `PACK_PRICES` - 2/3/4 GSM pack kortingen
- `DISCOUNTS` - Convergentie €10, 2de adres €10 levenslang
- `calculateTariff()` - Hoofdfunctie voor klantprijzen
- `recommendPlan()` - AI recommendatie op basis huidige kosten

### 4. Quote Wizard (`src/lib/quote-wizard.ts`) - **NIEUW**
**Combineert commissie + tarieven:**
- `generateQuote()` - Maakt complete offerte met:
  - Klantprijzen (maandbedrag, besparingen 6/24 maanden)
  - Consultant vergoedingen (directe commissie, fidelity, ASP)
  - PQS check
  - Incentive punten
- `prepareQuoteEmail()` - Email template
- `prepareQuoteWhatsApp()` - WhatsApp tekst

### 5. Follow-up Engine (`src/lib/followup-engine.ts`) - **NIEUW**
**Automatische opvolgtrajecten:**
- `QUOTE_FOLLOW_UP_SEQUENCE` - X=1 dag mail, Y=3 dagen WhatsApp, Z=7 dagen call
- `NEW_CUSTOMER_SEQUENCE` - Welkomstcall, eerste factuur, 5-maanden clawback preventie
- `EXISTING_CUSTOMER_SEQUENCE` - Jaarlijkse check-up
- `CLAWBACK_PREVENTION_SEQUENCE` - Intensieve retentie bij opzeg risico
- `createSequence()` - Maakt sequence aan voor lead
- `getPendingTasks()` - Haalt taken op voor call queue

### 6. Call Queue (`src/lib/call-queue.ts`) - **NIEUW**
**Dagelijkse workflow:**
- `filterLeads()` - Filters op provincie, niche, provider, tijdslimieten
- `sortQueue()` - Prioriteit: nieuwe leads → offerte opvolging → callbacks
- `getNextLead()` - Volgende lead uit queue
- `processCall()` - Verwerkt call resultaat
- `getClickToCallUrl()` - Tel: links voor mobiel
- `calculateCallStats()` - Conversie rates, call duration

---

## 🧪 Tests

**44 tests** valideren alle Smart regels:
```bash
npx jest src/tests/smart-rules.test.ts
```

Test categorieën:
- ✅ Retail Commissions (6 tests)
- ✅ Bonussen (6 tests)
- ✅ ASP (6 tests)
- ✅ PQS (3 tests)
- ✅ Fidelity (4 tests)
- ✅ Clawback (3 tests)
- ✅ Infinity Bonus (6 tests)
- ✅ Complete Scenarios (2 tests)
- ✅ Orange Tarieven (5 tests)
- ✅ Format Helpers (3 tests)

---

## 💡 Gebruiksvoorbeelden

### 1. Offerte Genereren
```typescript
import { generateQuote } from './lib/quote-wizard';
import { CONSULTANT_RANK } from './lib/calculator';

const quote = generateQuote({
  consultantRank: CONSULTANT_RANK.BC,
  customerName: 'Jan Jansen',
  currentMonthlyCost: 75.00,
  products: {
    internet: { plan: 'ZEN', isSecondAddress: false, hasEasySwitch: true },
    mobile: [
      { plan: 'MEDIUM', isPortability: true, isSoHo: false }
    ],
    tv: null,
    energie: null
  },
  hasMyComfort: false,
  wifiBoosters: 0
});

// Resultaat:
// quote.customer.monthlyTotal = "€59.95"
// quote.customer.savings6Months = "€90.30"
// quote.consultant.immediateCommission = "€82.00"
// quote.consultant.totalASP = 2.5
```

### 2. Call Queue
```typescript
import { getNextLead, filterLeads, DEFAULT_QUEUE_FILTERS } from './lib/call-queue';

// Filter leads
const filtered = filterLeads(leads, DEFAULT_QUEUE_FILTERS.ANTWERPEN);

// Volgende lead
const next = getNextLead(leads, {
  provinces: ['Antwerpen'],
  niches: ['frituur'],
  excludeRecentCalls: 24
});

// Click-to-call
window.location.href = getClickToCallUrl(next.lead.phone);
```

### 3. Follow-up Sequence Starten
```typescript
import { createSequence } from './lib/followup-engine';

// Na offerte versturen
const sequence = createSequence('QUOTE_SENT', consultantId, leadId);

// Automatisch aangemaakt:
// Dag 1: Email herinnering
// Dag 3: WhatsApp
// Dag 7: Call task
// Dag 14: Laatste email
```

### 4. PQS Check
```typescript
import { checkPQS } from './lib/calculator';

const pqs = checkPQS([
  { productType: PRODUCT_TYPE.MOBILE_MEDIUM, options: {} },
  // ... 7x mobile (7 ASP)
  { productType: PRODUCT_TYPE.ENERGIE_SOHO, options: {} },
  // ... 3x energie (3 ASP)
  { productType: PRODUCT_TYPE.INTERNET, options: {} },
  // ... 2x internet (2 ASP)
]);

if (pqs.achieved) {
  // €150 bonus voor consultant
  // €150 bonus voor sponsor (QS1)
}
```

---

## 📊 Smart Regels Referentie

| Product | BC Retail | SC+ Retail | ASP | Fidelity N0 |
|---------|-----------|------------|-----|-------------|
| Mobile Child | €1 | €5 | 0 | €0.25 |
| Mobile Small | €10 | €15 | 1 | €0.50 |
| Mobile Medium | €35 | €40 | 1 | €1.00 |
| Mobile Large | €50 | €55 | 1 | €1.25 |
| Mobile Unlimited | €60 | €65 | 1 | €1.50 |
| Internet | €15 | €20 | 1 | €0.35 |
| Orange TV | €10 | €10 | 1 | €0 |
| Energie Res | €20 | €25 | 0.5 | €0.35 |
| Energie SoHo | €40 | €45 | 1 | €0.35 |
| Ketelonderhoud | €20 | €25 | 0 | €0 |

### Bonussen
- **Convergentie**: Mobile Medium+ +€12, Internet +€15
- **Portability**: Mobile Medium+ +€20, Internet +€12
- **SoHo**: Mobile Medium+ +€15

### Clawback
- `< 1 maand`: 100% terugvordering
- `1-6 maanden`: 75% terugvordering
- `> 6 maanden`: 25% terugvordering

---

## 🚀 Volgende Stappen

1. **Frontend UI** - Componenten bouwen voor:
   - Call queue scherm
   - Offerte wizard
   - Dashboard met PQS/incentive voortgang

2. **Database Schema** - Prisma models voor:
   - Leads, calls, sequences
   - Sales, commissions, fidelity logs

3. **API Routes** - Next.js API routes voor:
   - Offerte genereren
   - Call logging
   - Sequence management

4. **PDF Generatie** - Offerte PDFs genereren

5. **Email/WhatsApp Integratie** - Verzenden via SMTP/Twilio

---

*Geïntegreerd volgens masterprompt specificaties - alle Smart regels 100% getest*
