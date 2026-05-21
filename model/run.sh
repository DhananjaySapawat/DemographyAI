#!/bin/bash
set -euo pipefail

: "${MODEL_PORT:?MODEL_PORT is not set}"
: "${BACKEND_PORT:?BACKEND_PORT is not set}"
: "${LAUNCH_MODE:?LAUNCH_MODE is not set}"

export BACKEND_URL="http://localhost:$BACKEND_PORT"

echo "[model] port=$MODEL_PORT  backend=$BACKEND_URL"

if command -v conda &> /dev/null; then
    echo "[model] Conda detected"
    source "$(conda info --base)/etc/profile.d/conda.sh"
    ENV_NAME="demo_model"

    if ! conda env list | grep -q "$ENV_NAME"; then
      echo "[model] Creating conda environment..."
      conda create -y -n $ENV_NAME python=3.11
      conda activate $ENV_NAME
      pip install -r requirements.txt

    else
      conda activate $ENV_NAME
    fi

else
  echo "[model] WARNING: conda not found, using system python" >&2
fi
case "$LAUNCH_MODE" in
  dev)
    exec uvicorn main:app --host 0.0.0.0 --port "$MODEL_PORT" --reload
    ;;
  prod)
    exec gunicorn main:app \
      -k uvicorn.workers.UvicornWorker \
      -w "$(nproc)" \
      -b "0.0.0.0:$MODEL_PORT" \
      --timeout 120
    ;;
  *)
    echo "[model] ERROR: unknown LAUNCH_MODE '$LAUNCH_MODE'" >&2
    exit 1
    ;;
esac