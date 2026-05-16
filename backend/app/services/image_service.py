import logging
import time
import hashlib
import asyncio  
from datetime import datetime
from functools import partial  

from app.providers import storage, database
from app.processing import buffer_to_cv, cv_to_buffer, extract_face_coordinates, write_face_labels
from app.ai import predict_attributes
from app.utils import get_location
from app.config import MAX_IMAGE_SIZE

logger = logging.getLogger(__name__)
db_commands = database.command

async def _run_sync(fn, *args, **kwargs):
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, partial(fn, *args, **kwargs))


class ImageService:
    def __init__(self, file, request_data):
        if file is None:
            raise ValueError("File object is required")

        self.file = file
        self.request_data = request_data
        self.start_time = time.monotonic()

        self.result = {"original_source": "", "faces": []}

        self._original_filename = self.file.filename
        self._mime_type = getattr(self.file, "content_type", None)

        self._request_record_created = False

        self._orphaned_uploads: list[str] = []

        logger.info(f"Image processing started | request_id={request_data.get('request_id')}")

    async def _read_file(self):
        try:
            logger.info("Reading uploaded image")
            self.image = await self.file.read()
        except Exception:
            logger.exception("Failed reading uploaded image")
            raise IOError("Failed to read uploaded file")

        if not self.image:
            logger.warning("Uploaded image empty")
            raise ValueError("Uploaded file is empty")

        if len(self.image) > (MAX_IMAGE_SIZE * 1024 * 1024):
            logger.warning("Image exceeds max size")
            raise ValueError("Image exceeds maximum allowed size")

        self._image_hash = hashlib.sha256(self.image).hexdigest()
        self.cv_image = buffer_to_cv(self.image)

        if self.cv_image is None:
            logger.warning("Image decode failed")
            raise ValueError("Invalid image format")

        self._file_size = len(self.image)

        height, width = self.cv_image.shape[:2]
        self._img_width = width
        self._img_height = height

        logger.info("Image decoded successfully")

    def _extract_faces(self):
        logger.info("Starting face detection")

        detection_start = time.monotonic()

        self.face_coordinates = extract_face_coordinates(self.cv_image)
        self.image_faces = {}
        self.face_metadata = {}

        height, width = self._img_height, self._img_width

        for face_idx, (x, y, w, h) in enumerate(self.face_coordinates):
            x1 = max(0, x)
            y1 = max(0, y)
            x2 = min(width, x + w)
            y2 = min(height, y + h)

            if x2 <= x1 or y2 <= y1:
                continue

            face_id = f"face_{face_idx}"
            self.image_faces[face_id] = self.cv_image[y1:y2, x1:x2]
            self.face_metadata[face_id] = {
                "face_index": face_idx,
                "face_x": x1,
                "face_y": y1,
                "face_width": x2 - x1,
                "face_height": y2 - y1,
            }

        self.face_count = len(self.image_faces)
        self._face_detection_time_ms = int((time.monotonic() - detection_start) * 1000)

        logger.info(f"Face detection complete | faces_detected={self.face_count}")

    async def _predict_attributes(self):
        logger.info("Running face attribute prediction")

        inference_start = time.monotonic()
        predictions = await predict_attributes(self.image_faces)
        self._inference_time_ms = int((time.monotonic() - inference_start) * 1000)

        logger.info("Prediction completed")
        return predictions["predictions"], predictions.get("model_version")

    def _upload_image(self, image):
        logger.debug("Uploading image to storage")
        return storage.upload_image(image)

    def _add_image_record(self, image_upload):
        logger.info("Saving image metadata to database")

        return db_commands.add_image({
            "request_id":           self.request_data.get("request_id"),
            "public_id":            image_upload["id"],
            "image_url":            image_upload["url"],
            "original_filename":    self._original_filename,
            "mime_type":            self._mime_type,
            "image_hash":           self._image_hash,
            "width":                self._img_width,
            "height":               self._img_height,
            "size":                 len(self.image),
            "face_count":           self.face_count,
            "face_detection_time_ms": getattr(self, "_face_detection_time_ms", None),
            "created_at":           datetime.now(),
        })
    def _update_image_post_prediction(self):
        logger.info("Patching image record with model_version and inference_time_ms")
        db_commands.update_image(self.image_id, {
            "model_version":    self.model_version,
            "inference_time_ms": self._inference_time_ms,
        })

    def _add_face_image_record(self, face_id, attributes, face_upload):
        logger.debug("Saving face metadata")

        meta = self.face_metadata.get(face_id, {})

        return db_commands.add_face({
            "image_id":              self.image_id,
            "public_id":             face_upload["id"],
            "image_url":             face_upload["url"],
            "face_index":            meta.get("face_index"),
            "face_x":                meta.get("face_x"),
            "face_y":                meta.get("face_y"),
            "face_width":            meta.get("face_width"),
            "face_height":           meta.get("face_height"),
            "age_v1":                attributes.get("age_v1", {}).get("label"),
            "age_v1_confidence":     attributes.get("age_v1", {}).get("confidence"),
            "age_v2":                attributes.get("age_v2", {}).get("label"),
            "age_v2_confidence":     attributes.get("age_v2", {}).get("confidence"),
            "gender":                attributes.get("gender", {}).get("label"),
            "gender_confidence":     attributes.get("gender", {}).get("confidence"),
            "ethnicity":             attributes.get("ethnicity", {}).get("label"),
            "ethnicity_confidence":  attributes.get("ethnicity", {}).get("confidence"),
            "emotion":               attributes.get("emotion", {}).get("label"),
            "emotion_confidence":    attributes.get("emotion", {}).get("confidence"),
            "model_version":         self.model_version,
            "created_at":            datetime.now(),
        })

    def _add_processed_image_record(self, processed_image_upload):
        logger.info("Saving processed image metadata")

        return db_commands.add_processed_image({
            "image_url":   processed_image_upload["url"],
            "original_id": self.image_id,
            "public_id":   processed_image_upload["id"],
            "created_at":  datetime.now(),
        })

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
            "face_count":         getattr(self, "face_count", None),
            "image_width":        getattr(self, "_img_width", None),
            "image_height":       getattr(self, "_img_height", None),
            "file_size":          getattr(self, "_file_size", None),
            "error_step":         getattr(self, "error_step", None),
        })

    def _add_result(self, face_url, face_id, face_attributes):
        self.result["faces"].append({
            "image_url": face_url,
            "face_idx": int(face_id.split("_")[-1]) + 1,
            **face_attributes,
        })

    def _get_processed_image(self):
        processed_image = self.cv_image.copy()

        for face_idx, (x, y, w, h) in enumerate(self.face_coordinates):
            attribute = self.attributes.get(f"face_{face_idx}")
            if not attribute:
                continue
            write_face_labels(processed_image, x, y, x + w, y + h, attribute)

        return cv_to_buffer(processed_image)

    async def process_image(self):
        try:
            self.error_step = "request"
            await self._create_request_record()

            self.error_step = "read"
            await self._read_file()

            self.error_step = "detect"
            self._extract_faces()

            self.error_step = "upload"
            image_upload = await _run_sync(self._upload_image, self.image)

            self._orphaned_uploads.append(image_upload["id"])


            self.image_id = await _run_sync(self._add_image_record, image_upload)
            self._orphaned_uploads.remove(image_upload["id"])

            self.error_step = "predict"
            self.attributes, self.model_version = await self._predict_attributes()

            await _run_sync(self._update_image_post_prediction)

            self.error_step = "upload"
            for face_id, face in self.image_faces.items():
                attribute = self.attributes.get(face_id)
                if not attribute:
                    continue

                face_buffer = cv_to_buffer(face)

                face_upload = await _run_sync(self._upload_image, face_buffer)
                self._orphaned_uploads.append(face_upload["id"])

                try:
                    await _run_sync(self._add_face_image_record, face_id, attribute, face_upload)
                    self._orphaned_uploads.remove(face_upload["id"])
                except Exception:
                    logger.exception(
                        f"Failed to write face record for {face_id} — "
                        "upload is orphaned and will require manual cleanup"
                    )
                    continue

                self._add_result(face_upload["url"], face_id, attribute)

            processed_image = self._get_processed_image()

            processed_image_upload = await _run_sync(self._upload_image, processed_image)
            self._orphaned_uploads.append(processed_image_upload["id"])

            self.result["original_source"] = processed_image_upload["url"]
            await _run_sync(self._add_processed_image_record, processed_image_upload)
            self._orphaned_uploads.remove(processed_image_upload["id"])

            self.error_step = None

            await self._finalise_request_record()

            logger.info("Image processing finished successfully")
            return self.result

        except ValueError as e:
            logger.warning(f"Validation error: {e}")
            await self._finalise_request_record(status="error", error_message=str(e))
            raise

        except IOError as e:
            logger.error(f"I/O error: {e}")
            await self._finalise_request_record(status="error", error_message=str(e))
            raise

        except Exception:
            logger.exception("Unexpected image processing failure")
            if self._orphaned_uploads:
                logger.error(
                    f"Orphaned storage uploads with no DB record: {self._orphaned_uploads}"
                )
            try:
                await self._finalise_request_record(status="error", error_message="Unexpected error")
            except Exception:
                logger.warning("Failed to record error to DB — continuing anyway")
            raise RuntimeError("Unexpected image processing failure")