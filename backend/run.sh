#!/bin/bash
set -euo pipefail

: "${PUBLIC_FRONTEND_URL:?PUBLIC_FRONTEND_URL is not set}"
: "${PUBLIC_MONITOR_URL:?PUBLIC_MONITOR_URL is not set}"
: "${PUBLIC_BACKEND_URL:?PUBLIC_BACKEND_URL is not set}"
: "${LOCAL_BACKEND_URL:?LOCAL_BACKEND_URL is not set}"
: "${LOCAL_MODEL_URL:?LOCAL_MODEL_URL is not set}"
: "${BACKEND_PORT:?BACKEND_PORT is not set}"
: "${DEPLOY_MODE:?DEPLOY_MODE is not set}"
: "${STORAGE_PROVIDER:?STORAGE_PROVIDER is not set}"
: "${DB_PROVIDER:?DB_PROVIDER is not set}"

export MODEL_URL="$LOCAL_MODEL_URL"
export LOCAL_BASE_URL="$LOCAL_BACKEND_URL"
export BASE_URL="$PUBLIC_BACKEND_URL"
export FRONT_END_URL="$PUBLIC_FRONTEND_URL"
export MONITOR_FRONTEND_URL="$PUBLIC_MONITOR_URL"
export DB_PROVIDER STORAGE_PROVIDER DEPLOY_MODE

echo "[backend] model=$MODEL_URL  base=$BASE_URL local=$LOCAL_BASE_URL port=$BACKEND_PORT"
echo "[backend] frontend=$PUBLIC_FRONTEND_URL  monitor=$PUBLIC_MONITOR_URL"
echo "[backend] deploy=$DEPLOY_MODE  storage=$STORAGE_PROVIDER  db=$DB_PROVIDER"

if command -v conda &> /dev/null; then
    echo "[backend] Conda detected"
    source "$(conda info --base)/etc/profile.d/conda.sh"
    ENV_NAME="demographyai-backend"

    if ! conda env list | grep -q "$ENV_NAME"; then
        echo "[backend] WARNING: conda env '$ENV_NAME' not found, using system python" >&2
    else
        conda activate "$ENV_NAME"
    fi
else
    echo "[backend] WARNING: conda not found, using system python" >&2
fi

case "$DEPLOY_MODE" in
  development)
    exec uvicorn app.main:app --host 0.0.0.0 --port "$BACKEND_PORT" --reload
    ;;
  production)
    exec gunicorn app.main:app \
      -k uvicorn.workers.UvicornWorker \
      -w "$(nproc)" \
      -b "0.0.0.0:$BACKEND_PORT" \
      --timeout 120
    ;;
  *)
    echo "[backend] ERROR: unknown DEPLOY_MODE '$DEPLOY_MODE'" >&2
    exit 1
    ;;
esac