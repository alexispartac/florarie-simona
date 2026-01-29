import { FC, ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  overlayClassName?: string;
  contentClassName?: string;
  titleClassName?: string;
  bodyClassName?: string;
  footer?: ReactNode;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

const InfoModal: FC<InfoModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  overlayClassName = '',
  contentClassName = '',
  titleClassName = '',
  bodyClassName = '',
  footer,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}) => {
  // Handle Escape key press
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  // Don't render if not open
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  const modalContent = (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4',
        'bg-black bg-opacity-50 backdrop-blur-sm',
        'transition-opacity duration-300',
        overlayClassName
      )}
      onClick={closeOnOverlayClick ? onClose : undefined}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn(
          'relative w-full rounded-lg bg-[var(--card)] p-6 shadow-xl',
          'max-h-[90vh] overflow-y-auto',
          sizeClasses[size],
          'transform transition-all duration-300',
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
          contentClassName
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            className={cn(
              'absolute right-4 top-4 rounded-md p-1 text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--muted-foreground)]',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
              'transition-colors duration-200'
            )}
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {(title || footer) && (
          <div className="flex items-start justify-between">
            {title && (
              <h2
                className={cn(
                  'text-lg font-semibold text-[var(--foreground)]',
                  titleClassName
                )}
              >
                {title}
              </h2>
            )}
          </div>
        )}

        <div className={cn('mt-4', bodyClassName)}>{children}</div>

        {footer && (
          <div className="mt-6 flex justify-end space-x-3">{footer}</div>
        )}
      </div>
    </div>
  );

  // Use createPortal to render the modal outside the normal DOM hierarchy
  return createPortal(modalContent, document.body);
};

export { InfoModal };
