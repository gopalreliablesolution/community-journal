import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { bookmarksApi } from './api';

export const bookmarkKeys = {
  all: ['bookmarks'] as const,
  list: (page: number) => [...bookmarkKeys.all, 'list', page] as const,
  status: (postId: string) => [...bookmarkKeys.all, 'status', postId] as const,
};

export function useBookmarkStatus(postId: string) {
  return useQuery({
    queryKey: bookmarkKeys.status(postId),
    queryFn: async () => {
      const response = await bookmarksApi.check(postId);
      return response.data.data.bookmarked;
    },
    enabled: !!postId,
  });
}

export function useToggleBookmark(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const currentStatus = queryClient.getQueryData<boolean>(bookmarkKeys.status(postId));
      return bookmarksApi.toggle(postId, currentStatus);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: bookmarkKeys.status(postId) });
      const previous = queryClient.getQueryData<boolean>(bookmarkKeys.status(postId));
      const nextStatus = !previous;
      queryClient.setQueryData(bookmarkKeys.status(postId), nextStatus);
      return { previous, nextStatus };
    },
    onSuccess: (_data, _variables, context) => {
      if (context?.nextStatus) {
        toast.success('Article saved to bookmarks');
      } else {
        toast.success('Bookmark removed');
      }
    },
    onError: (_err, _variables, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(bookmarkKeys.status(postId), context.previous);
      }
      toast.error('Please sign in to save bookmarks');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.status(postId) });
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.all });
    },
  });
}

export function useBookmarks(page = 1, limit = 10) {
  return useQuery({
    queryKey: bookmarkKeys.list(page),
    queryFn: async () => {
      const response = await bookmarksApi.list(page, limit);
      return response.data;
    },
  });
}
