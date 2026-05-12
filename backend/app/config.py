import os
from dotenv import load_dotenv

load_dotenv()

MODE = os.getenv("MODE")

FRONT_END_URL = os.getenv("FRONTEND_URL")
MONITOR_FRONTEND_URL = os.getenv("MONITOR_FRONTEND_URL")
BASE_URL = os.getenv("BASE_URL")
MODEL_URL = os.getenv("MODEL_URL")

STORAGE_PROVIDER = os.getenv("STORAGE_PROVIDER")
DB_PROVIDER = os.getenv("DB_PROVIDER")

# -----------------------------
# Required variable validation
# -----------------------------
_REQUIRED = {
    "FRONTEND_URL": FRONT_END_URL,
    "MONITOR_FRONTEND_URL": MONITOR_FRONTEND_URL,
    "BASE_URL": BASE_URL,
    "MODEL_URL": MODEL_URL,
    "STORAGE_PROVIDER": STORAGE_PROVIDER,
    "DB_PROVIDER": DB_PROVIDER,
}

_missing = [name for name, value in _REQUIRED.items() if not value]

if _missing:
    raise EnvironmentError(
        f"Missing required environment variables: {', '.join(_missing)}\n"
        "Please check your .env file."
    )

# -----------------------------
# Constants
# -----------------------------
MAX_IMAGE_SIZE = 10
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/webp"}

MAX_VIDEO_SIZE = 30
ALLOWED_VIDEO_TYPES = {"video/mp4", "video/webm", "video/quicktime"}

WEBSITE_NAME = "DemographyAI"