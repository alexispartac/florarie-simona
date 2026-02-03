// src/components/ui/ConfirmationModal.tsx
import Button from '@/components/ui/Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  isDeleting?: boolean;
  variant?: 'default' | 'destructive' | 'outline' | 'primary';
}

export function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  onClose,
  isDeleting = false,
  variant = 'destructive',
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const handleCancel = () => {
    if (onCancel) onCancel();
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--card)] rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">{title}</h3>
        <p className="text-[var(--muted-foreground)] mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isDeleting}
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}