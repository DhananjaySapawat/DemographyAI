#!/bin/bash

MODE="dev"   # default

while [[ "$#" -gt 0 ]]; do
  case "$1" in
    --prod)
      MODE="prod"
      ;;
    --dev)
      MODE="dev"
      ;;
    *)
      echo "Unknown flag: $1"
      exit 1
      ;;
  esac
  shift
done

echo "Mode selected: $MODE"

if [ "$MODE" = "prod" ]; then
  echo "🚀 Running in PRODUCTION mode"
  docker compose up --build

elif [ "$MODE" = "dev" ]; then
  echo "🛠️ Running in LOCAL mode"

    bash -c "cd backend && ./run.sh" &
    PID1=$!

    bash -c "cd model && ./run.sh" &
    PID2=$!

    bash -c "cd dummy_frontend && npm run dev" &
    PID3=$!

    wait $PID1 $PID2 $PID3

fi
