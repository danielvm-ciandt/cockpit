# Deployment & Setup Guide

## Database Setup

### Neon Project Configuration

The cockpit project is hosted on Neon PostgreSQL (free tier).

**Project ID:** `shy-scene-10490801`

**Branches:**
- **main** (prod) → ID: `br-empty-field-ajflp1wt`
- **dev** (development) → ID: `br-proud-base-aj3thfd6`
- **staging** (staging) → ID: `br-aged-hall-ajrxy3kf`
- **prod** (production alias) → ID: `br-misty-mud-aj18gjd7`

All branches use **PgBouncer connection pooling** (integrated into Neon endpoints, `-pooler` suffix).

### Database Versions
- PostgreSQL 17
- Region: US-East-2 (AWS)

## Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd cockpit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.local.example .env.local
   ```
   Edit `.env.local` and verify `DATABASE_URL_DEV` points to the dev branch connection string.

4. **Start the dev server**
   ```bash
   npm run dev
   ```
   The Nuxt 3 app will start at `http://localhost:3000` and connect to the Neon dev branch.

## Deployment (Render)

_Coming in T03: Render deployment configuration._

## Migration Management

_Coming in S01: Database schema setup and migration scripts._

## Verification Checklist

- [ ] Three Neon branches exist (dev, staging, prod)
- [ ] All branches are in "ready" state
- [ ] Connection pooling is active on all branches
- [ ] Direct connection strings available for migrations
- [ ] Local `.env.local` configured and verified
- [ ] `npm run dev` connects to dev branch without errors
