import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, BookOpen, Heart, Clock } from 'lucide-react';
import { useProfile, useUserPosts, useFollow, useUnfollow, useFollowers, useFollowing } from '../features/profile/hooks';
import { useAuthStore } from '../store/auth.store';
import { ProfileSkeleton } from '../components/ui/Skeleton';
import { Avatar } from '../components/ui/Avatar';
import Modal from '../components/ui/Modal';
import Pagination from '../components/ui/Pagination';
import { formatDate, formatNumber } from '../utils/formatters';
import { canFollowUser } from '../utils/permissions';

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuthStore();
  const [page, setPage] = useState(1);
  const [followersModalOpen, setFollowersModalOpen] = useState(false);
  const [followingModalOpen, setFollowingModalOpen] = useState(false);

  const { data: profile, isLoading: profileLoading } = useProfile(username || '');
  const { data: postsData, isLoading: postsLoading } = useUserPosts(username || '', page, 10);
  const { data: followers } = useFollowers(username || '');
  const { data: following } = useFollowing(username || '');
  const follow = useFollow();
  const unfollow = useUnfollow();

  if (profileLoading) {
    return (
      <div style={{ background: '#FAF8F5', minHeight: '88vh', padding: '40px 20px' }}>
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          <ProfileSkeleton />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ background: '#FAF8F5', minHeight: '88vh', padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EFEFEF', padding: '40px', maxWidth: '440px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '24px', color: '#1A1A1A' }}>
            User Not Found
          </h2>
          <p style={{ fontSize: '14px', color: '#6B6B6B', marginTop: '8px' }}>
            The author profile you are looking for does not exist or has been renamed.
          </p>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === profile.id;
  const canFollow = canFollowUser(currentUser, profile.id);

  const handleFollowToggle = () => {
    if (profile.isFollowing) {
      unfollow.mutate(profile.id);
    } else {
      follow.mutate(profile.id);
    }
  };

  return (
    <div style={{ background: '#FAF8F5', minHeight: '88vh', padding: '40px 20px 80px' }}>
      <div style={{ maxWidth: '840px', margin: '0 auto' }}>
        
        {/* Profile Card Frame */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #EFEFEF',
            padding: '36px 32px',
            marginBottom: '36px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', flexWrap: 'wrap' }}>
            <Avatar
              name={profile.name}
              src={profile.avatar?.path}
              size="xl"
            />
            <div style={{ flex: 1, minWidth: '240px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                <div>
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
                    {profile.name}
                  </h1>
                  <p style={{ fontSize: '13.5px', fontWeight: 600, color: '#C89B3C', marginTop: '4px', marginBottom: 0 }}>
                    @{profile.username}
                  </p>
                </div>

                <div>
                  {isOwnProfile ? (
                    <Link
                      to="/settings/profile"
                      style={{
                        display: 'inline-block',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        border: '1px solid #DADADA',
                        background: '#FFFFFF',
                        color: '#1A1A1A',
                        fontSize: '13.5px',
                        fontWeight: 600,
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#C89B3C';
                        e.currentTarget.style.color = '#C89B3C';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#DADADA';
                        e.currentTarget.style.color = '#1A1A1A';
                      }}
                    >
                      Edit Profile
                    </Link>
                  ) : canFollow ? (
                    <button
                      onClick={handleFollowToggle}
                      disabled={follow.isPending || unfollow.isPending}
                      style={{
                        padding: '10px 22px',
                        borderRadius: '8px',
                        border: 'none',
                        background: profile.isFollowing ? '#FAF8F5' : '#C89B3C',
                        color: profile.isFollowing ? '#6B6B6B' : '#FFFFFF',
                        fontSize: '13.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: profile.isFollowing ? 'none' : '0 4px 14px rgba(200, 155, 60, 0.3)',
                      }}
                    >
                      {profile.isFollowing ? 'Following' : 'Follow Author'}
                    </button>
                  ) : null}
                </div>
              </div>

              {profile.bio && (
                <p style={{ fontSize: '14.5px', color: '#444444', lineHeight: '1.6', marginTop: '14px', marginBottom: 0 }}>
                  {profile.bio}
                </p>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px', fontSize: '12.5px', color: '#888888' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar style={{ width: '14px', height: '14px', color: '#C89B3C' }} />
                  Joined {formatDate(profile.createdAt)}
                </span>
              </div>

              {/* Stats Row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '28px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #EFEFEF' }}>
                <div>
                  <span style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '20px', fontWeight: 700, color: '#1A1A1A' }}>
                    {formatNumber(profile._count?.posts || 0)}
                  </span>{' '}
                  <span style={{ fontSize: '12.5px', color: '#888888', fontWeight: 500 }}>articles</span>
                </div>
                <button
                  onClick={() => setFollowersModalOpen(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '20px', fontWeight: 700, color: '#1A1A1A' }}>
                    {formatNumber(profile._count?.followers || 0)}
                  </span>{' '}
                  <span style={{ fontSize: '12.5px', color: '#888888', fontWeight: 500 }}>followers</span>
                </button>
                <button
                  onClick={() => setFollowingModalOpen(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '20px', fontWeight: 700, color: '#1A1A1A' }}>
                    {formatNumber(profile._count?.following || 0)}
                  </span>{' '}
                  <span style={{ fontSize: '12.5px', color: '#888888', fontWeight: 500 }}>following</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* User Posts List */}
        <div>
          <h2
            style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: '24px',
              fontWeight: 600,
              color: '#1A1A1A',
              marginBottom: '20px',
            }}
          >
            Articles by {profile.name}
          </h2>

          {postsLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[...Array(3)].map((_, i) => (
                <div key={i} style={{ height: '100px', background: '#FFFFFF', borderRadius: '14px', border: '1px solid #EFEFEF', opacity: 0.6 }} />
              ))}
            </div>
          ) : postsData?.data && postsData.data.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {postsData.data.map((post) => (
                <Link
                  key={post.id}
                  to={`/posts/${post.slug}`}
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <div
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '14px',
                      padding: '24px 28px',
                      border: '1px solid #EFEFEF',
                      boxShadow: '0 2px 14px rgba(0,0,0,0.02)',
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
                    <h3
                      style={{
                        fontFamily: 'Playfair Display, Georgia, serif',
                        fontSize: '20px',
                        fontWeight: 600,
                        color: '#1A1A1A',
                        marginTop: 0,
                        marginBottom: '8px',
                        lineHeight: '1.3',
                      }}
                    >
                      {post.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#6B6B6B', lineHeight: '1.6', margin: '0 0 14px 0' }}>
                      {post.excerpt}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: '#888888' }}>
                      <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                      {post.readingTime && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock style={{ width: '12px', height: '12px', color: '#C89B3C' }} />
                          {post.readingTime} min read
                        </span>
                      )}
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Heart style={{ width: '12px', height: '12px', color: '#DC3545' }} />
                        {post._count?.likes || 0} likes
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #EFEFEF',
                padding: '48px 20px',
                textAlign: 'center',
                boxShadow: '0 2px 14px rgba(0,0,0,0.02)',
              }}
            >
              <BookOpen style={{ width: '40px', height: '40px', color: '#DADADA', margin: '0 auto 12px' }} />
              <p style={{ fontSize: '14px', color: '#6B6B6B', margin: 0 }}>
                No published articles yet.
              </p>
            </div>
          )}

          {postsData?.pagination && postsData.pagination.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={postsData.pagination.totalPages}
              onPageChange={setPage}
              className="mt-6"
            />
          )}
        </div>

        {/* Followers Modal */}
        <Modal isOpen={followersModalOpen} onClose={() => setFollowersModalOpen(false)} title={`Followers (${followers?.length || 0})`}>
          {followers && followers.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto' }}>
              {followers.map((follower) => (
                <Link
                  key={follower.id}
                  to={`/users/${follower.username}`}
                  onClick={() => setFollowersModalOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FAF8F5')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <Avatar name={follower.name} src={follower.avatar?.path} size="sm" />
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>{follower.name}</p>
                    <p style={{ fontSize: '12px', color: '#888888', margin: 0 }}>@{follower.username}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px', color: '#6B6B6B', fontSize: '14px' }}>
              No followers yet.
            </div>
          )}
        </Modal>

        {/* Following Modal */}
        <Modal isOpen={followingModalOpen} onClose={() => setFollowingModalOpen(false)} title={`Following (${following?.length || 0})`}>
          {following && following.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto' }}>
              {following.map((followed) => (
                <Link
                  key={followed.id}
                  to={`/users/${followed.username}`}
                  onClick={() => setFollowingModalOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FAF8F5')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <Avatar name={followed.name} src={followed.avatar?.path} size="sm" />
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>{followed.name}</p>
                    <p style={{ fontSize: '12px', color: '#888888', margin: 0 }}>@{followed.username}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px', color: '#6B6B6B', fontSize: '14px' }}>
              Not following anyone yet.
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
