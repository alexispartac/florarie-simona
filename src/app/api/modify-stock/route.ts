'use server';
import { NextRequest, NextResponse } from 'next/server';
import { CartItem } from '@/app/types/cart';
import clientPromise from '@/app/components/lib/mongodb';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config(); 

const JWT_SECRET = process.env.JWT_SECRET;

// PUT /api/modify-stock - modifică stocul produselor
export async function PUT(req: NextRequest) {
    if (req.method !== 'PUT') {
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

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || typeof decoded === 'string') {
        return NextResponse.json({ success: false, message: 'Token invalid sau expirat' }, { status: 401 });
    }
    const payload = decoded as jwt.JwtPayload;
    if (!payload.email || !payload.password) {
        return NextResponse.json({ success: false, message: 'Token invalid' }, { status: 401 });
    }

    if (payload.email !== 'laurasimona97@yahoo.com' && payload.email !== 'emailsimona') {
        return NextResponse.json({ success: false, message: 'Nu aveți permisiunea de a accesa această resursă.' }, { status: 403 });
    }
    
    try {
        const client = await clientPromise;
        const db = client.db('florarie');
        const data = await req.json();
        const items: CartItem[] = data.items;
    
        if (!Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ success: false, message: 'Datele trimise nu sunt valide.' }, { status: 401 });
        }
        // Modifică stocul pentru fiecare produs
        for (const item of items) {
            const findItem = await db.collection('products-composed').findOne({ id: item.id });
            if (!findItem) {
                return NextResponse.json({ success: false, message: `Produsul cu ID ${item.id} nu a fost găsit.` }, { status: 404 });
            }

            for (const simpleItems of findItem.info_category[item.category].composition) {
                const compositionItem = {
                    id: simpleItems.id,
                    quantity: simpleItems.quantity,
                };

                // Găsește produsul în baza de date
                const product = await db.collection('products').findOne({ id: compositionItem.id });

                if (!product) {
                    return NextResponse.json({ success: false, message: `Produsul cu ID ${compositionItem.id} nu a fost găsit.` }, { status: 404 });
                }

                // Verifică dacă există suficient stoc
                const requiredQuantity = compositionItem.quantity * item.quantity; // Cantitatea necesară totală
                if (product.quantity < requiredQuantity) {
                    return NextResponse.json({
                        success: false,
                        message: `Cantitatea necesară pentru ${product.title} nu este disponibilă. Necesită ${requiredQuantity}, dar doar ${product.quantity} sunt disponibile.`,
                    }, { status: 400 });
                }

                // Actualizează stocul
                const newQuantity = product.quantity - requiredQuantity;
                const updateResult = await db.collection('products').updateOne(
                    { id: compositionItem.id },
                    { $set: { quantity: newQuantity } }
                );
                if (updateResult.modifiedCount === 0) {
                    return NextResponse.json({ success: false, message: `Nu s-a putut actualiza stocul pentru ${product.title}.` }, { status: 500 });
                }
                console.log(`Stocul pentru ${product.title} a fost actualizat. Cantitate nouă: ${newQuantity}`);
            }
        }

        // Returnează succes
        return NextResponse.json({ success: true, message: 'Stocul a fost modificat cu succes.' }, { status: 200 });
    } catch (error) {
        console.log('Eroare la modificarea stocului:', error);
        return NextResponse.json({ success: false, message: 'A apărut o eroare internă.' }, { status: 500 });
    }
}
