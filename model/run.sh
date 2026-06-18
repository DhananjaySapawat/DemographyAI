#!/bin/bash
set -euo pipefail

: "${LOCAL_MODEL_URL:?LOCAL_MODEL_URL is not set}"
: "${MODEL_PORT:?MODEL_PORT is not set}"
: "${LOCAL_BACKEND_URL:?LOCAL_BACKEND_URL is not set}"
: "${DEPLOY_MODE:?DEPLOY_MODE is not set}"

export BACKEND_URL="$LOCAL_BACKEND_URL"
export MODEL_URL="$LOCAL_MODEL_URL"

echo "[model] model=$MODEL_URL backend=$BACKEND_URL port=$MODEL_PORT"

if command -v conda &> /dev/null; then
    echo "[model] Conda detected"
    source "$(conda info --base)/etc/profile.d/conda.sh"
    ENV_NAME="demographyai-model"

    if ! conda env list | grep -q "$ENV_NAME"; then
      echo "[model] WARNING: conda env '$ENV_NAME' not found, using system python" >&2
    else
      conda activate $ENV_NAME
    fi

else
  echo "[model] WARNING: conda not found, using system python" >&2
fi

case "$DEPLOY_MODE" in
  development)
    exec uvicorn main:app --host 0.0.0.0 --port "$MODEL_PORT" --reload
    ;;
  production)
    exec gunicorn main:app \
      -k uvicorn.workers.UvicornWorker \
      -w "$(nproc)" \
      -b "0.0.0.0:$MODEL_PORT" \
      --timeout 120
    ;;
  *)
    echo "[model] ERROR: unknown DEPLOY_MODE '$DEPLOY_MODE'" >&2
    exit 1
    ;;
esac