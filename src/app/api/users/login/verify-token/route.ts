'use server';
import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { jwtDecode } from 'jwt-decode';

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const dbName = process.env.MONGODB_DB || 'florarie';

// Singleton pattern pentru MongoClient
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

// POST /api/users/login/verify-token
export async function POST(req: NextRequest) {
    try {
        const db = await connectDB();
        const usersCollection = db.collection('users');
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json({ error: 'Token lipsă' }, { status: 400 });
        }

        try {
            const decodedToken = jwtDecode<{ email: string, password: string }>(token);
            const { email, password } = decodedToken;
            const user = await usersCollection.findOne({ email, password });
            if (!user) {
                return NextResponse.json({ error: 'Utilizatorul nu există' }, { status: 404 });
            }

            return NextResponse.json({
                message: 'Token valid',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
            });

        } catch (error) {
            return NextResponse.json({ error: `Token invalid sau expirat: ${error}` }, { status: 401 });
        }
    } catch (error) {
        console.error('Eroare la verificarea token-ului:', error);
        return NextResponse.json({ error: 'Eroare internă a serverului' }, { status: 500 });
    }
}