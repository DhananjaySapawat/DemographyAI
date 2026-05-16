from abc import ABC, abstractmethod


class BaseQueries(ABC):

    @abstractmethod
    def get_media(self) -> list[dict]: ...

    @abstractmethod
    def get_media_by_request_id(self, request_id: str) -> dict | None: ...