import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminApi } from './api';

export const adminKeys = {
  all: ['admin'] as const,
  stats: ['admin', 'stats'] as const,
  users: (page: number, search?: string) => ['admin', 'users', page, search] as const,
  userGrowth: (period: number) => ['admin', 'users', 'growth', period] as const,
  posts: (page: number, search?: string) => ['admin', 'posts', page, search] as const,
  categories: ['admin', 'categories'] as const,
  tags: ['admin', 'tags'] as const,
};

export function useAdminStats() {
  return useQuery({
    queryKey: adminKeys.stats,
    queryFn: async () => {
      const response = await adminApi.getStats();
      return response.data.data;
    },
  });
}

export function useAdminUsers(page = 1, limit = 20, search?: string) {
  return useQuery({
    queryKey: adminKeys.users(page, search),
    queryFn: async () => {
      const response = await adminApi.getUsers(page, limit, search);
      return response.data;
    },
  });
}

export function useAdminUserGrowth(period = 30) {
  return useQuery({
    queryKey: adminKeys.userGrowth(period),
    queryFn: async () => {
      const response = await adminApi.getUserGrowth(period);
      return response.data.data;
    },
  });
}

export function useAdminUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { role?: string; status?: string } }) =>
      adminApi.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
      toast.success('User updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to update user');
    },
  });
}

export function useAdminDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
      toast.success('User deleted');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to delete user');
    },
  });
}

export function useAdminPosts(page = 1, limit = 20, search?: string) {
  return useQuery({
    queryKey: adminKeys.posts(page, search),
    queryFn: async () => {
      const response = await adminApi.getPosts(page, limit, search);
      return response.data;
    },
  });
}

export function useAdminDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminApi.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
      toast.success('Post deleted');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to delete post');
    },
  });
}

// Category management hooks
export function useAdminCategories() {
  return useQuery({
    queryKey: adminKeys.categories,
    queryFn: async () => {
      const response = await adminApi.getCategories();
      return response.data.data;
    },
  });
}

export function useAdminCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; slug: string; icon?: string }) =>
      adminApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.categories });
      toast.success('Category created');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to create category');
    },
  });
}

export function useAdminUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; slug?: string; icon?: string } }) =>
      adminApi.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.categories });
      toast.success('Category updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to update category');
    },
  });
}

export function useAdminDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.categories });
      toast.success('Category deleted');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to delete category');
    },
  });
}

// Tag management hooks
export function useAdminTags() {
  return useQuery({
    queryKey: adminKeys.tags,
    queryFn: async () => {
      const response = await adminApi.getTags();
      return response.data.data;
    },
  });
}

export function useAdminCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; slug: string }) =>
      adminApi.createTag(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.tags });
      toast.success('Tag created');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to create tag');
    },
  });
}

export function useAdminUpdateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; slug?: string } }) =>
      adminApi.updateTag(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.tags });
      toast.success('Tag updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to update tag');
    },
  });
}

export function useAdminDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminApi.deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.tags });
      toast.success('Tag deleted');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to delete tag');
    },
  });
}
