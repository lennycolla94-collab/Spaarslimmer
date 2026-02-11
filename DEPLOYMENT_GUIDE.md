# 🚀 Deployment Guide: Railway + Vercel

## Overzicht
- **Database**: Railway PostgreSQL
- **Hosting**: Vercel
- **Tijd**: ~10 minuten

---

## Deel 1: Railway Database (5 min)

### Stap 1: Railway Account
1. Ga naar https://railway.app
2. Klik "Login" → "Continue with GitHub"
3. Authorize Railway

### Stap 2: Nieuw Project
1. Klik "New Project"
2. Selecteer "Provision PostgreSQL"
3. Wacht tot database is aangemaakt (~30 sec)

### Stap 3: Database URL Kopieren
1. Klik op de PostgreSQL database tile
2. Ga naar tab "Variables"
3. Kopieer de `DATABASE_URL` waarde (ziet eruit als):
   ```
   postgresql://postgres:password@containers.railway.app:5432/railway
   ```

### Stap 4: Bewaar URL
**Belangrijk**: Bewaar deze URL! Je hebt hem nodig voor Vercel.

---

## Deel 2: GitHub Repository (2 min)

### Stap 1: Push Code naar GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

---

## Deel 3: Vercel Deployment (3 min)

### Stap 1: Vercel Account
1. Ga naar https://vercel.com
2. Login met GitHub
3. Klik "Add New Project"

### Stap 2: Import Repository
1. Selecteer je `smartsn-crm` repository
2. Klik "Import"

### Stap 3: Configureer Project
**Framework Preset**: Next.js

**Environment Variables**: Voeg deze toe:

| Variable | Waarde |
|----------|--------|
| `DATABASE_URL` | Jouw Railway URL |
| `NEXTAUTH_SECRET` | Genereer met: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Jouw Vercel URL (bijv: `https://smartsn.vercel.app`) |

### Stap 4: Deploy
1. Klik "Deploy"
2. Wacht ~2-3 minuten
3. Klik op de URL om te testen!

---

## Deel 4: Database Migratie (Na eerste deploy)

### Optie A: Lokaal migreren
```bash
# Zet DATABASE_URL in .env.local op Railway URL
npx prisma migrate deploy
```

### Optie B: Vercel Console
1. Ga naar Vercel Dashboard
2. Klik op je project
3. Ga naar "Console"
4. Run: `npx prisma migrate deploy`

---

## ✅ Controlelijst

- [ ] Railway database aangemaakt
- [ ] DATABASE_URL gekopieerd
- [ ] GitHub repository gepusht
- [ ] Vercel project aangemaakt
- [ ] Environment variables ingesteld
- [ ] Deploy succesvol
- [ ] Database migratie uitgevoerd

---

## 🔧 Troubleshooting

### "Database connection failed"
- Check of DATABASE_URL correct is gekopieerd
- Zorg dat er geen spaties zijn in de URL

### "Build failed"
- Check of `postinstall` script in package.json staat
- Controleer of prisma/schema.prisma correct is

### "NextAuth error"
- NEXTAUTH_SECRET moet minimaal 32 karakters zijn
- NEXTAUTH_URL moet exact je Vercel URL zijn (met https://)

---

## 📊 Kosten

| Service | Gratis Tier | Productie |
|---------|-------------|-----------|
| Railway DB | $5 credit | ~$5/maand |
| Vercel | 100GB bandbreedte | $0-20/maand |
| **Totaal** | **~$5 start** | **~$5-25/maand** |
