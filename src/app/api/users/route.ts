'use server';
import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { User } from '../types';

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

// GET /api/users - returnează toți userii
export async function GET() {
    const db = await connectDB();
    const users = await db.collection('users').find().toArray();
    return NextResponse.json(users);
}

// POST /api/users - adaugă un user nou și returnează un JWT
export async function POST(req: NextRequest) {
    const db = await connectDB();
    const data = await req.json();

    // Verifică dacă există deja un user cu același email
    const existingUser = await db.collection('users').findOne({ email: data.email });
    if (existingUser) {
        return NextResponse.json({ error: 'Există deja un cont cu acest email.' }, { status: 409 });
    }

    const post_data: User = {
        ...data,
        phone: data.phone || '',
        address: data.address || '',
        order: data.order || 0,
        createdAt: new Date(),
    }
    const result = await db.collection('users').insertOne(post_data);
    if (!result.acknowledged) {
        return NextResponse.json({ error: 'Failed to insert user' }, { status: 500 });
    }

    return NextResponse.json({ insertedId: result.insertedId }, { status: 200 });
}

// PUT /api/users - actualizează un user existent
export async function PUT(req: NextRequest) {
    const db = await connectDB();
    const data = await req.json();

    const { id, ...updateData } = data;

    const result = await db.collection('users').updateOne({ _id: id }, { $set: updateData });
    if (!result.acknowledged) {
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }

    return NextResponse.json({ modifiedCount: result.modifiedCount }, { status: 200 });
}

// DELETE /api/users - șterge un user
export async function DELETE(req: NextRequest) {
    const db = await connectDB();
    const data = await req.json();

    const { id } = data;

    const result = await db.collection('users').deleteOne({ _id: id });
    if (!result.acknowledged) {
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }

    return NextResponse.json({ deletedCount: result.deletedCount }, { status: 200 });
}




