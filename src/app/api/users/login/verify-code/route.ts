'use server';
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/components/lib/mongodb';

// POST /api/users/login/verify-code
export async function POST(req: NextRequest) {
    if (req.method !== 'POST') {
        return NextResponse.json({ success: false, message: 'Metoda HTTP nu este permisă.' }, { status: 405 });
    }

    try {
        const { email, code } = await req.json();

        if (!email || !code) {
            return NextResponse.json({ success: false, message: 'Email-ul și codul sunt obligatorii' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('florarie');
        const usersCollection = db.collection('users');

        // Verificăm dacă utilizatorul există și codul este valid
        const user = await usersCollection.findOne({ email });
        if (!user || user.resetCode !== code) {
            return NextResponse.json({ success: false, message: 'Cod invalid sau utilizator inexistent' }, { status: 400 });
        }

        // Verificăm dacă codul a expirat
        if (user.resetCodeExpires < Date.now()) {
            return NextResponse.json({ success: false, message: 'Codul a expirat' }, { status: 400 });
        }

        // Cod valid - putem continua cu resetarea parolei sau alte acțiuni
        return NextResponse.json({ success: true, message: 'Cod valid' });
    } catch (error) {
        console.log('Eroare la verificarea codului:', error);
        return NextResponse.json({ success: false, message: 'Eroare internă a serverului' }, { status: 500 });
    }
}