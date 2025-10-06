import cv2
from app.processing.image_process import cv_to_buffer
import numpy as np
from PIL import Image

IMAGE_DIMENSION = 200
MEAN = np.array([0.485, 0.456, 0.406])
STD = np.array([0.229, 0.224, 0.225])

yunet_model_path = "models/face_model/yunet_n_640_640.onnx"

def scale_coordinates(face_coordinates, scale_width, scale_height):
    x, y, w, h = face_coordinates[:4]
    return int(x * scale_width), int(y * scale_height), int(w * scale_width), int(h * scale_height)

def extract_face_coordinates_upload(image):
    scale = max(image.shape[1] / 1280, image.shape[0] / 1280)
    width, height = image.shape[1], image.shape[0]
    if scale <= 1:
        scale = 1
    else:
        width, height = int(width / scale), int(height / scale)

    face_detector = cv2.FaceDetectorYN.create(yunet_model_path, "", (width, height))
    resized_image = cv2.resize(image, (width, height), interpolation=cv2.INTER_AREA)
    _, detected_faces = face_detector.detect(resized_image)
    if detected_faces is None:
        return []
    return [scale_coordinates(face, scale, scale) for face in detected_faces]

def preprocess_tflite(cv_image):
    face_image = cv2.cvtColor(cv_image, cv2.COLOR_BGR2RGB)
    image = Image.fromarray(face_image.astype(np.uint8))
    image = image.resize((IMAGE_DIMENSION, IMAGE_DIMENSION), Image.BILINEAR)
    face_image = np.array(image, dtype=np.float32).transpose(2, 0, 1)
    face_image = (face_image / 255.0 - MEAN[:, None, None]) / STD[:, None, None]
    face_image = np.expand_dims(face_image, axis=0)
    return face_image

async def extract_faces(image) -> list:
    faces = []
    for (x, y, w, h) in extract_face_coordinates_upload(image):
        face_img = image[y:y+h, x:x+w]
        faces.append({"tflite_img" : preprocess_tflite(face_img), "buffer_img" : cv_to_buffer(face_img), "cords": (x, y, w, h)})
    return faces
