import MediaGallery from '../../components/common/MediaGallery';

export default function AdminMedia() {
  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-neutral-heading mb-6">
        Media Library
      </h1>

      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <MediaGallery />
      </div>
    </div>
  );
}
