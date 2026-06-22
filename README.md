# Sinours Watercolor

Brand website for **Sinours Watercolor** — finely milled pigments and mediums for the modern painter.

**Live:** https://sinours.clossyan.com

---

## Tech Stack

| Layer         | Technology                                    |
| ------------- | --------------------------------------------- |
| Framework     | Next.js 15 (App Router, `output: standalone`) |
| Language      | TypeScript 5                                  |
| Styling       | Tailwind CSS 3.4 + tailwindcss-animate        |
| i18n          | next-intl 3.x (/en, /zh locale routing)       |
| Database      | PostgreSQL 16 (via Prisma 6 ORM)               |
| Deployment    | Docker → GHCR → Portainer → Cloudflare tunnel |
| Theme         | Light/Dark (CSS class toggle, no FOUC)         |

---

## Features (Phase 1)

- **Home** — Hero, brand story, product category cards.
- **Shop** — Catalog with 3 categories: Pigments, Mediums, Sets.
- **Pigment Colors** — 9 color families: White, Yellow, Orange, Red, Purple, Blue, Green, Black, Other.
- **Product Detail** — Full spec table: Color Powder, Lightfastness, Transparency, Particle Regularity, Coverage.
- **About** — Company introduction and values.
- **Contact** — Contact info + form (saves to DB).
- **Find Agent** — Agent directory filtered by region.
- **Light/Dark Toggle** — System-preference aware, persisted, no flash on load.
- **Language Switch** — English / 中文 (Chinese) with locale-prefixed URLs.

---

## Project Structure

```
sinorus/
├── .github/workflows/docker.yml   # CI/CD: build + push to GHCR
├── prisma/
│   ├── schema.prisma              # Database models
│   ├── seed.ts                    # Catalogue + agent seed data
│   └── migrations/                # Versioned migrations
├── messages/
│   ├── en.json                    # English translations
│   └── zh.json                    # Chinese translations
├── src/
│   ├── app/[locale]/              # All pages under locale prefix
│   │   ├── layout.tsx             # Root locale layout (header/footer/providers)
│   │   ├── page.tsx               # Home
│   │   ├── about/                 # About
│   │   ├── contact/               # Contact + form
│   │   ├── agents/                # Agent directory
│   │   └── shop/                  # Shop, category, color, product detail
│   ├── components/                # Shared UI components
│   ├── i18n/                      # next-intl routing config
│   ├── lib/                       # DB client, query helpers, types
│   └── middleware.ts               # Locale routing middleware
├── Dockerfile                      # Multi-stage Docker build
├── docker-compose.yml              # Production stack (app + postgres + tunnel)
├── docker-compose.dev.yml          # Local dev (postgres only)
├── entrypoint.sh                   # Container startup (migrate + seed + start)
├── DEPLOY.md                       # Full deployment runbook
└── AGENT.md                        # Agent management structure & roadmap
```

---

## Quick Start (Local)

```bash
# Install deps
npm install

# Start local Postgres (optional — Docker)
docker compose -f docker-compose.dev.yml up -d

# Set up database
cp .env.example .env
# Edit .env with your DATABASE_URL
npx prisma migrate dev
npm run db:seed

# Run dev server
npm run dev
# → http://localhost:3000
```

---

## Deployment

See **[DEPLOY.md](./DEPLOY.md)** for the full deployment runbook (Portainer stack, Cloudflare tunnel, CI/CD pipeline, rollback).

---

## Roadmap

- **Phase 2:** User auth, agent self-service portal, order placement.
- **Phase 3:** E-commerce (cart, checkout, payment), admin panel, agent CRUD.
- **Phase 4:** Agent map view, marketing materials, tiered pricing.
