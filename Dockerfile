# Sinours Watercolor — multi-stage Docker build.
# Mirrors the proven Todo App pattern: standalone Next.js output, non-root user,
# with the extra COPY steps required by next-intl (messages/) and Prisma (prisma/),
# which Next.js standalone tracing does NOT include by default.

FROM node:20-alpine AS base

# ---- deps ----
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm install --no-audit --no-fund --ignore-scripts

# ---- builder ----
FROM base AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate the Prisma client before Next builds so it gets traced.
RUN npx prisma generate

# Build with the inlined public env. Secret build-args can be added here later.
ARG NEXT_PUBLIC_BASE_URL=http://localhost:3000
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL

RUN npm run build

# ---- runner ----
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Standalone server + traced node_modules.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Static assets.
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
# next-intl message JSONs — standalone tracing omits these reliably.
COPY --from=builder --chown=nextjs:nodejs /app/messages ./messages
# Prisma schema + migrations — required by `prisma migrate deploy` in the entrypoint.
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
# Entrypoint.
COPY --from=builder /app/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh && chown nextjs:nodejs ./entrypoint.sh

USER nextjs

EXPOSE 3223
ENV PORT=3223
ENV HOSTNAME="0.0.0.0"

CMD ["sh", "entrypoint.sh"]
