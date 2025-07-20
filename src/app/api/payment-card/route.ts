'use server';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: NextRequest) {
    if (req.method !== 'POST') {
        return NextResponse.json({ success: false, message: 'Metoda HTTP nu este permisă.' }, { status: 405 });
    }

    if (!JWT_SECRET) {
        return NextResponse.json({ success: false, message: 'Secretul JWT nu este definit.' }, { status: 500 });
    }

    const cookie = req.cookies.get('login');
    const token = cookie ? cookie.value : null;

    if (!token) {
        return NextResponse.json({ success: false, message: 'Token lipsă' }, { status: 400 });
    }

    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload) {
        return NextResponse.json({ success: false, message: 'Token invalid sau expirat' }, { status: 401 });
    }

    try {
        const body = await req.json();

        // Verifică dacă datele sunt valide
        if (!body.items || !Array.isArray(body.items)) {
            return NextResponse.json({ success: false, message: 'Datele trimise sunt invalide.' }, { status: 400 });
        }

        // Calculează totalul comenzii
        const totalAmount = body.items.reduce((total: number, item: { price: number; quantity: number }) => {
            return total + item.price * item.quantity;
        }, 0);

        // Detalii pentru integrarea EuPlătesc
        const merchantId = process.env.EUPLATESC_MERCHANT_ID || ''; // ID-ul comerciantului
        const secretKey = process.env.EUPLATESC_SECRET_KEY || ''; // Cheia secretă
        const orderId = `order_${Date.now()}`; // ID unic pentru comandă
        const currency = 'RON'; // Moneda
        const returnUrl = `${process.env.BASE_URL}/checkout/success`; // URL-ul de succes
        const cancelUrl = `${process.env.BASE_URL}/checkout/cancel`; // URL-ul de anulare

        // Creează semnătura (hash-ul) pentru securitate
        const hashString = `${merchantId}${orderId}${totalAmount}${currency}${returnUrl}${cancelUrl}`;
        const hash = crypto.createHmac('md5', secretKey).update(hashString).digest('hex');

        // Creează formularul pentru redirecționare către EuPlătesc
        const formHtml = `
            <form id="euplatesc-form" action="https://secure.euplatesc.ro/tdsprocess/tranzactd.php" method="POST">
                <input type="hidden" name="MERCHANT" value="${merchantId}" />
                <input type="hidden" name="ORDER_REF" value="${orderId}" />
                <input type="hidden" name="ORDER_AMOUNT" value="${totalAmount.toFixed(2)}" />
                <input type="hidden" name="CURRENCY" value="${currency}" />
                <input type="hidden" name="RETURN_URL" value="${returnUrl}" />
                <input type="hidden" name="CANCEL_URL" value="${cancelUrl}" />
                <input type="hidden" name="ORDER_HASH" value="${hash}" />
                <button type="submit">Redirect către EuPlătesc</button>
            </form>
            <script>document.getElementById('euplatesc-form').submit();</script>
        `;

        return new NextResponse(formHtml, {
            headers: { 'Content-Type': 'text/html' },
        });
    } catch (error) {
        console.error('Eroare la inițializarea plății EuPlătesc:', error);
        return NextResponse.json({ success: false, message: 'A apărut o eroare la procesarea plății.' }, { status: 500 });
    }
}