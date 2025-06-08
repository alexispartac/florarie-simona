'use server';
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/components/lib/mongodb';

// GET /api/products-composed-categories - returnează toate categoriile de produse compuse
export async function GET() {
    const client = await clientPromise;
    const db = client.db('florarie'); 
    const categories = await db.collection('products-composed-categories').find({}, { projection: { _id: 0 } }).toArray();
    return NextResponse.json(categories, { status: 200 });
}

// POST /api/products-composed-categories - adaugă o categorie de produs nou
export async function POST(req: NextRequest) {
    const client = await clientPromise;
    const db = client.db('florarie'); 
    const data = await req.json();

    const result = await db.collection('products-composed-categories').insertOne(data);
    if (!result.acknowledged) {
        return NextResponse.json({ error: 'Failed to insert category' }, { status: 500 });
    }

    return NextResponse.json({ insertedId: result.insertedId }, { status: 200 });
}

// DELETE /api/products-composed-categories - șterge o categorie de produs existentă
export async function DELETE(req: NextRequest) {
    const client = await clientPromise;
    const db = client.db('florarie'); 
    const data = await req.json();

    const { name } = data;
    if (!name) {
        return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    const result = await db.collection('products-composed-categories').deleteOne({ name: name });
    if (!result.acknowledged) {
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }

    return NextResponse.json({ deletedCount: result.deletedCount }, { status: 200 });
}

