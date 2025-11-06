'use server';
import { NextRequest, NextResponse } from 'next/server';
import { OrderProps } from '@/app/types/order';
import clientPromise from '@/app/components/lib/mongodb';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// GET /api/users/orders - returnează comenzile unui utilizator
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

    try {
        const client = await clientPromise;
        const db = client.db('florarie');
        const orders = await db.collection<OrderProps>('orders').find({ clientEmail: payload.email }).toArray();
        
        return NextResponse.json(orders, { status: 200 });
    } catch (error) {
        console.error('Eroare la obținerea comenzilor utilizatorului:', error);
        return NextResponse.json({ success: false, message: 'A apărut o eroare la obținerea comenzilor.' }, { status: 500 });
    }
}