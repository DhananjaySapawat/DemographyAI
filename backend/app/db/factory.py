from app.config import DB_PROVIDER
from app.utils import load_env

def create_db_provider():
    provider = DB_PROVIDER.lower()

    if provider == "mongo":
        from .mongo_db import MongoDatabase
        mongo_url = load_env("MONGO_URL")
        return MongoDatabase(mongo_url)

    elif provider == "sqlite":
        from .sqlite_db import SQLiteDatabase
        sqlite_file_path = load_env("SQLITE_FILE_PATH") 
        return SQLiteDatabase(sqlite_file_path)

    else:
        raise ValueError(f"Unknown DB_PROVIDER: {DB_PROVIDER}")