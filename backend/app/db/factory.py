from app.config import DB_PROVIDER, LOCAL_UPLOAD_DIR
from app.utils import load_env

def create_db_provider():
    provider = DB_PROVIDER.lower()

    if provider == "mongo":
        from .mongo_db import MongoDatabase
        mongo_url = load_env("MONGO_URL")
        return MongoDatabase(mongo_url)

    elif provider == "sqlite":
        from .sqlite import SQLiteDatabase
        sqlite_file = load_env("SQLITE_FILE") 
        return SQLiteDatabase(f"{LOCAL_UPLOAD_DIR}/{sqlite_file}")

    else:
        raise ValueError(f"Unknown DB_PROVIDER: {DB_PROVIDER}")