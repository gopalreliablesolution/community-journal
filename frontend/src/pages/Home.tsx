import { useState, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import api from '../services/apiClient';
import { PostSkeleton } from '../components/ui/Skeleton';
import type { Post, PaginatedResponse } from '../types';

export default function Home() {
  const [activeSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const articlesSectionRef = useRef<HTMLDivElement>(null);
  const [articlePage, setArticlePage] = useState(0);

  // Fetch posts from API
  const { data, isLoading, error } = useQuery({
    queryKey: ['posts', currentPage, activeSearch],
    queryFn: async () => {
      const endpoint = activeSearch
        ? `/posts?search=${encodeURIComponent(activeSearch)}&page=${currentPage}&limit=9`
        : `/posts?page=${currentPage}&limit=9`;
      const { data } = await api.get<PaginatedResponse<Post>>(endpoint);
      return data;
    },
  });

  // Fetch the latest post for the Hero button link
  const { data: latestPostData } = useQuery({
    queryKey: ['posts', 'latest-hero'],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Post>>('/posts?limit=1');
      return data;
    },
  });

  const posts = data?.data || [];
  const meta = data?.pagination || { total: 0, page: 1, totalPages: 1 };
  const latestPost = latestPostData?.data?.[0];



  const scrollToArticles = () => {
    if (articlesSectionRef.current) {
      const navbarHeight = 80;
      const elementPosition = articlesSectionRef.current.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navbarHeight;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  // Static tiles for Section 2 ("Our Articles") - 2 pages, each with exact 3-image / 3-article structure
  const staticTiles = [
    // --- PAGE 1 ---
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      alt: 'Luxury Pool Villa',
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
      alt: 'Aesthetic Minimal Interior',
    },
    {
      type: 'article',
      readTime: '8 Min',
      title: 'Top Trends Shaping Real Estate In 2024',
      excerpt: 'Stay ahead of the curve! Explore the latest trends influencing the real estate market this year.',
      slug: posts[0]?.slug || 'top-trends-shaping-real-estate-in-2024',
    },
    {
      type: 'article',
      readTime: '10 Min',
      title: 'The Ultimate Guide To First-Time Home Buying',
      excerpt: 'Are you a first-time homebuyer? Discover essential tips, from understanding the market to securing financing, to make your home-buying journey a breeze.',
      slug: posts[1]?.slug || 'the-ultimate-guide-to-first-time-home-buying',
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      alt: 'Dusk Modern Residence',
    },
    {
      type: 'article',
      readTime: '5 Min',
      title: "Investing In Real Estate: A Beginner's Guide",
      excerpt: 'Elevate your living space without breaking the bank. Uncover creative and cost-effective ways.',
      slug: posts[2]?.slug || 'investing-in-real-estate-a-beginners-guide',
    },

    // --- PAGE 2 (Identical 3-Image / 3-Article Layout Pattern) ---
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      alt: 'Glass Pavilion Villa',
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=800&q=80',
      alt: 'Nordic Wooden Chalet',
    },
    {
      type: 'article',
      readTime: '8 Min',
      title: posts[0]?.title || 'The Evolution Of Modern House Designs: Minimalism & Connectivity',
      excerpt: posts[0]?.excerpt || 'Step inside the architectural shift of 2026. Discover how clean geometries, floor-to-ceiling glass, and seamless natural integration define modern living.',
      slug: posts[0]?.slug || 'the-evolution-of-modern-house-designs-minimalism-connectivity',
    },
    {
      type: 'article',
      readTime: '10 Min',
      title: 'Creating Modern Landscape Architecture For Estate Gardens',
      excerpt: 'Explore stunning infinity pool surroundings, native drought-tolerant planting, and sculpted stone terraces.',
      slug: 'creating-modern-landscape-architecture',
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
      alt: 'Modern Penthouse Terrace',
    },
    {
      type: 'article',
      readTime: '7 Min',
      title: 'Sustainable Building Materials Shaping Luxury Homes',
      excerpt: 'How eco-conscious innovations like cross-laminated timber and solar integration are reshaping upscale architecture.',
      slug: 'sustainable-building-materials',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-text-body font-body selection:bg-gold/20 selection:text-gold-dark">

      {/* 1. HERO SECTION */}
      <section
        className="w-full flex flex-col justify-center min-h-[calc(100vh-80px)] py-4"
        style={{ paddingLeft: '60px', paddingRight: '60px' }}
      >
        <div
          className="relative rounded-[32px] overflow-hidden flex flex-col items-center justify-between p-6 md:p-12 text-center bg-stone-900 shadow-2xl w-full flex-1 max-h-[660px] min-h-[480px]"
        >

          {/* Background Image & Gradient Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transform transition-transform duration-1000"
            style={{
              backgroundImage: `url('${latestPost?.coverImage?.path || 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=2000&q=80'}')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/40" />

          {/* Spacer */}
          <div />

          {/* Centered Hero Content */}
          <div className="relative z-10 max-w-4xl mx-auto space-y-6 my-auto">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-white tracking-tight leading-[1.15]">
              {latestPost ? (
                <>
                  <span className="italic font-serif font-normal text-white text-lg sm:text-xl tracking-wide block mb-3" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>
                    Latest Article
                  </span>
                  {latestPost.title}
                </>
              ) : (
                <>
                  Check out Articles <br />
                  <span className="italic font-serif font-normal text-white">
                    we've written for you.
                  </span>
                </>
              )}
            </h1>

            <div className="pt-4 flex justify-center">
              <RouterLink
                to={latestPost ? `/posts/${latestPost.slug}` : '/explore'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#C89B3C',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: '700',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '12px 28px',
                  borderRadius: '9999px',
                  boxShadow: '0 4px 15px rgba(200, 155, 60, 0.35)',
                  textDecoration: 'none',
                  transition: 'all 0.25s ease',
                  fontFamily: 'Inter, sans-serif',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#b08530';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(200, 155, 60, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#C89B3C';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(200, 155, 60, 0.35)';
                }}
              >
                <span>READ ARTICLE</span>
                <ArrowUpRight className="w-4 h-4" />
              </RouterLink>
            </div>
          </div>

          {/* Unique Scroll to Explore Button */}
          <div
            className="relative z-10 flex flex-col items-center gap-2 text-white/80 hover:text-white transition-colors cursor-pointer group pt-4"
            onClick={scrollToArticles}
          >
            <div className="w-5 h-8 rounded-full border-2 border-white/70 group-hover:border-gold flex items-start justify-center p-1.5 transition-colors shadow-sm">
              <div className="w-1 h-2 bg-white group-hover:bg-gold rounded-full animate-bounce transition-colors" />
            </div>
            <span className="text-[10px] md:text-[11px] font-semibold tracking-widest uppercase text-white/90 group-hover:text-gold transition-colors">
              SCROLL TO EXPLORE
            </span>
          </div>

        </div>
      </section>
      <section className="w-full" style={{ paddingTop: '100px', paddingBottom: '120px', paddingLeft: '60px', paddingRight: '60px' }}>
        {/* Section Header & Navigation Arrows (Red Arrow 1: generous header gap) */}
        <div className="flex items-center justify-between mb-16">
          <h2 className="text-4xl md:text-5xl font-serif" style={{ color: '#1A1A1A' }}>
            Latest <span className="italic font-serif font-normal" style={{ color: '#1A1A1A' }}>Blog</span>
          </h2>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '9999px',
                backgroundColor: '#ffffff',
                border: '1px solid #E2E2E6',
                color: '#1A1A1A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#C89B3C';
                e.currentTarget.style.color = '#C89B3C';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E2E2E6';
                e.currentTarget.style.color = '#1A1A1A';
              }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(meta.totalPages || 1, p + 1))}
              disabled={currentPage >= (meta.totalPages || 1)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '9999px',
                backgroundColor: '#ffffff',
                border: '1px solid #E2E2E6',
                color: '#1A1A1A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#C89B3C';
                e.currentTarget.style.color = '#C89B3C';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E2E2E6';
                e.currentTarget.style.color = '#1A1A1A';
              }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Blog Post Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <PostSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-neutral-lightgray">
            <p className="text-status-error font-medium">Failed to load articles.</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-neutral-lightgray">
            <p className="text-text-secondary">No articles found matching your query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {posts.slice(0, 9).map((post) => {
              const coverUrl =
                post.coverImage?.path ||
                'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';

              return (
                <div
                  key={post.id}
                  className="flex flex-col justify-between min-h-[400px] py-1 px-1"
                >
                  <div>
                    {/* Post Cover Image (Red Arrow 2: clean 24px gap below image) */}
                    <div className="group relative rounded-[28px] overflow-hidden h-[240px] mb-6 shadow-2xs hover:shadow-xl transition-all duration-500">
                      <img
                        src={coverUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'; }}
                      />
                    </div>

                    {/* Read Time */}
                    <span style={{ fontSize: '13px', fontWeight: 500, color: '#888888', display: 'block', marginBottom: '10px', marginTop: '20px', paddingLeft: '4px' }}>
                      {post.readingTime || 8} Min
                    </span>

                    {/* Title (Red Arrow 3: exact serif font size & line-height) */}
                    <h3
                      style={{
                        color: '#1A1A1A',
                        fontFamily: 'Playfair Display, Georgia, serif',
                        fontSize: '27px',
                        fontWeight: 500,
                        lineHeight: '1.25',
                        letterSpacing: '-0.01em',
                        marginBottom: '14px',
                      }}
                      className="line-clamp-2"
                    >
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p style={{ color: '#6B6B6B', fontSize: '14px', lineHeight: '1.6', margin: '0 0 24px 0' }} className="line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Read More Pill Button */}
                  <div>
                    <RouterLink
                      to={`/posts/${post.slug}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 20px',
                        borderRadius: '9999px',
                        border: '1px solid #E0E0E0',
                        backgroundColor: '#ffffff',
                        color: '#1A1A1A',
                        fontSize: '13px',
                        fontWeight: 600,
                        textDecoration: 'none',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#C89B3C';
                        e.currentTarget.style.backgroundColor = '#FAF8F5';
                        e.currentTarget.style.color = '#C89B3C';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#E0E0E0';
                        e.currentTarget.style.backgroundColor = '#ffffff';
                        e.currentTarget.style.color = '#1A1A1A';
                      }}
                    >
                      <span>Read more</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-current transition-colors duration-200" />
                    </RouterLink>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Dynamic Pagination Controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '32px',
            marginBottom: '0px',
            padding: '0 32px',
          }}
        >
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={{
              color: currentPage === 1 ? '#BBBBBB' : '#1A1A1A',
              fontWeight: 600,
              fontSize: '14px',
              background: 'none',
              border: 'none',
              cursor: currentPage === 1 ? 'default' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 20px',
              borderRadius: '9999px',
              letterSpacing: '0.01em',
            }}
          >
            <span>←</span>
            <span>Previous</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 12px' }}>
            {Array.from({ length: meta.totalPages || 2 }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '9999px',
                  backgroundColor: currentPage === num ? '#C89B3C' : 'transparent',
                  color: currentPage === num ? '#ffffff' : '#1A1A1A',
                  fontWeight: 600,
                  fontSize: '14px',
                  border: currentPage === num ? 'none' : '1px solid transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: currentPage === num ? '0 2px 8px rgba(200, 155, 60, 0.35)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                {num}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(meta.totalPages || 2, p + 1))}
            disabled={currentPage >= (meta.totalPages || 2)}
            style={{
              color: currentPage >= (meta.totalPages || 2) ? '#BBBBBB' : '#C89B3C',
              fontWeight: 600,
              fontSize: '14px',
              background: 'none',
              border: 'none',
              cursor: currentPage >= (meta.totalPages || 2) ? 'default' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 20px',
              borderRadius: '9999px',
              letterSpacing: '0.01em',
            }}
          >
            <span>Next</span>
            <span>→</span>
          </button>
        </div>
      </section>

      {/* 2. "OUR ARTICLES" SECTION WITH 6-TILE GRID & SCROLL CONTROLS */}
      <section
        ref={articlesSectionRef}
        className="w-full flex flex-col justify-center min-h-[calc(100vh-80px)]"
        style={{ paddingTop: '24px', paddingBottom: '32px', paddingLeft: '60px', paddingRight: '60px' }}
      >
        {/* Section Header with Scroll Arrows */}
        <div className="flex items-center justify-between gap-6 mb-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif" style={{ color: '#1A1A1A' }}>
              Our <span className="italic font-serif font-normal" style={{ color: '#1A1A1A' }}>Articles</span>
            </h2>
          </div>

          {/* Chevron Navigation Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setArticlePage((prev) => (prev - 1 + Math.ceil(staticTiles.length / 6)) % Math.ceil(staticTiles.length / 6))}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '9999px',
                backgroundColor: '#ffffff',
                border: '1px solid #E2E2E6',
                color: '#1A1A1A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#C89B3C';
                e.currentTarget.style.color = '#C89B3C';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E2E2E6';
                e.currentTarget.style.color = '#1A1A1A';
              }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setArticlePage((prev) => (prev + 1) % Math.ceil(staticTiles.length / 6))}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '9999px',
                backgroundColor: '#ffffff',
                border: '1px solid #E2E2E6',
                color: '#1A1A1A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#C89B3C';
                e.currentTarget.style.color = '#C89B3C';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E2E2E6';
                e.currentTarget.style.color = '#1A1A1A';
              }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 6-Tile Asymmetric 12-Column Grid (exact 2-row layout matching Screenshot 3) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 transition-all duration-500">
          {staticTiles.slice(articlePage * 6, (articlePage + 1) * 6).map((tile, idx) => {
            // Determine column span based on tile position within the 6-tile set
            const colSpan = idx === 0 || idx === 3 ? 'lg:col-span-5' : idx === 1 || idx === 4 ? 'lg:col-span-3' : 'lg:col-span-4';

            if (tile.type === 'image') {
              return (
                <div
                  key={idx}
                  className={`${colSpan} group relative rounded-[24px] overflow-hidden h-[275px] shadow-2xs hover:shadow-xl transition-all duration-500 min-w-[240px] md:min-w-0`}
                >
                  <img
                    src={tile.url}
                    alt={tile.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              );
            }

            return (
              <div
                key={idx}
                className={`${colSpan} flex flex-col justify-start h-[275px] py-1 px-1 min-w-[260px] md:min-w-0`}
              >
                {/* Meta tag */}
                <span style={{ fontSize: '12px', fontWeight: 500, color: '#888888', display: 'block', marginBottom: '6px' }}>
                  {tile.readTime}
                </span>

                {/* Headline Title */}
                <h3
                  style={{
                    color: '#1A1A1A',
                    fontFamily: 'Playfair Display, Georgia, serif',
                    fontSize: '23px',
                    fontWeight: 500,
                    lineHeight: '1.2',
                    letterSpacing: '-0.01em',
                    marginBottom: '8px',
                  }}
                  className="line-clamp-2"
                >
                  {tile.title}
                </h3>

                {/* Description Paragraph */}
                <p style={{ color: '#6B6B6B', fontSize: '13px', lineHeight: '1.5', margin: '0 0 12px 0' }} className="line-clamp-3">
                  {tile.excerpt}
                </p>

                {/* Read More Pill Button */}
                <div>
                  <RouterLink
                    to={`/posts/${tile.slug}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '6px 18px',
                      borderRadius: '9999px',
                      border: '1px solid #E0E0E0',
                      backgroundColor: '#ffffff',
                      color: '#1A1A1A',
                      fontSize: '12px',
                      fontWeight: 600,
                      textDecoration: 'none',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#C89B3C';
                      e.currentTarget.style.backgroundColor = '#FAF8F5';
                      e.currentTarget.style.color = '#C89B3C';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#E0E0E0';
                      e.currentTarget.style.backgroundColor = '#ffffff';
                      e.currentTarget.style.color = '#1A1A1A';
                    }}
                  >
                    <span>Read more</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-current transition-colors duration-200" />
                  </RouterLink>
                </div>
              </div>
            );
          })}
        </div>
      </section>      {/* 3. LATEST BLOG CAROUSEL / GRID SECTION */}

      {/* 4. CALL TO ACTION GOLD BANNER */}
      <section className="w-full" style={{ paddingTop: '12px', paddingBottom: '40px', paddingLeft: '60px', paddingRight: '60px' }}>
        <div
          className="relative rounded-[36px] overflow-hidden text-center shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #8B6914 0%, #C89B3C 40%, #D4A848 65%, #B8860B 100%)',
            padding: '80px 60px 72px',
            minHeight: '280px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Subtle wavy line texture overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 80 Q50 60 100 80 Q150 100 200 80' stroke='white' stroke-width='1.5' fill='none'/%3E%3Cpath d='M0 120 Q50 100 100 120 Q150 140 200 120' stroke='white' stroke-width='1.5' fill='none'/%3E%3Cpath d='M0 40 Q50 20 100 40 Q150 60 200 40' stroke='white' stroke-width='1.5' fill='none'/%3E%3Cpath d='M0 160 Q50 140 100 160 Q150 180 200 160' stroke='white' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
              backgroundSize: '200px 200px',
            }}
          />

          {/* Radial soft vignette corners */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.18) 100%)',
            }}
          />

          <div className="relative z-10 flex flex-col items-center gap-6 max-w-3xl mx-auto">
            {/* Eyebrow label */}
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.2em',
                color: 'rgba(255,255,255,0.75)',
                textTransform: 'uppercase',
                display: 'block',
              }}
            >
              Luxury Landscape Design
            </span>

            {/* Main Headline */}
            <h2
              style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: 'clamp(32px, 4vw, 52px)',
                fontWeight: 500,
                lineHeight: '1.15',
                color: '#ffffff',
                letterSpacing: '-0.01em',
                margin: 0,
              }}
            >
              Your new beautiful{' '}
              <em style={{ fontStyle: 'italic', fontWeight: 400 }}>landscape awaits...</em>
            </h2>

            {/* Sub-tagline */}
            <p
              style={{
                fontSize: '15px',
                color: 'rgba(255,255,255,0.80)',
                lineHeight: '1.6',
                maxWidth: '440px',
                margin: '0 auto',
                fontWeight: 400,
              }}
            >
              Let's create an outdoor space that reflects your vision — timeless, refined, and uniquely yours.
            </p>

            {/* CTA Button */}
            <button
              onClick={() => {
                document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                marginTop: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 36px',
                borderRadius: '9999px',
                border: '2px solid rgba(255,255,255,0.9)',
                backgroundColor: 'transparent',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                backdropFilter: 'blur(4px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.color = '#8B6914';
                e.currentTarget.style.borderColor = '#ffffff';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.9)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span>Let's Connect</span>
              <span style={{ fontSize: '16px', lineHeight: 1 }}>→</span>
            </button>
          </div>
        </div>
      </section>


    </div>
  );
}
