import tflite_runtime.interpreter as tflite
from inference.settings import GENDER_MODEL_PATH
import numpy as np 

gender_interpreter = tflite.Interpreter(model_path=GENDER_MODEL_PATH)
gender_interpreter.allocate_tensors()

input_index = gender_interpreter.get_input_details()[0]["index"]
output_index = gender_interpreter.get_output_details()[0]["index"]

gender_mapping = {0: 'Female', 1: 'Male'}

def predict_gender(input_data):
    input_data = input_data.astype(np.float32, copy=False)

    gender_interpreter.set_tensor(input_index, input_data)
    gender_interpreter.invoke()

    logit = gender_interpreter.get_tensor(output_index).item()

    prob = 1 / (1 + np.exp(-logit))
    gender_id = int(prob > 0.5)

    confidence = float(prob if gender_id == 1 else 1 - prob)

    return {
        "label": gender_mapping[gender_id],
        "confidence": confidence
    }
