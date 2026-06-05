# Deploying BincoHub to Vercel

## Prerequisites

1. A **Neon** account (free tier is fine) — https://neon.tech
2. A **GitHub** account
3. A **Vercel** account — https://vercel.com

---

## Step 1 — Set up a Neon database

1. Sign up at https://neon.tech and create a new project (e.g. `bincohub`)
2. In the Neon dashboard, copy the **Connection String** for your database.
   It looks like: `postgresql://user:password@host.neon.tech/dbname?sslmode=require`
3. Keep this for Step 4.

---

## Step 2 — Push the code to GitHub

1. In Replit, open the **Version Control** panel (left sidebar → Git icon)
2. Commit all changes and push to GitHub
3. If you haven't connected GitHub yet, Replit will walk you through it

---

## Step 3 — Import to Vercel

1. Go to https://vercel.com/new
2. Click **Import Git Repository** and select your GitHub repo
3. On the **Configure Project** screen:
   - **Framework Preset**: Other
   - Leave everything else as-is — the `vercel.json` in the repo handles the build config

---

## Step 4 — Set environment variables in Vercel

In the Vercel project settings → **Environment Variables**, add:

| Name | Value |
|------|-------|
| `DATABASE_URL` | Your Neon connection string from Step 1 |

---

## Step 5 — Run database migrations

After the first deploy, open the **Vercel CLI** or run this locally against your Neon DB:

```bash
DATABASE_URL="your-neon-connection-string" pnpm --filter @workspace/db run push
```

To seed the initial products:

```bash
DATABASE_URL="your-neon-connection-string" pnpm --filter @workspace/db run seed
```

---

## What gets deployed

| Piece | How |
|-------|-----|
| Web app (`artifacts/printflow`) | Vercel CDN (static Vite build) |
| API server (`artifacts/api-server`) | Vercel serverless function at `/api/*` |
| Database | Neon (external Postgres — you manage this) |
| Mobile app (`artifacts/printflow-mobile`) | **Stays in Replit** — use Expo Launch to publish to the App Store |

---

## Local vs Vercel environment variables

| Variable | Replit | Vercel |
|----------|--------|--------|
| `DATABASE_URL` | Set via Replit Secrets | Set in Vercel project settings |
| `PORT` | Set by Replit automatically | Not needed (Vercel manages ports) |
| `BASE_PATH` | Set by Replit automatically | Not needed (served at `/`) |
| `REPL_ID` | Set by Replit automatically | Not set — disables Replit-only dev plugins |
