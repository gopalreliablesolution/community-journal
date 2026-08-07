import { forwardRef } from 'react';
import { cn } from '../../utils/formatters';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const FormTextarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-neutral-charcoal mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 rounded-lg border bg-white text-neutral-charcoal transition-colors resize-y min-h-[100px]',
            'placeholder:text-neutral-muted',
            'focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold',
            'disabled:bg-neutral-lightgray disabled:cursor-not-allowed',
            error
              ? 'border-status-error focus:ring-status-error/20 focus:border-status-error'
              : 'border-neutral-gray',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-status-error">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-neutral-darkgray">{helperText}</p>
        )}
      </div>
    );
  }
);

FormTextarea.displayName = 'FormTextarea';

export default FormTextarea;
