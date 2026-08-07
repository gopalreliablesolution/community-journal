import api from '../../services/apiClient';
import { API_ENDPOINTS } from '../../constants';
import type { ApiResponse, PaginatedResponse, Post } from '../../types';

export interface BookmarkItem {
  id: string;
  post: Post;
  createdAt: string;
}

export const bookmarksApi = {
  check: (postId: string) =>
    api.get<ApiResponse<{ bookmarked: boolean }>>(API_ENDPOINTS.BOOKMARKS.CHECK(postId)),

  toggle: (postId: string, isBookmarked?: boolean) => {
    if (isBookmarked) {
      return api.delete<ApiResponse<any>>(API_ENDPOINTS.BOOKMARKS.TOGGLE(postId));
    } else {
      return api.post<ApiResponse<any>>(API_ENDPOINTS.BOOKMARKS.TOGGLE(postId));
    }
  },

  list: (page?: number, limit?: number) =>
    api.get<PaginatedResponse<BookmarkItem>>(API_ENDPOINTS.BOOKMARKS.LIST, {
      params: { page, limit },
    }),
};
