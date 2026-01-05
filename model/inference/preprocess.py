import base64
import numpy as np
import cv2 
from PIL import Image

IMAGE_DIMENSION = 200
MEAN = np.array([0.485, 0.456, 0.406])
STD = np.array([0.229, 0.224, 0.225])

def to_tflite_input(cv_image):
    face_image = cv2.cvtColor(cv_image, cv2.COLOR_BGR2RGB)
    image = Image.fromarray(face_image.astype(np.uint8))
    image = image.resize((IMAGE_DIMENSION, IMAGE_DIMENSION), Image.BILINEAR)
    face_image = np.array(image, dtype=np.float32).transpose(2, 0, 1)
    face_image = (face_image / 255.0 - MEAN[:, None, None]) / STD[:, None, None]
    face_image = np.expand_dims(face_image, axis=0)
    return face_image

def decode_image(encoded_face):
    img_bytes = base64.b64decode(encoded_face)
    np_arr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    return img

