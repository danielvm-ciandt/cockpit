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

### Setup

1. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR-ORG/cockpit.git
   git push -u origin main
   ```

2. **Create Render account** at https://render.com

3. **Create new Web Service on Render**
   - Connect your GitHub account and select the cockpit repository
   - Render will auto-detect `render.yaml` configuration
   - Confirm build command: `npm install --legacy-peer-deps && npm run build`
   - Confirm start command: `npm run start`

4. **Configure GitHub Secrets**
   Add the following to your GitHub repo (Settings → Secrets and variables → Actions):
   - `RENDER_DEPLOY_HOOK`: Your Render deploy hook URL (get from Render dashboard after service creation)

5. **Configure Render Environment Variables**
   After service creation, add to Render dashboard:
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`: From Google Cloud Console
   - `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`: From GitHub Settings
   - Database connection string (provisioned via Render PostgreSQL free tier or link to Neon)

### Auto-Deploy

Once configured, pushing to `main` branch triggers:
1. GitHub Actions: Lint → Test → Build
2. If all pass, deploy webhook triggers Render
3. Render builds, deploys, and auto-restarts the app

Deployment logs available in Render dashboard.

## Migration Management

_Coming in S01: Database schema setup and migration scripts._

## Verification Checklist

**T01: Neon Setup**
- [x] Three Neon branches exist (dev, staging, prod)
- [x] All branches are in "ready" state
- [x] Connection pooling is active on all branches
- [x] Direct connection strings available for migrations

**T02: NextAuth & Neon Auth**
- [x] Neon Auth provisioned on main branch
- [x] neon_auth schema tables created (users, sessions, accounts, etc.)
- [x] NextAuth.js config created with OAuth placeholders
- [x] Environment variables documented in `.env.local.example`

**T03: Render Deployment**
- [ ] Push to GitHub (awaiting repo URL)
- [ ] Create Render service from GitHub
- [ ] Confirm auto-deploy from main branch working
- [ ] App accessible at Render-assigned URL within 2 minutes of push

**T04: GitHub Actions CI/CD**
- [ ] `.github/workflows/deploy.yml` in place
- [ ] GitHub Secrets configured (RENDER_DEPLOY_HOOK)
- [ ] Workflow runs on push to main: Lint → Test → Build → Deploy
- [ ] All steps complete successfully

**T05: Local Dev Setup**
- [ ] `.env.local` configured with Neon dev branch connection
- [ ] `npm run dev` starts without errors
- [ ] App connects to Neon dev branch (check logs)
- [ ] Dashboard renders at http://localhost:3000
