from app.processing import *
from app.ai import predict_attributes, predict_attributes_for_video
from app.providers import storage, database

import tempfile
import traceback
from pathlib import Path

async def process_uploaded_image(file, upload_type):
    try:
        # Read file
        img = await file.read()  
        cv_img = buffer_to_cv(img)

        # Upload original image
        try:
            img_upload = storage.upload_image(img)
            image_id = database.add_image({
                "url": img_upload["url"], 
                "public_id": img_upload["id"], 
                "type": upload_type,
                "face_count": 0,
                "size": file.size
            })
        except Exception as e:
            traceback.print_exc()
            return {"error": f"Failed to upload original image: {e}"}

        results, processed_info = [], []

        # Extract faces
        try:
            faces = await extract_faces(cv_img)
        except Exception as e:
            traceback.print_exc()
            return {"error": f"Failed to extract faces: {e}"}

        # Predict attributes
        try:
            faces_with_attributes = await predict_attributes(faces)
        except Exception as e:
            traceback.print_exc()
            return {"error": f"Failed to predict attributes: {e}"}
        
        # Process each face
        for face in faces_with_attributes:
            try:
                attributes = face["attributes"]
                face_upload = storage.upload_image(face["buffer_img"])

                # Save face info
                database.add_face({
                    "image_id": image_id,
                    "public_id": face_upload["id"],
                    "url": face_upload["url"],
                    "age_v1": attributes.get("age_v1"),
                    "age_v2": attributes.get("age_v2"),
                    "gender": attributes.get("gender"),
                    "ethnicity": attributes.get("ethnicity"),
                    "emotion": attributes.get("emotion"),
                })

                results.append({
                    "url": face_upload["url"],
                    **attributes
                })

                processed_info.append({
                    "cords": face["cords"],
                    "attributes": attributes
                })

            except Exception as e:
                # Continue processing other faces but log error
                traceback.print_exc()
                print(f"Error processing face: {e}")
                continue

        # Add attributes to original image
        try:
            processed_img = add_attributes_to_image(cv_img, processed_info)
            proc_img_upload = storage.upload_image(processed_img)
            database.add_processed_image({
                "url": proc_img_upload["url"], 
                "original_id": image_id,
                "public_id": proc_img_upload["id"], 
                "type": upload_type,
                "face_count": len(processed_info),
                "size": file.size
            })
        except Exception as e:
            traceback.print_exc()
            print(f"Error processing final image: {e}")

        return results

    except Exception as e:
        # Catch any other unexpected errors
        traceback.print_exc()
        return {"error": f"Unexpected error: {e}"}

async def process_uploaded_video(file):
    # Use tempfile for raw video
    raw_temp = tempfile.NamedTemporaryFile(delete=False, suffix=Path(file.filename).suffix)
    raw_video_path = raw_temp.name
    raw_temp.close()

    # Save uploaded video
    with open(raw_video_path, "wb") as f:
        f.write(await file.read())

    # Use tempfile for processed video
    processed_temp = tempfile.NamedTemporaryFile(delete=False, suffix=".webm")
    processed_video_path = processed_temp.name
    processed_temp.close()

    video_info, face_images, faces_per_frame = extract_faces_from_video(raw_video_path)
    faces_attributes = await predict_attributes_for_video(face_images)
    add_attributes_to_video(processed_video_path, raw_video_path, video_info, faces_per_frame, faces_attributes)

    video_url = storage.upload_video(processed_video_path)
    database.add_video({
        "url": video_url,
        "size": Path(raw_video_path).stat().st_size
    })

    return video_url
