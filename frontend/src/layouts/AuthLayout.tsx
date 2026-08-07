import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight, Clock } from 'lucide-react';
import api from '../services/apiClient';
import type { Post, PaginatedResponse } from '../types';

// Fallback featured blog posts if API is loading or empty
const FALLBACK_POSTS = [
  {
    id: 'f1',
    title: 'Architectural Serenity: Designing Spaces in Harmony with Nature',
    slug: 'modern-architectural-masterpiece-villa',
    coverImage: {
      path: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80',
    },
    readingTime: 5,
    author: { name: 'Gopal' },
    categoryName: 'Architecture',
  },
  {
    id: 'f2',
    title: 'The Art of Minimalist Interior & Mountain Landscape Integration',
    slug: 'minimalist-landscape-harmony',
    coverImage: {
      path: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&w=1000&q=80',
    },
    readingTime: 4,
    author: { name: 'Elena Vance' },
    categoryName: 'Design',
  },
  {
    id: 'f3',
    title: 'Sunset Sanctuaries: Crafting Timeless Outdoor Living Havens',
    slug: 'outdoor-living-sanctuaries',
    coverImage: {
      path: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    },
    readingTime: 6,
    author: { name: 'Marcus Chen' },
    categoryName: 'Luxury Living',
  },
];

export default function AuthLayout() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Fetch real posts from API
  const { data } = useQuery({
    queryKey: ['auth-featured-posts'],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Post>>('/posts?limit=5');
      return data;
    },
  });

  const apiPosts = data?.data || [];
  
  // Format posts list with fallback
  const displayPosts = apiPosts.length > 0
    ? apiPosts.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        coverImage: p.coverImage?.path ? p.coverImage : { path: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80' },
        readingTime: p.readingTime || 5,
        author: p.author || { name: 'Gopal' },
        categoryName: p.categories?.[0]?.category?.name || 'Editorial',
      }))
    : FALLBACK_POSTS;

  const currentPost = displayPosts[currentIndex % displayPosts.length];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? displayPosts.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % displayPosts.length);
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 80px)',
        background: '#FAF8F5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
      }}
    >
      {/* Outer Floating Card Container Frame */}
      <div
        style={{
          width: '100%',
          maxWidth: '1020px',
          background: '#FFFFFF',
          borderRadius: '32px',
          padding: '24px',
          border: '1px solid #F1F1F1',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.07)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          alignItems: 'stretch',
        }}
        className="auth-floating-card"
      >
        {/* Left Side: Form Container */}
        <div
          style={{
            padding: '32px 28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Outlet />
        </div>

        {/* Right Side: Blog Image Card */}
        <div
          style={{
            position: 'relative',
            borderRadius: '24px',
            overflow: 'hidden',
            minHeight: '540px',
            background: '#2B2015',
            cursor: isHovered ? 'pointer' : 'default',
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => {
            if (isHovered) navigate(`/posts/${currentPost.slug}`);
          }}
        >
          {/* Background Blog Image */}
          <img
            src={currentPost.coverImage.path}
            alt={currentPost.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: isHovered ? 'scale(1.06)' : 'scale(1)',
            }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80'; }}
          />

          {/* Dark Overlay Gradient - Fades in ONLY on hover */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(15,12,9,0.92) 0%, rgba(15,12,9,0.45) 60%, rgba(0,0,0,0.15) 100%)',
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s ease',
              pointerEvents: 'none',
            }}
          />

          {/* Top Category Badge - Shows ONLY on hover */}
          <div
            style={{
              position: 'absolute',
              top: '24px',
              left: '24px',
              right: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              zIndex: 2,
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'translateY(0)' : 'translateY(-8px)',
              transition: 'all 0.3s ease',
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#FFFFFF',
                background: '#C89B3C',
                padding: '5px 12px',
                borderRadius: '9999px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
            >
              {currentPost.categoryName}
            </span>

            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#ffffff',
                background: 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(8px)',
                padding: '4px 10px',
                borderRadius: '9999px',
                border: '1px solid rgba(255,255,255,0.3)',
              }}
            >
              Featured Story
            </span>
          </div>

          {/* Bottom Card Content (Title, Meta, Read Button) - Shows ONLY on hover */}
          <div
            style={{
              position: 'absolute',
              bottom: '24px',
              left: '24px',
              right: '24px',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'translateY(0)' : 'translateY(14px)',
              transition: 'all 0.3s ease',
              pointerEvents: isHovered ? 'auto' : 'none',
              paddingBottom: '48px', // Space above carousel arrows
            }}
          >
            {/* Meta row: Author & Read Time */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#F2D9A1', fontWeight: 600 }}>
              <span>By {currentPost.author.name}</span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'rgba(255,255,255,0.85)' }}>
                <Clock style={{ width: '13px', height: '13px', color: '#C89B3C' }} />
                {currentPost.readingTime} min read
              </span>
            </div>

            {/* Blog Title */}
            <h3
              style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: '21px',
                fontWeight: 500,
                color: '#FFFFFF',
                lineHeight: '1.3',
                margin: 0,
                letterSpacing: '-0.01em',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)',
              }}
            >
              {currentPost.title}
            </h3>

            {/* Read Article Link */}
            <div style={{ paddingTop: '6px' }}>
              <Link
                to={`/posts/${currentPost.slug}`}
                onClick={(e) => e.stopPropagation()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#C89B3C',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
              >
                Read Article
                <ArrowUpRight
                  style={{
                    width: '16px',
                    height: '16px',
                    color: '#C89B3C',
                  }}
                />
              </Link>
            </div>
          </div>

          {/* Carousel Arrow Buttons - ALWAYS VISIBLE at bottom-left */}
          <div
            style={{
              position: 'absolute',
              bottom: '24px',
              left: '24px',
              display: 'flex',
              gap: '10px',
              zIndex: 10,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handlePrev}
              title="Previous Image"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                background: 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(8px)',
                color: '#ffffff',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#C89B3C';
                e.currentTarget.style.borderColor = '#C89B3C';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
              }}
            >
              ←
            </button>
            <button
              type="button"
              onClick={handleNext}
              title="Next Image"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                background: 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(8px)',
                color: '#ffffff',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#C89B3C';
                e.currentTarget.style.borderColor = '#C89B3C';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
              }}
            >
              →
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .auth-floating-card {
            grid-template-columns: 1fr !important;
          }
          .auth-floating-card > div:last-child {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
