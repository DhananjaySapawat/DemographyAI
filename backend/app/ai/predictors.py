from app.config import MODEL_URL
import base64
import logging
import cv2
import httpx

logger = logging.getLogger(__name__)

async def predict_attributes(frame_faces: dict) -> dict:
    if not frame_faces:
        return {"predictions": {}, "model_version": None}

    url = f"{MODEL_URL}/predict_attributes"

    payload_arrays = []
    for key, face in frame_faces.items():
        _, buffer = cv2.imencode('.png', face)
        img_b64 = base64.b64encode(buffer).decode()
        payload_arrays.append({"image": img_b64, "face_id": key})

    try:
        async with httpx.AsyncClient(timeout=300.0) as client:
            response = await client.post(url, json={"face_array": payload_arrays})

        response.raise_for_status()
        return response.json()

    except httpx.TimeoutException:
        logger.error("Model server request timed out")
        raise

    except httpx.HTTPStatusError as e:
        logger.error(f"Model server returned error | status={e.response.status_code}")
        raise

    except httpx.RequestError as e:
        logger.error(f"Failed to reach model server | error={e}")
        raise