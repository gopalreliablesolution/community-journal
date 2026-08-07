import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Reply, Send, Pencil } from 'lucide-react';
import api from '../../services/apiClient';
import { useAuthStore } from '../../store/auth.store';
import { useUpdateComment } from '../../features/comments/hooks';
import { Avatar } from '../ui/Avatar';
import { formatDate } from '../../utils/formatters';
import { canDeletePost } from '../../utils/permissions';
import type { Comment } from '../../types';
import { toast } from 'sonner';

interface CommentItemProps {
  comment: Comment & { replies?: Comment[] };
  postId: string;
}

export default function CommentItem({ comment, postId }: CommentItemProps) {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const updateComment = useUpdateComment(postId);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/posts/${postId}/comments/${comment.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      toast.success('Comment deleted');
    },
    onError: () => {
      toast.error('Failed to delete comment');
    },
  });

  const replyMutation = useMutation({
    mutationFn: async (content: string) => {
      const { data } = await api.post(`/posts/${postId}/comments`, {
        content,
        parentId: comment.id,
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      setReplyContent('');
      setShowReplyForm(false);
      toast.success('Reply posted successfully!');
    },
    onError: () => {
      toast.error('Failed to post reply. Please sign in first.');
    },
  });

  const handleDelete = () => {
    if (window.confirm('Delete this comment?')) {
      deleteMutation.mutate();
    }
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) {
      toast.error('Please write a reply before submitting.');
      return;
    }
    replyMutation.mutate(replyContent.trim());
  };

  const handleEditSubmit = () => {
    if (!editContent.trim()) {
      toast.error('Comment cannot be empty.');
      return;
    }
    if (editContent.trim() === comment.content) {
      setIsEditing(false);
      return;
    }
    updateComment.mutate(
      { id: comment.id, content: editContent.trim() },
      { onSuccess: () => setIsEditing(false) }
    );
  };

  return (
    <div style={{ display: 'flex', gap: '14px', marginBottom: '24px', alignItems: 'flex-start' }}>
      {/* Profile Icon / Avatar */}
      <Link to={`/users/${comment.user.username}`} style={{ flexShrink: 0 }}>
        <Avatar name={comment.user.name} src={comment.user.avatar?.path} size="md" />
      </Link>

      {/* Comment Details */}
      <div style={{ flex: 1 }}>
        {/* Header line: Author Name + Date + Trash Icon */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link
              to={`/users/${comment.user.username}`}
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#1A1A1A',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#C89B3C')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#1A1A1A')}
            >
              {comment.user.name}
            </Link>
            <span style={{ fontSize: '12px', color: '#AAAAAA' }}>
              {formatDate(comment.createdAt)}
            </span>
          </div>

          {/* Edit & Delete Options on top-right */}
          {user && (user.id === comment.user.id || canDeletePost(user, { author: comment.user } as any)) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {user.id === comment.user.id && !isEditing && (
                <button
                  onClick={() => { setIsEditing(true); setEditContent(comment.content); }}
                  title="Edit comment"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#AAAAAA',
                    cursor: 'pointer',
                    padding: '2px',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#C89B3C')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#AAAAAA')}
                >
                  <Pencil style={{ width: '14px', height: '14px' }} />
                </button>
              )}
              {canDeletePost(user, { author: comment.user } as any) && (
                <button
                  onClick={handleDelete}
                  title="Delete comment"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#AAAAAA',
                    cursor: 'pointer',
                    padding: '2px',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#DC3545')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#AAAAAA')}
                >
                  <Trash2 style={{ width: '14px', height: '14px' }} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Comment Content Box */}
        {isEditing ? (
          <div style={{ marginTop: '4px' }}>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              style={{
                width: '100%',
                background: '#FFFFFF',
                borderRadius: '12px',
                padding: '12px 16px',
                border: '1.5px solid #C89B3C',
                fontSize: '14px',
                color: '#333333',
                lineHeight: '1.6',
                resize: 'none',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              rows={3}
              autoFocus
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
              <button
                onClick={() => { setIsEditing(false); setEditContent(comment.content); }}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: '1px solid #DADADA',
                  background: '#FFFFFF',
                  color: '#6B6B6B',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                disabled={updateComment.isPending}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#C89B3C',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: updateComment.isPending ? 'not-allowed' : 'pointer',
                }}
              >
                {updateComment.isPending ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{
              background: '#FAF8F5',
              borderRadius: '12px',
              padding: '12px 16px',
              border: '1px solid #EFEFEF',
              fontSize: '14px',
              color: '#333333',
              lineHeight: '1.6',
            }}
          >
            {comment.content}
          </div>
        )}

        {/* Reply Button AT THE BOTTOM RIGHT CORNER of Comment */}
        <div style={{ marginTop: '6px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            style={{
              background: 'none',
              border: 'none',
              color: showReplyForm ? '#C89B3C' : '#888888',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 0',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#C89B3C')}
            onMouseLeave={(e) => {
              if (!showReplyForm) e.currentTarget.style.color = '#888888';
            }}
          >
            <Reply style={{ width: '13px', height: '13px' }} />
            Reply
          </button>
        </div>

        {/* Inline Reply Form */}
        {showReplyForm && (
          <form onSubmit={handleReplySubmit} style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder={`Reply to ${comment.user.name}...`}
              style={{
                flex: 1,
                padding: '8px 14px',
                background: '#FFFFFF',
                border: '1px solid #C89B3C',
                borderRadius: '8px',
                fontSize: '13px',
                outline: 'none',
              }}
              autoFocus
            />
            <button
              type="submit"
              disabled={replyMutation.isPending}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: '#C89B3C',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 600,
                cursor: replyMutation.isPending ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              Reply
              <Send style={{ width: '12px', height: '12px' }} />
            </button>
          </form>
        )}

        {/* Nested Replies List */}
        {comment.replies && comment.replies.length > 0 && (
          <div style={{ marginTop: '14px', paddingLeft: '16px', borderLeft: '2px solid #F1F1F1' }}>
            {comment.replies.map((reply) => (
              <div key={reply.id} style={{ display: 'flex', gap: '10px', marginTop: '10px', alignItems: 'flex-start' }}>
                <Avatar name={reply.user.name} src={reply.user.avatar?.path} size="sm" />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A' }}>
                      {reply.user.name}
                    </span>
                    <span style={{ fontSize: '11px', color: '#AAAAAA' }}>
                      {formatDate(reply.createdAt)}
                    </span>
                  </div>
                  <div
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      border: '1px solid #EFEFEF',
                      fontSize: '13px',
                      color: '#444444',
                      lineHeight: '1.5',
                    }}
                  >
                    {reply.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
