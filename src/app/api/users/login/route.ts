'use server';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import clientPromise from '@/app/components/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET;

// POST /api/users/login - interogheaza userul dupa email si parola
export async function POST(req: NextRequest) {
    if (req.method !== 'POST') {
        return NextResponse.json({ success: false, message: 'Metoda HTTP nu este permisă.' }, { status: 405 });
    }

    if (!JWT_SECRET) {
        return NextResponse.json({ success: false, message: 'Secretul JWT nu este definit.' }, { status: 500 });
    }

    try {
        const client = await clientPromise;
        const db = client.db('florarie');
        const data = await req.json();
        const { email, password } = data;

        if (!email || !password) {
            return NextResponse.json({ success: false, message: 'Email și parolă sunt necesare.' }, { status: 400 });
        }

        const user = await db.collection('users').findOne({ email, password });
        if (!user) {
            return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
        }

        // Generează JWT cu id, email și nume
        const token = jwt.sign(
            {
                email: email,
                password: password
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        const response = NextResponse.json({ success: true, message: 'Login successful', user }, { status: 200 });
        response.cookies.set('login', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 7 zile
        });

        return response;
    } catch (error) {
        console.error('Eroare la autentificare:', error);
        return NextResponse.json({ success: false, message: 'A apărut o eroare la autentificare.' }, { status: 500 });
    }
}



