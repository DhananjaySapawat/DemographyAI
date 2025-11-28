from pymongo import MongoClient
from app.config import MONGO_URL

client = MongoClient(MONGO_URL)
db = client["demographyAI"]

image_collection = db["image_data"]
processed_image_collection = db["processed_image_data"]
face_collection = db["face_data"]
video_collection = db["video_data"]