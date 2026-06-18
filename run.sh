#!/bin/bash
set -euo pipefail

LAUNCH_MODE="${1:-local}"

IP=$(hostname -I 2>/dev/null | awk '{print $1}')
IP="${IP:-localhost}"

DEPLOY_MODE="development"
STORAGE_PROVIDER="local"
DB_PROVIDER="sqlite"

FRONTEND_PORT=3000
MONITOR_PORT=4000
BACKEND_PORT=8000
MODEL_PORT=9000

PUBLIC_FRONTEND_URL="http://$IP:$FRONTEND_PORT"
PUBLIC_BACKEND_URL="http://$IP:$BACKEND_PORT"
PUBLIC_MONITOR_URL="http://$IP:$MONITOR_PORT"

LOCAL_BACKEND_URL="http://localhost:$BACKEND_PORT"
LOCAL_MODEL_URL="http://localhost:$MODEL_PORT"

if [[ "$LAUNCH_MODE" == "local-frontend" ]]; then
  PUBLIC_BACKEND_URL="http://192.168.0.128:8000"
fi

if [[ "$LAUNCH_MODE" == "docker-backend" ]]; then
  PUBLIC_FRONTEND_URL="https://demography-ai.vercel.app"
  PUBLIC_MONITOR_URL="https://demography-ai-monitor.vercel.app"
fi

echo ""
echo "========================================================"
echo "  Mode     : $DEPLOY_MODE ($LAUNCH_MODE)"
echo "  Storage  : $STORAGE_PROVIDER   DB: $DB_PROVIDER"
echo "  Frontend : $PUBLIC_FRONTEND_URL"
echo "  Monitor  : $PUBLIC_MONITOR_URL"
echo "  Backend  : $PUBLIC_BACKEND_URL  (local: $LOCAL_BACKEND_URL)"
echo "  Model    : $LOCAL_MODEL_URL"
echo "  Ports    : fe=$FRONTEND_PORT  mon=$MONITOR_PORT  be=$BACKEND_PORT  model=$MODEL_PORT"
echo "========================================================"
echo ""

export PUBLIC_FRONTEND_URL PUBLIC_BACKEND_URL PUBLIC_MONITOR_URL
export LOCAL_BACKEND_URL LOCAL_MODEL_URL
export DEPLOY_MODE STORAGE_PROVIDER DB_PROVIDER
export FRONTEND_PORT MONITOR_PORT BACKEND_PORT MODEL_PORT

start_all() {
  bash -c "cd model    && ./run.sh" &  PID_MODEL=$!
  bash -c "cd backend  && ./run.sh" &  PID_BACKEND=$!
  bash -c "cd frontend && ./run.sh" &  PID_FRONTEND=$!
  bash -c "cd monitor  && ./run.sh" &  PID_MONITOR=$!

  trap 'echo "Shutting down..."; kill $PID_MODEL $PID_BACKEND $PID_FRONTEND $PID_MONITOR 2>/dev/null' EXIT INT TERM

  wait $PID_MODEL $PID_BACKEND $PID_FRONTEND $PID_MONITOR
}

start_frontend() {
  bash -c "cd frontend && ./run.sh" &  PID_FRONTEND=$!
  bash -c "cd monitor  && ./run.sh" &  PID_MONITOR=$!

  trap 'echo "Shutting down..."; kill $PID_FRONTEND $PID_MONITOR 2>/dev/null' EXIT INT TERM

  wait $PID_FRONTEND $PID_MONITOR
}

case "$LAUNCH_MODE" in
  local)
    echo "[run] starting all services"
    start_all
    ;;
  local-frontend)
    echo "[run] starting frontend + monitor (backend at $PUBLIC_BACKEND_URL)"
    start_frontend
    ;;
  docker)
    echo "[run] starting with docker compose"
    docker compose up --build
    ;;
  docker-backend)
    echo "[run] starting backend only with docker compose"
    docker compose -f docker-compose.backend.yml up --build
    ;;
  *)
    echo "[run] ERROR: unknown LAUNCH_MODE '$LAUNCH_MODE'. expected: local, local-frontend, docker, docker-backend" >&2
    exit 1
    ;;
esac