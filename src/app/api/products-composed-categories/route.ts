'use server';
import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
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

// GET /api/products-composed-categories - returnează toate categoriile de produse compuse
export async function GET() {
    const db = await connectDB();
    const categories = await db.collection('products-composed-categories').find({}, { projection: { _id: 0 } }).toArray();
    return NextResponse.json(categories, { status: 200 });
}

// POST /api/products-composed-categories - adaugă o categorie de produs nou
export async function POST(req: NextRequest) {
    const db = await connectDB();
    const data = await req.json();

    const result = await db.collection('products-composed-categories').insertOne(data);
    if (!result.acknowledged) {
        return NextResponse.json({ error: 'Failed to insert category' }, { status: 500 });
    }

    return NextResponse.json({ insertedId: result.insertedId }, { status: 200 });
}

// DELETE /api/products-composed-categories - șterge o categorie de produs existentă
export async function DELETE(req: NextRequest) {
    const db = await connectDB();
    const data = await req.json();

    const { id } = data;
    console.log('Deleting category with ID:', id);
    if (!id) {
        return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    const result = await db.collection('products-composed-categories').deleteOne({ id: id });
    if (!result.acknowledged) {
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }

    return NextResponse.json({ deletedCount: result.deletedCount }, { status: 200 });
}

