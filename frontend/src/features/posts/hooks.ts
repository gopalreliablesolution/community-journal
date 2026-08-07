import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { postsApi, type CreatePostData, type PostListParams } from './api';
import { postKeys } from './queryKeys';
import { ROUTES } from '../../constants';

export function usePosts(params?: PostListParams) {
  return useQuery({
    queryKey: postKeys.list(params as Record<string, unknown>),
    queryFn: async () => {
      const response = await postsApi.list(params);
      return response.data;
    },
  });
}

export function usePost(slug: string) {
  return useQuery({
    queryKey: postKeys.detail(slug),
    queryFn: async () => {
      const response = await postsApi.detail(slug);
      return response.data.data;
    },
    enabled: !!slug,
  });
}

export function usePostStats(slug: string) {
  return useQuery({
    queryKey: postKeys.stats(slug),
    queryFn: async () => {
      const response = await postsApi.stats(slug);
      return response.data.data;
    },
    enabled: !!slug,
  });
}

export function useCreatePost() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostData) => postsApi.create(data),
    onSuccess: (response) => {
      const post = response.data.data;
      queryClient.invalidateQueries({ queryKey: postKeys.all });
      toast.success('Post created!');
      navigate(`/edit/${post.id}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to create post');
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreatePostData> }) =>
      postsApi.update(id, data),
    onSuccess: (response) => {
      const post = response.data.data;
      queryClient.setQueryData(postKeys.detail(post.slug), response.data);
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to update post');
    },
  });
}

export function useDeletePost() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
      toast.success('Post deleted');
      navigate(ROUTES.DASHBOARD);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to delete post');
    },
  });
}

export function usePublishPost() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postsApi.publish(id),
    onSuccess: (response) => {
      const post = response.data.data;
      queryClient.invalidateQueries({ queryKey: postKeys.all });
      toast.success('Post published!');
      navigate(`/posts/${post.slug}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to publish');
    },
  });
}

export function useAutosavePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreatePostData> }) =>
      postsApi.autosave(id, data),
    onSuccess: (response) => {
      const post = response.data.data;
      queryClient.setQueryData(postKeys.detail(post.slug), response.data);
    },
    onError: () => {
      toast.error('Autosave failed');
    },
  });
}
