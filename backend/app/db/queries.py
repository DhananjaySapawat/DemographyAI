from app.db.mongo import image_collection, processed_image_collection, face_collection, video_collection
from bson.objectid import ObjectId
from datetime import datetime, date

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


# Database query functions
def get_original_images():
    docs = list(image_collection.find().sort("_id", -1))
    return serialize_docs(docs)


def get_processed_images():
    docs = list(processed_image_collection.find().sort("_id", -1))
    return serialize_docs(docs)


def get_videos():
    docs = list(video_collection.find().sort("_id", -1))
    return serialize_docs(docs)


def get_faces_for_image(image_id: str):
    query_image_id = try_objectid(image_id)
    docs = list(face_collection.find({"image_id": query_image_id}))
    return serialize_docs(docs)
