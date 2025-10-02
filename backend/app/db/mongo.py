from pymongo import MongoClient

client = MongoClient("mongodb://root:example@localhost:27017/")
db = client["demographyAI"]

image_collection = db["image_data"]
processed_image_collection = db["processed_image_data"]
face_collection = db["face_data"]
video_collection = db["video_data"]