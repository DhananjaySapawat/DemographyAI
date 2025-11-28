from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Tuple
from inference.predict import predict_attributes_from_model

app = FastAPI(title="DemographyAI Model")

class FaceListItem(BaseModel):
    array: str
    shape: List[int]
    dtype: str

class FaceListPayload(BaseModel):
    face_array: List[FaceListItem]

@app.post("/predict_attributes")
async def predict_attributes(payload: FaceListPayload):
    try:
        results = []
        for encoded_face in payload.face_array:
            result = await predict_attributes_from_model(encoded_face)
            results.append(result)
        return {"predictions": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class FaceListItem_2(BaseModel):
    array: str
    shape: List[int]
    dtype: str
    face_id: int

class FaceListPayload_2(BaseModel):
    face_array: List[FaceListItem_2]

@app.post("/predict_attributes_for_video")
async def predict_attributes_for_video(payload: FaceListPayload_2):
    try:
        results = {}
        for encoded_face in payload.face_array:
            result = await predict_attributes_from_model(encoded_face)
            results[encoded_face.face_id] = result
        return {"predictions": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))