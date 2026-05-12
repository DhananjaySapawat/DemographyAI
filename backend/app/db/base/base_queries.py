from abc import ABC, abstractmethod


class BaseQueries(ABC):

    @abstractmethod
    def get_media(self) -> list[dict]: ...

    @abstractmethod
    def get_media_by_id(self, id: int) -> dict | None: ...