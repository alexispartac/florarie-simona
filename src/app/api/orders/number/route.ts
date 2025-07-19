'use server';
import { NextRequest, NextResponse } from 'next/server';
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

    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload) {
        return NextResponse.json({ success: false, message: 'Token invalid sau expirat' }, { status: 401 });
    }

    try {
        const client = await clientPromise;
        const db = client.db('florarie');
        const orders = await db.collection('orders').find().toArray();
        const length = orders.length;
        return NextResponse.json(length, { status: 200 });
    } catch (error) {
        console.error('Eroare la obținerea comenzilor:', error);
        return NextResponse.json({ success: false, message: 'A apărut o eroare la obținerea comenzilor.' }, { status: 500 });
    }
}