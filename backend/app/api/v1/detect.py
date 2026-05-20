from fastapi import APIRouter, UploadFile, Request, File, HTTPException, status, Form
from app.services import ImageService, VideoService
from app.config import ALLOWED_IMAGE_TYPES, ALLOWED_VIDEO_TYPES
import uuid 

router = APIRouter()

@router.post("/detect/image")
async def detect_image(
    request: Request,
    file: UploadFile = File(...),
    upload_type: str = Form(...)
):
    try:
        if upload_type not in {"image_upload", "image_snapshot"}:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid upload type"
            )
        
        if file.content_type not in ALLOWED_IMAGE_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unsupported image format"
            )

        request_data = {
            "request_id": str(uuid.uuid4()),
            "endpoint": str(request.url.path),
            "upload_type": upload_type,
            "ip_address": request.client.host,
            "user_agent": request.headers.get("user-agent"),
        }

        request_url = request.headers.get("origin") or str(request.base_url)
        image_service = ImageService(file, request_data, request_url)
        result = await image_service.process_image()
        
        return {"result": result}
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Image processing failed"
        )


@router.post("/detect/video")
async def detect_video_upload(request: Request, file: UploadFile = File(...)):
    try:

        if file.content_type not in ALLOWED_VIDEO_TYPES:
            raise HTTPException(status_code=400, detail="Unsupported video format")

        request_data = {
            "request_id": str(uuid.uuid4()),
            "endpoint": str(request.url.path),
            "upload_type": "video_upload",
            "ip_address": request.client.host,
            "user_agent": request.headers.get("user-agent"),
        }

        request_url = request.headers.get("origin") or str(request.base_url)
        video_service = VideoService(file, request_data, request_url)
        result = await video_service.process_video()
        
        return {"result": result}

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Video processing failed")