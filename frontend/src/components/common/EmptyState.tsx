import { FileText, Bookmark, Bell, Users } from 'lucide-react';
import { cn } from '../../utils/formatters';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: 'posts' | 'bookmarks' | 'notifications' | 'users';
  action?: React.ReactNode;
  className?: string;
}

const icons = {
  posts: FileText,
  bookmarks: Bookmark,
  notifications: Bell,
  users: Users,
};

export function EmptyState({
  title,
  description,
  icon = 'posts',
  action,
  className,
}: EmptyStateProps) {
  const Icon = icons[icon];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-gold-light flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gold" />
      </div>
      <h3 className="text-lg font-semibold text-text-heading mb-2">{title}</h3>
      <p className="text-text-secondary max-w-md mb-6">{description}</p>
      {action}
    </div>
  );
}
