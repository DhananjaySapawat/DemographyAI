from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.service import ImageService, VideoService

router = APIRouter()

@router.post("/detect/image/upload")
async def detect_image_upload(file: UploadFile = File(...)):
    try:
        image_service = ImageService(file, "image_upload")
        await image_service.process_image()
        return {"result": image_service.result}

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Image processing failed"
        )

@router.post("/detect/image/snapshot")
async def detect_image_snapshot(file: UploadFile = File(...)):
    try :
        snapshot_service = ImageService(file, "image_snapshot")
        await snapshot_service.process_image()
        return {"result": snapshot_service.result}
    except Exception as e:
        return {"error": str(e)}

@router.post("/detect/video/upload")
async def detect_video_upload(file: UploadFile = File(...)):
    try :
        video_service = VideoService(file)
        video_url = await video_service.run(file)
        return {"video_url": video_url}
    except Exception as e:
        return {"error": str(e)}
