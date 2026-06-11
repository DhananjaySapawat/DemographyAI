#!/bin/bash
set -euo pipefail

: "${BACKEND_PORT:?BACKEND_PORT is not set}"
: "${MODEL_PORT:?MODEL_PORT is not set}"
: "${LAUNCH_MODE:?LAUNCH_MODE is not set}"
: "${IP:?IP is not set}"

export MODEL_URL="http://localhost:$MODEL_PORT"
export LOCAL_BASE_URL="http://localhost:$BACKEND_PORT"
export BASE_URL="http://$IP:$BACKEND_PORT"

echo "[backend] port=$BACKEND_PORT  model=$MODEL_URL  base=$BASE_URL"

if command -v conda &>/dev/null; then
  source "$(conda info --base)/etc/profile.d/conda.sh"
  ENV_NAME="demo_backend"
  if ! conda env list | grep -q "$ENV_NAME"; then
    echo "[backend] creating conda env $ENV_NAME..."
    conda create -y -n "$ENV_NAME" python=3.11
  fi
  conda activate "$ENV_NAME"
  pip install -q -r requirements.txt
else
  echo "[backend] WARNING: conda not found, using system python" >&2
fi


if command -v conda &> /dev/null; then
    echo "[backend] Conda detected"
    source "$(conda info --base)/etc/profile.d/conda.sh"
    ENV_NAME="demo_backend"

    if ! conda env list | grep -q "$ENV_NAME"; then
      echo "[backend] Creating conda environment..."
      conda create -y -n $ENV_NAME python=3.11
      conda activate $ENV_NAME
      pip install -r requirements.txt

    else
      conda activate $ENV_NAME
    fi

else
  echo "[backend] WARNING: conda not found, using system python" >&2
fi

case "$LAUNCH_MODE" in
  dev)
    exec uvicorn app.main:app --host 0.0.0.0 --port "$BACKEND_PORT" --reload
    ;;
  prod)
    exec gunicorn app.main:app \
      -k uvicorn.workers.UvicornWorker \
      -w "$(nproc)" \
      -b "0.0.0.0:$BACKEND_PORT" \
      --timeout 120
    ;;
  *)
    echo "[backend] ERROR: unknown LAUNCH_MODE '$LAUNCH_MODE'" >&2
    exit 1
    ;;
esac