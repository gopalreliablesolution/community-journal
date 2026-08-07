import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Clock, ArrowLeft, Link as LinkIcon, Check, ArrowUpRight } from 'lucide-react';
import api from '../services/apiClient';
import { formatDate } from '../utils/formatters';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { PostSkeleton } from '../components/ui/Skeleton';
import CommentsSection from '../components/common/CommentsSection';
import LikeButton from '../components/common/LikeButton';
import BookmarkButton from '../components/common/BookmarkButton';
import SEO from '../components/seo/SEO';
import type { Post, PaginatedResponse } from '../types';

export default function PostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [copied, setCopied] = useState(false);

  // Fetch current post
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', slug],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: Post }>(`/posts/${slug}`);
      return data.data;
    },
    enabled: !!slug,
  });

  // Fetch related posts for sidebar
  const { data: relatedData } = useQuery({
    queryKey: ['related-posts', post?.id],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Post>>('/posts?limit=7');
      return data;
    },
    enabled: !!post?.id,
  });

  const relatedPosts = (relatedData?.data || []).filter((p) => p.slug !== slug);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    if (!post) return;
    const url = window.location.href;
    const text = `${post.title} - by ${post.author.name}`;
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        handleCopyLink();
        break;
    }
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#FAF8F5', padding: '60px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <PostSkeleton />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div style={{ minHeight: '100vh', background: '#FAF8F5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '24px', color: '#1A1A1A' }}>Post not found</p>
        <Link to="/explore" style={{ color: '#C89B3C', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
          ← Back to Articles
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={post.metaTitle || post.title}
        description={post.metaDescription || post.excerpt}
        image={post.coverImage?.path}
        type="article"
      />

      <div style={{ minHeight: '100vh', background: '#FAF8F5', color: '#1A1A1A' }}>

        {/* ── MAIN LAYOUT GRID: Left (Article) + Right (Sidebar) ── */}
        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            padding: '24px 24px 80px',
            display: 'grid',
            gridTemplateColumns: '1fr 380px',
            gap: '36px',
            alignItems: 'start',
          }}
          className="post-detail-grid"
        >

          {/* ── LEFT COLUMN: Article Content Card ── */}
          <article
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '36px 40px',
              border: '1px solid #EFEFEF',
              boxShadow: '0 2px 16px rgba(0,0,0,0.03)',
            }}
          >
            {/* Back Link */}
            <Link
              to="/explore"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#888888',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                marginBottom: '18px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#C89B3C')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#888888')}
            >
              <ArrowLeft style={{ width: '14px', height: '14px' }} />
              Back to Articles
            </Link>

            {/* Title */}
            <h1
              style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: 'clamp(30px, 3.5vw, 42px)',
                fontWeight: 500,
                lineHeight: '1.2',
                color: '#1A1A1A',
                letterSpacing: '-0.02em',
                marginBottom: '12px',
                marginTop: 0,
              }}
            >
              {post.title}
            </h1>

            {/* Meta Row: Author, Date, Reading time, Share */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                paddingBottom: '14px',
                borderBottom: '1px solid #EFEFEF',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <Avatar name={post.author.name} src={post.author.avatar?.path} size="sm" />
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#6B6B6B' }}>
                  <Link
                    to={`/users/${post.author.username}`}
                    style={{ fontWeight: 600, color: '#1A1A1A', textDecoration: 'none' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#C89B3C')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#1A1A1A')}
                  >
                    {post.author.name}
                  </Link>
                  <span>•</span>
                  <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                  {post.readingTime && (
                    <>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock style={{ width: '13px', height: '13px', color: '#C89B3C' }} />
                        {post.readingTime} min read
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Share icons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => handleShare('twitter')}
                  title="Share on X"
                  style={{
                    width: '34px', height: '34px', borderRadius: '50%',
                    border: '1px solid #E5E5E5', background: '#FFFFFF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: '#666666', transition: 'all 0.2s Ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#1A1A1A'; e.currentTarget.style.color = '#1A1A1A'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.color = '#666666'; }}
                >
                  <svg viewBox="0 0 24 24" style={{ width: '13px', height: '13px' }} fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  title="Share on Facebook"
                  style={{
                    width: '34px', height: '34px', borderRadius: '50%',
                    border: '1px solid #E5E5E5', background: '#FFFFFF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: '#666666', transition: 'all 0.2s Ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#1877F2'; e.currentTarget.style.color = '#1877F2'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.color = '#666666'; }}
                >
                  <svg viewBox="0 0 24 24" style={{ width: '13px', height: '13px' }} fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  title="Copy link"
                  style={{
                    width: '34px', height: '34px', borderRadius: '50%',
                    border: '1px solid #E5E5E5', background: '#FFFFFF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: copied ? '#28A745' : '#666666', transition: 'all 0.2s Ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#C89B3C'; e.currentTarget.style.color = '#C89B3C'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.color = copied ? '#28A745' : '#666666'; }}
                >
                  {copied ? <Check style={{ width: '13px', height: '13px' }} /> : <LinkIcon style={{ width: '13px', height: '13px' }} />}
                </button>
              </div>
            </div>

            {/* Featured Image */}
            {post.coverImage?.path && (
              <div
                style={{
                  width: '100%',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  marginBottom: '36px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                }}
              >
                <img
                  src={post.coverImage.path}
                  alt={post.title}
                  style={{
                    width: '100%',
                    maxHeight: '480px',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80';
                  }}
                />
              </div>
            )}

            {/* Categories */}
            {post.categories && post.categories.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                {post.categories.map(({ category }) => (
                  <Link key={category.id} to={`/categories/${category.slug}`} style={{ textDecoration: 'none' }}>
                    <Badge variant="category" categorySlug={category.slug}>{category.name}</Badge>
                  </Link>
                ))}
              </div>
            )}

            {/* Article Body */}
            <div
              className="prose prose-lg max-w-none"
              style={{
                color: '#222222',
                lineHeight: '1.8',
                fontSize: '16.5px',
              }}
              dangerouslySetInnerHTML={{ __html: post.contentHtml || '' }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  marginTop: '40px',
                  paddingTop: '28px',
                  borderTop: '1px solid #EFEFEF',
                }}
              >
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#888888', letterSpacing: '0.08em', textTransform: 'uppercase', alignSelf: 'center', marginRight: '6px' }}>
                  Tags:
                </span>
                {post.tags.map(({ tag }) => (
                  <Link key={tag.id} to={`/tags/${tag.slug}`} style={{ textDecoration: 'none' }}>
                    <Badge>{tag.name}</Badge>
                  </Link>
                ))}
              </div>
            )}

            {/* Actions: Likes & Bookmarks */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '28px',
                paddingTop: '20px',
                borderTop: '1px solid #EFEFEF',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <LikeButton postId={post.id} initialCount={post._count?.likes || 0} />
                <BookmarkButton postId={post.id} />
              </div>
            </div>

            {/* Author Card */}
            <div
              style={{
                marginTop: '40px',
                background: '#FFFFFF',
                borderRadius: '12px',
                padding: '28px 32px',
                border: '1px solid #EFEFEF',
                boxShadow: '0 2px 14px rgba(0,0,0,0.03)',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
              }}
            >
              <Avatar name={post.author.name} src={post.author.avatar?.path} size="lg" />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <Link
                    to={`/users/${post.author.username}`}
                    style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '18px', fontWeight: 600, color: '#1A1A1A', textDecoration: 'none' }}
                  >
                    {post.author.name}
                  </Link>
                  <Link
                    to={`/users/${post.author.username}`}
                    style={{
                      fontSize: '12px', fontWeight: 600, color: '#C89B3C', textDecoration: 'none',
                    }}
                  >
                    View profile →
                  </Link>
                </div>
                {post.author.bio && (
                  <p style={{ fontSize: '13.5px', color: '#6B6B6B', lineHeight: '1.5', margin: 0 }}>
                    {post.author.bio}
                  </p>
                )}
              </div>
            </div>

            {/* Comments Section */}
            <div
              style={{
                marginTop: '40px',
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '36px 32px',
                border: '1px solid #EFEFEF',
                boxShadow: '0 2px 14px rgba(0,0,0,0.03)',
              }}
            >
              <CommentsSection postId={post.id} />
            </div>
          </article>

          {/* ── RIGHT COLUMN: Related Posts Sidebar ── */}
          <aside
            style={{
              position: 'sticky',
              top: '100px',
            }}
          >
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '28px 24px',
                border: '1px solid #EFEFEF',
                boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
              }}
            >
              <h3
                style={{
                  fontFamily: 'Playfair Display, Georgia, serif',
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#1A1A1A',
                  marginTop: 0,
                  marginBottom: '20px',
                  paddingBottom: '12px',
                  borderBottom: '2px solid #C89B3C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>Related Posts</span>
                <span style={{ fontSize: '11px', color: '#888888', fontFamily: 'sans-serif', fontWeight: 500 }}>
                  Must Read
                </span>
              </h3>

              {/* Related Posts List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {relatedPosts.length > 0 ? (
                  relatedPosts.map((relPost) => (
                    <Link
                      key={relPost.id}
                      to={`/posts/${relPost.slug}`}
                      style={{ textDecoration: 'none', display: 'flex', gap: '14px', alignItems: 'center' }}
                      className="group"
                    >
                      {/* Thumbnail */}
                      <div
                        style={{
                          width: '76px',
                          height: '76px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          flexShrink: 0,
                          background: '#F1F1F1',
                        }}
                      >
                        <img
                          src={
                            relPost.coverImage?.path ||
                            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80'
                          }
                          alt={relPost.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease',
                          }}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            color: '#C89B3C',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            display: 'block',
                            marginBottom: '3px',
                          }}
                        >
                          {relPost.categories?.[0]?.category?.name || 'Story'}
                        </span>
                        <h4
                          style={{
                            fontFamily: 'Inter, system-ui, sans-serif',
                            fontSize: '13.5px',
                            fontWeight: 600,
                            lineHeight: '1.4',
                            color: '#1A1A1A',
                            margin: 0,
                            transition: 'color 0.2s ease',
                          }}
                          className="line-clamp-2"
                        >
                          {relPost.title}
                        </h4>
                        <span style={{ fontSize: '11px', color: '#AAAAAA', marginTop: '4px', display: 'block' }}>
                          {relPost.readingTime || 5} min read
                        </span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p style={{ fontSize: '13px', color: '#888888' }}>No related articles available.</p>
                )}
              </div>

              {/* View All Button */}
              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #F1F1F1' }}>
                <Link
                  to="/explore"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    width: '100%',
                    padding: '10px',
                    borderRadius: '9999px',
                    background: '#FAF8F5',
                    border: '1px solid #EFEFEF',
                    color: '#1A1A1A',
                    fontSize: '12px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#C89B3C';
                    e.currentTarget.style.color = '#C89B3C';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#EFEFEF';
                    e.currentTarget.style.color = '#1A1A1A';
                  }}
                >
                  Explore All Articles
                  <ArrowUpRight style={{ width: '13px', height: '13px' }} />
                </Link>
              </div>
            </div>
          </aside>

        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .post-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
