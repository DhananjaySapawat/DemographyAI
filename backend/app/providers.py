from app.storage import create_storage_provider
from app.db import create_db_provider

storage = create_storage_provider()
print("Storage initialized:", storage.__class__.__name__)

database = create_db_provider()
print("Database initialized:", database.__class__.__name__)

