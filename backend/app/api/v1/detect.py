from fastapi import APIRouter, UploadFile, File
from app.services.upload_service import process_upload_image, process_upload_video

router = APIRouter()

@router.post("/detect/image/upload")
async def detect_image_upload(file: UploadFile = File(...)):
    try :
        result = await process_upload_image(file, "image_upload")
        return {"result": result}
    except Exception as e:
        return {"error": str(e)}

@router.post("/detect/image/snapshot")
async def detect_image_snapshot(file: UploadFile = File(...)):
    try :
        result = await process_upload_image(file, "image_snapshot")
        return {"result": result}
    except Exception as e:
        return {"error": str(e)}

@router.post("/detect/video/upload")
async def detect_video_upload(file: UploadFile = File(...)):
    try :
        video_url = await process_upload_video(file)
        return {"video_url": video_url}
    except Exception as e:
        return {"error": str(e)}
