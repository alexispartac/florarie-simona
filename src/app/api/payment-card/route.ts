'use server';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export interface PaymentItem {
    id: string;
    title: string;
    price: number;
    quantity: number;
    category: string;
}

export interface PaymentRequest {
    items: PaymentItem[];
    customerInfo: {
        name: string;
        email: string;
        phone: string;
        address: string;
    };
    orderDetails: {
        orderId: string;
        orderNumber: number;
        totalPrice: number;
        currency: string;
        paymentMethod: string;
        deliveryDate?: string;
        info?: string;
        orderDate: string;
    };
    urls: {
        returnUrl: string;
        cancelUrl: string;
    };
}


export async function POST(req: NextRequest) {
    try {
        if (!JWT_SECRET) {
            return NextResponse.json({ 
                success: false, 
                message: 'Configurația serverului este incompletă.' 
            }, { status: 500 });
        }

        // Verifică token-ul JWT
        const cookie = req.cookies.get('login');
        const token = cookie?.value;

        if (!token) {
            return NextResponse.json({ 
                success: false, 
                message: 'Trebuie să fi autentificat pentru a plăti.' 
            }, { status: 401 });
        }

        try {
            jwt.verify(token, JWT_SECRET);
        } catch (error) {
            console.log('Token invalid sau expirat:', error);
            return NextResponse.json({ 
                success: false, 
                message: 'Sesiunea a expirat. Te rugăm să te autentifici din nou.' 
            }, { status: 401 });
        }

        const body: PaymentRequest = await req.json();

        // Validează datele de intrare
        if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
            return NextResponse.json({ 
                success: false, 
                message: 'Coșul de cumpărături este gol.' 
            }, { status: 400 });
        }

        // Validează informațiile clientului
        if (!body.customerInfo || !body.customerInfo.name || !body.customerInfo.email || 
            !body.customerInfo.phone || !body.customerInfo.address) {
            return NextResponse.json({ 
                success: false, 
                message: 'Informațiile clientului sunt incomplete.' 
            }, { status: 400 });
        }

        // Validează detaliile comenzii
        if (!body.orderDetails || !body.orderDetails.orderId || 
            typeof body.orderDetails.totalPrice !== 'number' ||
            (typeof body.orderDetails.orderNumber !== 'number' && body.orderDetails.orderNumber !== 0)) {
            return NextResponse.json({ 
                success: false, 
                message: 'Detaliile comenzii sunt incomplete.' 
            }, { status: 400 });
        }

        // Validează URL-urile
        if (!body.urls || !body.urls.returnUrl || !body.urls.cancelUrl) {
            return NextResponse.json({ 
                success: false, 
                message: 'URL-urile de retur sunt incomplete.' 
            }, { status: 400 });
        }

        // Validează fiecare produs din coș
        for (const item of body.items) {
            if (!item.id || !item.title || !item.category || 
                typeof item.price !== 'number' || typeof item.quantity !== 'number') {
                return NextResponse.json({ 
                    success: false, 
                    message: 'Datele produselor sunt invalide.' 
                }, { status: 400 });
            }
            
            if (item.price <= 0 || item.quantity <= 0) {
                return NextResponse.json({ 
                    success: false, 
                    message: 'Prețul și cantitatea trebuie să fie pozitive.' 
                }, { status: 400 });
            }
        }

        // Calculează totalul comenzii din produse pentru validare
        const calculatedTotal = body.items.reduce((total: number, item: PaymentItem) => {
            return total + (item.price * item.quantity);
        }, 0);

        // Folosește totalul din orderDetails
        const totalAmount = body.orderDetails.totalPrice;
        const currency = body.orderDetails.currency || 'RON';
        
        // Pentru EUR, convertește totalul calculat din RON în EUR pentru comparație
        let expectedTotal = calculatedTotal;
        if (currency === 'EUR') {
            expectedTotal = Number((calculatedTotal / 5).toFixed(2)); // 1 EUR = 5 RON
        }
        
        // Verifică că totalul calculat se potrivește cu cel din request (cu toleranță de 0.01)
        if (Math.abs(expectedTotal - totalAmount) > 0.01) {
            console.log('Total mismatch:', {
                calculatedTotal,
                expectedTotal,
                receivedTotal: totalAmount,
                currency,
                difference: Math.abs(expectedTotal - totalAmount)
            });
            return NextResponse.json({ 
                success: false, 
                message: `Totalul comenzii nu se potrivește cu produsele selectate. Calculat: ${expectedTotal} ${currency}, Primit: ${totalAmount} ${currency}` 
            }, { status: 400 });
        }

        // Verifică că totalul este valid
        if (totalAmount <= 0) {
            return NextResponse.json({ 
                success: false, 
                message: 'Totalul comenzii este invalid.' 
            }, { status: 400 });
        }

        // Verifică configurația EuPlătesc
        const merchantId = process.env.EUPLATESC_MERCHANT_ID;
        const secretKey = process.env.EUPLATESC_SECRET_KEY;
        const baseUrl = process.env.BASE_URL;

        if (!merchantId || !secretKey || !baseUrl) {
            return NextResponse.json({ 
                success: false, 
                message: 'Configurația sistemului de plată este incompletă.' 
            }, { status: 500 });
        }
        
        // Validează parametrii pentru EuPlătesc
        if (!merchantId || merchantId.trim() === '') {
            return NextResponse.json({ 
                success: false, 
                message: 'ID-ul comerciantului este invalid.' 
            }, { status: 500 });
        }
        
        // Verifică că merchant ID are format numeric (dacă este cazul)
        if (!/^\d+$/.test(merchantId)) {
            console.log('Warning: Merchant ID might need to be numeric only:', merchantId);
        }
        
        // Validează limitele pentru ambele monede
        const minAmount = currency === 'EUR' ? 0.01 : 0.01;
        const maxAmount = currency === 'EUR' ? 199999.99 : 999999.99;
        
        if (totalAmount < minAmount || totalAmount > maxAmount) {
            return NextResponse.json({ 
                success: false, 
                message: `Suma comenzii este în afara limitelor permise pentru ${currency}. Min: ${minAmount}, Max: ${maxAmount}` 
            }, { status: 400 });
        }
        
        // Parametrii pentru EuPlătesc conform implementării oficiale
        const orderNumber = body.orderDetails.orderNumber ?? Math.floor(Date.now() / 1000);
        const orderId = `FL_${orderNumber}_${body.orderDetails.orderId.substring(0, 8)}`;
        const returnUrl = body.urls.returnUrl;
        const cancelUrl = body.urls.cancelUrl;
        
        if (!returnUrl.startsWith('http') || !cancelUrl.startsWith('http')) {
            return NextResponse.json({ 
                success: false, 
                message: 'URL-urile de retur trebuie să fie complete.' 
            }, { status: 400 });
        }

        // Validează lungimea ORDER_REF (max 50 caractere pentru EuPlătesc)
        if (orderId.length > 50) {
            return NextResponse.json({ 
                success: false, 
                message: 'ID-ul comenzii este prea lung.' 
            }, { status: 400 });
        }

        // Validează că EuPlătesc suportă moneda
        if (!['RON', 'EUR', 'USD'].includes(currency)) {
            return NextResponse.json({ 
                success: false, 
                message: `Moneda ${currency} nu este suportată de EuPlătesc.` 
            }, { status: 400 });
        }

        // Creează hash-ul conform implementării oficiale EuPlătesc
        const formattedAmount = totalAmount.toFixed(2);
        const timestamp = new Date().toISOString().replace(/[-:T]/g, '').substring(0, 14); // YYYYMMDDHHMMSS
        const nonce = crypto.randomBytes(16).toString('hex'); // 32 caractere hex

        const data: { [key: string]: string } = {
            "amount": formattedAmount,
            "curr": currency,
            "invoice_id": orderId,
            "order_desc": `Comanda florarie - ${body.customerInfo.name}`,
            "merch_id": merchantId,
            "timestamp": timestamp,
            "nonce": nonce,
        };

        const datakeys = Object.keys(data);
        
        let hmac = '';
        for (let i = 0; i < datakeys.length; i++) {
            if (data[datakeys[i]].length == 0) {
                hmac += '-';
            } else {
                hmac += data[datakeys[i]].length + data[datakeys[i]];
            }
        }

        // Convertește secret key din hex la buffer
        const binKey = Buffer.from(secretKey, "hex");
        const hash = crypto.createHmac("md5", binKey).update(hmac, 'utf8').digest('hex');
        data["fp_hash"] = hash;

        // Creează URL-ul pentru redirecționare conform implementării oficiale
        const esc = encodeURIComponent;
        const query = Object.keys(data).map(k => esc(k) + '=' + esc(data[k])).join('&');
        const redirectUrl = "https://secure.euplatesc.ro/tdsprocess/tranzactd.php?" + query;

        return NextResponse.json(redirectUrl, {
            headers: { 
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            },
        });
    } catch (error) {
        console.error('Eroare la inițializarea plății EuPlătesc:', {
            error: error instanceof Error ? error.message : 'Eroare necunoscută',
            stack: error instanceof Error ? error.stack : undefined,
            timestamp: new Date().toISOString()
        });
        
        return NextResponse.json({ 
            success: false, 
            message: 'A apărut o eroare la procesarea plății. Te rugăm să încerci din nou.' 
        }, { status: 500 });
    }
}