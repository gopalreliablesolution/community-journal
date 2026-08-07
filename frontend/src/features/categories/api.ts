import api from '../../services/apiClient';
import { API_ENDPOINTS } from '../../constants';
import type { ApiResponse, PaginatedResponse, Post } from '../../types';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  _count?: { posts: number };
}

export const categoriesApi = {
  list: () =>
    api.get<ApiResponse<Category[]>>(API_ENDPOINTS.CATEGORIES.LIST),

  detail: (slug: string) =>
    api.get<ApiResponse<Category>>(`/categories/${slug}`),

  postsByCategory: (slug: string, page = 1, limit = 10) =>
    api.get<PaginatedResponse<Post>>(`/categories/${slug}/posts`, { params: { page, limit } }),

  create: (data: { name: string; slug?: string; icon?: string }) =>
    api.post<ApiResponse<Category>>(API_ENDPOINTS.CATEGORIES.CREATE, data),

  update: (id: string, data: { name?: string; slug?: string; icon?: string }) =>
    api.patch<ApiResponse<Category>>(API_ENDPOINTS.CATEGORIES.UPDATE(id), data),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(API_ENDPOINTS.CATEGORIES.DELETE(id)),
};
