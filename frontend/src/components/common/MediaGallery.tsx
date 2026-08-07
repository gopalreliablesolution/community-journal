import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Trash2, Search, Image, FileText, Film, Music } from 'lucide-react';
import { useState } from 'react';
import api from '../../services/apiClient';
import type { Media, PaginatedResponse } from '../../types';

interface Props {
  onSelect?: (media: Media) => void;
  selectionMode?: boolean;
}

const fileTypeIcons: Record<string, typeof Image> = {
  image: Image,
  document: FileText,
  video: Film,
  audio: Music,
};

export default function MediaGallery({ onSelect, selectionMode = false }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['media', 'list', searchQuery, filterType],
    queryFn: async () => {
      const res = await api.get<PaginatedResponse<Media>>('/media', {
        params: { q: searchQuery || undefined, type: filterType || undefined, limit: 50 },
      });
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/media/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      toast.success('Media deleted');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Delete failed');
    },
  });

  const media: Media[] = data?.data ?? [];

  const handleSelect = (item: Media) => {
    setSelectedId(item.id);
    onSelect?.(item);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#999' }} />
          <input
            type="text"
            placeholder="Search media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 36px',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: '#ffffff',
            }}
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{
            padding: '10px 12px',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none',
            backgroundColor: '#ffffff',
          }}
        >
          <option value="">All types</option>
          <option value="image">Images</option>
          <option value="document">Documents</option>
          <option value="video">Videos</option>
          <option value="audio">Audio</option>
        </select>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>Loading...</div>
      ) : media.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>No media found</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
          {media.map((item) => {
            const Icon = fileTypeIcons[item.type] || FileText;
            const isSelected = selectedId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => selectionMode && handleSelect(item)}
                style={{
                  position: 'relative',
                  border: isSelected ? '2px solid #C89B3C' : '1px solid #E5E7EB',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  cursor: selectionMode ? 'pointer' : 'default',
                  backgroundColor: '#F9FAFB',
                }}
              >
                {/* Preview */}
                <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6' }}>
                  {item.type === 'image' ? (
                    <img
                      src={`/storage/${item.path}`}
                      alt={item.originalName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80'; }}
                    />
                  ) : (
                    <Icon style={{ width: '32px', height: '32px', color: '#9CA3AF' }} />
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: '8px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.originalName}
                  </p>
                  <p style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>
                    {formatFileSize(item.size)}
                  </p>
                </div>

                {/* Delete button */}
                {!selectionMode && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Delete this media?')) {
                        deleteMutation.mutate(item.id);
                      }
                    }}
                    style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Trash2 style={{ width: '14px', height: '14px' }} />
                  </button>
                )}

                {/* Selected indicator */}
                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    top: '6px',
                    left: '6px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#C89B3C',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 700,
                  }}>
                    ✓
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
