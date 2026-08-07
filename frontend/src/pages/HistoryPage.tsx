import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, Trash2, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/apiClient';
import { useClearHistory, useDeleteHistoryEntry } from '../features/profile/hooks';
import { formatDate } from '../utils/formatters';
import Pagination from '../components/ui/Pagination';
import type { Post, PaginatedResponse } from '../types';

export default function HistoryPage() {
  const [page, setPage] = useState(1);
  const clearHistory = useClearHistory();
  const deleteHistoryEntry = useDeleteHistoryEntry();

  const { data, isLoading } = useQuery({
    queryKey: ['history', page],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Post>>('/me/history', {
        params: { page, limit: 10 },
      });
      return data;
    },
  });

  return (
    <div style={{ background: '#FAF8F5', minHeight: '88vh', padding: '40px 20px 80px' }}>
      <div style={{ maxWidth: '840px', margin: '0 auto' }}>
        
        {/* Title Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', paddingBottom: '16px', borderBottom: '1px solid #EFEFEF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Clock style={{ width: '28px', height: '28px', color: '#C89B3C' }} />
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
              Reading History
            </h1>
          </div>
          {data?.data && data.data.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Clear all reading history? This cannot be undone.')) {
                  clearHistory.mutate();
                }
              }}
              disabled={clearHistory.isPending}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                border: '1px solid #DC3545',
                color: '#DC3545',
                fontSize: '13px',
                fontWeight: 600,
                cursor: clearHistory.isPending ? 'not-allowed' : 'pointer',
                padding: '8px 16px',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#DC3545';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#DC3545';
              }}
            >
              <Trash2 style={{ width: '14px', height: '14px' }} />
              Clear All
            </button>
          )}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ height: '100px', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EFEFEF', opacity: 0.6 }} />
            ))}
          </div>
        ) : data?.data && data.data.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {data.data.map((post) => (
              <div
                key={post.id}
                style={{ position: 'relative' }}
              >
                <Link
                  to={`/posts/${post.slug}`}
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <div
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
                  {post.coverImage && (
                    <img
                      src={post.coverImage.path}
                      alt={post.title}
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
                    <h3
                      style={{
                        fontFamily: 'Playfair Display, Georgia, serif',
                        fontSize: '19px',
                        fontWeight: 600,
                        color: '#1A1A1A',
                        marginTop: 0,
                        marginBottom: '6px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {post.title}
                    </h3>
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
                      {post.excerpt}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px', color: '#888888' }}>
                      <span style={{ fontWeight: 600, color: '#1A1A1A' }}>{post.author.name}</span>
                      <span>•</span>
                      <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                      {post.readingTime && (
                        <>
                          <span>•</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock style={{ width: '12px', height: '12px', color: '#C89B3C' }} />
                            {post.readingTime} min read
                          </span>
                        </>
                      )}
                    </div>
                    </div>
                  </div>
                </Link>
                {/* Delete entry button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    deleteHistoryEntry.mutate(post.id);
                  }}
                  title="Remove from history"
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: '#FFFFFF',
                    border: '1px solid #EFEFEF',
                    borderRadius: '8px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#888888',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                    zIndex: 10,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#DC3545';
                    e.currentTarget.style.color = '#DC3545';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#EFEFEF';
                    e.currentTarget.style.color = '#888888';
                  }}
                >
                  <X style={{ width: '14px', height: '14px' }} />
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
            <Eye style={{ width: '48px', height: '48px', color: '#DADADA', margin: '0 auto 16px' }} />
            <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '22px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>
              No Reading History
            </h2>
            <p style={{ fontSize: '14px', color: '#6B6B6B', marginBottom: '20px' }}>
              Articles you read will automatically be remembered here.
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
              Start Reading
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
