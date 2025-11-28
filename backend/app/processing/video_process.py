import cv2
from app.processing.face_extractor import extract_face_coordinates_upload, preprocess_tflite

def get_video_properties(video_capture):
    fps = video_capture.get(cv2.CAP_PROP_FPS)
    width = int(video_capture.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(video_capture.get(cv2.CAP_PROP_FRAME_HEIGHT))
    total_frames = int(video_capture.get(cv2.CAP_PROP_FRAME_COUNT))
    return fps, width, height, total_frames

def extract_faces_from_video(video_path) -> list:
    video_capture = cv2.VideoCapture(video_path)
    fps, width, height, total_frames = get_video_properties(video_capture)

    video_info = {
        "frame_rate": fps,
        "frame_width": width,
        "frame_height": height,
        "total_frames": total_frames,
        "total_faces": 0,
    }

    face_images, faces_per_frame = {}, {}
    frame_index, total_face_count = 0, 0

    while video_capture.isOpened():
        ret, frame = video_capture.read()
        if not ret:
            break

        faces_per_frame.setdefault(frame_index, [])

        for (x, y, w, h) in extract_face_coordinates_upload(frame):
            try:
                face_crop = frame[y:y + h, x:x + w]
                face_images[total_face_count % 4] = preprocess_tflite(face_crop)

                faces_per_frame[frame_index].append({
                    "face_id": total_face_count % 4,
                    "coordinates": (x, y, w, h)
                })

                total_face_count += 1
            except Exception as e:
                print(f"Error extracting face from frame {frame_index}: {e}")
                continue

        frame_index += 1

    video_capture.release()
    video_info["total_faces"] = total_face_count - 1
    return video_info, face_images, faces_per_frame

def write_face_labels(frame, x1, y1, x2, y2, attributes):

    font = cv2.FONT_HERSHEY_SIMPLEX
    font_scale = 0.6
    thickness = 2
    text_height = 20  
    bg_color = (35,102,11)

    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
    annotations = [f'Age: {attributes["age_v1"]}',f'Gender: {attributes["gender"]}',f'Ethnicity: {attributes["ethnicity"]}',f'Emotion: {attributes["emotion"]}']

    for i, text in enumerate(annotations):
        top_left = (x1, y2 + i * text_height)
        bottom_right = (x2, y2 + (i + 1) * text_height)
        cv2.rectangle(frame, top_left, bottom_right, bg_color, cv2.FILLED)
        text_position = (x1 + 5, y2 + (i + 1) * text_height - 5)
        cv2.putText(frame, text, text_position, font, font_scale, (255, 255, 255), thickness)

def add_attributes_to_video(processed_video_path, raw_video_path, video_info, faces_per_frame, faces_attributes):
    # Open the original video
    cap = cv2.VideoCapture(raw_video_path) 
    fps = video_info["frame_rate"]
    width = video_info["frame_width"]
    height = video_info["frame_height"]

    # Define video writer
    fourcc = cv2.VideoWriter_fourcc(*'VP80')
    out = cv2.VideoWriter(processed_video_path, fourcc, fps, (width, height))

    frame_index = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Draw bounding boxes for all faces in this frame
        for face in faces_per_frame.get(frame_index, []):
            x, y, w, h = face["coordinates"]
            face_id = face["face_id"]
            attributes = faces_attributes[str(face_id)]
            write_face_labels(frame, x, y, x + w, y + h, attributes)

        out.write(frame)
        frame_index += 1

    cap.release()
    out.release()
