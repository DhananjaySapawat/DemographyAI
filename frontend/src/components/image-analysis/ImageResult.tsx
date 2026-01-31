"use client";

import { useEffect, useState } from "react";
import FaceCard from "@/src/components/ui/FaceCard";
import { uploadImage } from "@/src/lib/api";
import styles from "@/src/styles/image-analysis/image-result.module.css";

interface FaceData {
  id?: string | number;
  [key: string]: any;
}

interface AnalysisResponse {
  face_count: number;
  faces: FaceData[];
  original_img: string;
}

export default function ImageResult({ file, setError, state, setState }: any) {
  const [imageResult, setImageResult] = useState<AnalysisResponse | null>(null);

  useEffect(() => {
    if (!file) return;

    const analyzeImage = async () => {
      try {
        setError(null);
        const result = await uploadImage(file);
        setImageResult(result);
      } catch (err) {
        console.error(err);
        setError("Failed to analyze image.");
      } finally {
        console.log("Analysis complete");
        setState("result");
      }
    };

    analyzeImage();
  }, [file]);

  if (!file) return null;
  if (state === "analyzing") return <LoadingImageResult styles={styles} />;
  if (!imageResult) return null;

  const { face_count, faces, original_img } = imageResult;

  return (
    <div className={styles.resultContainer}>

      <h2 className={styles.sectionTitle}>Source Image</h2>
      <div className={styles.originalImageWrapper}>
        <img
          src={original_img}
          alt="Uploaded image used for face analysis"
          className={styles.originalImage}
        />
      </div>

      <h2 className={styles.sectionTitle}>Detected Faces ({face_count})</h2>
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

function LoadingImageResult({styles}: any) {
  return (
    <div className={styles.resultContainer}>
      <h2 className={styles.sectionTitle}>Source Image</h2>
      <div className={styles.loadingImageWrapper}/>

      <h2 className={styles.sectionTitle}>Detecting Faces...</h2>
      <div className={styles.loadingfacesGrid}>
        <LoadingFaceCard />
        <LoadingFaceCard />
        <LoadingFaceCard />
      </div>
    </div>
  );
}

function LoadingFaceCard() {
  return (
    <div className={styles.loadingCardGroup}>
      <div className={styles.loadingImageWrapper}>
        <div className={styles.loadingImage} />
      </div>

      <div className={styles.loadingDetailsContent}>
        <div className={styles.loadingHeader}>
          <div className={styles.loadingTitle} />
        </div>

        <div className={styles.loadingInfoList}>
          <div className={styles.loadingInfoItem}>
            <div className={styles.loadingIcon} />
            <div className={styles.loadingLabel} />
            <div className={styles.loadingValue} />
          </div>
          
          <div className={styles.loadingInfoItem}>
            <div className={styles.loadingIcon} />
            <div className={styles.loadingLabel} />
            <div className={styles.loadingValue} />
          </div>

          <div className={styles.loadingInfoItem}>
            <div className={styles.loadingIcon} />
            <div className={styles.loadingLabel} />
            <div className={styles.loadingValue} />
          </div>

          <div className={styles.loadingInfoItem}>
            <div className={styles.loadingIcon} />
            <div className={styles.loadingLabel} />
            <div className={styles.loadingValue} />
          </div>
        </div>
      </div>
    </div>
  );
}