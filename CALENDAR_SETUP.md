# 📅 Agenda Koppeling Setup

## Optie 1: Google Calendar (Aanbevolen)

### Stap 1: Google Cloud Console
1. Ga naar [Google Cloud Console](https://console.cloud.google.com/)
2. Maak een nieuw project (bijv. "Spaarslimmer CRM")
3. Ga naar **APIs & Services** → **Library**
4. Zoek en enable **Google Calendar API**

### Stap 2: OAuth Credentials
1. Ga naar **APIs & Services** → **Credentials**
2. Klik **Create Credentials** → **OAuth client ID**
3. Configureer het OAuth consent screen:
   - User Type: **External**
   - App name: "Spaarslimmer CRM"
   - User support email: jouw-email
   - Developer contact: jouw-email
4. Maak OAuth client ID:
   - Application type: **Web application**
   - Name: "Spaarslimmer Web"
   - Authorized redirect URIs: 
     - `https://jouw-domein.com/api/calendar/google/callback`
     - `http://localhost:3000/api/calendar/google/callback` (voor dev)
5. Kopieer de **Client ID** en **Client Secret**

### Stap 3: Environment Variables
Voeg toe aan `.env.local`:
```env
GOOGLE_CLIENT_ID= jouw-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET= jouw-client-secret
```

### Stap 4: Database Update
```bash
npx prisma migrate dev --name add_google_calendar
```

### Stap 5: Gebruik
1. Ga naar **Instellingen** in je CRM
2. Klik op "Koppel Google Calendar"
3. Log in met je Google account
4. Geef toestemming voor agenda toegang
5. Klaar! Bij elke afspraak verschijnt nu een checkbox "Toevoegen aan Google Calendar"

---

## Optie 2: Microsoft Outlook/365

### Nog niet geïmplementeerd
Maar kan toegevoegd worden op verzoek.

---

## Optie 3: Cal.com (Gratis Booking Pagina)

Wil je dat klanten zelf een afspraak kunnen inplannen?

1. Maak account aan bij [Cal.com](https://cal.com)
2. Configureer je beschikbaarheid
3. Koppel aan je CRM via webhook
4. Klanten krijgen een link: `cal.com/jouw-naam`

Voordelen:
- Klanten zien direct wanneer je beschikbaar bent
- Automatische timezone conversie
- Geen heen-en-weer mailen

---

## Technische Details

### Database Schema
```sql
ALTER TABLE appointments ADD COLUMN googleEventId VARCHAR(255);
```

### API Endpoints
- `GET /api/calendar/google/status` - Check connectie status
- `POST /api/calendar/google` - Maak afspraak in Google Calendar
- `GET /api/calendar/google/callback` - OAuth callback

### Data Flow
```
User maakt afspraak in CRM
        ↓
Checkbox "Toevoegen aan Google Calendar"
        ↓
CRM slaat op in database
        ↓
Sync naar Google Calendar API
        ↓
Google Event ID wordt opgeslagen
        ↓
Afspraak verschijnt in Google Calendar
```

---

## Veelgestelde Vragen

**Q: Wat als ik geen Google Calendar wil gebruiken?**  
A: Geen probleem! De checkbox verschijnt alleen als je Google Calendar gekoppeld hebt.

**Q: Kan ik meerdere agenda's koppelen?**  
A: Nu nog niet, maar kan toegevoegd worden.

**Q: Wat gebeurt er als ik een afspraak verwijder?**  
A: Nu moet je handmatig in beide systemen verwijderen. Twee-richting sync komt later.

**Q: Werkt dit op mobiel?**  
A: Ja! Google Calendar werkt perfect op iOS en Android.
