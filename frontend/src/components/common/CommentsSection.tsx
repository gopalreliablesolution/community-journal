import { useQuery } from '@tanstack/react-query';
import api from '../../services/apiClient';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import type { Comment } from '../../types';

interface CommentsSectionProps {
  postId: string;
}

export default function CommentsSection({ postId }: CommentsSectionProps) {
  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const { data } = await api.get(`/posts/${postId}/comments`);
      return data.data as Comment[];
    },
  });

  const count = comments?.length || 0;

  return (
    <div>
      {/* Header: Clean "Comments" + Small Count Bubble */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '24px',
          paddingBottom: '14px',
          borderBottom: '1px solid #EFEFEF',
        }}
      >
        <h3
          style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: '22px',
            fontWeight: 600,
            color: '#1A1A1A',
            margin: 0,
          }}
        >
          Comments
        </h3>
        <span
          style={{
            fontSize: '12px',
            fontWeight: 700,
            color: '#C89B3C',
            background: 'rgba(200, 155, 60, 0.12)',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {count}
        </span>
      </div>

      {/* Comments List FIRST */}
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', opacity: 0.6 }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#EFEFEF' }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ width: '120px', height: '14px', background: '#EFEFEF', borderRadius: '4px' }} />
                <div style={{ width: '100%', height: '50px', background: '#EFEFEF', borderRadius: '12px' }} />
              </div>
            </div>
          ))}
        </div>
      ) : comments && comments.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
            />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '24px 0', color: '#888888' }}>
          <p style={{ fontSize: '14px', color: '#6B6B6B', margin: 0 }}>
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      )}

      {/* Leave a Reply Comment Form at the END */}
      <CommentForm postId={postId} />
    </div>
  );
}
