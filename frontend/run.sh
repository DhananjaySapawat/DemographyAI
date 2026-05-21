#!/bin/bash
set -euo pipefail

: "${FRONTEND_PORT:?FRONTEND_PORT is not set}"
: "${BACKEND_PORT:?BACKEND_PORT is not set}"
: "${LAUNCH_MODE:?LAUNCH_MODE is not set}"
: "${IP:?IP is not set}"

export NEXT_PUBLIC_BASE_URL="http://$IP:$FRONTEND_PORT"
export NEXT_PUBLIC_BACKEND_URL="http://$IP:$BACKEND_PORT"

echo "[frontend] url=$NEXT_PUBLIC_BASE_URL  backend=$NEXT_PUBLIC_BACKEND_URL"

if ! command -v npm &> /dev/null; then
  echo "⚠ npm not found"
  exit 1
fi
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi


case "$LAUNCH_MODE" in
  dev)
    exec npm run dev
    ;;
  prod)
    npm run build && exec npm start
    ;;
  *)
    echo "[frontend] ERROR: unknown LAUNCH_MODE '$LAUNCH_MODE'" >&2
    exit 1
    ;;
esac