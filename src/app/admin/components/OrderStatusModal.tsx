'use client';

import { useState } from 'react';
import { InfoModal } from '@/components/ui/InfoModal';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { Order, OrderStatus } from '@/types/orders';

interface OrderStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onStatusChange: (status: OrderStatus) => Promise<void> | void;
}

export function OrderStatusModal({ isOpen, onClose, order, onStatusChange }: OrderStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!order) return null;

  const handleStatusSelect = (status: OrderStatus) => {
    setSelectedStatus(status);
    setIsConfirmOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    if (!selectedStatus) return;
    
    setIsUpdating(true);
    try {
      await onStatusChange(selectedStatus);
      setIsConfirmOpen(false);
      onClose();
    } catch (error) {
      console.error('Error updating order status:', error);
      // You might want to show a toast notification here
    } finally {
      setIsUpdating(false);
    }
  };

  const statusConfig = {
    processing: {
      bg: 'bg-yellow-100 hover:bg-yellow-200',
      text: 'text-yellow-800',
      label: 'Processing'
    },
    shipped: {
      bg: 'bg-blue-100 hover:bg-blue-200',
      text: 'text-blue-800',
      label: 'Shipped'
    },
    delivered: {
      bg: 'bg-green-100 hover:bg-green-200',
      text: 'text-green-800',
      label: 'Delivered'
    },
    cancelled: {
      bg: 'bg-red-100 hover:bg-red-200',
      text: 'text-red-800',
      label: 'Cancelled'
    }
  };

  return (
    <>
      <InfoModal 
        isOpen={isOpen} 
        onClose={onClose} 
        title={`Update Order #${order.orderId} Status`}
        size="md"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {(Object.keys(statusConfig) as OrderStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => handleStatusSelect(status)}
                disabled={order.status === status || isUpdating}
                className={`justify-center px-4 py-2 rounded-md text-sm font-medium ${
                  statusConfig[status as keyof typeof statusConfig].bg
                } ${statusConfig[status as keyof typeof statusConfig].text} ${
                  order.status === status || isUpdating
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer'
                }`}
              >
                {statusConfig[status as keyof typeof statusConfig].label}
              </button>
            ))}
          </div>
          <ConfirmationModal
            isOpen={isConfirmOpen}
            title="Confirm Status Update"
            message={`Are you sure you want to update the order status to "${selectedStatus}"?`}
            confirmText="Update Status"
            cancelText="Cancel"
            isDeleting={isUpdating}
            onConfirm={handleConfirmStatusChange}
            onCancel={() => {
              setIsConfirmOpen(false);
              setSelectedStatus(null);
            }}
          />
        </div>
      </InfoModal>

    </>
  );
}