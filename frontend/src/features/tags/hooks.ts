import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { tagsApi } from './api';

export const tagKeys = {
  all: ['tags'] as const,
  detail: (slug: string) => ['tags', slug] as const,
  posts: (slug: string) => ['tags', slug, 'posts'] as const,
};

export function useTagDetail(slug: string) {
  return useQuery({
    queryKey: tagKeys.detail(slug),
    queryFn: async () => {
      const response = await tagsApi.detail(slug);
      return response.data.data;
    },
    enabled: !!slug,
  });
}

export function useTagPosts(slug: string, page = 1, limit = 10) {
  return useQuery({
    queryKey: [...tagKeys.posts(slug), { page, limit }],
    queryFn: async () => {
      const response = await tagsApi.postsByTag(slug, page, limit);
      return response.data;
    },
    enabled: !!slug,
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => tagsApi.create(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.all });
      toast.success('Tag created');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to create tag');
    },
  });
}

export function useUpdateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => tagsApi.update(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.all });
      toast.success('Tag updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to update tag');
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tagsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.all });
      toast.success('Tag deleted');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to delete tag');
    },
  });
}
