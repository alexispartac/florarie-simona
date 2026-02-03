import { NextResponse } from 'next/server';
import { sendOrderFailedDeliveryEmail } from '@/lib/email';
import { Order } from '@/types/orders';

export async function POST(request: Request) {
  try {
    const { order, failureReason }: { order: Order; failureReason?: string } = await request.json();
    
    // Validate required fields
    const requiredFields: Array<keyof Order> = [
      'orderId',
      'date',
      'items',
      'shipping',
      'trackingNumber'
    ];

    for (const field of requiredFields) {
      if (!order[field] && order[field] !== 0) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate shipping info
    const requiredShippingFields: Array<keyof Order['shipping']> = [
      'name',
      'address',
      'city',
      'state',
      'postalCode',
      'country',
      'phone',
      'email'
    ];

    for (const field of requiredShippingFields) {
      if (!order.shipping[field]) {
        return NextResponse.json(
          { error: `Missing required shipping field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate items array
    if (!Array.isArray(order.items) || order.items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    // Update order status to 'failed-delivery' if not already
    const orderToSend = {
      ...order,
      status: 'failed-delivery' as const
    };

    // Send the failed delivery email
    await sendOrderFailedDeliveryEmail(orderToSend, failureReason);

    return NextResponse.json({ 
      success: true,
      message: 'Failed delivery email sent successfully' 
    });
  } catch (error) {
    console.error('Error in send-email/failed-delivery:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send failed delivery email' 
      },
      { status: 500 }
    );
  }
}
