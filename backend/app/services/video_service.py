import logging
import tempfile
import os
import time
import hashlib
import asyncio        
from functools import partial 
from pathlib import Path
from datetime import datetime

from app.providers import storage, database
from app.processing import VideoProcessor
from app.processing.image_utils import cv_to_buffer
from app.utils import get_location
from app.config import MAX_VIDEO_SIZE

logger = logging.getLogger(__name__)
db_commands = database.command


async def _run_sync(fn, *args, **kwargs):
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, partial(fn, *args, **kwargs))


class VideoService:

    def __init__(self, file, request_data):
        if file is None:
            raise ValueError("File object is required")

        self.file = file
        self.request_data = request_data
        self.start_time = time.monotonic()

        self.raw_path = None
        self.processed_path = None
        self.video_url = None
        self.video_id = None

        self._original_format = Path(self.file.filename).suffix.lstrip(".")
        self._original_filename = self.file.filename
        self._mime_type = getattr(self.file, "content_type", None)

        self._request_record_created = False

        self._orphaned_uploads: list[str] = []

        logger.info(f"Video processing started | request_id={request_data.get('request_id')}")

    def _prepare_temp_paths(self):
        raw = tempfile.NamedTemporaryFile(delete=False, suffix=Path(self.file.filename).suffix)
        processed = tempfile.NamedTemporaryFile(delete=False, suffix=".webm")

        self.raw_path = raw.name
        self.processed_path = processed.name

        raw.close()
        processed.close()

        logger.debug("Temporary video files created")

    async def _save_uploaded_file(self):
        try:
            logger.info("Reading uploaded video")
            self.video_bytes = await self.file.read()
        except Exception:
            logger.exception("Failed reading uploaded video")
            raise IOError("Failed to read uploaded video")

        if not self.video_bytes:
            logger.warning("Uploaded video empty")
            raise ValueError("Uploaded video is empty")

        if len(self.video_bytes) > (MAX_VIDEO_SIZE * 1024 * 1024):
            logger.warning("Video exceeds max size")
            raise ValueError("Video exceeds maximum allowed size")

        self._file_size = len(self.video_bytes)
        self._video_hash = hashlib.sha256(self.video_bytes).hexdigest()

        with open(self.raw_path, "wb") as f:
            f.write(self.video_bytes)

        logger.info("Uploaded video saved to temp file")

    async def _transcode_video(self):
        logger.info("Starting video processing")

        transcode_start = time.monotonic()

        self.video_processor = VideoProcessor(self.raw_path, self.processed_path)
        await self.video_processor.process()

        self._inference_time_ms  = getattr(self.video_processor, "inference_time_ms", None)
        self._transcode_time_ms  = int((time.monotonic() - transcode_start) * 1000)
        self._duration_seconds   = getattr(self.video_processor, "duration_seconds", None)
        self._width              = self.video_processor.width
        self._height             = self.video_processor.height
        self._fps                = self.video_processor.fps
        self._total_frames       = self.video_processor.total_frames
        self._faces_detected     = self.video_processor.unique_face_count()
        self._frames_with_faces  = sum(1 for v in self.video_processor.frame_face.values() if v)
        self._max_faces_in_frame = max((len(v) for v in self.video_processor.frame_face.values()), default=0)
        self._model_version      = getattr(self.video_processor, "model_version", None)

        logger.info(f"Video processing finished | transcode_time_ms={self._transcode_time_ms}")

    async def _upload_processed_video(self):
        logger.info("Uploading processed video")
        self.video_url = await _run_sync(storage.upload_video, self.processed_path)
        logger.info(f"Video uploaded | url={self.video_url}")


    async def _add_video_record(self):
        logger.info("Saving video metadata")


        self.video_id = await _run_sync(db_commands.add_video, {
            "request_id":        self.request_data.get("request_id"),
            "video_url":         self.video_url,
            "original_filename": self._original_filename,
            "mime_type":         self._mime_type,
            "original_format":   self._original_format,
            "processed_format":  "webm",
            "file_size":         self._file_size,
            "video_hash":        self._video_hash,
            "width":             getattr(self, "_width", None),
            "height":            getattr(self, "_height", None),
            "fps":               getattr(self, "_fps", None),
            "total_frames":      getattr(self, "_total_frames", None),
            "duration_seconds":  getattr(self, "_duration_seconds", None),
            "faces_detected":    getattr(self, "_faces_detected", None),
            "frames_with_faces": getattr(self, "_frames_with_faces", None),
            "max_faces_in_frame":getattr(self, "_max_faces_in_frame", None),
            "model_version":     getattr(self, "_model_version", None),
            "transcode_time_ms": getattr(self, "_transcode_time_ms", None),
            "inference_time_ms": getattr(self, "_inference_time_ms", None),
            "created_at":        datetime.now(),
        })

    async def _add_video_face_record(self, face_id, frame_idx, face_idx, bbox, attributes, face_upload):
        logger.debug(f"Saving video face metadata | face_id={face_id}")

        x1, y1, x2, y2 = bbox

        # CHANGE: wrapped in _run_sync — blocking SQLite INSERT.
        return await _run_sync(db_commands.add_video_face, {
            "video_id":           self.video_id,
            "public_id":          face_upload["id"],
            "image_url":          face_upload["url"],
            "frame_idx":          frame_idx,
            "face_idx":           face_idx,
            "face_x":             x1,
            "face_y":             y1,
            "face_width":         x2 - x1,
            "face_height":        y2 - y1,
            "age_v1":             attributes.get("age_v1", {}).get("label"),
            "age_v1_confidence":  attributes.get("age_v1", {}).get("confidence"),
            "age_v2":             attributes.get("age_v2", {}).get("label"),
            "age_v2_confidence":  attributes.get("age_v2", {}).get("confidence"),
            "gender":             attributes.get("gender", {}).get("label"),
            "gender_confidence":  attributes.get("gender", {}).get("confidence"),
            "ethnicity":          attributes.get("ethnicity", {}).get("label"),
            "ethnicity_confidence": attributes.get("ethnicity", {}).get("confidence"),
            "emotion":            attributes.get("emotion", {}).get("label"),
            "emotion_confidence": attributes.get("emotion", {}).get("confidence"),
            "model_version":      self._model_version,
            "created_at":         datetime.now(),
        })

    async def _save_video_faces(self):
        logger.info("Saving video face crops")

        face_records = self.video_processor.get_face_records()
        faces = []

        for response_idx, record in enumerate(face_records, start=1):
            face_id    = record["face_id"]
            face_image = record["face_image"]
            attributes = record["attributes"]
            frame_idx  = record["frame_idx"]
            face_idx   = record["face_idx"]
            bbox       = record["bbox"]

            face_buffer = cv_to_buffer(face_image)

            face_upload = await _run_sync(storage.upload_image, face_buffer)
            self._orphaned_uploads.append(face_upload["id"])

            try:
                await self._add_video_face_record(face_id, frame_idx, face_idx, bbox, attributes, face_upload)
                self._orphaned_uploads.remove(face_upload["id"])
            except Exception:
                logger.exception(
                    f"Failed to write video face record for {face_id} — "
                    "upload is orphaned and will require manual cleanup"
                )
    
                continue

            faces.append({
                "image_url": face_upload["url"],
                "face_idx":  response_idx,
                **attributes,
            })

        logger.info(f"Video faces saved | count={len(face_records)}")
        return faces

    async def _create_request_record(self):
        geo = await get_location(self.request_data.get("ip_address"))

        await _run_sync(db_commands.add_request, {
            "request_id":   self.request_data.get("request_id"),
            "endpoint":     self.request_data.get("endpoint"),
            "upload_type":  self.request_data.get("upload_type"),
            "ip_address":   self.request_data.get("ip_address"),
            "user_agent":   self.request_data.get("user_agent"),
            "status":       "processing",
            "country_code": geo.get("country_code"),
            "country_name": geo.get("country_name"),
            "state":        geo.get("state"),
            "city":         geo.get("city"),
            "created_at":   datetime.now(),
        })

        self._request_record_created = True

    async def _finalise_request_record(self, status="success", error_message=""):
        if not self._request_record_created:
            logger.warning(
                "Skipping finalise_request_record — request row was never created "
                f"| request_id={self.request_data.get('request_id')}"
            )
            return

        processing_time = int((time.monotonic() - self.start_time) * 1000)

        await _run_sync(db_commands.update_request, self.request_data.get("request_id"), {
            "status":             status,
            "error_message":      error_message,
            "processing_time_ms": processing_time,
            "file_size":          getattr(self, "_file_size", None),
            "error_step":         getattr(self, "error_step", None),
        })

    def _cleanup_temp_files(self):
        for path in (self.raw_path, self.processed_path):
            if path and os.path.exists(path):
                try:
                    os.remove(path)
                except OSError:
                    logger.warning(f"Failed to delete temp file: {path}")
        logger.debug("Temporary files cleaned up")

    async def process_video(self):
        try:
            self.error_step = "prepare"
            self._prepare_temp_paths()

            self.error_step = "request"
            await self._create_request_record()

            self.error_step = "read"
            await self._save_uploaded_file()

            self.error_step = "transcode"
            await self._transcode_video()

            self.error_step = "upload"
            await self._upload_processed_video()

            self._orphaned_uploads.append(self.video_url)

            await self._add_video_record()

            self._orphaned_uploads.remove(self.video_url)

            self.error_step = "save_faces"
            faces = await self._save_video_faces()

            self.error_step = None
            await self._finalise_request_record()

            logger.info("Video processing finished successfully")

            return {
                "original_source": self.video_url,
                "faces": faces,
            }

        except ValueError as e:
            logger.warning(f"Validation error: {e}")
            await self._finalise_request_record(status="error", error_message=str(e))
            raise

        except IOError as e:
            logger.error(f"I/O error: {e}")
            await self._finalise_request_record(status="error", error_message=str(e))
            raise

        except Exception:
            logger.exception("Unexpected video processing failure")

            if self._orphaned_uploads:
                logger.error(
                    f"Orphaned storage uploads with no DB record: {self._orphaned_uploads}"
                )

            try:
                await self._finalise_request_record(
                    status="error",
                    error_message="Unexpected video processing error",
                )
            except Exception:
                logger.warning("Failed to record error to DB — continuing anyway")

            raise RuntimeError("Unexpected video processing failure")

        finally:
            self._cleanup_temp_files()