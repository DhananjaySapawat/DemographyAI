import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

BASE_URL = os.getenv("BASE_URL")
MODEL_URL = os.getenv("MODEL_URL")

STORAGE_PROVIDER = os.getenv("STORAGE_PROVIDER")
DB_PROVIDER = os.getenv("DB_PROVIDER")

