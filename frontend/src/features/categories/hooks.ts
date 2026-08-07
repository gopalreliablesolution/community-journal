import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { categoriesApi } from './api';

export const categoryKeys = {
  all: ['categories'] as const,
  detail: (slug: string) => ['categories', slug] as const,
  posts: (slug: string) => ['categories', slug, 'posts'] as const,
};

export function useCategoryDetail(slug: string) {
  return useQuery({
    queryKey: categoryKeys.detail(slug),
    queryFn: async () => {
      const response = await categoriesApi.detail(slug);
      return response.data.data;
    },
    enabled: !!slug,
  });
}

export function useCategoryPosts(slug: string, page = 1, limit = 10) {
  return useQuery({
    queryKey: [...categoryKeys.posts(slug), { page, limit }],
    queryFn: async () => {
      const response = await categoriesApi.postsByCategory(slug, page, limit);
      return response.data;
    },
    enabled: !!slug,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; slug?: string; icon?: string }) => categoriesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      toast.success('Category created');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to create category');
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; slug?: string; icon?: string } }) =>
      categoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      toast.success('Category updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to update category');
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      toast.success('Category deleted');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to delete category');
    },
  });
}
