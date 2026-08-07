import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Check, Trash2, CheckCheck, Trash } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/apiClient';
import { useAuthStore } from '../store/auth.store';
import { Avatar } from '../components/ui/Avatar';
import { formatDate } from '../utils/formatters';
import type { Notification } from '../types';
import { toast } from 'sonner';

export default function Notifications() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data } = await api.get('/me/notifications');
      return data.data as Notification[];
    },
    enabled: !!user,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/me/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      await api.patch('/me/notifications/read-all');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('All notifications marked as read');
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/me/notifications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notification deleted');
    },
  });

  const deleteAllNotificationsMutation = useMutation({
    mutationFn: async () => {
      await api.delete('/me/notifications');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('All notifications deleted');
    },
    onError: () => {
      toast.error('Failed to delete notifications');
    },
  });

  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;

  if (!user) {
    return (
      <div style={{ background: '#FAF8F5', minHeight: '80vh', padding: '60px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EFEFEF', padding: '40px 32px', textAlign: 'center', maxWidth: '440px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <Bell style={{ width: '40px', height: '40px', color: '#C89B3C', margin: '0 auto 16px' }} />
          <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '24px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>
            Sign In Required
          </h2>
          <p style={{ fontSize: '14px', color: '#6B6B6B', marginBottom: '20px', lineHeight: '1.5' }}>
            Please sign in to view your activity and notifications.
          </p>
          <Link
            to="/auth/login"
            style={{
              display: 'inline-block',
              padding: '12px 28px',
              borderRadius: '8px',
              background: '#C89B3C',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '14px',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(200,155,60,0.3)',
            }}
          >
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#FAF8F5', minHeight: '88vh', padding: '40px 20px 80px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '28px',
            paddingBottom: '16px',
            borderBottom: '1px solid #EFEFEF',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#C89B3C',
                  background: 'rgba(200, 155, 60, 0.12)',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                }}
              >
                {unreadCount} unread
              </span>
            )}
          </div>

          {unreadCount > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => markAllAsReadMutation.mutate()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'none',
                  border: 'none',
                  color: '#C89B3C',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#A67C1F')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#C89B3C')}
              >
                <CheckCheck style={{ width: '16px', height: '16px' }} />
                Mark all as read
              </button>
              {notifications && notifications.length > 0 && (
                <button
                  onClick={() => {
                    if (window.confirm('Delete all notifications? This cannot be undone.')) {
                      deleteAllNotificationsMutation.mutate();
                    }
                  }}
                  disabled={deleteAllNotificationsMutation.isPending}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'none',
                    border: '1px solid #DC3545',
                    color: '#DC3545',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: deleteAllNotificationsMutation.isPending ? 'not-allowed' : 'pointer',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#DC3545';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#DC3545';
                  }}
                >
                  <Trash style={{ width: '14px', height: '14px' }} />
                  Delete all
                </button>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '14px',
                  padding: '20px',
                  border: '1px solid #EFEFEF',
                  display: 'flex',
                  gap: '14px',
                  opacity: 0.6,
                }}
              >
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#F1F1F1' }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ width: '60%', height: '14px', background: '#F1F1F1', borderRadius: '4px' }} />
                  <div style={{ width: '30%', height: '12px', background: '#F1F1F1', borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>
        ) : notifications && notifications.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '14px',
                  padding: '18px 20px',
                  border: '1px solid #EFEFEF',
                  borderLeft: notification.read ? '1px solid #EFEFEF' : '4px solid #C89B3C',
                  boxShadow: notification.read ? '0 2px 10px rgba(0,0,0,0.02)' : '0 4px 16px rgba(200, 155, 60, 0.08)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  transition: 'all 0.2s ease',
                }}
              >
                {notification.actor && (
                  <Link to={`/users/${notification.actor.username}`} style={{ flexShrink: 0 }}>
                    <Avatar
                      name={notification.actor.name}
                      src={notification.actor.avatar?.path}
                      size="md"
                    />
                  </Link>
                )}
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '14px', color: '#1A1A1A', lineHeight: '1.5', margin: '0 0 4px 0' }}>
                    {notification.message}
                  </p>
                  <span style={{ fontSize: '12px', color: '#888888' }}>
                    {formatDate(notification.createdAt)}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {!notification.read && (
                    <button
                      onClick={() => markAsReadMutation.mutate(notification.id)}
                      title="Mark as read"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#888888',
                        cursor: 'pointer',
                        padding: '6px',
                        borderRadius: '6px',
                        transition: 'color 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#C89B3C')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#888888')}
                    >
                      <Check style={{ width: '16px', height: '16px' }} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotificationMutation.mutate(notification.id)}
                    title="Delete notification"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#888888',
                      cursor: 'pointer',
                      padding: '6px',
                      borderRadius: '6px',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#DC3545')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#888888')}
                  >
                    <Trash2 style={{ width: '16px', height: '16px' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #EFEFEF',
              padding: '60px 20px',
              textAlign: 'center',
              boxShadow: '0 2px 14px rgba(0,0,0,0.03)',
            }}
          >
            <Bell style={{ width: '48px', height: '48px', color: '#DADADA', margin: '0 auto 16px' }} />
            <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '22px', fontWeight: 600, color: '#1A1A1A', marginBottom: '8px' }}>
              No Notifications Yet
            </h2>
            <p style={{ fontSize: '14px', color: '#6B6B6B', margin: 0 }}>
              You'll see activity updates here when users interact with your posts or profile.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
