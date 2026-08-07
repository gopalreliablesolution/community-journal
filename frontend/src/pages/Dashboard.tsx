import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  FileText,
  Bookmark,
  Clock,
  PenLine,
  Heart,
  Trash2,
  Eye,
  Edit,
} from 'lucide-react';
import { useDashboard, useMyPosts, useMyDrafts } from '../features/profile/hooks';
import { useBookmarks } from '../features/bookmarks/hooks';
import { useDeletePost } from '../features/posts/hooks';
import { Badge } from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Pagination from '../components/ui/Pagination';
import { formatDate, formatNumber } from '../utils/formatters';

type DashboardView = 'overview' | 'posts' | 'drafts' | 'bookmarks';

export default function Dashboard() {
  const { '*': subRoute } = useParams();
  const [page, setPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState<{ id: string; title: string } | null>(null);

  const currentView: DashboardView = subRoute === 'posts' ? 'posts' : subRoute === 'drafts' ? 'drafts' : subRoute === 'bookmarks' ? 'bookmarks' : 'overview';

  const { data: dashboard, isLoading: dashboardLoading } = useDashboard();
  const { data: postsData } = useMyPosts(currentView === 'posts' ? page : 1, currentView === 'posts' ? 10 : 5);
  const { data: draftsData, isLoading: draftsLoading } = useMyDrafts(currentView === 'drafts' ? page : 1, currentView === 'drafts' ? 10 : 5);
  const { data: bookmarksData } = useBookmarks(currentView === 'bookmarks' ? page : 1, currentView === 'bookmarks' ? 10 : 5);
  const deletePost = useDeletePost();

  const handleDelete = () => {
    if (deleteModal) {
      deletePost.mutate(deleteModal.id, {
        onSuccess: () => setDeleteModal(null),
      });
    }
  };

  const navItems = [
    { view: 'overview' as DashboardView, label: 'Overview', path: '/dashboard' },
    { view: 'posts' as DashboardView, label: 'Published Posts', path: '/dashboard/posts' },
    { view: 'drafts' as DashboardView, label: 'Drafts', path: '/dashboard/drafts' },
    { view: 'bookmarks' as DashboardView, label: 'Bookmarks', path: '/dashboard/bookmarks' },
  ];

  const stats = [
    {
      label: 'Published',
      value: dashboard?.published ?? postsData?.pagination?.total ?? 0,
      icon: FileText,
    },
    {
      label: 'Drafts',
      value: dashboard?.drafts ?? draftsData?.pagination?.total ?? 0,
      icon: Clock,
    },
    {
      label: 'Bookmarks',
      value: dashboard?.recentBookmarks?.length ?? bookmarksData?.pagination?.total ?? 0,
      icon: Bookmark,
    },
    {
      label: 'Total Views',
      value: dashboard?.totalViews ?? 0,
      icon: Eye,
    },
    {
      label: 'Total Likes',
      value: dashboard?.totalLikes ?? 0,
      icon: Heart,
    },
  ];

  return (
    <div style={{ background: '#FAF8F5', minHeight: '88vh', padding: '40px 20px 80px' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
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
            Author Dashboard
          </h1>
          <Link
            to="/write"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '8px',
              background: '#C89B3C',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(200,155,60,0.3)',
            }}
          >
            <PenLine style={{ width: '16px', height: '16px' }} />
            Write New Article
          </Link>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', background: '#FFFFFF', padding: '6px', borderRadius: '12px', border: '1px solid #EFEFEF', flexWrap: 'wrap' }}>
          {navItems.map((item) => (
            <Link
              key={item.view}
              to={item.path}
              style={{
                flex: 1,
                minWidth: '120px',
                textAlign: 'center',
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '13.5px',
                fontWeight: 600,
                textDecoration: 'none',
                background: currentView === item.view ? '#C89B3C' : 'transparent',
                color: currentView === item.view ? '#FFFFFF' : '#6B6B6B',
                transition: 'all 0.2s ease',
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Overview View */}
        {currentView === 'overview' && (
          <>
            {/* Stats Cards Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '36px' }}>
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #EFEFEF',
                    padding: '24px 28px',
                    boxShadow: '0 2px 14px rgba(0,0,0,0.02)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'rgba(200, 155, 60, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#C89B3C',
                    }}
                  >
                    <stat.icon style={{ width: '22px', height: '22px' }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '28px', fontWeight: 700, color: '#1A1A1A', lineHeight: 1 }}>
                      {formatNumber(stat.value)}
                    </div>
                    <div style={{ fontSize: '13px', color: '#888888', marginTop: '6px', fontWeight: 500 }}>
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Split Content: Recent Posts + Drafts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '28px' }}>
              {/* Recent Posts */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '20px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>
                    Recent Articles
                  </h2>
                  <Link to="/dashboard/posts" style={{ color: '#C89B3C', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
                    View all →
                  </Link>
                </div>

                {dashboardLoading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[...Array(3)].map((_, i) => (
                      <div key={i} style={{ height: '70px', background: '#FFFFFF', borderRadius: '12px', opacity: 0.6 }} />
                    ))}
                  </div>
                ) : (dashboard?.recentPosts || postsData?.data) && (dashboard?.recentPosts?.length || postsData?.data?.length || 0) > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {(dashboard?.recentPosts || postsData?.data || []).slice(0, 5).map((post: any) => (
                      <div
                        key={post.id}
                        style={{
                          background: '#FFFFFF',
                          borderRadius: '12px',
                          border: '1px solid #EFEFEF',
                          padding: '16px 20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0, paddingRight: '12px' }}>
                          <Link
                            to={`/posts/${post.slug}`}
                            style={{
                              fontSize: '14.5px',
                              fontWeight: 600,
                              color: '#1A1A1A',
                              textDecoration: 'none',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: 'block',
                            }}
                          >
                            {post.title}
                          </Link>
                          <p style={{ fontSize: '12px', color: '#888888', margin: '4px 0 0 0' }}>
                            {formatDate(post.publishedAt || post.createdAt)}
                          </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#6B6B6B' }}>
                            <Heart style={{ width: '13px', height: '13px', color: '#DC3545' }} />
                            {post._count?.likes || 0}
                          </span>
                          <Badge variant="status" status={post.status}>{post.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #EFEFEF', padding: '32px 20px', textAlign: 'center' }}>
                    <p style={{ fontSize: '14px', color: '#6B6B6B', margin: 0 }}>No published posts yet.</p>
                  </div>
                )}
              </div>

              {/* Drafts */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '20px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>
                    Saved Drafts
                  </h2>
                  <Link to="/dashboard/drafts" style={{ color: '#C89B3C', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
                    View all →
                  </Link>
                </div>

                {draftsLoading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[...Array(3)].map((_, i) => (
                      <div key={i} style={{ height: '70px', background: '#FFFFFF', borderRadius: '12px', opacity: 0.6 }} />
                    ))}
                  </div>
                ) : draftsData?.data && draftsData.data.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {draftsData.data.map((post) => (
                      <div
                        key={post.id}
                        style={{
                          background: '#FFFFFF',
                          borderRadius: '12px',
                          border: '1px solid #EFEFEF',
                          padding: '16px 20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0, paddingRight: '12px' }}>
                          <Link
                            to={`/edit/${post.id}`}
                            style={{
                              fontSize: '14.5px',
                              fontWeight: 600,
                              color: '#1A1A1A',
                              textDecoration: 'none',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: 'block',
                            }}
                          >
                            {post.title || 'Untitled Draft'}
                          </Link>
                          <p style={{ fontSize: '12px', color: '#888888', margin: '4px 0 0 0' }}>
                            Last edited {formatDate(post.updatedAt)}
                          </p>
                        </div>
                        <Link
                          to={`/edit/${post.id}`}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            background: '#FAF8F5',
                            border: '1px solid #DADADA',
                            color: '#1A1A1A',
                            fontSize: '12px',
                            fontWeight: 600,
                            textDecoration: 'none',
                          }}
                        >
                          Edit Draft
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #EFEFEF', padding: '32px 20px', textAlign: 'center' }}>
                    <p style={{ fontSize: '14px', color: '#6B6B6B', margin: 0 }}>No drafts found.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Posts View */}
        {currentView === 'posts' && (
          <div>
            {postsData?.data && postsData.data.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {postsData.data.map((post) => (
                  <div key={post.id} style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #EFEFEF', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Link to={`/posts/${post.slug}`} style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '18px', fontWeight: 600, color: '#1A1A1A', textDecoration: 'none' }}>
                        {post.title}
                      </Link>
                      <p style={{ fontSize: '12px', color: '#888888', margin: '4px 0 0 0' }}>
                        {formatDate(post.publishedAt || post.createdAt)}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Link to={`/edit/${post.id}`} style={{ padding: '6px', color: '#6B6B6B' }} title="Edit">
                        <Edit size={16} />
                      </Link>
                      <button onClick={() => setDeleteModal({ id: post.id, title: post.title })} style={{ background: 'none', border: 'none', color: '#DC3545', cursor: 'pointer', padding: '6px' }} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EFEFEF', padding: '48px', textAlign: 'center' }}>
                <p style={{ fontSize: '14px', color: '#6B6B6B', margin: 0 }}>No published articles yet.</p>
              </div>
            )}

            {postsData?.pagination && postsData.pagination.totalPages > 1 && (
              <Pagination currentPage={page} totalPages={postsData.pagination.totalPages} onPageChange={setPage} className="mt-6" />
            )}
          </div>
        )}

        {/* Drafts View */}
        {currentView === 'drafts' && (
          <div>
            {draftsData?.data && draftsData.data.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {draftsData.data.map((post) => (
                  <div key={post.id} style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #EFEFEF', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Link to={`/edit/${post.id}`} style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '18px', fontWeight: 600, color: '#1A1A1A', textDecoration: 'none' }}>
                        {post.title || 'Untitled Draft'}
                      </Link>
                      <p style={{ fontSize: '12px', color: '#888888', margin: '4px 0 0 0' }}>
                        Last edited {formatDate(post.updatedAt)}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Link to={`/edit/${post.id}`} style={{ padding: '6px', color: '#6B6B6B' }} title="Edit">
                        <Edit size={16} />
                      </Link>
                      <button onClick={() => setDeleteModal({ id: post.id, title: post.title || 'Untitled Draft' })} style={{ background: 'none', border: 'none', color: '#DC3545', cursor: 'pointer', padding: '6px' }} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EFEFEF', padding: '48px', textAlign: 'center' }}>
                <p style={{ fontSize: '14px', color: '#6B6B6B', margin: 0 }}>No drafts found.</p>
              </div>
            )}

            {draftsData?.pagination && draftsData.pagination.totalPages > 1 && (
              <Pagination currentPage={page} totalPages={draftsData.pagination.totalPages} onPageChange={setPage} className="mt-6" />
            )}
          </div>
        )}

        {/* Bookmarks View */}
        {currentView === 'bookmarks' && (
          <div>
            {bookmarksData?.data && bookmarksData.data.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {bookmarksData.data.map((bookmark) => (
                  <div key={bookmark.id} style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #EFEFEF', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Link to={`/posts/${bookmark.post.slug}`} style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '18px', fontWeight: 600, color: '#1A1A1A', textDecoration: 'none' }}>
                        {bookmark.post.title}
                      </Link>
                      <p style={{ fontSize: '12px', color: '#888888', margin: '4px 0 0 0' }}>
                        by {bookmark.post.author.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EFEFEF', padding: '48px', textAlign: 'center' }}>
                <p style={{ fontSize: '14px', color: '#6B6B6B', margin: 0 }}>No bookmarks saved.</p>
              </div>
            )}

            {bookmarksData?.pagination && bookmarksData.pagination.totalPages > 1 && (
              <Pagination currentPage={page} totalPages={bookmarksData.pagination.totalPages} onPageChange={setPage} className="mt-6" />
            )}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Delete Article">
          <p style={{ fontSize: '14px', color: '#444444', marginBottom: '24px' }}>
            Are you sure you want to delete <strong>{deleteModal?.title}</strong>? This action cannot be undone.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button onClick={() => setDeleteModal(null)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #DADADA', background: '#FFFFFF', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer' }}>
              Cancel
            </button>
            <button onClick={handleDelete} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#DC3545', color: '#FFFFFF', fontSize: '13.5px', fontWeight: 700, cursor: 'pointer' }}>
              Delete Article
            </button>
          </div>
        </Modal>

      </div>
    </div>
  );
}
