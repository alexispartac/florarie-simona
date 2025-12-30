// src/app/admin/components/OrderStatusModal.tsx
'use client';

import { Order, OrderStatus } from '@/types/orders';
import { InfoModal } from '@/components/ui/InfoModal';

interface OrderStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onStatusChange: (status: OrderStatus) => void;
}

export function OrderStatusModal({ isOpen, onClose, order, onStatusChange }: OrderStatusModalProps) {
  if (!order) return null;

  return (
    <InfoModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Update Order #${order.orderId} Status`}
      size="md"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {(['processing', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => {
                onStatusChange(status);
                onClose();
              }}
              disabled={order.status === status}
              className={`justify-center px-4 py-2 rounded-md text-sm font-medium ${
                status === 'delivered' ? 'bg-green-100 hover:bg-green-200 text-green-800' :
                status === 'cancelled' ? 'bg-red-100 hover:bg-red-200 text-red-800' :
                status === 'shipped' ? 'bg-blue-100 hover:bg-blue-200 text-blue-800' :
                `bg-yellow-100 hover:bg-yellow-200 text-yellow-800 `
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </InfoModal>
  );
}