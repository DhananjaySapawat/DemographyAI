from app.db.connection import image_collection, processed_image_collection, face_collection, video_collection
from bson.objectid import ObjectId

async def create_image_record(image_data: dict) -> ObjectId:
    """Insert image data and return unique ID."""
    return image_collection.insert_one(image_data).inserted_id

async def create_processed_image_record(image_data: dict) -> ObjectId:
    """Insert image data and return unique ID."""
    return processed_image_collection.insert_one(image_data).inserted_id

async def create_image_face_record(face_data: dict) -> ObjectId:
    """Insert face data and increment face_count in the related image."""
    # Increment face_count
    image_collection.update_one(
        {"_id": face_data["image_id"]},                 
        {"$inc": {"face_count": 1}} 
    )
    return face_collection.insert_one(face_data).inserted_id

async def create_video_record(video_data: dict) -> ObjectId:
    """Insert video data and return unique ID."""
    return video_collection.insert_one(video_data).inserted_id