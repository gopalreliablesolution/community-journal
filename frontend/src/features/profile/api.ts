import api from '../../services/apiClient';
import { API_ENDPOINTS } from '../../constants';
import type { ApiResponse, PaginatedResponse, User, Post } from '../../types';

export interface UpdateProfileData {
  name?: string;
  bio?: string;
}

export interface UserProfile extends User {
  _count: {
    posts: number;
    followers: number;
    following: number;
  };
  isFollowing?: boolean;
}

export const profileApi = {
  getProfile: (username: string) =>
    api.get<ApiResponse<UserProfile>>(API_ENDPOINTS.USERS.PROFILE(username)),

  updateProfile: (data: UpdateProfileData) =>
    api.patch<ApiResponse<User>>(API_ENDPOINTS.ME.PROFILE, data),

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post<ApiResponse<{ id: string; path: string }>>(
      '/profile/avatar',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  },

  getUserPosts: (username: string, page?: number, limit?: number) =>
    api.get<PaginatedResponse<Post>>(API_ENDPOINTS.USERS.POSTS(username), {
      params: { page, limit },
    }),

  getMyPosts: (page?: number, limit?: number) =>
    api.get<PaginatedResponse<Post>>(API_ENDPOINTS.ME.POSTS, {
      params: { page, limit },
    }),

  getMyDrafts: (page?: number, limit?: number) =>
    api.get<PaginatedResponse<Post>>(API_ENDPOINTS.ME.DRAFTS, {
      params: { page, limit },
    }),

  follow: (userId: string) =>
    api.post<ApiResponse<{ following: boolean }>>(API_ENDPOINTS.USERS.FOLLOW(userId)),

  unfollow: (userId: string) =>
    api.delete<ApiResponse<{ following: boolean }>>(API_ENDPOINTS.USERS.FOLLOW(userId)),

  getFollowers: (username: string) =>
    api.get<ApiResponse<User[]>>(API_ENDPOINTS.USERS.FOLLOWERS(username)),

  getFollowing: (username: string) =>
    api.get<ApiResponse<User[]>>(API_ENDPOINTS.USERS.FOLLOWING(username)),

  getDashboard: () =>
    api.get<ApiResponse<import('../../types').Dashboard>>(API_ENDPOINTS.ME.DASHBOARD),

  getStats: () =>
    api.get<ApiResponse<import('../../types').PostStats>>(API_ENDPOINTS.ME.STATS),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.patch<ApiResponse<null>>(API_ENDPOINTS.ME.PASSWORD, data),

  deleteAccount: (data: { password: string }) =>
    api.delete<ApiResponse<null>>('/me', { data }),

  clearHistory: () =>
    api.delete<ApiResponse<null>>(API_ENDPOINTS.ME.HISTORY),

  deleteHistoryEntry: (id: string) =>
    api.delete<ApiResponse<null>>(`${API_ENDPOINTS.ME.HISTORY}/${id}`),

  getPreferences: () =>
    api.get<ApiResponse<import('../../types').UserPreference>>(API_ENDPOINTS.ME.PREFERENCES),

  updatePreferences: (data: { emailNotifications?: boolean; theme?: string; language?: string }) =>
    api.patch<ApiResponse<import('../../types').UserPreference>>(API_ENDPOINTS.ME.PREFERENCES, data),
};
