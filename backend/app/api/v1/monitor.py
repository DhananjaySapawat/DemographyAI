from fastapi import APIRouter, HTTPException
from app.providers import database

db_queries = database.query
router = APIRouter()

@router.get("/media")
def get_media():
    return db_queries.get_media()

@router.get("/media/{id}")
def get_media_by_id(id: int):
    item = db_queries.get_media_by_id(id)
    if not item:
        raise HTTPException(status_code=404, detail="Media not found")
    return item