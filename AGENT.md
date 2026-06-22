# Sinours Watercolor — Project Documentation

> **Purpose:** This document is the single source of truth for the Sinours Watercolor website. It captures the architecture, deployment, and — critically — every bug we hit and how we fixed it. Use this as a **template** when starting new similar websites (multi-locale, e-commerce-ready, light/dark, Docker-deployed).

---

## Table of Contents

1. [What This Project Is](#what-this-project-is)
2. [Architecture](#architecture)
3. [Project Structure](#project-structure)
4. [Deployment](#deployment)
5. [Bugs Hit & Lessons Learned](#bugs-hit--lessons-learned)
6. [Using This as a Template](#using-this-as-a-template)
7. [Agent Management (Original Content)](#agent-management-original-content)

---

## What This Project Is

A **brand website** for Sinours Watercolor — a watercolor pigment manufacturer. The site is a **catalog + agent directory**, not an e-commerce store. Artists browse products and contact authorized regional agents to order.

**Core features:**
- Multi-locale (English / 中文) with locale-prefixed URLs
- Product catalog with category + color filtering
- Product detail pages with technical spec tables
- Agent directory (read-only, grouped by region)
- Contact form (stores to DB)
- Light/dark theme toggle (no FOUC)
- Responsive (mobile drawer nav)

**Tech stack:**
| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, `output: standalone`) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3.4 + tailwindcss-animate |
| i18n | next-intl 3.x |
| Database | PostgreSQL 16 (via Prisma 6 ORM) |
| Deployment | Docker → GHCR → Portainer → Cloudflare Tunnel |
| Theme | Light/Dark (CSS class toggle, no FOUC) |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Internet                              │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              Cloudflare (sinours.clossyan.com)              │
└──────────────────────────┬──────────────────────────────────┘
                           │ (encrypted tunnel)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│         Cloudflared container (sinours-tunnel)             │
│         — runs `cloudflared tunnel run`                     │
└──────────────────────────┬──────────────────────────────────┘
                           │ (internal Docker network: sinours-net)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              Next.js app (sinours-app)                      │
│              — port 3223 (internal)                         │
│              — port 3222 (host, optional debug)             │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              PostgreSQL 16 (sinours-postgres)               │
│              — port 5432 (internal only)                    │
│              — volume: sinours-postgres-data                │
└─────────────────────────────────────────────────────────────┘
```

**Why this architecture:**
- **No public ports exposed** except 3222 (optional debug). The Cloudflare tunnel handles all public traffic.
- **Internal Docker network** (`sinours-net`) lets containers resolve each other by name (`app`, `postgres`).
- **Standalone Next.js output** keeps the image small (~150MB) by tracing only used dependencies.

---

## Project Structure

```
sinorus/
├── .github/workflows/docker.yml    # CI/CD: build + push to GHCR
├── prisma/
│   ├── schema.prisma               # Database models
│   ├── seed.ts                     # Catalogue + agent seed data
│   └── migrations/                 # Versioned migrations
│       └── 20250101000000_init/
│           └── migration.sql       # Initial schema
├── messages/
│   ├── en.json                     # English translations
│   └── zh.json                     # Chinese translations
├── src/
│   ├── app/[locale]/               # All pages under locale prefix
│   │   ├── layout.tsx              # Root locale layout (header/footer/providers)
│   │   ├── page.tsx                # Home
│   │   ├── about/                  # About
│   │   ├── contact/                # Contact + form
│   │   ├── agents/                 # Agent directory
│   │   └── shop/                   # Shop, category, product detail
│   ├── components/                 # Shared UI components
│   │   ├── image-placeholder.tsx   # Dashed-border placeholder for missing images
│   │   ├── product-card.tsx        # Product grid card
│   │   ├── product-image.tsx       # Product visual (color-tinted placeholder)
│   │   ├── site-header.tsx         # Sticky header with mobile drawer
│   │   ├── site-footer.tsx         # Footer with link columns
│   │   ├── theme-script.tsx        # Inline script to prevent FOUC
│   │   ├── theme-toggle.tsx        # Light/dark toggle button
│   │   ├── lang-toggle.tsx         # Language switcher dropdown
│   │   ├── logo.tsx                # Typographic wordmark
│   │   └── ui/button.tsx           # Button primitive (cva variants)
│   ├── i18n/
│   │   ├── request.ts              # next-intl request config
│   │   └── routing.ts              # Locale routing definition
│   ├── lib/
│   │   ├── db.ts                   # Prisma client singleton
│   │   ├── products.ts             # Product query helpers
│   │   ├── agents.ts               # Agent query helpers
│   │   ├── categories.ts           # Category slug ↔ enum mapping
│   │   ├── colors.ts               # Pigment color families + hex
│   │   ├── specs.ts                # Product spec table reader
│   │   ├── nav.ts                  # Nav items + localeHref helper
│   │   └── utils.ts                # cn() class combiner
│   └── middleware.ts               # next-intl locale routing
├── Dockerfile                       # Multi-stage Docker build
├── docker-compose.yml               # Production stack (app + postgres + tunnel)
├── docker-compose.dev.yml           # Local dev (postgres only)
├── entrypoint.sh                   # Container startup (migrate + seed + start)
├── DEPLOY.md                        # Full deployment runbook
└── AGENT.md                         # This file
```

---

## Deployment

### CI/CD Pipeline

```
git push origin master
  → GitHub Actions builds Docker image
  → Pushes to GHCR (ghcr.io/dinu-sri/sinours-app:latest)
  → In Portainer: click "Pull and redeploy"
```

### Portainer Stack Setup

1. **Create stack** → name: `sinours`
2. **Repository:** Git Repository → `dinu-sri/sinours` → branch `master`
3. **Web editor:** paste contents of `docker-compose.yml`
4. **Environment variables** (raw values, no quotes):

| Variable | Value |
|----------|-------|
| `DB_PASSWORD` | Strong random password |
| `CF_TUNNEL_TOKEN` | From Cloudflare Zero Trust → Tunnels |
| `NEXT_PUBLIC_BASE_URL` | `https://sinours.clossyan.com` |
| `APP_URL` | `https://sinours.clossyan.com` |

5. **Deploy** → Portainer pulls image, starts containers

### Cloudflare Tunnel Configuration

- **Public hostname:** `sinours.clossyan.com`
- **Service:** `http://app:3223` (internal Docker name + port)

### GitHub Repo Variables

Go to **Settings → Secrets and variables → Actions → Variables**:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_BASE_URL` | `https://sinours.clossyan.com` |

---

## Bugs Hit & Lessons Learned

> **This is the most important section.** Every bug below cost real time. Read this before starting a new project.

### 1. `hasLocale` not exported in next-intl v3.26.5

**Symptom:** Build fails with `TypeError: (0 , h.hasLocale) is not a function` during prerender.

**Root cause:** `hasLocale` was added in next-intl v4. We're on v3.26.5.

**Fix:** Use manual `includes()` check:
```typescript
if (!(routing.locales as readonly string[]).includes(locale)) notFound();
```

**Lesson:** Pin next-intl version explicitly. Don't assume v4 APIs are available.

---

### 2. Missing Prisma migrations

**Symptom:** Container entrypoint fails with `No migration found`.

**Root cause:** `prisma/migrations/` was empty — no versioned migration existed.

**Fix:** Generate migration SQL manually (or via `prisma migrate dev` if DB is available):
```bash
mkdir -p prisma/migrations/20250101000000_init
# Write migration.sql with CREATE TABLE statements
```

**Lesson:** Always commit at least one migration. The entrypoint runs `prisma migrate deploy` which requires versioned migrations.

---

### 3. Pages failing build without DB

**Symptom:** `next build` fails on pages that call `prisma.product.findMany()` because no DB is available during static generation.

**Root cause:** Next.js tries to prerender pages at build time. DB-dependent pages fail.

**Fix:** Add `export const dynamic = "force-dynamic"` to any page that fetches from the DB:
```typescript
export const dynamic = "force-dynamic";
```

**Lesson:** For DB-dependent pages, either use `force-dynamic` or set up a build-time DB. We chose `force-dynamic` for simplicity.

---

### 4. Missing translation keys

**Symptom:** `Error: MISSING_MESSAGE: shop.viewDetails (en)` at runtime.

**Root cause:** Code referenced `t("viewDetails")` but the key was in the `actions` namespace, not `shop`.

**Fix:** Use the correct namespace:
```typescript
const ta = await getTranslations({ locale, namespace: "actions" });
// ...
{ta("viewDetails")}
```

**Lesson:** When adding a new translation key, search the codebase for all usages. Missing keys fail at runtime, not build time.

---

### 5. `Cannot use 'in' operator` in product-card

**Symptom:** `TypeError: Cannot use 'in' operator to search for 'white' in White`

**Root cause:** `product.colorFamily in t.raw(product.colorFamily)` — `t.raw()` returns a string, not an object. The `in` operator doesn't work on strings.

**Fix:** Remove the existence check (next-intl throws if the key is missing, which is the desired behavior):
```typescript
const colorLabel = product.colorFamily
  ? t(product.colorFamily)
  : null;
```

**Lesson:** `t.raw(key)` returns the translated value, not a key-existence check. Use `t.has()` if you need to check existence.

---

### 6. UTF-8 BOM in migration SQL

**Symptom:** `Database error: syntax error at or near "\u{feff}"` when running migration.

**Root cause:** PowerShell's `Set-Content` added a UTF-8 BOM (`﻿`) to the migration file. PostgreSQL rejects it.

**Fix:** Write the file with explicit UTF-8 encoding without BOM:
```powershell
[System.IO.File]::WriteAllText($path, $content, [System.Text.UTF8Encoding]::new($false))
```

**Lesson:** Always use UTF-8 without BOM for SQL files. PowerShell's default encoding adds BOM.

---

### 7. Stuck migration in DB

**Symptom:** `Error: P3009 - migrate found failed migrations in the target database`.

**Root cause:** A previous migration failed mid-execution, leaving a "failed" record in `_prisma_migrations`.

**Fix:** Auto-resolve in entrypoint:
```bash
FAILED_MIGRATION=$(echo "$MIGRATE_OUTPUT" | grep -o '`[0-9]\{14\}_[a-z_]*`' | head -1 | tr -d '`')
node node_modules/prisma/build/index.js migrate resolve --rolled-back "$FAILED_MIGRATION"
```

**Lesson:** Always handle stuck migrations gracefully. The first attempt to extract the migration name used `sed` which parsed the wrong text ("During" instead of the migration name). Use `grep -o` with a precise regex instead.

---

### 8. Prisma 7 incompatibility

**Symptom:** `Error: The datasource property 'url' is no longer supported in schema files`.

**Root cause:** `npx prisma migrate deploy` in the entrypoint downloaded Prisma 7 (latest), which changed the schema format. The schema uses the v6 format (`url = env("DATABASE_URL")`).

**Fix:**
1. Pin Prisma to v6.10.1 in `package.json` (remove `^`)
2. Copy Prisma CLI to the runner stage in Dockerfile
3. Use the local CLI in entrypoint instead of `npx`:
```bash
node node_modules/prisma/build/index.js migrate deploy
```

**Lesson:** Never use `npx` in production containers — it downloads the latest version, which may break. Always pin versions and bundle the CLI.

---

### 9. esbuild platform binary missing

**Symptom:** `Error: The package "@esbuild/linux-x64" could not be found`.

**Root cause:** The seed script uses `tsx`, which depends on `esbuild`. The `esbuild` package has platform-specific binaries in `optionalDependencies`. When we copied `esbuild` to the runner stage, we didn't copy the platform binary.

**Fix:** Copy the platform-specific binary:
```dockerfile
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/esbuild ./node_modules/esbuild
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@esbuild ./node_modules/@esbuild
```

**Lesson:** When copying npm packages with native binaries, copy the entire `@esbuild/*` directory, not just `esbuild`.

---

### 10. Dynamic route clash (`[color]` vs `[slug]`)

**Symptom:** `Error: You cannot use different slug names for the same dynamic path ('color' !== 'slug')`.

**Root cause:** Two sibling dynamic routes under `[category]/`:
- `[category]/[color]/page.tsx`
- `[category]/[slug]/page.tsx`

Next.js doesn't allow two different dynamic segment names at the same position.

**Fix:** Remove the `[color]` route and use query params instead:
- `/en/shop/pigments?color=blue` instead of `/en/shop/pigments/blue`

**Lesson:** When you need to filter by an optional attribute, use query params (`?color=blue`), not nested routes. Nested routes should be reserved for distinct resources (like product slugs).

---

### 11. PowerShell bracket handling in file paths

**Symptom:** `Remove-Item -Recurse -Force "src\app\[locale]\shop\[category]\[color]"` silently failed.

**Root cause:** PowerShell interprets `[...]` as wildcard patterns. The brackets in the path were treated as character classes, not literal characters.

**Fix:** Use `cmd /c` for file operations with brackets:
```powershell
cmd /c "rmdir /s /q "src\app\[locale]\shop\[category]\[color]""
```

**Lesson:** When working with Next.js paths (which always have `[param]` brackets), use `cmd /c` or escape the brackets with backticks.

---

### 12. Internal port conflict

**Symptom:** User reported port 3000 was already in use internally.

**Root cause:** Default Next.js port is 3000. User had other apps on that port.

**Fix:** Change internal port to 3223:
- `Dockerfile`: `EXPOSE 3223` + `ENV PORT=3223`
- `docker-compose.yml`: `"3222:3223"`
- `nginx.conf`: `proxy_pass http://app:3223`
- Cloudflare tunnel: `http://app:3223`

**Lesson:** Always use non-standard ports (3222, 3223, etc.) for production deployments to avoid conflicts.

---

## Using This as a Template

### Quick Start for a New Project

1. **Copy this folder** to a new directory
2. **Rename** in `package.json`: `"name": "your-project-name"`
3. **Update** in `docker-compose.yml`: image name, container names, volume name
4. **Update** in `.github/workflows/docker.yml`: GHCR image path
5. **Replace** `prisma/schema.prisma` with your models
6. **Replace** `prisma/seed.ts` with your seed data
7. **Replace** `messages/en.json` and `messages/zh.json` with your translations
8. **Update** `src/app/[locale]/page.tsx` and other pages with your content
9. **Update** `src/lib/categories.ts`, `colors.ts`, etc. with your domain logic
10. **Deploy** following the [Deployment](#deployment) section

### What to Keep

- **All infrastructure files:** `Dockerfile`, `docker-compose.yml`, `entrypoint.sh`, `.github/workflows/docker.yml`
- **i18n setup:** `src/i18n/`, `src/middleware.ts`, `messages/`
- **Theme system:** `src/components/theme-script.tsx`, `theme-toggle.tsx`, `globals.css`
- **Layout components:** `src/components/site-header.tsx`, `site-footer.tsx`, `logo.tsx`, `lang-toggle.tsx`
- **Prisma setup:** `prisma/schema.prisma`, `prisma/seed.ts`, `prisma/migrations/`
- **Lib utilities:** `src/lib/db.ts`, `utils.ts`, `nav.ts`

### What to Replace

- **Pages:** `src/app/[locale]/*` — your content
- **Translations:** `messages/en.json`, `messages/zh.json` — your strings
- **Database schema:** `prisma/schema.prisma` — your models
- **Seed data:** `prisma/seed.ts` — your data
- **Domain logic:** `src/lib/categories.ts`, `colors.ts`, `products.ts`, etc.

### Adding E-Commerce (Phase 2)

When you're ready to add cart/checkout:
1. Add `Cart`, `Order`, `OrderItem` models to `prisma/schema.prisma`
2. Create `src/lib/cart.ts` with cart logic (localStorage + server sync)
3. Add `/cart` and `/checkout` routes under `src/app/[locale]/`
4. Integrate Stripe or another payment provider
5. Add order confirmation emails (Resend, SendGrid, etc.)

---

## Agent Management (Original Content)

### What is an Agent?

In the Sinours ecosystem, an **Agent** is an authorized regional distributor or reseller. Agents are the primary sales channel — the Sinours website does not sell products directly. Artists and retailers contact agents to place orders and inquire about availability.

### Agent Data Model (Phase 1)

```prisma
model Agent {
  id        String
  name      String        // Agent business name
  region    String        // e.g. "East China", "Europe"
  country   String        // e.g. "China", "Japan", "Germany"
  contact   String?       // Primary contact person
  email     String?       // Agent email
  phone     String?       // Agent phone
  website   String?       // Agent website URL
  lat       Float?        // Latitude (for future map view)
  lng       Float?        // Longitude (for future map view)
  active    Boolean        // Only active agents are shown publicly
  sortOrder Int            // Manual sort priority
}
```

### Current Behavior (Phase 1)

- The `/agents` page displays a **read-only directory** of all active agents.
- Agents are grouped by region with anchor-link navigation.
- No login, no self-service, no territory management.

### Agent Management Roadmap

#### Phase 2 — Agent Self-Service Portal

| Feature | Description |
|---------|-------------|
| Agent login | Email/password auth via NextAuth or custom JWT. |
| Agent dashboard | View assigned territory, order history, commission. |
| Profile management | Update contact info, phone, website. |
| Inventory visibility | See Sinours catalogue with wholesale pricing. |
| Order placement | Submit orders directly from the dashboard. |
| Commission tracking | View earned commissions and payment status. |

#### Phase 3 — Admin Panel

| Feature | Description |
|---------|-------------|
| Agent CRUD | Create, update, deactivate agents. |
| Territory assignment | Assign regions/countries to agents. |
| Sales analytics | Per-agent sales volume, top products, trends. |
| Communication log | Internal notes on agent interactions. |
| Automated commission calculation | Rule-based commission tiers and auto-calculation. |

#### Phase 4 — Advanced Features

| Feature | Description |
|---------|-------------|
| Map view | Interactive map of all agents with clickable regions. |
| Agent tiering | Gold/Silver/Bronze tiers with different pricing. |
| Marketing materials | Branded collateral downloadable by agents. |
| Multi-language agent portal | Agent dashboard in agent's preferred language. |

### Agent Directory Route

- **Public:** `/<locale>/agents` — lists all active agents.
- **Admin (future):** `/<locale>/admin/agents` — CRUD management.
- **Agent portal (future):** `/<locale>/portal` — agent self-service.

### Adding a New Agent (Phase 1 — Manual DB Insert)

```sql
INSERT INTO "Agent" (id, name, region, country, contact, email, phone, active, "sortOrder", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'New Agent Name',
  'Region Name',
  'Country',
  'Contact Person',
  'agent@example.com',
  '+1 555 0000',
  true,
  10,
  NOW(),
  NOW()
);
```

Or via Prisma Studio:

```bash
npm run db:studio
```

### Contact for Agent Inquiries

The `/contact` page has a form that stores messages in the `ContactMessage` table. Mark the subject with "Agent Inquiry" to filter these in the database or future admin panel.