import { cn } from '../../utils/formatters';

interface FormErrorProps {
  message?: string;
  className?: string;
}

export default function FormError({ message, className }: FormErrorProps) {
  if (!message) return null;

  return (
    <p className={cn('text-sm text-status-error', className)}>
      {message}
    </p>
  );
}
