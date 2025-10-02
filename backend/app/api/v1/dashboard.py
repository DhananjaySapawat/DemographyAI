from fastapi import APIRouter
from fastapi.responses import JSONResponse
from app.db.crud import (
    image_collection,
    processed_image_collection,
    face_collection,
    video_collection,
)
from bson import ObjectId
from datetime import datetime, date

router = APIRouter()


def to_jsonable(value):
    """Recursively convert BSON/unsupported types to JSON-safe types."""
    if isinstance(value, ObjectId):
        return str(value)
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    if isinstance(value, dict):
        return {k: to_jsonable(v) for k, v in value.items()}
    if isinstance(value, list):
        return [to_jsonable(v) for v in value]
    return value


def serialize_docs(docs):
    """Convert list of MongoDB docs to JSON-serializable list."""
    return [to_jsonable(dict(doc)) for doc in docs]


def try_objectid(value: str):
    """Parse a string into ObjectId if valid; otherwise return the original string."""
    try:
        return ObjectId(value)
    except Exception:
        return value


@router.get("/monitor/original")
async def get_original_images():
    docs = list(image_collection.find().sort("_id", -1))
    return JSONResponse(content=serialize_docs(docs))


@router.get("/monitor/processed")
async def get_processed_images():
    docs = list(processed_image_collection.find().sort("_id", -1))
    return JSONResponse(content=serialize_docs(docs))


@router.get("/monitor/videos")
async def get_videos():
    docs = list(video_collection.find().sort("_id", -1))
    return JSONResponse(content=serialize_docs(docs))


@router.get("/monitor/faces/{image_id}")
async def get_faces_for_image(image_id: str):
    query_image_id = try_objectid(image_id)
    docs = list(face_collection.find({"image_id": query_image_id}))
    return JSONResponse(content=serialize_docs(docs))
