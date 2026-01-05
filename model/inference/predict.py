from inference.attribute_predictors.age_predictor import predict_age
from inference.attribute_predictors.age_range_predictor import predict_age_range
from inference.attribute_predictors.gender_predictor import predict_gender
from inference.attribute_predictors.emotion_predictor import predict_emotion
from inference.attribute_predictors.ethnicity_predictor import predict_ethnicity
from inference.preprocess import decode_image, to_tflite_input

async def predict_attributes_from_model(encoded_face):    
    input_data = decode_image(encoded_face)
    tflite_input = to_tflite_input(input_data)
    return {
        "age_v1": predict_age(tflite_input),
        "age_v2": predict_age_range(tflite_input),
        "gender": predict_gender(tflite_input),
        "emotion": predict_emotion(tflite_input),
        "ethnicity": predict_ethnicity(tflite_input)
    }
