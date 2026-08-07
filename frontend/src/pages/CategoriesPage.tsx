import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Folder, Hash, ArrowUpRight } from 'lucide-react';
import api from '../services/apiClient';
import type { Category, Tag, ApiResponse } from '../types';
import { CATEGORY_COLORS } from '../constants';

export default function CategoriesPage() {
  const [activeTab, setActiveTab] = useState<'categories' | 'tags'>('categories');

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Category[]>>('/categories');
      return data.data;
    },
  });

  const { data: tags, isLoading: tagsLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Tag[]>>('/tags');
      return data.data;
    },
  });

  return (
    <div style={{ minHeight: '100vh', background: '#FAF8F5' }}>

      {/* ── HERO HEADER ── */}
      <div
        style={{
          paddingTop: '72px',
          paddingBottom: '48px',
          paddingLeft: '60px',
          paddingRight: '60px',
          borderBottom: '1px solid #EFEFEF',
        }}
      >
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
          {/* Eyebrow */}
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#C89B3C',
              display: 'block',
              marginBottom: '16px',
            }}
          >
            Browse by Topic
          </span>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '32px', flexWrap: 'wrap' }}>
            {/* Combined title */}
            <h1
              style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: 'clamp(40px, 5vw, 60px)',
                fontWeight: 500,
                lineHeight: '1.1',
                color: '#1A1A1A',
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              Categories <em style={{ fontStyle: 'italic', fontWeight: 400, color: '#6B6B6B' }}>&amp; Tags</em>
            </h1>

            {/* Toggle switcher */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: '#ffffff',
                borderRadius: '9999px',
                padding: '4px',
                border: '1px solid #EFEFEF',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}
            >
              <button
                onClick={() => setActiveTab('categories')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 20px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: activeTab === 'categories' ? '#1A1A1A' : 'transparent',
                  color: activeTab === 'categories' ? '#ffffff' : '#888888',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <Folder style={{ width: '13px', height: '13px' }} />
                Categories
              </button>
              <button
                onClick={() => setActiveTab('tags')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 20px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: activeTab === 'tags' ? '#1A1A1A' : 'transparent',
                  color: activeTab === 'tags' ? '#ffffff' : '#888888',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <Hash style={{ width: '13px', height: '13px' }} />
                Tags
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTENT AREA ── */}
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '56px 60px 80px' }}>

        {/* ─── CATEGORIES TAB ─── */}
        {activeTab === 'categories' && (
          <>
            {categoriesLoading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} style={{ height: '160px', background: '#EFEFEF', borderRadius: '20px', animation: 'pulse 1.5s ease-in-out infinite' }} />
                ))}
              </div>
            ) : categories && categories.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                {categories.map((cat) => {
                  const colors = CATEGORY_COLORS[cat.slug] || { bg: '#F7EAD2', text: '#A67C1F', cover: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80' };
                  return (
                    <Link
                      key={cat.id}
                      to={`/categories/${cat.slug}`}
                      style={{ textDecoration: 'none', display: 'block' }}
                    >
                      <div
                        style={{
                          position: 'relative',
                          borderRadius: '20px',
                          overflow: 'hidden',
                          border: '1px solid #F1F1F1',
                          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                          transition: 'all 0.3s ease',
                          height: '200px',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.15)';
                          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                          const img = e.currentTarget.querySelector('img') as HTMLImageElement;
                          if (img) img.style.transform = 'scale(1.08)';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)';
                          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                          const img = e.currentTarget.querySelector('img') as HTMLImageElement;
                          if (img) img.style.transform = 'scale(1)';
                        }}
                      >
                        {/* Background image */}
                        <img
                          src={colors.cover}
                          alt={cat.name}
                          style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.4s ease',
                          }}
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                        />
                        {/* Dark overlay */}
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.65) 100%)',
                        }} />
                        {/* Content */}
                        <div style={{
                          position: 'relative',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          padding: '24px 28px',
                        }}>
                          <div style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            backdropFilter: 'blur(4px)',
                          }}>
                            <Folder style={{ width: '20px', height: '20px', color: colors.text }} />
                          </div>
                          <div>
                            <h3 style={{
                              fontFamily: 'Playfair Display, Georgia, serif',
                              fontSize: '22px',
                              fontWeight: 500,
                              color: '#ffffff',
                              marginBottom: '8px',
                              textShadow: '0 1px 4px rgba(0,0,0,0.3)',
                            }}>
                              {cat.name}
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              {cat._count && (
                                <span style={{
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  color: '#ffffff',
                                  background: 'rgba(255,255,255,0.2)',
                                  padding: '4px 10px',
                                  borderRadius: '9999px',
                                  backdropFilter: 'blur(4px)',
                                }}>
                                  {cat._count.posts} article{cat._count.posts !== 1 ? 's' : ''}
                                </span>
                              )}
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '12px',
                                fontWeight: 600,
                                color: 'rgba(255,255,255,0.9)',
                              }}>
                                Browse <ArrowUpRight style={{ width: '12px', height: '12px' }} />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '80px 0', color: '#888888' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📂</div>
                <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '20px', color: '#1A1A1A' }}>No categories found</p>
              </div>
            )}
          </>
        )}

        {/* ─── TAGS TAB ─── */}
        {activeTab === 'tags' && (
          <>
            {tagsLoading ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {[...Array(20)].map((_, i) => (
                  <div key={i} style={{ height: '36px', width: `${60 + Math.random() * 60}px`, background: '#EFEFEF', borderRadius: '9999px' }} />
                ))}
              </div>
            ) : tags && tags.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                {/* Tag cloud */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
                  {tags.map((tag, idx) => {
                    const size = tag._count?.posts ? Math.min(4, Math.ceil(tag._count.posts / 2)) : 1;
                    const fontSizes = ['13px', '14px', '16px', '18px', '20px'];
                    const paddings = ['6px 14px', '7px 16px', '8px 18px', '9px 20px', '10px 24px'];
                    const isAccent = idx % 7 === 0;
                    return (
                      <Link
                        key={tag.id}
                        to={`/tags/${tag.slug}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: paddings[size],
                            borderRadius: '9999px',
                            border: isAccent ? '1.5px solid #C89B3C' : '1.5px solid #E8E8E8',
                            background: isAccent ? 'rgba(200,155,60,0.06)' : '#ffffff',
                            color: isAccent ? '#8B6914' : '#444444',
                            fontSize: fontSizes[size],
                            fontWeight: isAccent ? 700 : 500,
                            transition: 'all 0.2s ease',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLDivElement).style.borderColor = '#C89B3C';
                            (e.currentTarget as HTMLDivElement).style.background = 'rgba(200,155,60,0.08)';
                            (e.currentTarget as HTMLDivElement).style.color = '#8B6914';
                            (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)';
                            (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px rgba(200,155,60,0.15)';
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLDivElement).style.borderColor = isAccent ? '#C89B3C' : '#E8E8E8';
                            (e.currentTarget as HTMLDivElement).style.background = isAccent ? 'rgba(200,155,60,0.06)' : '#ffffff';
                            (e.currentTarget as HTMLDivElement).style.color = isAccent ? '#8B6914' : '#444444';
                            (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                            (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
                          }}
                        >
                          <Hash style={{ width: '12px', height: '12px', opacity: 0.6 }} />
                          {tag.name}
                          {tag._count && (
                            <span style={{ fontSize: '11px', opacity: 0.6, marginLeft: '2px' }}>
                              {tag._count.posts}
                            </span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Alphabetical index */}
                <div>
                  <h2
                    style={{
                      fontFamily: 'Playfair Display, Georgia, serif',
                      fontSize: '24px',
                      fontWeight: 500,
                      color: '#1A1A1A',
                      marginBottom: '32px',
                      paddingBottom: '16px',
                      borderBottom: '1px solid #EFEFEF',
                    }}
                  >
                    All Tags <em style={{ fontStyle: 'italic', fontWeight: 400, color: '#AAAAAA' }}>A–Z</em>
                  </h2>

                  {(() => {
                    const grouped: Record<string, typeof tags> = {};
                    [...tags].sort((a, b) => a.name.localeCompare(b.name)).forEach((tag) => {
                      const letter = tag.name[0].toUpperCase();
                      if (!grouped[letter]) grouped[letter] = [];
                      grouped[letter].push(tag);
                    });
                    return Object.entries(grouped).map(([letter, letterTags]) => (
                      <div key={letter} style={{ display: 'flex', gap: '32px', marginBottom: '24px', alignItems: 'flex-start' }}>
                        <div
                          style={{
                            width: '36px',
                            flexShrink: 0,
                            fontFamily: 'Playfair Display, Georgia, serif',
                            fontSize: '28px',
                            fontWeight: 700,
                            color: '#C89B3C',
                            lineHeight: '1',
                            paddingTop: '4px',
                          }}
                        >
                          {letter}
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', flex: 1 }}>
                          {letterTags.map((tag) => (
                            <Link
                              key={tag.id}
                              to={`/tags/${tag.slug}`}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '5px 12px',
                                borderRadius: '9999px',
                                border: '1px solid #E8E8E8',
                                background: '#ffffff',
                                color: '#444444',
                                fontSize: '13px',
                                fontWeight: 500,
                                textDecoration: 'none',
                                transition: 'all 0.15s ease',
                              }}
                              onMouseEnter={(e) => {
                                (e.currentTarget as HTMLAnchorElement).style.borderColor = '#C89B3C';
                                (e.currentTarget as HTMLAnchorElement).style.color = '#8B6914';
                                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(200,155,60,0.06)';
                              }}
                              onMouseLeave={(e) => {
                                (e.currentTarget as HTMLAnchorElement).style.borderColor = '#E8E8E8';
                                (e.currentTarget as HTMLAnchorElement).style.color = '#444444';
                                (e.currentTarget as HTMLAnchorElement).style.background = '#ffffff';
                              }}
                            >
                              {tag.name}
                              {tag._count && <span style={{ fontSize: '11px', opacity: 0.5 }}>({tag._count.posts})</span>}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏷️</div>
                <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '20px', color: '#1A1A1A' }}>No tags found</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
