'use server';
import { NextRequest, NextResponse } from 'next/server';
import { OrderProps } from '../types';
import clientPromise from '@/app/components/lib/mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// GET /api/orders - returnează toate comenzile
export async function GET(req: NextRequest) {
    if (req.method !== 'GET') {
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

    if (payload.email !== 'matei.partac45@gmail.com' && payload.email !== 'emailsimona') {
        return NextResponse.json({ success: false, message: 'Nu aveți permisiunea de a accesa această resursă.' }, { status: 403 });
    }

    try {
        const client = await clientPromise;
        const db = client.db('florarie');
        const orders = await db.collection('orders').find().toArray();
        return NextResponse.json(orders, { status: 200 });
    } catch (error) {
        console.error('Eroare la obținerea comenzilor:', error);
        return NextResponse.json({ success: false, message: 'A apărut o eroare la obținerea comenzilor.' }, { status: 500 });
    }
}

// POST /api/orders - adaugă o comandă nouă
export async function POST(req: NextRequest) {
    if( req.method !== 'POST') {
        return NextResponse.json({ success: false, message: 'Metoda HTTP nu este permisă.' }, { status: 405 });
    }

    if (!JWT_SECRET) {
        return NextResponse.json({ success: false, message: 'Secretul JWT nu este definit.' }, { status: 500 });
    }

    try {

        const client = await clientPromise;
        const db = client.db('florarie');
        const data: OrderProps = await req.json();
        const cookie = req.cookies.get('login');
        const token = cookie ? cookie.value : null;

        if (!token) {
            return NextResponse.json({ success: false, message: 'Token lipsă' }, { status: 400 });
        }

        const payload = jwt.verify(token, JWT_SECRET);
        if (!payload) {
            return NextResponse.json({ success: false, message: 'Token invalid sau expirat' }, { status: 401 });
        }
        
        // Verifică dacă toate câmpurile necesare sunt prezente
        if (!data.id || !data.clientName || !data.clientEmail || !data.clientPhone || !data.clientAddress || !data.orderDate || !data.status || !data.totalPrice || !data.products) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
        }

        // Verifică dacă email-ul clientului este valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.clientEmail)) {
            return NextResponse.json({ success: false, message: 'Invalid email format' }, { status: 400 });
        }
        // Verifică dacă prețul total este un număr valid
        if (typeof data.totalPrice !== 'number' || data.totalPrice <= 0) {
            return NextResponse.json({ success: false, message: 'Invalid total price' }, { status: 400 });
        }

        // Verifică dacă produsele sunt valide
        if (!Array.isArray(data.products) || data.products.length === 0) {
            return NextResponse.json({ success: false, message: 'Invalid products array' }, { status: 400 });
        }

        // Verifică dacă fiecare produs are toate câmpurile necesare
        for (const product of data.products) {
            if (!product.id || !product.title || typeof product.price !== 'number' || !product.category || typeof product.quantity !== 'number') {
                return NextResponse.json({ success: false, message: 'Invalid product data' }, { status: 400 });
            }
        }

        const result = await db.collection('orders').insertOne(data);
        if (!result.acknowledged) {
            return NextResponse.json({ success: false, message: 'Failed to insert order' }, { status: 500 });
        }

        return NextResponse.json({ success: true, insertedId: result.insertedId }, { status: 200 });
    } catch (error) {
        console.log('Eroare la adăugarea comenzii:', error);
        return NextResponse.json({ success: false, message: 'Eroare internă a serverului' }, { status: 500 });
    }
}

// PUT /api/orders - finalizeaza o comandă existentă
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

    if (payload.email !== 'matei.partac45@gmail.com' && payload.email !== 'emailsimona') {
        return NextResponse.json({ success: false, message: 'Nu aveți permisiunea de a accesa această resursă.' }, { status: 403 });
    }

    try {
        const client = await clientPromise;
        const db = client.db('florarie');
        const { id, status } = await req.json();

        // Verifică dacă id-ul și status-ul sunt furnizate
        if (!id || !status) {
            return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
        }

        // Verifică dacă status-ul este valid
        const validStatuses = ['Pending', 'Processing', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        // Găsește comanda după id-ul custom (nu după _id-ul Mongo)
        const order = await db.collection('orders').findOne({ id: id });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        const result = await db.collection('orders').updateOne(
            { _id: order._id },
            { $set: { status: status, deliveryDate: new Date().toISOString() } }
        );

        if (!result.acknowledged) {
            return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
        }

        return NextResponse.json({ modifiedCount: result.modifiedCount }, { status: 200 });
    } catch (error) {
        console.log('Eroare la actualizarea comenzii:', error);
        return NextResponse.json({ error: 'Eroare internă a serverului' }, { status: 500 });
    }
}


// DELETE /api/orders - șterge o comandă existentă
export async function DELETE(req: NextRequest) {
    if (req.method !== 'DELETE') {
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
        const client = await clientPromise;
        const db = client.db('florarie');
        const { id } = await req.json();

        // Găsește comanda după id-ul custom (nu după _id-ul Mongo)
        const order = await db.collection('orders').findOne({ id: id });

        if (!order) {
            return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
        }

        const result = await db.collection('orders').deleteOne({ _id: order._id });
        if (!result.acknowledged) {
            return NextResponse.json({ success: false, message: 'Failed to delete order' }, { status: 500 });
        }

        return NextResponse.json({ success: false, deletedCount: result.deletedCount }, { status: 200 });
    } catch (error) {
        console.log('Eroare la ștergerea comenzii:', error);
        return NextResponse.json({ success: false, message: 'Eroare internă a serverului' }, { status: 500 });
    }
}


