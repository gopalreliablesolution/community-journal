export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: boolean;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  role: 'MEMBER' | 'ADMIN';
  status: 'ACTIVE' | 'BANNED';
  emailVerifiedAt?: string;
  createdAt: string;
  avatar?: {
    id: string;
    path: string;
  };
  _count?: {
    posts?: number;
    followers?: number;
    bookmarks?: number;
  };
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  contentHtml?: string;
  contentJson?: string;
  coverImage?: {
    id: string;
    path: string;
  };
  metaTitle?: string;
  metaDescription?: string;
  readingTime?: number;
  status: 'DRAFT' | 'PUBLISHED';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    username: string;
    bio?: string;
    avatar?: {
      path: string;
    };
  };
  categories?: Array<{
    category: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
  tags?: Array<{
    tag: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
  _count?: {
    likes?: number;
    comments?: number;
    views?: number;
  };
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    username: string;
    avatar?: {
      path: string;
    };
  };
  replies?: Comment[];
  _count?: {
    replies?: number;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  _count?: {
    posts?: number;
  };
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  _count?: {
    posts?: number;
  };
}

export interface Notification {
  id: string;
  type: 'LIKE' | 'COMMENT' | 'REPLY' | 'FOLLOW' | 'BOOKMARK' | 'SYSTEM' | 'ADMIN';
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
  actor?: {
    id: string;
    name: string;
    username: string;
    avatar?: {
      path: string;
    };
  };
  post?: {
    id: string;
    slug: string;
    title: string;
  };
}

export interface Media {
  id: string;
  filename: string;
  originalName: string;
  path: string;
  type: string;
  size: number;
  mime: string;
  width?: number;
  height?: number;
  createdAt: string;
}

export interface Dashboard {
  recentPosts: Post[];
  drafts: number;
  published: number;
  totalViews: number;
  totalLikes: number;
  unreadNotifications: number;
  recentBookmarks: Array<{
    id: string;
    post: {
      id: string;
      title: string;
      slug: string;
    };
  }>;
}

export interface AdminStats {
  totalUsers: number;
  totalPosts: number;
  totalPublished: number;
  totalDrafts: number;
  totalComments: number;
  totalViews: number;
  newUsersToday: number;
  topCategories: Array<{
    id: string;
    name: string;
    slug: string;
    postCount: number;
  }>;
  topTags: Array<{
    id: string;
    name: string;
    slug: string;
    postCount: number;
  }>;
  recentPosts: Array<{
    id: string;
    title: string;
    slug: string;
    status: string;
    createdAt: string;
    publishedAt: string | null;
    author: { id: string; name: string; username: string };
    _count: { likes: number; comments: number; views: number };
  }>;
  activeUsers: Array<{
    id: string;
    name: string;
    username: string;
    lastActiveAt: string | null;
    avatar: { path: string } | null;
    _count: { posts: number };
  }>;
}

export interface PostStats {
  views: number;
  likes: number;
  comments: number;
  bookmarks: number;
}

export interface UserPreference {
  id: string;
  userId: string;
  emailNotifications: boolean;
  theme: string;
  language: string;
}
