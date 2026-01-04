import cv2
from .image_utils import write_face_labels, extract_face_coordinates
from app.ai import predict_attributes

from .temp import video_tflite

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

            for face_idx, (x, y, w, h) in enumerate(extract_face_coordinates(frame)):
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
        self.faces_attributes = predict_attributes(video_tflite(self.video_faces))

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
                write_face_labels(frame, x1, y1, x2, y2, attributes)

            self.out.write(frame)
            frame_idx += 1 

        self.cap.release()
        self.out.release()


    def process(self):
        self.extract_faces()
        self.predict_values()
        self.write_face_attributes()
        
