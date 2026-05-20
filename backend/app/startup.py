import os
from app.config import LOCAL_UPLOAD_DIR
from fastapi.staticfiles import StaticFiles

def init_startup(app):

    os.makedirs(LOCAL_UPLOAD_DIR, exist_ok=True)
    app.mount("/uploads", StaticFiles(directory=LOCAL_UPLOAD_DIR), name="uploads")

    @app.on_event("startup")
    async def startup_event():
        print("Application startup complete.")

    @app.on_event("shutdown")
    async def shutdown_event():
        print("Application shutdown complete.")
