from inference.attribute_predictors.age_predictor import predict_age
from inference.attribute_predictors.age_range_predictor import predict_age_range
from inference.attribute_predictors.gender_predictor import predict_gender
from inference.attribute_predictors.emotion_predictor import predict_emotion
from inference.attribute_predictors.ethnicity_predictor import predict_ethnicity
from inference.preprocess import decode_base64_image

async def predict_attributes_from_model(encoded_face):    
    input_data = decode_base64_image(encoded_face)
    return {
        "age_v1": predict_age(input_data),
        "age_v2": predict_age_range(input_data),
        "gender": predict_gender(input_data),
        "emotion": predict_emotion(input_data),
        "ethnicity": predict_ethnicity(input_data)
    }
