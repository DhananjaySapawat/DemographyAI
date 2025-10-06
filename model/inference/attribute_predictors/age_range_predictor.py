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
    age_range_logit = age_range_interpreter.get_tensor(output_index)
    age_label = np.argmax(age_range_logit, axis=1).item()
    age_range = idx_to_age_range[age_label]        
    return age_range

