from app.config import MODEL_URL
import base64
import requests 
import traceback

async def predict_attributes(faces):
    url = f"{MODEL_URL}/predict_attributes"

    payload_arrays = []
    for face in faces:
        img_bytes = face["tflite_img"].tobytes()
        img_b64 = base64.b64encode(img_bytes).decode('utf-8')
        payload_arrays.append({
            "array": img_b64,
            "shape": face["tflite_img"].shape,
            "dtype": str(face["tflite_img"].dtype)
        })

    response = requests.post(url, json={"face_array": payload_arrays})
    if response.status_code == 200:
        attributes_list = response.json()["predictions"]
        for i, item in enumerate(faces):
            item["attributes"] = attributes_list[i]
        return faces
    else:
        return []

async def predict_attributes_for_video(frame_faces):
    try:
        url = f"{MODEL_URL}/predict_attributes_for_video"

        payload_arrays = []
        for key in frame_faces.keys():
            img_bytes = frame_faces[key].tobytes()
            img_b64 = base64.b64encode(img_bytes).decode('utf-8')
            payload_arrays.append({
                "array": img_b64,
                "shape": frame_faces[key].shape,
                "dtype": str(frame_faces[key].dtype),
                "face_id": key
            })

        response = requests.post(url, json={"face_array": payload_arrays})
        if response.status_code == 200:
            return response.json().get("predictions", [])
        else:
            print(f"Request failed with status code {response.status_code}")
            return []

    except Exception as e:
        print("Error in predict_attributes_for_video:", str(e))
        traceback.print_exc()
        return []
