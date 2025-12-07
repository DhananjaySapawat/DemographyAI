from fastapi import APIRouter
from fastapi.responses import JSONResponse
from app.providers import database 

router = APIRouter()

@router.get("/monitor/original")
async def get_original_images():
    return database.get_original_images()

@router.get("/monitor/processed")
async def get_processed_images():
    return database.get_processed_images()


@router.get("/monitor/videos")
async def get_videos():
    return database.get_videos()


@router.get("/monitor/faces/{image_id}")
async def get_faces_for_image(image_id: str):
    return database.get_faces_for_image(image_id)

