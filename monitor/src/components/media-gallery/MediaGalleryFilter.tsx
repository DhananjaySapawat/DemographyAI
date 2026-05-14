'use client';

import { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGet } from '@/src/hooks';
import { getMediaList } from '@/src/api';
import { LayoutGrid, Table, Search } from 'lucide-react';

import MediaGalleryGrid from '@/src/components/media-gallery/MediaGalleryGrid';
import MediaGalleryTable from '@/src/components/media-gallery/MediaGalleryTable';

import styles from '@/src/styles/media-gallery/media-gallery-filter.module.css';

// ----------------------------------------------------------
// constants
// ----------------------------------------------------------

const MEDIA_TABS  = ['all', 'image', 'video'];
const STATUS_OPTS = ['all', 'success', 'error', 'processing'];
const TYPE_OPTS   = ['all', 'image_upload', 'image_snapshot', 'video_upload'];
const FACE_OPTS   = [0, 1, 2, 3, 5];
const SORT_OPTS   = [
  { value: 'newest', label: 'Newest'      },
  { value: 'oldest', label: 'Oldest'      },
  { value: 'faces',  label: 'Most faces'  },
  { value: 'size',   label: 'File size'   },
  { value: 'slow',   label: 'Slowest'     },
];

// ----------------------------------------------------------
// helpers
// ----------------------------------------------------------

function applyFilters(data: any, { tab, search, status, type, minFaces, sort }: any) {
  let result = [...(data || [])];

  if (tab !== 'all')
    result = result.filter(item => item.media_type === tab);

  if (search)
    result = result.filter(item =>
      item.original_filename?.toLowerCase().includes(search.toLowerCase()) ||
      item.request_id?.toLowerCase().includes(search.toLowerCase())
    );

  if (status !== 'all')
    result = result.filter(item => item.status === status);

  if (type !== 'all')
    result = result.filter(item => item.upload_type === type);

  if (parseInt(minFaces) > 0)
    result = result.filter(item => (item.face_count || 0) >= parseInt(minFaces));

  result.sort((a, b) => {
    switch (sort) {
      case 'oldest': return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'faces':  return (b.face_count || 0) - (a.face_count || 0);
      case 'size':   return (b.file_size  || 0) - (a.file_size  || 0);
      case 'slow':   return (b.inference_time_ms || 0) - (a.inference_time_ms || 0);
      default:       return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  return result;
}

// ----------------------------------------------------------
// component
// ----------------------------------------------------------

export default function MediaGalleryFilter() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const { data, loading, error } = useGet(getMediaList, []);

  // read from URL — with defaults
  const tab      = searchParams.get('tab')      || 'all';
  const search   = searchParams.get('search')   || '';
  const status   = searchParams.get('status')   || 'all';
  const type     = searchParams.get('type')     || 'all';
  const minFaces = searchParams.get('minFaces') || '0';
  const sort     = searchParams.get('sort')     || 'newest';
  const view     = searchParams.get('view')     || 'gallery';

  // update a single param, keep the rest
  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  const filteredData = useMemo(
    () => applyFilters(data, { tab, search, status, type, minFaces, sort }),
    [data, tab, search, status, type, minFaces, sort]
  );

  console.log(filteredData)

  return (
    <>
      <section className={styles.filterCard}>
        <div className={styles.filterInner}>

          {/* ── Top row: tabs · search · view toggle ── */}
          <div className={styles.topRow}>

            {/* type tabs */}
            <div className={styles.tabGroup}>
              {MEDIA_TABS.map(t => (
                <button
                  key={t}
                  className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`}
                  onClick={() => setParam('tab', t)}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className={styles.divider} aria-hidden />

            {/* search */}
            <div className={styles.searchBox}>
              <Search size={14} className={styles.searchIcon} aria-hidden />
              <input
                type="text"
                placeholder="Search filename or request ID…"
                className={styles.searchInput}
                value={search}
                onChange={e => setParam('search', e.target.value)}
              />
            </div>

            {/* results count */}
            {!loading && (
              <span className={styles.resultsCount}>
                {filteredData.length} result{filteredData.length !== 1 ? 's' : ''}
              </span>
            )}

            <div className={styles.divider} aria-hidden />

            {/* view toggle */}
            <div className={styles.viewToggle}>
              <button
                className={`${styles.viewBtn} ${view === 'gallery' ? styles.viewBtnActive : ''}`}
                onClick={() => setParam('view', 'gallery')}
                aria-label="Gallery view"
              >
                <LayoutGrid size={14} aria-hidden />
              </button>
              <button
                className={`${styles.viewBtn} ${view === 'table' ? styles.viewBtnActive : ''}`}
                onClick={() => setParam('view', 'table')}
                aria-label="Table view"
              >
                <Table size={14} aria-hidden />
              </button>
            </div>

          </div>

          {/* ── Bottom row: filters ── */}
          <div className={styles.bottomRow}>

            <label className={styles.selectLabel}>
              Status
              <select
                className={styles.select}
                value={status}
                onChange={e => setParam('status', e.target.value)}
              >
                {STATUS_OPTS.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </label>

            <label className={styles.selectLabel}>
              Type
              <select
                className={styles.select}
                value={type}
                onChange={e => setParam('type', e.target.value)}
              >
                {TYPE_OPTS.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </label>

            <label className={styles.selectLabel}>
              Min faces
              <select
                className={styles.select}
                value={minFaces}
                onChange={e => setParam('minFaces', e.target.value)}
              >
                {FACE_OPTS.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </label>

            <label className={styles.selectLabel}>
              Sort
              <select
                className={styles.select}
                value={sort}
                onChange={e => setParam('sort', e.target.value)}
              >
                {SORT_OPTS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>

          </div>

        </div>
      </section>

      {view === 'gallery' ? (
        <MediaGalleryGrid
          mediaList={filteredData}
          loading={loading}
          error={error}
        />
      ) : (
        <MediaGalleryTable
          mediaList={filteredData}
          loading={loading}
          error={error}
        />
      )}
    </>
  );
}