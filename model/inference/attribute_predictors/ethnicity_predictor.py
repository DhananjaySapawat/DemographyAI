import tflite_runtime.interpreter as tflite
from inference.settings import ETHNICITY_MODEL_PATH
import numpy as np 

ethnicity_interpreter = tflite.Interpreter(model_path=ETHNICITY_MODEL_PATH)
ethnicity_interpreter.allocate_tensors()

input_index = ethnicity_interpreter.get_input_details()[0]["index"]
output_index = ethnicity_interpreter.get_output_details()[0]["index"]

ethnicity_mapping = {0: 'Asian', 1: 'Black', 2: 'Indian', 3: 'Others', 4: 'White'}

def predict_ethnicity(input_data):
    input_data = input_data.astype(np.float32, copy=False)
    ethnicity_interpreter.set_tensor(input_index, input_data)
    ethnicity_interpreter.invoke()
    ethnicity_logit = ethnicity_interpreter.get_tensor(output_index)
    ethnicity_id = np.argmax(ethnicity_logit, axis=1).item()
    ethnicity = ethnicity_mapping[ethnicity_id]  
    return ethnicity