import os
import shutil
import uuid
from .base import BaseStorage

class LocalStorage(BaseStorage):

    def __init__(self, upload_root: str, base_url: str):
        self.upload_root = upload_root
        self.base_url = base_url

        self.image_storage_dir = os.path.join(upload_root, "images")
        self.video_storage_dir = os.path.join(upload_root, "videos")

        os.makedirs(self.image_storage_dir, exist_ok=True)
        os.makedirs(self.video_storage_dir, exist_ok=True)

    def upload_image(self, image_byte: bytes):
        unique_id = str(uuid.uuid4())
        file_name = f"{unique_id}.png"
        file_path = os.path.join(self.image_storage_dir, file_name)

        try:
            with open(file_path, "wb") as f:
                f.write(image_byte)
        except Exception as e:
            raise RuntimeError(f"Failed to write image file: {e}")

        url =  f"{self.base_url}/uploads/images/{file_name}"
        return {
            "url": url,
            "id": unique_id
        }   
     
    def upload_video(self, temp_path) -> str:
        if not os.path.exists(temp_path):
            raise ValueError("temp video file not found")

        file_name = os.path.basename(temp_path)
        video_path = os.path.join(self.video_storage_dir, file_name)

        try:
            shutil.copy(temp_path, video_path)
        except Exception as e:
            raise RuntimeError(f"Failed to copy video file: {e}")
        
        return f"{self.base_url}/uploads/videos/{file_name}"