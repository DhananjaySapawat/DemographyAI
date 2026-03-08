"use client";
import { useRef, useState, useEffect, useCallback, use } from "react";
import { Radio, Play, Square } from "lucide-react";

import * as blazeface from "@tensorflow-models/blazeface";
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgpu'; 

import FaceCard from "@/src/components/ui/FaceCard";
import { loadFaceAttributeModels, analyzeFaces, drawMesh, getStreamFaces } from "@/src/utils";

import styles from "@/src/styles/live-webcam/webcam.module.css";

export default function Webcam() {
    const videoRef = useRef<any>(null);
    const canvasRef = useRef<any>(null);
    const captureCanvasRef = useRef<any>(null);
    const fpsRef = useRef<any>(30);

    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [model, setModel] = useState<any>(null);
    const [blazeModel, setBlazeModel] = useState<any>(null);
    const [isModelLoading, setIsModelLoading] = useState<boolean>(true);
    const [faces, setFaces] = useState<any[]>([]);

    useEffect(() => {
        (async () => {
            try {
                const faceModel = await blazeface.load();
                const loadedModels = await loadFaceAttributeModels();
                setBlazeModel(faceModel);
                setModel(loadedModels);
                setIsModelLoading(false);
            }
            catch (error) {
                console.error("Error loading BlazeFace model:", error);
                setError("Failed to load face detection model.");
                setIsModelLoading(false);            
            }
        })();
    }, []);
            

    function waitForVideo(video: HTMLVideoElement): Promise<void> {
        return new Promise<void>((resolve) => {
            if (video.readyState >= 2 && video.videoWidth > 0) {
                resolve();
            } else {
                video.onloadedmetadata = () => resolve();
            }
        });
    }
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

    async function runFaceAnalysis() {
        await wait(4000);

        await waitForVideo(videoRef.current);
        const video = videoRef.current;
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
        const displayWidth = video.clientWidth;
        const displayHeight = video.clientHeight;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
            
        canvas.width = displayWidth;
        canvas.height = displayHeight;

        analyze();

        async function analyze() {
            if(video.videoWidth == 0 || video.videoHeight == 0) return;

            const predictions = await blazeModel.estimateFaces(video, false);
            const face_details = await analyzeFaces(model, video, predictions);
            console.log(face_details)

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawMesh(ctx, displayWidth/videoWidth, displayHeight/videoHeight, predictions);     
            
            const faceCanvas = captureCanvasRef.current; const faceCtx = faceCanvas.getContext("2d"); 
            const streamFaces = getStreamFaces(faceCtx, faceCanvas, video, videoWidth, videoHeight, predictions); 
            setFaces(streamFaces);

            requestAnimationFrame(analyze);
        }
    }

    const startWebcam = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });
            const videoTrack = stream.getVideoTracks()[0];
            const settings = videoTrack.getSettings();
            fpsRef.current = settings.frameRate;
            setMediaStream(stream);
            
        } catch (err: any) {
            console.error("Error accessing webcam:", err);

            if (err.name === "NotAllowedError") {
                setError("Camera permission denied. Please allow access.");
            } else if (err.name === "NotFoundError") {
                setError("No webcam device found.");
            } else {
                setError("Unable to start webcam.");
            }
        }

    };

    const stopWebcam = useCallback(() => {
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
            setMediaStream(null);
            if (videoRef.current) videoRef.current.srcObject = null;
        }
    }, [mediaStream]);


    useEffect(() => {
         if (videoRef.current && mediaStream && !isModelLoading) {
             videoRef.current.srcObject = mediaStream;
             runFaceAnalysis();
         }
     }, [videoRef, isModelLoading, mediaStream]);

    return (
        <>
        <section className={styles.webcamSection}>
            <div className={styles.displayArea}>
                {mediaStream &&
                    <>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className={styles.videoFeed}
                        />
                        <div className={styles.liveBadge}>
                            <span className={styles.liveDot}></span>
                            Live
                        </div>
                        <div className={styles.fpsBadge}>
                            {fpsRef.current} FPS
                        </div>
                        <canvas ref={canvasRef} className={styles.overlayCanvas}/>
                        <canvas ref={captureCanvasRef} style={{ display: "none" }} />
                        {error && (
                            <div className={styles.errorBanner}>
                                {error}
                            </div>
                        )}
                    </>
                }
                {mediaStream && isModelLoading &&
                    <div className={styles.loadingState}>
                        <div className={styles.loaderContainer}>
                            <div className={styles.spinner}></div>
                            <div className={styles.loadingText}>
                            <h3>Loading Face Detection Model...</h3>
                            <p>Preparing AI model for real-time detection</p>
                            </div>
                        </div>
                    </div>
                }
                {!mediaStream &&
                    <>
                    <div className={styles.emptyState}>
                        <div className={styles.iconWrapper}>
                            <Radio size={48} />
                        </div>
                        <h2 className={styles.statusTitle}>Use Your Webcam</h2>
                        <p className={styles.statusDescription}>
                            Click below to start web stream
                        </p>
                    </div>
                    {error && (
                        <div className={styles.errorBanner}>
                            {error}
                        </div>
                    )}
                    </>
                }

            </div>

            <footer className={styles.actionControls}>
                {!mediaStream ? (
                    <button 
                        onClick={startWebcam} 
                        className={styles.btnPrimary}
                    >
                        <Play size={20} /> 
                        <span>Start Stream</span>
                    </button>
                ) : (
                    <button 
                        onClick={stopWebcam} 
                        className={styles.btnPrimary}
                    >
                        <Square size={20} /> 
                        <span>Stop</span>
                    </button>
                )}
            </footer>
        </section>
        <section className={styles.resultSection}>
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

        </section>
        </>
    );
}