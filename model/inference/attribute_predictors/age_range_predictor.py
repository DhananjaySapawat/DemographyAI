import tflite_runtime.interpreter as tflite
from inference.settings import AGE_RANGE_MODEL_PATH
import numpy as np 

age_range_interpreter = tflite.Interpreter(model_path=AGE_RANGE_MODEL_PATH)
age_range_interpreter.allocate_tensors()

input_index = age_range_interpreter.get_input_details()[0]["index"]
output_index = age_range_interpreter.get_output_details()[0]["index"]

idx_to_age_range = {0: '0-9', 1: '10-19', 2: '20-24', 3: '25-29', 4: '30-34', 5: '35-39', 6: '40-44', 7: '45-54', 8: '55-116'}

def predict_age_range(input_data):
    input_data = input_data.astype(np.float32, copy=False)

    age_range_interpreter.set_tensor(input_index, input_data)
    age_range_interpreter.invoke()

    logits = age_range_interpreter.get_tensor(output_index)

    probs = np.exp(logits) / np.sum(np.exp(logits), axis=1, keepdims=True)

    age_label = np.argmax(probs, axis=1).item()
    confidence = float(np.max(probs))

    return {
        "label": idx_to_age_range[age_label],
        "confidence": confidence
    }