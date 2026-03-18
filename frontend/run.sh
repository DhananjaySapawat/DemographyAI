#!/bin/bash

MODE=${APP_MODE:-dev}

echo "Frontend starting..."
echo "Mode: $MODE"

# -----------------------------
# Detect local IP
# -----------------------------

IP=$(hostname -I | awk '{print $1}')

if [ -z "$IP" ]; then
  IP="localhost"
fi

echo "Detected local IP: $IP"

# -----------------------------
# ENV VARS
# -----------------------------

export NEXT_PUBLIC_BASE_URL="http://$IP:3000"
export NEXT_PUBLIC_BACKEND_URL="http://$IP:8000"

echo "Frontend URL: $NEXT_PUBLIC_BASE_URL"
echo "Backend URL:  $NEXT_PUBLIC_BACKEND_URL"

# -----------------------------
# NODE SETUP
# -----------------------------

if ! command -v npm &> /dev/null; then
  echo "⚠ npm not found"
  exit 1
fi

# install dependencies if missing
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# -----------------------------
# MODE CONFIG
# -----------------------------

if [[ "$MODE" == "dev" ]]; then

  echo "⚡ DEV mode"

  npm run dev

elif [[ "$MODE" == "local" ]]; then

  echo "🖥 LOCAL production build"

  npm run build && npm start

elif [[ "$MODE" == "prod" ]]; then

  echo "🚀 PRODUCTION mode"

  npm run build && npm start

else
  echo "Unknown mode: $MODE"
  exit 1
fi