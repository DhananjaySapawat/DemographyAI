from fastapi import APIRouter
from fastapi.responses import JSONResponse
from app.db.queries import get_original_images, get_processed_images, get_videos, get_faces_for_image

router = APIRouter()

@router.get("/monitor/original")
async def api_get_original_images():
    data = get_original_images()
    return JSONResponse(content=data)

@router.get("/monitor/processed")
async def api_get_processed_images():
    data = get_processed_images()
    return JSONResponse(content=data)

@router.get("/monitor/videos")
async def api_get_videos():
    data = get_videos()
    return JSONResponse(content=data)

@router.get("/monitor/faces/{image_id}")
async def api_get_faces_for_image(image_id: str):
    data = get_faces_for_image(image_id)
    return JSONResponse(content=data)
