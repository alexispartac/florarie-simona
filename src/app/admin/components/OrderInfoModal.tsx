'use client';

import { Order, PaymentStatus } from '@/types/orders';
import { InfoModal } from '@/components/ui/InfoModal';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Package, MapPin, CreditCard, Truck, Calendar, DollarSign } from 'lucide-react';

interface OrderInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onStatusChange?: (paymentStatus: PaymentStatus) => void;
}

export function OrderInfoModal({ isOpen, onClose, order, onStatusChange }: OrderInfoModalProps) {
  if (!order) return null;

  const statusVariant = {
    processing: 'bg-yellow-100 text-yellow-800',
    shipped: 'bg-blue-100 text-blue-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }[order.status];

  const paymentMethodIcons = {
    'credit-card': <CreditCard className="h-4 w-4 mr-2" />,
    'bank-transfer': <CreditCard className="h-4 w-4 mr-2" />,
    'cash-on-delivery': <DollarSign className="h-4 w-4 mr-2" />,
  };

  return (
    <InfoModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Order #${order.orderId}`}
      size="xl"
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
                  <p>{(order.total + order.shippingCost).toFixed(2)} USD</p>
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
                    <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <div className="flex space-x-4 text-sm text-muted-foreground mt-1">
                        <span>Qty: {item.quantity}</span>
                        {item.size && <span>Size: {item.size}</span>}
                        {item.color && <span>Color: {item.color}</span>}
                      </div>
                      <p className="mt-1">{(item.price * item.quantity).toFixed(2)} USD</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="pt-2">
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{order.total.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{order.shippingCost.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between py-1 font-medium">
                  <span>Total</span>
                  <span>{(order.total + order.shippingCost).toFixed(2)} USD</span>
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
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
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
                                {(['pending', 'paid', 'failed', 'refunded'] as const).map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => onStatusChange(status)}
                                        disabled={order.payment.status === status}
                                        className={`px-3 py-1 text-sm rounded-md ${status === 'paid' ? 'bg-green-500 hover:bg-green-400' :
                                            status === 'failed' ? 'bg-red-500 hover:bg-red-400' :
                                            status === 'refunded' ? 'bg-amber-500 hover:bg-amber-400' : 'bg-gray-100 hover:bg-gray-200'} ${order.payment.status === status ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                    >
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    </InfoModal>
  );
}
