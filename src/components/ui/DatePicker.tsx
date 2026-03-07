'use client';

import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

interface DatePickerProps {
  id?: string;
  name?: string;
  value?: string;
  onChange?: (date: string) => void;
  minDateTime?: string;
  maxDateTime?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  placeholder?: string;
  error?: string;
}

export const DatePicker = ({
  id,
  name,
  value = '',
  onChange,
  minDateTime,
  maxDateTime,
  disabled = false,
  required = false,
  className = '',
  placeholder = 'Selectează data și ora livrării',
  error,
}: DatePickerProps) => {
  const [selectedDateTime, setSelectedDateTime] = useState(value);

  // Set default minDateTime to current time if not provided
  const defaultMinDateTime = minDateTime || new Date().toISOString().slice(0, 16);

  useEffect(() => {
    setSelectedDateTime(value);
  }, [value]);

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDateTime = e.target.value;
    setSelectedDateTime(newDateTime);
    if (onChange) {
      onChange(newDateTime);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="datetime-local"
          id={id}
          name={name}
          value={selectedDateTime}
          onChange={handleDateTimeChange}
          min={defaultMinDateTime}
          max={maxDateTime}
          disabled={disabled}
          required={required}
          className={`w-full px-4 py-2 pr-10 border rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-[var(--card)] text-[var(--foreground)] ${
            error ? 'border-[var(--destructive)]' : 'border-[var(--border)]'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
          placeholder={placeholder}
        />
        <Calendar 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--muted-foreground)] pointer-events-none" 
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-[var(--destructive)]">{error}</p>
      )}
    </div>
  );
};

export default DatePicker;
