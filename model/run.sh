set -e
echo "▶ Starting MODEL service..."

source ~/miniconda3/etc/profile.d/conda.sh
conda activate demo_model

uvicorn main:app --host 0.0.0.0 --port 9000 