from app.config import STORAGE_PROVIDER
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
        upload_root = load_env("LOCAL_UPLOAD_DIR")    
        base_url = load_env("BASE_URL")    

        from .local_storage import LocalStorage
        return LocalStorage(
            upload_root=upload_root,
            base_url=base_url
        )

    else:
        raise ValueError(f"Unknown STORAGE_PROVIDER: {STORAGE_PROVIDER}")
