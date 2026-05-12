import sqlite3
from app.db.base import BaseQueries


class SQLiteQueries(BaseQueries):

    def __init__(self, db_path: str):
        self.db_path = db_path

    # ----------------------------------------------------------
    # internal helpers
    # ----------------------------------------------------------

    def _get_connection(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _query(self, sql: str, params: list | None = None) -> list[dict]:
        conn = self._get_connection()
        try:
            cur = conn.cursor()
            cur.execute(sql, params or [])
            return [dict(r) for r in cur.fetchall()]
        finally:
            conn.close()

    def _query_one(self, sql: str, params: list | None = None) -> dict | None:
        rows = self._query(sql, params)
        return rows[0] if rows else None

    # ----------------------------------------------------------
    # media
    # ----------------------------------------------------------

    def get_media(self) -> list[dict]:
        return self._query("""
            SELECT * FROM (
                SELECT
                    'image'          AS media_type,
                    i.id,
                    i.request_id,
                    i.image_url      AS thumb_url,
                    i.original_filename,
                    i.face_count,
                    i.size           AS file_size,
                    NULL             AS duration_seconds,
                    i.width,
                    i.height,
                    i.inference_time_ms,
                    i.created_at,
                    r.status
                FROM images i
                LEFT JOIN requests r ON i.request_id = r.request_id

                UNION ALL

                SELECT
                    'video'          AS media_type,
                    v.id,
                    v.request_id,
                    v.video_url      AS thumb_url,
                    v.original_filename,
                    v.faces_detected AS face_count,
                    v.file_size,
                    v.duration_seconds,
                    v.width,
                    v.height,
                    v.inference_time_ms,
                    v.created_at,
                    r.status
                FROM videos v
                LEFT JOIN requests r ON v.request_id = r.request_id
            )
            ORDER BY created_at DESC
        """)
    
    def get_media_by_id(self, id: int) -> dict | None:
        """
        Finds the item by id — checks images first, then videos.
        Returns full row with nested faces[].
        For images: includes processed_image if it exists.
        """
        # try image first
        item = self._query_one("""
            SELECT
                'image' AS media_type,
                i.*,
                r.status, r.error_message, r.error_step,
                r.ip_address, r.user_agent,
                r.country_code, r.country_name, r.state, r.city,
                r.processing_time_ms AS request_processing_time_ms
            FROM images i
            LEFT JOIN requests r ON i.request_id = r.request_id
            WHERE i.id = ?
        """, [id])

        if item:
            item["faces"] = self._query(
                "SELECT * FROM faces WHERE image_id = ? ORDER BY face_index",
                [id],
            )
            item["processed_image"] = self._query_one(
                "SELECT public_id, image_url FROM processed_images WHERE original_id = ? LIMIT 1",
                [id],
            )
            return item

        # try video
        item = self._query_one("""
            SELECT
                'video' AS media_type,
                v.*,
                r.status, r.error_message, r.error_step,
                r.ip_address, r.user_agent,
                r.country_code, r.country_name, r.state, r.city,
                r.processing_time_ms AS request_processing_time_ms
            FROM videos v
            LEFT JOIN requests r ON v.request_id = r.request_id
            WHERE v.id = ?
        """, [id])

        if item:
            item["faces"] = self._query(
                "SELECT * FROM video_faces WHERE video_id = ? ORDER BY frame_idx, face_idx",
                [id],
            )
            return item

        return None