import { forwardRef } from 'react';
import { cn } from '../../utils/formatters';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

// Inline style maps — avoids Tailwind v4 custom CSS-variable color resolution issues
const variantStyles: Record<string, React.CSSProperties> = {
  primary: {
    backgroundColor: '#C89B3C',
    color: '#ffffff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    border: 'none',
  },
  secondary: {
    backgroundColor: 'transparent',
    color: '#C89B3C',
    border: '1px solid #C89B3C',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: '#C89B3C',
    border: 'none',
  },
  danger: {
    backgroundColor: '#DC3545',
    color: '#ffffff',
    border: 'none',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
  },
};

const sizeStyles: Record<string, React.CSSProperties> = {
  sm: { padding: '6px 12px', fontSize: '0.875rem' },
  md: { padding: '8px 16px', fontSize: '1rem' },
  lg: { padding: '12px 24px', fontSize: '1.125rem' },
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loading = false,
      disabled,
      style,
      children,
      onMouseEnter,
      onMouseLeave,
      ...props
    },
    ref
  ) => {
    const baseClass =
      'inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer';

    const hoverMap: Record<string, Partial<React.CSSProperties>> = {
      primary: { backgroundColor: '#A67C1F', boxShadow: '0 4px 12px rgba(200,155,60,0.35)' },
      secondary: { backgroundColor: '#F7EAD2' },
      ghost: { backgroundColor: 'rgba(200,155,60,0.12)' },
      danger: { backgroundColor: '#c82333' },
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled && !isLoading && !loading) {
        Object.assign(e.currentTarget.style, hoverMap[variant ?? 'primary']);
      }
      onMouseEnter?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled && !isLoading && !loading) {
        Object.assign(e.currentTarget.style, variantStyles[variant ?? 'primary']);
        // Re-apply any caller-passed overrides
        if (style) Object.assign(e.currentTarget.style, style);
      }
      onMouseLeave?.(e);
    };

    return (
      <button
        ref={ref}
        className={cn(baseClass, className)}
        style={{
          ...variantStyles[variant ?? 'primary'],
          ...sizeStyles[size ?? 'md'],
          ...style,
        }}
        disabled={disabled || isLoading || loading}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {(isLoading || loading) && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
