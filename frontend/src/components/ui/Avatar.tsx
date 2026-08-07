import { useState, useEffect } from 'react';
import { cn, getInitials, getImageUrl } from '../../utils/formatters';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ src, alt, name, size = 'md', className }: AvatarProps) {
  const [hasError, setHasError] = useState(false);

  // Reset error state when src changes
  useEffect(() => {
    setHasError(false);
  }, [src]);

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const imageSrc = getImageUrl(src);

  if (imageSrc && !hasError) {
    return (
      <img
        src={imageSrc}
        alt={alt || name}
        className={cn(
          'rounded-full object-cover flex-shrink-0',
          sizes[size],
          className
        )}
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full font-semibold flex items-center justify-center flex-shrink-0',
        sizes[size],
        className
      )}
      style={{
        background: 'rgba(200, 155, 60, 0.15)',
        color: '#C89B3C',
        fontWeight: 700,
        border: '1px solid rgba(200, 155, 60, 0.3)',
      }}
    >
      {getInitials(name)}
    </div>
  );
}
