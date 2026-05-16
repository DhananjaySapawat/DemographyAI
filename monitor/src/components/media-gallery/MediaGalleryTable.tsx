'use client';

import Link from 'next/link';
import { ExternalLink, ImageIcon } from 'lucide-react';

import styles from '@/src/styles/media-gallery/media-gallery-table.module.css';

// ----------------------------------------------------------
// types
// ----------------------------------------------------------

interface MediaItem {
  id:                     number;
  media_type:             'image' | 'video';
  original_filename:      string | null;
  upload_type:            string | null;
  face_count:             number | null;
  file_size:              number | null;
  duration_seconds:       number | null;
  width:                  number | null;
  height:                 number | null;
  inference_time_ms:      number | null;
  created_at:             string | null;
  request_id:             string | null;
  status:                 string | null;
  ip_address:             string | null;
  country_name:           string | null;
  city:                   string | null;
  face_detection_time_ms?: number | null;
  fps?:                   number | null;
  transcode_time_ms?:     number | null;
}

interface Props {
  mediaList: MediaItem[];
  loading:   boolean;
  error:     any;
}

// ----------------------------------------------------------
// utils
// ----------------------------------------------------------

function fmtSize(bytes: number | null | undefined): string {
  if (!bytes) return '—';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fmtDuration(s: number | null | undefined): string {
  if (!s) return '—';
  const m   = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function fmtDate(s: string | null | undefined): string {
  if (!s) return '—';
  return new Date(s.replace(' ', 'T')).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function fmtMs(ms: number | null | undefined): string {
  if (ms == null) return '—';
  return `${ms.toLocaleString()}ms`;
}

function faceBadgeClass(count: number | null): string {
  if (!count || count === 0) return styles.faceCountZero;
  if (count >= 10)           return styles.faceCountHigh;
  return styles.faceCountPositive;
}

// ----------------------------------------------------------
// sub-components
// ----------------------------------------------------------

function TypeBadge({ type }: { type: 'image' | 'video' }) {
  return (
    <span className={`${styles.typeBadge} ${type === 'video' ? styles.typeBadgeVideo : styles.typeBadgeImage}`}>
      {type}
    </span>
  );
}

function StatusBadge({ status }: { status: string | null }) {
  const cls = status === 'success' ? styles.statusOk
            : status === 'error'   ? styles.statusErr
            : styles.statusOther;
  return (
    <span className={`${styles.statusBadge} ${cls}`}>
      {status ?? '—'}
    </span>
  );
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <tr key={i} className={styles.skeletonRow}>
          {Array.from({ length: 13 }).map((_, j) => (
            <td key={j}><div className={styles.skeletonCell} /></td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ----------------------------------------------------------
// main component
// ----------------------------------------------------------

export default function MediaGalleryTable({ mediaList, loading, error }: Props) {
  if (error) {
    return (
      <div className={styles.errorState}>
        <div className={styles.errorInner}>
          <p>Failed to load media. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.tableCard}>
        <table className={styles.table}>

          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>Type</th>
              <th className={styles.th}>Filename</th>
              <th className={styles.th}>Upload type</th>
              <th className={styles.th}>Dimensions / Duration</th>
              <th className={styles.th}>File size</th>
              <th className={styles.th}>Faces</th>
              <th className={styles.th}>Detect / Transcode</th>
              <th className={styles.th}>Inference</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th}>IP</th>
              <th className={styles.th}>Location</th>
              <th className={styles.th}>Created</th>
              <th className={styles.th}></th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <SkeletonRows />
            ) : mediaList.length === 0 ? (
              <tr>
                <td colSpan={13} className={styles.emptyState}>
                  <div className={styles.emptyInner}>
                    <ImageIcon size={32} className={styles.emptyIcon} aria-hidden />
                    <p className={styles.emptyTitle}>No media found</p>
                    <p className={styles.emptySubtitle}>Try adjusting your filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              mediaList.map(item => {
                const isVideo = item.media_type === 'video';
                const faces   = item.face_count ?? 0;
                return (
                  <tr key={`${item.media_type}-${item.id}`} className={styles.row}>

                    {/* type */}
                    <td className={styles.td}>
                      <TypeBadge type={item.media_type} />
                    </td>

                    {/* filename */}
                    <td className={`${styles.td} ${styles.tdFilename}`} title={item.original_filename ?? ''}>
                      {item.original_filename ?? '—'}
                    </td>

                    {/* upload type */}
                    <td className={styles.td}>
                      <span className={styles.uploadType}>
                        {item.upload_type?.replace(/_/g, ' ') ?? '—'}
                      </span>
                    </td>

                    {/* dimensions / duration */}
                    <td className={styles.td}>
                      {isVideo ? (
                        <>
                          {fmtDuration(item.duration_seconds)}
                          {item.fps != null && (
                            <span className={styles.subText}> · {item.fps.toFixed(0)} fps</span>
                          )}
                        </>
                      ) : (
                        item.width && item.height ? `${item.width} × ${item.height}` : '—'
                      )}
                    </td>

                    {/* file size */}
                    <td className={styles.td}>{fmtSize(item.file_size)}</td>

                    {/* faces */}
                    <td className={styles.td}>
                      <span className={`${styles.faceCount} ${faceBadgeClass(item.face_count)}`}>
                        {faces}
                      </span>
                    </td>

                    {/* face detect / transcode */}
                    <td className={styles.td}>
                      {isVideo ? fmtMs(item.transcode_time_ms) : fmtMs(item.face_detection_time_ms)}
                    </td>

                    {/* inference */}
                    <td className={styles.td}>{fmtMs(item.inference_time_ms)}</td>

                    {/* status */}
                    <td className={styles.td}>
                      <StatusBadge status={item.status} />
                    </td>

                    {/* IP */}
                    <td className={`${styles.td} ${styles.mono}`}>
                      {item.ip_address ?? '—'}
                    </td>

                    {/* location */}
                    <td className={styles.td}>
                      {[item.city, item.country_name].filter(Boolean).join(', ') || '—'}
                    </td>

                    {/* created */}
                    <td className={`${styles.td} ${styles.tdDate}`}>
                      {fmtDate(item.created_at)}
                    </td>

                    {/* view */}
                    <td className={styles.td}>
                      <Link
                        href={`/media-gallery/${item.request_id}`}
                        className={styles.viewBtn}
                        onClick={e => e.stopPropagation()}
                        aria-label={`View ${item.original_filename || 'item'}`}
                      >
                        View
                      </Link>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}