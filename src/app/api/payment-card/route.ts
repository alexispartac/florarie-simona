import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-05-28.basil',
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Verifică dacă datele sunt valide
        if (!body.items || !Array.isArray(body.items)) {
            return NextResponse.json({ error: 'Datele trimise sunt invalide.' }, { status: 400 });
        }

        // Creează liniile de produse pentru sesiunea Stripe
        const lineItems = body.items.map((item: { title: string; price: number; quantity: number }) => ({
            price_data: {
                currency: 'ron',
                product_data: {
                    name: item.title,
                },
                unit_amount: Math.round(item.price * 100), // Stripe folosește valoarea în bani mici (ex. 100 = 1 RON)
            },
            quantity: item.quantity,
        }));

        // Creează sesiunea de checkout Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,  //?session_id={CHECKOUT_SESSION_ID}
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
        });

        return NextResponse.json({ sessionId: session.id }, { status: 200 });
    } catch (error) {
        console.error('Eroare la crearea sesiunii Stripe:', error);
        return NextResponse.json({ error: 'A apărut o eroare la procesarea plății.' }, { status: 500 });
    }
}