import api from '../../services/apiClient';
import { API_ENDPOINTS } from '../../constants';
import type { ApiResponse, User } from '../../types';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export const authApi = {
  login: (data: LoginData) =>
    api.post<ApiResponse<AuthResponse>>(API_ENDPOINTS.AUTH.LOGIN, data),

  register: (data: RegisterData) =>
    api.post<ApiResponse<AuthResponse>>(API_ENDPOINTS.AUTH.REGISTER, data),

  logout: () => api.post<ApiResponse<null>>(API_ENDPOINTS.AUTH.LOGOUT),

  getMe: () => api.get<ApiResponse<User>>(API_ENDPOINTS.AUTH.ME),

  refresh: (refreshToken: string) =>
    api.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    ),

  forgotPassword: (email: string) =>
    api.post<ApiResponse<null>>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }),

  resetPassword: (token: string, password: string) =>
    api.post<ApiResponse<null>>(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      token,
      password,
    }),

  verifyEmail: (token: string) =>
    api.post<ApiResponse<null>>(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token }),

  resendVerification: (email: string) =>
    api.post<ApiResponse<null>>(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, { email }),

  checkUsername: (username: string) =>
    api.get<ApiResponse<{ available: boolean }>>(API_ENDPOINTS.AUTH.CHECK_USERNAME, {
      params: { username },
    }),
};
