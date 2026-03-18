const BACKEND_URL= process.env.NEXT_PUBLIC_BACKEND_URL!;

async function uploadFile(url: string, file: File, uploadType?: string) {
  const formData = new FormData();
  formData.append("file", file);

  if (uploadType) {
    formData.append("upload_type", uploadType);
  }

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
  return uploadFile(`${BACKEND_URL}/detect/image`, file, "image_upload");
}

export async function uploadSnapshot(file: File) {
  return uploadFile(`${BACKEND_URL}/detect/image`, file, "image_snapshot");
}

export async function uploadVideo(file: File) {
  return uploadFile(`${BACKEND_URL}/detect/video`, file);
}