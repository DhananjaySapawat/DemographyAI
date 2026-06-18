#!/bin/bash
set -euo pipefail

: "${PUBLIC_FRONTEND_URL:?PUBLIC_FRONTEND_URL is not set}"
: "${FRONTEND_PORT:?FRONTEND_PORT is not set}"
: "${PUBLIC_BACKEND_URL:?PUBLIC_BACKEND_URL is not set}"
: "${DEPLOY_MODE:?DEPLOY_MODE is not set}"

export NEXT_PUBLIC_BASE_URL="$PUBLIC_FRONTEND_URL"
export NEXT_PUBLIC_BACKEND_URL="$PUBLIC_BACKEND_URL"

echo "[frontend] url=$NEXT_PUBLIC_BASE_URL  backend=$NEXT_PUBLIC_BACKEND_URL port=$FRONTEND_PORT"

if ! command -v npm &> /dev/null; then
  echo "⚠ npm not found"
  exit 1
fi

case "$DEPLOY_MODE" in
  development)
    exec npm run dev -- -p "$FRONTEND_PORT"
    ;;
  production)
    npm run build && exec npm start -- -p "$FRONTEND_PORT"
    ;;
  *)
    echo "[frontend] ERROR: unknown DEPLOY_MODE '$DEPLOY_MODE'" >&2
    exit 1
    ;;
esac