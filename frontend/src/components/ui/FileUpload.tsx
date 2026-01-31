"use client";

import { useRef, useState } from 'react';
import { Upload, X, CircleCheckBig, Sparkles, RefreshCw} from 'lucide-react';
import styles from '@/src/styles/ui/file-upload.module.css';

export default function FileUpload( {file, setFile, state, setState, uploadError} : any ) {


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
      setState("upload");
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
    {(!file && state == 'upload') && < FileUploader styles={styles} error={error} fileInputRef={fileInputRef} handleDrop={handleDrop} handleFileChange={handleFileChange} />}
    {(file && state != 'result') && < AnalyzeContainer styles={styles} removeFile={removeFile} file={file} state={state} setState={setState} uploadError={uploadError} />}
    {state == 'result' && <SuccessContainer styles={styles} fileInputRef={fileInputRef} />}    
    <input
      type="file"
      ref={fileInputRef}
      onChange={handleFileChange}
      style={{ display: 'none' }} 
      accept=".jpg,.jpeg,.png,.webp"
    />
</>
  );
}

function FileUploader({styles, error, fileInputRef, handleDrop}: any) {
  return (
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
    </div>
  )
}

function AnalyzeContainer({styles, removeFile, file, state, setState, uploadError}: any) {
  return (
    <div className={styles.successContainer}>
      <button className={styles.removeButton} onClick={() => state === "upload" && removeFile()}>
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

        <button className={styles.analyzeButton} onClick={() => setState("analyzing")}>
          {state == "analyzing" ? "Analyzing..." : "Analyze Image"}
        </button>

        {uploadError && <p className={styles.errorText}>{uploadError}</p>}
      </div>
    </div>
  )
}

function SuccessContainer({ styles, fileInputRef }: any) {
  return (
    <div className={styles.successContainer}>
      <div className={styles.successContent}>
        <div className={styles.successIconContainer}>
          <Sparkles size={40} />
        </div>

        <p className={styles.fileName}>Analysis Complete</p>
        <span className={styles.fileSize}>
          Your image has been processed successfully
        </span>

        <button className={styles.analyzeButton} onClick={() => fileInputRef.current?.click()}>
           <RefreshCw size={18} /> Analyze Another Image
        </button>
      </div>
    </div>
  )
}