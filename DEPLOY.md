# Sinours Watercolor — Deployment Guide

**Live URL:** https://sinours.clossyan.com
**Host port:** 3222 → container 3223
**Image:** `ghcr.io/dinu-sri/sinours-app:latest`

---

## Architecture

```
GitHub (push to master)
  → GitHub Actions builds Docker image → pushes to GHCR
    → Portainer pulls image via docker-compose stack
      → sinours-app (Next.js, standalone, port 3223)
      → sinours-postgres (Postgres 16, healthchecked)
      → sinours-tunnel  (Cloudflare tunnel → sinours.clossyan.com)
```

The Cloudflare tunnel connects `sinours.clossyan.com` directly to the `app` container on port 3223 (internal Docker networking). The host-level port 3222 is available for direct access or debugging.

---

## Prerequisites

1. **Portainer** running on your VPS.
2. **GitHub Container Registry (GHCR)** access — add the `GHCR_TOKEN` secret in Portainer (or use a PAT with `read:packages` scope).
3. **Cloudflare Tunnel** — create a tunnel in the Cloudflare Zero Trust dashboard, set the public hostname to `sinours.clossyan.com` pointing to `app:3223`. Copy the tunnel token.

---

## Portainer Stack Setup

### 1. Create the Stack

1. Open Portainer → **Stacks** → **Add stack**.
2. Name: `sinours`.
3. **Repository:** select **Git Repository** and point to your GitHub repo (`dinu-sri/sinours`).
4. **Branch:** `master`.
5. **Web editor:** paste the contents of `docker-compose.yml` from this repo.

### 2. Environment Variables

Set these in the Portainer stack's **Env vars** section (raw values, no quotes):

| Variable              | Description                                    | Example                          |
| --------------------- | ---------------------------------------------- | -------------------------------- |
| `DB_PASSWORD`         | Postgres password (strong, random)             | `xK9$m2Qp!wR7n`                  |
| `CF_TUNNEL_TOKEN`     | Cloudflare tunnel secret token                  | `eyJh...`                        |
| `NEXT_PUBLIC_BASE_URL`| Public base URL (baked into the JS bundle)      | `https://sinours.clossyan.com`  |
| `APP_URL`             | Internal app URL                               | `https://sinours.clossyan.com`  |

> **Important:** `NEXT_PUBLIC_BASE_URL` is a build-time variable (inlined by Next.js). It is set as a build-arg in GitHub Actions via the repo variable `NEXT_PUBLIC_BASE_URL`. Make sure this repo variable is set in GitHub → Settings → Secrets and variables → Actions → Variables.

### 3. GHCR Image Pull Auth

In Portainer → **Registries** → **Add registry**:
- **Name:** GHCR
- **Registry URL:** `ghcr.io`
- **Username:** your GitHub username
- **Password:** a Personal Access Token (PAT) with `read:packages` scope.

Then the stack can pull `ghcr.io/dinu-sri/sinours-app:latest` without auth issues.

### 4. Deploy

Click **Deploy the stack**. Portainer will:
1. Pull the latest image from GHCR.
2. Start Postgres and wait for the healthcheck to pass.
3. Start the app container (which runs migrations + seed on first boot).
4. Start the Cloudflare tunnel.

---

## CI/CD Pipeline

### GitHub Actions (`.github/workflows/docker.yml`)

- **Trigger:** push to `master` branch (or manual dispatch).
- **Builds:** multi-stage Docker image (alpine + standalone Next.js).
- **Pushes to GHCR:**
  - `ghcr.io/dinu-sri/sinours-app:latest`
  - `ghcr.io/dinu-sri/sinours-app:<commit-sha>`
- **Cache:** GHA cache layers for fast rebuilds.
- **Build arg:** `NEXT_PUBLIC_BASE_URL` from repo variable.

### Deploy Flow

```
git push origin master
  → GitHub Actions builds & pushes image to GHCR
    → In Portainer: click "Pull and redeploy" on the sinours stack
      → New container spins up with zero downtime
```

---

## Rolling Update (in Portainer)

1. Open the **sinours** stack.
2. Click **Editor** → verify the compose file references `:latest`.
3. Click **Pull and redeploy**.
4. Portainer pulls the new image, recreates the app container, and the tunnel reconnects automatically.

---

## First-time Setup

### GitHub repo variables

Go to **GitHub → Settings → Secrets and variables → Actions → Variables** and add:

- `NEXT_PUBLIC_BASE_URL` = `https://sinours.clossyan.com`

### Cloudflare Tunnel

1. Cloudflare dashboard → Zero Trust → Networks → Tunnels.
2. Create a new tunnel → choose **Cloudflared**.
3. Follow the installer, or use the Docker method (already in the compose file).
4. **Public hostname** tab → add:
   - **Subdomain:** `sinours`
   - **Domain:** `clossyan.com`
   - **Service:** `http://app:3223` (internal Docker name).
5. Copy the tunnel token and set it as `CF_TUNNEL_TOKEN` in Portainer.

---

## Smoke Test Checklist

After deploy, verify:

- [ ] `https://sinours.clossyan.com` loads (no error, no 502).
- [ ] Home page hero, story, and category cards render.
- [ ] `/en/shop/pigments` and `/zh/shop/pigments` both load.
- [ ] Click a product card → detail page with spec table loads.
- [ ] `/en/about`, `/en/contact`, `/en/agents` all load.
- [ ] Language toggle switches between EN and 中文 without 404.
- [ ] Theme toggle switches light/dark without flash.
- [ ] Mobile hamburger menu opens and navigates.
- [ ] Contact form submits (check ContactMessage table in DB).

---

## Rollback

If something goes wrong:

1. In Portainer → **Images** → find the previous `sinours-app` image tagged with the old commit SHA.
2. In the stack editor, change `:latest` to `:<old-sha>`.
3. Redeploy.

Or, fix on `master` and push — the pipeline rebuilds and you redeploy the new image.

---

## Local Development

### With Docker (Postgres only)

```bash
docker compose -f docker-compose.dev.yml up -d
cp .env.example .env
# Edit .env — set DATABASE_URL=postgresql://sinours:sinours@localhost:5433/sinours
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

### Without Docker

Use any Postgres instance. Set `DATABASE_URL` in `.env`:

```bash
cp .env.example .env
# Edit DATABASE_URL
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

App runs at `http://localhost:3000`.

---

## Port Reference

| Service             | Host Port | Container Port | Notes                          |
| ------------------- | --------- | -------------- | ------------------------------ |
| sinours-app         | 3222      | 3223           | Next.js standalone            |
| sinours-postgres    | —         | 5432           | Internal only (no host port)  |
| sinours-tunnel      | —         | —              | Outbound tunnel to Cloudflare |
