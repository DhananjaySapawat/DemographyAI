"use client";
import { useEffect, useRef, useState } from "react";
import { Camera, Circle, RefreshCw, AlertCircle, X } from "lucide-react";
import styles from "@/src/styles/camera-capture/camera-stream.module.css";

export default function CameraStream({ uploadFile, changeFile, status, error, setError}: any) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      setError(null);
    } catch (err: any) {
      console.error("Camera error:", err);

      if (err.name === "NotFoundError") {
        setError("No camera device found");
      } else if (err.name === "NotAllowedError") {
        setError("Camera permission denied");
      } else if (err.name === "NotReadableError") {
        setError("Camera is already in use by another application");
      } else {
        setError("Unable to access camera");
      }
    }
  };

  
  const stopCamera = () => {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], "camera-capture.jpg", {
        type: "image/jpeg",
      });
      setCapturedFile(file);
      changeFile(file);
      stopCamera();
    }, "image/jpeg");
  };

  const handleAnalyze = () => {
    if (capturedFile) uploadFile(capturedFile);
  };

  const retakePhoto = () => {
    setCapturedFile(null);
    changeFile(null);
    startCamera();
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className={styles.cameraContainer}>
      <div className={styles.cameraWrapper}>
        {!stream && !capturedFile &&(
          <div className={styles.placeholder}>
            <div className={styles.cameraIcon}>
              <Camera size={48} />
            </div>
            <h2 className={styles.placeholderTitle}>Use Your Camera</h2>
            <p className={styles.placeholderText}>Click below to start your camera</p>
          </div>
        )}

        {!capturedFile && (
            <video ref={videoRef} autoPlay playsInline className={styles.video} />
        )}

        {capturedFile && (
          <img
            src={URL.createObjectURL(capturedFile)}
            alt="Captured Image"
            className={styles.capturedImage}
          />
        )}

        <canvas ref={canvasRef} className={styles.hiddenCanvas} />
        {error && (
          <div className={styles.errorBanner}>
            <AlertCircle size={16} className={styles.errorIcon} />

            <span className={styles.errorText}>{error}</span>

            <button
              className={styles.errorClose}
              onClick={() => setError(null)}
            >
              <X size={14} />
            </button>
          </div>
        )}
        
      </div>
      <div className={styles.controls}>
        {!stream && !capturedFile && (
          <button onClick={startCamera} className={styles.primaryBtn}>
            <Camera size={18} /> Start Camera
          </button>
        )}

        {stream && !capturedFile && (
          <button onClick={capturePhoto} className={styles.primaryBtn}>
            <Circle size={18} /> Capture Photo
          </button>
        )}

        {capturedFile && (
          <>
            <button
              className={`${styles.analyzeButton} ${ status === "analyzing" ? "pointer-events-none" : ""}`}
              onClick={handleAnalyze}
              disabled={status === "analyzing"}
            >
              {status === "analyzing" ? "Analyzing..." : "Analyze Image"}
            </button>

            <button 
              className={`${styles.secondaryBtn} ${ status === "analyzing" ? "pointer-events-none" : ""}`}
              onClick={retakePhoto}
              disabled={status === "analyzing"}
            >
              <RefreshCw size={18} /> Take Another
            </button>
          </>
        )}

      </div>

    </div>
  );
}
