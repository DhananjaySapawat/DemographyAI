from abc import ABC, abstractmethod

class BaseCommands(ABC):

    @abstractmethod
    def add_request(self, data: dict) -> int: ...

    @abstractmethod
    def update_request(self, request_id: str, data: dict) -> None: ...

    @abstractmethod
    def add_image(self, data: dict) -> int: ...

    @abstractmethod
    def update_image(self, image_id: int, data: dict) -> None: ...

    @abstractmethod
    def add_face(self, data: dict) -> int: ...

    @abstractmethod
    def add_processed_image(self, data: dict) -> int: ...

    @abstractmethod
    def add_video(self, data: dict) -> int: ...

    @abstractmethod
    def add_video_face(self, data: dict) -> int: ...