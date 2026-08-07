import { Link } from 'react-router-dom';
import { Users, FileText, Eye, MessageCircle, TrendingUp, ArrowUpRight, Clock, Heart } from 'lucide-react';
import { useAdminStats } from '../../features/admin/hooks';
import { formatNumber, formatDate } from '../../utils/formatters';
import { Badge } from '../../components/ui/Badge';
import Loader from '../../components/ui/Loader';

export default function AdminDashboard() {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) {
    return <Loader size="lg" className="min-h-[400px]" />;
  }

  if (!stats) return null;

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: '#3B82F6', bg: '#EFF6FF', sub: `+${stats.newUsersToday || 0} today` },
    { label: 'Total Posts', value: stats.totalPosts, icon: FileText, color: '#C89B3C', bg: '#FFFBEB', sub: null },
    { label: 'Published', value: stats.totalPublished, icon: Eye, color: '#22C55E', bg: '#F0FDF4', sub: null },
    { label: 'Drafts', value: stats.totalDrafts, icon: FileText, color: '#6B7280', bg: '#F9FAFB', sub: null },
    { label: 'Comments', value: stats.totalComments, icon: MessageCircle, color: '#A855F7', bg: '#FAF5FF', sub: null },
    { label: 'Total Views', value: stats.totalViews, icon: TrendingUp, color: '#0EA5E9', bg: '#F0F9FF', sub: null },
  ];

  return (
    <div style={{ padding: '0', minHeight: '100vh', background: '#F8F9FA' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', marginBottom: '4px', fontFamily: 'Inter, sans-serif' }}>
          Dashboard
        </h1>
        <p style={{ fontSize: '14px', color: '#6B7280' }}>Welcome back! Here's what's happening with your blog.</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {statCards.map((stat) => (
          <div
            key={stat.label}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: stat.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <stat.icon size={24} style={{ color: stat.color }} />
              </div>
              {stat.sub && (
                <span style={{ fontSize: '12px', color: '#22C55E', fontWeight: 600, background: '#F0FDF4', padding: '4px 8px', borderRadius: '9999px' }}>
                  {stat.sub}
                </span>
              )}
            </div>
            <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px', fontWeight: 500 }}>{stat.label}</p>
            <p style={{ fontSize: '32px', fontWeight: 700, color: '#111827', lineHeight: 1 }}>{formatNumber(stat.value)}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Recent Posts */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          overflow: 'hidden',
        }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: 0 }}>Recent Posts</h2>
            <Link to="/admin/posts" style={{ fontSize: '13px', color: '#C89B3C', textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
              View all <ArrowUpRight size={14} />
            </Link>
          </div>
          <div style={{ padding: '8px 0' }}>
            {stats.recentPosts?.map((post: any, idx: number) => (
              <div
                key={post.id}
                style={{
                  padding: '16px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  borderBottom: idx < (stats.recentPosts?.length || 0) - 1 ? '1px solid #F3F4F6' : 'none',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#F9FAFB')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link to={`/posts/${post.slug}`} style={{ fontSize: '14px', fontWeight: 600, color: '#111827', textDecoration: 'none', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {post.title}
                  </Link>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                    <span style={{ fontSize: '12px', color: '#6B7280' }}>{post.author.name}</span>
                    <Badge variant="status" status={post.status} className="text-xs">{post.status}</Badge>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
                  <span style={{ fontSize: '12px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Eye size={12} /> {formatNumber(post._count?.views || 0)}
                  </span>
                  <span style={{ fontSize: '12px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Heart size={12} /> {post._count?.likes || 0}
                  </span>
                  <span style={{ fontSize: '12px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MessageCircle size={12} /> {post._count?.comments || 0}
                  </span>
                </div>
              </div>
            ))}
            {(!stats.recentPosts || stats.recentPosts.length === 0) && (
              <p style={{ padding: '40px 24px', textAlign: 'center', color: '#9CA3AF', fontSize: '14px' }}>No posts yet</p>
            )}
          </div>
        </div>

        {/* Active Users */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          overflow: 'hidden',
        }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: 0 }}>Active Users</h2>
            <Link to="/admin/users" style={{ fontSize: '13px', color: '#C89B3C', textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
              View all <ArrowUpRight size={14} />
            </Link>
          </div>
          <div style={{ padding: '8px 0' }}>
            {stats.activeUsers?.map((user: any, idx: number) => (
              <div
                key={user.id}
                style={{
                  padding: '14px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  borderBottom: idx < (stats.activeUsers?.length || 0) - 1 ? '1px solid #F3F4F6' : 'none',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#F9FAFB')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                {user.avatar?.path ? (
                  <img src={user.avatar.path} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706', fontWeight: 600, fontSize: '14px', flexShrink: 0 }}>
                    {user.name?.charAt(0)}
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link to={`/users/${user.username}`} style={{ fontSize: '14px', fontWeight: 600, color: '#111827', textDecoration: 'none', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name}
                  </Link>
                  <p style={{ fontSize: '12px', color: '#6B7280', margin: '2px 0 0' }}>
                    {user._count?.posts || 0} posts
                  </p>
                </div>
                <div style={{ fontSize: '11px', color: '#9CA3AF', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={10} />
                  {user.lastActiveAt ? formatDate(user.lastActiveAt) : 'Never'}
                </div>
              </div>
            ))}
            {(!stats.activeUsers || stats.activeUsers.length === 0) && (
              <p style={{ padding: '40px 24px', textAlign: 'center', color: '#9CA3AF', fontSize: '14px' }}>No active users</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row — Categories & Tags */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Top Categories */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          overflow: 'hidden',
        }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5E7EB' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: 0 }}>Top Categories</h2>
          </div>
          <div style={{ padding: '8px 0' }}>
            {stats.topCategories.map((cat: any, idx: number) => {
              const maxCount = stats.topCategories[0]?.postCount || 1;
              const width = Math.max(10, (cat.postCount / maxCount) * 100);
              return (
                <div key={cat.id} style={{ padding: '12px 24px', borderBottom: idx < stats.topCategories.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>{cat.name}</span>
                    <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>{cat.postCount} posts</span>
                  </div>
                  <div style={{ height: '6px', background: '#F3F4F6', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${width}%`, background: 'linear-gradient(90deg, #C89B3C, #D4A84B)', borderRadius: '3px', transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              );
            })}
            {stats.topCategories.length === 0 && (
              <p style={{ padding: '40px 24px', textAlign: 'center', color: '#9CA3AF', fontSize: '14px' }}>No categories yet</p>
            )}
          </div>
        </div>

        {/* Top Tags */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          overflow: 'hidden',
        }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5E7EB' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: 0 }}>Top Tags</h2>
          </div>
          <div style={{ padding: '16px 24px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {stats.topTags.map((tag: any) => (
              <span
                key={tag.id}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  border: '1px solid #E5E7EB',
                  background: '#F9FAFB',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#374151',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#C89B3C';
                  e.currentTarget.style.background = '#FFFBEB';
                  e.currentTarget.style.color = '#B8860B';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E5E7EB';
                  e.currentTarget.style.background = '#F9FAFB';
                  e.currentTarget.style.color = '#374151';
                }}
              >
                #{tag.name}
                <span style={{ fontSize: '11px', color: '#9CA3AF', marginLeft: '2px' }}>{tag.postCount}</span>
              </span>
            ))}
            {stats.topTags.length === 0 && (
              <p style={{ padding: '20px 0', textAlign: 'center', color: '#9CA3AF', fontSize: '14px', width: '100%' }}>No tags yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
