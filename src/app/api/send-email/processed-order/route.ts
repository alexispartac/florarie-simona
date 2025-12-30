// Create this file at /src/app/api/send-email/processed-order/route.ts
import { NextResponse } from 'next/server';
import { sendOrderProcessedEmail } from '@/lib/email';
import { Order } from '@/types/orders';

export async function POST(request: Request) {
  try {
    const order: Order = await request.json();
    
    // Validate required fields
    const requiredFields: Array<keyof Order> = [
      'orderId',
      'date',
      'items',
      'shipping',
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

    // Update order status to 'processing' if not already
    const orderToSend = {
      ...order,
      status: 'processing' as const
    };

    // Send the order processed email
    await sendOrderProcessedEmail(orderToSend);

    return NextResponse.json({ 
      success: true,
      message: 'Order processed email sent successfully' 
    });
  } catch (error) {
    console.error('Error in send-email/processed-order:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send order processed email' 
      },
      { status: 500 }
    );
  }
}