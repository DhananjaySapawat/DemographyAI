import numpy as np
import cv2 

yunet_model_path = "app/processing/face_model/yunet_n_640_640.onnx"

def buffer_to_cv(file):
    file_bytes = np.frombuffer(file, np.uint8)
    return cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

def cv_to_buffer(image):
    _, encoded_image = cv2.imencode('.jpg', image)
    return encoded_image.tobytes()

def scale_coordinates(face_coordinates, scale_width, scale_height):
    x, y, w, h = face_coordinates[:4]
    return int(x * scale_width), int(y * scale_height), int(w * scale_width), int(h * scale_height)

def extract_face_coordinates(image):
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

def write_face_labels(frame, x1, y1, x2, y2, attributes):
        font = cv2.FONT_HERSHEY_SIMPLEX
        font_scale = 0.6
        thickness = 2
        text_height = 20  
        bg_color = (35,102,11)

        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
        annotations = [f'Age: {attributes["age_v1"]}',f'Gender: {attributes["gender"]}',f'Ethnicity: {attributes["ethnicity"]}',f'Emotion: {attributes["emotion"]}']

        for i, text in enumerate(annotations):
            top_left = (x1, y2 + i * text_height)
            bottom_right = (x2, y2 + (i + 1) * text_height)
            cv2.rectangle(frame, top_left, bottom_right, bg_color, cv2.FILLED)
            text_position = (x1 + 5, y2 + (i + 1) * text_height - 5)
            cv2.putText(frame, text, text_position, font, font_scale, (255, 255, 255), thickness)