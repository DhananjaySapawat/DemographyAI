from .base import BaseDatabase
import pymongo
from bson.objectid import ObjectId
from pymongo.errors import PyMongoError
from fastapi.encoders import jsonable_encoder

class MongoDatabase(BaseDatabase):

    def __init__(self, mongo_url: str):
        try:
            self.client = pymongo.MongoClient(mongo_url)
            self.db = self.client["demographyAI"]

            # Collections used in the application
            self.image_collection = self.db["image_data"]
            self.processed_image_collection = self.db["processed_image_data"]
            self.face_collection = self.db["face_data"]
            self.video_collection = self.db["video_data"]

        except PyMongoError as e:
            raise RuntimeError(f"Failed to connect to MongoDB: {e}")

    # ----------------------------------------------------
    # Insert Methods
    # ----------------------------------------------------

    def add_image(self, image_data: dict) -> ObjectId:
        result = self.image_collection.insert_one(image_data)
        return result.inserted_id

    def add_processed_image(self, image_data: dict) -> ObjectId:
        result = self.processed_image_collection.insert_one(image_data)
        return result.inserted_id

    def add_face(self, face_data: dict) -> ObjectId:
        if "image_id" not in face_data:
            raise ValueError("face_data must contain 'image_id'")

        # Convert image_id from string → ObjectId if needed
        if isinstance(face_data["image_id"], str):
            face_data["image_id"] = ObjectId(face_data["image_id"])

        # Increment face_count in the parent image document
        self.image_collection.update_one(
            {"_id": face_data["image_id"]},
            {"$inc": {"face_count": 1}}
        )

        result = self.face_collection.insert_one(face_data)
        return result.inserted_id

    def add_video(self, video_data: dict) -> ObjectId:
        result = self.video_collection.insert_one(video_data)
        return result.inserted_id

    # ----------------------------------------------------
    # Helper Method
    # ----------------------------------------------------

    def mongo_to_json(self, cursor):
        data = list(cursor)
        return jsonable_encoder(
            data,
            custom_encoder={ObjectId: str}
        )

    # ----------------------------------------------------
    # Read Methods
    # ----------------------------------------------------

    def get_original_images(self):
        return self.mongo_to_json(self.image_collection.find())

    def get_processed_images(self):
        return self.mongo_to_json(self.processed_image_collection.find())

    def get_videos(self):
        return self.mongo_to_json(self.video_collection.find())

    def get_faces_for_image(self, image_id):
        if isinstance(image_id, str):
            image_id = ObjectId(image_id)

        return self.mongo_to_json(
            self.face_collection.find({"image_id": image_id})
        )
