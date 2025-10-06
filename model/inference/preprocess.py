import base64
import numpy as np

def decode_base64_image(encoded_face):
    arr_bytes = base64.b64decode(encoded_face.array)
    return np.frombuffer(arr_bytes, dtype=encoded_face.dtype).reshape(encoded_face.shape)
