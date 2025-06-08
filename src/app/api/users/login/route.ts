'use server';
import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const dbName = process.env.MONGODB_DB || 'florarie';
const JWT_SECRET = process.env.JWT_SECRET || 'secretul_tau_super_secret';

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

// POST /api/users/login - interogheaza userul dupa email si parola
export async function POST(req: NextRequest) {
    const db = await connectDB();
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
        JWT_SECRET,
        { expiresIn: '7d' }
    );

    return NextResponse.json({ user, token }, { status: 200 });
}



