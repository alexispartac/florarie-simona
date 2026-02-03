'use client';

import { useState } from 'react';
import { InfoModal } from '@/components/ui/InfoModal';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { Order, OrderStatus } from '@/types/orders';
import axios from 'axios';

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
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [failureReason, setFailureReason] = useState('');

  if (!order) return null;

  const handleStatusSelect = (status: OrderStatus) => {
    setSelectedStatus(status);
    setIsConfirmOpen(true);
  };

  const handleSendEmail = async (emailType: string) => {
    if (!order) return;
    
    setIsSendingEmail(true);
    try {
      let endpoint = '';
      let payload: any;
      
      switch(emailType) {
        case 'placed':
        case 'pending':
          endpoint = '/api/send-email/placed-order';
          payload = order; // Trimite direct obiectul order
          break;
        case 'confirmed':
          endpoint = '/api/send-email/confirmed-order';
          payload = order; // Trimite direct obiectul order
          break;
        case 'preparing':
          endpoint = '/api/send-email/processed-order';
          payload = order; // Trimite direct obiectul order
          break;
        case 'out-for-delivery':
          endpoint = '/api/send-email/out-for-delivery';
          payload = order; // Trimite direct obiectul order
          break;
        case 'delivered':
          endpoint = '/api/send-email/delivered-order';
          payload = order; // Trimite direct obiectul order
          break;
        case 'cancelled':
          endpoint = '/api/send-email/cancelled-order';
          payload = { order, cancellationReason };
          break;
        case 'failed-delivery':
          endpoint = '/api/send-email/failed-delivery';
          payload = { order, failureReason };
          break;
      }
      
      console.log('Sending email:', { endpoint, payload });
      const response = await axios.post(endpoint, payload);
      
      if (response.data.success) {
        alert('Email trimis cu succes!');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      if (axios.isAxiosError(error) && error.response) {
        alert(`Eroare la trimiterea emailului: ${error.response.data.error || 'Eroare necunoscută'}`);
      } else {
        alert('Eroare la trimiterea emailului!');
      }
    } finally {
      setIsSendingEmail(false);
    }
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
    } finally {
      setIsUpdating(false);
    }
  };

  const statusConfig = {
    pending: {
      bg: 'bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/30',
      text: 'text-yellow-800 dark:text-yellow-400',
      label: 'Pending'
    },
    confirmed: {
      bg: 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-900/30',
      text: 'text-blue-800 dark:text-blue-400',
      label: 'Confirmed'
    },
    preparing: {
      bg: 'bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/20 dark:hover:bg-purple-900/30',
      text: 'text-purple-800 dark:text-purple-400',
      label: 'Preparing'
    },
    'out-for-delivery': {
      bg: 'bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/20 dark:hover:bg-orange-900/30',
      text: 'text-orange-800 dark:text-orange-400',
      label: 'Out for Delivery'
    },
    delivered: {
      bg: 'bg-green-100 hover:bg-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/30',
      text: 'text-green-800 dark:text-green-400',
      label: 'Delivered'
    },
    cancelled: {
      bg: 'bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30',
      text: 'text-red-800 dark:text-red-400',
      label: 'Cancelled'
    },
    'failed-delivery': {
      bg: 'bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/20 dark:hover:bg-rose-900/30',
      text: 'text-rose-800 dark:text-rose-400',
      label: 'Failed Delivery'
    }
  };

  return (
    <>
      <InfoModal 
        isOpen={isOpen} 
        onClose={onClose} 
        title={`Update Order #${order.orderId} Status`}
        size="lg"
      >
        <div className="space-y-6">
          {/* Current Status */}
          <div className="bg-[var(--secondary)] p-4 rounded-lg">
            <p className="text-sm text-[var(--muted-foreground)] mb-1">Status Curent:</p>
            <p className="text-lg font-semibold text-[var(--foreground)]">
              {statusConfig[order.status as keyof typeof statusConfig]?.label || order.status}
            </p>
          </div>

          {/* Status Update Buttons */}
          <div>
            <h3 className="text-sm font-medium text-[var(--foreground)] mb-3">Schimbă Status:</h3>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(statusConfig) as OrderStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusSelect(status)}
                  disabled={order.status === status || isUpdating}
                  className={`justify-center px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                    statusConfig[status as keyof typeof statusConfig].bg
                  } ${statusConfig[status as keyof typeof statusConfig].text} ${
                    order.status === status || isUpdating
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer'
                  }`}
                >
                  {statusConfig[status as keyof typeof statusConfig].label}
                  {order.status === status && ' ✓'}
                </button>
              ))}
            </div>
          </div>

          {/* Email Notifications */}
          <div className="border-t border-[var(--border)] pt-4">
            <h3 className="text-sm font-medium text-[var(--foreground)] mb-3">
              📧 Trimite Email Notificare:
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => handleSendEmail('pending')}
                disabled={isSendingEmail}
                className="w-full px-4 py-2 bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/10 dark:hover:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
              >
                Email: Comandă Plasată (Pending/Confirmed)
              </button>
              
              <button
                onClick={() => handleSendEmail('preparing')}
                disabled={isSendingEmail}
                className="w-full px-4 py-2 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/10 dark:hover:bg-purple-900/20 text-purple-800 dark:text-purple-400 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
              >
                Email: Comandă în Preparare
              </button>
              
              <button
                onClick={() => handleSendEmail('out-for-delivery')}
                disabled={isSendingEmail}
                className="w-full px-4 py-2 bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/10 dark:hover:bg-orange-900/20 text-orange-800 dark:text-orange-400 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
              >
                Email: Comandă În Livrare
              </button>
              
              <button
                onClick={() => handleSendEmail('delivered')}
                disabled={isSendingEmail}
                className="w-full px-4 py-2 bg-green-50 hover:bg-green-100 dark:bg-green-900/10 dark:hover:bg-green-900/20 text-green-800 dark:text-green-400 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
              >
                Email: Comandă Livrată
              </button>
              
              {/* Cancelled Email with reason */}
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Motiv anulare (opțional)"
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-md text-sm bg-[var(--card)] text-[var(--foreground)]"
                />
                <button
                  onClick={() => handleSendEmail('cancelled')}
                  disabled={isSendingEmail}
                  className="w-full px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20 text-red-800 dark:text-red-400 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                >
                  Email: Comandă Anulată
                </button>
              </div>
              
              {/* Failed Delivery Email with reason */}
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Motiv eșuare livrare (opțional)"
                  value={failureReason}
                  onChange={(e) => setFailureReason(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-md text-sm bg-[var(--card)] text-[var(--foreground)]"
                />
                <button
                  onClick={() => handleSendEmail('failed-delivery')}
                  disabled={isSendingEmail}
                  className="w-full px-4 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/10 dark:hover:bg-rose-900/20 text-rose-800 dark:text-rose-400 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                >
                  Email: Livrare Eșuată
                </button>
              </div>
            </div>
            
            {isSendingEmail && (
              <p className="text-sm text-[var(--muted-foreground)] mt-2 text-center">
                Se trimite email...
              </p>
            )}
          </div>

          <ConfirmationModal
            isOpen={isConfirmOpen}
            title="Confirmă Schimbarea Statusului"
            message={`Ești sigur că vrei să schimbi statusul comenzii în "${statusConfig[selectedStatus as keyof typeof statusConfig]?.label}"?`}
            confirmText="Actualizează Status"
            cancelText="Anulează"
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