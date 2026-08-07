import { cn } from '../../utils/formatters';
import { CATEGORY_COLORS } from '../../constants';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'category' | 'status';
  categorySlug?: string;
  status?: 'DRAFT' | 'PUBLISHED';
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  categorySlug,
  status,
  className,
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';

  if (variant === 'category' && categorySlug) {
    const colors = CATEGORY_COLORS[categorySlug] || {
      bg: '#F1F1F1',
      text: '#6B6B6B',
    };
    return (
      <span
        className={cn(baseStyles, className)}
        style={{ backgroundColor: colors.bg, color: colors.text }}
      >
        {children}
      </span>
    );
  }

  if (variant === 'status') {
    const statusStyles = {
      DRAFT: 'bg-neutral-lightgray text-text-secondary',
      PUBLISHED: 'bg-status-success/10 text-status-success',
    };
    return (
      <span className={cn(baseStyles, statusStyles[status || 'DRAFT'], className)}>
        {children}
      </span>
    );
  }

  return (
    <span
      className={cn(
        baseStyles,
        'bg-gold-light text-gold-dark',
        className
      )}
    >
      {children}
    </span>
  );
}
