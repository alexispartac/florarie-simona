import { InputHTMLAttributes, forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>((
  {
    className,
    label,
    error,
    leftIcon,
    rightIcon,
    fullWidth = false,
    containerClassName,
    labelClassName,
    errorClassName,
    id,
    ...props
  },
  ref
) => {
  const generatedId = useId();
  const inputId = id || `input-${generatedId}`;

  return (
    <div className={cn('space-y-1.5', fullWidth ? 'w-full' : 'w-fit', containerClassName)}>
      {label && (
        <label 
          htmlFor={inputId}
          className={cn('block text-sm font-medium text-[var(--foreground)]', labelClassName)}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'border-[var(--destructive)] focus-visible:ring-red-200',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className={cn('text-sm text-[var(--destructive)]', errorClassName)}>
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };
