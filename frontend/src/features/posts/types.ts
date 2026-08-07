import type { Post } from '../../types';

export interface PostListParams {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  author?: string;
  status?: 'DRAFT' | 'PUBLISHED';
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
}

export interface CreatePostFormData {
  title: string;
  excerpt: string;
  contentHtml: string;
  contentJson: string;
  coverImageId?: string;
  metaTitle?: string;
  metaDescription?: string;
  categoryIds: string[];
  tagNames: string[];
}

export type { Post };
