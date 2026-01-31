import { Calendar, User, Globe, Heart } from 'lucide-react';
import styles from '@/src/styles/ui/face-card.module.css';

export default function FaceCard({ faceDetails }: any) {
return (
    <div className={styles.cardGroup}>
      <div className={styles.imageWrapper}>
        <img 
          src={faceDetails.url}
          alt="Face 2" 
          className={styles.image}
          width={100}
          height={100}
        />
      </div>

      <div className={styles.detailsContent}>
        <div className={styles.header}>
          <span className={styles.title}>Face #2</span>
        </div>

        <div className={styles.infoList}>
          <div className={styles.infoItem}>
            <Calendar size={14} className={styles.icon} />
            <span className={styles.label}>Age:</span>
            <span className={styles.value}>{faceDetails.age_v1} years</span>
          </div>
          
          <div className={styles.infoItem}>
            <User size={14} className={styles.icon} />
            <span className={styles.label}>Gender:</span>
            <span className={styles.value}>{faceDetails.gender}</span>
          </div>

          <div className={styles.infoItem}>
            <Globe size={14} className={styles.icon} />
            <span className={styles.label}>Ethnicity:</span>
            <span className={styles.value}>{faceDetails.ethnicity}</span>
          </div>

          <div className={styles.infoItem}>
            <Heart size={14} className={styles.icon} />
            <span className={styles.label}>Emotion:</span>
            <span className={styles.value}>{faceDetails.emotion}</span>
          </div>
        </div>
      </div>
    </div>
  );
};