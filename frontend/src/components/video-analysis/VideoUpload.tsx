"use client";
import { useState} from "react";
import { uploadVideo } from "@/src/lib/api";

import FileUpload from "@/src/components/ui/FileUpload";
import AnalysisResult from "@/src/components/ui/AnalysisResult";

import styles from '@/src/styles/image-analysis/image-upload.module.css';

export default function VideoUpload() {
    type Status = 'idle' | 'analyzing' | 'success' | 'error';

    const [videoResult, setVideoResult] = useState<any>(null);
    const [status, setStatus] = useState<Status>('idle');    
    const [error, setError] = useState<string | null>(null);

    const uploadFile= async (file : File) => {
        setStatus("analyzing"); 
        try {
            setError(null);
            const response = await uploadVideo(file);
            setVideoResult(response.result);
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
        setVideoResult(null);
        setStatus("idle");
    }

    return (
        <>
            <section className={styles.imageUploadSection}>
                <FileUpload uploadFile={uploadFile} changeFile={changeFile} status={status} upload_error={error} isVideo = {true} />
            </section>
            { (status == 'analyzing' || status == 'success') && <AnalysisResult analysisResult={videoResult} sourceType = "video"/> } 
        </>
    )
}