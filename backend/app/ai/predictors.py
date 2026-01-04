from app.config import MODEL_URL
import base64
import requests 
import traceback

async def predict_attributes(frame_faces):
    try:
        url = f"{MODEL_URL}/predict_attributes"

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
        print("Error in predict_attributes:", str(e))
        traceback.print_exc()
        return []
