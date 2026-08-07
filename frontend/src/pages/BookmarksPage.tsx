import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Trash2, Clock } from 'lucide-react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useBookmarks } from '../features/bookmarks/hooks';
import { bookmarksApi } from '../features/bookmarks/api';
import { formatDate } from '../utils/formatters';
import Pagination from '../components/ui/Pagination';
import type { BookmarkItem } from '../features/bookmarks/api';

export default function BookmarksPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useBookmarks(page, 10);
  const queryClient = useQueryClient();

  const removeBookmark = useMutation({
    mutationFn: (postId: string) => bookmarksApi.toggle(postId, true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      toast.success('Bookmark removed');
    },
  });

  const handleRemoveBookmark = (postId: string) => {
    removeBookmark.mutate(postId);
  };

  return (
    <div style={{ background: '#FAF8F5', minHeight: '88vh', padding: '40px 20px 80px' }}>
      <div style={{ maxWidth: '840px', margin: '0 auto' }}>
        
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px', paddingBottom: '16px', borderBottom: '1px solid #EFEFEF' }}>
          <Bookmark style={{ width: '28px', height: '28px', color: '#C89B3C' }} />
          <h1
            style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: '32px',
              fontWeight: 600,
              color: '#1A1A1A',
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            Saved Bookmarks
          </h1>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ height: '110px', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EFEFEF', opacity: 0.6 }} />
            ))}
          </div>
        ) : data?.data && data.data.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {data.data.map((bookmark: BookmarkItem) => (
              <div
                key={bookmark.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #EFEFEF',
                  padding: '20px 24px',
                  boxShadow: '0 2px 14px rgba(0,0,0,0.02)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.06)';
                  e.currentTarget.style.borderColor = '#C89B3C';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 14px rgba(0,0,0,0.02)';
                  e.currentTarget.style.borderColor = '#EFEFEF';
                }}
              >
                {bookmark.post.coverImage && (
                  <img
                    src={bookmark.post.coverImage.path}
                    alt={bookmark.post.title}
                    style={{
                      width: '84px',
                      height: '84px',
                      objectFit: 'cover',
                      borderRadius: '10px',
                      flexShrink: 0,
                    }}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80'; }}
                  />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link
                    to={`/posts/${bookmark.post.slug}`}
                    style={{
                      fontFamily: 'Playfair Display, Georgia, serif',
                      fontSize: '19px',
                      fontWeight: 600,
                      color: '#1A1A1A',
                      textDecoration: 'none',
                      display: 'block',
                      marginBottom: '6px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {bookmark.post.title}
                  </Link>
                  <p
                    style={{
                      fontSize: '13.5px',
                      color: '#6B6B6B',
                      lineHeight: '1.5',
                      margin: '0 0 10px 0',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {bookmark.post.excerpt}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px', color: '#888888' }}>
                    <span style={{ fontWeight: 600, color: '#1A1A1A' }}>{bookmark.post.author.name}</span>
                    <span>•</span>
                    <span>{formatDate(bookmark.post.publishedAt || bookmark.post.createdAt)}</span>
                    {bookmark.post.readingTime && (
                      <>
                        <span>•</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock style={{ width: '12px', height: '12px', color: '#C89B3C' }} />
                          {bookmark.post.readingTime} min read
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveBookmark(bookmark.post.id)}
                  title="Remove bookmark"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#888888',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#DC3545')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#888888')}
                >
                  <Trash2 style={{ width: '18px', height: '18px' }} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #EFEFEF',
              padding: '60px 20px',
              textAlign: 'center',
              boxShadow: '0 2px 14px rgba(0,0,0,0.02)',
            }}
          >
            <Bookmark style={{ width: '48px', height: '48px', color: '#DADADA', margin: '0 auto 16px' }} />
            <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '22px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>
              No Bookmarks Saved
            </h2>
            <p style={{ fontSize: '14px', color: '#6B6B6B', marginBottom: '20px' }}>
              Save stories while browsing to read them anytime later.
            </p>
            <Link
              to="/explore"
              style={{
                display: 'inline-block',
                padding: '12px 26px',
                borderRadius: '8px',
                background: '#C89B3C',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '14px',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(200,155,60,0.3)',
              }}
            >
              Explore Articles
            </Link>
          </div>
        )}

        {data?.pagination && data.pagination.totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={data.pagination.totalPages}
            onPageChange={setPage}
            className="mt-8"
          />
        )}
      </div>
    </div>
  );
}
