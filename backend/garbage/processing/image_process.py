import cv2
import numpy as np

def buffer_to_cv(file):
    file_bytes = np.frombuffer(file, np.uint8)
    return cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

def cv_to_buffer(image):
    _, encoded_image = cv2.imencode('.jpg', image)
    return encoded_image.tobytes()

def add_attributes_to_image(cv_img, processed_info):
    font = cv2.FONT_HERSHEY_SIMPLEX
    font_scale = 0.6
    thickness = 2
    text_height = 20  
    bg_color = (35, 102, 11)

    for info in processed_info:
        x, y, w, h = info["cords"]
        attributes = info["attributes"]
        annotations = [
            f"Age: {attributes.get('age_v1', 'N/A')}",
            f"Gender: {attributes.get('gender', 'N/A')}",
            f"Ethnicity: {attributes.get('ethnicity', 'N/A')}",
            f"Emotion: {attributes.get('emotion', 'N/A')}"
        ]
        cv2.rectangle(cv_img, (x, y), (x + w, y + h), bg_color, 2)

        for i, text in enumerate(annotations):
            top_left = (x, y + h + i * text_height)
            bottom_right = (x + w, y + h + (i + 1) * text_height)
            cv2.rectangle(cv_img, top_left, bottom_right, bg_color, cv2.FILLED)
            text_position = (x + 5, y + h + (i + 1) * text_height - 5)
            cv2.putText(cv_img, text, text_position, font, font_scale, (255, 255, 255), thickness)

    return cv_to_buffer(cv_img)
