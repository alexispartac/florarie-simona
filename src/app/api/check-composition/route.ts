'use server';
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/components/lib/mongodb';

// POST /api/check-composition - verifică cantitatea produselor componente
export async function POST(req: NextRequest) {
    const client = await clientPromise;
    const db = client.db('florarie');
    const data = await req.json();

    // Verifică dacă cererea conține compoziția și cantitatea totală
    const { composition, quantity } = data;
    if (!composition || !Array.isArray(composition) || typeof quantity !== 'number') {
        return NextResponse.json({ success: false, message: 'Datele trimise nu sunt valide.' }, { status: 400 });
    }

    try {
        // Verifică cantitatea pentru fiecare produs component
        const insufficientItems = [];

        for (const item of composition) {
            const product = await db.collection('products').findOne({ id: item.id });
            
            if (!product) {
                insufficientItems.push({ id: item.id, message: 'Produsul nu a fost găsit.' });
            } else {
                const requiredQuantity = item.quantity * quantity; // Cantitatea necesară totală
                if (product.quantity < requiredQuantity) {
                    insufficientItems.push({
                        id: item.id,
                        title: product.title,
                        required: requiredQuantity,
                        available: product.quantity, // Cantitatea disponibilă
                    });
                }
            }
        }
        // Dacă există produse cu cantitate insuficientă, returnează eroare
        if (insufficientItems.length > 0) {
            return NextResponse.json({
                success: false,
                message: 'Cantitatea necesară nu este disponibilă pentru unele produse.',
                insufficientItems,
            }, { status: 201 });
        }

        // Dacă toate produsele au cantitatea necesară, returnează succes
        return NextResponse.json({ success: true, message: 'Cantitatea este suficientă pentru toate produsele.' }, { status: 200 });
    } catch (error) {
        console.error('Eroare la verificarea cantității:', error);
        return NextResponse.json({ success: false, message: 'A apărut o eroare internă.' }, { status: 500 });
    }
}