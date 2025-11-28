from app.processing.face_extractor import extract_faces
from app.processing.image_process import buffer_to_cv, add_attributes_to_image
from app.processing.video_process import add_attributes_to_video, extract_faces_from_video

from app.ai.predictors import predict_attributes, predict_attributes_for_video
from app.db.crud import create_image_record, create_image_face_record, create_processed_image_record, create_video_record

from app.storage import upload_image, upload_video

async def process_uploaded_image(file, upload_type):
    try:
        # Read file
        img = await file.read()  
        cv_img = buffer_to_cv(img)

        # Upload original image
        try:
            image_url, image_public_id = upload_image(img)
            image_id = await create_image_record({
                "url": image_url, 
                "public_id": image_public_id, 
                "type": upload_type,
                "face_count": 0,
                "size": file.size
            })
        except Exception as e:
            return {"error": f"Failed to upload original image: {e}"}

        results, processed_info = [], []

        # Extract faces
        try:
            faces = await extract_faces(cv_img)
        except Exception as e:
            return {"error": f"Failed to extract faces: {e}"}

        # Predict attributes
        try:
            faces_with_attributes = await predict_attributes(faces)
        except Exception as e:
            return {"error": f"Failed to predict attributes: {e}"}
        
        # Process each face
        for face in faces_with_attributes:
            try:
                attributes = face["attributes"]
                face_url, face_public_id = upload_image(face["buffer_img"])

                # Save face info
                await create_image_face_record({
                    "image_id": image_id,
                    "public_id": face_public_id,
                    "url": face_url,
                    "age_v1": attributes.get("age_v1"),
                    "age_v2": attributes.get("age_v2"),
                    "gender": attributes.get("gender"),
                    "ethnicity": attributes.get("ethnicity"),
                    "emotion": attributes.get("emotion"),
                })

                results.append({
                    "url": face_url,
                    **attributes
                })

                processed_info.append({
                    "cords": face["cords"],
                    "attributes": attributes
                })

            except Exception as e:
                # Continue processing other faces but log error
                print(f"Error processing face: {e}")
                continue

        # Add attributes to original image
        try:
            processed_img = add_attributes_to_image(cv_img, processed_info)
            processed_image_url, processed_image_public_id = upload_image(processed_img)
            await create_processed_image_record({
                "url": processed_image_url, 
                "original_id": image_id,
                "public_id": processed_image_public_id, 
                "type": upload_type,
                "face_count": len(processed_info),
                "size": file.size
            })
        except Exception as e:
            print(f"Error processing final image: {e}")

        return results

    except Exception as e:
        # Catch any other unexpected errors
        return {"error": f"Unexpected error: {e}"}

from pathlib import Path

async def process_uploaded_video(file):
    raw_video_path = f"video_test/{file.filename}"
    processed_video_path = f"video_test/processed_{Path(file.filename).stem}.webm"

    # Save uploaded video to disk
    with open(raw_video_path, "wb") as f:
        f.write(await file.read())

    video_info, face_images, faces_per_frame = extract_faces_from_video(raw_video_path)
    faces_attributes = await predict_attributes_for_video(face_images)
    add_attributes_to_video(processed_video_path, raw_video_path, video_info, faces_per_frame, faces_attributes)

    video_url = upload_video(processed_video_path)
    await create_video_record({
        "url": video_url,
        "size": Path(raw_video_path).stat().st_size
    })

    return video_url
