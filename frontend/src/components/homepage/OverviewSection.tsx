import Link from 'next/link';
import Image from "next/image";
import { OverViewImage } from "@/src/assets";
import { ScanFace, ArrowRight, CircleCheck, Zap, CheckCircle } from 'lucide-react';
import styles from "@/src/styles/homepage/overview-section.module.css";

const OverviewSection = () => {
  const features = [
    "Detect multiple faces in single image",
    "Age estimation with high precision",
    "Gender classification",
    "Ethnicity recognition"
  ];

  return (
    <section className={styles.overviewSection}>

      <div className={styles.container}>
        <div className={styles.grid}>
          
          <div>
            <div className={styles.badge}>
              <ScanFace size={20} />
              <span>AI-Powered Face Analysis</span>
            </div>

            <h1 className={styles.title}>
              Analyze Faces <span className={styles.textGradient}>Like Never Before</span>
            </h1>

            <p className={styles.description}>
              Advanced AI that detects age, gender, ethnicity, and emotions with remarkable precision. 
              Upload, capture, or stream — we handle the rest.
            </p>
            <div className={styles.btnContainer}>
                <Link href="/image-analysis" className={styles.btnPrimary}>
                    Start Analyzing <ArrowRight size={20} />
                </Link>
                <a href="#features" className={styles.btnSecondary}>
                    Learn More
                </a>
            </div>
            <div className={styles.featureList}>
              {features.map((text, i) => (
                <div key={i} className={styles.featureItem}>
                  <CircleCheck className={styles.featureIcon} />
                  {text}
                </div>
              ))}
            </div>
          </div>

            <div className={styles.visualShowcase}>
                <div className={styles.visualFrame}>
                    <Image src={OverViewImage} alt="Face detection demo" className={styles.visualImage} />
                </div>

                <div className={`${styles.metricCard} ${styles.leftCard}`}>
                    <div className={styles.metricIconWrapper}>
                        <Zap className={styles.metricIcon} />
                    </div>
                    <div className={styles.metricContent}>
                        <p className={styles.metricLabel}>Processing</p>
                        <p className={styles.metricValue}>&lt;100ms</p>
                    </div>
                </div>
        
                <div className={`${styles.metricCard} ${styles.rightCard}`}>
                    <div className={styles.metricIconWrapper}>
                        <CheckCircle className={styles.metricIcon} />
                    </div>
                    <div className={styles.metricContent}>
                        <p className={styles.metricLabel}>Accuracy Rate</p>
                        <p className={styles.metricValue}>98.5%</p>
                    </div>
                </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default OverviewSection;