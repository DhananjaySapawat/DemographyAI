"use client";

import { useRef, useState } from 'react';
import { Upload, X, CircleCheckBig } from 'lucide-react';
import styles from '@/src/styles/ui/file-upload.module.css';

export default function FileUpload( {file, setFile, setAnalyze} : any ) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const MAX_SIZE_MB = 1;
  const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];


  const validateFile = (selectedFile: File) => {
    if (!ACCEPTED_TYPES.includes(selectedFile.type)) {
      return "Only JPG, PNG, and WebP images are allowed.";
    }

    if (selectedFile.size > MAX_SIZE_MB * 1024 * 1024) {
      return "File must be smaller than 10MB.";
    }

    return null;
  };

  const handleFile = (selectedFile: File) => {
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setFile(selectedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };


  const removeFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
    {!file ? (
      <div
          className={`${styles.dropzone} ${error ? styles.dropzoneError : ""}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >

        <div className={styles.iconWrapper}>
          <Upload size={40} />
        </div>

        <h3 className={styles.title}>Drag & drop your image here</h3>
        <p className={styles.subtitle}>or click to browse files</p>

        <button className={styles.button}>
          <Upload size={18} />
          Select Image
        </button>

        <p className={styles.helperText}>
          Supports JPG, PNG, WebP up to 10MB
        </p>

        {error && <p className={styles.errorText}>{error}</p>}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }} 
          accept=".jpg,.jpeg,.png,.webp"
        />
      </div>
      ) : ( 
        <div className={styles.successContainer}>
          <button className={styles.removeButton} onClick={() => removeFile()} >
            <X size={18} />
          </button>

          <div className={styles.successContent}>
            <div className={styles.successIconContainer}>
              <CircleCheckBig size={40} />
            </div>

            <p className={styles.fileName}>{file?.name}</p>
            <span className={styles.fileSize}>
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </span>

            <button className={styles.analyzeButton} onClick={() => setAnalyze(true)}>
              Analyze Image
            </button>
          </div>
        </div>
      )}

    </>
  );
}
