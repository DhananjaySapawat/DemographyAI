"use client";
import {useState} from "react";
import FileUpload from "@/src/components/ui/FileUpload";
import ImageResult from "@/src/components/image-analysis/ImageResult";

import styles from '@/src/styles/image-analysis/image-upload.module.css';

export default function ImageUpload() {
    const [file, setFile] = useState(null);
    const [state, setState] = useState<'upload' | 'analyzing' | 'result'>('upload');
    const [error, setError] = useState<string | null>(null);
    return (
        <>
            <section className={styles.imageUploadSection}>
                <FileUpload file={file} setFile={setFile} state={state} setState={setState} uploadError={error} />
            </section>
            { (state == 'analyzing' || state == 'result') && file && <ImageResult file={file} state={state} setState={setState} setError={setError} /> } 
        </>
    )
}