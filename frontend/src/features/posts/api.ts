import api from '../../services/apiClient';
import { API_ENDPOINTS } from '../../constants';
import type { ApiResponse, PaginatedResponse, Post } from '../../types';

export interface PostListParams {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  author?: string;
  status?: 'DRAFT' | 'PUBLISHED';
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
}

export interface CreatePostData {
  title: string;
  excerpt: string;
  contentHtml: string;
  contentJson: string;
  coverImageId?: string;
  metaTitle?: string;
  metaDescription?: string;
  categoryIds?: string[];
  tagNames?: string[];
}

export interface UpdatePostData extends Partial<CreatePostData> {
  status?: 'DRAFT' | 'PUBLISHED';
}

export const postsApi = {
  list: (params?: PostListParams) =>
    api.get<PaginatedResponse<Post>>(API_ENDPOINTS.POSTS.LIST, { params }),

  detail: (slug: string) =>
    api.get<ApiResponse<Post>>(API_ENDPOINTS.POSTS.DETAIL(slug)),

  create: (data: CreatePostData) =>
    api.post<ApiResponse<Post>>(API_ENDPOINTS.POSTS.CREATE, data),

  update: (id: string, data: UpdatePostData) =>
    api.patch<ApiResponse<Post>>(API_ENDPOINTS.POSTS.UPDATE(id), data),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(API_ENDPOINTS.POSTS.DELETE(id)),

  publish: (id: string) =>
    api.patch<ApiResponse<Post>>(API_ENDPOINTS.POSTS.PUBLISH(id)),

  autosave: (id: string, data: Partial<CreatePostData>) =>
    api.patch<ApiResponse<Post>>(API_ENDPOINTS.POSTS.AUTOSAVE(id), data),

  preview: (slug: string) =>
    api.get<ApiResponse<Post>>(API_ENDPOINTS.POSTS.PREVIEW(slug)),

  stats: (slug: string) =>
    api.get<ApiResponse<{ views: number; likes: number; comments: number; bookmarks: number }>>(
      API_ENDPOINTS.POSTS.STATS(slug)
    ),
};
