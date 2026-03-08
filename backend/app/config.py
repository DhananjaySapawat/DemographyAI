import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

BASE_URL = os.getenv("BASE_URL")
MODEL_URL = os.getenv("MODEL_URL")

STORAGE_PROVIDER = os.getenv("STORAGE_PROVIDER")
DB_PROVIDER = os.getenv("DB_PROVIDER")

MAX_IMAGE_SIZE = 10
ALLOWED_IMAGE_TYPES = { "image/jpeg", "image/jpg", "image/png", "image/webp"}

MAX_VIDEO_SIZE = 30
ALLOWED_VIDEO_TYPES = {"video/mp4", "video/webm", "video/quicktime"}
