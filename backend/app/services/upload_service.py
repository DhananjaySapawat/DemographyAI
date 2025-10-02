from app.processing.face_extractor import extract_faces
from app.processing.image_process import buffer_to_cv, add_attributes_to_image

from app.ai.predictors.infer import predict_attributes
from app.cloud.cloud_upload import upload_image_to_cloud, upload_video_to_cloud
from app.db.crud import create_image_record, create_image_face_record, create_processed_image_record, create_video_record

async def process_upload_image(file, upload_type):

    img = await file.read()  
    cv_img = buffer_to_cv(img)

    image_url, image_public_id = upload_image_to_cloud(img)
    image_id = await create_image_record({
        "url" : image_url, 
        "public_id" : image_public_id, 
        "type" : upload_type,
        "face_count" : 0,
        "size" : file.size
    })

    faces = await extract_faces(cv_img)
    results = []
    processed_info = []

    for face in faces:
        attributes = await predict_attributes(face["cv_img" ])
        face_url, face_public_id = upload_image_to_cloud(face["buffer_img"])

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

    processed_img = add_attributes_to_image(cv_img, processed_info)
    processed_image_url, processed_image_public_id = upload_image_to_cloud(processed_img)
    await create_processed_image_record({
        "url" : processed_image_url, 
        "original_id" : image_id,
        "public_id" : processed_image_public_id, 
        "type" : upload_type,
        "face_count" : 0,
        "size" : file.size
    })

    return results

async def process_upload_video(file):
    video = await file.read()  
    video_url = upload_video_to_cloud(video)
    await create_video_record({
        "url" : video_url, 
        "size" : file.size
    })
    return video_url