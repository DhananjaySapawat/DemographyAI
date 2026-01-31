const IMAGE_UPLOAD_URL = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_URL!;
const SNAPSHOT_UPLOAD_URL = process.env.NEXT_PUBLIC_SNAPSHOT_UPLOAD_URL!;
const VIDEO_UPLOAD_URL = process.env.NEXT_PUBLIC_VIDEO_UPLOAD_URL!;

async function uploadFile(url: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Upload failed");
  }

  return response.json();
}

export async function uploadImage(file: File) {
  return uploadFile(IMAGE_UPLOAD_URL, file);
}

export async function uploadSnapshot(file: File) {
  return uploadFile(SNAPSHOT_UPLOAD_URL, file);
}

export async function uploadVideo(file: File) {
  return uploadFile(VIDEO_UPLOAD_URL, file);
}
