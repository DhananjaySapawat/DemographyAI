import MediaGalleryDetail from '@/src/components/media-gallery/MediaGalleryDetail';
export default async function MediaPage({ params }: any) {
  const { requestId } = await params;

  return (
    <MediaGalleryDetail requestId={requestId} />
  );
}