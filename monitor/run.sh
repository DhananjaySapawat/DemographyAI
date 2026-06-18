#!/bin/bash
set -euo pipefail

: "${PUBLIC_MONITOR_URL:?PUBLIC_MONITOR_URL is not set}"
: "${MONITOR_PORT:?MONITOR_PORT is not set}"
: "${PUBLIC_BACKEND_URL:?PUBLIC_BACKEND_URL is not set}"
: "${DEPLOY_MODE:?DEPLOY_MODE is not set}"

export NEXT_PUBLIC_BASE_URL="$PUBLIC_MONITOR_URL"
export NEXT_PUBLIC_BACKEND_URL="$PUBLIC_BACKEND_URL"

echo "[monitor] url=$NEXT_PUBLIC_BASE_URL  backend=$NEXT_PUBLIC_BACKEND_URL port=$MONITOR_PORT"

if ! command -v npm &> /dev/null; then
  echo "⚠ npm not found"
  exit 1
fi

case "$DEPLOY_MODE" in
  development)
    exec npm run dev -- -p "$MONITOR_PORT"
    ;;
  production)
    npm run build && exec npm start -- -p "$MONITOR_PORT"
    ;;
  *)
    echo "[monitor] ERROR: unknown DEPLOY_MODE '$DEPLOY_MODE'" >&2
    exit 1
    ;;
esac