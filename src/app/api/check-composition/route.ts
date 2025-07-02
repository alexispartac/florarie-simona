'use server';
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/components/lib/mongodb';
import { CartItem } from '@/app/cart/types';
import { SimpleProductProps } from '../types';

// POST /api/check-composition - verifică cantitatea produselor componente
export async function POST(req: NextRequest) {
    console.log(process.env.STRIPE_PUBLISHABLE_KEY);
    const client = await clientPromise;
    const db = client.db('florarie');
    const items: CartItem[] = await req.json();
    const totalQuantitiesForEveryProductsOfComposition: { id: string; quantity: number }[] = [];

    for (const item of items) {
        const productQuantity = item.quantity;
        const composition = item.composition;

        if (!composition || !productQuantity) {
            return NextResponse.json({ success: false, message: 'Datele trimise nu sunt valide.' }, { status: 400 });
        }

        for (const component of composition) {
            const componentQuantity = component.quantity;
            const componentId = component.id;
            const isInTotalQuantitiesForEveryProductsOfComposition = totalQuantitiesForEveryProductsOfComposition.find(p => p.id === componentId);
            let product: SimpleProductProps;

            if (!isInTotalQuantitiesForEveryProductsOfComposition) {
                // Caută produsul în baza de date
                product = await db.collection('products').findOne({ id: componentId }) as unknown as SimpleProductProps;

                if (!product) {
                    return NextResponse.json({ success: false, message: `Produsul nu mai este valabil pe site!` }, { status: 401 });
                }
                // adauga la totalQuantitiesForEveryProductsOfComposition
                const existingProduct = totalQuantitiesForEveryProductsOfComposition.find(p => p.id === componentId);
                if (existingProduct) {
                    existingProduct.quantity += productQuantity * componentQuantity;
                } else {
                    totalQuantitiesForEveryProductsOfComposition.push({
                        id: componentId,
                        quantity: productQuantity * componentQuantity
                    });
                }
            }
        }
    }
    // Verifică dacă există suficiente produse în stoc pentru fiecare componentă
    try {
        for (const product of totalQuantitiesForEveryProductsOfComposition) {
            const dbProduct = await db.collection('products').findOne({ id: product.id }) as unknown as SimpleProductProps;
            if (!dbProduct || dbProduct.quantity < product.quantity) {
                return NextResponse.json({ success: false, message: `Stoc insuficient pentru produsul ${dbProduct?.title || 'necunoscut'}.` }, { status: 403 });
            }
        }

        return NextResponse.json({ success: true, message: 'Produsul a fost adaugat cu succes in cos!' }, { status: 200 });
    } catch (error) {
        console.error('Eroare la verificarea stocului:', error);
        return NextResponse.json({ success: false, message: 'A apărut o eroare la verificarea stocului.' }, { status: 500 });
    }

}