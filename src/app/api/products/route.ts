'use server';
import { NextRequest, NextResponse } from 'next/server';
import { SimpleProductProps } from '../types';
import clientPromise from '@/app/components/lib/mongodb';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// GET /api/products - returnează toate produsele
export async function GET(req: NextRequest) {
    if (req.method !== 'GET') {
        return NextResponse.json({ success: false, message: 'Metoda HTTP nu este permisă.' }, { status: 405 });
    }

    try {
        const client = await clientPromise;
        const db = client.db('florarie'); 
        const products = await db.collection('products').find().toArray();
        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        console.error('Eroare la obținerea produselor:', error);
        return NextResponse.json({ success: false, message: 'A apărut o eroare la obținerea produselor.' }, { status: 500 });
    }
}

// POST /api/products - adaugă un produs nou
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
        const data = await req.json();

        const post_data: SimpleProductProps = {
            ...data,
            quantity: data.quantity || 0,
            price: data.price || 0,
        }
        const result = await db.collection('products').insertOne(post_data);
        if (!result.acknowledged) {
            return NextResponse.json({ success: false, message: 'Failed to insert product' }, { status: 500 });
        }

        return NextResponse.json({ insertedId: result.insertedId }, { status: 200 });
    } catch (error) {
        console.error('Eroare la adăugarea produsului:', error);
        return NextResponse.json({ success: false, message: 'A apărut o eroare la adăugarea produsului.' }, { status: 500 });
    }
}

// PUT /api/products - actualizează un produs existent
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
        const data = await req.json();

        const { id, ...updateData } = data;
        // Găsește produsul după id-ul custom (nu după _id-ul Mongo)
        const product = await db.collection('products').findOne({ id: id });

        if (!product) {
            return NextResponse.json({ success: false, message: 'Produsul nu a fost găsit' }, { status: 404 });
        }

        // Elimină câmpul _id din updateData dacă există (altfel MongoDB va încerca să-l modifice și va da eroare)
        if ('_id' in updateData) {
            delete updateData._id;
        }

        const result = await db.collection('products').updateOne(
            { _id: product._id },
            { $set: updateData }
        );
        if (!result.acknowledged) {
            return NextResponse.json({ success: false, message: 'Failed to update product' }, { status: 500 });
        }

        return NextResponse.json({ modifiedCount: result.modifiedCount }, { status: 200 });
    } catch (error) {
        console.error('Eroare la actualizarea produsului:', error);
        return NextResponse.json({ success: false, message: 'A apărut o eroare la actualizarea produsului.' }, { status: 500 });
    }

}

// DELETE /api/products - șterge un produs existent dupa id din cerere
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
        const data = await req.json();

        const { id } = data;
        if (!id) {
            return NextResponse.json({ success: false, message: 'Product ID is required' }, { status: 400 });
        }

        const result = await db.collection('products').deleteOne({ id: id });
        if (!result.acknowledged) {
            return NextResponse.json({ success: false, message: 'Failed to delete product' }, { status: 500 });
        }

        return NextResponse.json({ deletedCount: result.deletedCount }, { status: 200 });
    } catch (error) {
        console.error('Eroare la ștergerea produsului:', error);
        return NextResponse.json({ success: false, message: 'A apărut o eroare la ștergerea produsului.' }, { status: 500 });
    }
}
