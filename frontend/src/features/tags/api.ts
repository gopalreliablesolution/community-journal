import api from '../../services/apiClient';
import { API_ENDPOINTS } from '../../constants';
import type { ApiResponse, PaginatedResponse, Post } from '../../types';

export interface Tag {
  id: string;
  name: string;
  slug: string;
  _count?: { posts: number };
}

export const tagsApi = {
  list: (page = 1, limit = 50) =>
    api.get<PaginatedResponse<Tag>>(API_ENDPOINTS.TAGS.LIST, { params: { page, limit } }),

  detail: (slug: string) =>
    api.get<ApiResponse<Tag>>(`/tags/${slug}`),

  postsByTag: (slug: string, page = 1, limit = 10) =>
    api.get<PaginatedResponse<Post>>(`/tags/${slug}/posts`, { params: { page, limit } }),

  create: (name: string) =>
    api.post<ApiResponse<Tag>>(API_ENDPOINTS.TAGS.CREATE, { name }),

  update: (id: string, name: string) =>
    api.patch<ApiResponse<Tag>>(API_ENDPOINTS.TAGS.UPDATE(id), { name }),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(API_ENDPOINTS.TAGS.DELETE(id)),
};
