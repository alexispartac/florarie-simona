'use server';
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/components/lib/mongodb';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// GET /api/products-composed-categories - returnează toate categoriile de produse compuse
export async function GET(req: NextRequest) {
    if (req.method !== 'GET') {
        return NextResponse.json({ success: false, message: 'Metoda HTTP nu este permisă.' }, { status: 405 });
    }

    try {
        const client = await clientPromise;
        const db = client.db('florarie'); 
        const categories = await db.collection('products-composed-categories').find({}, { projection: { _id: 0 } }).toArray();
        return NextResponse.json(categories, { status: 200 });
    } catch (error) {
        console.error('Eroare la obținerea categoriilor de produse compuse:', error);
        return NextResponse.json({ success: false, message: 'A apărut o eroare la obținerea categoriilor de produse compuse.' }, { status: 500 });
    }
}

// POST /api/products-composed-categories - adaugă o categorie de produs nou
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

        const result = await db.collection('products-composed-categories').insertOne(data);
        if (!result.acknowledged) {
            return NextResponse.json({ success: false, message: 'Failed to insert category' }, { status: 500 });
        }

        return NextResponse.json({ insertedId: result.insertedId }, { status: 200 });
    } catch (error) {
        console.error('Eroare la adăugarea categoriei de produs compus:', error);
        return NextResponse.json({ success: false, message: 'A apărut o eroare la adăugarea categoriei de produs compus.' }, { status: 500 });
    }
}

// DELETE /api/products-composed-categories - șterge o categorie de produs existentă
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

        const result = await db.collection('products-composed-categories').deleteOne({ name: name });
        if (!result.acknowledged) {
            return NextResponse.json({ success: false, message: 'Failed to delete category' }, { status: 500 });
        }

        return NextResponse.json({ deletedCount: result.deletedCount }, { status: 200 });
    } catch (error) {
        console.error('Eroare la ștergerea categoriei de produs compus:', error);
        return NextResponse.json({ success: false, message: 'A apărut o eroare la ștergerea categoriei de produs compus.' }, { status: 500 });
    }
}

