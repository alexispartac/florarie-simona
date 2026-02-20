import { NextResponse } from 'next/server';
import { verifyCallbackSignature, parsePaymentStatus } from '@/utils/euplatesc';
import clientPromise from '@/lib/mongodb';
import type { Order } from '@/types/orders';

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

// Helper function to generate tracking number
function generateTrackingNumber(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
    if ((i + 1) % 4 === 0 && i < 11) result += '-';
  }
  return result;
}

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
      return NextResponse.json(
        { error: 'Payment gateway not configured' },
        { status: 500 }
      );
    }

    // Parse form-encoded callback data from euPlatesc
    const callbackData = await parseFormData(request);
    
    const isValid = verifyCallbackSignature(callbackData, secretKey);

    if (!isValid) {
      return new Response('Invalid signature', { status: 403 });
    }

    // Parse payment status
    const paymentStatus = parsePaymentStatus(callbackData.action);
    const tempTrackingNumber = callbackData.invoice_id;


    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Check if this is a TEMP tracking number (payment with card)
    const isTempTracking = tempTrackingNumber.startsWith('TEMP-');
    
    let finalTrackingNumber = tempTrackingNumber;
    let order = null;
    let isNewOrder = false; // Track if this is a newly created order

    if (isTempTracking && paymentStatus.success) {

      // Retrieve pending order data DIRECTLY from database (not via HTTP)
      try {
          const pendingOrder = await db.collection('pending_orders').findOne({
          tempTrackingNumber,
        });
                
        if (!pendingOrder) {
          // Check if order already exists (this might be a duplicate callback)
          const existingOrder = await db.collection<Order>(COLLECTION).findOne({
            'payment.transactionId': callbackData.ep_id,
          });
          
          if (existingOrder) {
            order = existingOrder;
            isNewOrder = false; // This is a duplicate callback
            console.log('⚠️ Duplicate callback detected - order already exists:', existingOrder.trackingNumber);
            // Skip creating a new order
          } else {
            throw new Error('Pending order data not found and no existing order for this transaction');
          }
        }
        
        // Only create order if we found pending data (not a duplicate)
        if (pendingOrder) {
          if (!pendingOrder.orderData) {
            throw new Error('Pending order exists but orderData is missing');
          }

        const orderData = pendingOrder.orderData;

        // Generate real tracking number
        finalTrackingNumber = generateTrackingNumber();
        
        // Create the order with all data
        const { v4: uuidv4 } = await import('uuid');
        
        const shippingInfo = {
          name: `${orderData.shippingData.firstName} ${orderData.shippingData.lastName}`,
          address: orderData.shippingData.address || '',
          city: orderData.shippingData.city || '',
          state: orderData.shippingData.state || '',
          postalCode: orderData.shippingData.postalCode || '',
          country: orderData.shippingData.country || 'RO',
          phone: orderData.shippingData.phone || '',
          email: orderData.shippingData.email || '',
          deliveryInstructions: orderData.shippingData.additionalInfo || '',
        };

        const billingInfo = {
          name: `${orderData.billingData.firstName} ${orderData.billingData.lastName}`,
          address: orderData.billingData.address || '',
          city: orderData.billingData.city || '',
          state: orderData.billingData.state || '',
          postalCode: orderData.billingData.postalCode || '',
          country: orderData.billingData.country || 'RO',
          phone: orderData.billingData.phone || '',
          email: orderData.billingData.email || '',
          company: orderData.billingData.company || '',
          taxId: orderData.billingData.taxId || '',
        };

        const items = orderData.cart.map((item: { productId: string; name: string; price: number; quantity: number; customMessage?: string }) => ({
          itemId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          customMessage: item.customMessage,
        }));

        const newOrder = {
          orderId: uuidv4(),
          trackingNumber: finalTrackingNumber,
          date: new Date().toISOString(),
          status: 'processing',
          items,
          shipping: shippingInfo,
          billing: billingInfo,
          subtotal: orderData.total,
          shippingCost: orderData.shippingCost,
          discount: orderData.appliedDiscount?.amount || 0,
          discountCode: orderData.appliedDiscount?.code || null,
          total: orderData.total + orderData.shippingCost,
          payment: {
            method: 'credit-card',
            status: paymentStatus.status,
            transactionId: callbackData.ep_id,
            euplatescData: {
              action: callbackData.action,
              message: callbackData.message,
              approval: callbackData.approval,
              timestamp: callbackData.timestamp,
              amount: callbackData.amount,
              curr: callbackData.curr,
              nonce: callbackData.nonce,
              ep_id: callbackData.ep_id,
            },
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await db.collection(COLLECTION).insertOne(newOrder);
        order = newOrder;
        isNewOrder = true; // Mark as new order to send emails
        
        // Clean up pending order data DIRECTLY from database
        await db.collection('pending_orders').deleteOne({
          tempTrackingNumber,
        });
        } // End of if (pendingOrder)
      } catch (error) {
        throw error;
      }
    } else if (!isTempTracking) {
      // Regular order tracking number - update existing order
      const updateResult = await db.collection(COLLECTION).updateOne(
        { trackingNumber: tempTrackingNumber },
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
        console.error('Order not found:', tempTrackingNumber);
        return new Response('Order not found', { status: 404 });
      }

      order = await db.collection(COLLECTION).findOne({ trackingNumber: tempTrackingNumber });
    } else {
      // TEMP tracking and payment failed - do NOT create order
      console.log('⚠️ Payment failed - order not created');
    }

    console.log('==========================================');

    // Send emails ONLY if payment was successful AND order exists AND it's a NEW order (not duplicate)
    if (paymentStatus.success && order && isNewOrder) {
      try {
        const { sendOrderConfirmationEmail, sendPaymentConfirmationEmail } = await import('@/lib/email');
        
        console.log('✅ Sending confirmation emails for new order:', order.trackingNumber);
        
        // 1. Send order confirmation email (like cash-on-delivery and bank transfer)
        await sendOrderConfirmationEmail(order as Order);
        
        // 2. Send payment confirmation email (specific to card payments)
        await sendPaymentConfirmationEmail(order as Order);
        
        console.log('✅ Confirmation emails sent successfully');
      } catch (emailError) {
        console.error('Failed to send confirmation emails:', emailError);
        // Don't fail the callback if email fails
      }
    } else if (paymentStatus.success && order && !isNewOrder) {
      console.log('⚠️ Skipping emails - duplicate callback for order:', order.trackingNumber);
    }

    // Check if this is a user-facing request (has Accept: text/html) or server-to-server
    const acceptHeader = request.headers.get('accept') || '';
    const isUserRequest = acceptHeader.includes('text/html');

    if (isUserRequest) {
      // User is being redirected back - redirect to appropriate page
      // Use NEXT_PUBLIC_BASE_URL for ngrok compatibility, fallback to request origin
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || new URL(request.url).origin;
      
      if (paymentStatus.success) {
        return NextResponse.redirect(`${baseUrl}/checkout/success`);
      } else {
        return NextResponse.redirect(
          `${baseUrl}/checkout/cancel?error=payment_failed&message=${encodeURIComponent(paymentStatus.message)}`
        );
      }
    } else {
      // Server-to-server callback - return OK
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
    // Use NEXT_PUBLIC_BASE_URL for ngrok compatibility, fallback to request origin
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || new URL(request.url).origin;
    
    // Extract parameters from URL
    const callbackData: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      callbackData[key] = value;
    });
    // If no parameters, redirect to payment page
    if (Object.keys(callbackData).length === 0) {
      return NextResponse.redirect(`${baseUrl}/checkout/payment?error=no_callback_data`);
    }

    const secretKey = process.env.EUPLATESC_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.redirect(`${baseUrl}/checkout/payment?error=configuration`);
    }

    // Verify signature
    const isValid = verifyCallbackSignature(callbackData, secretKey);

    if (!isValid) {
      return NextResponse.redirect(`${baseUrl}/checkout/payment?error=invalid`);
    }

    // Parse payment status
    const paymentStatus = parsePaymentStatus(callbackData.action);

    if (paymentStatus.success) {
      // Redirect to success page
      return NextResponse.redirect(`${baseUrl}/checkout/success`);
    } else {
      // Redirect to payment page with error
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
