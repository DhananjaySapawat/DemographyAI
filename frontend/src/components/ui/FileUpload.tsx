"use client";

import { useRef, useState } from 'react';
import { Upload, Video, X, CircleCheckBig, Sparkles, RefreshCw} from 'lucide-react';
import styles from '@/src/styles/ui/file-upload.module.css';

export default function FileUpload( {uploadFile, changeFile, status, upload_error, isVideo} : any ) {

  const [file, setFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const MAX_SIZE_MB = isVideo ? 25 : 10; 
  const ACCEPTED_TYPES = isVideo ? ["video/mp4", "video/webm"] : ["image/jpeg", "image/png", "image/webp"]; 



  const validateFile = (selectedFile: File) => {
    if (!ACCEPTED_TYPES.includes(selectedFile.type)) {
      return isVideo ? "Only MP4 and Webm videos are allowed." : "Only JPG, PNG, and WebP images are allowed.";
    }

    if (selectedFile.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File must be smaller than ${MAX_SIZE_MB}MB.`;
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
    changeFile();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };


  const removeFile = () => {
    changeFile();
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
    {(!file && status == 'idle') && < FileUploader styles={styles} error={error} fileInputRef={fileInputRef} handleDrop={handleDrop} handleFileChange={handleFileChange} isVideo={isVideo} maxSize={MAX_SIZE_MB} />}
    {(file && status !='success' ) && < AnalyzeContainer styles={styles} removeFile={removeFile} file={file} uploadFile={uploadFile} status={status} upload_error={upload_error} isVideo={isVideo} />}
    {status == 'success' && <SuccessContainer styles={styles} fileInputRef={fileInputRef} isVideo={isVideo} />}    
    <input
      type="file"
      ref={fileInputRef}
      onChange={handleFileChange}
      style={{ display: 'none' }} 
      accept={isVideo ? ".mp4,.webm" : ".jpg,.jpeg,.png,.webp"} 
    />
</>
  );
}

function FileUploader({styles, error, fileInputRef, handleDrop, isVideo, maxSize}: any) {
  return (
      <div
          className={`${styles.dropzone} ${error ? styles.dropzoneError : ""}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >

        <div className={styles.iconWrapper}>
          {isVideo ? <Video /> : <Upload />}
        </div>

        <h3 className={styles.title}>Drag & drop your {isVideo ? "video" : "image"} here</h3>
        <p className={styles.subtitle}>or click to browse files</p>

        <button className={styles.button}>
          <Upload />
          Select {isVideo ? "Video" : "Image"} 
        </button>

        <p className={styles.helperText}>
          Supports {isVideo ? "MP4, WEBM" : "JPG, PNG, WebP"} up to {maxSize}MB 
        </p>

        {error && <p className={styles.errorText}>{error}</p>}
    </div>
  )
}

function AnalyzeContainer({styles, removeFile, file, status, uploadFile, upload_error, isVideo}: any) {
  return (
    <div className={styles.successContainer}>
      <button 
        className={`${styles.removeButton} ${status === "analyzing" ? "pointer-events-none" : ""}`} 
        onClick={() => status != "analyzing" && removeFile()}
      >
        <X />
      </button>

      <div className={styles.successContent}>
        <div className={styles.successIconContainer}>
          <CircleCheckBig />
        </div>

        <p className={styles.fileName}>{file?.name}</p>
        <span className={styles.fileSize}>
          {(file.size / (1024 * 1024)).toFixed(2)} MB
        </span>

        <button 
          className={`${styles.analyzeButton} ${status === "analyzing" ? "pointer-events-none" : ""}`} 
          onClick={() => uploadFile(file)}>
          {status == "analyzing" ? "Analyzing..." : `Analyze ${isVideo ? "Video" : "Image"}`}
        </button>

        {status =="error" && <p className={styles.errorText}>{upload_error}</p>}
      </div>
    </div>
  )
}

function SuccessContainer({ styles, fileInputRef, isVideo }: any) {
  return (
    <div className={styles.successContainer}>
      <div className={styles.successContent}>
        <div className={styles.successIconContainer}>
          <Sparkles />
        </div>

        <p className={styles.fileName}>Analysis Complete</p>
        <span className={styles.fileSize}>
          Your {isVideo ? "video" : "image"} has been processed successfully 
        </span>

        <button className={styles.analyzeButton} onClick={() => {fileInputRef.current?.click();}}>
           <RefreshCw /> Analyze Another {isVideo ? "Video" : "Image"} 
        </button>
      </div>
    </div>
  )
}