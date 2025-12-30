import { FC, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface TagProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  isRemovable?: boolean;
  onRemove?: () => void;
}

const Tag: FC<TagProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  onClick,
  isRemovable = false,
  onRemove,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center rounded-full font-medium transition-colors';
  
  const variants = {
    default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    primary: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    success: 'bg-green-100 text-green-800 hover:bg-green-200',
    warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    error: 'bg-red-100 text-red-800 hover:bg-red-200',
    outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.();
  };

  return (
    <div
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        onClick || isRemovable ? 'cursor-pointer' : '',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
      {isRemovable && (
        <button
          type="button"
          onClick={handleRemove}
          className="ml-1.5 rounded-full p-0.5 hover:bg-black/10 focus:outline-none"
          aria-label="Remove tag"
        >
          <svg
            className="h-3 w-3"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export { Tag };
