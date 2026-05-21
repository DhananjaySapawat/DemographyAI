#!/bin/bash
set -euo pipefail

DEPLOY_MODE="development"
LAUNCH_MODE="dev"
DEPLOY_PROFILE="development-1"
STORAGE_PROVIDER="local"
DB_PROVIDER="sqlite"
FRONTEND_PORT=3000
MONITOR_PORT=4000
BACKEND_PORT=8000
MODEL_PORT=9000

if [[ "$DEPLOY_PROFILE" == "production-1" ]]; then
  STORAGE_PROVIDER="cloudinary"
  DB_PROVIDER="firebase"
fi

IP=$(hostname -I 2>/dev/null | awk '{print $1}')
IP="${IP:-localhost}"
 
export DEPLOY_MODE LAUNCH_MODE DEPLOY_PROFILE
export STORAGE_PROVIDER DB_PROVIDER
export FRONTEND_PORT MONITOR_PORT BACKEND_PORT MODEL_PORT
export IP

echo ""
echo "================================="
echo "  Deploy Mode   : $DEPLOY_MODE"
echo "  Launch Mode   : $LAUNCH_MODE"
echo "  Profile       : $DEPLOY_PROFILE"
echo "  Storage       : $STORAGE_PROVIDER  DB: $DB_PROVIDER"
echo "  Ports         : fe=$FRONTEND_PORT  mon=$MONITOR_PORT  be=$BACKEND_PORT  model=$MODEL_PORT"
echo "================================="
echo ""

start_services() {
  bash -c "cd model    && ./run.sh" &  PID_MODEL=$!
  bash -c "cd backend  && ./run.sh" &  PID_BACKEND=$!
  bash -c "cd frontend && ./run.sh" &  PID_FRONTEND=$!
  bash -c "cd monitor  && ./run.sh" &  PID_MONITOR=$!

  trap 'echo "Shutting down..."; kill $PID_MODEL $PID_BACKEND $PID_FRONTEND $PID_MONITOR 2>/dev/null' EXIT INT TERM

  wait $PID_MODEL $PID_BACKEND $PID_FRONTEND $PID_MONITOR
}

case "$LAUNCH_MODE" in
  docker)
    echo "[run] starting with docker compose"
    docker compose up --build
    ;;
  dev)
    echo "[run] starting services in dev mode"
    start_services
    ;;
  prod)
    echo "[run] starting services in prod mode"
    start_services
    ;;
  *)
    echo "[run] ERROR: unknown LAUNCH_MODE '$LAUNCH_MODE'. expected: dev, prod, docker" >&2
    exit 1
    ;;
esac