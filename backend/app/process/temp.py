import cv2
import numpy as np
from PIL import Image


IMAGE_DIMENSION = 200
MEAN = np.array([0.485, 0.456, 0.406])
STD = np.array([0.229, 0.224, 0.225])

def preprocess_tflite(cv_image):
    face_image = cv2.cvtColor(cv_image, cv2.COLOR_BGR2RGB)
    image = Image.fromarray(face_image.astype(np.uint8))
    image = image.resize((IMAGE_DIMENSION, IMAGE_DIMENSION), Image.BILINEAR)
    face_image = np.array(image, dtype=np.float32).transpose(2, 0, 1)
    face_image = (face_image / 255.0 - MEAN[:, None, None]) / STD[:, None, None]
    face_image = np.expand_dims(face_image, axis=0)
    return face_image

def video_tflite(video_faces):
    proc_video_faces = {}
    for face_id, face_image in video_faces.items():
        proc_video_faces[face_id] = preprocess_tflite(face_image)
    return proc_video_faces
