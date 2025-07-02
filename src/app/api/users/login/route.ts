'use server';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import clientPromise from '@/app/components/lib/mongodb';

const NEXT_PUBLIC_JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'secretul_tau_super_secret';

// POST /api/users/login - interogheaza userul dupa email si parola
export async function POST(req: NextRequest) {
    const client = await clientPromise;
    const db = client.db('florarie');
    const data = await req.json();
    const { email, password } = data;

    const user = await db.collection('users').findOne({ email, password });
    if (!user) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Generează JWT cu id, email și nume
    const token = jwt.sign(
        {
            email: email,
            password: password
        },
        NEXT_PUBLIC_JWT_SECRET,
        { expiresIn: '7d' }
    );

    return NextResponse.json({ user, token }, { status: 200 });
}



