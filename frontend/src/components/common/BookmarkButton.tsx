import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import api from '../../services/apiClient';
import { useAuthStore } from '../../store/auth.store';
import { toast } from 'sonner';

interface BookmarkButtonProps {
  postId: string;
}

export default function BookmarkButton({ postId }: BookmarkButtonProps) {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: bookmarkStatus } = useQuery({
    queryKey: ['bookmark-status', postId],
    queryFn: async () => {
      const { data } = await api.get(`/posts/${postId}/bookmark/status`);
      return data.data; // returns { bookmarked: boolean }
    },
    enabled: !!user && !!postId,
  });

  const isBookmarked = bookmarkStatus?.bookmarked ?? false;

  const toggleBookmarkMutation = useMutation({
    mutationFn: async () => {
      if (isBookmarked) {
        const { data } = await api.delete(`/posts/${postId}/bookmark`);
        return data;
      } else {
        const { data } = await api.post(`/posts/${postId}/bookmark`);
        return data;
      }
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['bookmark-status', postId] });
      const previous = queryClient.getQueryData<{ bookmarked: boolean }>(['bookmark-status', postId]);
      queryClient.setQueryData(['bookmark-status', postId], { bookmarked: !previous?.bookmarked });
      return { previous };
    },
    onSuccess: (_data, _variables, context) => {
      if (!context?.previous?.bookmarked) {
        toast.success('Article saved to bookmarks!');
      } else {
        toast.success('Bookmark removed');
      }
    },
    onError: (_err, _variables, context) => {
      queryClient.setQueryData(['bookmark-status', postId], context?.previous);
      toast.error('Please sign in to save bookmarks');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmark-status', postId] });
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });

  return (
    <button
      onClick={() => {
        if (!user) {
          toast.error('Please sign in to save bookmarks');
          navigate('/auth/login', { state: { from: window.location.pathname } });
          return;
        }
        toggleBookmarkMutation.mutate();
      }}
      disabled={toggleBookmarkMutation.isPending}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 600,
        color: isBookmarked ? '#C89B3C' : '#6B6B6B',
        transition: 'all 0.2s ease',
        padding: '6px 12px',
        borderRadius: '9999px',
        backgroundColor: isBookmarked ? 'rgba(200, 155, 60, 0.12)' : 'transparent',
      }}
      onMouseEnter={(e) => {
        if (!isBookmarked) {
          e.currentTarget.style.color = '#C89B3C';
          e.currentTarget.style.backgroundColor = 'rgba(200, 155, 60, 0.06)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isBookmarked) {
          e.currentTarget.style.color = '#6B6B6B';
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
      aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
    >
      <Bookmark
        style={{
          width: '18px',
          height: '18px',
          fill: isBookmarked ? '#C89B3C' : 'none',
          color: isBookmarked ? '#C89B3C' : 'currentColor',
          transition: 'all 0.2s ease',
        }}
      />
      <span>{isBookmarked ? 'Saved' : 'Save'}</span>
    </button>
  );
}
