import api from '../../services/apiClient';
import { API_ENDPOINTS } from '../../constants';
import type { ApiResponse, PaginatedResponse, User, Post, AdminStats, Category, Tag } from '../../types';

export interface UserGrowthData {
  growth: Array<{ date: string; users: number }>;
  roleDistribution: Array<{ role: string; count: number }>;
  statusDistribution: Array<{ status: string; count: number }>;
  topUsers: Array<{
    id: string;
    name: string;
    username: string;
    avatar: { path: string } | null;
    _count: { posts: number; followers: number };
  }>;
}

export const adminApi = {
  getStats: () =>
    api.get<ApiResponse<AdminStats>>(API_ENDPOINTS.ADMIN.STATS),

  getUsers: (page?: number, limit?: number, search?: string) =>
    api.get<PaginatedResponse<User>>(API_ENDPOINTS.ADMIN.USERS, {
      params: { page, limit, search },
    }),

  getUserGrowth: (period?: number) =>
    api.get<ApiResponse<UserGrowthData>>('/admin/users/growth', {
      params: { period },
    }),

  updateUser: (id: string, data: { role?: string; status?: string }) =>
    api.patch<ApiResponse<User>>(API_ENDPOINTS.ADMIN.UPDATE_USER(id), data),

  deleteUser: (id: string) =>
    api.delete<ApiResponse<null>>(API_ENDPOINTS.ADMIN.DELETE_USER(id)),

  getPosts: (page?: number, limit?: number, search?: string) =>
    api.get<PaginatedResponse<Post>>(API_ENDPOINTS.ADMIN.POSTS, {
      params: { page, limit, search },
    }),

  deletePost: (id: string) =>
    api.delete<ApiResponse<null>>(API_ENDPOINTS.ADMIN.DELETE_POST(id)),

  // Category management
  getCategories: () =>
    api.get<ApiResponse<Category[]>>(API_ENDPOINTS.CATEGORIES.LIST),

  createCategory: (data: { name: string; slug: string; icon?: string }) =>
    api.post<ApiResponse<Category>>(API_ENDPOINTS.CATEGORIES.CREATE, data),

  updateCategory: (id: string, data: { name?: string; slug?: string; icon?: string }) =>
    api.patch<ApiResponse<Category>>(API_ENDPOINTS.CATEGORIES.UPDATE(id), data),

  deleteCategory: (id: string) =>
    api.delete<ApiResponse<null>>(API_ENDPOINTS.CATEGORIES.DELETE(id)),

  // Tag management
  getTags: () =>
    api.get<ApiResponse<Tag[]>>(API_ENDPOINTS.TAGS.LIST),

  createTag: (data: { name: string; slug: string }) =>
    api.post<ApiResponse<Tag>>(API_ENDPOINTS.TAGS.CREATE, data),

  updateTag: (id: string, data: { name?: string; slug?: string }) =>
    api.patch<ApiResponse<Tag>>(API_ENDPOINTS.TAGS.UPDATE(id), data),

  deleteTag: (id: string) =>
    api.delete<ApiResponse<null>>(API_ENDPOINTS.TAGS.DELETE(id)),
};
