import api from '../../services/apiClient';
import { API_ENDPOINTS } from '../../constants';
import type { ApiResponse, Comment } from '../../types';

export interface CreateCommentData {
  content: string;
  parentId?: string;
}

export const commentsApi = {
  list: (postId: string) =>
    api.get<ApiResponse<Comment[]>>(API_ENDPOINTS.COMMENTS.LIST(postId)),

  create: (postId: string, data: CreateCommentData) =>
    api.post<ApiResponse<Comment>>(API_ENDPOINTS.COMMENTS.CREATE(postId), data),

  update: (id: string, data: { content: string }) =>
    api.patch<ApiResponse<Comment>>(API_ENDPOINTS.COMMENTS.UPDATE(id), data),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(API_ENDPOINTS.COMMENTS.DELETE(id)),
};
