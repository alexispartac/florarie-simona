'use server';
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/components/lib/mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// GET /api/simple-products-categories - returnează toate produsele simple
export async function GET(req: NextRequest) {
    if (req.method !== 'GET') {
        return NextResponse.json({ success: false, message: 'Metoda HTTP nu este permisă.' }, { status: 405 });
    }

    try {
        const client = await clientPromise;
        const db = client.db('florarie');
        const categories = await db.collection('simple-products-categories').find({}, { projection: { _id: 0 } }).toArray();
        return NextResponse.json(categories, { status: 200 });
    } catch (error) {
        console.error('Eroare la obținerea categoriilor de produse simple:', error);
        return NextResponse.json({ success: false, message: 'A apărut o eroare la obținerea categoriilor de produse simple.' }, { status: 500 });
    }
}

// POST /api/simple-products-categories - adaugă o categorie de produs nou
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

        const result = await db.collection('simple-products-categories').insertOne(data);
        if (!result.acknowledged) {
            return NextResponse.json({ success: false, message: 'Failed to insert category' }, { status: 500 });
        }

        return NextResponse.json({ insertedId: result.insertedId }, { status: 200 });
    } catch (error) {
        console.error('Eroare la adăugarea categoriei de produs:', error);
        return NextResponse.json({ success: false, message: 'A apărut o eroare la adăugarea categoriei de produs.' }, { status: 500 });
    }
}

// DELETE /api/simple-products-categories - șterge o categorie de produs existentă
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

        const { name } = data;
        if (!name) {
            return NextResponse.json({ success: false, message: 'Category ID is required' }, { status: 400 });
        }

        const result = await db.collection('simple-products-categories').deleteOne({ name: name });
        if (!result.acknowledged) {
            return NextResponse.json({ success: false, message: 'Failed to delete category' }, { status: 500 });
        }

        return NextResponse.json({ deletedCount: result.deletedCount }, { status: 200 });
    } catch (error) {
        console.error('Eroare la ștergerea categoriei de produs:', error);
        return NextResponse.json({ success: false, message: 'A apărut o eroare la ștergerea categoriei de produs.' }, { status: 500 });
    }
}
