'use client';

import { useState } from 'react';
import { User, ImageIcon, VideoIcon } from 'lucide-react';

import MediaGalleryDrawer from '@/src/components/media-gallery/MediaGalleryDrawer';
import styles from '@/src/styles/media-gallery/media-gallery-grid.module.css';

// ----------------------------------------------------------
// types
// ----------------------------------------------------------

interface MediaItem {
  id:                 number;
  media_type:         'image' | 'video';
  thumb_url:          string | null;
  original_filename:  string | null;
  face_count:         number | null;
  file_size:          number | null;
  duration_seconds:   number | null;
  width:              number | null;
  height:             number | null;
  inference_time_ms:  number | null;
  created_at:         string | null;
  status:             string | null;
  upload_type:        string | null;
}

interface Props {
  mediaList: MediaItem[];
  loading:   boolean;
  error:     any;
}

// ----------------------------------------------------------
// utils
// ----------------------------------------------------------

function formatFileSize(bytes: number | null): string {
  if (!bytes) return '—';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return '—';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatDimensions(w: number | null, h: number | null): string {
  if (!w || !h) return '—';
  return `${w}×${h}`;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr.replace(' ', 'T'));
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: diffDays > 365 ? 'numeric' : undefined });
}

function formatUploadType(type: string | null): string {
  if (!type) return '';
  return type.replace(/_/g, ' ');
}

// face badge variant
function faceBadgeClass(count: number | null): string {
  if (!count || count === 0) return styles.faceBadgeZero;
  if (count >= 10) return styles.faceBadgeHigh;
  return styles.faceBadgePositive;
}

// ----------------------------------------------------------
// sub-components
// ----------------------------------------------------------

function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonThumb} />
      <div className={styles.skeletonBody}>
        <div className={styles.skeletonLine} />
        <div className={`${styles.skeletonLine} ${styles.skeletonLineShort}`} />
        <div className={`${styles.skeletonLine} ${styles.skeletonLineXShort}`} />
      </div>
    </div>
  );
}

function MediaCard({ item, onClick }: { item: MediaItem; onClick: () => void }) {
  const isVideo  = item.media_type === 'video';
  const isError  = item.status === 'error';
  const faces    = item.face_count ?? 0;

  // Right-side chip: prefer inference_time for videos, filesize for images
  const rightChip = item.inference_time_ms
    ? `${item.inference_time_ms.toLocaleString()}ms`
    : formatFileSize(item.file_size);

  return (
    <article
      className={styles.card}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      {/* ── Thumbnail ── */}
      <div className={styles.thumb}>
        {item.thumb_url ? (
          isVideo ? (
            <video
              src={item.thumb_url}
              className={styles.thumbImg}
              muted
              playsInline
              preload="metadata"
              onMouseEnter={e => (e.currentTarget as HTMLVideoElement).play()}
              onMouseLeave={e => {
                const v = e.currentTarget as HTMLVideoElement;
                v.pause();
                v.currentTime = 0;
              }}
            />
          ) : (
            <img
              src={item.thumb_url}
              alt={item.original_filename || ''}
              className={styles.thumbImg}
            />
          )
        ) : (
          <div className={styles.thumbPlaceholder}>
            {isVideo
              ? <VideoIcon size={28} className={styles.thumbIcon} aria-hidden />
              : <ImageIcon size={28} className={styles.thumbIcon} aria-hidden />
            }
          </div>
        )}

        {/* type */}
        <span className={`${styles.typeBadge} ${isVideo ? styles.typeBadgeVideo : styles.typeBadgeImage}`}>
          {item.media_type}
        </span>

        {/* face count — always shown, styled by value */}
        <span className={`${styles.faceBadge} ${faceBadgeClass(item.face_count)}`}>
          <User size={9} aria-hidden />
          <span>{faces}</span>
        </span>

        {/* upload type — revealed on hover */}
        {item.upload_type && (
          <span className={styles.uploadTypeBadge}>
            {formatUploadType(item.upload_type)}
          </span>
        )}

        {isError && <div className={styles.errorOverlay} aria-label="Error processing" />}
      </div>

      {/* ── Body ── */}
      <div className={styles.cardBody}>
        <p className={styles.filename} title={item.original_filename || ''}>
          {item.original_filename || 'Untitled'}
        </p>

        <div className={styles.meta}>
          <span>
            {isVideo
              ? formatDuration(item.duration_seconds)
              : formatDimensions(item.width, item.height)
            }
          </span>
          <span className={styles.metaDot} aria-hidden>·</span>
          <span>{formatFileSize(item.file_size)}</span>
        </div>

        <div className={styles.footer}>
          <div className={styles.statusRow}>
            <span className={`${styles.statusDot} ${isError ? styles.statusDotError : styles.statusDotOk}`} />
            <span className={styles.dateLabel}>{formatDate(item.created_at)}</span>
          </div>
          <span className={styles.metaChip}>{rightChip}</span>
        </div>
      </div>
    </article>
  );
}

// ----------------------------------------------------------
// main
// ----------------------------------------------------------

const SKELETON_COUNT = 12;

export default function MediaGalleryGrid({ mediaList, loading, error }: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  if (error) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.grid}>
          <div className={styles.errorState}>
            <p>Failed to load media. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.grid}>
          {loading
            ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <SkeletonCard key={i} />
              ))
            : mediaList.length === 0
              ? (
                <div className={styles.emptyState}>
                  <ImageIcon size={36} className={styles.emptyIcon} aria-hidden />
                  <p className={styles.emptyTitle}>No media found</p>
                  <p className={styles.emptySubtitle}>Try adjusting your filters</p>
                </div>
              )
              : mediaList.map(item => (
                <MediaCard
                  key={`${item.media_type}-${item.id}`}
                  item={item}
                  onClick={() => setSelectedId(item.id)}
                />
              ))
          }
        </div>
      </div>

      {selectedId !== null && (
        <MediaGalleryDrawer
          id={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </>
  );
}