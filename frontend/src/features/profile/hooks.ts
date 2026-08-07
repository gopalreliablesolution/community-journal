import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { profileApi, type UpdateProfileData } from './api';
import { useAuthStore } from '../../store/auth.store';

export const profileKeys = {
  all: ['profile'] as const,
  detail: (username: string) => ['profile', username] as const,
  posts: (username: string) => ['profile', username, 'posts'] as const,
  myPosts: ['profile', 'myPosts'] as const,
  myDrafts: ['profile', 'myDrafts'] as const,
  followers: (username: string) => ['profile', username, 'followers'] as const,
  following: (username: string) => ['profile', username, 'following'] as const,
};

export function useProfile(username: string) {
  return useQuery({
    queryKey: profileKeys.detail(username),
    queryFn: async () => {
      const response = await profileApi.getProfile(username);
      return response.data.data;
    },
    enabled: !!username,
  });
}

export function useUserPosts(username: string, page = 1, limit = 10) {
  return useQuery({
    queryKey: [...profileKeys.posts(username), { page, limit }],
    queryFn: async () => {
      const response = await profileApi.getUserPosts(username, page, limit);
      return response.data;
    },
    enabled: !!username,
  });
}

export function useMyPosts(page = 1, limit = 10) {
  return useQuery({
    queryKey: [...profileKeys.myPosts, { page, limit }],
    queryFn: async () => {
      const response = await profileApi.getMyPosts(page, limit);
      return response.data;
    },
  });
}

export function useMyDrafts(page = 1, limit = 10) {
  return useQuery({
    queryKey: [...profileKeys.myDrafts, { page, limit }],
    queryFn: async () => {
      const response = await profileApi.getMyDrafts(page, limit);
      return response.data;
    },
  });
}

export function useFollowers(username: string) {
  return useQuery({
    queryKey: profileKeys.followers(username),
    queryFn: async () => {
      const response = await profileApi.getFollowers(username);
      return response.data.data;
    },
    enabled: !!username,
  });
}

export function useFollowing(username: string) {
  return useQuery({
    queryKey: profileKeys.following(username),
    queryFn: async () => {
      const response = await profileApi.getFollowing(username);
      return response.data.data;
    },
    enabled: !!username,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileData) => profileApi.updateProfile(data),
    onSuccess: (response) => {
      const user = response.data.data;
      queryClient.setQueryData(profileKeys.detail(user.username), (old: any) => ({
        ...old,
        ...user,
      }));
      toast.success('Profile updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to update profile');
    },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => profileApi.uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
      toast.success('Avatar updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to upload avatar');
    },
  });
}

export function useFollow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => profileApi.follow(userId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: profileKeys.all });
      return { previous: queryClient.getQueriesData({ queryKey: profileKeys.all }) };
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        context.previous.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      toast.error('Failed to follow');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });
}

export function useUnfollow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => profileApi.unfollow(userId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: profileKeys.all });
      return { previous: queryClient.getQueriesData({ queryKey: profileKeys.all }) };
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        context.previous.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      toast.error('Failed to unfollow');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });
}

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await profileApi.getDashboard();
      return response.data.data;
    },
  });
}

export function useMyStats() {
  return useQuery({
    queryKey: ['myStats'],
    queryFn: async () => {
      const response = await profileApi.getStats();
      return response.data.data;
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      profileApi.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to change password');
    },
  });
}

export function useDeleteAccount() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (password: string) => profileApi.deleteAccount({ password }),
    onSuccess: () => {
      logout();
      queryClient.clear();
      navigate('/');
      toast.success('Account deleted');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to delete account');
    },
  });
}

export function useClearHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => profileApi.clearHistory(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
      toast.success('Reading history cleared');
    },
    onError: () => {
      toast.error('Failed to clear history');
    },
  });
}

export function useDeleteHistoryEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => profileApi.deleteHistoryEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
      toast.success('History entry removed');
    },
    onError: () => {
      toast.error('Failed to remove history entry');
    },
  });
}

export function usePreferences() {
  return useQuery({
    queryKey: ['preferences'],
    queryFn: async () => {
      const response = await profileApi.getPreferences();
      return response.data.data;
    },
  });
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { emailNotifications?: boolean; theme?: string; language?: string }) =>
      profileApi.updatePreferences(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preferences'] });
      toast.success('Preferences saved');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Failed to save preferences');
    },
  });
}
