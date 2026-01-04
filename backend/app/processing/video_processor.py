import cv2
from .face_extractor import extract_face_coordinates_upload
from app.ai import predict_attributes_for_video

from .temp import make_tflite


class VideoProcessor:

    def __init__(self, input_path: str, output_path: str):
        self.input_path = input_path
        self.output_path = output_path
        self.cap = cv2.VideoCapture(input_path)
        if not self.cap.isOpened():
            raise RuntimeError(f"Unable to open video: {input_path}")
        
        self.fps = self.cap.get(cv2.CAP_PROP_FPS)
        self.fourcc = cv2.VideoWriter_fourcc(*'VP80')
        self.width = int(self.cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        self.height = int(self.cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        self.total_frames = int(self.cap.get(cv2.CAP_PROP_FRAME_COUNT))

        self.out = cv2.VideoWriter(self.output_path, self.fourcc, self.fps, (self.width, self.height))
        if not self.out.isOpened():
            raise RuntimeError(f"Unable to open video: {output_path}")
        
        self.face_count = 0
        self.frame_face = {}
        self.video_faces = {}

    def extract_faces(self):
        frame_idx = 0

        while self.cap.isOpened():
            ret, frame = self.cap.read()
            if not ret:
                break

            self.frame_face[frame_idx] = []

            for face_idx, (x, y, w, h) in enumerate(extract_face_coordinates_upload(frame)):
                x1 = max(0, x)
                y1 = max(0, y)
                x2 = min(self.width, x + w)
                y2 = min(self.height, y + h)

                face_id = f"{frame_idx}_{face_idx}"

                if x2 <= x1 or y2 <= y1:
                    continue 

                self.frame_face[frame_idx].append({
                    "id": face_id,
                    "bbox": (x1, y1, x2, y2)
                })

                self.video_faces[face_id] = frame[y1:y2, x1:x2]
                self.face_count += 1

            frame_idx += 1

    def predict_values(self):
        self.faces_attributes = predict_attributes_for_video(make_tflite(self.video_faces))

    def write_face_labels(self, frame, x1, y1, x2, y2, attributes):
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

    def write_face_attributes(self):
        frame_idx = 0
        self.cap.set(cv2.CAP_PROP_POS_FRAMES, 0)

        while self.cap.isOpened():
            ret, frame = self.cap.read()
            if not ret:
                break

            for face in self.frame_face.get(frame_idx, []):
                x1, y1, x2, y2 = face["bbox"]
                attributes = self.faces_attributes[face["id"]]
                if not attributes:
                    continue
                self.write_face_labels(frame, x1, y1, x2, y2, attributes)

            self.out.write(frame)
            frame_idx += 1 

        self.cap.release()
        self.out.release()


    def process(self):
        self.extract_faces()
        self.predict_values()
        self.write_face_attributes()
        
