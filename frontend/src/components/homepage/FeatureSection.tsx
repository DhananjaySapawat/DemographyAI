import { Users, Gauge, Smile, Globe, Lock, Cpu } from 'lucide-react';
import styles from '@/src/styles/homepage/feature-section.module.css';

const features = [
  {
    title: "Multi-Face Detection",
    description: "Simultaneously detect and analyze multiple faces in a single image or video frame.",
    icon: Users,
  },
  {
    title: "Age Estimation",
    description: "Accurately predict age ranges with our advanced neural network trained on diverse datasets.",
    icon: Gauge,
  },
  {
    title: "Emotion Recognition",
    description: "Identify seven core emotions including happiness, sadness, anger, surprise, and more.",
    icon: Smile,
  },
  {
    title: "Ethnicity Analysis",
    description: "Respectfully analyze ethnic backgrounds with high accuracy and cultural sensitivity.",
    icon: Globe,
  },
  {
    title: "Privacy Focused",
    description: "All processing happens locally. We never store your images or personal data.",
    icon: Lock,
  },
  {
    title: "Lightning Fast",
    description: "Get results in under 100ms thanks to our optimized AI models and infrastructure.",
    icon: Cpu,
  },
];

export default function FeatureSection() {
  return (
    <section id="features" className={styles.featureSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>Features</span>
          <h2 className={styles.title}>Everything You Need</h2>
          <p className={styles.description}>
            Powerful capabilities built into every analysis, designed for accuracy and speed.
          </p>
        </div>

        <div className={styles.grid}>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className={styles.card}>
                <div className={styles.iconWrapper}>
                  <Icon size={24} strokeWidth={2} />
                </div>
                <h3 className={styles.cardTitle}>{feature.title}</h3>
                <p className={styles.cardText}>{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}