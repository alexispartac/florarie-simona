'use client';
import { useState } from 'react';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { Order, PaymentStatus } from '@/types/orders';
import { InfoModal } from '@/components/ui/InfoModal';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Package, MapPin, CreditCard, Truck, Calendar, DollarSign } from 'lucide-react';
interface OrderInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onStatusChange?: (trackingNumber: string, status: PaymentStatus) => void;
}

export function OrderInfoModal({ isOpen, onClose, order, onStatusChange }: OrderInfoModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  if (!order) return null;
  const statusVariant = {
    pending: 'bg-[var(--accent)]/20 text-[var(--accent-foreground)]',
    paid: 'bg-[var(--primary)]/20 text-[var(--primary)]',
    failed: 'bg-[var(--destructive)]/20 text-[var(--destructive)]',
    refunded: 'bg-[var(--primary)]/20 text-[var(--primary)]',
  }[order.payment.status];
  const statusConfig = {
    pending: {
      bg: 'bg-[var(--accent)]/20 hover:bg-[var(--accent)]/30',
      text: 'text-[var(--accent-foreground)]',
      label: 'Pending'
    },
    paid: {
      bg: 'bg-[var(--primary)]/20 hover:bg-[var(--primary)]/30',
      text: 'text-[var(--primary)]',
      label: 'Paid'
    },
    failed: {
      bg: 'bg-[var(--destructive)]/20 hover:bg-[var(--destructive)]/30',
      text: 'text-[var(--destructive)]',
      label: 'Failed'
    },
    refunded: {
      bg: 'bg-[var(--primary)]/20 hover:bg-[var(--primary)]/30',
      text: 'text-[var(--primary)]',
      label: 'Refunded'
    }
  };
  const handleStatusSelect = (status: PaymentStatus) => {
    setSelectedStatus(status);
    setIsConfirmOpen(true);
  };
  const handleConfirmStatusChange = async () => {
    if (!selectedStatus || !onStatusChange || !order) return;

    setIsUpdating(true);
    try {
      await onStatusChange(order.trackingNumber, selectedStatus);
      setIsConfirmOpen(false);
    } catch (error) {
      console.error('Error updating payment status:', error);
      // You might want to show a toast notification here
    } finally {
      setIsUpdating(false);
    }
  };
  const paymentMethodIcons = {
    'credit-card': <CreditCard className="h-4 w-4 mr-2" />,
    'bank-transfer': <CreditCard className="h-4 w-4 mr-2" />,
    'cash-on-delivery': <DollarSign className="h-4 w-4 mr-2" />,
  };

  console.log(order.billing);

  return (
    <InfoModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Order #${order.orderId}`}
      size="lg"
    >
      <div className="space-y-6">
        {/* Order Summary */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </div>
              <Badge className={statusVariant}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p>{new Date(order.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Tracking Number</p>
                  <p>{order.trackingNumber || 'Not available'}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p>{(((order.total + order.shippingCost) / 100)).toFixed(2)} RON</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-start pb-4 border-b last:border-0 last:pb-0">
                  <div className="flex space-x-4">
                    <div className="w-20 h-20 bg-[var(--muted)] rounded-md flex items-center justify-center">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <div className="flex space-x-4 text-sm text-muted-foreground mt-1">
                        <span>Qty: {item.quantity}</span>
                      </div>
                      <p className="mt-1">{(item.price * item.quantity / 100).toFixed(2)} RON</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="pt-2">
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{(order.total / 100).toFixed(2)} RON</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{(order.shippingCost / 100).toFixed(2)} RON</span>
                </div>
                <div className="flex justify-between py-1 font-medium">
                  <span>Total</span>
                  <span>{((order.total + order.shippingCost) / 100).toFixed(2)} RON</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg">Shipping Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">{order.shipping.name}</p>
                <p className="text-muted-foreground">{order.shipping.address}</p>
                <p className="text-muted-foreground">
                  {order.shipping.city}, {order.shipping.state} {order.shipping.postalCode}
                </p>
                <p className="text-muted-foreground">{order.shipping.country}</p>
                <p className="text-muted-foreground mt-2">
                  <span className="font-medium">Phone:</span> {order.shipping.phone}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium">Email:</span> {order.shipping.email}
                </p>
                {order.shipping.deliveryInstructions && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="font-medium text-foreground">Informații suplimentare:</p>
                    <p className="text-muted-foreground mt-1">{order.shipping.deliveryInstructions}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Billing Information */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg">Billing Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">{order.billing?.name || 'N/A'}</p>
                {order.billing?.company && (
                  <p className="text-muted-foreground">
                    <span className="font-medium">Company:</span> {order.billing.company}
                  </p>
                )}
                {order.billing?.taxId && (
                  <p className="text-muted-foreground">
                    <span className="font-medium">Tax ID:</span> {order.billing.taxId}
                  </p>
                )}
                <p className="text-muted-foreground">{order.billing?.address || 'N/A'}</p>
                <p className="text-muted-foreground">
                  {order.billing?.city}, {order.billing?.state} {order.billing?.postalCode}
                </p>
                <p className="text-muted-foreground">{order.billing?.country}</p>
                <p className="text-muted-foreground mt-2">
                  <span className="font-medium">Phone:</span> {order.billing?.phone || 'N/A'}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium">Email:</span> {order.billing?.email || 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Information */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Payment Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  {paymentMethodIcons[order.payment.method]}
                  <div>
                    <p className="capitalize">
                      {order.payment.method.replace('-', ' ')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Status: <span className="capitalize">{order.payment.status}</span>
                    </p>
                  </div>
                </div>

                {order.trackingNumber && (
                  <div className="flex items-center">
                    <Truck className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <p>Tracking Number</p>
                      <p className="text-sm text-muted-foreground">
                        {order.trackingNumber}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {onStatusChange && (
                <div className="mt-6 space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Update Payment Status</p>
                    <div className="flex flex-wrap gap-2">
                      {(Object.keys(statusConfig) as PaymentStatus[]).map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusSelect(status)}
                          disabled={order.payment.status === status || isUpdating}
                          className={`px-3 py-1 text-sm rounded-md font-medium ${statusConfig[status].bg
                            } ${statusConfig[status].text} ${order.payment.status === status || isUpdating
                              ? 'opacity-50 cursor-not-allowed'
                              : 'cursor-pointer'
                            }`}
                        >
                          {statusConfig[status].label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          <ConfirmationModal
            isOpen={isConfirmOpen}
            title="Confirm Status Update"
            message={`Are you sure you want to update the payment status to "${selectedStatus}"?`}
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
  );
}
