from app.utils import load_env

DEPLOY_MODE = load_env("DEPLOY_MODE") 
MODEL_URL = load_env("MODEL_URL")
STORAGE_PROVIDER = load_env("STORAGE_PROVIDER")
DB_PROVIDER = load_env("DB_PROVIDER")

MONITOR_USERNAME = load_env("MONITOR_USERNAME")
MONITOR_PASSWORD_HASH = load_env("MONITOR_PASSWORD_HASH")  
SESSION_SECRET = load_env("SESSION_SECRET") 

# -----------------------------
# Required variable validation
# -----------------------------
_REQUIRED = {
    "DEPLOY_MODE": DEPLOY_MODE,
    "MODEL_URL": MODEL_URL,
    "STORAGE_PROVIDER": STORAGE_PROVIDER,
    "DB_PROVIDER": DB_PROVIDER,
    "MONITOR_USERNAME": MONITOR_USERNAME,
    "MONITOR_PASSWORD_HASH": MONITOR_PASSWORD_HASH,
    "SESSION_SECRET": SESSION_SECRET,
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

WEBSITE_NAME     = "DemographyAI"
LOCAL_UPLOAD_DIR = "local_storage"

# -----------------------------
# Allowed Origins
# -----------------------------
if DEPLOY_MODE == "production":
    FRONT_END_URL = load_env("FRONT_END_URL")
    MONITOR_FRONTEND_URL = load_env("MONITOR_FRONTEND_URL")

    ALLOWED_ORIGINS = [
        FRONT_END_URL,
        MONITOR_FRONTEND_URL,
    ]
else:
    ALLOWED_ORIGINS = ["*"]