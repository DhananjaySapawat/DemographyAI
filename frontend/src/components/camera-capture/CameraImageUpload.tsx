"use client";
import { useState} from "react";
import { uploadSnapshot } from "@/src/lib/api";

import CameraStream from "@/src/components/camera-capture/CameraStream";
import AnalysisResult from "@/src/components/ui/AnalysisResult";

import styles from '@/src/styles/image-analysis/image-upload.module.css';

export default function ImageUpload() {
    type Status = 'idle' | 'analyzing' | 'success' | 'error';

    const [imageResult, setImageResult] = useState<any>(null);
    const [status, setStatus] = useState<Status>('idle');    
    const [error, setError] = useState<string | null>(null);

    const uploadFile= async (file : File) => {
        setStatus("analyzing"); 
        try {
            setError(null);
            const response = await uploadSnapshot(file);
            setImageResult(response.result);
            setStatus("success"); 

        } catch (err) {
            console.error(err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Something went wrong. Please try again.");
            }
            setStatus("error");
        } 
    }

    const changeFile = () => {
        setImageResult(null);
        setStatus("idle");
    }

    return (
        <>
            <section className={styles.imageUploadSection}>
                <CameraStream uploadFile={uploadFile} changeFile={changeFile} status={status} upload_error={error} />
            </section>
            { (status == 'analyzing' || status == 'success') && <AnalysisResult analysisResult={imageResult} /> } 
        </>
    )
}