import { NextResponse } from 'next/server';
import { sendPaymentConfirmationEmail } from '@/lib/email';
import { Order } from '@/types/orders';

export async function POST(request: Request) {
  try {
    const order: Order = await request.json();
    
    // Validate required fields
    const requiredFields: Array<keyof Order> = [
      'orderId',
      'date',
      'status',
      'total',
      'shippingCost',
      'items',
      'shipping',
      'payment',
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

    // Validate payment status is paid
    if (order.payment.status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment confirmation email can only be sent for paid orders' },
        { status: 400 }
      );
    }

    // Validate payment method is credit-card (euPlatesc)
    if (order.payment.method !== 'credit-card') {
      return NextResponse.json(
        { error: 'Payment confirmation email is only for credit card payments' },
        { status: 400 }
      );
    }

    // Send the email
    await sendPaymentConfirmationEmail(order);

    return NextResponse.json({ 
      success: true,
      message: 'Payment confirmation email sent successfully' 
    });
  } catch (error) {
    console.error('Error in send-email/payment-confirmation:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send payment confirmation email' 
      },
      { status: 500 }
    );
  }
}
