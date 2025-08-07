#!/bin/bash

set -e  # Stop on error

# Default to "dev" stage if STAGE not set
STAGE=${STAGE:-dev}

echo "▶️ Running Docker DB with stage: $STAGE"

# Path to environment file
ENV_FILE="env/.env.${STAGE}"

# Check for file existence
if [ ! -f "$ENV_FILE" ]; then
  echo "❌ File not found: $ENV_FILE"
  exit 1
fi

echo "✅ Using env file: $ENV_FILE"

# Start DB container
docker compose -f docker-compose.2e2.yml --env-file "$ENV_FILE" up -d

echo "⏳ Waiting for Postgres to be ready..."
until docker exec local_postgres pg_isready -U "$DATABASE_USER" > /dev/null 2>&1; do
  sleep 1
done
echo "✅ Postgres is ready."

echo "▶️ Running migrations..."
npm run migration:run

# echo "🧪 Running E2E tests..."
# npm run test:e2e

# echo "🧹 Cleaning up..."
# docker compose -f docker-compose.2e2.yml --env-file "$ENV_FILE" down
