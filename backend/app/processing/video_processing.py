import cv2
from .image_utils import write_face_labels, extract_face_coordinates
from app.ai import predict_attributes
import time
from pathlib import Path

yunet_model_path = str(Path(__file__).parent / "face_model" / "yunet_n_640_640.onnx")

def _compute_iou(boxA, boxB):
    xA = max(boxA[0], boxB[0])
    yA = max(boxA[1], boxB[1])
    xB = min(boxA[2], boxB[2])
    yB = min(boxA[3], boxB[3])
    inter = max(0, xB - xA) * max(0, yB - yA)
    if inter == 0:
        return 0.0
    areaA = (boxA[2] - boxA[0]) * (boxA[3] - boxA[1])
    areaB = (boxB[2] - boxB[0]) * (boxB[3] - boxB[1])
    return inter / float(areaA + areaB - inter)


class VideoProcessor:

    IOU_THRESHOLD = 0.4
    MAX_FRAMES_ABSENT = 10

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
        self.duration_seconds = self.total_frames / self.fps if self.fps else None

        self.out = cv2.VideoWriter(self.output_path, self.fourcc, self.fps, (self.width, self.height))
        if not self.out.isOpened():
            self.out.release()
            raise RuntimeError(f"Unable to open video writer: {output_path}")

        self.face_detector = cv2.FaceDetectorYN.create(
            yunet_model_path, "", (self.width, self.height)
        )

        # public — unchanged
        self.face_count = 0
        self.frame_face = {}
        self.video_faces = {}

        # private tracking
        self._next_track_id = 0
        self._active_tracks = {}        # track_id -> {"bbox", "last_frame"}
        self._face_id_to_track = {}     # face_id  -> track_id  (every face)
        self._track_to_face_id = {}     # track_id -> canonical face_id
        self._canonical_records = {}    # track_id -> full record dict for unique face

    def _match_or_create_track(self, bbox, frame_idx):
        best_id, best_iou = None, 0.0
        for tid, info in self._active_tracks.items():
            iou = _compute_iou(info["bbox"], bbox)
            if iou > best_iou:
                best_iou = iou
                best_id = tid

        if best_iou >= self.IOU_THRESHOLD:
            self._active_tracks[best_id]["bbox"] = bbox
            self._active_tracks[best_id]["last_frame"] = frame_idx
            return best_id, False

        tid = self._next_track_id
        self._next_track_id += 1
        self._active_tracks[tid] = {"bbox": bbox, "last_frame": frame_idx}
        return tid, True

    def _expire_old_tracks(self, frame_idx):
        stale = [
            tid for tid, info in self._active_tracks.items()
            if frame_idx - info["last_frame"] > self.MAX_FRAMES_ABSENT
        ]
        for tid in stale:
            del self._active_tracks[tid]

    def extract_faces(self):
        frame_idx = 0

        while self.cap.isOpened():
            ret, frame = self.cap.read()
            if not ret:
                break

            self._expire_old_tracks(frame_idx)
            self.frame_face[frame_idx] = []

            for face_idx, (x, y, w, h) in enumerate(
                extract_face_coordinates(frame, self.face_detector)
            ):
                x1 = max(0, x)
                y1 = max(0, y)
                x2 = min(self.width,  x + w)
                y2 = min(self.height, y + h)

                if x2 <= x1 or y2 <= y1:
                    continue

                face_id = f"{frame_idx}_{face_idx}"
                bbox    = (x1, y1, x2, y2)

                track_id, is_new = self._match_or_create_track(bbox, frame_idx)

                self._face_id_to_track[face_id] = track_id

                if is_new:
                    # first time seeing this person — store everything we need
                    self._track_to_face_id[track_id] = face_id
                    self._canonical_records[track_id] = {
                        "face_id":    face_id,
                        "face_image": frame[y1:y2, x1:x2].copy(),
                        "frame_idx":  frame_idx,
                        "face_idx":   face_idx,
                        "bbox":       bbox,
                    }

                # public structures — identical to original
                self.frame_face[frame_idx].append({
                    "id":        face_id,
                    "bbox":      bbox,
                    "frame_idx": frame_idx,
                    "face_idx":  face_idx,
                })
                self.video_faces[face_id] = frame[y1:y2, x1:x2]
                self.face_count += 1

            frame_idx += 1

    async def predict_values(self):
        # send ONLY one crop per unique person, keyed by their canonical face_id
        unique_faces = {
            canonical_id: self.video_faces[canonical_id]
            for canonical_id in self._track_to_face_id.values()
        }

        inference_start = time.monotonic()
        result = await predict_attributes(unique_faces)
        self.inference_time_ms = int((time.monotonic() - inference_start) * 1000)
        self.model_version = result["model_version"]

        canonical_predictions = result["predictions"]  # canonical_face_id -> attributes

        # fan out: every face_id across all frames gets its person's attributes
        self.faces_attributes = {
            face_id: canonical_predictions[self._track_to_face_id[track_id]]
            for face_id, track_id in self._face_id_to_track.items()
            if self._track_to_face_id.get(track_id) in canonical_predictions
        }

    def write_face_attributes(self):
        # unchanged
        self.cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
        frame_idx = 0

        while self.cap.isOpened():
            ret, frame = self.cap.read()
            if not ret:
                break

            for face in self.frame_face.get(frame_idx, []):
                x1, y1, x2, y2 = face["bbox"]
                attributes = self.faces_attributes.get(face["id"])
                if not attributes:
                    continue
                write_face_labels(frame, x1, y1, x2, y2, attributes)

            self.out.write(frame)
            frame_idx += 1

    def get_face_records(self):
        # ✅ returns ONE record per unique person only
        records = []
        for track_id, rec in self._canonical_records.items():
            attributes = self.faces_attributes.get(rec["face_id"])
            if not attributes:
                continue
            records.append({**rec, "attributes": attributes})
        return records

    def unique_face_count(self):
        return len(self._canonical_records)

    async def process(self):
        try:
            self.extract_faces()
            await self.predict_values()
            self.write_face_attributes()
        finally:
            self.cap.release()
            self.out.release()