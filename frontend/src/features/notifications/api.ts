import api from '../../services/apiClient';
import { API_ENDPOINTS } from '../../constants';
import type { ApiResponse, Notification } from '../../types';

export const notificationsApi = {
  list: (page?: number, limit?: number) =>
    api.get<ApiResponse<Notification[]>>(API_ENDPOINTS.ME.NOTIFICATIONS, {
      params: { page, limit },
    }),

  markAsRead: (id: string) =>
    api.patch<ApiResponse<Notification>>(`/notifications/${id}/read`),

  markAllAsRead: () =>
    api.patch<ApiResponse<null>>('/notifications/read-all'),

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/notifications/${id}`),

  unreadCount: () =>
    api.get<ApiResponse<{ count: number }>>('/notifications/unread-count'),
};
