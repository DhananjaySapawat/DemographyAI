set -e
echo "▶ Starting BACKEND service..."

source ~/miniconda3/etc/profile.d/conda.sh
conda activate demo_backend

export MODEL_URL="http://localhost:9000"
export MONGO_URL="mongodb://localhost:27017"
export SQLITE_FILE_PATH="local_storage/demographyAI.db"
export LOCAL_UPLOAD_DIR="local_storage"
export BASE_URL="http://localhost:8000"

uvicorn app.main:app --host 0.0.0.0 --port 8000 