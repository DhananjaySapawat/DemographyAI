from fastapi import APIRouter, HTTPException, Request  

from app.providers import database

db_queries = database.query
router = APIRouter()

@router.get("/media")
def get_media(request: Request):  
    request_url = request.headers.get("origin") or str(request.base_url)
    return db_queries.get_media(request_url)  


@router.get("/media/{request_id}")
def get_media_by_request_id(request_id: str, request: Request):  
    request_url = request.headers.get("origin") or str(request.base_url)
    item = db_queries.get_media_by_request_id(request_id, request_url)  
    if not item:
        raise HTTPException(status_code=404, detail="Media not found")
    return item