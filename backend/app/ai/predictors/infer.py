from typing import Dict

async def predict_attributes(face_image) -> Dict:
    return {
        "age_v1": "17",
        "age_v2": "10-19",
        "gender": "male",
        "emotion": "happy",
        "ethnicity": "white"
    }
