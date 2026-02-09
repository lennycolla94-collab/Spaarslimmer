# 🎯 Offerte Wizard

De Offerte Wizard is een 4-stappen formulier waarmee consultants in real-time offertes kunnen maken én direct zien hoeveel ze verdienen.

## 📍 URL
```
http://localhost:3000/offers
```

## 🚀 Features

### Stap 1: Klantgegevens
- Klantnaam
- Huidige maandelijkse kosten (voor besparingsberekening)
- Email & telefoon (voor verzending)
- Huidige provider (voor portability tracking)

### Stap 2: Product Selectie
- **Internet**: Start Zen, Zen, Giga met Easy Switch en 2de adres opties
- **Mobiel**: Multiple GSM lijnen toevoegen
  - Per lijn: plan kiezen, portability, SoHo
  - Automatische pack korting (2+ GSM)
- **TV**: Orange TV / TV Lite
- **Add-ons**: My Comfort, WiFi Boosters

### Stap 3: Real-time Preview (Het "Wow" Moment)
💰 **Klant Besparing**
- Huidig vs nieuw maandbedrag
- Besparing per maand
- 6 & 24 maanden totaal bespaard

💎 **Jouw Vergoeding**
- Directe commissie (bij activatie)
- Maandelijke fidelity
- Fidelity over 24 maanden
- **Totaal op 2 jaar**

📊 **PQS Voortgang**
- ASP teller met progress bar
- Visual indicatie als PQS behaald (12 ASP)
- Bonus melding: €150 voor jou + €150 voor sponsor

### Stap 4: Versturen
- **Email**: Direct verzenden met één klik
- **WhatsApp**: Kopieer bericht of open WhatsApp Web
- **PDF**: Download optie (placeholder)
- Automatische follow-up sequence start na verzending

## 💡 Voorbeeld Workflow

1. Consultant opent `/offers`
2. Vult in: "Jan Jansen, nu €75/maand bij Telenet"
3. Selecteert: "Internet Zen + Mobile Large (portability)"
4. Ziet direct:
   - Klant bespaart €15/maand → €90 op 6 maanden
   - Jij verdient: €82 direct + €1.25/maand fidelity
   - Totaal op 2 jaar: €112
5. Klikt "Genereer Offerte"
6. Kiest verzenden per email of WhatsApp
7. Automatische opvolging start

## 🔧 Technische Details

### Bestanden
```
src/app/offers/page.tsx              # Hoofdpagina met wizard logic
src/components/quote-wizard/
  Step1Customer.tsx                  # Klantgegevens formulier
  Step2Products.tsx                  # Product selectie
  Step3Summary.tsx                   # Preview & berekeningen
  Step4Send.tsx                      # Verzend opties
src/app/api/offers/generate/route.ts # Backend API
```

### Integraties
- **Calculator Engine**: Commissie, ASP, fidelity, PQS
- **Tariff Engine**: Orange klantprijzen, pack kortingen
- **Follow-up Engine**: Automatische sequences na verzending
- **Email API**: `/api/email/send-quote`
- **Sequences API**: `/api/sequences/start`

### State Management
- React useState voor form data
- Client-side preview in Step 3 (instant feedback)
- Server-side generation in Step 4 (definitieve offerte)

## 🎨 UI/UX Highlights

- Progress indicator met 4 stappen
- Visuele hiërarchie: groen voor klant besparing, oranje voor commissie
- Real-time validatie (kan niet verder zonder verplichte velden)
- Mobiel-responsive layout
- Loading states voor async acties
- Succes confirmations met follow-up info

## 🧪 Test Scenario

1. Ga naar `/offers`
2. Stap 1: Vul "Test Klant", email "test@test.com", kosten "75"
3. Stap 2: Selecteer Internet Zen + Mobile Medium (portability aan)
4. Stap 3: Controleer:
   - Klant bespaart ~€X/maand
   - Jouw commissie ~€Y
   - ASP = Z
5. Klik "Genereer Offerte"
6. Stap 4: Klik "Kopieer bericht" voor WhatsApp

## 🔮 Toekomstige Uitbreidingen

- [ ] PDF generatie met logo
- [ ] Meerdere offerte templates
- [ ] Offerte historie in dashboard
- [ ] Directe WhatsApp API integratie
- [ ] Elektronische handtekening
- [ ] Offerte tracking (geopend/click)
