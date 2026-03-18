#!/bin/bash

MODE="dev"
DB="sqlite"

# -----------------------------
# Parse arguments
# -----------------------------

while [[ "$#" -gt 0 ]]; do
  case "$1" in
    --mode)
      MODE="$2"
      shift
      ;;
    --db)
      DB="$2"
      shift
      ;;
    *)
      echo "Unknown argument: $1"
      exit 1
      ;;
  esac
  shift
done

echo "Mode: $MODE"

# -----------------------------
# Providers
# -----------------------------

if [[ "$MODE" == "prod" || "$MODE" == "prod-docker" ]]; then
  export STORAGE_PROVIDER="cloudinary"
  export DB_PROVIDER="firebase"
else
  export STORAGE_PROVIDER="local"
  export DB_PROVIDER="$DB"
fi

export APP_MODE=$MODE

echo "Storage Provider: $STORAGE_PROVIDER"
echo "DB Provider: $DB_PROVIDER"

# -----------------------------
# Mode logic
# -----------------------------

if [ "$MODE" = "prod-docker" ]; then

  echo "🐳 Production Docker mode"
  docker compose up --build

elif [ "$MODE" = "prod" ]; then

  echo "🚀 Production mode"

  bash -c "cd model && ./run.sh" &
  PID_MODEL=$!

  bash -c "cd backend && ./run.sh" &
  PID_BACKEND=$!

  bash -c "cd frontend && ./run.sh" &
  PID_FRONTEND=$!

  wait $PID_MODEL $PID_BACKEND $PID_FRONTEND


elif [ "$MODE" = "local-docker" ]; then

  echo "🐳 Local Docker mode"
  docker compose up --build


elif [ "$MODE" = "local" ]; then

  echo "🛠 Local services mode"

  bash -c "cd model && ./run.sh" &
  PID_MODEL=$!

  bash -c "cd backend && ./run.sh" &
  PID_BACKEND=$!

  bash -c "cd frontend && ./run.sh" &
  PID_FRONTEND=$!

  wait $PID_MODEL $PID_BACKEND $PID_FRONTEND


elif [ "$MODE" = "dev" ]; then

  echo "⚡ Dev mode"

  bash -c "cd model && ./run.sh" &
  PID_MODEL=$!

  bash -c "cd backend && ./run.sh" &
  PID_BACKEND=$!

  bash -c "cd frontend && ./run.sh" &
  PID_FRONTEND=$!

  wait $PID_MODEL $PID_BACKEND $PID_FRONTEND

else
  echo "Unknown mode: $MODE"
  exit 1
fi