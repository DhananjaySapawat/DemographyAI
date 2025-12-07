from abc import ABC, abstractmethod

class BaseDatabase(ABC):
    # --------------------------
    # Insert Methods
    # --------------------------
    @abstractmethod
    def add_image(self, image_data):
        pass

    @abstractmethod
    def add_processed_image(self, image_data):
        pass

    @abstractmethod
    def add_face(self, face_data):
        pass

    @abstractmethod
    def add_video(self, video_data):
        pass

    # --------------------------
    # Read Methods
    # --------------------------
    @abstractmethod
    def get_original_images(self):
        pass

    @abstractmethod
    def get_processed_images(self):
        pass

    @abstractmethod
    def get_videos(self):
        pass

    @abstractmethod
    def get_faces_for_image(self, image_id):
        pass
