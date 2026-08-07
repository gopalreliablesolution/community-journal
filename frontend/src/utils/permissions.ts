import type { User, Post } from '../types';

export const Role = {
  MEMBER: 'MEMBER',
  ADMIN: 'ADMIN',
} as const;

export type Role = typeof Role[keyof typeof Role];

export const canCreatePost = (user: User | null): boolean => {
  return !!user;
};

export const canEditPost = (user: User | null, post: Post): boolean => {
  if (!user) return false;
  return user.id === post.author.id || user.role === Role.ADMIN;
};

export const canDeletePost = (user: User | null, post: Post): boolean => {
  if (!user) return false;
  return user.id === post.author.id || user.role === Role.ADMIN;
};

export const canAccessAdmin = (user: User | null): boolean => {
  return user?.role === Role.ADMIN;
};

export const canManageUsers = (user: User | null): boolean => {
  return user?.role === Role.ADMIN;
};

export const canFollowUser = (currentUser: User | null, targetUserId: string): boolean => {
  if (!currentUser) return false;
  return currentUser.id !== targetUserId;
};

export const canComment = (user: User | null): boolean => {
  return !!user;
};

export const canLike = (user: User | null): boolean => {
  return !!user;
};

export const canBookmark = (user: User | null): boolean => {
  return !!user;
};
