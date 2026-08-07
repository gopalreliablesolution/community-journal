import api from '../../services/apiClient';
import { API_ENDPOINTS } from '../../constants';
import type { ApiResponse, Media } from '../../types';

export const mediaApi = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<ApiResponse<Media>>(API_ENDPOINTS.MEDIA.UPLOAD, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || 1)
        );
        return percentCompleted;
      },
    });
  },

  delete: (id: string) =>
    api.delete<ApiResponse<null>>(API_ENDPOINTS.MEDIA.DELETE(id)),

  search: (query?: string, type?: string) =>
    api.get<ApiResponse<Media[]>>(API_ENDPOINTS.MEDIA.SEARCH, {
      params: { q: query, type },
    }),
};
