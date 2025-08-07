#!/bin/bash

# Use default if not set
STAGE=${STAGE:-dev}

echo "Running with stage: $STAGE"

# Absolute path to the desired .env file
ENV_FILE="env/.env.${STAGE}"

echo "ENV_FILE: $ENV_FILE"

# Check if the file exists
if [ ! -f "$ENV_FILE" ]; then
  echo "❌ File not found: $ENV_FILE"
  exit 1
fi

# Run Docker Compose with explicit env file
docker compose --env-file "$ENV_FILE" up
