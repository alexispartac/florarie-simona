'use server';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import clientPromise from '@/app/components/lib/mongodb';
import { OrderPropsAdmin } from '@/app/types/order';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const EUPLATESC_SECRET_KEY = process.env.EUPLATESC_SECRET_KEY;
const BASE_URL = process.env.BASE_URL;

interface EuPlatescCallback {
    amount: string;
    curr: string;
    invoice_id: string;
    ep_id: string;
    merch_id: string;
    action: string;
    message: string;
    approval: string;
    timestamp: string;
    nonce: string;
    fp_hash: string;
}

/**
 * Endpoint pentru callback-ul de la EuPlătesc
 * Acest endpoint este apelat automat de EuPlătesc după procesarea plății
 * Documentație: https://euplatesc.ro/documentatie/
 */
export async function POST(req: NextRequest) {
    try {
        console.log('🔔 EuPlătesc callback received');

        if (!EUPLATESC_SECRET_KEY) {
            console.error('❌ EUPLATESC_SECRET_KEY not configured');
            return NextResponse.json({ 
                success: false, 
                message: 'Server configuration error' 
            }, { status: 500 });
        }

        // Parse callback data din body
        const callbackData: EuPlatescCallback = await req.json();
        
        console.log('📦 Callback data:', {
            invoice_id: callbackData.invoice_id,
            amount: callbackData.amount,
            action: callbackData.action,
            message: callbackData.message
        });

        // 1. VALIDARE HASH - Foarte important pentru securitate!
        const isValidHash = validateEuPlatescHash(callbackData);
        
        if (!isValidHash) {
            console.error('❌ Invalid hash from EuPlătesc - possible fraud attempt!');
            return NextResponse.json({ 
                success: false, 
                message: 'Invalid signature' 
            }, { status: 403 });
        }

        console.log('✅ Hash validated successfully');

        // 2. EXTRAGE ORDER ID din invoice_id (format: FL_orderNumber_orderId)
        const orderId = extractOrderIdFromInvoice(callbackData.invoice_id);
        
        if (!orderId) {
            console.error('❌ Could not extract order ID from invoice:', callbackData.invoice_id);
            return NextResponse.json({ 
                success: false, 
                message: 'Invalid invoice ID' 
            }, { status: 400 });
        }

        console.log('🔍 Extracted order ID:', orderId);

        // 3. VERIFICĂ STATUS-UL PLĂȚII
        const paymentSuccess = callbackData.action === '0'; // action=0 înseamnă plată reușită
        
        if (!paymentSuccess) {
            console.warn('⚠️ Payment failed or cancelled:', callbackData.message);
            
            // Marchează comanda ca eșuată dacă există
            await updateOrderPaymentStatus(orderId, 'failed', callbackData);
            
            return NextResponse.json({ 
                success: false, 
                message: callbackData.message || 'Payment failed' 
            }, { status: 200 }); // Return 200 pentru a confirma că am primit callback-ul
        }

        console.log('✅ Payment successful');

        // 4. CREEAZĂ COMANDA ÎN ORDERS + TRIMITE EMAIL
        const orderCreated = await createOrderAfterPayment(orderId, callbackData);
        
        if (!orderCreated) {
            console.error('❌ Failed to create order in database');
            return NextResponse.json({ 
                success: false, 
                message: 'Failed to create order' 
            }, { status: 500 });
        }

        console.log('✅ Order created successfully and email sent');

        // 5. RETURNEAZĂ SUCCES către EuPlătesc
        return NextResponse.json({ 
            success: true, 
            message: 'Order processed successfully' 
        }, { status: 200 });

    } catch (error) {
        console.error('❌ Error in payment callback:', error);
        return NextResponse.json({ 
            success: false, 
            message: 'Internal server error' 
        }, { status: 500 });
    }
}

/**
 * Validează hash-ul primit de la EuPlătesc pentru a preveni fraud
 */
function validateEuPlatescHash(data: EuPlatescCallback): boolean {
    try {
        const receivedHash = data.fp_hash;
        
        // Construiește string-ul pentru hash conform documentației EuPlătesc
        const params = {
            amount: data.amount,
            curr: data.curr,
            invoice_id: data.invoice_id,
            ep_id: data.ep_id,
            merch_id: data.merch_id,
            action: data.action,
            message: data.message,
            approval: data.approval,
            timestamp: data.timestamp,
            nonce: data.nonce
        };

        const datakeys = Object.keys(params);
        let hmac = '';
        
        for (let i = 0; i < datakeys.length; i++) {
            const key = datakeys[i] as keyof typeof params;
            const value = params[key] || '';
            if (value.length === 0) {
                hmac += '-';
            } else {
                hmac += value.length + value;
            }
        }

        // Calculează hash-ul folosind secret key
        const binKey = Buffer.from(EUPLATESC_SECRET_KEY!, 'hex');
        const calculatedHash = crypto.createHmac('md5', binKey)
            .update(hmac, 'utf8')
            .digest('hex');

        return calculatedHash === receivedHash;
    } catch (error) {
        console.error('Error validating hash:', error);
        return false;
    }
}

/**
 * Extrage order ID real din invoice_id (format: FL_orderNumber_orderId)
 */
function extractOrderIdFromInvoice(invoiceId: string): string | null {
    try {
        // Format: FL_123_abc123def456
        const parts = invoiceId.split('_');
        if (parts.length >= 3) {
            return parts.slice(2).join('_'); // Restul după FL_orderNumber_
        }
        return null;
    } catch (error) {
        console.error('Error extracting order ID:', error);
        return null;
    }
}

/**
 * Creează comanda în orders după plată reușită + trimite email
 */
async function createOrderAfterPayment(orderId: string, callbackData: EuPlatescCallback): Promise<boolean> {
    try {
        const client = await clientPromise;
        const db = client.db('florarie');

        // Citește datele din pending-orders
        const pendingOrder = await db.collection('pending-orders').findOne({ id: orderId }) as OrderPropsAdmin | null;
        
        if (!pendingOrder) {
            console.error('❌ Pending order not found in database');
            return false;
        }

        console.log('✅ Pending order found, creating final order');
        
        // Creează comanda finală în orders
        const orderData: OrderPropsAdmin = {
            ...pendingOrder,
            status: 'Pending',
            paymentStatus: 'paid',
            paymentDetails: {
                euplatescId: callbackData.ep_id,
                approval: callbackData.approval,
                timestamp: callbackData.timestamp,
                amount: callbackData.amount,
                currency: callbackData.curr
            },
            createdAt: new Date().toISOString()
        };

        // Salvează în orders
        const result = await db.collection('orders').insertOne(orderData);
        
        if (!result.acknowledged) {
            console.error('❌ Failed to insert order');
            return false;
        }

        console.log('✅ Order inserted in database');

        // Șterge din pending-orders
        await db.collection('pending-orders').deleteOne({ id: orderId });
        console.log('✅ Pending order deleted');

        // Trimite email de confirmare
        try {
            await axios.post(`${BASE_URL}/api/send-email/placed-order`, {
                clientEmail: orderData.clientEmail,
                clientName: orderData.clientName,
                orderDetails: orderData.products,
                totalPrice: orderData.totalPrice,
                currency: orderData.paymentDetails?.currency || 'RON',
                orderNumber: orderData.orderNumber,
                deliveryInfo: {
                    address: orderData.clientAddress,
                    phone: orderData.clientPhone,
                    notes: orderData.info,
                    paymentMethod: orderData.paymentMethod,
                }
            });
            console.log('✅ Confirmation email sent');
        } catch (emailError) {
            console.error('⚠️ Failed to send email:', emailError);
            // Nu returnăm false - comanda este salvată
        }

        return true;
    } catch (error) {
        console.error('Error creating order after payment:', error);
        return false;
    }
}

/**
 * Actualizează status-ul de plată când plata eșuează
 */
async function updateOrderPaymentStatus(orderId: string, status: string, callbackData: EuPlatescCallback): Promise<void> {
    try {
        const client = await clientPromise;
        const db = client.db('florarie');

        // Marchează în pending-orders ca failed
        await db.collection('pending-orders').updateOne(
            { id: orderId },
            { 
                $set: { 
                    paymentStatus: status,
                    paymentFailureReason: callbackData.message,
                    updatedAt: new Date().toISOString()
                } 
            }
        );
    } catch (error) {
        console.error('Error updating payment status:', error);
    }
}

/**
 * GET endpoint pentru verificare status (opțional)
 */
export async function GET() {
    return NextResponse.json({ 
        message: 'EuPlătesc payment callback endpoint',
        status: 'active' 
    }, { status: 200 });
}
