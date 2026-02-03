import { NextResponse } from 'next/server';
import { sendOrderCancelledEmail } from '@/lib/email';
import { Order } from '@/types/orders';

export async function POST(request: Request) {
  try {
    const { order, cancellationReason }: { order: Order; cancellationReason?: string } = await request.json();
    
    // Validate required fields
    const requiredFields: Array<keyof Order> = [
      'orderId',
      'date',
      'items',
      'shipping',
      'payment',
      'total',
      'shippingCost'
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

    // Update order status to 'cancelled' if not already
    const orderToSend = {
      ...order,
      status: 'cancelled' as const
    };

    // Send the order cancelled email
    await sendOrderCancelledEmail(orderToSend, cancellationReason);

    return NextResponse.json({ 
      success: true,
      message: 'Order cancelled email sent successfully' 
    });
  } catch (error) {
    console.error('Error in send-email/cancelled-order:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send order cancelled email' 
      },
      { status: 500 }
    );
  }
}
