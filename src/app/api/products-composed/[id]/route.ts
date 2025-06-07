import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { ObjectId } from 'mongodb';


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

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const db = await connectDB();
    const params = await context.params; 
    const id = params?.id;


    if (!id) {
        return NextResponse.json({ error: 'ID-ul produsului lipsește' }, { status: 400 });
    }

    try {
        const product = await db.collection('products-composed').findOne({ id: id });
        if (!product) {
            console.error("Product not found");
            return NextResponse.json({ error: 'Produsul nu a fost găsit' }, { status: 404 });
        }
        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json({ error: 'Eroare la preluarea produsului' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const db = await connectDB();
    const { id } = await params;
    const data = await req.json();

    try {
        const result = await db.collection('products-composed').updateOne(
            { _id: new ObjectId(id) },
            { $set: data }
        );
        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Produsul nu a fost găsit' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Produs actualizat cu succes' }, { status: 200 });
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json({ error: 'Eroare la actualizarea produsului' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const db = await connectDB();
    const { id } = await params;

    try {
        const result = await db.collection('products-composed').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Produsul nu a fost găsit' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Produs șters cu succes' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ error: 'Eroare la ștergerea produsului' }, { status: 500 });
    }
}