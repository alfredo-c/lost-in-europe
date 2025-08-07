#!/bin/bash

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

# Run docker-compose with only the DB service file
docker compose -f docker-compose.db.yml --env-file "$ENV_FILE" up -d
