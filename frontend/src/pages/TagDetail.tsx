import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowLeft, Tag as TagIcon } from 'lucide-react';
import { useTagDetail } from '../features/tags/hooks';
import { PostSkeleton } from '../components/ui/Skeleton';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef, useCallback } from 'react';
import type { Post, PaginatedResponse } from '../types';
import api from '../services/apiClient';

export default function TagDetail() {
  const { slug } = useParams<{ slug: string }>();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const { data: tag, isLoading: tagLoading } = useTagDetail(slug || '');

  const {
    data,
    isLoading: postsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['tag-posts', slug],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get<PaginatedResponse<Post>>(`/tags/${slug}/posts`, { params: { page: pageParam, limit: 9 } });
      return data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.totalPages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!slug,
  });

  const posts = data?.pages.flatMap((page) => page.data) || [];
  const meta = data?.pages[0]?.pagination || { total: 0, page: 1, totalPages: 1 };

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '200px',
      threshold: 0,
    });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [handleObserver]);

  if (tagLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#FAF8F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#888888', fontSize: '14px' }}>Loading...</div>
      </div>
    );
  }

  if (!tag) {
    return (
      <div style={{ minHeight: '100vh', background: '#FAF8F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '24px', color: '#1A1A1A', marginBottom: '8px' }}>
            Tag not found
          </h2>
          <Link to="/tags" style={{ color: '#C89B3C', fontSize: '14px', textDecoration: 'none' }}>
            Browse all tags
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAF8F5' }}>
      {/* Hero header */}
      <div style={{ paddingTop: '72px', paddingBottom: '48px', borderBottom: '1px solid #EFEFEF' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 60px' }}>
          <Link to="/categories" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#888888', textDecoration: 'none', marginBottom: '24px', transition: 'color 0.2s' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#C89B3C')} onMouseLeave={(e) => (e.currentTarget.style.color = '#888888')}>
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            Back to Categories & Tags
          </Link>
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C89B3C', display: 'block', marginBottom: '16px' }}>
            Tag
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
            <TagIcon style={{ width: '28px', height: '28px', color: '#C89B3C' }} />
            <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 500, lineHeight: '1.1', color: '#1A1A1A', letterSpacing: '-0.02em', margin: 0 }}>
              {tag.name}
            </h1>
          </div>
          <p style={{ fontSize: '15px', color: '#888888' }}>
            {meta.total} article{meta.total !== 1 ? 's' : ''} tagged with <strong style={{ color: '#1A1A1A' }}>#{tag.name}</strong>
          </p>
        </div>
      </div>

      {/* Posts grid */}
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '48px 60px 80px' }}>
        {postsLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px' }}>
            {[...Array(6)].map((_, i) => <PostSkeleton key={i} />)}
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#888888' }}>
            <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '24px', color: '#1A1A1A', marginBottom: '8px' }}>
              No articles yet
            </h3>
            <p style={{ fontSize: '14px' }}>Check back later for articles tagged #{tag.name}</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px' }}>
              {posts.map((post: any) => {
                const coverUrl = post.coverImage?.path ||
                  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';
                return (
                  <Link
                    key={post.id}
                    to={`/posts/${post.slug}`}
                    style={{ textDecoration: 'none', display: 'block' }}
                  >
                    <div style={{
                      background: '#ffffff', borderRadius: '20px', overflow: 'hidden',
                      boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
                      transition: 'box-shadow 0.25s ease, transform 0.25s ease',
                      height: '100%', display: 'flex', flexDirection: 'column',
                    }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
                        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 16px rgba(0,0,0,0.05)';
                        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                      }}
                    >
                      <div style={{ height: '200px', overflow: 'hidden' }}>
                        <img src={coverUrl} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'; }} />
                      </div>
                      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                            <span style={{ fontSize: '12px', color: '#AAAAAA', fontWeight: 500 }}>{post.readingTime} min read</span>
                            {post.categories?.[0]?.category && (
                              <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '9999px', background: 'rgba(200,155,60,0.08)', color: '#8B6914', fontWeight: 600, border: '1px solid rgba(200,155,60,0.2)' }}>
                                {post.categories[0].category.name}
                              </span>
                            )}
                          </div>
                          <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '20px', fontWeight: 500, lineHeight: '1.3', color: '#1A1A1A', marginBottom: '10px' }} className="line-clamp-2">
                            {post.title}
                          </h3>
                          <p style={{ fontSize: '13px', color: '#6B6B6B', lineHeight: '1.6' }} className="line-clamp-2">
                            {post.excerpt}
                          </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid #F1F1F1' }}>
                          <span style={{ fontSize: '12px', color: '#888888', fontWeight: 500 }}>By {post.author.name}</span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600, color: '#C89B3C' }}>
                            Read more <ArrowUpRight style={{ width: '12px', height: '12px' }} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Infinite scroll sentinel */}
            <div ref={loadMoreRef} style={{ height: '1px', width: '100%' }} />

            {isFetchingNextPage && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px', marginTop: '28px' }}>
                {[...Array(3)].map((_, i) => <PostSkeleton key={`more-${i}`} />)}
              </div>
            )}

            {!hasNextPage && posts.length > 0 && (
              <p style={{ textAlign: 'center', marginTop: '48px', color: '#AAAAAA', fontSize: '13px' }}>
                You've seen all articles tagged #{tag.name}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
