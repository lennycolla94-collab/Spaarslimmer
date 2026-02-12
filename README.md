# SmartSN CRM

CRM-systeem voor SmartSN Consultants met MLM structuur, lead management, en commissieberekeningen.

## 🚀 Quick Start

### 1. Database Setup (PostgreSQL)

```bash
# Start PostgreSQL (Docker)
docker run --name smartsn-db -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:14

# Create database
docker exec smartsn-db createdb -U postgres smartsn_crm
```

### 2. Environment  Variables

```bash
# .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/smartsn_crm?schema=public"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
ENCRYPTION_KEY="64-char-hex-key"
```

### 3. Install & Run

```bash
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

## 🔐 Inloggen

Demo accounts (aangemaakt door seed):
- **Consultant**: `consultant@smartsn.be` / `demo123`
- **Admin**: `admin@smartsn.be` / `admin123`
- **Sponsor**: `sponsor@smartsn.be` / `sponsor123`

## 🎯 Features

### 📞 Call Center
- **/call-center** - Moderne call interface
- Auto-queue: volgende lead ophalen
- Grote click-to-call knoppen
- GDPR waarschuwingen
- Gespreksresultaten registreren
- Auto-next na opslaan

### 📊 Dashboard
- Statistieken per status
- Conversie ratio
- Snelle acties (Bel, Import, Offertes)

### 🔐 Security
- NextAuth met JWT sessions
- AES-256-GCM encryptie voor PII
- GDPR compliant consent tracking
- Role-based access control

## 🏗️ Architectuur

### Routes
| Route | Beschrijving |
|-------|-------------|
| `/login` | Inlogpagina |
| `/dashboard` | Overzicht & statistieken |
| `/call-center` | Bel interface |
| `/api/queue` | Volgende lead ophalen |
| `/api/calls` | Gesprek registreren |
| `/api/stats` | Statistieken |

### Database
- **User** - Consultants (met MLM hierarchy)
- **Lead** - Encrypted contact info
- **CallLog** - Gespreksgeschiedenis
- **QueueItem** - Follow-up taken

## 🧪 Testing

```bash
npm test
```

## 📝 License

Private - SmartSN
