'use server';
import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const dbName = process.env.MONGODB_DB || 'florarie';

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

async function connectDB() {
    if (!clientPromise) {
        client = new MongoClient(uri);
        clientPromise = client.connect();
    }
    await clientPromise;
    return client!.db(dbName);
}

// POST /api/users/login/verify-code
export async function POST(req: NextRequest) {
    try {
        const { email, code } = await req.json();

        if (!email || !code) {
            return NextResponse.json({ error: 'Email-ul și codul sunt obligatorii' }, { status: 400 });
        }

        const db = await connectDB();
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
        console.error('Eroare la verificarea codului:', error);
        return NextResponse.json({ error: 'Eroare internă a serverului' }, { status: 500 });
    }
}