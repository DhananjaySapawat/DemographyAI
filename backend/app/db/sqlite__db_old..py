import sqlite3
from .base import BaseDatabase

class SQLiteDatabase(BaseDatabase):

    def __init__(self, db_path: str = "demographyAI.db"):
        self.db_path = db_path
        self._init_db()

    def _get_connection(self):
        """Creates a connection with Row factory for dict-like access."""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self):
        """Initialize the relational schema."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            
            # 1. Image Data Table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS images (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    url TEXT,
                    public_id TEXT,
                    type TEXT,
                    face_count INTEGER,
                    ip_address TEXT,
                    time DATETIME,
                    size INTEGER
                )
            """)

            # 2. Processed Image Data Table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS processed_images (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    original_id INTEGER,
                    url TEXT,
                    public_id TEXT,
                    type TEXT,
                    face_count INTEGER,
                    size INTEGER,
                    FOREIGN KEY(original_id) REFERENCES images(id)
                )
            """)

            # 3. Face Data Table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS faces (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    image_id INTEGER,
                    public_id TEXT,
                    url TEXT,
                    age_v1 TEXT,
                    age_v2 TEXT,
                    gender TEXT,
                    ethnicity TEXT,
                    emotion TEXT,
                    FOREIGN KEY(image_id) REFERENCES images(id)
                )
            """)

            # 4. Video Data Table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS videos (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    url TEXT,
                    ip_address TEXT,
                    time DATETIME,
                    size INTEGER
                )
            """)
            conn.commit()

    # ----------------------------------------------------
    # Insert Methods
    # ----------------------------------------------------

    def add_image(self, image_data: dict) -> int:
        query = """
            INSERT INTO images (url, public_id, type, face_count, ip_address, time, size)
            VALUES (:url, :public_id, :type, :face_count, :ip_address, :time, :size)
        """
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, image_data)
            conn.commit()
            return cursor.lastrowid

    def add_processed_image(self, image_data: dict) -> int:
        query = """
            INSERT INTO processed_images (url, original_id, public_id, type, face_count, size)
            VALUES (:url, :original_id, :public_id, :type, :face_count, :size)
        """
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, image_data)
            conn.commit()
            return cursor.lastrowid

    def add_face(self, face_data: dict) -> int:
        if "image_id" not in face_data:
            raise ValueError("face_data must contain 'image_id'")

        # Ensure all expected keys exist for the query, defaulting to None if missing
        keys = ["image_id", "public_id", "url", "age_v1", "age_v2", "gender", "ethnicity", "emotion"]
        data_to_insert = {k: face_data.get(k) for k in keys}

        query = """
            INSERT INTO faces (image_id, public_id, url, age_v1, age_v2, gender, ethnicity, emotion)
            VALUES (:image_id, :public_id, :url, :age_v1, :age_v2, :gender, :ethnicity, :emotion)
        """
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, data_to_insert)
            conn.commit()
            return cursor.lastrowid

    def add_video(self, video_data: dict) -> int:
        query = """
            INSERT INTO videos (url, ip_address, time, size)
            VALUES (:url, :ip_address, :time, :size)
        """
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, video_data)
            conn.commit()
            return cursor.lastrowid

    # ----------------------------------------------------
    # Helper Method
    # ----------------------------------------------------

    def _rows_to_dict_list(self, rows):
        """Converts SQLite Row objects to standard python dictionaries."""
        return [dict(row) for row in rows]

    # ----------------------------------------------------
    # Read Methods
    # ----------------------------------------------------

    def get_original_images(self):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM images")
            return self._rows_to_dict_list(cursor.fetchall())

    def get_processed_images(self):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM processed_images")
            return self._rows_to_dict_list(cursor.fetchall())

    def get_videos(self):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM videos")
            return self._rows_to_dict_list(cursor.fetchall())

    def get_faces_for_image(self, image_id):
        # Handle implicit int conversion if string is passed
        try:
            img_id = int(image_id)
        except (ValueError, TypeError):
            return []

        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM faces WHERE image_id = ?", (img_id,))
            return self._rows_to_dict_list(cursor.fetchall())