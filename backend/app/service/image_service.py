from app.providers import storage, database
from app.process import buffer_to_cv, cv_to_buffer, extract_face_coordinates, write_face_labels
from app.ai import predict_attributes

from app.process.temp import video_tflite

class ImageService:
    def __init__(self, file, upload_type: str):
        if file is None:
            raise ValueError("File object is required")
        self.file = file  
        self.upload_type = upload_type
        self.result = []

    async def _read_file(self):
        try:
            self.image = await self.file.read()
        except Exception as e:
            raise IOError("Failed to read uploaded file") from e
        
        if not self.image:
            raise ValueError("Uploaded file is empty")

        self.cv_image = buffer_to_cv(self.image)
        if self.cv_image is None:
            raise ValueError("Invalid image format")


    def _extract_faces(self):
        self.face_coordinates = extract_face_coordinates(self.cv_image)
        self.image_faces = {}
        self.face_count = len(self.face_coordinates)
        for face_idx, (x, y, w, h) in enumerate(self.face_coordinates):
            self.image_faces[f"face_{face_idx}"] = self.cv_image[y:y+h, x:x+w]

    async def _predict_attributes(self):
        attributes = await predict_attributes(video_tflite(self.image_faces))
        return attributes


    def _upload_image(self, image):
        return storage.upload_image(image)

    def _add_image_record(self, image_upload):
        return database.add_image({
            "url": image_upload["url"], 
            "public_id": image_upload["id"], 
            "type": self.upload_type,
            "face_count": self.face_count,
            "size": len(self.image)
        })
    
    def _add_face_image_record(self, face_attributes, face_upload):
        return database.add_image({
                "image_id": self.image_id,
                "public_id": face_upload["id"],
                "url": face_upload["url"],
                "age_v1": face_attributes.get("age_v1"),
                "age_v2": face_attributes.get("age_v2"),
                "gender": face_attributes.get("gender"),
                "ethnicity": face_attributes.get("ethnicity"),
                "emotion": face_attributes.get("emotion"),
            })
    
    def _add_processed_image_record(self, processed_image_upload):
        return database.add_image({
            "url": processed_image_upload["url"], 
            "original_id": self.image_id,
            "public_id": processed_image_upload["id"], 
            "type": self.upload_type,
            "face_count": self.face_count,
            "size": len(self.image)
        })
    
    def _add_result(self, face_url, face_attributes):
        self.result.append({
            "url": face_url,
            **face_attributes
        })
    
    def _get_processed_image(self):
        processed_image = self.cv_image
        for face_idx, (x, y, w, h) in enumerate(self.face_coordinates):
            write_face_labels(processed_image, x, y, x+w, y+h, self.attributes[f"face_{face_idx}"])
        return cv_to_buffer(processed_image)

    async def process_image(self):
        try:
            await self._read_file()
            self._extract_faces()

            image_upload = self._upload_image(self.image)
            self.image_id = self._add_image_record(image_upload)

            self.attributes = await self._predict_attributes()

            for face_id, face in self.image_faces.items():
                face_buffer = cv_to_buffer(face)
                face_upload = self._upload_image(face_buffer)
                self._add_face_image_record(self.attributes[face_id], face_upload)
                self._add_result(face_upload["url"], self.attributes[face_id])

            processed_image = self._get_processed_image()
            processed_image_upload = self._upload_image(processed_image)
            self._add_processed_image_record(processed_image_upload)
        
        except ValueError as e:
            raise print(f"Image validation error: {str(e)}") from e

        except IOError as e:
            raise print(f"File processing error: {str(e)}") from e

        except Exception as e:
            raise print(f"Unexpected image processing failure: {str(e)}") from e




