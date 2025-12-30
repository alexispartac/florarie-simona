import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  options: { value: string; label: string }[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      fullWidth = false,
      containerClassName,
      labelClassName,
      errorClassName,
      options,
      ...props
    },
    ref
  ) => {
    const id = React.useId();
    const selectId = props.id || `select-${id}`;

    return (
      <div className={cn('space-y-1.5', fullWidth ? 'w-full' : 'w-fit', containerClassName)}>
        {label && (
          <label
            htmlFor={selectId}
            className={cn('block text-sm font-medium text-gray-700', labelClassName, {
              'text-red-500': error,
            })}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            className={cn(
              'h-10 w-full appearance-none rounded-md border border-input bg-background pl-3 pr-8 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              className,
              { 'border-red-500': error }
            )}
            ref={ref}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>
        {error && (
          <p className={cn('text-sm text-red-500', errorClassName)}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };
