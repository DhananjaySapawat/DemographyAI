import sqlite3
from app.db.base import BaseCommands


class SQLiteCommands(BaseCommands):

    def __init__(self, db_path: str):
        self.db_path = db_path
        self._init_db()

    # ----------------------------------------------------------
    # internal helpers
    # ----------------------------------------------------------

    def _get_connection(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _insert(self, conn, table: str, data: dict) -> int:
        columns      = ", ".join(data.keys())
        placeholders = ", ".join("?" for _ in data)
        sql          = f"INSERT INTO {table} ({columns}) VALUES ({placeholders})"
        cursor       = conn.cursor()
        cursor.execute(sql, list(data.values()))
        return cursor.lastrowid

    def _init_db(self):
        """
        Creates all tables if they don't already exist.
        Safe to call repeatedly — uses IF NOT EXISTS throughout.
        Table order respects foreign-key dependencies:
          requests → images → faces
                   → processed_images
          requests → videos → video_faces
        """
        conn = self._get_connection()
        try:
            cursor = conn.cursor()

            cursor.execute("PRAGMA foreign_keys = ON")

            # ── requests ──────────────────────────────────────────────
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS requests (
                    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
                    request_id          TEXT    NOT NULL UNIQUE,
                    endpoint            TEXT,
                    upload_type         TEXT,
                    ip_address          TEXT,
                    user_agent          TEXT,
                    status              TEXT,
                    error_message       TEXT,
                    processing_time_ms  INTEGER,
                    country_code        TEXT,
                    country_name        TEXT,
                    state               TEXT,
                    city                TEXT,
                    face_count          INTEGER,
                    image_width         INTEGER,
                    image_height        INTEGER,
                    file_size           INTEGER,
                    error_step          TEXT,
                    created_at          DATETIME
                )
            """)

            # ── images ────────────────────────────────────────────────
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS images (
                    id                      INTEGER PRIMARY KEY AUTOINCREMENT,
                    request_id              TEXT REFERENCES requests(request_id),
                    public_id               TEXT,
                    image_url               TEXT,
                    original_filename       TEXT,
                    mime_type               TEXT,
                    image_hash              TEXT,
                    width                   INTEGER,
                    height                  INTEGER,
                    size                    INTEGER,
                    face_count              INTEGER,
                    face_detection_time_ms  INTEGER,
                    inference_time_ms       INTEGER,
                    model_version           TEXT,
                    created_at              DATETIME
                )
            """)

            # ── faces ─────────────────────────────────────────────────
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS faces (
                    id                   INTEGER PRIMARY KEY AUTOINCREMENT,
                    image_id             INTEGER REFERENCES images(id),
                    public_id            TEXT,
                    image_url            TEXT,
                    face_index           INTEGER,
                    face_x               INTEGER,
                    face_y               INTEGER,
                    face_width           INTEGER,
                    face_height          INTEGER,
                    age_v1               TEXT,
                    age_v1_confidence    REAL,
                    age_v2               TEXT,
                    age_v2_confidence    REAL,
                    gender               TEXT,
                    gender_confidence    REAL,
                    ethnicity            TEXT,
                    ethnicity_confidence REAL,
                    emotion              TEXT,
                    emotion_confidence   REAL,
                    model_version        TEXT,
                    created_at           DATETIME
                )
            """)

            # ── processed_images ──────────────────────────────────────
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS processed_images (
                    id          INTEGER PRIMARY KEY AUTOINCREMENT,
                    original_id INTEGER REFERENCES images(id),
                    public_id   TEXT,
                    image_url   TEXT,
                    created_at  DATETIME
                )
            """)

            # ── videos ────────────────────────────────────────────────
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS videos (
                    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
                    request_id          TEXT REFERENCES requests(request_id),
                    video_url           TEXT,
                    original_filename   TEXT,
                    mime_type           TEXT,
                    original_format     TEXT,
                    processed_format    TEXT,
                    file_size           INTEGER,
                    video_hash          TEXT,
                    width               INTEGER,
                    height              INTEGER,
                    fps                 REAL,
                    total_frames        INTEGER,
                    duration_seconds    REAL,
                    faces_detected      INTEGER,
                    frames_with_faces   INTEGER,
                    max_faces_in_frame  INTEGER,
                    model_version       TEXT,
                    transcode_time_ms   INTEGER,
                    inference_time_ms   INTEGER,
                    created_at          DATETIME
                )
            """)

            # ── video_faces ───────────────────────────────────────────
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS video_faces (
                    id                   INTEGER PRIMARY KEY AUTOINCREMENT,
                    video_id             INTEGER REFERENCES videos(id),
                    public_id            TEXT,
                    image_url            TEXT,
                    frame_idx            INTEGER,
                    face_idx             INTEGER,
                    face_x               INTEGER,
                    face_y               INTEGER,
                    face_width           INTEGER,
                    face_height          INTEGER,
                    age_v1               TEXT,
                    age_v1_confidence    REAL,
                    age_v2               TEXT,
                    age_v2_confidence    REAL,
                    gender               TEXT,
                    gender_confidence    REAL,
                    ethnicity            TEXT,
                    ethnicity_confidence REAL,
                    emotion              TEXT,
                    emotion_confidence   REAL,
                    model_version        TEXT,
                    created_at           DATETIME
                )
            """)

            conn.commit()

        finally:
            conn.close()

    # ----------------------------------------------------------
    # requests
    # ----------------------------------------------------------

    def add_request(self, data: dict) -> int:
        conn = self._get_connection()
        try:
            conn.execute("PRAGMA foreign_keys = ON")
            row_id = self._insert(conn, "requests", data)
            conn.commit()
            return row_id
        finally:
            conn.close()

    def update_request(self, request_id: str, data: dict) -> None:
        if not data:
            return
        conn = self._get_connection()
        try:
            conn.execute("PRAGMA foreign_keys = ON")
            sets = ", ".join(f"{k} = ?" for k in data)
            sql  = f"UPDATE requests SET {sets} WHERE request_id = ?"
            conn.execute(sql, [*data.values(), request_id])
            conn.commit()
        finally:
            conn.close()

    # ----------------------------------------------------------
    # images
    # ----------------------------------------------------------

    def add_image(self, data: dict) -> int:
        conn = self._get_connection()
        try:
            conn.execute("PRAGMA foreign_keys = ON")
            row_id = self._insert(conn, "images", data)
            conn.commit()
            return row_id
        finally:
            conn.close()

    # ----------------------------------------------------------
    # faces
    # ----------------------------------------------------------

    def add_face(self, data: dict) -> int:
        conn = self._get_connection()
        try:
            conn.execute("PRAGMA foreign_keys = ON")
            row_id = self._insert(conn, "faces", data)
            conn.commit()
            return row_id
        finally:
            conn.close()

    # ----------------------------------------------------------
    # processed_images
    # ----------------------------------------------------------

    def add_processed_image(self, data: dict) -> int:
        conn = self._get_connection()
        try:
            conn.execute("PRAGMA foreign_keys = ON")
            row_id = self._insert(conn, "processed_images", data)
            conn.commit()
            return row_id
        finally:
            conn.close()

    # ----------------------------------------------------------
    # videos
    # ----------------------------------------------------------

    def add_video(self, data: dict) -> int:
        conn = self._get_connection()
        try:
            conn.execute("PRAGMA foreign_keys = ON")
            row_id = self._insert(conn, "videos", data)
            conn.commit()
            return row_id
        finally:
            conn.close()

    # ----------------------------------------------------------
    # video_faces
    # ----------------------------------------------------------

    def add_video_face(self, data: dict) -> int:
        conn = self._get_connection()
        try:
            conn.execute("PRAGMA foreign_keys = ON")
            row_id = self._insert(conn, "video_faces", data)
            conn.commit()
            return row_id
        finally:
            conn.close()