import tflite_runtime.interpreter as tflite
from inference.settings import EMOTION_MODEL_PATH
import numpy as np 

emotion_interpreter = tflite.Interpreter(model_path=EMOTION_MODEL_PATH)
emotion_interpreter.allocate_tensors()

input_index = emotion_interpreter.get_input_details()[0]["index"]
output_index = emotion_interpreter.get_output_details()[0]["index"]

emotion_mapping = {0: 'Anger', 1: 'Contempt', 2: 'Disgust', 3: 'Fear', 4: 'Happy', 5: 'Neutral', 6: 'Sad', 7: 'Surprise'}

def predict_emotion(input_data):
    input_data = input_data.astype(np.float32, copy=False)
    emotion_interpreter.set_tensor(input_index, input_data)
    emotion_interpreter.invoke()
    emotion_logit = emotion_interpreter.get_tensor(output_index)
    emotion_id = np.argmax(emotion_logit, axis=1).item()
    emotion = emotion_mapping[emotion_id] 
    return emotion
