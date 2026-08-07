import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { mediaApi } from './api';

export const mediaKeys = {
  all: ['media'] as const,
  list: (query?: string) => [...mediaKeys.all, 'list', query] as const,
};

export function useUploadMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => mediaApi.upload(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.all });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Upload failed');
    },
  });
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => mediaApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.all });
      toast.success('Media deleted');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error?.message || 'Delete failed');
    },
  });
}

export function useSearchMedia(query?: string) {
  return useQuery({
    queryKey: mediaKeys.list(query),
    queryFn: async () => {
      const response = await mediaApi.search(query);
      return response.data.data;
    },
    enabled: !!query,
  });
}
