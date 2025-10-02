import cv2
from app.processing.image_process import cv_to_buffer

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

async def extract_faces(image) -> list:
    faces = []
    for (x, y, w, h) in extract_face_coordinates_upload(image):
        face_img = image[y:y+h, x:x+w]
        faces.append({"cv_img" : face_img, "buffer_img" : cv_to_buffer(face_img), "cords": (x, y, w, h)})
    return faces
