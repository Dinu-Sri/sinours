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
MIGRATE_OUTPUT=$(node node_modules/prisma/build/index.js migrate deploy 2>&1) || {
  echo "$MIGRATE_OUTPUT"
  echo "Migration failed — attempting to resolve and retry..."
  # Extract migration name from error: The `XXXXXXXX_name` migration
  FAILED_MIGRATION=$(echo "$MIGRATE_OUTPUT" | grep -o '`[0-9]\{14\}_[a-z_]*`' | head -1 | tr -d '`' || echo "")
  if [ -n "$FAILED_MIGRATION" ]; then
    echo "Resolving: $FAILED_MIGRATION"
    node node_modules/prisma/build/index.js migrate resolve --rolled-back "$FAILED_MIGRATION" 2>&1 || true
    echo "Retrying deploy..."
    node node_modules/prisma/build/index.js migrate deploy 2>&1
  else
    echo "Could not determine failed migration name. If this persists, delete the postgres volume and redeploy."
  fi
}

echo "Seeding catalogue (idempotent)..."
# Re-run the seed; it wipes and recreates Product/Agent rows so it is safe to repeat.
node /app/node_modules/tsx/dist/cli.mjs /app/prisma/seed.ts || echo "Seed skipped or already applied."

echo "Starting Sinours Watercolor..."
exec node server.js
