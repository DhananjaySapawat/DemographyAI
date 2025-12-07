import cloudinary
import cloudinary.uploader
from .base import BaseStorage
class CloudinaryStorage(BaseStorage):
    def __init__(self, cloud_name, api_key, api_secret):
        cloudinary.config( 
            cloud_name = cloud_name, 
            api_key = api_key, 
            api_secret = api_secret, 
            secure=True
        )

    def upload_image(self, image_byte: bytes):
        try:
            upload = cloudinary.uploader.upload(image_byte)
        except Exception as e:
            raise ValueError(f"Cloudinary image upload failed: {e}")

        return {
            "url": upload["secure_url"],
            "id": upload["public_id"]
        }

    def upload_video(self, video_path: str):
        try:
            upload = cloudinary.uploader.upload(
                video_path,
                resource_type="video"
            )
        except Exception as e:
            raise ValueError(f"Cloudinary video upload failed: {e}")

        return upload["secure_url"]