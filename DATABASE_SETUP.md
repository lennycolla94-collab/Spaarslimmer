# PostgreSQL Database Setup

## Optie 1: Railway (Aanbevolen - Makkelijkste)

### Stap 1: Railway Account
1. Ga naar https://railway.app
2. Login met GitHub
3. Klik op "New Project"
4. Selecteer "Provision PostgreSQL"

### Stap 2: Database URL Kopieren
1. Klik op je PostgreSQL database
2. Ga naar "Variables"
3. Kopieer de `DATABASE_URL`

### Stap 3: Environment Variable
Plak de DATABASE_URL in je `.env.local`:
```
DATABASE_URL="postgresql://username:password@host:port/database"
```

### Stap 4: Database Migreren
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

---

## Optie 2: Supabase (Gratis Tier)

### Stap 1: Supabase Project
1. Ga naar https://supabase.com
2. Maak een nieuw project
3. Ga naar Database → Connection String

### Stap 2: Connection String
Kies "URI" format en kopieer de URL.

### Stap 3: Environment Variable
Plak in `.env.local`:
```
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

### Stap 4: Migreren
```bash
npx prisma migrate dev --name init
```

---

## Optie 3: Neon (Serverless)

### Stap 1: Neon Project
1. Ga naar https://neon.tech
2. Maak een project
3. Kopieer de connection string

### Stap 2: Environment Variable
```
DATABASE_URL="postgresql://username:password@host.neon.tech/database?sslmode=require"
```

---

## Test Database Connectie

```bash
npx prisma db pull
```

Als dit werkt, is je database verbonden!

## Migratie Uitvoeren

```bash
# Genereer Prisma client
npx prisma generate

# Maak migratie
npx prisma migrate dev --name init

# (Optioneel) Seed data
npx prisma db seed
```

## Database Reset (Let op: Wisst alle data!)

```bash
npx prisma migrate reset
```
