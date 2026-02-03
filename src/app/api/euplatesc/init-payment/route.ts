import { NextRequest, NextResponse } from 'next/server';
import { preparePaymentParams, formatAmount } from '@/utils/euplatesc';
import { withRateLimit } from '@/lib/rateLimit';

/**
 * Initialize euPlatesc payment
 * This endpoint prepares payment data and returns parameters for redirect
 */

type PaymentInitRequest = {
  amount: number; // Amount in cents (bani)
  curr?: string;
  invoice_id: string; // Order/tracking number
  order_desc: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
};

export async function POST(request: NextRequest) {
  // Stricter rate limit for payment initialization: 5 per minute
  return withRateLimit(request, async (req) => {
  try {
    const body: PaymentInitRequest = await req.json();
    
    // Validate required environment variables
    const merchantId = process.env.EUPLATESC_MERCHANT_ID;
    const secretKey = process.env.EUPLATESC_SECRET_KEY;

    if (!merchantId || !secretKey) {
      console.error('euPlatesc credentials not configured');
      return NextResponse.json(
        { error: { message: 'Payment gateway not configured' } },
        { status: 500 }
      );
    }

    // Validate request data
    if (!body.amount || !body.invoice_id || !body.customerInfo) {
      return NextResponse.json(
        { error: { message: 'Missing required payment data' } },
        { status: 400 }
      );
    }

    // Prepare payment data using euPlatesc parameter names
    const paymentData = {
      amount: formatAmount(body.amount), // Convert cents to RON
      curr: body.curr || 'RON',
      invoice_id: body.invoice_id,
      order_desc: body.order_desc || `Order ${body.invoice_id} - Buchetul Simonei`,
      fname: body.customerInfo.firstName,
      lname: body.customerInfo.lastName,
      email: body.customerInfo.email,
      phone: body.customerInfo.phone,
      address: body.customerInfo.address,
      city: body.customerInfo.city,
      state: body.customerInfo.state,
      zip: body.customerInfo.zip,
      country: body.customerInfo.country || 'RO',
    };

    // Generate payment parameters with signature
    const paymentParams = preparePaymentParams(paymentData, {
      mid: merchantId,
      key: secretKey,
      testMode: process.env.NODE_ENV !== 'production',
    });

    // Return payment parameters for frontend redirect
    return NextResponse.json({
      success: true,
      paymentParams,
      paymentUrl: 'https://secure.euplatesc.ro/tdsprocess/tranzactd.php',
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error initializing euPlatesc payment:', error);
    return NextResponse.json(
      { error: { message: error.message || 'Failed to initialize payment' } },
      { status: 500 }
    );
  }
  }, { limit: 5, windowMs: 60000 }); // 5 payment initializations per minute
}
