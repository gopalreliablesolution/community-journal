import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authApi, type LoginData, type RegisterData } from './api';
import { useAuthStore } from '../../store/auth.store';
import { ROUTES } from '../../constants';

export const AUTH_KEYS = {
  me: ['auth', 'me'] as const,
};

export function useLogin() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginData) => authApi.login(data),
    onSuccess: (response) => {
      const { accessToken, refreshToken, user } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setUser(user);
      toast.success('Welcome back!');
      navigate(ROUTES.HOME);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Login failed');
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: RegisterData) => authApi.register(data),
    onSuccess: (response) => {
      const { accessToken, refreshToken, user } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setUser(user);
      toast.success('Account created successfully!');
      navigate(ROUTES.HOME);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Registration failed');
    },
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      logout();
      queryClient.clear();
      navigate(ROUTES.LOGIN);
      toast.success('Logged out');
    },
    onError: () => {
      logout();
      queryClient.clear();
      navigate(ROUTES.LOGIN);
    },
  });
}

export function useCurrentUser() {
  const { setUser } = useAuthStore();

  return useQuery({
    queryKey: AUTH_KEYS.me,
    queryFn: async () => {
      const response = await authApi.getMe();
      setUser(response.data.data);
      return response.data.data;
    },
    enabled: !!localStorage.getItem('accessToken'),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
    onSuccess: () => {
      toast.success('Password reset email sent!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to send email');
    },
  });
}

export function useResetPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authApi.resetPassword(token, password),
    onSuccess: () => {
      toast.success('Password reset successful!');
      navigate(ROUTES.LOGIN);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Reset failed');
    },
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (token: string) => authApi.verifyEmail(token),
    onSuccess: () => {
      toast.success('Email verified successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Verification failed');
    },
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: (email: string) => authApi.resendVerification(email),
    onSuccess: () => {
      toast.success('Verification email sent!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to resend');
    },
  });
}

export function useCheckUsername() {
  return useMutation({
    mutationFn: (username: string) => authApi.checkUsername(username),
  });
}
