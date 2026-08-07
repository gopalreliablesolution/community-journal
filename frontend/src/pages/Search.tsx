import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search as SearchIcon, Clock } from 'lucide-react';
import api from '../services/apiClient';
import { PostSkeleton } from '../components/ui/Skeleton';
import { Avatar } from '../components/ui/Avatar';
import Pagination from '../components/ui/Pagination';
import type { Post, PaginatedResponse } from '../types';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1');

  const { data, isLoading } = useQuery({
    queryKey: ['search', query, page],
    queryFn: async () => {
      if (!query) return null;
      const { data } = await api.get<PaginatedResponse<Post>>('/search', {
        params: { q: query, page, limit: 10 },
      });
      return data;
    },
    enabled: !!query,
  });

  const posts = data?.data || [];
  const meta = data?.pagination || { total: 0, page: 1, totalPages: 1 };

  return (
    <div style={{ minHeight: '100vh', background: '#FAF8F5' }}>
      {/* Header */}
      <div style={{ paddingTop: '8px', paddingBottom: '12px', borderBottom: '1px solid #EFEFEF' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 60px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C89B3C', display: 'block', marginBottom: '2px' }}>
            Results
          </span>
          <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '24px', fontWeight: 500, color: '#1A1A1A', margin: 0, lineHeight: '1.2' }}>
            {query ? (
              <>Results for "<em style={{ fontStyle: 'italic', color: '#6B6B6B' }}>{query}</em>"</>
            ) : (
              'Search articles'
            )}
          </h1>
          {query && (
            <p style={{ fontSize: '13px', color: '#888888', marginTop: '2px' }}>
              {isLoading ? 'Searching...' : `${meta.total} article${meta.total !== 1 ? 's' : ''} found`}
            </p>
          )}
        </div>
      </div>

      {/* Results */}
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '20px 60px 80px' }}>
        {query && (
          <>
            {isLoading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                {[...Array(6)].map((_, i) => <PostSkeleton key={i} />)}
              </div>
            ) : posts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: '#888888' }}>
                <SearchIcon style={{ width: '48px', height: '48px', margin: '0 auto 16px', opacity: 0.3 }} />
                <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '24px', color: '#1A1A1A', marginBottom: '8px' }}>
                  No results found
                </h3>
                <p style={{ fontSize: '14px' }}>Try different keywords.</p>
              </div>
            ) : (
              <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                  {posts.map((post: Post) => {
                    const coverUrl = post.coverImage?.path ||
                      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80';
                    return (
                      <Link
                        key={post.id}
                        to={`/posts/${post.slug}`}
                        style={{ textDecoration: 'none', display: 'block' }}
                      >
                        <div style={{
                          background: '#ffffff', borderRadius: '16px', overflow: 'hidden',
                          boxShadow: '0 2px 12px rgba(0,0,0,0.04)', border: '1px solid #F1F1F1',
                          transition: 'box-shadow 0.2s ease, transform 0.2s ease', height: '100%',
                          display: 'flex', flexDirection: 'column',
                        }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
                            (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)';
                            (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                          }}
                        >
                          <div style={{ height: '180px', overflow: 'hidden' }}>
                            <img src={coverUrl} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'; }} />
                          </div>
                          <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}>
                            <div>
                              {post.categories && post.categories.length > 0 && (
                                <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                                  {post.categories.slice(0, 2).map(({ category }) => (
                                    <span key={category.id} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '9999px', background: 'rgba(200,155,60,0.08)', color: '#8B6914', fontWeight: 600 }}>
                                      {category.name}
                                    </span>
                                  ))}
                                </div>
                              )}
                              <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '18px', fontWeight: 600, color: '#1A1A1A', marginBottom: '6px' }} className="line-clamp-2">
                                {post.title}
                              </h3>
                              <p style={{ fontSize: '13px', color: '#6B6B6B', lineHeight: '1.5' }} className="line-clamp-2">
                                {post.excerpt}
                              </p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #F1F1F1' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Avatar name={post.author.name} src={post.author.avatar?.path} size="sm" />
                                <span style={{ fontSize: '12px', color: '#888888' }}>{post.author.name}</span>
                              </div>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#AAAAAA' }}>
                                <Clock style={{ width: '12px', height: '12px' }} />
                                {post.readingTime || 5} min
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {meta.totalPages > 1 && (
                  <div style={{ marginTop: '48px' }}>
                    <Pagination
                      currentPage={meta.page}
                      totalPages={meta.totalPages}
                      onPageChange={(p) => setSearchParams({ q: query, page: String(p) })}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}

        {!query && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#888888' }}>
            <SearchIcon style={{ width: '56px', height: '56px', margin: '0 auto 16px', opacity: 0.25 }} />
            <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '28px', color: '#1A1A1A', marginBottom: '8px' }}>
              Search articles
            </h2>
            <p style={{ fontSize: '14px' }}>Use the search bar above to find articles</p>
          </div>
        )}
      </div>
    </div>
  );
}
