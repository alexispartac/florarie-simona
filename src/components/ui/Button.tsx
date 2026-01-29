import { ButtonHTMLAttributes, FC } from 'react';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link' | 'cta';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  fullWidth?: boolean;
  withHeartbeat?: boolean;
}

const Button: FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  disabled = false,
  withHeartbeat = false,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';
  
  const variants = {
    primary: 'bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--hover-primary)] shadow-lg hover:shadow-xl active:scale-[0.98] border border-transparent',
    secondary: 'bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--muted)] active:scale-[0.98] border border-[var(--border)]',
    destructive: 'bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:bg-[var(--destructive)]/90 shadow-md hover:shadow-lg active:scale-[0.98] border border-transparent',
    outline: 'border-2 border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--accent)] hover:border-[var(--primary)] active:scale-[0.98]',
    ghost: 'bg-transparent hover:bg-[var(--accent)] text-[var(--foreground)] active:scale-[0.98] border border-transparent',
    link: 'text-[var(--primary)] underline-offset-4 hover:underline hover:text-[var(--hover-primary)] bg-transparent border-none h-auto p-0',
    cta: 'bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--hover-primary)] shadow-2xl shadow-[var(--primary)]/30 hover:shadow-[var(--primary)]/40 active:scale-[0.98] font-semibold border border-transparent',
  };

  const sizes = {
    sm: 'h-9 px-4 py-2 text-sm rounded-md',
    md: 'h-11 px-6 py-2.5 text-base rounded-lg',
    lg: 'h-12 px-10 py-3 text-base lg:text-lg rounded-lg tracking-wide',
    xl: 'h-14 px-12 py-4 text-lg tracking-wider rounded-xl',
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
  } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`;

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