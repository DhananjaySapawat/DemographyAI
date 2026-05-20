from app.config import STORAGE_PROVIDER, LOCAL_UPLOAD_DIR
from app.utils import load_env

def create_storage_provider():

    provider = STORAGE_PROVIDER.lower()
    if provider == "cloudinary":
        cloud_name = load_env("CLOUD_NAME")
        api_key = load_env("API_KEY")
        api_secret = load_env("API_SECRET")
        
        from .cloudinary_storage import CloudinaryStorage
        return CloudinaryStorage(
            cloud_name=cloud_name,
            api_key=api_key,
            api_secret=api_secret
        )
    
    elif provider == "local":
        
        local_base_url = load_env("LOCAL_BASE_URL")
        base_url = load_env("BASE_URL")

        from .local_storage import LocalStorage
        return LocalStorage(
            upload_root=LOCAL_UPLOAD_DIR,
            local_base_url=local_base_url,
            base_url=base_url
        )

    else:
        raise ValueError(f"Unknown STORAGE_PROVIDER: {STORAGE_PROVIDER}")
