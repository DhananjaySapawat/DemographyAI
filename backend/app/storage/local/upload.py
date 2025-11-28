import os 
import shutil
from app.config import LOCAL_UPLOAD_DIR
from app.config import BASE_URL
import uuid

def upload_image_local(image_file):
    filename = f"{uuid.uuid4()}.bin"
    file_location = os.path.join(LOCAL_UPLOAD_DIR, filename)
    with open(file_location, "wb") as f:
        f.write(image_file)
    return f"{BASE_URL}/uploads/{filename}", filename

def upload_video_local(video_path):
    file_name = os.path.basename(video_path)
    destination = os.path.join(LOCAL_UPLOAD_DIR, file_name)
    shutil.copy(video_path, destination)
    return f"{BASE_URL}/uploads/{file_name}"
