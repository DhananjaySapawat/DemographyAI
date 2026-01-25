import Link from "next/link";
import Image from "next/image";
import { Upload, Camera, Video, Radio, ArrowUpRight } from 'lucide-react';
import { UploadImage, CaptureImage, VideoImage, WebcamImage } from "@/src/assets";
import styles from '@/src/styles/homepage/analyze-section.module.css';

const methods = [
  {
    title: "Upload Image",
    description: "Drag and drop or select photos from your device for instant facial analysis with detailed insights.",
    image: UploadImage,
    icon: <Upload className={styles.icon} size={20} />,
    href: "/image-analysis"
  },
  {
    title: "Capture Photo",
    description: "Use your camera to take a quick snapshot and receive real-time analysis results.",
    image: CaptureImage,
    icon: <Camera className={styles.icon} size={20} />,
    href: "/camera-capture"
  },
  {
    title: "Video Analysis",
    description: "Upload video clips to analyze facial expressions across frames with timeline tracking.",
    image: VideoImage,
    icon: <Video className={styles.icon} size={20} />,
    href: "/video-analysis"
  },
  {
    title: "Live Webcam",
    description: "Stream real-time facial detection and emotion analysis directly from your webcam.",
    image: WebcamImage,
    icon: <Radio className={styles.icon} size={20} />,
    href: "/live-webcam"
  }
];

export default function AnalyzeSection() {
  return (
    <section className={styles.analyzeSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>Methods</span>
          <h2 className={styles.title}>
            Choose How to <span className={styles.gradientText}>Analyze</span>
          </h2>
          <p className={styles.subtitle}>
            Multiple ways to analyze faces — pick the method that works best for your needs.
          </p>
        </div>

        <div className={styles.grid}>
          {methods.map((method, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.imageWrapper}>
                <Image src={method.image} alt={method.title} className={styles.image} />
                <div className={styles.imageOverlay} />
                <div className={styles.iconWrapper}>
                  <div className={styles.iconContainer}>
                    {method.icon}
                  </div>
                </div>
              </div>

              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{method.title}</h3>
                <p className={styles.cardDescription}>{method.description}</p>
                <Link href={method.href} className={styles.cta}>
                  <span className={styles.ctaText}>Try this method</span>
                  <ArrowUpRight className={styles.ctaIcon} size={16} />
                </Link>
              </div>
              
              <div className={styles.hoverOverlay} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};