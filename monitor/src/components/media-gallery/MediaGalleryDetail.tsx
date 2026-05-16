'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, ArrowLeft } from 'lucide-react';

import { useGet } from '@/src/hooks';
import { getMediaById } from '@/src/api';
import styles from '@/src/styles/media-gallery/media-gallery-detail.module.css';

// ----------------------------------------------------------
// types
// ----------------------------------------------------------

interface Face {
  id:                   number;
  image_url:            string | null;
  face_index?:          number;
  frame_idx?:           number;
  age_v1:               string | null;
  age_v1_confidence:    number | null;
  age_v2:               string | null;
  age_v2_confidence:    number | null;
  gender:               string | null;
  gender_confidence:    number | null;
  ethnicity:            string | null;
  ethnicity_confidence: number | null;
  emotion:              string | null;
  emotion_confidence:   number | null;
}

interface MediaDetail {
  media_type:                 'image' | 'video';
  id:                         number;
  request_id:                 string | null;
  public_id?:                 string | null;
  original_filename:          string | null;
  mime_type:                  string | null;
  image_url?:                 string | null;
  image_hash?:                string | null;
  size?:                      number | null;
  file_size?:                 number | null;
  width?:                     number | null;
  height?:                    number | null;
  face_detection_time_ms?:    number | null;
  inference_time_ms?:         number | null;
  model_version?:             string | null;
  processed_image?:           { public_id: string; image_url: string } | null;
  video_url?:                 string | null;
  fps?:                       number | null;
  total_frames?:              number | null;
  duration_seconds?:          number | null;
  frames_with_faces?:         number | null;
  max_faces_in_frame?:        number | null;
  transcode_time_ms?:         number | null;
  status:                     string | null;
  error_message:              string | null;
  error_step:                 string | null;
  upload_type:                string | null;
  ip_address:                 string | null;
  user_agent?:                string | null;
  country_code?:              string | null;
  country_name:               string | null;
  state?:                     string | null;
  city:                       string | null;
  request_processing_time_ms: number | null;
  created_at:                 string | null;
  faces:                      Face[];
}

interface Props { requestId: string; }

// ----------------------------------------------------------
// utils
// ----------------------------------------------------------

function fmt(val: number | null | undefined, suffix = '') {
  if (val == null) return '—';
  return `${val.toLocaleString()}${suffix}`;
}

function fmtSize(bytes: number | null | undefined) {
  if (!bytes) return '—';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fmtDuration(s: number | null | undefined) {
  if (!s) return '—';
  const m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function fmtPct(v: number | null | undefined) {
  if (v == null) return '—';
  return `${Math.round(v * 100)}%`;
}

function fmtDate(s: string | null | undefined) {
  if (!s) return '—';
  return new Date(s.replace(' ', 'T')).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ----------------------------------------------------------
// sub-components
// ----------------------------------------------------------

function StatusBadge({ status }: { status: string | null }) {
  const cls = status === 'success' ? styles.ok
            : status === 'error'   ? styles.err
            : styles.neutral;
  return <span className={`${styles.badge} ${cls}`}>{status ?? '—'}</span>;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={styles.rowValue}>{value ?? '—'}</span>
    </div>
  );
}

function FaceAttrLine({ label, value, confidence, cap = true }: {
  label:      string;
  value:      string | null | undefined;
  confidence: number | null | undefined;
  cap?:       boolean;
}) {
  return (
    <div className={styles.faceAttrLine}>
      <span className={styles.faceAttrLabel}>{label}</span>
      <span className={`${styles.faceAttrValue} ${cap ? styles.cap : ''}`}>{value ?? '—'}</span>
      <span className={styles.faceAttrConf}>
        {confidence != null
          ? <span className={styles.confPill}>{fmtPct(confidence)}</span>
          : <span className={styles.confDash}>—</span>
        }
      </span>
    </div>
  );
}

function FaceCard({ face, index }: { face: Face; index: number }) {
  const idx   = face.face_index ?? face.frame_idx ?? index;
  const label = face.frame_idx != null ? `Frame ${face.frame_idx}` : `Face ${index + 1}`;
  return (
    <div className={styles.faceCard}>
      <div className={styles.faceImgWrap}>
        {face.image_url
          ? <img src={face.image_url} alt={label} className={styles.faceImg} />
          : <User size={22} className={styles.faceIcon} aria-hidden />
        }
        <span className={styles.faceIdx}>#{idx}</span>
      </div>
      <div className={styles.faceTable}>
        <div className={styles.faceTableHead}>
          <span>Attribute</span>
          <span>Value</span>
          <span>Conf.</span>
        </div>
        <FaceAttrLine label="Age V1"    value={face.age_v1}    confidence={face.age_v1_confidence}    cap={false} />
        <FaceAttrLine label="Age V2"    value={face.age_v2}    confidence={face.age_v2_confidence}    cap={false} />
        <FaceAttrLine label="Gender"    value={face.gender}    confidence={face.gender_confidence} />
        <FaceAttrLine label="Ethnicity" value={face.ethnicity} confidence={face.ethnicity_confidence} />
        <FaceAttrLine label="Emotion"   value={face.emotion}   confidence={face.emotion_confidence} />
      </div>
    </div>
  );
}

// ----------------------------------------------------------
// main
// ----------------------------------------------------------

export default function MediaGalleryDetail({ requestId }: Props) {
  const [showProcessed, setShowProcessed] = useState(false);
  const router = useRouter();

  const { data, loading, error } = useGet(getMediaById, [requestId]);
  const item    = data as MediaDetail | undefined;
  const isVideo = item?.media_type === 'video';
  const mediaSrc = showProcessed
    ? item?.processed_image?.image_url
    : (isVideo ? item?.video_url : item?.image_url);

  if (loading) return (
    <div className={styles.page}>
      <div className={styles.skeleton}>
        <div className={styles.skStrip} />
        <div className={styles.skMedia} />
        <div className={styles.skLines}>
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className={styles.skLine} />)}
        </div>
      </div>
    </div>
  );

  if (error || !item) return (
    <div className={styles.page}>
      <p className={styles.errState}>Failed to load media details. Please try again.</p>
    </div>
  );

  return (
    <div className={styles.page}>

      {/* ══ Top strip ══ */}
      <div className={styles.topStrip}>
        <div className={styles.topStripGrid} aria-hidden />
        <div className={styles.topInner}>
          <button className={styles.backBtn} onClick={() => router.back()} aria-label="Go back">
            <ArrowLeft size={14} strokeWidth={2.5} />
            Back
          </button>
          <div className={styles.topRow}>
            <h1 className={styles.filename}>{item.original_filename ?? 'Media detail'}</h1>
            <StatusBadge status={item.status} />
          </div>
          <div className={styles.chips}>
            <span className={styles.chip}>
              <span className={styles.chipLabel}>Type</span>{item.media_type}
            </span>
            <span className={styles.chip}>
              <span className={styles.chipLabel}>Uploaded</span>{fmtDate(item.created_at)}
            </span>
            <span className={styles.chip}>
              <span className={styles.chipLabel}>Size</span>{fmtSize(item.file_size ?? item.size)}
            </span>
            <span className={styles.chip}>
              <span className={styles.chipLabel}>Dimensions</span>
              {item.width && item.height ? `${item.width} × ${item.height}` : '—'}
            </span>
            <span className={styles.chip}>
              <span className={styles.chipLabel}>Faces</span>{item.faces?.length ?? 0}
            </span>
            <span className={styles.chip}>
              <span className={styles.chipLabel}>Inference</span>{fmt(item.inference_time_ms, ' ms')}
            </span>
            <span className={styles.chip}>
              <span className={styles.chipLabel}>Total time</span>{fmt(item.request_processing_time_ms, ' ms')}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.content}>

        {/* ══ Media ══ */}
        <div className={styles.mediaBlock}>
          {isVideo ? (
            <video src={mediaSrc ?? undefined} className={styles.media} controls playsInline preload="metadata" />
          ) : (
            <img src={mediaSrc ?? undefined} alt={item.original_filename ?? ''} className={styles.media} />
          )}
          {!isVideo && item.processed_image && (
            <div className={styles.toggle}>
              <button className={`${styles.tBtn} ${!showProcessed ? styles.tBtnActive : ''}`} onClick={() => setShowProcessed(false)}>
                Original
              </button>
              <button className={`${styles.tBtn} ${showProcessed ? styles.tBtnActive : ''}`} onClick={() => setShowProcessed(true)}>
                Processed
              </button>
            </div>
          )}
        </div>

        {/* ══ Metadata ══ */}
        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Metadata</h2>
          <div className={styles.metaGrid}>

            {/* File */}
            <div className={styles.metaGroup}>
              <p className={styles.groupTitle}>File</p>
              <Row label="MIME type"  value={item.mime_type} />
              <Row label="File size"  value={fmtSize(item.file_size ?? item.size)} />
              <Row label="Dimensions" value={item.width && item.height ? `${item.width} × ${item.height} px` : null} />
              {item.image_hash && (
                <Row label="Hash" value={<span className={styles.mono}>{item.image_hash}</span>} />
              )}
              {item.public_id && (
                <Row label="Public ID" value={<span className={styles.mono}>{item.public_id}</span>} />
              )}
            </div>

            {/* Processing */}
            <div className={styles.metaGroup}>
              <p className={styles.groupTitle}>Processing</p>
              <Row label="Model"     value={item.model_version} />
              <Row label="Inference" value={fmt(item.inference_time_ms, ' ms')} />
              {isVideo ? (
                <>
                  <Row label="Duration"         value={fmtDuration(item.duration_seconds)} />
                  <Row label="FPS"              value={fmt(item.fps)} />
                  <Row label="Total frames"     value={fmt(item.total_frames)} />
                  <Row label="Frames w/ faces"  value={fmt(item.frames_with_faces)} />
                  <Row label="Max faces/frame"  value={fmt(item.max_faces_in_frame)} />
                  <Row label="Transcode time"   value={fmt(item.transcode_time_ms, ' ms')} />
                </>
              ) : (
                <Row label="Face detect time" value={fmt(item.face_detection_time_ms, ' ms')} />
              )}
            </div>

            {/* Request */}
            <div className={styles.metaGroup}>
              <p className={styles.groupTitle}>Request</p>
              <Row label="Request ID"  value={<span className={styles.mono}>{item.request_id}</span>} />
              <Row label="Upload via"  value={item.upload_type?.replace(/_/g, ' ')} />
              <Row label="IP address"  value={<span className={styles.mono}>{item.ip_address}</span>} />
              <Row label="Country"     value={
                item.country_name
                  ? `${item.country_name}${item.country_code ? ` (${item.country_code})` : ''}`
                  : null
              } />
              <Row label="State"       value={item.state} />
              <Row label="City"        value={item.city} />
              <Row label="Total time"  value={fmt(item.request_processing_time_ms, ' ms')} />
              {item.user_agent && (
                <Row label="User agent" value={<span className={styles.mono}>{item.user_agent}</span>} />
              )}
              {item.error_step && (
                <Row label="Error step" value={item.error_step} />
              )}
              {item.error_message && (
                <Row label="Error message" value={<span className={styles.errText}>{item.error_message}</span>} />
              )}
            </div>

          </div>
        </section>

        {/* ══ Faces ══ */}
        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>
            Detected Faces
            {(item.faces?.length ?? 0) > 0 && (
              <span className={styles.faceBadge}>{item.faces.length}</span>
            )}
          </h2>
          {item.faces?.length > 0 ? (
            <div className={styles.faceList}>
              {item.faces.map((face, i) => (
                <FaceCard key={face.id} face={face} index={i} />
              ))}
            </div>
          ) : (
            <p className={styles.empty}>No faces detected in this media.</p>
          )}
        </section>

      </div>
    </div>
  );
}