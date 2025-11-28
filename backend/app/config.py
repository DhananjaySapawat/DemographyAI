import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# -----------------------------
# Cloudinary configuration
# -----------------------------
CLOUDINARY_CLOUD_NAME = os.getenv("CLOUD_NAME")
CLOUDINARY_API_KEY = os.getenv("API_KEY")
CLOUDINARY_API_SECRET = os.getenv("API_SECRET")

BASE_URL = os.getenv("BASE_URL")
MODEL_URL = os.getenv("MODEL_URL")

IS_LOCAL = os.getenv("IS_LOCAL")
LOCAL_UPLOAD_DIR = os.getenv("LOCAL_UPLOAD_DIR")
os.makedirs(LOCAL_UPLOAD_DIR, exist_ok=True)

MONGO_URL = os.getenv("MONGO_URL")
