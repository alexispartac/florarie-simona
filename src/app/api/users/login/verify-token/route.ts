'use server';
import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';
import clientPromise from '@/app/components/lib/mongodb';

// POST /api/users/login/verify-token
export async function POST(req: NextRequest) {
    if (req.method !== 'POST') {
        return NextResponse.json({ success: false, message: 'Metoda HTTP nu este permisă.' }, { status: 405 });
    }

    try {
        const client = await clientPromise;
        const db = client.db('florarie');
        const usersCollection = db.collection('users');
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json({ success: false, message: 'Token lipsă' }, { status: 400 });
        }

        try {
            const decodedToken = jwtDecode<{ email: string, password: string }>(token);
            const { email, password } = decodedToken;
            const user = await usersCollection.findOne({ email, password });
            if (!user) {
                return NextResponse.json({ success: false, message: 'Utilizatorul nu există' }, { status: 404 });
            }

            return NextResponse.json({
                success: true,
                message: 'Token valid',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
            });

        } catch (error) {
            return NextResponse.json({ success: false, message: `Token invalid sau expirat: ${error}` }, { status: 401 });
        }
    } catch (error) {
        console.log('Eroare la verificarea token-ului:', error);
        return NextResponse.json({ success: false, message: 'Eroare internă a serverului' }, { status: 500 });
    }
}