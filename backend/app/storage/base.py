from abc import ABC, abstractmethod

class BaseStorage(ABC):

    @abstractmethod
    def upload_image(self, image_byte: bytes):
        pass

    @abstractmethod
    def upload_video(self, video_path: str) -> str:
        pass
