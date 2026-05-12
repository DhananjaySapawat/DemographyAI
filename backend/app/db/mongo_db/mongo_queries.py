import pymongo
from bson.objectid import ObjectId
from pymongo.errors import PyMongoError
from fastapi.encoders import jsonable_encoder

from app.db.base import BaseQueries


class MongoQueries(BaseQueries):

    def __init__(self, mongo_url: str):
        try:
            self.client = pymongo.MongoClient(mongo_url)
            self.db     = self.client["demographyAI"]

            self.image_collection           = self.db["image_data"]
            self.processed_image_collection = self.db["processed_image_data"]
            self.face_collection            = self.db["face_data"]
            self.video_collection           = self.db["video_data"]

        except PyMongoError as e:
            raise RuntimeError(f"Failed to connect to MongoDB: {e}")

    # ----------------------------------------------------------
    # internal helpers
    # ----------------------------------------------------------

    def _serialize(self, doc: dict) -> dict:
        """Convert a single MongoDB doc — _id → id as string."""
        return jsonable_encoder(
            doc | {"id": str(doc["_id"])},
            custom_encoder={ObjectId: str},
        )

    def _serialize_many(self, cursor) -> list[dict]:
        return [self._serialize(doc) for doc in cursor]

    # ----------------------------------------------------------
    # media
    # ----------------------------------------------------------

    def get_media(self) -> list[dict]:
        """
        Returns all images and videos as a unified list.
        Every row has:
          media_type       : 'image' | 'video'
          thumb_url        : image_url for images, video_url for videos
          face_count       : face_count (images) / faces_detected (videos)
          duration_seconds : None for images
        Sorted by created_at descending.
        """
        images = [
            {
                "media_type":        "image",
                "id":                str(doc["_id"]),
                "request_id":        doc.get("request_id"),
                "thumb_url":         doc.get("image_url"),
                "original_filename": doc.get("original_filename"),
                "face_count":        doc.get("face_count"),
                "file_size":         doc.get("size"),
                "duration_seconds":  None,
                "width":             doc.get("width"),
                "height":            doc.get("height"),
                "inference_time_ms": doc.get("inference_time_ms"),
                "created_at":        doc.get("created_at"),
                "status":            doc.get("status"),
            }
            for doc in self.image_collection.find().sort("created_at", -1)
        ]

        videos = [
            {
                "media_type":        "video",
                "id":                str(doc["_id"]),
                "request_id":        doc.get("request_id"),
                "thumb_url":         doc.get("video_url"),
                "original_filename": doc.get("original_filename"),
                "face_count":        doc.get("faces_detected"),
                "file_size":         doc.get("file_size"),
                "duration_seconds":  doc.get("duration_seconds"),
                "width":             doc.get("width"),
                "height":            doc.get("height"),
                "inference_time_ms": doc.get("inference_time_ms"),
                "created_at":        doc.get("created_at"),
                "status":            doc.get("status"),
            }
            for doc in self.video_collection.find().sort("created_at", -1)
        ]

        combined = images + videos
        combined.sort(key=lambda x: x["created_at"] or "", reverse=True)
        return combined

    def get_media_by_id(self, id: int | str) -> dict | None:
        """
        Finds the item by id — checks images first, then videos.
        Returns full doc with nested faces[].
        For images: includes processed_image if it exists.
        """
        object_id = ObjectId(str(id))

        # try image first
        doc = self.image_collection.find_one({"_id": object_id})
        if doc:
            item = self._serialize(doc)
            item["media_type"] = "image"

            item["faces"] = self._serialize_many(
                self.face_collection.find({"image_id": object_id})
            )
            item["processed_image"] = self._serialize(
                self.processed_image_collection.find_one({"original_id": object_id})
            ) if self.processed_image_collection.find_one({"original_id": object_id}) else None

            return item

        # try video
        doc = self.video_collection.find_one({"_id": object_id})
        if doc:
            item = self._serialize(doc)
            item["media_type"] = "video"
            item["faces"]      = self._serialize_many(
                self.face_collection.find({"video_id": object_id})
            )
            return item

        return None