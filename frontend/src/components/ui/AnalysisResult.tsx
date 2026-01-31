"use client";
import FaceCard from "@/src/components/ui/FaceCard";
import styles from "@/src/styles/ui/analysis-result.module.css";

interface FaceData {
  id?: string | number;
  [key: string]: any;
}

interface AnalysisResponse {
  faces: FaceData[];
  original_source: string;
}

export default function AnalysisResult({ analysisResult, sourceType }: { analysisResult: AnalysisResponse, sourceType?: string }) {
  console.log(analysisResult);
  const title = sourceType === 'video' ? "Source Video" : "Source Image";
  if (!analysisResult) return <LoadingAnalysisResult styles={styles} title={title} />;
  const { faces, original_source } = analysisResult;

  return (
    <div className={styles.resultContainer}>

      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.originalImageWrapper}>
        {
          sourceType == "video" ?  
          <video className={styles.originalImage} controls>
            <source src={original_source} type="video/webm" />
            <source src={original_source} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          :
          <img
            src={original_source}
            alt="Uploaded image used for face analysis"
            className={styles.originalImage}
          />
        }
      </div>

      <h2 className={styles.sectionTitle}>Detected Faces ({faces?.length ?? 0})</h2>
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

function LoadingAnalysisResult({styles, title}: any) {
  return (
    <div className={styles.resultContainer}>
      <h2 className={styles.sectionTitle}>{title}</h2>
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