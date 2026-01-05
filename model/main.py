from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from inference.predict import predict_attributes_from_model

app = FastAPI(title="DemographyAI Model")

class FaceListItem(BaseModel):
    image: str
    face_id: str

class FaceListPayload(BaseModel):
    face_array: List[FaceListItem]

@app.post("/predict_attributes")
async def predict_attributes(payload: FaceListPayload):
    try:
        results = {}
        for encoded_face in payload.face_array:
            result = await predict_attributes_from_model(encoded_face.image)
            results[encoded_face.face_id] = result
        return {"predictions": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))