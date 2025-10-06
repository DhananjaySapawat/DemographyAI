from app.config import MODEL_URL
import base64
import requests 

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
