import { ButtonHTMLAttributes, FC } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  withHeartbeat?: boolean;
}

const Button: FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  disabled = false,
  withHeartbeat = false,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';
  
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 underline',
  };

  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 py-2 px-4',
    lg: 'h-11 px-8',
  };

  const buttonContent = isLoading ? (
    <span className="flex items-center">
      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></span>
      Loading...
    </span>
  ) : (
    children
  );

  const buttonClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${
    fullWidth ? 'w-full' : ''
  } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''} ${className}`;

  const buttonStyles = withHeartbeat ? `${buttonClasses} relative overflow-hidden` : buttonClasses;

  if (withHeartbeat) {
    return (
      <button
        className={`${buttonStyles} animate-heartbeat`}
        disabled={disabled || isLoading}
        style={{
          animation: 'heartbeat 1.5s ease-in-out infinite',
        }}
        {...props}
      >
        <style jsx global>{`
          @keyframes heartbeat {
            0% { transform: scale(1); }
            14% { transform: scale(1.07); }
            28% { transform: scale(1); }
            42% { transform: scale(1.07); }
            70% { transform: scale(1); }
          }
          .animate-heartbeat:hover {
            animation: none;
            transform: scale(1.05);
          }
        `}</style>
        {buttonContent}
      </button>
    );
  }

  return (
    <button
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {buttonContent}
    </button>
  );
};

export default Button;