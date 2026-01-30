"use client";

import { useEffect, useState } from "react";
import FaceCard from "@/src/components/ui/FaceCard";
import { uploadImage } from "@/src/lib/api";
import styles from "@/src/styles/image-analysis/image-result.module.css";

interface ImageResultProps {
  file: File | null;
}

interface FaceData {
  id?: string | number;
  [key: string]: any;
}

interface AnalysisResponse {
  face_count: number;
  faces: FaceData[];
  original_img: string;
}

export default function ImageResult({ file }: any) {
  const [imageResult, setImageResult] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;

    const analyzeImage = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await uploadImage(file);
        setImageResult(result);
      } catch (err) {
        console.error(err);
        setError("Failed to analyze image.");
      } finally {
        setLoading(false);
      }
    };

    analyzeImage();
  }, [file]);

  if (!file) return null;
  if (loading) return <p className={styles.statusMessage}>Analyzing image...</p>;
  if (error) return <p className={styles.errorMessage}>{error}</p>;
  if (!imageResult) return null;

  const { face_count, faces, original_img } = imageResult;

  return (
    <div className={styles.resultContainer}>
      <div className={styles.summarySection}>
        <h1 className={styles.summaryTitle}>Analysis Complete</h1>
        <p className={styles.summaryText}>
          Detected {face_count} faces in your image
        </p>
      </div>

      <div className={styles.originalImageWrapper}>
        <img
          src={original_img}
          alt="Uploaded image used for face analysis"
          className={styles.originalImage}
        />
      </div>

      <h2 className={styles.sectionTitle}>Detected Faces</h2>
      <div className={styles.facesGrid}>
        {faces?.length > 0 ? (
          faces.map((face, index) => (
            <FaceCard key={face.id ?? index} faceDetails={face} />
          ))
        ) : (
          <p className={styles.noFacesMessage}>No faces detected.</p>
        )}
      </div>
    </div>
  );
}
