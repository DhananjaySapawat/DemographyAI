import tflite_runtime.interpreter as tflite
from inference.settings import AGE_MODEL_PATH
import numpy as np 

age_interpreter = tflite.Interpreter(model_path=AGE_MODEL_PATH)
age_interpreter.allocate_tensors()

input_index = age_interpreter.get_input_details()[0]["index"]
output_index = age_interpreter.get_output_details()[0]["index"]

def predict_age(input_data):
    input_data = input_data.astype(np.float32, copy=False)
    age_interpreter.set_tensor(input_index, input_data)
    age_interpreter.invoke()
    age_logit = age_interpreter.get_tensor(output_index)
    return str(int(age_logit.item())) 

