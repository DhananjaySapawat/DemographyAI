import tempfile
import os
from pathlib import Path

from app.providers import storage, database
from app.processing import VideoProcessor

class VideoService:
    def __init__(self, file):
        self.file = file
        self.raw_path = None
        self.processed_path = None
        self.video_url = None

    def _prepare_temp_paths(self):
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

    async def _save_uploaded_file(self):
        file_bytes = await self.file.read()
        if not file_bytes:
            raise ValueError("Uploaded file is empty")

        with open(self.raw_path, "wb") as f:
            f.write(file_bytes)


    async def _transcode_video(self):
        video_processor = VideoProcessor(self.raw_path, self.processed_path)
        await video_processor.process()

    def _upload_processed_video(self):
        self.video_url = storage.upload_video(self.processed_path)

    def _add_video_record(self):
        database.add_video({
            "url": self.video_url,
            "size": Path(self.processed_path).stat().st_size
        })

    def _cleanup_temp_files(self):
        for path in (self.raw_path, self.processed_path):
            if path and os.path.exists(path):
                os.remove(path)

    async def process_video(self) -> str:
        try:
            self._prepare_temp_paths()
            await self._save_uploaded_file()
            await self._transcode_video()
            self._upload_processed_video()
            self._add_video_record()
            return self.video_url
        
        except Exception as e:
            print(f"{VideoService}: {e}")
        
        finally:
            self._cleanup_temp_files()