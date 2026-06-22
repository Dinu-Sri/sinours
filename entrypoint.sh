#!/bin/sh
set -e

# Sinours Watercolor — container entrypoint.
#
# 1. Assemble DATABASE_URL from DB_PASSWORD (URL-encoded to survive special chars).
# 2. Apply versioned Prisma migrations.
# 3. Seed the catalogue on first boot (idempotent — seed deletes+recreates).
# 4. Start the standalone Next.js server.

if [ -n "${DB_PASSWORD:-}" ]; then
  ENCODED_DB_PASSWORD="$(node -e 'process.stdout.write(encodeURIComponent(process.env.DB_PASSWORD))')"
  export DATABASE_URL="postgresql://sinours:${ENCODED_DB_PASSWORD}@postgres:5432/sinours?schema=public"
else
  echo "WARNING: DB_PASSWORD is not set. Relying on an existing DATABASE_URL env var."
fi

echo "Applying database migrations..."
npx prisma migrate deploy

echo "Seeding catalogue (idempotent)..."
# Re-run the seed; it wipes and recreates Product/Agent rows so it is safe to repeat.
node /app/node_modules/tsx/dist/cli.mjs /app/prisma/seed.ts || echo "Seed skipped or already applied."

echo "Starting Sinours Watercolor..."
exec node server.js
