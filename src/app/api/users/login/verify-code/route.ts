'use server';
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/components/lib/mongodb';

// POST /api/users/login/verify-code
export async function POST(req: NextRequest) {
    try {
        const { email, code } = await req.json();

        if (!email || !code) {
            return NextResponse.json({ error: 'Email-ul și codul sunt obligatorii' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('florarie');
        const usersCollection = db.collection('users');

        // Verificăm dacă utilizatorul există și codul este valid
        const user = await usersCollection.findOne({ email });
        if (!user || user.resetCode !== code) {
            return NextResponse.json({ error: 'Cod invalid sau utilizator inexistent' }, { status: 400 });
        }

        // Verificăm dacă codul a expirat
        if (user.resetCodeExpires < Date.now()) {
            return NextResponse.json({ error: 'Codul a expirat' }, { status: 400 });
        }

        // Cod valid - putem continua cu resetarea parolei sau alte acțiuni
        return NextResponse.json({ message: 'Cod valid' });
    } catch (error) {
        console.log('Eroare la verificarea codului:', error);
        return NextResponse.json({ error: 'Eroare internă a serverului' }, { status: 500 });
    }
}