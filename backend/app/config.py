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

MODEL_URL = os.getenv("MODEL_URL")