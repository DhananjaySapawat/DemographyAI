# ============================================================
# FILE 1: app/providers/db/base.py
# Abstract base class — defines the contract every database
# backend must fulfil.  Add a new method here whenever a new
# table / operation is needed, then implement it in each
# concrete subclass (SQLite, Postgres, etc.).
# ============================================================

from abc import ABC, abstractmethod
from typing import Optional


class BaseDatabase(ABC):

    # ----------------------------------------------------------
    # requests  — one row per API call, image or video
    # ----------------------------------------------------------

    @abstractmethod
    def add_request(self, data: dict) -> int:
        """
        Persist a single API request record.

        Expected keys
        -------------
        request_id, endpoint, upload_type, ip_address, user_agent,
        status, error_message, processing_time_ms,
        country_code, country_name, state, city,
        face_count (image only), image_width, image_height (image only),
        file_size, error_step, created_at

        Returns
        -------
        int  — primary key of the inserted row
        """
        ...

    # ----------------------------------------------------------
    # images  — original uploaded image metadata
    # ----------------------------------------------------------

    @abstractmethod
    def add_image(self, data: dict) -> int:
        """
        Persist metadata for an uploaded image.

        Expected keys
        -------------
        request_id, public_id, image_url, original_filename,
        mime_type, image_hash, width, height, size,
        face_count, face_detection_time_ms, inference_time_ms,
        model_version, created_at

        Returns
        -------
        int  — primary key of the inserted row (used as image_id
               when saving face rows)
        """
        ...

    # ----------------------------------------------------------
    # faces  — one row per face detected in an image
    # ----------------------------------------------------------

    @abstractmethod
    def add_face(self, data: dict) -> int:
        """
        Persist metadata for a single face crop from an image.

        Expected keys
        -------------
        image_id, public_id, image_url,
        face_index, face_x, face_y, face_width, face_height,
        age_v1, age_v1_confidence,
        age_v2, age_v2_confidence,
        gender, gender_confidence,
        ethnicity, ethnicity_confidence,
        emotion, emotion_confidence,
        model_version, created_at

        Returns
        -------
        int  — primary key of the inserted row
        """
        ...

    # ----------------------------------------------------------
    # processed_images  — labelled/annotated version of image
    # ----------------------------------------------------------

    @abstractmethod
    def add_processed_image(self, data: dict) -> int:
        """
        Persist metadata for the processed (labelled) image.

        Expected keys
        -------------
        image_url, original_id, public_id, created_at

        Returns
        -------
        int  — primary key of the inserted row
        """
        ...

    # ----------------------------------------------------------
    # videos  — uploaded video metadata
    # ----------------------------------------------------------

    @abstractmethod
    def add_video(self, data: dict) -> int:
        """
        Persist metadata for an uploaded / transcoded video.

        Expected keys
        -------------
        request_id, video_url, original_filename, mime_type,
        original_format, processed_format, file_size, video_hash,
        width, height, fps, total_frames, duration_seconds,
        faces_detected, frames_with_faces, max_faces_in_frame,
        model_version, transcode_time_ms, inference_time_ms,
        created_at

        Returns
        -------
        int  — primary key of the inserted row (used as video_id
               when saving video face rows)
        """
        ...

    # ----------------------------------------------------------
    # video_faces  — one row per face detected in a video frame
    # ----------------------------------------------------------

    @abstractmethod
    def add_video_face(self, data: dict) -> int:
        """
        Persist metadata for a single face crop from a video frame.

        Expected keys
        -------------
        video_id, public_id, image_url,
        frame_idx, face_idx,
        face_x, face_y, face_width, face_height,
        age_v1, age_v1_confidence,
        age_v2, age_v2_confidence,
        gender, gender_confidence,
        ethnicity, ethnicity_confidence,
        emotion, emotion_confidence,
        model_version, created_at

        Returns
        -------
        int  — primary key of the inserted row
        """
        ...
