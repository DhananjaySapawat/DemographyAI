import cloudinary
import cloudinary.uploader
from app.config import CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

# Configuration       
cloudinary.config( 
    cloud_name = CLOUDINARY_CLOUD_NAME, 
    api_key = CLOUDINARY_API_KEY, 
    api_secret = CLOUDINARY_API_SECRET, 
    secure=True
)

def upload_image_to_cloud(image):
    image_upload = cloudinary.uploader.upload(image)
    return image_upload["url"], image_upload["public_id"]
    
def upload_video_to_cloud(path):
    video_url = cloudinary.uploader.upload(path, resource_type="video")["secure_url"]
    return video_url