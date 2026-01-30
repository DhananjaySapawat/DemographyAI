"use client";
import {useState} from "react";
import FileUpload from "@/src/components/ui/FileUpload";
import ImageResult from "@/src/components/image-analysis/ImageResult";

import styles from '@/src/styles/image-analysis/image-upload.module.css';

export default function ImageUpload() {
    const [file, setFile] = useState(null);
    const [analyze, setAnalyze] = useState(false);
    return (
        <>
            <section className={styles.imageUploadSection}>
                <FileUpload file={file} setFile={setFile} setAnalyze={setAnalyze}/>
            </section>
            { analyze && file && <ImageResult file={file} /> } 
        </>
    )
}