from app.providers import storage, database
import tempfile
import os
from pathlib import Path

from app.process import VideoProcessor

class VideoService:
    def __init__(self, file):
        self.file = file
        self.raw_path = None
        self.processed_path = None
        self.video_url = None

    def _create_temp_files(self):
        raw = tempfile.NamedTemporaryFile(
            delete=False,
            suffix=Path(self.file.filename).suffix
        )
        processed = tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".webm"
        )

        self.raw_path = raw.name
        self.processed_path = processed.name

        raw.close()
        processed.close()

    def _save_uploaded_file(self):
        with open(self.raw_path, "wb") as f:
            f.write(self.file.read())

    def _process_video(self):
        video_processor = VideoProcessor(self.raw_path, self.processed_path)
        video_processor.process()

    def _upload_video(self):
        self.video_url = storage.upload_video(self.processed_path)

    def _add_video_record(self):
        database.upload({
            "url": self.video_url,
            "size": Path(self.processed_path).stat().st_size
        })

    def _cleanup(self):
        for path in (self.raw_path, self.processed_path):
            if path and os.path.exists(path):
                os.remove(path)

    def run(self) -> str:
        try:
            self._create_temp_files()
            self._save_uploaded_file()
            self._process_video()
            self._upload_video()
            self._add_video_record()
            return self.video_url
        finally:
            self._cleanup()
