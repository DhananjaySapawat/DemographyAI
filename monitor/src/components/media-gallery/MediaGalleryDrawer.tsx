'use client';

import { useState, useEffect } from 'react';
import { X, User } from 'lucide-react';

import { useGet } from '@/src/hooks';
import { getMediaById } from '@/src/api';
import styles from '@/src/styles/media-gallery/media-gallery-drawer.module.css';

// ----------------------------------------------------------
// types
// ----------------------------------------------------------

interface Face {
  id:                   number;
  image_url:            string | null;
  face_index?:          number;
  frame_idx?:           number;
  face_idx?:            number;
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
  media_type:                  'image' | 'video';
  id:                          number;
  request_id:                  string | null;
  original_filename:           string | null;
  mime_type:                   string | null;
  image_url?:                  string | null;
  size?:                       number | null;
  width?:                      number | null;
  height?:                     number | null;
  face_count?:                 number | null;
  face_detection_time_ms?:     number | null;
  inference_time_ms?:          number | null;
  model_version?:              string | null;
  processed_image?:            { public_id: string; image_url: string } | null;
  video_url?:                  string | null;
  file_size?:                  number | null;
  fps?:                        number | null;
  total_frames?:               number | null;
  duration_seconds?:           number | null;
  faces_detected?:             number | null;
  frames_with_faces?:          number | null;
  max_faces_in_frame?:         number | null;
  transcode_time_ms?:          number | null;
  status:                      string | null;
  error_message:               string | null;
  error_step:                  string | null;
  upload_type:                 string | null;
  ip_address:                  string | null;
  country_name:                string | null;
  city:                        string | null;
  request_processing_time_ms:  number | null;
  created_at:                  string | null;
  faces:                       Face[];
}

interface Props {
  id:      number;
  onClose: () => void;
}

// ----------------------------------------------------------
// utils
// ----------------------------------------------------------

function fmt(val: number | null | undefined, suffix = ''): string {
  if (val == null) return '—';
  return `${val.toLocaleString()}${suffix}`;
}

function fmtSize(bytes: number | null | undefined): string {
  if (!bytes) return '—';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fmtDuration(s: number | null | undefined): string {
  if (!s) return '—';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function fmtConfidence(v: number | null | undefined): string {
  if (v == null) return '';
  return `${Math.round(v * 100)}%`;
}

function fmtDate(s: string | null | undefined): string {
  if (!s) return '—';
  return new Date(s.replace(' ', 'T')).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ----------------------------------------------------------
// sub-components
// ----------------------------------------------------------

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className={styles.metaRow}>
      <span className={styles.metaLabel}>{label}</span>
      <span className={styles.metaValue}>{value ?? '—'}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string | null }) {
  const isOk  = status === 'success';
  const isErr = status === 'error';
  return (
    <span className={`${styles.statusBadge} ${isOk ? styles.statusOk : isErr ? styles.statusErr : styles.statusOther}`}>
      {status ?? '—'}
    </span>
  );
}

function FaceChip({ face, index }: { face: Face; index: number }) {
  const frameLabel = face.frame_idx != null ? `Frame ${face.frame_idx}` : `Face ${index + 1}`;

  return (
    <div className={styles.faceChip}>
      <div className={styles.faceAvatar}>
        {face.image_url
          ? <img src={face.image_url} alt={frameLabel} className={styles.faceImg} />
          : <User size={14} className={styles.faceIcon} aria-hidden />
        }
      </div>
      <div className={styles.faceDetails}>
        <div className={styles.facePrimary}>
          {face.gender ?? '—'}
          {face.gender_confidence != null && (
            <span className={styles.conf}>{fmtConfidence(face.gender_confidence)}</span>
          )}
        </div>
        <div className={styles.faceSecondary}>
          {face.age_v2 ?? face.age_v1 ?? '—'}
          {' · '}
          {face.emotion ?? '—'}
          {face.emotion_confidence != null && (
            <span className={styles.conf}>{fmtConfidence(face.emotion_confidence)}</span>
          )}
        </div>
        {face.ethnicity && (
          <div className={styles.faceSecondary}>
            {face.ethnicity}
            {face.ethnicity_confidence != null && (
              <span className={styles.conf}>{fmtConfidence(face.ethnicity_confidence)}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------------
// main component
// ----------------------------------------------------------

const FACE_LIMIT = 20;

export default function MediaGalleryDrawer({ id, onClose }: Props) {
  const [showProcessed, setShowProcessed] = useState(false);

  const { data, loading, error } = useGet(getMediaById, [String(id)]);
  const item = data as MediaDetail | undefined;

  const isVideo    = item?.media_type === 'video';
  const previewUrl = showProcessed
    ? item?.processed_image?.image_url
    : (isVideo ? item?.video_url : item?.image_url);

  useEffect(() => { setShowProcessed(false); }, [id]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const facesToShow = item?.faces?.slice(0, FACE_LIMIT) ?? [];
  const extraFaces  = (item?.faces?.length ?? 0) - FACE_LIMIT;

  return (
    <>
      {/* backdrop */}
      <div className={styles.backdrop} onClick={onClose} aria-hidden />

      {/* drawer */}
      <aside className={styles.drawer} aria-label="Media detail">

        {/* ── Header ── */}
        <div className={styles.header}>
          <p className={styles.headerTitle} title={item?.original_filename ?? ''}>
            {loading ? 'Loading…' : (item?.original_filename ?? 'Media detail')}
          </p>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close drawer">
            <X size={15} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className={styles.body}>

          {/* Loading */}
          {loading && (
            <div className={styles.loadingState}>
              <div className={styles.skeletonPreview} />
              <div className={styles.skeletonLines}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className={styles.skeletonLine} />
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className={styles.errorState}>
              <p>Failed to load details. Please try again.</p>
            </div>
          )}

          {item && (
            <>
              {/* ── Preview ── */}
              <div className={styles.preview}>
                {isVideo ? (
                  <video
                    src={previewUrl ?? undefined}
                    className={styles.previewMedia}
                    controls
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <img
                    src={previewUrl ?? undefined}
                    alt={item.original_filename ?? ''}
                    className={styles.previewMedia}
                  />
                )}

                {!isVideo && item.processed_image && (
                  <div className={styles.previewToggle}>
                    <button
                      className={`${styles.toggleBtn} ${!showProcessed ? styles.toggleBtnActive : ''}`}
                      onClick={() => setShowProcessed(false)}
                    >
                      Original
                    </button>
                    <button
                      className={`${styles.toggleBtn} ${showProcessed ? styles.toggleBtnActive : ''}`}
                      onClick={() => setShowProcessed(true)}
                    >
                      Processed
                    </button>
                  </div>
                )}
              </div>

              {/* ── Request ── */}
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Request</h3>
                <MetaRow label="Status"      value={<StatusBadge status={item.status} />} />
                <MetaRow label="Request ID"  value={
                  <span className={styles.mono}>{item.request_id?.slice(0, 18)}…</span>
                } />
                <MetaRow label="Upload type" value={item.upload_type?.replace(/_/g, ' ')} />
                <MetaRow label="IP address"  value={item.ip_address} />
                <MetaRow label="Location"    value={
                  [item.city, item.country_name].filter(Boolean).join(', ') || null
                } />
                <MetaRow label="Created"     value={fmtDate(item.created_at)} />
                <MetaRow label="Total time"  value={fmt(item.request_processing_time_ms, 'ms')} />
                {item.error_message && (
                  <MetaRow label="Error" value={
                    <span className={styles.errorText}>{item.error_message}</span>
                  } />
                )}
              </section>

              {/* ── Media ── */}
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Media</h3>
                <MetaRow label="Dimensions" value={`${item.width ?? '—'} × ${item.height ?? '—'}`} />
                <MetaRow label="File size"  value={fmtSize(item.file_size ?? item.size)} />
                <MetaRow label="MIME type"  value={item.mime_type} />
                <MetaRow label="Model"      value={item.model_version} />
                <MetaRow label="Inference"  value={fmt(item.inference_time_ms, 'ms')} />

                {isVideo ? (
                  <>
                    <MetaRow label="Duration"         value={fmtDuration(item.duration_seconds)} />
                    <MetaRow label="FPS"              value={fmt(item.fps)} />
                    <MetaRow label="Total frames"     value={fmt(item.total_frames)} />
                    <MetaRow label="Frames w/ faces"  value={fmt(item.frames_with_faces)} />
                    <MetaRow label="Max faces/frame"  value={fmt(item.max_faces_in_frame)} />
                    <MetaRow label="Transcode time"   value={fmt(item.transcode_time_ms, 'ms')} />
                  </>
                ) : (
                  <MetaRow label="Face detect" value={fmt(item.face_detection_time_ms, 'ms')} />
                )}
              </section>

              {/* ── Faces ── */}
              <section className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  Faces
                  {(item.faces?.length ?? 0) > 0 && (
                    <span className={styles.faceCount}>{item.faces.length}</span>
                  )}
                </h3>

                {item.faces?.length > 0 ? (
                  <>
                    <div className={styles.faceList}>
                      {facesToShow.map((face, i) => (
                        <FaceChip key={face.id} face={face} index={i} />
                      ))}
                    </div>
                    {extraFaces > 0 && (
                      <p className={styles.moreText}>+{extraFaces} more faces</p>
                    )}
                  </>
                ) : (
                  <p className={styles.emptyText}>No faces detected</p>
                )}
              </section>
            </>
          )}
        </div>
      </aside>
    </>
  );
}