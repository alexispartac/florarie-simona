import { NextResponse } from 'next/server';
import { verifyCallbackSignature, parsePaymentStatus } from '@/utils/euplatesc';
import clientPromise from '@/lib/mongodb';

/**
 * euPlatesc Payment Callback Handler
 * 
 * This endpoint receives callbacks from euPlatesc after payment completion.
 * euPlatesc sends data as application/x-www-form-urlencoded (POST) or query params (GET)
 * 
 * Two types of callbacks:
 * 1. URL de confirmare (confirmation URL) - server-to-server POST notification
 * 2. URL pentru întoarcere (return URL) - user redirect GET after payment
 */

const DB_NAME = 'buchetul-simonei';
const COLLECTION = 'orders';

/**
 * Parse form-encoded data from request
 */
async function parseFormData(request: Request): Promise<Record<string, string>> {
  const body = await request.text();
  const params = new URLSearchParams(body);
  const data: Record<string, string> = {};
  
  params.forEach((value, key) => {
    data[key] = value;
  });
  
  return data;
}

export async function POST(request: Request) {
  try {
    const secretKey = process.env.EUPLATESC_SECRET_KEY;

    if (!secretKey) {
      console.error('euPlatesc secret key not configured');
      return NextResponse.json(
        { error: 'Payment gateway not configured' },
        { status: 500 }
      );
    }

    // Parse form-encoded callback data from euPlatesc
    const callbackData = await parseFormData(request);
    
    console.log('=== euPlatesc Callback Received (POST) ===');
    console.log('Raw callback data:', callbackData);
    console.log('Invoice ID:', callbackData.invoice_id);
    console.log('Action:', callbackData.action);
    console.log('Amount:', callbackData.amount);
    console.log('Transaction ID:', callbackData.ep_id);
    console.log('Merchant ID:', callbackData.merch_id);

    // Verify signature to ensure authenticity
    console.log('Verifying signature...');
    console.log('Secret key length:', secretKey.length);
    console.log('All callback fields:', Object.keys(callbackData));
    
    const isValid = verifyCallbackSignature(callbackData, secretKey);

    if (!isValid) {
      console.error('❌ SIGNATURE VERIFICATION FAILED');
      console.error('Received fp_hash:', callbackData.fp_hash);
      return new Response('Invalid signature', { status: 403 });
    }

    console.log('✓ Signature verified successfully');

    // Parse payment status
    const paymentStatus = parsePaymentStatus(callbackData.action);
    const trackingNumber = callbackData.invoice_id;

    console.log('Payment status:', paymentStatus);

    // Update order in database
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const updateResult = await db.collection(COLLECTION).updateOne(
      { trackingNumber },
      {
        $set: {
          'payment.status': paymentStatus.status,
          'payment.transactionId': callbackData.ep_id,
          'payment.euplatescData': {
            action: callbackData.action,
            message: callbackData.message,
            approval: callbackData.approval,
            timestamp: callbackData.timestamp,
            amount: callbackData.amount,
            curr: callbackData.curr,
            nonce: callbackData.nonce,
            ep_id: callbackData.ep_id,
          },
          updatedAt: new Date(),
        },
      }
    );

    if (updateResult.matchedCount === 0) {
      console.error('Order not found:', trackingNumber);
      return new Response('Order not found', { status: 404 });
    }

    console.log('✓ Order updated successfully:', trackingNumber);
    console.log('==========================================');

    // Check if this is a user-facing request (has Accept: text/html) or server-to-server
    const acceptHeader = request.headers.get('accept') || '';
    const isUserRequest = acceptHeader.includes('text/html');

    if (isUserRequest) {
      // User is being redirected back - redirect to appropriate page
      const baseUrl = new URL(request.url).origin;
      
      if (paymentStatus.success) {
        console.log('→ Redirecting user to success page');
        return NextResponse.redirect(`${baseUrl}/checkout/success`);
      } else {
        console.log('→ Redirecting user to payment page with error');
        return NextResponse.redirect(
          `${baseUrl}/checkout/payment?error=payment_failed&message=${encodeURIComponent(paymentStatus.message)}`
        );
      }
    } else {
      // Server-to-server callback - return OK
      console.log('→ Returning OK for server callback');
      return new Response('OK', {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error processing euPlatesc callback:', error);
    return new Response('Error processing callback', { status: 500 });
  }
}

/**
 * Handle GET requests (for return URL when user is redirected back)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const baseUrl = new URL(request.url).origin;
    
    // Extract parameters from URL
    const callbackData: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      callbackData[key] = value;
    });

    console.log('=== euPlatesc User Return (GET) ===');
    console.log('Full URL:', request.url);
    console.log('Callback data:', callbackData);
    console.log('Base URL:', baseUrl);

    // If no parameters, redirect to payment page
    if (Object.keys(callbackData).length === 0) {
      console.log('No callback parameters - redirecting to payment page');
      return NextResponse.redirect(`${baseUrl}/checkout/payment?error=no_callback_data`);
    }

    const secretKey = process.env.EUPLATESC_SECRET_KEY;

    if (!secretKey) {
      console.error('euPlatesc secret key not configured');
      return NextResponse.redirect(`${baseUrl}/checkout/payment?error=configuration`);
    }

    // Verify signature
    const isValid = verifyCallbackSignature(callbackData, secretKey);

    if (!isValid) {
      console.error('Invalid signature on return URL');
      return NextResponse.redirect(`${baseUrl}/checkout/payment?error=invalid`);
    }

    console.log('✓ Signature verified');

    // Parse payment status
    const paymentStatus = parsePaymentStatus(callbackData.action);
    console.log('Payment status:', paymentStatus);

    if (paymentStatus.success) {
      // Redirect to success page
      console.log('→ Redirecting to success page');
      return NextResponse.redirect(`${baseUrl}/checkout/success`);
    } else {
      // Redirect to payment page with error
      console.log('→ Redirecting to payment page with error');
      return NextResponse.redirect(
        `${baseUrl}/checkout/payment?error=payment_failed&message=${encodeURIComponent(paymentStatus.message)}`
      );
    }
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error processing euPlatesc return:', error);
    const baseUrl = new URL(request.url).origin;
    return NextResponse.redirect(`${baseUrl}/checkout/payment?error=unknown`);
  }
}
