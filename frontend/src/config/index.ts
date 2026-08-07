export const FEATURES = {
  COMMENTS: true,
  FOLLOW_SYSTEM: true,
  NOTIFICATIONS: true,
  BOOKMARKS: true,
  ANALYTICS: false,
  NEWSLETTER: false,
  AI_WRITING: false,
} as const;

export const APP_CONFIG = {
  name: 'Inkora',
  description: 'A modern blogging platform for writers and creators',
  url: import.meta.env.VITE_APP_URL || 'http://localhost:3000',
  apiUrl: import.meta.env.VITE_API_URL || '/api/v1',
} as const;
