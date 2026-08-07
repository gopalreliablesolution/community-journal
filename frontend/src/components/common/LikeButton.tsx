import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import api from '../../services/apiClient';
import { useAuthStore } from '../../store/auth.store';
import { toast } from 'sonner';

interface LikeButtonProps {
  postId: string;
  initialCount?: number;
}

export default function LikeButton({ postId, initialCount = 0 }: LikeButtonProps) {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: likeStatus } = useQuery({
    queryKey: ['like-status', postId],
    queryFn: async () => {
      const { data } = await api.get(`/posts/${postId}/like/status`);
      return data.data; // returns { liked: boolean }
    },
    enabled: !!user && !!postId,
  });

  const isLiked = likeStatus?.liked ?? false;

  const toggleLikeMutation = useMutation({
    mutationFn: async () => {
      if (isLiked) {
        const { data } = await api.delete(`/posts/${postId}/like`);
        return data;
      } else {
        const { data } = await api.post(`/posts/${postId}/like`);
        return data;
      }
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['like-status', postId] });
      const previous = queryClient.getQueryData<{ liked: boolean }>(['like-status', postId]);
      queryClient.setQueryData(['like-status', postId], { liked: !previous?.liked });
      return { previous };
    },
    onSuccess: (_data, _variables, context) => {
      if (!context?.previous?.liked) {
        toast.success('Liked article!');
      }
    },
    onError: (_err, _variables, context) => {
      queryClient.setQueryData(['like-status', postId], context?.previous);
      toast.error('Please sign in to like articles');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['like-status', postId] });
      queryClient.invalidateQueries({ queryKey: ['post'] });
    },
  });

  return (
    <button
      onClick={() => {
        if (!user) {
          toast.error('Please sign in to like articles');
          navigate('/auth/login', { state: { from: window.location.pathname } });
          return;
        }
        toggleLikeMutation.mutate();
      }}
      disabled={toggleLikeMutation.isPending}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 600,
        color: isLiked ? '#DC3545' : '#6B6B6B',
        transition: 'all 0.2s ease',
        padding: '6px 12px',
        borderRadius: '9999px',
        backgroundColor: isLiked ? 'rgba(220, 53, 69, 0.08)' : 'transparent',
      }}
      onMouseEnter={(e) => {
        if (!isLiked) {
          e.currentTarget.style.color = '#DC3545';
          e.currentTarget.style.backgroundColor = 'rgba(220, 53, 69, 0.05)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isLiked) {
          e.currentTarget.style.color = '#6B6B6B';
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
      aria-label={isLiked ? 'Unlike' : 'Like'}
    >
      <Heart
        style={{
          width: '18px',
          height: '18px',
          fill: isLiked ? '#DC3545' : 'none',
          color: isLiked ? '#DC3545' : 'currentColor',
          transition: 'all 0.2s ease',
        }}
      />
      <span>{initialCount + (isLiked ? 1 : 0)}</span>
    </button>
  );
}
