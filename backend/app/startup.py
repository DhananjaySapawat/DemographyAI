import os
from app.config import STORAGE_PROVIDER
from fastapi.staticfiles import StaticFiles

from app.utils import load_env

def init_startup(app):
    provider = STORAGE_PROVIDER.lower()

    if provider == "local":
        upload_root = load_env("LOCAL_UPLOAD_DIR")  
        os.makedirs(upload_root, exist_ok=True)
        app.mount("/uploads", StaticFiles(directory=upload_root), name="uploads")
        print(f"Mounted local storage at /uploads → {upload_root}")

    @app.on_event("startup")
    async def startup_event():
        print("Application startup complete.")

    @app.on_event("shutdown")
    async def shutdown_event():
        print("Application shutdown complete.")
