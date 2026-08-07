import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/formatters';

interface DropdownItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
}

interface DropdownProps {
  items: DropdownItem[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  trigger?: React.ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

export default function Dropdown({
  items,
  value,
  onChange,
  placeholder = 'Select...',
  trigger,
  align = 'left',
  className,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedItem = items.find((item) => item.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={cn('relative inline-block', className)}>
      {trigger ? (
        <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
          {trigger}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 border border-neutral-gray rounded-lg bg-white hover:border-gold transition-colors"
        >
          <span className={cn(!selectedItem && 'text-neutral-muted')}>
            {selectedItem?.label || placeholder}
          </span>
          <ChevronDown
            size={16}
            className={cn('transition-transform', isOpen && 'rotate-180')}
          />
        </button>
      )}

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-1 min-w-full bg-white border border-neutral-gray rounded-lg shadow-md overflow-hidden',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {items.map((item) => (
            <button
              key={item.value}
              type="button"
              disabled={item.disabled}
              onClick={() => {
                onChange?.(item.value);
                setIsOpen(false);
              }}
              className={cn(
                'w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition-colors',
                item.disabled && 'opacity-50 cursor-not-allowed',
                item.danger
                  ? 'text-status-error hover:bg-red-50'
                  : item.value === value
                  ? 'bg-gold-light text-gold-dark'
                  : 'hover:bg-neutral-lightgray text-neutral-charcoal'
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
