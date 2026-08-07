import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { commentsApi, type CreateCommentData } from './api';

export const commentKeys = {
  all: ['comments'] as const,
  list: (postId: string) => [...commentKeys.all, postId] as const,
};

export function useComments(postId: string) {
  return useQuery({
    queryKey: commentKeys.list(postId),
    queryFn: async () => {
      const response = await commentsApi.list(postId);
      return response.data.data;
    },
    enabled: !!postId,
  });
}

export function useAddComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentData) => commentsApi.create(postId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.list(postId) });
      toast.success('Comment added');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to add comment');
    },
  });
}

export function useDeleteComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => commentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.list(postId) });
      toast.success('Comment deleted');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to delete comment');
    },
  });
}

export function useUpdateComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      commentsApi.update(id, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.list(postId) });
      toast.success('Comment updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to update comment');
    },
  });
}
