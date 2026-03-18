#!/bin/bash

MODE=${APP_MODE:-dev}
PORT=${MODEL_PORT:-9000}

echo "Model service starting..."
echo "Mode: $MODE"

# -----------------------------
# IP VARS
# -----------------------------

IP=$(hostname -I | awk '{print $1}')

if [ -z "$IP" ]; then
  IP="localhost"
fi

export IP

# -----------------------------
# ENV VARS
# -----------------------------
export BACKEND_URL="http://localhost:8000"
export BASE_URL="http://localhost:9000"

# -----------------------------
# CONDA ENV SETUP
# -----------------------------

if command -v conda &> /dev/null; then

    echo "Conda detected"

    source "$(conda info --base)/etc/profile.d/conda.sh"

    ENV_NAME="demo_model"

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
    echo "⚠ Conda not found, using system python"
fi

# -----------------------------
# MODE CONFIG
# -----------------------------

if [[ "$MODE" == "dev" ]]; then

  echo "⚡ MODEL DEV mode"

  uvicorn main:app \
    --host 0.0.0.0 \
    --port $PORT \
    --reload


elif [[ "$MODE" == "local" || "$MODE" == "prod" ]]; then

  echo "🖥 MODEL LOCAL AND PROUCTION mode"

  gunicorn main:app \
    -k uvicorn.workers.UvicornWorker \
    -w $(nproc) \
    -b 0.0.0.0:$PORT

else
  echo "Unknown mode: $MODE"
  exit 1
fi