#!/bin/bash

MODE=${APP_MODE:-dev}
PORT=${API_PORT:-8000}

echo "Backend starting..."
echo "Mode: $MODE"

# -----------------------------
# Detect local IP
# -----------------------------

IP=$(hostname -I | awk '{print $1}')

echo "Detected local IP: $IP"

# -----------------------------
# ENV VARS
# -----------------------------
export MODEL_URL="http://localhost:9000"
export BASE_URL="http://localhost:8000"
export FRONTEND_URL="http://$IP:3000"

export SQLITE_FILE_PATH="local_storage/demographyAI.db"
export LOCAL_UPLOAD_DIR="local_storage"

# -----------------------------
# CONDA ENV SETUP
# -----------------------------

if command -v conda &> /dev/null; then

    echo "Conda detected"

    source "$(conda info --base)/etc/profile.d/conda.sh"

    ENV_NAME="demo_backend"

    if ! conda env list | grep -q "$ENV_NAME"; then
      echo "Creating conda environment..."

      conda create -y -n $ENV_NAME python=3.11
      conda activate $ENV_NAME

      pip install -r requirements.txt

    else
      echo "Using existing conda environment"
      conda activate $ENV_NAME
    fi

  else
    echo "⚠ Conda not found"

fi

# -----------------------------
# MODE CONFIG
# -----------------------------

if [[ "$MODE" == "dev" ]]; then

  echo "⚡ DEV mode"
  export MODE="LOCAL"

  uvicorn app.main:app \
    --host 0.0.0.0 \
    --port $PORT \
    --reload


elif [[ "$MODE" == "local" ]]; then

  echo "🖥 LOCAL production mode"
  export MODE="LOCAL"

  gunicorn app.main:app \
    -k uvicorn.workers.UvicornWorker \
    -w $(nproc) \
    -b 0.0.0.0:$PORT


elif [[ "$MODE" == "prod" ]]; then

  echo "🚀 PRODUCTION mode"
  export MODE="PRODUCTION"

  gunicorn app.main:app \
    -k uvicorn.workers.UvicornWorker \
    -w $(nproc) \
    -b 0.0.0.0:$PORT

else
  echo "Unknown mode: $MODE"
  exit 1
fi