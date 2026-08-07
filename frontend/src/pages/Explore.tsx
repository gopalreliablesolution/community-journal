import { useState, useEffect, useRef, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import api from '../services/apiClient';
import { PostSkeleton } from '../components/ui/Skeleton';
import type { Post, PaginatedResponse } from '../types';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Search } from 'lucide-react';

export default function Explore() {
  const [searchInput, setSearchInput] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['explore-posts', activeSearch],
    queryFn: async ({ pageParam = 1 }) => {
      const endpoint = activeSearch
        ? `/search?q=${encodeURIComponent(activeSearch)}&page=${pageParam}&limit=9`
        : `/posts?page=${pageParam}&limit=9`;
      const { data } = await api.get<PaginatedResponse<Post>>(endpoint);
      return data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.totalPages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  const posts = data?.pages.flatMap((page) => page.data) || [];
  const totalPosts = data?.pages[0]?.pagination.total || 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchInput.trim());
  };

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

  return (
    <div style={{ minHeight: '100vh', background: '#FAF8F5' }}>

      {/* ── HERO HEADER ── */}
      <div
        style={{
          paddingTop: '8px',
          paddingBottom: '4px',
          borderBottom: '1px solid #EFEFEF',
        }}
      >
        <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 60px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {/* Eyebrow */}
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#C89B3C',
              display: 'block',
            }}
          >
            Editorial Collection
          </span>

          {/* Title + Search row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '32px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px', flexWrap: 'wrap' }}>
              <h1
                style={{
                  fontFamily: 'Playfair Display, Georgia, serif',
                  fontSize: 'clamp(40px, 5vw, 64px)',
                  fontWeight: 500,
                  lineHeight: '1.1',
                  color: '#1A1A1A',
                  letterSpacing: '-0.02em',
                  margin: 0,
                }}
              >
                Explore{' '}
                <em style={{ fontStyle: 'italic', fontWeight: 400, color: '#6B6B6B' }}>Articles</em>
              </h1>
              {totalPosts > 0 && (
                <span
                  style={{
                    fontSize: '13px',
                    color: '#888888',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {totalPosts} article{totalPosts !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Search bar — inline with title */}
            <form onSubmit={handleSearch} style={{ flexShrink: 0, width: '380px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: '#ffffff',
                  border: '1.5px solid #E8E8E8',
                  borderRadius: '9999px',
                  padding: '6px 6px 6px 18px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#C89B3C';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(200,155,60,0.12)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#E8E8E8';
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)';
                }}
              >
                <Search style={{ width: '16px', height: '16px', color: '#AAAAAA', flexShrink: 0 }} />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search articles, topics, tags..."
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontSize: '13px',
                    color: '#1A1A1A',
                    minWidth: 0,
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #C89B3C, #8B6914)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '8px 18px',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'opacity 0.2s ease',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Active search tag */}
          {activeSearch && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '13px', color: '#888888' }}>Results for:</span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  background: 'rgba(200,155,60,0.1)',
                  border: '1px solid rgba(200,155,60,0.3)',
                  color: '#8B6914',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                "{activeSearch}"
                <button
                  onClick={() => { setActiveSearch(''); setSearchInput(''); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8B6914', fontSize: '16px', lineHeight: 1, padding: 0 }}
                >
                  ×
                </button>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── ARTICLES GRID ── */}
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '10px 60px 80px' }}>

        {isLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {[...Array(9)].map((_, i) => <PostSkeleton key={i} />)}
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#888888' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '24px', color: '#1A1A1A', marginBottom: '8px' }}>
              No articles found
            </h3>
            <p style={{ fontSize: '14px', color: '#888888' }}>
              {activeSearch ? `No results for "${activeSearch}". Try a different search.` : 'Check back later for new articles.'}
            </p>
          </div>
        ) : (
          <>
            {/* Featured first post — wide card */}
            {posts.length > 0 && !activeSearch && (() => {
              const featured = posts[0];
              const coverUrl = featured.coverImage?.path ||
                'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';
              return (
                <Link
                  to={`/posts/${featured.slug}`}
                  style={{ textDecoration: 'none', display: 'block', marginBottom: '48px' }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0',
                      borderRadius: '28px',
                      overflow: 'hidden',
                      background: '#ffffff',
                      boxShadow: '0 4px 32px rgba(0,0,0,0.07)',
                      transition: 'box-shadow 0.3s ease, transform 0.3s ease',
                      minHeight: '380px',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 48px rgba(0,0,0,0.12)';
                      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 32px rgba(0,0,0,0.07)';
                      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ overflow: 'hidden' }}>
                      <img
                        src={coverUrl}
                        alt={featured.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)')}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1)')}
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80'; }}
                      />
                    </div>
                    <div style={{ padding: '48px 48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                          <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C89B3C', background: 'rgba(200,155,60,0.1)', padding: '4px 10px', borderRadius: '9999px' }}>
                            Featured
                          </span>
                          {featured.categories?.[0]?.category && (
                            <span style={{ fontSize: '12px', color: '#888888', fontWeight: 500 }}>
                              {featured.categories[0].category.name}
                            </span>
                          )}
                        </div>
                        <h2
                          style={{
                            fontFamily: 'Playfair Display, Georgia, serif',
                            fontSize: '32px',
                            fontWeight: 500,
                            lineHeight: '1.2',
                            color: '#1A1A1A',
                            letterSpacing: '-0.02em',
                            marginBottom: '16px',
                          }}
                        >
                          {featured.title}
                        </h2>
                        <p style={{ fontSize: '15px', color: '#6B6B6B', lineHeight: '1.65', marginBottom: '24px' }}
                          className="line-clamp-3">
                          {featured.excerpt}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A' }}>
                            {featured.author.name}
                          </span>
                          <span style={{ fontSize: '12px', color: '#AAAAAA' }}>
                            {featured.readingTime} min read
                          </span>
                        </div>
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '10px 20px',
                            borderRadius: '9999px',
                            background: '#1A1A1A',
                            color: '#ffffff',
                            fontSize: '12px',
                            fontWeight: 600,
                          }}
                        >
                          Read Article
                          <ArrowUpRight style={{ width: '14px', height: '14px' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })()}

            {/* Posts grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px' }}>
              {(activeSearch ? posts : posts.slice(1)).map((post: Post) => {
                const coverUrl = post.coverImage?.path ||
                  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';
                return (
                  <Link
                    key={post.id}
                    to={`/posts/${post.slug}`}
                    style={{ textDecoration: 'none', display: 'block' }}
                  >
                    <div
                      style={{
                        background: '#ffffff',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
                        transition: 'box-shadow 0.25s ease, transform 0.25s ease',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
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
                        <img
                          src={coverUrl}
                          alt={post.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)')}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1)')}
                          onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'; }}
                        />
                      </div>

                      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                            <span style={{ fontSize: '12px', color: '#AAAAAA', fontWeight: 500 }}>
                              {post.readingTime} min read
                            </span>
                            {post.categories?.[0]?.category && (
                              <span
                                style={{
                                  fontSize: '11px',
                                  padding: '3px 10px',
                                  borderRadius: '9999px',
                                  background: 'rgba(200,155,60,0.08)',
                                  color: '#8B6914',
                                  fontWeight: 600,
                                  border: '1px solid rgba(200,155,60,0.2)',
                                }}
                              >
                                {post.categories[0].category.name}
                              </span>
                            )}
                          </div>

                          <h3
                            style={{
                              fontFamily: 'Playfair Display, Georgia, serif',
                              fontSize: '20px',
                              fontWeight: 500,
                              lineHeight: '1.3',
                              color: '#1A1A1A',
                              letterSpacing: '-0.01em',
                              marginBottom: '10px',
                            }}
                            className="line-clamp-2"
                          >
                            {post.title}
                          </h3>

                          <p
                            style={{ fontSize: '13px', color: '#6B6B6B', lineHeight: '1.6' }}
                            className="line-clamp-2"
                          >
                            {post.excerpt}
                          </p>
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingTop: '16px',
                            borderTop: '1px solid #F1F1F1',
                          }}
                        >
                          <span style={{ fontSize: '12px', color: '#888888', fontWeight: 500 }}>
                            By {post.author.name}
                          </span>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '12px',
                              fontWeight: 600,
                              color: '#C89B3C',
                            }}
                          >
                            Read more <ArrowUpRight style={{ width: '12px', height: '12px' }} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Loading more indicator */}
            <div ref={loadMoreRef} style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
              {isFetchingNextPage && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px', width: '100%' }}>
                  {[...Array(3)].map((_, i) => <PostSkeleton key={`loading-${i}`} />)}
                </div>
              )}
              {!hasNextPage && posts.length > 0 && (
                <p style={{ fontSize: '14px', color: '#AAAAAA', fontWeight: 500 }}>
                  You've reached the end — {totalPosts} article{totalPosts !== 1 ? 's' : ''} total
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
